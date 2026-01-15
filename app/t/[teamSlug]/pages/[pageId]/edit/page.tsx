"use client";

import React, { useEffect, useMemo } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import FunnelBuilderApp from "@/src/features/funnel-builder-v3/FunnelBuilderApp";
import { useFunnelEditorStore } from "@/src/features/funnel-builder-v3/store/store";
import { useCurrentTeam } from "@/app/t/[teamSlug]/hooks";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useDebounce } from "@/hooks/use-debounce";

export default function PageEditorPage() {
  const params = useParams();
  const team = useCurrentTeam();
  const pageId = params.pageId as string;

  const page = useQuery(api.pages.getPageById, { pageId: pageId as Id<"pages"> });
  const funnelStep = useQuery(api.funnelSteps.getStepByPageId, pageId ? { pageId: pageId as Id<"pages"> } : "skip");
  const funnelSteps = useQuery(api.funnelSteps.listStepsByFunnel, funnelStep ? { funnelId: funnelStep.funnelId } : "skip");

  // Batch fetch all pages for step warnings (e.g., missing checkout block)
  const stepPageIds = useMemo(() => {
    if (!funnelSteps) return null;
    const ids = funnelSteps.map((s: any) => s.pageId).filter(Boolean);
    return ids.length ? (ids as Id<"pages">[]) : [];
  }, [funnelSteps]);
  const stepPages = useQuery(api.pages.getPagesByIds, stepPageIds === null ? "skip" : { pageIds: stepPageIds });

  const updatePageTree = useMutation(api.pages.updatePageTree);
  const tree = useFunnelEditorStore((s) => s.tree);
  const setPageId = useFunnelEditorStore((s) => s.setPageId);
  const importJson = useFunnelEditorStore((s) => s.importJson);
  const debouncedTree = useDebounce(tree, 1000);

  // Load page into editor
  useEffect(() => {
    if (!page?.tree) return;
    setPageId(pageId);
    importJson(page.tree);
  }, [page?.tree, pageId, setPageId, importJson]);

  // Auto-save page (debounced)
  useEffect(() => {
    if (!pageId) return;
    if (!debouncedTree) return;
    const treeJson = JSON.stringify({ version: 2, tree: debouncedTree });
    updatePageTree({ pageId: pageId as Id<"pages">, tree: treeJson }).catch(console.error);
  }, [debouncedTree, pageId, updatePageTree]);

  const pageTreesById = useMemo(() => {
    const map: Record<string, string> = {};
    for (const p of stepPages ?? []) {
      if (p?._id && typeof p.tree === "string") map[p._id] = p.tree;
    }
    return map;
  }, [stepPages]);

  const stepContext = useMemo(() => {
    if (!team || !funnelStep || !funnelSteps) return null;
    return {
      teamSlug: team.slug,
      orgId: team._id,
      funnelId: funnelStep.funnelId,
      currentStepId: funnelStep._id,
      steps: funnelSteps.map((s: any) => ({
        _id: s._id,
        funnelId: s.funnelId,
        orgId: s.orgId,
        pageId: s.pageId,
        type: s.type,
        name: s.name,
        nextStepId: s.nextStepId ?? null,
        config: s.config ?? null,
      })),
      pageTreesById,
    };
  }, [team, funnelStep, funnelSteps, pageTreesById]);

  if (!team || !page) {
    return (
      <div className="fixed inset-0 flex items-center justify-center">
        <div className="text-center">
          <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-b-2 border-gray-900" />
          <p className="text-sm text-muted-foreground">Loading page...</p>
        </div>
      </div>
    );
  }

  const backHref = funnelStep ? `/t/${team.slug}/funnels/${funnelStep.funnelId}` : `/t/${team.slug}/pages`;

  return (
    <div className="fixed inset-0 z-50 bg-background">
      <Button variant="ghost" size="sm" className="absolute left-4 top-4 z-[200]" asChild>
        <Link href={backHref}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          {funnelStep ? "Back to Funnel" : "Back to Pages"}
        </Link>
      </Button>

      <FunnelBuilderApp teamSlug={team.slug} teamName={team.name} autoInitDemo={false} stepContext={stepContext} />
    </div>
  );
}

"use client";

import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useEffect, useState } from "react";
import { CheckoutBlock } from "@/src/features/funnels/components/CheckoutBlock";
import { OfferBlock } from "@/src/features/funnels/components/OfferBlock";

export default function FunnelRuntimePage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const handle = params.handle as string;
  
  const [runId, setRunId] = useState<string>("");
  const [currentStepId, setCurrentStepId] = useState<string | null>(null);
  
  const funnel = useQuery(api.funnels.getFunnelByHandle, { handle });
  const steps = useQuery(
    api.funnelSteps.listStepsByFunnel,
    funnel ? { funnelId: funnel._id } : "skip"
  );
  
  const currentStep = steps?.find((s: any) => s._id === currentStepId);
  const page = currentStep?.page;

  const getOrCreateRunMutation = useMutation(api.funnelRuns.getOrCreateRun);
  const advanceStepMutation = useMutation(api.funnelRuns.advanceStep);

  // Initialize run
  useEffect(() => {
    if (!funnel || !steps || steps.length === 0) return;
    
    const existingRunId = searchParams.get("runId");
    if (existingRunId) {
      setRunId(existingRunId);
      const stepId = searchParams.get("stepId");
      if (stepId) {
        setCurrentStepId(stepId);
      }
    } else {
      // Create new run
      const newRunId = `run_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      setRunId(newRunId);
      
      // Start at entry step or first step
      const entryStep = funnel.entryStepId 
        ? steps.find((s: any) => s._id === funnel.entryStepId)
        : steps[0];
      
      if (entryStep) {
        // Persist run to DB
        getOrCreateRunMutation({
          orgId: funnel.orgId,
          funnelId: funnel._id,
          runId: newRunId,
          initialStepId: entryStep._id,
        }).catch(console.error);
        
        setCurrentStepId(entryStep._id);
        router.replace(`/f/${handle}?runId=${newRunId}&stepId=${entryStep._id}`);
      }
    }
  }, [funnel, steps, searchParams, handle, router, getOrCreateRunMutation]);

  const navigateToStep = async (stepId: string) => {
    if (!funnel || !runId) return;
    
    try {
      // Persist step change to DB
      await advanceStepMutation({
        funnelId: funnel._id,
        runId,
        nextStepId: stepId as Id<"funnelSteps">,
      });
      
      setCurrentStepId(stepId);
      router.push(`/f/${handle}?runId=${runId}&stepId=${stepId}`);
    } catch (error) {
      console.error("Failed to navigate to step:", error);
    }
  };

  if (!funnel) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Funnel Not Found</h1>
          <p className="text-muted-foreground">The funnel "{handle}" does not exist.</p>
        </div>
      </div>
    );
  }

  if (!currentStep || !page) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  // Parse page tree
  let tree;
  try {
    const parsed = JSON.parse(page.tree);
    tree = parsed.version === 2 ? parsed.tree : parsed;
  } catch {
    tree = { pageRootIds: [], nodes: {}, popups: {} };
  }

  // Parse step config
  let config = null;
  if (currentStep.config) {
    try {
      config = JSON.parse(currentStep.config);
    } catch {
      config = null;
    }
  }

  const runtimeContext = {
    funnelId: funnel._id,
    stepId: currentStep._id,
    stepType: currentStep.type,
    config,
    runId,
    navigateToStep,
    orgId: funnel.orgId,
  };

  return (
    <div className="min-h-screen">
      <FunnelPageRenderer 
        tree={tree} 
        runtimeContext={runtimeContext}
      />
    </div>
  );
}

function FunnelPageRenderer({ tree, runtimeContext }: any) {
  const { pageRootIds, nodes } = tree;

  return (
    <div className="funnel-page">
      {pageRootIds.map((rootId: string) => (
        <NodeRenderer 
          key={rootId} 
          nodeId={rootId} 
          nodes={nodes}
          runtimeContext={runtimeContext}
        />
      ))}
    </div>
  );
}

function NodeRenderer({ nodeId, nodes, runtimeContext }: any) {
  const node = nodes[nodeId];
  if (!node) return null;

  // Section
  if (node.type === "section") {
    return (
      <section className="funnel-section" style={{ 
        background: node.props?.background || "transparent",
        padding: `${node.props?.paddingY || 0}px ${node.props?.paddingX || 0}px`,
      }}>
        <div style={{ maxWidth: node.props?.maxWidth || 1200, margin: "0 auto" }}>
          {(node.children ?? (node as any).childIds ?? (node as any).childrenIds ?? []).map((childId: string) => (
            <NodeRenderer 
              key={childId} 
              nodeId={childId} 
              nodes={nodes}
              runtimeContext={runtimeContext}
            />
          ))}
        </div>
      </section>
    );
  }

  // Row
  if (node.type === "row") {
    return (
      <div className="funnel-row" style={{ 
        display: "flex",
        gap: node.props?.gapX || 16,
        background: node.props?.background || "transparent",
      }}>
        {(node.children ?? (node as any).childIds ?? (node as any).childrenIds ?? []).map((childId: string) => (
          <NodeRenderer 
            key={childId} 
            nodeId={childId} 
            nodes={nodes}
            runtimeContext={runtimeContext}
          />
        ))}
      </div>
    );
  }

  // Column
  if (node.type === "column") {
    return (
      <div className="funnel-column" style={{ 
        flex: node.props?.widthPct || 100,
        background: node.props?.background || "transparent",
      }}>
        {(node.children ?? (node as any).childIds ?? (node as any).childrenIds ?? []).map((childId: string) => (
          <NodeRenderer 
            key={childId} 
            nodeId={childId} 
            nodes={nodes}
            runtimeContext={runtimeContext}
          />
        ))}
      </div>
    );
  }

  // Element
  if (node.type === "element") {
    const kind = node.props?.kind;
    
    if (kind === "funnel.checkout") {
      return <CheckoutBlock runtimeContext={runtimeContext} orgId={runtimeContext.orgId} />;
    }
    
    if (kind === "funnel.offer") {
      return <OfferBlock runtimeContext={runtimeContext} />;
    }
    
    // Other element types (heading, paragraph, etc.)
    return <div className="funnel-element">[{kind} element]</div>;
  }

  return null;
}

// CheckoutBlock and OfferBlock components are now imported from separate files

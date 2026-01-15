"use client";

import FunnelBuilderApp from "@/src/features/funnel-builder-v3/FunnelBuilderApp";
import { useCurrentTeam } from "@/app/t/[teamSlug]/hooks";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";

export default function FunnelBuilderV3Page() {
  const team = useCurrentTeam();
  const { teamSlug } = useParams();

  if (team == null) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 bg-background">
      <Button
        variant="ghost"
        size="sm"
        className="absolute top-4 left-4 z-[200]"
        asChild
      >
        <Link href={`/t/${teamSlug}`}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Dashboard
        </Link>
      </Button>
      <FunnelBuilderApp teamSlug={team.slug} teamName={team.name} />
    </div>
  );
}

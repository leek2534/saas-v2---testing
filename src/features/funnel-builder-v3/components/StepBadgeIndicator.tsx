"use client";

import { CheckCircle2, XCircle, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import type { StepReadiness } from "../types/payments";

interface StepBadgeIndicatorProps {
  stepReadiness: StepReadiness | null;
  className?: string;
}

export function StepBadgeIndicator({ stepReadiness, className }: StepBadgeIndicatorProps) {
  if (!stepReadiness) {
    return (
      <div className={cn("h-5 w-5 rounded-full bg-gray-200", className)} />
    );
  }

  const blockers = stepReadiness.issues.filter(i => i.severity === "blocker");
  const warnings = stepReadiness.issues.filter(i => i.severity === "warning");
  const totalIssues = blockers.length + warnings.length;

  if (totalIssues === 0) {
    return (
      <div className={cn("relative", className)}>
        <CheckCircle2 className="h-5 w-5 text-green-600" />
      </div>
    );
  }

  return (
    <div className={cn("relative", className)}>
      {blockers.length > 0 ? (
        <XCircle className="h-5 w-5 text-red-600" />
      ) : (
        <AlertCircle className="h-5 w-5 text-yellow-600" />
      )}
      <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[10px] font-bold rounded-full h-4 w-4 flex items-center justify-center">
        {totalIssues}
      </span>
    </div>
  );
}

interface StepBadgesProps {
  stepReadiness: StepReadiness | null;
  className?: string;
}

export function StepBadges({ stepReadiness, className }: StepBadgesProps) {
  if (!stepReadiness) {
    return null;
  }

  const badges = stepReadiness.badges;

  return (
    <div className={cn("flex items-center gap-1 flex-wrap", className)}>
      {badges.mode && (
        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
          {badges.mode}
        </span>
      )}
      {badges.sync && (
        <span
          className={cn(
            "inline-flex items-center px-2 py-0.5 rounded text-xs font-medium",
            badges.sync === "synced"
              ? "bg-green-100 text-green-800"
              : "bg-yellow-100 text-yellow-800"
          )}
        >
          {badges.sync === "synced" ? "✓ Synced" : "⚠ Needs Sync"}
        </span>
      )}
      {badges.env && (
        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
          {badges.env === "test" ? "🧪 Test" : "🔴 Live"}
        </span>
      )}
      {badges.charge && (
        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-purple-100 text-purple-800">
          {badges.charge === "immediate" ? "⚡ Immediate" : "⏱️ Deferred"}
        </span>
      )}
    </div>
  );
}

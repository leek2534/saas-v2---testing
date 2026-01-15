"use client";

import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { AlertCircle, CheckCircle2, XCircle, Loader2 } from "lucide-react";
import { useState } from "react";
import type { StepReadiness, ReadinessIssue } from "../types/payments";
import { executeFixAction } from "../lib/fix-action-executor";

interface SafetyHeaderProps {
  stepReadiness: StepReadiness | null;
  onFixExecuted?: () => void;
}

export function SafetyHeader({ stepReadiness, onFixExecuted }: SafetyHeaderProps) {
  const [executingFix, setExecutingFix] = useState<string | null>(null);

  if (!stepReadiness) {
    return null;
  }

  const hasBlockers = stepReadiness.issues.some(i => i.severity === "blocker");
  const hasWarnings = stepReadiness.issues.some(i => i.severity === "warning");

  const handleFix = async (issue: ReadinessIssue) => {
    if (!issue.fixAction) return;

    setExecutingFix(issue.id);
    try {
      const result = await executeFixAction({
        action: issue.fixAction,
        onNavigate: (path) => {
          window.location.href = path;
        },
        onSyncPrices: async (priceIds) => {
          // TODO: Implement sync logic
          console.log("Syncing prices:", priceIds);
        },
        onSplitCheckout: async (stepId) => {
          // TODO: Implement split checkout logic
          console.log("Splitting checkout:", stepId);
        },
      });

      if (result.success) {
        onFixExecuted?.();
      }
    } finally {
      setExecutingFix(null);
    }
  };

  return (
    <div className="sticky top-0 z-50 bg-background border-b shadow-sm">
      {/* Row 1: Badges */}
      <div className="flex items-center gap-2 px-4 py-2 border-b bg-muted/30">
        <div className="flex items-center gap-2 flex-1">
          {stepReadiness.badges.mode && (
            <Badge variant="outline" className="font-mono text-xs">
              {stepReadiness.badges.mode}
            </Badge>
          )}
          {stepReadiness.badges.sync && (
            <Badge 
              variant={stepReadiness.badges.sync === "synced" ? "default" : "secondary"}
              className={stepReadiness.badges.sync === "synced" ? "bg-green-600" : "bg-yellow-600"}
            >
              {stepReadiness.badges.sync === "synced" ? "✓ Synced" : "⚠ Needs Sync"}
            </Badge>
          )}
          {stepReadiness.badges.env && (
            <Badge variant="outline" className="text-xs">
              {stepReadiness.badges.env === "test" ? "🧪 Test" : "🔴 Live"}
            </Badge>
          )}
          {stepReadiness.badges.charge && (
            <Badge variant="outline" className="text-xs">
              {stepReadiness.badges.charge === "immediate" ? "⚡ Immediate" : "⏱️ Deferred"}
            </Badge>
          )}
        </div>

        {/* Status indicator */}
        <div className="flex items-center gap-2">
          {hasBlockers ? (
            <div className="flex items-center gap-1 text-red-600">
              <XCircle className="h-4 w-4" />
              <span className="text-xs font-medium">Blocked</span>
            </div>
          ) : hasWarnings ? (
            <div className="flex items-center gap-1 text-yellow-600">
              <AlertCircle className="h-4 w-4" />
              <span className="text-xs font-medium">Warnings</span>
            </div>
          ) : (
            <div className="flex items-center gap-1 text-green-600">
              <CheckCircle2 className="h-4 w-4" />
              <span className="text-xs font-medium">Ready</span>
            </div>
          )}
        </div>
      </div>

      {/* Row 2: Issues */}
      {stepReadiness.issues.length > 0 && (
        <div className="p-4 space-y-2 max-h-64 overflow-y-auto">
          {stepReadiness.issues.map((issue) => (
            <Alert
              key={issue.id}
              variant={issue.severity === "blocker" ? "destructive" : "default"}
              className={issue.severity === "warning" ? "border-yellow-500 bg-yellow-50" : ""}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <AlertTitle className="text-sm font-semibold mb-1">
                    {issue.severity === "blocker" && "🚫 "}
                    {issue.severity === "warning" && "⚠️ "}
                    {issue.title}
                  </AlertTitle>
                  <AlertDescription className="text-xs">
                    {issue.description}
                  </AlertDescription>
                </div>
                {issue.fixAction && (
                  <Button
                    size="sm"
                    variant={issue.severity === "blocker" ? "default" : "outline"}
                    onClick={() => handleFix(issue)}
                    disabled={executingFix === issue.id}
                  >
                    {executingFix === issue.id ? (
                      <>
                        <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                        Fixing...
                      </>
                    ) : (
                      "Fix Now"
                    )}
                  </Button>
                )}
              </div>
            </Alert>
          ))}
        </div>
      )}
    </div>
  );
}

"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { AlertCircle, CheckCircle2, XCircle, Loader2, Zap } from "lucide-react";
import { useState } from "react";
import type { FunnelReadiness, ReadinessIssue } from "../types/payments";
import { executeFixAction } from "../lib/fix-action-executor";

interface PublishReadinessModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  readiness: FunnelReadiness | null;
  onPublish?: () => Promise<void>;
  onFixExecuted?: () => void;
}

export function PublishReadinessModal({
  open,
  onOpenChange,
  readiness,
  onPublish,
  onFixExecuted,
}: PublishReadinessModalProps) {
  const [isPublishing, setIsPublishing] = useState(false);
  const [executingFix, setExecutingFix] = useState<string | null>(null);

  if (!readiness) {
    return null;
  }

  const allIssues = [
    ...readiness.globalIssues,
    ...Array.from(readiness.steps.values()).flatMap(s => s.issues),
  ];

  const blockers = allIssues.filter(i => i.severity === "blocker");
  const warnings = allIssues.filter(i => i.severity === "warning");
  const infos = allIssues.filter(i => i.severity === "info");

  const handlePublish = async () => {
    if (readiness.publishBlocked) return;
    
    setIsPublishing(true);
    try {
      await onPublish?.();
      onOpenChange(false);
    } finally {
      setIsPublishing(false);
    }
  };

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
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {readiness.publishBlocked ? (
              <>
                <XCircle className="h-5 w-5 text-red-600" />
                Cannot Publish - Issues Found
              </>
            ) : warnings.length > 0 ? (
              <>
                <AlertCircle className="h-5 w-5 text-yellow-600" />
                Ready to Publish (with warnings)
              </>
            ) : (
              <>
                <CheckCircle2 className="h-5 w-5 text-green-600" />
                Ready to Publish
              </>
            )}
          </DialogTitle>
          <DialogDescription>
            {readiness.publishBlocked
              ? "Fix all blockers before publishing your funnel"
              : warnings.length > 0
              ? "Your funnel is ready, but has some warnings you may want to address"
              : "Your funnel is ready to go live!"}
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-[50vh] pr-4">
          <div className="space-y-4">
            {/* Workspace Issues */}
            {readiness.globalIssues.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold mb-2 flex items-center gap-2">
                  <Badge variant="outline">Workspace</Badge>
                  Global Settings
                </h3>
                <div className="space-y-2">
                  {readiness.globalIssues.map(issue => (
                    <IssueCard
                      key={issue.id}
                      issue={issue}
                      onFix={handleFix}
                      isExecuting={executingFix === issue.id}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Blockers */}
            {blockers.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold mb-2 flex items-center gap-2 text-red-600">
                  <XCircle className="h-4 w-4" />
                  Blockers ({blockers.length})
                </h3>
                <div className="space-y-2">
                  {blockers.map(issue => (
                    <IssueCard
                      key={issue.id}
                      issue={issue}
                      onFix={handleFix}
                      isExecuting={executingFix === issue.id}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Warnings */}
            {warnings.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold mb-2 flex items-center gap-2 text-yellow-600">
                  <AlertCircle className="h-4 w-4" />
                  Warnings ({warnings.length})
                </h3>
                <div className="space-y-2">
                  {warnings.map(issue => (
                    <IssueCard
                      key={issue.id}
                      issue={issue}
                      onFix={handleFix}
                      isExecuting={executingFix === issue.id}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* All clear */}
            {blockers.length === 0 && warnings.length === 0 && (
              <Card className="border-green-200 bg-green-50">
                <CardContent className="flex items-center gap-3 p-4">
                  <CheckCircle2 className="h-8 w-8 text-green-600" />
                  <div>
                    <h3 className="font-semibold text-green-900">All Systems Go!</h3>
                    <p className="text-sm text-green-700">
                      Your funnel is properly configured and ready to publish.
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </ScrollArea>

        <Separator />

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            onClick={handlePublish}
            disabled={readiness.publishBlocked || isPublishing}
            className="min-w-32"
          >
            {isPublishing ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Publishing...
              </>
            ) : readiness.publishBlocked ? (
              "Fix Issues First"
            ) : (
              <>
                <Zap className="h-4 w-4 mr-2" />
                Publish Funnel
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function IssueCard({
  issue,
  onFix,
  isExecuting,
}: {
  issue: ReadinessIssue;
  onFix: (issue: ReadinessIssue) => void;
  isExecuting: boolean;
}) {
  const severityConfig = {
    blocker: {
      icon: XCircle,
      color: "text-red-600",
      bg: "bg-red-50",
      border: "border-red-200",
    },
    warning: {
      icon: AlertCircle,
      color: "text-yellow-600",
      bg: "bg-yellow-50",
      border: "border-yellow-200",
    },
    info: {
      icon: AlertCircle,
      color: "text-blue-600",
      bg: "bg-blue-50",
      border: "border-blue-200",
    },
  };

  const config = severityConfig[issue.severity];
  const Icon = config.icon;

  return (
    <Card className={`${config.border} ${config.bg}`}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-2 flex-1">
            <Icon className={`h-4 w-4 mt-0.5 ${config.color}`} />
            <div className="flex-1">
              <CardTitle className="text-sm font-semibold">
                {issue.title}
              </CardTitle>
              <CardDescription className="text-xs mt-1">
                {issue.description}
              </CardDescription>
              {issue.stepId && (
                <Badge variant="outline" className="mt-2 text-xs">
                  Step: {issue.stepId}
                </Badge>
              )}
            </div>
          </div>
          {issue.fixAction && (
            <Button
              size="sm"
              variant={issue.severity === "blocker" ? "default" : "outline"}
              onClick={() => onFix(issue)}
              disabled={isExecuting}
              className="shrink-0"
            >
              {isExecuting ? (
                <>
                  <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                  Fixing...
                </>
              ) : (
                <>
                  <Zap className="h-3 w-3 mr-1" />
                  Fix
                </>
              )}
            </Button>
          )}
        </div>
      </CardHeader>
    </Card>
  );
}

"use client";

import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle, CheckCircle2 } from "lucide-react";
import type { TextSettings } from "../types";

interface SeoAccessibilitySectionProps {
  settings: TextSettings;
  onChange: (path: string, value: any) => void;
  warnings?: string[];
}

export function SeoAccessibilitySection({ settings, onChange, warnings = [] }: SeoAccessibilitySectionProps) {
  const isHeadingType = settings.subtype === "heading" || settings.subtype === "subheading";
  const hasClickAction = settings.actions.blockClick.type !== "none";

  return (
    <div className="space-y-4">
      {/* Semantic Tag Info */}
      <div className="space-y-2">
        <Label className="text-xs font-medium">Semantic Tag</Label>
        <div className="p-2 bg-slate-50 rounded border border-slate-200">
          <p className="text-xs font-mono">{settings.semanticTag.toUpperCase()}</p>
        </div>
        <p className="text-xs text-slate-500">
          {isHeadingType
            ? "Proper heading hierarchy improves SEO and accessibility"
            : "Semantic HTML helps screen readers and search engines"}
        </p>
      </div>

      {/* Heading Structure Warnings */}
      {isHeadingType && warnings.length > 0 && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription className="text-xs space-y-1">
            <p className="font-medium">Heading Structure Issues:</p>
            <ul className="list-disc list-inside space-y-1">
              {warnings.map((warning, i) => (
                <li key={i}>{warning}</li>
              ))}
            </ul>
          </AlertDescription>
        </Alert>
      )}

      {isHeadingType && warnings.length === 0 && (
        <Alert>
          <CheckCircle2 className="h-4 w-4" />
          <AlertDescription className="text-xs">
            Heading structure looks good!
          </AlertDescription>
        </Alert>
      )}

      {/* ARIA Label (for clickable text) */}
      {hasClickAction && (
        <div className="space-y-2">
          <Label className="text-xs font-medium">ARIA Label</Label>
          <Input
            value={settings.seoA11y.ariaLabel ?? ""}
            onChange={(e) => onChange("seoA11y.ariaLabel", e.target.value)}
            placeholder="Describe the action (e.g., 'Navigate to pricing page')"
            className="text-xs"
          />
          <p className="text-xs text-slate-500">
            Required for accessibility when text is clickable
          </p>
          {!settings.seoA11y.ariaLabel && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription className="text-xs">
                ARIA label is recommended for clickable text elements
              </AlertDescription>
            </Alert>
          )}
        </div>
      )}

      {/* Language Override */}
      <div className="pt-3 border-t border-slate-200 space-y-2">
        <Label className="text-xs font-medium">Language Override (Optional)</Label>
        <Input
          value={settings.seoA11y.lang ?? ""}
          onChange={(e) => onChange("seoA11y.lang", e.target.value)}
          placeholder="en, es, fr, etc."
          className="text-xs"
        />
        <p className="text-xs text-slate-500">
          Override language for this text (useful for multilingual content)
        </p>
      </div>

      {/* Best Practices */}
      <div className="pt-3 border-t border-slate-200">
        <Alert>
          <AlertDescription className="text-xs space-y-2">
            <p className="font-medium">SEO & Accessibility Best Practices:</p>
            <ul className="list-disc list-inside space-y-1 text-slate-600">
              <li>Use only one H1 per page</li>
              <li>Don't skip heading levels (H1 → H2 → H3)</li>
              <li>Ensure sufficient color contrast (4.5:1 minimum)</li>
              <li>Provide descriptive ARIA labels for clickable elements</li>
              <li>Keep line length between 50-75 characters for readability</li>
            </ul>
          </AlertDescription>
        </Alert>
      </div>
    </div>
  );
}

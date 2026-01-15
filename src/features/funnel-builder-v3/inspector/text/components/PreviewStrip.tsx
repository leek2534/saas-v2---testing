"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit2 } from "lucide-react";
import type { TextSettings } from "../types";

interface PreviewStripProps {
  settings: TextSettings;
  isEditing: boolean;
  onEditClick: () => void;
}

export function PreviewStrip({ settings, isEditing, onEditClick }: PreviewStripProps) {
  const previewStyle: React.CSSProperties = {
    fontFamily: settings.typography.fontFamily,
    fontWeight: settings.typography.fontWeight,
    fontSize: `${Math.min(settings.typography.fontSize.value, 18)}px`,
    lineHeight: String(settings.typography.lineHeight.value),
    letterSpacing: `${settings.typography.letterSpacing.value}${settings.typography.letterSpacing.unit}`,
    textAlign: settings.typography.align,
    textTransform: settings.typography.transform,
    color: settings.colorEffects.color,
    opacity: settings.colorEffects.opacity,
    textDecoration: settings.typography.underline ? "underline" : "none",
    fontStyle: settings.typography.italic ? "italic" : "normal",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  };

  const displayText = settings.content.text || settings.content.placeholder || "Preview text";

  return (
    <div className="sticky top-[129px] z-10 bg-white border-b border-slate-200 p-3">
      <div className="flex items-center gap-2 mb-2">
        <span className="text-xs font-medium text-slate-600">Preview</span>
        {isEditing && (
          <Badge variant="secondary" className="text-xs">
            Editing...
          </Badge>
        )}
      </div>
      <div className="flex items-center gap-2">
        <div className="flex-1 min-w-0 p-2 bg-slate-50 rounded border border-slate-200">
          <div style={previewStyle}>{displayText}</div>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={onEditClick}
          className="shrink-0"
        >
          <Edit2 className="h-3 w-3 mr-1" />
          Edit
        </Button>
      </div>
    </div>
  );
}

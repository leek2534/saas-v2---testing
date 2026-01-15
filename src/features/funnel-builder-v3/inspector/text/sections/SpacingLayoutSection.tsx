"use client";

import React from "react";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { SpacingPopover } from "../components/SpacingPopover";
import type { TextSettings } from "../types";

interface SpacingLayoutSectionProps {
  settings: TextSettings;
  onChange: (path: string, value: any) => void;
}

export function SpacingLayoutSection({ settings, onChange }: SpacingLayoutSectionProps) {
  const isParagraphType = settings.subtype === "paragraph";

  return (
    <div className="space-y-4">
      {/* Width Mode */}
      <div className="space-y-2">
        <Label className="text-xs font-medium">Width</Label>
        <Select
          value={settings.layout.widthMode}
          onValueChange={(value) => onChange("layout.widthMode", value)}
        >
          <SelectTrigger className="text-sm">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="auto">Auto</SelectItem>
            <SelectItem value="full">Full Width</SelectItem>
            <SelectItem value="custom">Custom</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Custom Width */}
      {settings.layout.widthMode === "custom" && (
        <div className="space-y-2">
          <Label className="text-xs font-medium">Custom Width</Label>
          <div className="flex items-center gap-2">
            <Input
              type="number"
              min={0}
              value={settings.layout.width?.value ?? 100}
              onChange={(e) => onChange("layout.width.value", Number(e.target.value))}
              className="text-sm"
            />
            <Select
              value={settings.layout.width?.unit ?? "px"}
              onValueChange={(value) => onChange("layout.width.unit", value)}
            >
              <SelectTrigger className="w-20 text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="px">px</SelectItem>
                <SelectItem value="%">%</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      )}

      {/* Max Width (important for paragraphs) */}
      <div className="space-y-2">
        <Label className="text-xs font-medium">
          Max Width {isParagraphType && "(Recommended for readability)"}
        </Label>
        <div className="flex items-center gap-2">
          <Input
            type="number"
            min={0}
            value={settings.layout.maxWidth?.value ?? 640}
            onChange={(e) => onChange("layout.maxWidth.value", Number(e.target.value))}
            className="text-sm"
          />
          <Select
            value={settings.layout.maxWidth?.unit ?? "px"}
            onValueChange={(value) => onChange("layout.maxWidth.unit", value)}
          >
            <SelectTrigger className="w-20 text-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="px">px</SelectItem>
              <SelectItem value="%">%</SelectItem>
            </SelectContent>
          </Select>
        </div>
        {isParagraphType && (
          <p className="text-xs text-slate-500">
            640px is optimal for paragraph readability
          </p>
        )}
      </div>

      {/* Block Alignment */}
      <div className="space-y-2">
        <Label className="text-xs font-medium">Block Alignment</Label>
        <Select
          value={settings.layout.alignSelf ?? "left"}
          onValueChange={(value) => onChange("layout.alignSelf", value)}
        >
          <SelectTrigger className="text-sm">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="left">Left</SelectItem>
            <SelectItem value="center">Center</SelectItem>
            <SelectItem value="right">Right</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Margin */}
      <div className="space-y-2">
        <Label className="text-xs font-medium">Margin</Label>
        <SpacingPopover
          label="Margin"
          value={settings.layout.margin ?? { top: 0, right: 0, bottom: 16, left: 0, unit: "px" }}
          onChange={(value) => onChange("layout.margin", value)}
        />
      </div>

      {/* Padding */}
      <div className="space-y-2">
        <Label className="text-xs font-medium">Padding</Label>
        <SpacingPopover
          label="Padding"
          value={settings.layout.padding ?? { top: 12, right: 16, bottom: 12, left: 16, unit: "px" }}
          onChange={(value) => onChange("layout.padding", value)}
        />
      </div>

      {/* Advanced: Display */}
      <div className="pt-3 border-t border-slate-200 space-y-2">
        <Label className="text-xs font-medium">Display</Label>
        <Select
          value={settings.layout.display ?? "block"}
          onValueChange={(value) => onChange("layout.display", value)}
        >
          <SelectTrigger className="text-sm">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="block">Block</SelectItem>
            <SelectItem value="inline-block">Inline Block</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Advanced: White Space */}
      <div className="space-y-2">
        <Label className="text-xs font-medium">White Space</Label>
        <Select
          value={settings.layout.whiteSpace ?? "normal"}
          onValueChange={(value) => onChange("layout.whiteSpace", value)}
        >
          <SelectTrigger className="text-sm">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="normal">Normal</SelectItem>
            <SelectItem value="pre-wrap">Pre-wrap</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Advanced: Overflow */}
      <div className="space-y-2">
        <Label className="text-xs font-medium">Overflow</Label>
        <Select
          value={settings.layout.overflow ?? "visible"}
          onValueChange={(value) => onChange("layout.overflow", value)}
        >
          <SelectTrigger className="text-sm">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="visible">Visible</SelectItem>
            <SelectItem value="hidden">Hidden</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Advanced: Multi-column (Paragraph only) */}
      {isParagraphType && (
        <div className="pt-3 border-t border-slate-200 space-y-3">
          <div className="flex items-center justify-between">
            <Label className="text-xs font-medium">Multi-column Layout</Label>
            <Switch
              checked={settings.layout.columns?.enabled ?? false}
              onCheckedChange={(checked: boolean) => onChange("layout.columns.enabled", checked)}
            />
          </div>
          {settings.layout.columns?.enabled && (
            <div className="space-y-3">
              <div className="space-y-1">
                <Label className="text-xs text-slate-600">Column Count</Label>
                <Input
                  type="number"
                  min={2}
                  max={4}
                  value={settings.layout.columns.count ?? 2}
                  onChange={(e) => onChange("layout.columns.count", Number(e.target.value))}
                  className="text-xs"
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs text-slate-600">Gap (px)</Label>
                <Input
                  type="number"
                  min={0}
                  value={settings.layout.columns.gap ?? 16}
                  onChange={(e) => onChange("layout.columns.gap", Number(e.target.value))}
                  className="text-xs"
                />
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

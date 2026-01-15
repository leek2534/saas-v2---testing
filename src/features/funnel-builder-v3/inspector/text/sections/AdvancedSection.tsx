"use client";

import React from "react";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { DataAttrsEditor } from "../components/DataAttrsEditor";
import type { TextSettings } from "../types";

interface AdvancedSectionProps {
  settings: TextSettings;
  onChange: (path: string, value: any) => void;
}

export function AdvancedSection({ settings, onChange }: AdvancedSectionProps) {
  return (
    <div className="space-y-4">
      {/* Custom CSS Classes */}
      <div className="space-y-2">
        <Label className="text-xs font-medium">Custom CSS Classes</Label>
        <Input
          value={settings.advanced.classes ?? ""}
          onChange={(e) => onChange("advanced.classes", e.target.value)}
          placeholder="class-name another-class"
          className="text-xs font-mono"
        />
        <p className="text-xs text-slate-500">
          Space-separated class names
        </p>
      </div>

      {/* Data Attributes */}
      <div className="space-y-2">
        <Label className="text-xs font-medium">Data Attributes</Label>
        <DataAttrsEditor
          value={settings.advanced.dataAttrs ?? []}
          onChange={(value) => onChange("advanced.dataAttrs", value)}
        />
        <p className="text-xs text-slate-500">
          Custom data attributes for tracking or styling
        </p>
      </div>

      {/* Tracking */}
      <div className="pt-3 border-t border-slate-200 space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <Label className="text-xs font-medium">Event Tracking</Label>
            <p className="text-xs text-slate-500">Track interactions with this element</p>
          </div>
          <Switch
            checked={settings.advanced.tracking?.enabled ?? false}
            onCheckedChange={(checked: boolean) => onChange("advanced.tracking.enabled", checked)}
          />
        </div>
        {settings.advanced.tracking?.enabled && (
          <div className="space-y-2">
            <div className="space-y-1">
              <Label className="text-xs text-slate-600">Event Name</Label>
              <Input
                value={settings.advanced.tracking.eventName ?? ""}
                onChange={(e) => onChange("advanced.tracking.eventName", e.target.value)}
                placeholder="text_clicked"
                className="text-xs"
              />
            </div>
            <p className="text-xs text-slate-500">
              Element ID will be automatically included in tracking data
            </p>
          </div>
        )}
      </div>

      {/* Developer Info */}
      <div className="pt-3 border-t border-slate-200">
        <div className="p-3 bg-slate-50 rounded border border-slate-200 space-y-2">
          <p className="text-xs font-medium text-slate-700">Developer Notes</p>
          <ul className="text-xs text-slate-600 space-y-1">
            <li>• Custom classes are applied to the wrapper element</li>
            <li>• Data attributes are useful for JavaScript selectors</li>
            <li>• Tracking events integrate with your analytics platform</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

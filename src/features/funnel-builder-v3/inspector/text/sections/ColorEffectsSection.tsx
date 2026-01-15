"use client";

import React from "react";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { ColorPicker } from "../components/ColorPicker";
import type { TextSettings } from "../types";

interface ColorEffectsSectionProps {
  settings: TextSettings;
  onChange: (path: string, value: any) => void;
}

export function ColorEffectsSection({ settings, onChange }: ColorEffectsSectionProps) {
  return (
    <div className="space-y-4">
      {/* Text Color */}
      <div className="space-y-2">
        <Label className="text-xs font-medium">Text Color</Label>
        <ColorPicker
          value={settings.colorEffects.color}
          onChange={(value) => onChange("colorEffects.color", value)}
        />
      </div>

      {/* Opacity */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label className="text-xs font-medium">Opacity</Label>
          <span className="text-xs text-slate-500">
            {Math.round(settings.colorEffects.opacity * 100)}%
          </span>
        </div>
        <Slider
          value={[settings.colorEffects.opacity * 100]}
          onValueChange={([value]) => onChange("colorEffects.opacity", value / 100)}
          min={0}
          max={100}
          step={1}
          className="w-full"
        />
      </div>

      {/* Highlight Background */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label className="text-xs font-medium">Highlight Background</Label>
          <Switch
            checked={settings.colorEffects.highlight?.enabled ?? false}
            onCheckedChange={(checked) => onChange("colorEffects.highlight.enabled", checked)}
          />
        </div>
        {settings.colorEffects.highlight?.enabled && (
          <ColorPicker
            value={settings.colorEffects.highlight.color ?? "#ffeb3b"}
            onChange={(value) => onChange("colorEffects.highlight.color", value)}
            label="Highlight Color"
          />
        )}
      </div>

      {/* Advanced: Text Shadow */}
      <div className="pt-3 border-t border-slate-200 space-y-3">
        <div className="flex items-center justify-between">
          <Label className="text-xs font-medium">Text Shadow</Label>
          <Switch
            checked={settings.colorEffects.shadow?.enabled ?? false}
            onCheckedChange={(checked) => onChange("colorEffects.shadow.enabled", checked)}
          />
        </div>
        {settings.colorEffects.shadow?.enabled && (
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <Label className="text-xs text-slate-600">X Offset</Label>
                <Input
                  type="number"
                  value={settings.colorEffects.shadow.x ?? 2}
                  onChange={(e) => onChange("colorEffects.shadow.x", Number(e.target.value))}
                  className="text-xs"
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs text-slate-600">Y Offset</Label>
                <Input
                  type="number"
                  value={settings.colorEffects.shadow.y ?? 2}
                  onChange={(e) => onChange("colorEffects.shadow.y", Number(e.target.value))}
                  className="text-xs"
                />
              </div>
            </div>
            <div className="space-y-1">
              <Label className="text-xs text-slate-600">Blur</Label>
              <Input
                type="number"
                value={settings.colorEffects.shadow.blur ?? 4}
                onChange={(e) => onChange("colorEffects.shadow.blur", Number(e.target.value))}
                className="text-xs"
              />
            </div>
            <ColorPicker
              value={settings.colorEffects.shadow.color ?? "#000000"}
              onChange={(value) => onChange("colorEffects.shadow.color", value)}
              label="Shadow Color"
            />
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="text-xs text-slate-600">Shadow Opacity</Label>
                <span className="text-xs text-slate-500">
                  {Math.round((settings.colorEffects.shadow.opacity ?? 0.3) * 100)}%
                </span>
              </div>
              <Slider
                value={[(settings.colorEffects.shadow.opacity ?? 0.3) * 100]}
                onValueChange={([value]) => onChange("colorEffects.shadow.opacity", value / 100)}
                min={0}
                max={100}
                step={1}
              />
            </div>
          </div>
        )}
      </div>

      {/* Advanced: Text Stroke */}
      <div className="pt-3 border-t border-slate-200 space-y-3">
        <div className="flex items-center justify-between">
          <Label className="text-xs font-medium">Text Stroke/Outline</Label>
          <Switch
            checked={settings.colorEffects.stroke?.enabled ?? false}
            onCheckedChange={(checked) => onChange("colorEffects.stroke.enabled", checked)}
          />
        </div>
        {settings.colorEffects.stroke?.enabled && (
          <div className="space-y-3">
            <div className="space-y-1">
              <Label className="text-xs text-slate-600">Stroke Width (px)</Label>
              <Input
                type="number"
                min={0}
                max={10}
                value={settings.colorEffects.stroke.width ?? 1}
                onChange={(e) => onChange("colorEffects.stroke.width", Number(e.target.value))}
                className="text-xs"
              />
            </div>
            <ColorPicker
              value={settings.colorEffects.stroke.color ?? "#000000"}
              onChange={(value) => onChange("colorEffects.stroke.color", value)}
              label="Stroke Color"
            />
          </div>
        )}
      </div>
    </div>
  );
}

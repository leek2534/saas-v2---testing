"use client";

import React from "react";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { ColorPicker } from "../components/ColorPicker";
import { Slider } from "@/components/ui/slider";
import type { TextSettings } from "../types";

interface WrapperStyleSectionProps {
  settings: TextSettings;
  onChange: (path: string, value: any) => void;
}

export function WrapperStyleSection({ settings, onChange }: WrapperStyleSectionProps) {
  return (
    <div className="space-y-4">
      {/* Use Site Styles */}
      <div className="flex items-center justify-between">
        <div>
          <Label className="text-xs font-medium">Use Site Styles</Label>
          <p className="text-xs text-slate-500">Apply global theme styles</p>
        </div>
        <Switch
          checked={settings.wrapper.useSiteStyles}
          onCheckedChange={(checked: boolean) => onChange("wrapper.useSiteStyles", checked)}
        />
      </div>

      {!settings.wrapper.useSiteStyles && (
        <>
          {/* Wrapper Background */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-xs font-medium">Wrapper Background</Label>
              <Switch
                checked={settings.wrapper.background?.enabled ?? false}
                onCheckedChange={(checked: boolean) => onChange("wrapper.background.enabled", checked)}
              />
            </div>
            {settings.wrapper.background?.enabled && (
              <ColorPicker
                value={settings.wrapper.background.color ?? "#ffffff"}
                onChange={(value) => onChange("wrapper.background.color", value)}
              />
            )}
          </div>

          {/* Border */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-xs font-medium">Border</Label>
              <Switch
                checked={settings.wrapper.border?.enabled ?? false}
                onCheckedChange={(checked: boolean) => onChange("wrapper.border.enabled", checked)}
              />
            </div>
            {settings.wrapper.border?.enabled && (
              <div className="space-y-3">
                <div className="space-y-1">
                  <Label className="text-xs text-slate-600">Border Width (px)</Label>
                  <Input
                    type="number"
                    min={0}
                    max={20}
                    value={settings.wrapper.border.width ?? 1}
                    onChange={(e) => onChange("wrapper.border.width", Number(e.target.value))}
                    className="text-xs"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs text-slate-600">Border Style</Label>
                  <Select
                    value={settings.wrapper.border.style ?? "solid"}
                    onValueChange={(value) => onChange("wrapper.border.style", value)}
                  >
                    <SelectTrigger className="text-sm">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="solid">Solid</SelectItem>
                      <SelectItem value="dashed">Dashed</SelectItem>
                      <SelectItem value="dotted">Dotted</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <ColorPicker
                  value={settings.wrapper.border.color ?? "#e2e8f0"}
                  onChange={(value) => onChange("wrapper.border.color", value)}
                  label="Border Color"
                />
              </div>
            )}
          </div>

          {/* Corner Radius */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-xs font-medium">Corner Radius</Label>
              <span className="text-xs text-slate-500">
                {settings.wrapper.radius ?? 0}px
              </span>
            </div>
            <Slider
              value={[settings.wrapper.radius ?? 0]}
              onValueChange={([value]) => onChange("wrapper.radius", value)}
              min={0}
              max={50}
              step={1}
              className="w-full"
            />
          </div>

          {/* Shadow */}
          <div className="space-y-2">
            <Label className="text-xs font-medium">Shadow</Label>
            <Select
              value={settings.wrapper.shadow ?? "none"}
              onValueChange={(value) => onChange("wrapper.shadow", value)}
            >
              <SelectTrigger className="text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">None</SelectItem>
                <SelectItem value="sm">Small</SelectItem>
                <SelectItem value="md">Medium</SelectItem>
                <SelectItem value="lg">Large</SelectItem>
                <SelectItem value="custom">Custom</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </>
      )}
    </div>
  );
}

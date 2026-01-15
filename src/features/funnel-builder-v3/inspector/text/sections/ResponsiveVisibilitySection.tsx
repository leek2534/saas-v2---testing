"use client";

import React from "react";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Info } from "lucide-react";
import type { TextSettings } from "../types";

interface ResponsiveVisibilitySectionProps {
  settings: TextSettings;
  onChange: (path: string, value: any) => void;
}

export function ResponsiveVisibilitySection({ settings, onChange }: ResponsiveVisibilitySectionProps) {
  const isHeadingType = settings.subtype === "heading" || settings.subtype === "subheading";
  const isParagraphType = settings.subtype === "paragraph";

  return (
    <div className="space-y-4">
      {/* Hide On Devices */}
      <div className="space-y-2">
        <Label className="text-xs font-medium">Hide On</Label>
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="hide-desktop"
              checked={settings.responsive.hiddenOn.desktop}
              onCheckedChange={(checked: boolean) => onChange("responsive.hiddenOn.desktop", checked)}
            />
            <label
              htmlFor="hide-desktop"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Desktop
            </label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="hide-tablet"
              checked={settings.responsive.hiddenOn.tablet}
              onCheckedChange={(checked: boolean) => onChange("responsive.hiddenOn.tablet", checked)}
            />
            <label
              htmlFor="hide-tablet"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Tablet
            </label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="hide-mobile"
              checked={settings.responsive.hiddenOn.mobile}
              onCheckedChange={(checked: boolean) => onChange("responsive.hiddenOn.mobile", checked)}
            />
            <label
              htmlFor="hide-mobile"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Mobile
            </label>
          </div>
        </div>
      </div>

      {/* Responsive Font Scaling (Headings) */}
      {isHeadingType && (
        <div className="pt-3 border-t border-slate-200 space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-xs font-medium">Responsive Font Scaling</Label>
              <p className="text-xs text-slate-500">Auto-scale font between viewport sizes</p>
            </div>
            <Switch
              checked={settings.responsive.responsiveScale?.enabled ?? false}
              onCheckedChange={(checked: boolean) => onChange("responsive.responsiveScale.enabled", checked)}
            />
          </div>
          {settings.responsive.responsiveScale?.enabled && (
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <Label className="text-xs text-slate-600">Min Font (px)</Label>
                  <Input
                    type="number"
                    min={8}
                    value={settings.responsive.responsiveScale.minFontPx ?? 24}
                    onChange={(e) => onChange("responsive.responsiveScale.minFontPx", Number(e.target.value))}
                    className="text-xs"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs text-slate-600">Max Font (px)</Label>
                  <Input
                    type="number"
                    min={8}
                    value={settings.responsive.responsiveScale.maxFontPx ?? 64}
                    onChange={(e) => onChange("responsive.responsiveScale.maxFontPx", Number(e.target.value))}
                    className="text-xs"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <Label className="text-xs text-slate-600">Min Viewport (px)</Label>
                  <Input
                    type="number"
                    min={320}
                    value={settings.responsive.responsiveScale.minViewportPx ?? 375}
                    onChange={(e) => onChange("responsive.responsiveScale.minViewportPx", Number(e.target.value))}
                    className="text-xs"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs text-slate-600">Max Viewport (px)</Label>
                  <Input
                    type="number"
                    min={320}
                    value={settings.responsive.responsiveScale.maxViewportPx ?? 1440}
                    onChange={(e) => onChange("responsive.responsiveScale.maxViewportPx", Number(e.target.value))}
                    className="text-xs"
                  />
                </div>
              </div>
              {(settings.responsive.responsiveScale.minFontPx ?? 24) >= (settings.responsive.responsiveScale.maxFontPx ?? 64) && (
                <Alert variant="destructive">
                  <AlertDescription className="text-xs">
                    Min font size must be less than max font size
                  </AlertDescription>
                </Alert>
              )}
            </div>
          )}
        </div>
      )}

      {/* Mobile Readability (Paragraph) */}
      {isParagraphType && (
        <div className="pt-3 border-t border-slate-200 space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-xs font-medium">Mobile Readability</Label>
              <p className="text-xs text-slate-500">Optimize for mobile reading</p>
            </div>
            <Switch
              checked={settings.responsive.mobileReadability?.enabled ?? false}
              onCheckedChange={(checked: boolean) => onChange("responsive.mobileReadability.enabled", checked)}
            />
          </div>
          {settings.responsive.mobileReadability?.enabled && (
            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription className="text-xs">
                Mobile readability suggests minimum 15px font size and 1.5 line height for optimal reading on small screens.
              </AlertDescription>
            </Alert>
          )}
        </div>
      )}

      {/* Device Override Info */}
      <div className="pt-3 border-t border-slate-200">
        <Alert>
          <Info className="h-4 w-4" />
          <AlertDescription className="text-xs">
            Use the device toggle at the top to set device-specific overrides for font size, line height, alignment, and spacing.
          </AlertDescription>
        </Alert>
      </div>
    </div>
  );
}

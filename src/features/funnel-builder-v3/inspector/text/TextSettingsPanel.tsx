"use client";

import React, { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { InspectorHeader } from "./components/InspectorHeader";
import { PreviewStrip } from "./components/PreviewStrip";
import { SectionHeaderSummary } from "./components/SectionHeaderSummary";
import { ContentSection } from "./sections/ContentSection";
import { TypographySection } from "./sections/TypographySection";
import { ColorEffectsSection } from "./sections/ColorEffectsSection";
import { SpacingLayoutSection } from "./sections/SpacingLayoutSection";
import { WrapperStyleSection } from "./sections/WrapperStyleSection";
import { ResponsiveVisibilitySection } from "./sections/ResponsiveVisibilitySection";
import { ActionsLinksSection } from "./sections/ActionsLinksSection";
import { SeoAccessibilitySection } from "./sections/SeoAccessibilitySection";
import { AdvancedSection } from "./sections/AdvancedSection";
import { getEffectiveTextSettings, setTextSetting, resetDeviceOverride } from "./merge";
import { TEXT_PRESETS } from "./presets";
import {
  computeContentSummary,
  computeTypographySummary,
  computeColorSummary,
  computeSpacingSummary,
  computeWrapperSummary,
  computeResponsiveSummary,
  computeActionsSummary,
  computeSeoSummary,
  computeAdvancedSummary,
} from "./summaries";
import type { TextSettings, Device } from "./types";
import type { JSONContent } from "@tiptap/core";

interface TextSettingsPanelProps {
  settings: TextSettings;
  onChange: (settings: TextSettings) => void;
  onEditClick: () => void;
  isEditing: boolean;
  breadcrumbs?: Array<{ id: string; label: string }>;
  onBreadcrumbClick?: (id: string) => void;
  onCollapse?: () => void;
  seoWarnings?: string[];
  content?: JSONContent;
  onContentChange?: (content: JSONContent) => void;
}

export function TextSettingsPanel({
  settings,
  onChange,
  onEditClick,
  isEditing,
  breadcrumbs,
  onBreadcrumbClick,
  onCollapse,
  seoWarnings = [],
  content,
  onContentChange,
}: TextSettingsPanelProps) {
  const [device, setDevice] = useState<Device>("desktop");
  const [openSections, setOpenSections] = useState<string[]>(["content", "typography"]);
  const { toast } = useToast();

  const toggleSection = (section: string) => {
    setOpenSections(prev =>
      prev.includes(section)
        ? prev.filter(s => s !== section)
        : [...prev, section]
    );
  };

  const effectiveSettings = getEffectiveTextSettings(settings, device);

  const handleChange = (path: string, value: any) => {
    const newSettings = setTextSetting(settings, path, value, device === "desktop" ? undefined : device);
    onChange(newSettings);
  };

  const handlePresetSelect = (presetId: string) => {
    const preset = TEXT_PRESETS.find((p) => p.id === presetId);
    if (!preset) return;

    if (!preset.subtypes.includes(settings.subtype)) {
      toast({
        title: "Incompatible Preset",
        description: `This preset is not compatible with ${settings.subtype} elements.`,
        variant: "destructive",
      });
      return;
    }

    const newSettings = { ...settings, ...preset.patch };
    onChange(newSettings);
    
    toast({
      title: "Preset Applied",
      description: `"${preset.name}" preset has been applied.`,
    });
  };

  const handleReset = () => {
    if (device !== "desktop") {
      const newSettings = resetDeviceOverride(settings, device);
      onChange(newSettings);
      toast({
        title: "Device Override Reset",
        description: `${device} overrides have been cleared.`,
      });
    }
  };

  const title = settings.subtype.charAt(0).toUpperCase() + settings.subtype.slice(1);

  return (
    <div className="h-full flex flex-col bg-white">
      <InspectorHeader
        title={title}
        breadcrumbs={breadcrumbs}
        device={device}
        onDeviceChange={setDevice}
        onPresetSelect={handlePresetSelect}
        onReset={device !== "desktop" ? handleReset : undefined}
        onCollapse={onCollapse}
        onBreadcrumbClick={onBreadcrumbClick}
      />

      <div className="flex-1 overflow-y-auto px-4 py-2">
        <div className="space-y-2">
          {/* 1. Content */}
          <div className="border border-slate-200 rounded-lg overflow-hidden">
            <button
              onClick={() => toggleSection('content')}
              className="w-full px-4 py-3 flex items-center justify-between bg-white hover:bg-slate-50 transition-colors"
            >
              <span className="text-sm font-medium text-slate-900">Content</span>
              <div className="flex items-center gap-2">
                <SectionHeaderSummary summary={computeContentSummary(effectiveSettings)} />
                <span className="text-slate-400">{openSections.includes('content') ? '−' : '+'}</span>
              </div>
            </button>
            {openSections.includes('content') && (
              <div className="px-4 py-3 border-t border-slate-200 bg-slate-50">
                <ContentSection 
                  settings={effectiveSettings} 
                  onChange={handleChange}
                  content={content}
                  onContentChange={onContentChange}
                />
              </div>
            )}
          </div>

          {/* 2. Typography */}
          <div className="border border-slate-200 rounded-lg overflow-hidden">
            <button
              onClick={() => toggleSection('typography')}
              className="w-full px-4 py-3 flex items-center justify-between bg-white hover:bg-slate-50 transition-colors"
            >
              <span className="text-sm font-medium text-slate-900">Typography</span>
              <div className="flex items-center gap-2">
                <SectionHeaderSummary summary={computeTypographySummary(effectiveSettings)} />
                <span className="text-slate-400">{openSections.includes('typography') ? '−' : '+'}</span>
              </div>
            </button>
            {openSections.includes('typography') && (
              <div className="px-4 py-3 border-t border-slate-200 bg-slate-50">
                <TypographySection settings={effectiveSettings} onChange={handleChange} />
              </div>
            )}
          </div>

          {/* 3. Color & Effects */}
          <div className="border border-slate-200 rounded-lg overflow-hidden">
            <button
              onClick={() => toggleSection('color')}
              className="w-full px-4 py-3 flex items-center justify-between bg-white hover:bg-slate-50 transition-colors"
            >
              <span className="text-sm font-medium text-slate-900">Color & Effects</span>
              <div className="flex items-center gap-2">
                <SectionHeaderSummary summary={computeColorSummary(effectiveSettings)} />
                <span className="text-slate-400">{openSections.includes('color') ? '−' : '+'}</span>
              </div>
            </button>
            {openSections.includes('color') && (
              <div className="px-4 py-3 border-t border-slate-200 bg-slate-50">
                <ColorEffectsSection settings={effectiveSettings} onChange={handleChange} />
              </div>
            )}
          </div>

          {/* 4. Spacing & Layout */}
          <div className="border border-slate-200 rounded-lg overflow-hidden">
            <button
              onClick={() => toggleSection('spacing')}
              className="w-full px-4 py-3 flex items-center justify-between bg-white hover:bg-slate-50 transition-colors"
            >
              <span className="text-sm font-medium text-slate-900">Spacing & Layout</span>
              <div className="flex items-center gap-2">
                <SectionHeaderSummary summary={computeSpacingSummary(effectiveSettings)} />
                <span className="text-slate-400">{openSections.includes('spacing') ? '−' : '+'}</span>
              </div>
            </button>
            {openSections.includes('spacing') && (
              <div className="px-4 py-3 border-t border-slate-200 bg-slate-50">
                <SpacingLayoutSection settings={effectiveSettings} onChange={handleChange} />
              </div>
            )}
          </div>

          {/* 5. Border / Background */}
          <div className="border border-slate-200 rounded-lg overflow-hidden">
            <button
              onClick={() => toggleSection('wrapper')}
              className="w-full px-4 py-3 flex items-center justify-between bg-white hover:bg-slate-50 transition-colors"
            >
              <span className="text-sm font-medium text-slate-900">Border / Background</span>
              <div className="flex items-center gap-2">
                <SectionHeaderSummary summary={computeWrapperSummary(effectiveSettings)} />
                <span className="text-slate-400">{openSections.includes('wrapper') ? '−' : '+'}</span>
              </div>
            </button>
            {openSections.includes('wrapper') && (
              <div className="px-4 py-3 border-t border-slate-200 bg-slate-50">
                <WrapperStyleSection settings={effectiveSettings} onChange={handleChange} />
              </div>
            )}
          </div>

          {/* 6. Responsive & Visibility */}
          <div className="border border-slate-200 rounded-lg overflow-hidden">
            <button
              onClick={() => toggleSection('responsive')}
              className="w-full px-4 py-3 flex items-center justify-between bg-white hover:bg-slate-50 transition-colors"
            >
              <span className="text-sm font-medium text-slate-900">Responsive & Visibility</span>
              <div className="flex items-center gap-2">
                <SectionHeaderSummary summary={computeResponsiveSummary(effectiveSettings)} />
                <span className="text-slate-400">{openSections.includes('responsive') ? '−' : '+'}</span>
              </div>
            </button>
            {openSections.includes('responsive') && (
              <div className="px-4 py-3 border-t border-slate-200 bg-slate-50">
                <ResponsiveVisibilitySection settings={effectiveSettings} onChange={handleChange} />
              </div>
            )}
          </div>

          {/* 7. Actions & Links */}
          <div className="border border-slate-200 rounded-lg overflow-hidden">
            <button
              onClick={() => toggleSection('actions')}
              className="w-full px-4 py-3 flex items-center justify-between bg-white hover:bg-slate-50 transition-colors"
            >
              <span className="text-sm font-medium text-slate-900">Actions & Links</span>
              <div className="flex items-center gap-2">
                <SectionHeaderSummary summary={computeActionsSummary(effectiveSettings)} />
                <span className="text-slate-400">{openSections.includes('actions') ? '−' : '+'}</span>
              </div>
            </button>
            {openSections.includes('actions') && (
              <div className="px-4 py-3 border-t border-slate-200 bg-slate-50">
                <ActionsLinksSection settings={effectiveSettings} onChange={handleChange} />
              </div>
            )}
          </div>

          {/* 8. SEO & Accessibility */}
          <div className="border border-slate-200 rounded-lg overflow-hidden">
            <button
              onClick={() => toggleSection('seo')}
              className="w-full px-4 py-3 flex items-center justify-between bg-white hover:bg-slate-50 transition-colors"
            >
              <span className="text-sm font-medium text-slate-900">SEO & Accessibility</span>
              <div className="flex items-center gap-2">
                <SectionHeaderSummary summary={computeSeoSummary(effectiveSettings, seoWarnings)} />
                <span className="text-slate-400">{openSections.includes('seo') ? '−' : '+'}</span>
              </div>
            </button>
            {openSections.includes('seo') && (
              <div className="px-4 py-3 border-t border-slate-200 bg-slate-50">
                <SeoAccessibilitySection 
                  settings={effectiveSettings} 
                  onChange={handleChange}
                  warnings={seoWarnings}
                />
              </div>
            )}
          </div>

          {/* 9. Advanced */}
          <div className="border border-slate-200 rounded-lg overflow-hidden">
            <button
              onClick={() => toggleSection('advanced')}
              className="w-full px-4 py-3 flex items-center justify-between bg-white hover:bg-slate-50 transition-colors"
            >
              <span className="text-sm font-medium text-slate-900">Advanced</span>
              <div className="flex items-center gap-2">
                <SectionHeaderSummary summary={computeAdvancedSummary(effectiveSettings)} />
                <span className="text-slate-400">{openSections.includes('advanced') ? '−' : '+'}</span>
              </div>
            </button>
            {openSections.includes('advanced') && (
              <div className="px-4 py-3 border-t border-slate-200 bg-slate-50">
                <AdvancedSection settings={effectiveSettings} onChange={handleChange} />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

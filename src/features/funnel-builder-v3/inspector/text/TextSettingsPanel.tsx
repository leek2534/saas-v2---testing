"use client";

import React, { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { ChevronDown, ChevronRight } from "lucide-react";
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
        <div className="space-y-3">
          {/* 1. Content */}
          <div className="space-y-2">
            <button
              onClick={() => toggleSection('content')}
              className="w-full flex items-center justify-between py-2 px-3 bg-slate-50 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wide">Content</span>
              <div className="flex items-center gap-2">
                <SectionHeaderSummary summary={computeContentSummary(effectiveSettings)} />
                {openSections.includes('content') ? <ChevronDown className="h-4 w-4 text-slate-500" /> : <ChevronRight className="h-4 w-4 text-slate-500" />}
              </div>
            </button>
            {openSections.includes('content') && (
              <div className="px-1">
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
          <div className="space-y-2">
            <button
              onClick={() => toggleSection('typography')}
              className="w-full flex items-center justify-between py-2 px-3 bg-slate-50 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wide">Typography</span>
              <div className="flex items-center gap-2">
                <SectionHeaderSummary summary={computeTypographySummary(effectiveSettings)} />
                {openSections.includes('typography') ? <ChevronDown className="h-4 w-4 text-slate-500" /> : <ChevronRight className="h-4 w-4 text-slate-500" />}
              </div>
            </button>
            {openSections.includes('typography') && (
              <div className="px-1">
                <TypographySection settings={effectiveSettings} onChange={handleChange} />
              </div>
            )}
          </div>

          {/* 3. Color & Effects */}
          <div className="space-y-2">
            <button
              onClick={() => toggleSection('color')}
              className="w-full flex items-center justify-between py-2 px-3 bg-slate-50 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wide">Color & Effects</span>
              <div className="flex items-center gap-2">
                <SectionHeaderSummary summary={computeColorSummary(effectiveSettings)} />
                {openSections.includes('color') ? <ChevronDown className="h-4 w-4 text-slate-500" /> : <ChevronRight className="h-4 w-4 text-slate-500" />}
              </div>
            </button>
            {openSections.includes('color') && (
              <div className="px-1">
                <ColorEffectsSection settings={effectiveSettings} onChange={handleChange} />
              </div>
            )}
          </div>

          {/* 4. Spacing & Layout */}
          <div className="space-y-2">
            <button
              onClick={() => toggleSection('spacing')}
              className="w-full flex items-center justify-between py-2 px-3 bg-slate-50 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wide">Spacing & Layout</span>
              <div className="flex items-center gap-2">
                <SectionHeaderSummary summary={computeSpacingSummary(effectiveSettings)} />
                {openSections.includes('spacing') ? <ChevronDown className="h-4 w-4 text-slate-500" /> : <ChevronRight className="h-4 w-4 text-slate-500" />}
              </div>
            </button>
            {openSections.includes('spacing') && (
              <div className="px-1">
                <SpacingLayoutSection settings={effectiveSettings} onChange={handleChange} />
              </div>
            )}
          </div>

          {/* 5. Border / Background */}
          <div className="space-y-2">
            <button
              onClick={() => toggleSection('wrapper')}
              className="w-full flex items-center justify-between py-2 px-3 bg-slate-50 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wide">Border / Background</span>
              <div className="flex items-center gap-2">
                <SectionHeaderSummary summary={computeWrapperSummary(effectiveSettings)} />
                {openSections.includes('wrapper') ? <ChevronDown className="h-4 w-4 text-slate-500" /> : <ChevronRight className="h-4 w-4 text-slate-500" />}
              </div>
            </button>
            {openSections.includes('wrapper') && (
              <div className="px-1">
                <WrapperStyleSection settings={effectiveSettings} onChange={handleChange} />
              </div>
            )}
          </div>

          {/* 6. Responsive & Visibility */}
          <div className="space-y-2">
            <button
              onClick={() => toggleSection('responsive')}
              className="w-full flex items-center justify-between py-2 px-3 bg-slate-50 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wide">Responsive & Visibility</span>
              <div className="flex items-center gap-2">
                <SectionHeaderSummary summary={computeResponsiveSummary(effectiveSettings)} />
                {openSections.includes('responsive') ? <ChevronDown className="h-4 w-4 text-slate-500" /> : <ChevronRight className="h-4 w-4 text-slate-500" />}
              </div>
            </button>
            {openSections.includes('responsive') && (
              <div className="px-1">
                <ResponsiveVisibilitySection settings={effectiveSettings} onChange={handleChange} />
              </div>
            )}
          </div>

          {/* 7. Actions & Links */}
          <div className="space-y-2">
            <button
              onClick={() => toggleSection('actions')}
              className="w-full flex items-center justify-between py-2 px-3 bg-slate-50 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wide">Actions & Links</span>
              <div className="flex items-center gap-2">
                <SectionHeaderSummary summary={computeActionsSummary(effectiveSettings)} />
                {openSections.includes('actions') ? <ChevronDown className="h-4 w-4 text-slate-500" /> : <ChevronRight className="h-4 w-4 text-slate-500" />}
              </div>
            </button>
            {openSections.includes('actions') && (
              <div className="px-1">
                <ActionsLinksSection settings={effectiveSettings} onChange={handleChange} />
              </div>
            )}
          </div>

          {/* 8. SEO & Accessibility */}
          <div className="space-y-2">
            <button
              onClick={() => toggleSection('seo')}
              className="w-full flex items-center justify-between py-2 px-3 bg-slate-50 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wide">SEO & Accessibility</span>
              <div className="flex items-center gap-2">
                <SectionHeaderSummary summary={computeSeoSummary(effectiveSettings, seoWarnings)} />
                {openSections.includes('seo') ? <ChevronDown className="h-4 w-4 text-slate-500" /> : <ChevronRight className="h-4 w-4 text-slate-500" />}
              </div>
            </button>
            {openSections.includes('seo') && (
              <div className="px-1">
                <SeoAccessibilitySection 
                  settings={effectiveSettings} 
                  onChange={handleChange}
                  warnings={seoWarnings}
                />
              </div>
            )}
          </div>

          {/* 9. Advanced */}
          <div className="space-y-2">
            <button
              onClick={() => toggleSection('advanced')}
              className="w-full flex items-center justify-between py-2 px-3 bg-slate-50 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wide">Advanced</span>
              <div className="flex items-center gap-2">
                <SectionHeaderSummary summary={computeAdvancedSummary(effectiveSettings)} />
                {openSections.includes('advanced') ? <ChevronDown className="h-4 w-4 text-slate-500" /> : <ChevronRight className="h-4 w-4 text-slate-500" />}
              </div>
            </button>
            {openSections.includes('advanced') && (
              <div className="px-1">
                <AdvancedSection settings={effectiveSettings} onChange={handleChange} />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

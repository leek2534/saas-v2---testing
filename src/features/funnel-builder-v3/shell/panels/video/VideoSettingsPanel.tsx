"use client";

import React, { useState, useEffect } from "react";
import type { ElementNode } from "../../../store/types";
import { useFunnelEditorStore } from "../../../store/store";
import type { VideoSettings, Device, VideoStatus, VideoPreset } from "./types";
import { getDefaultVideoSettings, validateVideoSettings, computePlaybackSummary, computeLayoutSummary, computeActionsSummary, computeTrackingSummary } from "./utils";
import { PreviewStrip } from "./components/PreviewStrip";
import { DeviceToggle } from "./components/DeviceToggle";
import { SectionHeaderSummary } from "./components/SectionHeaderSummary";
import { SourceSection } from "./sections/SourceSection";
import { PlaybackSection } from "./sections/PlaybackSection";
import { ControlsSection } from "./sections/ControlsSection";
import { LayoutStyleSection } from "./sections/LayoutStyleSection";
import { ActionsSection } from "./sections/ActionsSection";
import { TrackingSection } from "./sections/TrackingSection";
import { AdvancedSection } from "./sections/AdvancedSection";
import { AccessibilitySection } from "./sections/AccessibilitySection";
import { ChevronDown, ChevronRight } from "lucide-react";

interface VideoSettingsPanelProps {
  node: ElementNode;
}

export function VideoSettingsPanel({ node }: VideoSettingsPanelProps) {
  const updateNodeProps = useFunnelEditorStore((s) => s.updateNodeProps);
  
  // Initialize settings from node props or use defaults
  const [settings, setSettings] = useState<VideoSettings>(() => {
    const existing = node.props.videoSettings as VideoSettings;
    if (existing) return existing;
    
    // Migrate old props to new videoSettings format
    const defaults = getDefaultVideoSettings();
    if (node.props.src) {
      defaults.source.url = node.props.src as string;
    }
    if (node.props.aspectRatio) {
      defaults.source.aspectRatio = node.props.aspectRatio as string;
    }
    if (node.props.align) {
      defaults.layout.alignment = node.props.align as any;
    }
    if (typeof node.props.controls === 'boolean') {
      defaults.controls.showControls = node.props.controls;
    }
    if (typeof node.props.autoPlay === 'boolean') {
      defaults.playback.autoplay = node.props.autoPlay;
    }
    if (typeof node.props.loop === 'boolean') {
      defaults.playback.loop = node.props.loop;
    }
    if (typeof node.props.muted === 'boolean') {
      defaults.playback.muted = node.props.muted;
    }
    
    return defaults;
  });
  
  const [currentDevice, setCurrentDevice] = useState<Device>('desktop');
  const [videoStatus, setVideoStatus] = useState<VideoStatus>('loaded');
  const [openSections, setOpenSections] = useState<string[]>(['source', 'playback']);

  // Sync settings to store
  useEffect(() => {
    updateNodeProps(node.id, { videoSettings: settings });
  }, [settings, node.id, updateNodeProps]);

  const updateSettings = (updates: Partial<VideoSettings>) => {
    setSettings(prev => ({ ...prev, ...updates }));
  };

  const toggleSection = (section: string) => {
    setOpenSections(prev =>
      prev.includes(section)
        ? prev.filter(s => s !== section)
        : [...prev, section]
    );
  };

  const validation = validateVideoSettings(settings, settings.source.provider);

  return (
    <div className="space-y-3">
      {/* Device Toggle */}
      <DeviceToggle
        currentDevice={currentDevice}
        onChange={setCurrentDevice}
        hasOverrides={{
          desktop: false,
          tablet: false,
          mobile: false,
        }}
      />

      {/* Preview Strip */}
      <PreviewStrip
        provider={settings.source.provider}
        url={settings.source.url}
        poster={settings.source.poster?.mode === 'custom' ? settings.source.poster.customUrl : undefined}
        status={videoStatus}
        onReload={() => setVideoStatus('loading')}
      />

      {/* Validation Warnings */}
      {validation.warnings.length > 0 && (
        <div className="space-y-2">
          {validation.warnings.map((warning, i) => (
            <div key={i} className="flex items-start gap-2 p-2 bg-orange-50 border border-orange-200 rounded text-xs text-orange-700">
              <span>⚠️</span>
              <span>{warning}</span>
            </div>
          ))}
        </div>
      )}

      {/* Accordion Sections */}
      <div className="space-y-3">
        {/* Source Section */}
        <div className="space-y-2">
          <button
            onClick={() => toggleSection('source')}
            className="w-full flex items-center justify-between py-2 px-3 bg-slate-50 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wide">Source</span>
            <div className="flex items-center gap-2">
              <SectionHeaderSummary summary={settings.source.provider.toUpperCase()} />
              {openSections.includes('source') ? <ChevronDown className="h-4 w-4 text-slate-500" /> : <ChevronRight className="h-4 w-4 text-slate-500" />}
            </div>
          </button>
          {openSections.includes('source') && (
            <div className="px-1">
              <SourceSection
                source={settings.source}
                onChange={(updates) => updateSettings({ source: { ...settings.source, ...updates } })}
              />
            </div>
          )}
        </div>

        {/* Playback Section */}
        <div className="space-y-2">
          <button
            onClick={() => toggleSection('playback')}
            className="w-full flex items-center justify-between py-2 px-3 bg-slate-50 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wide">Playback</span>
            <div className="flex items-center gap-2">
              <SectionHeaderSummary summary={computePlaybackSummary(settings)} />
              {openSections.includes('playback') ? <ChevronDown className="h-4 w-4 text-slate-500" /> : <ChevronRight className="h-4 w-4 text-slate-500" />}
            </div>
          </button>
          {openSections.includes('playback') && (
            <div className="px-1">
              <PlaybackSection
                playback={settings.playback}
                provider={settings.source.provider}
                onChange={(updates) => updateSettings({ playback: { ...settings.playback, ...updates } })}
              />
            </div>
          )}
        </div>

        {/* Controls & UX Section */}
        <div className="space-y-2">
          <button
            onClick={() => toggleSection('controls')}
            className="w-full flex items-center justify-between py-2 px-3 bg-slate-50 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wide">Controls & UX</span>
            <div className="flex items-center gap-2">
              <SectionHeaderSummary summary={settings.controls.showControls ? 'Controls on' : 'Controls off'} />
              {openSections.includes('controls') ? <ChevronDown className="h-4 w-4 text-slate-500" /> : <ChevronRight className="h-4 w-4 text-slate-500" />}
            </div>
          </button>
          {openSections.includes('controls') && (
            <div className="px-1">
              <ControlsSection
                controls={settings.controls}
                provider={settings.source.provider}
                onChange={(updates) => updateSettings({ controls: { ...settings.controls, ...updates } })}
              />
            </div>
          )}
        </div>

        {/* Layout & Style Section */}
        <div className="space-y-2">
          <button
            onClick={() => toggleSection('layout')}
            className="w-full flex items-center justify-between py-2 px-3 bg-slate-50 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wide">Layout & Style</span>
            <div className="flex items-center gap-2">
              <SectionHeaderSummary summary={computeLayoutSummary(settings)} />
              {openSections.includes('layout') ? <ChevronDown className="h-4 w-4 text-slate-500" /> : <ChevronRight className="h-4 w-4 text-slate-500" />}
            </div>
          </button>
          {openSections.includes('layout') && (
            <div className="px-1">
              <LayoutStyleSection
                layout={settings.layout}
                onChange={(updates) => updateSettings({ layout: { ...settings.layout, ...updates } })}
              />
            </div>
          )}
        </div>

        {/* Actions Section */}
        <div className="space-y-2">
          <button
            onClick={() => toggleSection('actions')}
            className="w-full flex items-center justify-between py-2 px-3 bg-slate-50 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wide">Actions</span>
            <div className="flex items-center gap-2">
              <SectionHeaderSummary summary={computeActionsSummary(settings)} />
              {openSections.includes('actions') ? <ChevronDown className="h-4 w-4 text-slate-500" /> : <ChevronRight className="h-4 w-4 text-slate-500" />}
            </div>
          </button>
          {openSections.includes('actions') && (
            <div className="px-1">
              <ActionsSection
                actions={settings.actions}
                isLoopEnabled={settings.playback.loop}
                onChange={(updates) => updateSettings({ actions: { ...settings.actions, ...updates } })}
              />
            </div>
          )}
        </div>

        {/* Tracking Section */}
        <div className="space-y-2">
          <button
            onClick={() => toggleSection('tracking')}
            className="w-full flex items-center justify-between py-2 px-3 bg-slate-50 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wide">Tracking</span>
            <div className="flex items-center gap-2">
              <SectionHeaderSummary summary={computeTrackingSummary(settings)} />
              {openSections.includes('tracking') ? <ChevronDown className="h-4 w-4 text-slate-500" /> : <ChevronRight className="h-4 w-4 text-slate-500" />}
            </div>
          </button>
          {openSections.includes('tracking') && (
            <div className="px-1">
              <TrackingSection
                tracking={settings.tracking}
                onChange={(updates) => updateSettings({ tracking: { ...settings.tracking, ...updates } })}
              />
            </div>
          )}
        </div>

        {/* Advanced Section */}
        <div className="space-y-2">
          <button
            onClick={() => toggleSection('advanced')}
            className="w-full flex items-center justify-between py-2 px-3 bg-slate-50 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wide">Advanced</span>
            {openSections.includes('advanced') ? <ChevronDown className="h-4 w-4 text-slate-500" /> : <ChevronRight className="h-4 w-4 text-slate-500" />}
          </button>
          {openSections.includes('advanced') && (
            <div className="px-1">
              <AdvancedSection
                advanced={settings.advanced}
                onChange={(updates) => updateSettings({ advanced: { ...settings.advanced, ...updates } })}
              />
            </div>
          )}
        </div>

        {/* Accessibility Section */}
        <div className="space-y-2">
          <button
            onClick={() => toggleSection('accessibility')}
            className="w-full flex items-center justify-between py-2 px-3 bg-slate-50 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wide">Accessibility</span>
            {openSections.includes('accessibility') ? <ChevronDown className="h-4 w-4 text-slate-500" /> : <ChevronRight className="h-4 w-4 text-slate-500" />}
          </button>
          {openSections.includes('accessibility') && (
            <div className="px-1">
              <AccessibilitySection
                accessibility={settings.accessibility}
                provider={settings.source.provider}
                onChange={(updates) => updateSettings({ accessibility: { ...settings.accessibility, ...updates } })}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

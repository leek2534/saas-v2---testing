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
    <div className="space-y-4">
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
      <div className="space-y-2">
        {/* Source Section */}
        <div className="border border-slate-200 rounded-lg overflow-hidden">
          <button
            onClick={() => toggleSection('source')}
            className="w-full px-4 py-3 flex items-center justify-between bg-white hover:bg-slate-50 transition-colors"
          >
            <span className="text-sm font-medium text-slate-900">Source</span>
            <div className="flex items-center gap-2">
              <SectionHeaderSummary summary={settings.source.provider.toUpperCase()} />
              <span className="text-slate-400">{openSections.includes('source') ? '−' : '+'}</span>
            </div>
          </button>
          {openSections.includes('source') && (
            <div className="px-4 py-3 border-t border-slate-200 bg-slate-50">
              <SourceSection
                source={settings.source}
                onChange={(updates) => updateSettings({ source: { ...settings.source, ...updates } })}
              />
            </div>
          )}
        </div>

        {/* Playback Section */}
        <div className="border border-slate-200 rounded-lg overflow-hidden">
          <button
            onClick={() => toggleSection('playback')}
            className="w-full px-4 py-3 flex items-center justify-between bg-white hover:bg-slate-50 transition-colors"
          >
            <span className="text-sm font-medium text-slate-900">Playback</span>
            <div className="flex items-center gap-2">
              <SectionHeaderSummary summary={computePlaybackSummary(settings)} />
              <span className="text-slate-400">{openSections.includes('playback') ? '−' : '+'}</span>
            </div>
          </button>
          {openSections.includes('playback') && (
            <div className="px-4 py-3 border-t border-slate-200 bg-slate-50">
              <PlaybackSection
                playback={settings.playback}
                provider={settings.source.provider}
                onChange={(updates) => updateSettings({ playback: { ...settings.playback, ...updates } })}
              />
            </div>
          )}
        </div>

        {/* Controls & UX Section */}
        <div className="border border-slate-200 rounded-lg overflow-hidden">
          <button
            onClick={() => toggleSection('controls')}
            className="w-full px-4 py-3 flex items-center justify-between bg-white hover:bg-slate-50 transition-colors"
          >
            <span className="text-sm font-medium text-slate-900">Controls & UX</span>
            <div className="flex items-center gap-2">
              <SectionHeaderSummary summary={settings.controls.showControls ? 'Controls on' : 'Controls off'} />
              <span className="text-slate-400">{openSections.includes('controls') ? '−' : '+'}</span>
            </div>
          </button>
          {openSections.includes('controls') && (
            <div className="px-4 py-3 border-t border-slate-200 bg-slate-50">
              <ControlsSection
                controls={settings.controls}
                provider={settings.source.provider}
                onChange={(updates) => updateSettings({ controls: { ...settings.controls, ...updates } })}
              />
            </div>
          )}
        </div>

        {/* Layout & Style Section */}
        <div className="border border-slate-200 rounded-lg overflow-hidden">
          <button
            onClick={() => toggleSection('layout')}
            className="w-full px-4 py-3 flex items-center justify-between bg-white hover:bg-slate-50 transition-colors"
          >
            <span className="text-sm font-medium text-slate-900">Layout & Style</span>
            <div className="flex items-center gap-2">
              <SectionHeaderSummary summary={computeLayoutSummary(settings)} />
              <span className="text-slate-400">{openSections.includes('layout') ? '−' : '+'}</span>
            </div>
          </button>
          {openSections.includes('layout') && (
            <div className="px-4 py-3 border-t border-slate-200 bg-slate-50">
              <LayoutStyleSection
                layout={settings.layout}
                onChange={(updates) => updateSettings({ layout: { ...settings.layout, ...updates } })}
              />
            </div>
          )}
        </div>

        {/* Actions Section */}
        <div className="border border-slate-200 rounded-lg overflow-hidden">
          <button
            onClick={() => toggleSection('actions')}
            className="w-full px-4 py-3 flex items-center justify-between bg-white hover:bg-slate-50 transition-colors"
          >
            <span className="text-sm font-medium text-slate-900">Actions</span>
            <div className="flex items-center gap-2">
              <SectionHeaderSummary summary={computeActionsSummary(settings)} />
              <span className="text-slate-400">{openSections.includes('actions') ? '−' : '+'}</span>
            </div>
          </button>
          {openSections.includes('actions') && (
            <div className="px-4 py-3 border-t border-slate-200 bg-slate-50">
              <ActionsSection
                actions={settings.actions}
                isLoopEnabled={settings.playback.loop}
                onChange={(updates) => updateSettings({ actions: { ...settings.actions, ...updates } })}
              />
            </div>
          )}
        </div>

        {/* Tracking Section */}
        <div className="border border-slate-200 rounded-lg overflow-hidden">
          <button
            onClick={() => toggleSection('tracking')}
            className="w-full px-4 py-3 flex items-center justify-between bg-white hover:bg-slate-50 transition-colors"
          >
            <span className="text-sm font-medium text-slate-900">Tracking</span>
            <div className="flex items-center gap-2">
              <SectionHeaderSummary summary={computeTrackingSummary(settings)} />
              <span className="text-slate-400">{openSections.includes('tracking') ? '−' : '+'}</span>
            </div>
          </button>
          {openSections.includes('tracking') && (
            <div className="px-4 py-3 border-t border-slate-200 bg-slate-50">
              <TrackingSection
                tracking={settings.tracking}
                onChange={(updates) => updateSettings({ tracking: { ...settings.tracking, ...updates } })}
              />
            </div>
          )}
        </div>

        {/* Advanced Section */}
        <div className="border border-slate-200 rounded-lg overflow-hidden">
          <button
            onClick={() => toggleSection('advanced')}
            className="w-full px-4 py-3 flex items-center justify-between bg-white hover:bg-slate-50 transition-colors"
          >
            <span className="text-sm font-medium text-slate-900">Advanced</span>
            <div className="flex items-center gap-2">
              <span className="text-slate-400">{openSections.includes('advanced') ? '−' : '+'}</span>
            </div>
          </button>
          {openSections.includes('advanced') && (
            <div className="px-4 py-3 border-t border-slate-200 bg-slate-50">
              <AdvancedSection
                advanced={settings.advanced}
                onChange={(updates) => updateSettings({ advanced: { ...settings.advanced, ...updates } })}
              />
            </div>
          )}
        </div>

        {/* Accessibility Section */}
        <div className="border border-slate-200 rounded-lg overflow-hidden">
          <button
            onClick={() => toggleSection('accessibility')}
            className="w-full px-4 py-3 flex items-center justify-between bg-white hover:bg-slate-50 transition-colors"
          >
            <span className="text-sm font-medium text-slate-900">Accessibility</span>
            <div className="flex items-center gap-2">
              <span className="text-slate-400">{openSections.includes('accessibility') ? '−' : '+'}</span>
            </div>
          </button>
          {openSections.includes('accessibility') && (
            <div className="px-4 py-3 border-t border-slate-200 bg-slate-50">
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

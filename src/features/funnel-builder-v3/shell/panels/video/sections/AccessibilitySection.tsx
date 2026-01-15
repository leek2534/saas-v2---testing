"use client";

import React from "react";
import type { AccessibilitySettings, VideoProvider } from "../types";
import { getProviderCapabilities } from "../capabilities";

interface AccessibilitySectionProps {
  accessibility: AccessibilitySettings;
  provider: VideoProvider;
  onChange: (accessibility: Partial<AccessibilitySettings>) => void;
  disabled?: boolean;
}

export function AccessibilitySection({ accessibility, provider, onChange, disabled }: AccessibilitySectionProps) {
  const capabilities = getProviderCapabilities(provider);

  return (
    <div className="space-y-4">
      {/* Accessible Label */}
      <div className="space-y-2">
        <label className="text-xs font-medium text-slate-700">Accessible Label</label>
        <div className="text-xs text-slate-500 mb-2">Required if controls are hidden</div>
        <input
          type="text"
          value={accessibility.accessibleLabel || ''}
          onChange={(e) => onChange({ accessibleLabel: e.target.value })}
          disabled={disabled}
          placeholder="e.g., Product demonstration video"
          className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg"
        />
      </div>

      {/* Captions */}
      <div className="space-y-2">
        <label className="text-xs font-medium text-slate-700">Captions</label>
        
        {capabilities.supportsCaptionsUpload ? (
          <div className="space-y-2">
            <div className="text-xs text-slate-500">Upload VTT file or provide URL</div>
            <input
              type="text"
              value={accessibility.captions?.vttUrl || ''}
              onChange={(e) => onChange({ captions: { ...accessibility.captions, vttUrl: e.target.value } })}
              disabled={disabled}
              placeholder="https://example.com/captions.vtt"
              className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg"
            />
            <div className="text-xs text-slate-400">Or upload VTT file (TODO: implement upload)</div>
          </div>
        ) : (
          <div className="flex items-start gap-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <span className="text-blue-600 text-sm">ℹ️</span>
            <div className="flex-1">
              <div className="text-xs font-medium text-blue-700">Provider-managed captions</div>
              <div className="text-xs text-blue-600 mt-0.5">
                Captions are managed through {provider === 'youtube' ? 'YouTube' : provider === 'vimeo' ? 'Vimeo' : 'the video provider'} settings
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Disable Autoplay on Reduced Motion */}
      <div className="flex items-center justify-between">
        <div>
          <div className="text-sm font-medium text-slate-700">Respect Reduced Motion</div>
          <div className="text-xs text-slate-500">Disable autoplay for users who prefer reduced motion</div>
        </div>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={accessibility.disableAutoplayOnReducedMotion}
            onChange={(e) => onChange({ disableAutoplayOnReducedMotion: e.target.checked })}
            disabled={disabled}
            className="sr-only peer"
          />
          <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
        </label>
      </div>

      {/* Accessibility Best Practices */}
      <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
        <div className="text-xs font-medium text-slate-700 mb-2">Accessibility Best Practices</div>
        <ul className="text-xs text-slate-600 space-y-1 list-disc list-inside">
          <li>Provide captions for all video content</li>
          <li>Include an accessible label if controls are hidden</li>
          <li>Ensure sufficient color contrast for overlays</li>
          <li>Allow keyboard navigation for all controls</li>
          <li>Respect user's motion preferences</li>
        </ul>
      </div>
    </div>
  );
}

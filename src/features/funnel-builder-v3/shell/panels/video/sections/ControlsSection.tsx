"use client";

import React from "react";
import type { ControlsSettings, VideoProvider, ClickBehavior } from "../types";
import { getProviderCapabilities } from "../capabilities";

interface ControlsSectionProps {
  controls: ControlsSettings;
  provider: VideoProvider;
  onChange: (controls: Partial<ControlsSettings>) => void;
  disabled?: boolean;
}

export function ControlsSection({ controls, provider, onChange, disabled }: ControlsSectionProps) {
  const [showAdvanced, setShowAdvanced] = React.useState(false);
  const capabilities = getProviderCapabilities(provider);

  // Show usability warning
  const showUsabilityWarning = !controls.showControls && controls.clickBehavior === 'none';

  return (
    <div className="space-y-4">
      {/* Usability Warning */}
      {showUsabilityWarning && (
        <div className="flex items-start gap-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <span className="text-blue-600 text-sm">ℹ️</span>
          <div className="flex-1">
            <div className="text-xs font-medium text-blue-700">Usability concern</div>
            <div className="text-xs text-blue-600 mt-0.5">
              Video has no controls and no click behavior. Users cannot interact with it.
            </div>
          </div>
        </div>
      )}

      {/* Show Controls */}
      <div className="flex items-center justify-between">
        <div>
          <div className="text-sm font-medium text-slate-700">Show Controls</div>
          <div className="text-xs text-slate-500">Display play/pause and volume controls</div>
        </div>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={controls.showControls}
            onChange={(e) => onChange({ showControls: e.target.checked })}
            disabled={disabled || !capabilities.supportsControls}
            className="sr-only peer"
          />
          <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
        </label>
      </div>

      {/* Show Big Play Overlay */}
      <div className="flex items-center justify-between">
        <div>
          <div className="text-sm font-medium text-slate-700">Show Big Play Overlay</div>
          <div className="text-xs text-slate-500">Large play button before video starts</div>
        </div>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={controls.showBigPlayOverlay}
            onChange={(e) => onChange({ showBigPlayOverlay: e.target.checked })}
            disabled={disabled}
            className="sr-only peer"
          />
          <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
        </label>
      </div>

      {/* Allow Fullscreen */}
      <div className="flex items-center justify-between">
        <div>
          <div className="text-sm font-medium text-slate-700">Allow Fullscreen</div>
          <div className="text-xs text-slate-500">Enable fullscreen button</div>
        </div>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={controls.allowFullscreen}
            onChange={(e) => onChange({ allowFullscreen: e.target.checked })}
            disabled={disabled}
            className="sr-only peer"
          />
          <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
        </label>
      </div>

      {/* Click Behavior */}
      <div className="space-y-2">
        <label className="text-xs font-medium text-slate-700">Click Behavior</label>
        <select
          value={controls.clickBehavior}
          onChange={(e) => onChange({ clickBehavior: e.target.value as ClickBehavior })}
          disabled={disabled || !capabilities.supportsClickBehavior}
          className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg"
        >
          <option value="toggle-play">Toggle play/pause</option>
          <option value="lightbox">Open lightbox</option>
          <option value="url">Go to URL</option>
          <option value="none">None</option>
        </select>
      </div>

      {/* Click URL (if behavior is URL) */}
      {controls.clickBehavior === 'url' && (
        <div className="space-y-2">
          <label className="text-xs font-medium text-slate-700">Click URL</label>
          <input
            type="text"
            value={controls.clickUrl || ''}
            onChange={(e) => onChange({ clickUrl: e.target.value })}
            disabled={disabled}
            placeholder="https://..."
            className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg"
          />
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={controls.clickOpenNewTab || false}
              onChange={(e) => onChange({ clickOpenNewTab: e.target.checked })}
              disabled={disabled}
              className="w-4 h-4 rounded border-slate-300 text-blue-600"
            />
            <span className="text-sm text-slate-700">Open in new tab</span>
          </label>
        </div>
      )}

      {/* Pause Other Videos */}
      <div className="flex items-center justify-between">
        <div>
          <div className="text-sm font-medium text-slate-700">Pause Other Videos</div>
          <div className="text-xs text-slate-500">Pause other videos when this one plays</div>
        </div>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={controls.pauseOtherVideos}
            onChange={(e) => onChange({ pauseOtherVideos: e.target.checked })}
            disabled={disabled}
            className="sr-only peer"
          />
          <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
        </label>
      </div>

      {/* Advanced Options */}
      <button
        onClick={() => setShowAdvanced(!showAdvanced)}
        className="text-xs font-medium text-blue-600 hover:text-blue-700"
      >
        {showAdvanced ? '− Hide' : '+ Show'} Advanced Options
      </button>

      {showAdvanced && (
        <div className="space-y-4 pl-4 border-l-2 border-slate-200">
          {/* Picture-in-Picture */}
          {capabilities.supportsPiP && (
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={controls.pictureInPicture || false}
                onChange={(e) => onChange({ pictureInPicture: e.target.checked })}
                disabled={disabled}
                className="w-4 h-4 rounded border-slate-300 text-blue-600"
              />
              <span className="text-sm text-slate-700">Enable picture-in-picture</span>
            </label>
          )}

          {/* Disable Right-Click (MP4 only) */}
          {capabilities.supportsDisableDownload && (
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={controls.disableRightClick || false}
                onChange={(e) => onChange({ disableRightClick: e.target.checked })}
                disabled={disabled}
                className="w-4 h-4 rounded border-slate-300 text-blue-600"
              />
              <span className="text-sm text-slate-700">Disable right-click / download</span>
            </label>
          )}

          {/* Show Progress Bar */}
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={controls.showProgressBar || false}
              onChange={(e) => onChange({ showProgressBar: e.target.checked })}
              disabled={disabled}
              className="w-4 h-4 rounded border-slate-300 text-blue-600"
            />
            <span className="text-sm text-slate-700">Show custom progress bar</span>
          </label>

          {/* Show Unmute Hint */}
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={controls.showUnmuteHint || false}
              onChange={(e) => onChange({ showUnmuteHint: e.target.checked })}
              disabled={disabled}
              className="w-4 h-4 rounded border-slate-300 text-blue-600"
            />
            <span className="text-sm text-slate-700">Show unmute hint (if autoplay + muted)</span>
          </label>
        </div>
      )}
    </div>
  );
}

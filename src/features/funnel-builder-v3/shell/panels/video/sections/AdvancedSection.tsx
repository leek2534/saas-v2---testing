"use client";

import React from "react";
import type { AdvancedSettings, StickyPosition, StickySize, UnlockTarget, LoadingStyle } from "../types";

interface AdvancedSectionProps {
  advanced: AdvancedSettings;
  onChange: (advanced: Partial<AdvancedSettings>) => void;
  disabled?: boolean;
}

export function AdvancedSection({ advanced, onChange, disabled }: AdvancedSectionProps) {
  const updatePerformance = (updates: Partial<typeof advanced.performance>) => {
    onChange({ performance: { ...advanced.performance, ...updates } });
  };

  const updateCompliance = (updates: Partial<typeof advanced.compliance>) => {
    onChange({ compliance: { ...advanced.compliance, ...updates } });
  };

  const updateResilience = (updates: Partial<typeof advanced.resilience>) => {
    onChange({ resilience: { ...advanced.resilience, ...updates } });
  };

  const updateStickyMiniPlayer = (updates: Partial<typeof advanced.stickyMiniPlayer>) => {
    onChange({ stickyMiniPlayer: { ...advanced.stickyMiniPlayer, ...updates } as any });
  };

  const updateWatchGating = (updates: Partial<typeof advanced.watchGating>) => {
    onChange({ watchGating: { ...advanced.watchGating, ...updates } as any });
  };

  return (
    <div className="space-y-6">
      {/* Performance */}
      <div className="space-y-3">
        <div className="text-xs font-semibold text-slate-700 uppercase tracking-wide">Performance</div>
        
        <label className="flex items-center justify-between">
          <div>
            <div className="text-sm font-medium text-slate-700">Lazy Load</div>
            <div className="text-xs text-slate-500">Load video only when needed</div>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={advanced.performance.lazyLoad}
              onChange={(e) => updatePerformance({ lazyLoad: e.target.checked })}
              disabled={disabled}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        </label>

        <label className="flex items-center justify-between">
          <div>
            <div className="text-sm font-medium text-slate-700">Load Only in Viewport</div>
            <div className="text-xs text-slate-500">Wait until video is visible</div>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={advanced.performance.loadOnlyInViewport}
              onChange={(e) => updatePerformance({ loadOnlyInViewport: e.target.checked })}
              disabled={disabled}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        </label>

        <label className="flex items-center justify-between">
          <div>
            <div className="text-sm font-medium text-slate-700">Preconnect to Domains</div>
            <div className="text-xs text-slate-500">Speed up provider connections</div>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={advanced.performance.preconnectToDomains}
              onChange={(e) => updatePerformance({ preconnectToDomains: e.target.checked })}
              disabled={disabled}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        </label>
      </div>

      {/* Compliance */}
      <div className="space-y-3">
        <div className="text-xs font-semibold text-slate-700 uppercase tracking-wide">Compliance</div>
        
        <label className="flex items-center justify-between">
          <div>
            <div className="text-sm font-medium text-slate-700">Consent Gating</div>
            <div className="text-xs text-slate-500">Require consent before loading</div>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={advanced.compliance.consentGating}
              onChange={(e) => updateCompliance({ consentGating: e.target.checked })}
              disabled={disabled}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        </label>

        {advanced.compliance.consentGating && !advanced.compliance.consentGranted && (
          <div className="flex items-start gap-2 p-3 bg-orange-50 border border-orange-200 rounded-lg">
            <span className="text-orange-600 text-sm">⚠️</span>
            <div className="flex-1">
              <div className="text-xs font-medium text-orange-700">Consent required</div>
              <div className="text-xs text-orange-600 mt-0.5">
                Video will be blocked until user grants consent
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Resilience */}
      <div className="space-y-3">
        <div className="text-xs font-semibold text-slate-700 uppercase tracking-wide">Resilience</div>
        
        <div className="space-y-2">
          <label className="text-xs font-medium text-slate-700">Loading Style</label>
          <select
            value={advanced.resilience.loadingStyle}
            onChange={(e) => updateResilience({ loadingStyle: e.target.value as LoadingStyle })}
            disabled={disabled}
            className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg"
          >
            <option value="spinner">Spinner</option>
            <option value="none">None</option>
          </select>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-medium text-slate-700">Error Fallback</label>
          <div className="space-y-2">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={advanced.resilience.errorFallback.showPoster}
                onChange={(e) => updateResilience({
                  errorFallback: { ...advanced.resilience.errorFallback, showPoster: e.target.checked }
                })}
                disabled={disabled}
                className="w-4 h-4 rounded border-slate-300 text-blue-600"
              />
              <span className="text-sm text-slate-700">Show poster on error</span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={advanced.resilience.errorFallback.showMessage}
                onChange={(e) => updateResilience({
                  errorFallback: { ...advanced.resilience.errorFallback, showMessage: e.target.checked }
                })}
                disabled={disabled}
                className="w-4 h-4 rounded border-slate-300 text-blue-600"
              />
              <span className="text-sm text-slate-700">Show error message</span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={advanced.resilience.errorFallback.showRetry}
                onChange={(e) => updateResilience({
                  errorFallback: { ...advanced.resilience.errorFallback, showRetry: e.target.checked }
                })}
                disabled={disabled}
                className="w-4 h-4 rounded border-slate-300 text-blue-600"
              />
              <span className="text-sm text-slate-700">Show retry button</span>
            </label>
          </div>
        </div>
      </div>

      {/* Sticky Mini-Player */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="text-xs font-semibold text-slate-700 uppercase tracking-wide">Sticky Mini-Player</div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={advanced.stickyMiniPlayer?.enabled || false}
              onChange={(e) => updateStickyMiniPlayer({ enabled: e.target.checked })}
              disabled={disabled}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        </div>

        {advanced.stickyMiniPlayer?.enabled && (
          <div className="space-y-3 pl-4 border-l-2 border-slate-200">
            <div className="space-y-2">
              <label className="text-xs font-medium text-slate-700">Trigger</label>
              <select
                value={advanced.stickyMiniPlayer.trigger.mode}
                onChange={(e) => updateStickyMiniPlayer({
                  trigger: { ...advanced.stickyMiniPlayer.trigger, mode: e.target.value as any }
                })}
                disabled={disabled}
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg"
              >
                <option value="scroll-past">After scroll past video</option>
                <option value="after-seconds">After N seconds</option>
              </select>
            </div>

            {advanced.stickyMiniPlayer.trigger.mode === 'after-seconds' && (
              <div className="space-y-1">
                <label className="text-xs text-slate-600">Seconds</label>
                <input
                  type="number"
                  value={advanced.stickyMiniPlayer.trigger.seconds || 5}
                  onChange={(e) => updateStickyMiniPlayer({
                    trigger: { ...advanced.stickyMiniPlayer.trigger, seconds: Number(e.target.value) }
                  })}
                  disabled={disabled}
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg"
                />
              </div>
            )}

            <div className="space-y-2">
              <label className="text-xs font-medium text-slate-700">Position</label>
              <div className="grid grid-cols-2 gap-2">
                {(['bottom-right', 'bottom-left'] as StickyPosition[]).map((pos) => (
                  <button
                    key={pos}
                    onClick={() => updateStickyMiniPlayer({ position: pos })}
                    disabled={disabled}
                    className={`px-3 py-2 text-xs font-medium rounded-lg border-2 transition-all ${
                      advanced.stickyMiniPlayer?.position === pos
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-slate-200 hover:border-slate-300 text-slate-600'
                    }`}
                  >
                    {pos.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-medium text-slate-700">Size</label>
              <div className="grid grid-cols-3 gap-2">
                {(['small', 'medium', 'custom'] as StickySize[]).map((size) => (
                  <button
                    key={size}
                    onClick={() => updateStickyMiniPlayer({ size })}
                    disabled={disabled}
                    className={`px-3 py-2 text-xs font-medium rounded-lg border-2 transition-all ${
                      advanced.stickyMiniPlayer?.size === size
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-slate-200 hover:border-slate-300 text-slate-600'
                    }`}
                  >
                    {size.charAt(0).toUpperCase() + size.slice(1)}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Watch Gating */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="text-xs font-semibold text-slate-700 uppercase tracking-wide">Watch Gating</div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={advanced.watchGating?.enabled || false}
              onChange={(e) => updateWatchGating({ enabled: e.target.checked })}
              disabled={disabled}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        </div>

        {advanced.watchGating?.enabled && (
          <div className="space-y-3 pl-4 border-l-2 border-slate-200">
            <div className="space-y-2">
              <label className="text-xs font-medium text-slate-700">Required Watch %</label>
              <input
                type="number"
                min={0}
                max={100}
                value={advanced.watchGating.requiredPercent}
                onChange={(e) => updateWatchGating({ requiredPercent: Number(e.target.value) })}
                disabled={disabled}
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-medium text-slate-700">Unlock Target</label>
              <select
                value={advanced.watchGating.unlockTarget}
                onChange={(e) => updateWatchGating({ unlockTarget: e.target.value as UnlockTarget })}
                disabled={disabled}
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg"
              >
                <option value="enable-cta">Enable CTA</option>
                <option value="reveal-element">Reveal element</option>
                <option value="unlock-next-step">Unlock next step</option>
              </select>
            </div>

            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={advanced.watchGating.onlyCountWhenTabActive}
                onChange={(e) => updateWatchGating({ onlyCountWhenTabActive: e.target.checked })}
                disabled={disabled}
                className="w-4 h-4 rounded border-slate-300 text-blue-600"
              />
              <span className="text-sm text-slate-700">Only count when tab is active</span>
            </label>

            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={advanced.watchGating.preventSeeking}
                onChange={(e) => updateWatchGating({ preventSeeking: e.target.checked })}
                disabled={disabled}
                className="w-4 h-4 rounded border-slate-300 text-blue-600"
              />
              <span className="text-sm text-slate-700">Prevent seeking past required %</span>
            </label>
          </div>
        )}
      </div>
    </div>
  );
}

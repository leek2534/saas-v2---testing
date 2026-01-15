"use client";

import React from "react";
import type { PlaybackSettings, VideoProvider } from "../types";
import { getProviderCapabilities } from "../capabilities";
import { parseTime, formatTime } from "../utils";

interface PlaybackSectionProps {
  playback: PlaybackSettings;
  provider: VideoProvider;
  onChange: (playback: Partial<PlaybackSettings>) => void;
  disabled?: boolean;
}

export function PlaybackSection({ playback, provider, onChange, disabled }: PlaybackSectionProps) {
  const [showAdvanced, setShowAdvanced] = React.useState(false);
  const capabilities = getProviderCapabilities(provider);

  const [startTimeStr, setStartTimeStr] = React.useState(
    playback.startTime ? formatTime(playback.startTime) : ''
  );
  const [endTimeStr, setEndTimeStr] = React.useState(
    playback.endTime ? formatTime(playback.endTime) : ''
  );

  const handleStartTimeChange = (value: string) => {
    setStartTimeStr(value);
    const seconds = parseTime(value);
    if (seconds !== null) {
      onChange({ startTime: seconds });
    }
  };

  const handleEndTimeChange = (value: string) => {
    setEndTimeStr(value);
    const seconds = parseTime(value);
    if (seconds !== null) {
      onChange({ endTime: seconds });
    }
  };

  // Show autoplay warning
  const showAutoplayWarning = playback.autoplay && !playback.muted;

  return (
    <div className="space-y-4">
      {/* Autoplay Warning */}
      {showAutoplayWarning && (
        <div className="flex items-start gap-2 p-3 bg-orange-50 border border-orange-200 rounded-lg">
          <span className="text-orange-600 text-sm">⚠️</span>
          <div className="flex-1">
            <div className="text-xs font-medium text-orange-700">Autoplay requires muted</div>
            <div className="text-xs text-orange-600 mt-0.5">
              Browsers block unmuted autoplay. Muted has been enabled automatically.
            </div>
          </div>
        </div>
      )}

      {/* Autoplay */}
      <div className="flex items-center justify-between">
        <div>
          <div className="text-sm font-medium text-slate-700">Autoplay</div>
          <div className="text-xs text-slate-500">Start playing automatically when visible</div>
        </div>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={playback.autoplay}
            onChange={(e) => {
              const newAutoplay = e.target.checked;
              if (newAutoplay && !playback.muted) {
                // Enforce muted when enabling autoplay
                onChange({ autoplay: true, muted: true });
              } else {
                onChange({ autoplay: newAutoplay });
              }
            }}
            disabled={disabled || !capabilities.supportsAutoplay}
            className="sr-only peer"
          />
          <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
        </label>
      </div>

      {/* Muted */}
      <div className="flex items-center justify-between">
        <div>
          <div className="text-sm font-medium text-slate-700">Muted</div>
          <div className="text-xs text-slate-500">Start with audio muted</div>
        </div>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={playback.muted}
            onChange={(e) => onChange({ muted: e.target.checked })}
            disabled={disabled || playback.autoplay}
            className="sr-only peer"
          />
          <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
        </label>
      </div>

      {/* Loop */}
      <div className="flex items-center justify-between">
        <div>
          <div className="text-sm font-medium text-slate-700">Loop</div>
          <div className="text-xs text-slate-500">Restart video when it ends</div>
        </div>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={playback.loop}
            onChange={(e) => onChange({ loop: e.target.checked })}
            disabled={disabled || !capabilities.supportsLoop}
            className="sr-only peer"
          />
          <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
        </label>
      </div>

      {/* Plays Inline */}
      <div className="flex items-center justify-between">
        <div>
          <div className="text-sm font-medium text-slate-700">Plays Inline</div>
          <div className="text-xs text-slate-500">Play in page (important for mobile)</div>
        </div>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={playback.playsInline}
            onChange={(e) => onChange({ playsInline: e.target.checked })}
            disabled={disabled || !capabilities.supportsPlaysInline}
            className="sr-only peer"
          />
          <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
        </label>
      </div>

      {/* Start/End Time */}
      {capabilities.supportsStartEndTime && (
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <label className="text-xs font-medium text-slate-700">Start Time</label>
            <input
              type="text"
              value={startTimeStr}
              onChange={(e) => handleStartTimeChange(e.target.value)}
              disabled={disabled}
              placeholder="0:00"
              className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg"
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-medium text-slate-700">End Time</label>
            <input
              type="text"
              value={endTimeStr}
              onChange={(e) => handleEndTimeChange(e.target.value)}
              disabled={disabled}
              placeholder="0:00"
              className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg"
            />
          </div>
        </div>
      )}

      {/* Playback Speed */}
      {capabilities.supportsSpeed && (
        <div className="space-y-2">
          <label className="text-xs font-medium text-slate-700">Playback Speed</label>
          <select
            value={playback.playbackSpeed}
            onChange={(e) => onChange({ playbackSpeed: Number(e.target.value) })}
            disabled={disabled}
            className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg"
          >
            <option value={0.5}>0.5x</option>
            <option value={0.75}>0.75x</option>
            <option value={1}>1x (Normal)</option>
            <option value={1.25}>1.25x</option>
            <option value={1.5}>1.5x</option>
            <option value={2}>2x</option>
          </select>
        </div>
      )}

      {/* Advanced Options */}
      <button
        onClick={() => setShowAdvanced(!showAdvanced)}
        className="text-xs font-medium text-blue-600 hover:text-blue-700"
      >
        {showAdvanced ? '− Hide' : '+ Show'} Advanced Options
      </button>

      {showAdvanced && (
        <div className="space-y-4 pl-4 border-l-2 border-slate-200">
          {/* Preload (MP4 only) */}
          {capabilities.supportsPreload && (
            <div className="space-y-2">
              <label className="text-xs font-medium text-slate-700">Preload</label>
              <select
                value={playback.preload || 'metadata'}
                onChange={(e) => onChange({ preload: e.target.value as any })}
                disabled={disabled}
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg"
              >
                <option value="none">None</option>
                <option value="metadata">Metadata only</option>
                <option value="auto">Auto</option>
              </select>
            </div>
          )}

          {/* Disable Autoplay on Mobile */}
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={playback.disableAutoplayOnMobile || false}
              onChange={(e) => onChange({ disableAutoplayOnMobile: e.target.checked })}
              disabled={disabled}
              className="w-4 h-4 rounded border-slate-300 text-blue-600"
            />
            <span className="text-sm text-slate-700">Disable autoplay on mobile</span>
          </label>

          {/* Respect Reduced Motion */}
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={playback.respectReducedMotion}
              onChange={(e) => onChange({ respectReducedMotion: e.target.checked })}
              disabled={disabled}
              className="w-4 h-4 rounded border-slate-300 text-blue-600"
            />
            <span className="text-sm text-slate-700">Respect prefers-reduced-motion</span>
          </label>
        </div>
      )}
    </div>
  );
}

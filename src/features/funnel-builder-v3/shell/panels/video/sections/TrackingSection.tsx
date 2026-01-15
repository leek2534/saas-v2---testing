"use client";

import React from "react";
import type { TrackingSettings, TrackingDestination } from "../types";
import { generateTrackingId, copyToClipboard } from "../utils";

interface TrackingSectionProps {
  tracking: TrackingSettings;
  onChange: (tracking: Partial<TrackingSettings>) => void;
  disabled?: boolean;
}

export function TrackingSection({ tracking, onChange, disabled }: TrackingSectionProps) {
  const [showAdvanced, setShowAdvanced] = React.useState(false);
  const [copied, setCopied] = React.useState(false);

  const handleCopyTrackingId = async () => {
    const id = tracking.trackingId || generateTrackingId();
    if (!tracking.trackingId) {
      onChange({ trackingId: id });
    }
    const success = await copyToClipboard(id);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const updateMilestones = (milestone: keyof typeof tracking.milestones, value: boolean) => {
    onChange({
      milestones: {
        ...tracking.milestones,
        [milestone]: value,
      },
    });
  };

  return (
    <div className="space-y-4">
      {/* Tracking Toggle */}
      <div className="flex items-center justify-between">
        <div>
          <div className="text-sm font-medium text-slate-700">Enable Tracking</div>
          <div className="text-xs text-slate-500">Track video engagement and milestones</div>
        </div>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={tracking.enabled}
            onChange={(e) => onChange({ enabled: e.target.checked })}
            disabled={disabled}
            className="sr-only peer"
          />
          <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
        </label>
      </div>

      {tracking.enabled && (
        <>
          {/* Video Label */}
          <div className="space-y-2">
            <label className="text-xs font-medium text-slate-700">Video Label (for reporting)</label>
            <input
              type="text"
              value={tracking.videoLabel || ''}
              onChange={(e) => onChange({ videoLabel: e.target.value })}
              disabled={disabled}
              placeholder="e.g., Product Demo Video"
              className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg"
            />
          </div>

          {/* Milestones */}
          <div className="space-y-2">
            <label className="text-xs font-medium text-slate-700">Track Milestones</label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { key: 'percent25' as const, label: '25%' },
                { key: 'percent50' as const, label: '50%' },
                { key: 'percent75' as const, label: '75%' },
                { key: 'percent100' as const, label: '100%' },
              ].map((milestone) => (
                <label key={milestone.key} className="flex items-center gap-2 p-2 border border-slate-200 rounded-lg hover:bg-slate-50">
                  <input
                    type="checkbox"
                    checked={tracking.milestones[milestone.key]}
                    onChange={(e) => updateMilestones(milestone.key, e.target.checked)}
                    disabled={disabled}
                    className="w-4 h-4 rounded border-slate-300 text-blue-600"
                  />
                  <span className="text-sm text-slate-700">{milestone.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Tracking ID */}
          <div className="space-y-2">
            <label className="text-xs font-medium text-slate-700">Tracking ID</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={tracking.trackingId || 'Not generated'}
                disabled
                className="flex-1 px-3 py-2 text-sm border border-slate-200 rounded-lg bg-slate-50 text-slate-600"
              />
              <button
                onClick={handleCopyTrackingId}
                className="px-3 py-2 text-xs font-medium border border-slate-200 rounded-lg hover:bg-slate-50"
              >
                {copied ? '✓ Copied' : 'Copy'}
              </button>
            </div>
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
              {/* Event Name Prefix */}
              <div className="space-y-2">
                <label className="text-xs font-medium text-slate-700">Event Name Prefix</label>
                <input
                  type="text"
                  value={tracking.eventNamePrefix || ''}
                  onChange={(e) => onChange({ eventNamePrefix: e.target.value })}
                  disabled={disabled}
                  placeholder="video_"
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg"
                />
              </div>

              {/* Destinations */}
              <div className="space-y-2">
                <label className="text-xs font-medium text-slate-700">Destinations</label>
                <div className="space-y-2">
                  {(['internal', 'pixel', 'webhook'] as TrackingDestination[]).map((dest) => (
                    <label key={dest} className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={tracking.destinations.includes(dest)}
                        onChange={(e) => {
                          const newDests = e.target.checked
                            ? [...tracking.destinations, dest]
                            : tracking.destinations.filter(d => d !== dest);
                          onChange({ destinations: newDests });
                        }}
                        disabled={disabled}
                        className="w-4 h-4 rounded border-slate-300 text-blue-600"
                      />
                      <span className="text-sm text-slate-700 capitalize">{dest}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Anti-Abuse */}
              <div className="space-y-2">
                <label className="text-xs font-medium text-slate-700">Anti-Abuse</label>
                <div className="space-y-2">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={tracking.antiAbuse.onlyWhenTabActive}
                      onChange={(e) => onChange({
                        antiAbuse: { ...tracking.antiAbuse, onlyWhenTabActive: e.target.checked }
                      })}
                      disabled={disabled}
                      className="w-4 h-4 rounded border-slate-300 text-blue-600"
                    />
                    <span className="text-sm text-slate-700">Only count when tab is active</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={tracking.antiAbuse.requireActualPlayback}
                      onChange={(e) => onChange({
                        antiAbuse: { ...tracking.antiAbuse, requireActualPlayback: e.target.checked }
                      })}
                      disabled={disabled}
                      className="w-4 h-4 rounded border-slate-300 text-blue-600"
                    />
                    <span className="text-sm text-slate-700">Require actual playback (not just seeking)</span>
                  </label>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

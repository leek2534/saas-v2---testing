"use client";

import React, { useState } from "react";
import type { VideoProvider, VideoStatus } from "../types";
import { getProviderDisplayName, getProviderBadgeColor } from "../capabilities";

interface PreviewStripProps {
  provider: VideoProvider;
  url?: string;
  poster?: string;
  status: VideoStatus;
  onReload?: () => void;
}

export function PreviewStrip({ provider, url, poster, status, onReload }: PreviewStripProps) {
  const [showPreview, setShowPreview] = useState(false);

  const statusConfig = {
    loaded: { icon: "✅", text: "Loaded", color: "text-green-600" },
    loading: { icon: "⏳", text: "Loading", color: "text-blue-600" },
    blocked: { icon: "⚠️", text: "Blocked", color: "text-orange-600" },
    error: { icon: "❌", text: "Error", color: "text-red-600" },
  };

  const currentStatus = statusConfig[status];
  const badgeColor = getProviderBadgeColor(provider);

  return (
    <div className="space-y-2 pb-3 border-b border-slate-200">
      {/* Preview Toggle & Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <label className="flex items-center gap-2 text-xs font-medium text-slate-700">
            <input
              type="checkbox"
              checked={showPreview}
              onChange={(e) => setShowPreview(e.target.checked)}
              className="w-3.5 h-3.5 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
            />
            Preview
          </label>
          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${badgeColor}`}>
            {getProviderDisplayName(provider)}
          </span>
        </div>
        <button
          onClick={onReload}
          className="text-xs text-slate-600 hover:text-slate-900 px-2 py-1 rounded hover:bg-slate-100"
        >
          Reload
        </button>
      </div>

      {/* Preview Area */}
      <div className="relative rounded-lg border border-slate-200 bg-slate-50 overflow-hidden">
        {showPreview && url ? (
          <div className="aspect-video w-full">
            {status === "loading" ? (
              <div className="w-full h-full flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
            ) : (
              <div className="w-full h-full bg-black flex items-center justify-center text-white text-sm">
                Video Preview ({provider})
              </div>
            )}
          </div>
        ) : (
          <div className="aspect-video w-full flex items-center justify-center">
            {poster ? (
              <img src={poster} alt="Video poster" className="w-full h-full object-cover" />
            ) : (
              <div className="text-slate-400 text-sm">No preview available</div>
            )}
          </div>
        )}
      </div>

      {/* Status Line */}
      <div className="flex items-center justify-between text-xs">
        <span className={`flex items-center gap-1.5 font-medium ${currentStatus.color}`}>
          <span>{currentStatus.icon}</span>
          <span>{currentStatus.text}</span>
        </span>
        {status === "blocked" && (
          <span className="text-slate-500">Third-party cookies or consent required</span>
        )}
      </div>
    </div>
  );
}

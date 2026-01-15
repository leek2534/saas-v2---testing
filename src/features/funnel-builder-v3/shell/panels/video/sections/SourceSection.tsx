"use client";

import React from "react";
import type { VideoSource, VideoProvider } from "../types";
import { detectProviderFromUrl, getProviderDisplayName } from "../capabilities";

interface SourceSectionProps {
  source: VideoSource;
  onChange: (source: Partial<VideoSource>) => void;
  disabled?: boolean;
}

export function SourceSection({ source, onChange, disabled }: SourceSectionProps) {
  const [showAdvanced, setShowAdvanced] = React.useState(false);

  const handleUrlChange = (url: string) => {
    const detectedProvider = detectProviderFromUrl(url);
    if (detectedProvider && detectedProvider !== source.provider) {
      onChange({ provider: detectedProvider, url });
    } else {
      onChange({ url });
    }
  };

  return (
    <div className="space-y-4">
      {/* Provider Selection */}
      <div className="space-y-2">
        <label className="text-xs font-semibold text-slate-700">Provider</label>
        <div className="grid grid-cols-3 gap-2">
          {(['youtube', 'vimeo', 'wistia', 'mp4', 'upload', 'embed'] as VideoProvider[]).map((provider) => (
            <button
              key={provider}
              onClick={() => onChange({ provider })}
              disabled={disabled}
              className={`px-3 py-2 text-xs font-medium rounded-lg border-2 transition-all ${
                source.provider === provider
                  ? 'border-blue-500 bg-blue-50 text-blue-700'
                  : 'border-slate-200 hover:border-slate-300 text-slate-600'
              } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {getProviderDisplayName(provider)}
            </button>
          ))}
        </div>
      </div>

      {/* URL/Upload/Embed Input */}
      {source.provider !== 'upload' && source.provider !== 'embed' && (
        <div className="space-y-2">
          <label className="text-xs font-semibold text-slate-700">Video URL</label>
          <div className="flex gap-2">
            <input
              type="text"
              value={source.url || ''}
              onChange={(e) => handleUrlChange(e.target.value)}
              disabled={disabled}
              placeholder={`Enter ${getProviderDisplayName(source.provider)} URL...`}
              className="flex-1 px-3 py-2 text-sm border border-slate-200 rounded-lg"
            />
            <button className="px-3 py-2 text-xs font-medium border border-slate-200 rounded-lg hover:bg-slate-50">
              Test
            </button>
          </div>
        </div>
      )}

      {source.provider === 'upload' && (
        <div className="space-y-2">
          <label className="text-xs font-semibold text-slate-700">Upload Video</label>
          <div className="border-2 border-dashed border-slate-300 rounded-lg p-6 text-center">
            <div className="text-sm text-slate-600">Drop video file here or click to browse</div>
            <div className="text-xs text-slate-400 mt-1">MP4, WebM, or OGG (max 100MB)</div>
          </div>
        </div>
      )}

      {source.provider === 'embed' && (
        <div className="space-y-2">
          <label className="text-xs font-semibold text-slate-700">Embed Code</label>
          <textarea
            value={source.embedCode || ''}
            onChange={(e) => onChange({ embedCode: e.target.value })}
            disabled={disabled}
            placeholder="Paste your embed code here..."
            rows={4}
            className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg font-mono"
          />
          <div className="flex items-start gap-2 p-2 bg-orange-50 border border-orange-200 rounded-lg">
            <span className="text-orange-600 text-xs">⚠️</span>
            <span className="text-xs text-orange-700">Some settings may not apply to custom embed code</span>
          </div>
        </div>
      )}

      {/* Poster/Thumbnail */}
      <div className="space-y-2">
        <label className="text-xs font-semibold text-slate-700">Poster/Thumbnail</label>
        <div className="flex items-center gap-2">
          <label className="flex items-center gap-2">
            <input
              type="radio"
              checked={source.poster?.mode === 'auto'}
              onChange={() => onChange({ poster: { mode: 'auto' } })}
              disabled={disabled}
              className="w-4 h-4"
            />
            <span className="text-sm text-slate-700">Auto</span>
          </label>
          <label className="flex items-center gap-2">
            <input
              type="radio"
              checked={source.poster?.mode === 'custom'}
              onChange={() => onChange({ poster: { mode: 'custom' } })}
              disabled={disabled}
              className="w-4 h-4"
            />
            <span className="text-sm text-slate-700">Custom</span>
          </label>
        </div>
        {source.poster?.mode === 'custom' && (
          <input
            type="text"
            value={source.poster.customUrl || ''}
            onChange={(e) => onChange({ poster: { mode: 'custom', customUrl: e.target.value } })}
            disabled={disabled}
            placeholder="Enter image URL..."
            className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg"
          />
        )}
      </div>

      {/* Aspect Ratio */}
      <div className="space-y-2">
        <label className="text-xs font-semibold text-slate-700">Aspect Ratio</label>
        <div className="grid grid-cols-3 gap-2">
          {['auto', '16/9', '9/16', '1/1', '4/3', 'custom'].map((ratio) => (
            <button
              key={ratio}
              onClick={() => onChange({ aspectRatio: ratio as any })}
              disabled={disabled}
              className={`px-3 py-2 text-xs font-medium rounded-lg border-2 transition-all ${
                source.aspectRatio === ratio
                  ? 'border-blue-500 bg-blue-50 text-blue-700'
                  : 'border-slate-200 hover:border-slate-300 text-slate-600'
              }`}
            >
              {ratio === 'auto' ? 'Auto' : ratio.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Fallback */}
      <div className="space-y-2">
        <label className="text-xs font-semibold text-slate-700">Fallback</label>
        <select
          value={source.fallback.type}
          onChange={(e) => onChange({ fallback: { type: e.target.value as any } })}
          disabled={disabled}
          className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg"
        >
          <option value="none">None</option>
          <option value="poster">Poster only</option>
          <option value="image">Custom image</option>
          <option value="message">Custom message</option>
        </select>
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
          {/* Privacy Options */}
          {source.provider === 'youtube' && (
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={source.privacy?.youtubeNoCookie || false}
                onChange={(e) => onChange({ privacy: { ...source.privacy, youtubeNoCookie: e.target.checked } })}
                disabled={disabled}
                className="w-4 h-4 rounded border-slate-300 text-blue-600"
              />
              <span className="text-sm text-slate-700">Use YouTube no-cookie mode</span>
            </label>
          )}

          {source.provider === 'vimeo' && (
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={source.privacy?.vimeoDNT || false}
                onChange={(e) => onChange({ privacy: { ...source.privacy, vimeoDNT: e.target.checked } })}
                disabled={disabled}
                className="w-4 h-4 rounded border-slate-300 text-blue-600"
              />
              <span className="text-sm text-slate-700">Enable Vimeo Do Not Track</span>
            </label>
          )}
        </div>
      )}
    </div>
  );
}

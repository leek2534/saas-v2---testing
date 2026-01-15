"use client";

import React from "react";
import type { LayoutStyleSettings, Alignment, FitMode } from "../types";
import { SpacingPopover } from "../components/SpacingPopover";

interface LayoutStyleSectionProps {
  layout: LayoutStyleSettings;
  onChange: (layout: Partial<LayoutStyleSettings>) => void;
  disabled?: boolean;
}

export function LayoutStyleSection({ layout, onChange, disabled }: LayoutStyleSectionProps) {
  const [showAdvanced, setShowAdvanced] = React.useState(false);

  return (
    <div className="space-y-4">
      {/* Width */}
      <div className="space-y-2">
        <label className="text-xs font-medium text-slate-700">Width</label>
        <div className="grid grid-cols-3 gap-2">
          {(['auto', 'full', 'custom'] as const).map((mode) => (
            <button
              key={mode}
              onClick={() => onChange({ width: { ...layout.width, mode } })}
              disabled={disabled}
              className={`px-3 py-2 text-xs font-medium rounded-lg border-2 transition-all ${
                layout.width.mode === mode
                  ? 'border-blue-500 bg-blue-50 text-blue-700'
                  : 'border-slate-200 hover:border-slate-300 text-slate-600'
              }`}
            >
              {mode.charAt(0).toUpperCase() + mode.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Custom Width */}
      {layout.width.mode === 'custom' && (
        <div className="grid grid-cols-2 gap-2">
          <div className="space-y-1">
            <label className="text-xs font-medium text-slate-700">Value</label>
            <input
              type="number"
              value={layout.width.value || 800}
              onChange={(e) => onChange({ width: { ...layout.width, value: Number(e.target.value) } })}
              disabled={disabled}
              className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg"
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-medium text-slate-700">Unit</label>
            <select
              value={layout.width.unit || 'px'}
              onChange={(e) => onChange({ width: { ...layout.width, unit: e.target.value as any } })}
              disabled={disabled}
              className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg"
            >
              <option value="px">px</option>
              <option value="%">%</option>
              <option value="vw">vw</option>
            </select>
          </div>
        </div>
      )}

      {/* Max Width */}
      <div className="space-y-2">
        <label className="text-xs font-medium text-slate-700">Max Width (px)</label>
        <input
          type="number"
          value={layout.maxWidth || 0}
          onChange={(e) => onChange({ maxWidth: Number(e.target.value) || undefined })}
          disabled={disabled}
          placeholder="No limit"
          className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg"
        />
      </div>

      {/* Alignment */}
      <div className="space-y-2">
        <label className="text-xs font-medium text-slate-700">Alignment</label>
        <div className="grid grid-cols-3 gap-2">
          {(['left', 'center', 'right'] as Alignment[]).map((align) => (
            <button
              key={align}
              onClick={() => onChange({ alignment: align })}
              disabled={disabled}
              className={`px-3 py-2 text-xs font-medium rounded-lg border-2 transition-all ${
                layout.alignment === align
                  ? 'border-blue-500 bg-blue-50 text-blue-700'
                  : 'border-slate-200 hover:border-slate-300 text-slate-600'
              }`}
            >
              {align === 'left' ? '⬅️' : align === 'center' ? '↔️' : '➡️'} {align.charAt(0).toUpperCase() + align.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Spacing */}
      <div className="space-y-2">
        <label className="text-xs font-medium text-slate-700">Spacing</label>
        <SpacingPopover
          value={layout.spacing}
          onChange={(spacing) => onChange({ spacing })}
        />
      </div>

      {/* Fit Mode */}
      <div className="space-y-2">
        <label className="text-xs font-medium text-slate-700">Fit Mode</label>
        <div className="grid grid-cols-3 gap-2">
          {(['contain', 'cover', 'fill'] as FitMode[]).map((mode) => (
            <button
              key={mode}
              onClick={() => onChange({ fitMode: mode })}
              disabled={disabled}
              className={`px-3 py-2 text-xs font-medium rounded-lg border-2 transition-all ${
                layout.fitMode === mode
                  ? 'border-blue-500 bg-blue-50 text-blue-700'
                  : 'border-slate-200 hover:border-slate-300 text-slate-600'
              }`}
              title={
                mode === 'contain' ? 'Fit within bounds, maintain aspect ratio' :
                mode === 'cover' ? 'Fill bounds, maintain aspect ratio, may crop' :
                'Stretch to fill bounds'
              }
            >
              {mode.charAt(0).toUpperCase() + mode.slice(1)}
            </button>
          ))}
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
          {/* Corner Radius */}
          <div className="space-y-2">
            <label className="text-xs font-medium text-slate-700">Corner Radius</label>
            <div className="flex items-center gap-3">
              <input
                type="range"
                min={0}
                max={50}
                value={layout.cornerRadius}
                onChange={(e) => onChange({ cornerRadius: Number(e.target.value) })}
                disabled={disabled}
                className="flex-1 h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
              <input
                type="number"
                value={layout.cornerRadius}
                onChange={(e) => onChange({ cornerRadius: Number(e.target.value) })}
                disabled={disabled}
                className="w-16 px-2 py-1 text-xs border border-slate-200 rounded text-right"
              />
              <span className="text-xs text-slate-400">px</span>
            </div>
          </div>

          {/* Border */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-medium text-slate-700">Border</label>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={layout.border?.enabled || false}
                  onChange={(e) => onChange({ border: { ...layout.border, enabled: e.target.checked, width: 1, style: 'solid', color: '#e2e8f0' } })}
                  disabled={disabled}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>

            {layout.border?.enabled && (
              <div className="space-y-2">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-xs text-slate-600">Width</label>
                    <input
                      type="number"
                      value={layout.border.width}
                      onChange={(e) => onChange({ border: { ...layout.border!, width: Number(e.target.value) } })}
                      disabled={disabled}
                      className="w-full px-2 py-1 text-sm border border-slate-200 rounded"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-slate-600">Style</label>
                    <select
                      value={layout.border.style}
                      onChange={(e) => onChange({ border: { ...layout.border!, style: e.target.value as any } })}
                      disabled={disabled}
                      className="w-full px-2 py-1 text-sm border border-slate-200 rounded"
                    >
                      <option value="solid">Solid</option>
                      <option value="dashed">Dashed</option>
                      <option value="dotted">Dotted</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="text-xs text-slate-600">Color</label>
                  <input
                    type="color"
                    value={layout.border.color}
                    onChange={(e) => onChange({ border: { ...layout.border!, color: e.target.value } })}
                    disabled={disabled}
                    className="w-full h-8 rounded border border-slate-200 cursor-pointer"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Shadow */}
          <div className="space-y-2">
            <label className="text-xs font-medium text-slate-700">Shadow</label>
            <select
              value={layout.shadow.size}
              onChange={(e) => onChange({ shadow: { size: e.target.value as any } })}
              disabled={disabled}
              className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg"
            >
              <option value="none">None</option>
              <option value="sm">Small</option>
              <option value="md">Medium</option>
              <option value="lg">Large</option>
              <option value="custom">Custom</option>
            </select>
          </div>

          {/* Background Color */}
          <div className="space-y-2">
            <label className="text-xs font-medium text-slate-700">Background Color</label>
            <input
              type="color"
              value={layout.backgroundColor || '#000000'}
              onChange={(e) => onChange({ backgroundColor: e.target.value })}
              disabled={disabled}
              className="w-full h-8 rounded border border-slate-200 cursor-pointer"
            />
          </div>

          {/* Use Site Styles */}
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={layout.useSiteStyles}
              onChange={(e) => onChange({ useSiteStyles: e.target.checked })}
              disabled={disabled}
              className="w-4 h-4 rounded border-slate-300 text-blue-600"
            />
            <span className="text-sm text-slate-700">Use site styles (locks most style controls)</span>
          </label>
        </div>
      )}
    </div>
  );
}

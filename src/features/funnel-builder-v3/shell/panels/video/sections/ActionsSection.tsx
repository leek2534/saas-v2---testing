"use client";

import React from "react";
import type { ActionsSettings, ActionConfig, ActionType, OverlayCTA, CTAPosition } from "../types";
import { ElementPicker } from "../components/pickers/ElementPicker";
import { SectionPicker } from "../components/pickers/SectionPicker";
import { PopupPicker } from "../components/pickers/PopupPicker";

interface ActionsSectionProps {
  actions: ActionsSettings;
  isLoopEnabled: boolean;
  onChange: (actions: Partial<ActionsSettings>) => void;
  disabled?: boolean;
}

export function ActionsSection({ actions, isLoopEnabled, onChange, disabled }: ActionsSectionProps) {
  const [showAdvanced, setShowAdvanced] = React.useState(false);

  const updateOnEnd = (updates: Partial<ActionConfig>) => {
    onChange({ onEnd: { ...actions.onEnd, ...updates } });
  };

  const updateOverlayCTA = (updates: Partial<OverlayCTA>) => {
    onChange({ overlayCTA: { ...actions.overlayCTA, ...updates } as OverlayCTA });
  };

  const updateOnClick = (updates: Partial<ActionConfig>) => {
    onChange({ onClick: { ...actions.onClick, ...updates } });
  };

  // Show loop conflict warning
  const showLoopWarning = isLoopEnabled && actions.onEnd.type !== 'none';

  return (
    <div className="space-y-4">
      {/* Loop Conflict Warning */}
      {showLoopWarning && (
        <div className="flex items-start gap-2 p-3 bg-orange-50 border border-orange-200 rounded-lg">
          <span className="text-orange-600 text-sm">⚠️</span>
          <div className="flex-1">
            <div className="text-xs font-medium text-orange-700">Loop conflict</div>
            <div className="text-xs text-orange-600 mt-0.5">
              On-end actions won't fire while loop is enabled
            </div>
          </div>
        </div>
      )}

      {/* On Video End */}
      <div className="space-y-3">
        <label className="text-xs font-semibold text-slate-700">On Video End</label>
        <select
          value={actions.onEnd.type}
          onChange={(e) => updateOnEnd({ type: e.target.value as ActionType })}
          disabled={disabled || isLoopEnabled}
          className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg"
        >
          <option value="none">None</option>
          <option value="show-element">Show element</option>
          <option value="scroll-to-section">Scroll to section</option>
          <option value="open-popup">Open popup</option>
          <option value="go-to-url">Go to URL</option>
          <option value="next-step">Next step</option>
        </select>

        {/* Action-specific fields */}
        {actions.onEnd.type === 'show-element' && (
          <ElementPicker
            value={actions.onEnd.elementId}
            onChange={(elementId) => updateOnEnd({ elementId })}
          />
        )}

        {actions.onEnd.type === 'scroll-to-section' && (
          <div className="space-y-2">
            <SectionPicker
              value={actions.onEnd.sectionId}
              onChange={(sectionId) => updateOnEnd({ sectionId })}
            />
            <div className="space-y-1">
              <label className="text-xs text-slate-600">Scroll Offset (px)</label>
              <input
                type="number"
                value={actions.onEnd.scrollOffset || 0}
                onChange={(e) => updateOnEnd({ scrollOffset: Number(e.target.value) })}
                disabled={disabled}
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg"
              />
            </div>
          </div>
        )}

        {actions.onEnd.type === 'open-popup' && (
          <PopupPicker
            value={actions.onEnd.popupId}
            onChange={(popupId) => updateOnEnd({ popupId })}
          />
        )}

        {actions.onEnd.type === 'go-to-url' && (
          <div className="space-y-2">
            <input
              type="text"
              value={actions.onEnd.url || ''}
              onChange={(e) => updateOnEnd({ url: e.target.value })}
              disabled={disabled}
              placeholder="https://..."
              className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg"
            />
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={actions.onEnd.openNewTab || false}
                onChange={(e) => updateOnEnd({ openNewTab: e.target.checked })}
                disabled={disabled}
                className="w-4 h-4 rounded border-slate-300 text-blue-600"
              />
              <span className="text-sm text-slate-700">Open in new tab</span>
            </label>
          </div>
        )}
      </div>

      {/* Overlay CTA */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-xs font-semibold text-slate-700">Overlay CTA</label>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={actions.overlayCTA?.enabled || false}
              onChange={(e) => updateOverlayCTA({ enabled: e.target.checked })}
              disabled={disabled}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        </div>

        {actions.overlayCTA?.enabled && (
          <div className="space-y-3 pl-4 border-l-2 border-slate-200">
            <div className="space-y-1">
              <label className="text-xs text-slate-600">CTA Text</label>
              <input
                type="text"
                value={actions.overlayCTA.text || ''}
                onChange={(e) => updateOverlayCTA({ text: e.target.value })}
                disabled={disabled}
                placeholder="Limited time offer!"
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs text-slate-600">Button Label</label>
              <input
                type="text"
                value={actions.overlayCTA.buttonLabel || ''}
                onChange={(e) => updateOverlayCTA({ buttonLabel: e.target.value })}
                disabled={disabled}
                placeholder="Get Started"
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs text-slate-600">Position</label>
              <div className="grid grid-cols-3 gap-2">
                {(['bottom-left', 'bottom-center', 'bottom-right'] as CTAPosition[]).map((pos) => (
                  <button
                    key={pos}
                    onClick={() => updateOverlayCTA({ position: pos })}
                    disabled={disabled}
                    className={`px-2 py-1.5 text-xs font-medium rounded border-2 transition-all ${
                      actions.overlayCTA?.position === pos
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-slate-200 hover:border-slate-300 text-slate-600'
                    }`}
                  >
                    {pos.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <label className="text-xs text-slate-600">Show at (sec)</label>
                <input
                  type="number"
                  value={actions.overlayCTA.showTimeStart || 0}
                  onChange={(e) => updateOverlayCTA({ showTimeStart: Number(e.target.value) })}
                  disabled={disabled}
                  className="w-full px-2 py-1 text-sm border border-slate-200 rounded"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs text-slate-600">Hide at (sec)</label>
                <input
                  type="number"
                  value={actions.overlayCTA.showTimeEnd || 0}
                  onChange={(e) => updateOverlayCTA({ showTimeEnd: Number(e.target.value) })}
                  disabled={disabled}
                  className="w-full px-2 py-1 text-sm border border-slate-200 rounded"
                />
              </div>
            </div>

            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={actions.overlayCTA.useButtonTheme || false}
                onChange={(e) => updateOverlayCTA({ useButtonTheme: e.target.checked })}
                disabled={disabled}
                className="w-4 h-4 rounded border-slate-300 text-blue-600"
              />
              <span className="text-sm text-slate-700">Use button theme</span>
            </label>
          </div>
        )}
      </div>

      {/* Advanced Options */}
      <button
        onClick={() => setShowAdvanced(!showAdvanced)}
        className="text-xs font-medium text-blue-600 hover:text-blue-700"
      >
        {showAdvanced ? '− Hide' : '+ Show'} Advanced Options
      </button>

      {showAdvanced && (
        <div className="space-y-3 pl-4 border-l-2 border-slate-200">
          <div className="text-xs font-semibold text-slate-700">On Click Action</div>
          <div className="text-xs text-slate-500">Only applies if click behavior supports custom actions</div>
          
          <select
            value={actions.onClick?.type || 'none'}
            onChange={(e) => updateOnClick({ type: e.target.value as ActionType })}
            disabled={disabled}
            className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg"
          >
            <option value="none">None</option>
            <option value="show-element">Show element</option>
            <option value="scroll-to-section">Scroll to section</option>
            <option value="open-popup">Open popup</option>
            <option value="go-to-url">Go to URL</option>
          </select>
        </div>
      )}
    </div>
  );
}

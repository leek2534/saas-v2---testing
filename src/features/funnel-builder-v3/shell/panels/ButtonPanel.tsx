"use client";

import React from "react";
import { useFunnelEditorStore } from "../../store/store";
import type { ElementNode } from "../../store/types";
import { TextField, ColorField, NumberField } from "../controls";
import { ChevronDown, ChevronRight } from "lucide-react";

type ButtonState = 'default' | 'hover' | 'active';

export function ButtonPanel({ node }: { node: ElementNode }) {
  const updateNodeProps = useFunnelEditorStore((s) => s.updateNodeProps);
  const [activeState, setActiveState] = React.useState<ButtonState>('default');
  const [openSections, setOpenSections] = React.useState({
    content: true,
    style: true,
    typography: false,
    spacing: false,
    effects: false,
  });

  const toggleSection = (section: keyof typeof openSections) => {
    setOpenSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const SectionHeader = ({ title, section }: { title: string; section: keyof typeof openSections }) => (
    <button
      onClick={() => toggleSection(section)}
      className="w-full flex items-center justify-between py-2 px-3 bg-slate-50 hover:bg-slate-100 rounded-lg transition-colors"
    >
      <span className="text-xs font-bold text-slate-700 uppercase tracking-wide">{title}</span>
      {openSections[section] ? <ChevronDown className="h-4 w-4 text-slate-500" /> : <ChevronRight className="h-4 w-4 text-slate-500" />}
    </button>
  );

  return (
    <div className="space-y-3">
      {/* CONTENT SECTION */}
      <div className="space-y-2">
        <SectionHeader title="Content" section="content" />
        {openSections.content && (
          <div className="space-y-3 px-1">
            <TextField 
              label="Button Text" 
              value={node.props.text ?? "Click me"} 
              onChange={(v) => updateNodeProps(node.id, { text: v })} 
            />
            <TextField 
              label="Link URL" 
              value={node.props.href ?? ""} 
              onChange={(v) => updateNodeProps(node.id, { href: v })} 
            />
            <div className="flex items-center justify-between pt-1">
              <span className="text-xs font-medium text-slate-600">Open in New Tab</span>
              <input
                type="checkbox"
                checked={node.props.target === '_blank'}
                onChange={(e) => updateNodeProps(node.id, { target: e.target.checked ? '_blank' : '_self' })}
                className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
              />
            </div>
          </div>
        )}
      </div>

      {/* STYLE SECTION */}
      <div className="space-y-2">
        <SectionHeader title="Style" section="style" />
        {openSections.style && (
          <div className="space-y-4 px-1">
            {/* Button State Tabs */}
            <div className="flex gap-1 p-1 bg-slate-100 rounded-lg">
              {(['default', 'hover', 'active'] as ButtonState[]).map((state) => (
                <button
                  key={state}
                  onClick={() => setActiveState(state)}
                  className={`flex-1 py-1.5 px-2 text-xs font-medium capitalize rounded transition-all ${
                    activeState === state
                      ? 'bg-white text-blue-600 shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {state}
                </button>
              ))}
            </div>

            {/* Style Presets */}
            <div>
              <div className="text-xs font-medium text-slate-600 mb-2">Style Preset</div>
              <div className="grid grid-cols-2 gap-2">
                {['primary', 'secondary', 'outline', 'ghost'].map((preset) => (
                  <button
                    key={preset}
                    onClick={() => {
                      const presets = {
                        primary: { bgColor: '#3B82F6', textColor: '#ffffff', borderColor: '#3B82F6', variant: 'solid' },
                        secondary: { bgColor: '#10B981', textColor: '#ffffff', borderColor: '#10B981', variant: 'solid' },
                        outline: { bgColor: 'transparent', textColor: '#3B82F6', borderColor: '#3B82F6', variant: 'outline' },
                        ghost: { bgColor: 'transparent', textColor: '#64748B', borderColor: 'transparent', variant: 'ghost' },
                      };
                      updateNodeProps(node.id, presets[preset as keyof typeof presets]);
                    }}
                    className="h-8 rounded border-2 text-xs font-medium capitalize transition-all border-slate-200 hover:border-blue-300 text-slate-600 hover:bg-blue-50"
                  >
                    {preset}
                  </button>
                ))}
              </div>
            </div>

            {/* Colors */}
            <div className="space-y-3 pt-2">
              <ColorField 
                label="Background" 
                value={node.props.bgColor ?? '#3b82f6'} 
                onChange={(v) => updateNodeProps(node.id, { bgColor: v })} 
              />
              <ColorField 
                label="Text Color" 
                value={node.props.textColor ?? '#ffffff'} 
                onChange={(v) => updateNodeProps(node.id, { textColor: v })} 
              />
              <ColorField 
                label="Border Color" 
                value={node.props.borderColor ?? '#3b82f6'} 
                onChange={(v) => updateNodeProps(node.id, { borderColor: v })} 
              />
            </div>

            {/* Border */}
            <div className="space-y-3 pt-2">
              <div>
                <div className="text-xs font-medium text-slate-600 mb-2">Border Width</div>
                <div className="flex items-center gap-3">
                  <input
                    type="range"
                    min={0}
                    max={10}
                    value={node.props.borderWidth ?? 0}
                    onChange={(e) => updateNodeProps(node.id, { borderWidth: Number(e.target.value) })}
                    className="flex-1 h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                  />
                  <span className="text-xs text-slate-500 w-8 text-right">{node.props.borderWidth ?? 0}px</span>
                </div>
              </div>
              <div>
                <div className="text-xs font-medium text-slate-600 mb-2">Border Radius</div>
                <div className="flex items-center gap-3">
                  <input
                    type="range"
                    min={0}
                    max={50}
                    value={node.props.borderRadius ?? 8}
                    onChange={(e) => updateNodeProps(node.id, { borderRadius: Number(e.target.value) })}
                    className="flex-1 h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                  />
                  <span className="text-xs text-slate-500 w-8 text-right">{node.props.borderRadius ?? 8}px</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* TYPOGRAPHY SECTION */}
      <div className="space-y-2">
        <SectionHeader title="Typography" section="typography" />
        {openSections.typography && (
          <div className="space-y-3 px-1">
            <div>
              <div className="text-xs font-medium text-slate-600 mb-2">Font Size</div>
              <div className="flex items-center gap-3">
                <input
                  type="range"
                  min={10}
                  max={32}
                  value={node.props.fontSize ?? 16}
                  onChange={(e) => updateNodeProps(node.id, { fontSize: Number(e.target.value) })}
                  className="flex-1 h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                />
                <span className="text-xs text-slate-500 w-8 text-right">{node.props.fontSize ?? 16}px</span>
              </div>
            </div>
            <div>
              <div className="text-xs font-medium text-slate-600 mb-2">Font Weight</div>
              <div className="grid grid-cols-4 gap-1">
                {[400, 500, 600, 700].map((weight) => (
                  <button
                    key={weight}
                    onClick={() => updateNodeProps(node.id, { fontWeight: weight })}
                    className={`h-8 rounded border text-xs transition-all ${
                      (node.props.fontWeight ?? 600) === weight
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-slate-200 hover:border-slate-300 text-slate-600'
                    }`}
                  >
                    {weight}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <div className="text-xs font-medium text-slate-600 mb-2">Letter Spacing</div>
              <div className="flex items-center gap-3">
                <input
                  type="range"
                  min={-2}
                  max={4}
                  step={0.5}
                  value={node.props.letterSpacing ?? 0}
                  onChange={(e) => updateNodeProps(node.id, { letterSpacing: Number(e.target.value) })}
                  className="flex-1 h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                />
                <span className="text-xs text-slate-500 w-8 text-right">{node.props.letterSpacing ?? 0}px</span>
              </div>
            </div>
            <div>
              <div className="text-xs font-medium text-slate-600 mb-2">Text Transform</div>
              <div className="grid grid-cols-3 gap-1">
                {['none', 'uppercase', 'capitalize'].map((transform) => (
                  <button
                    key={transform}
                    onClick={() => updateNodeProps(node.id, { textTransform: transform })}
                    className={`h-8 rounded border text-xs capitalize transition-all ${
                      (node.props.textTransform ?? 'none') === transform
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-slate-200 hover:border-slate-300 text-slate-600'
                    }`}
                  >
                    {transform === 'none' ? 'None' : transform}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* SPACING SECTION */}
      <div className="space-y-2">
        <SectionHeader title="Spacing" section="spacing" />
        {openSections.spacing && (
          <div className="space-y-3 px-1">
            <div>
              <div className="text-xs font-medium text-slate-600 mb-2">Padding</div>
              <div className="grid grid-cols-2 gap-2">
                <NumberField label="Horizontal" value={node.props.paddingX ?? 24} min={0} max={80} onChange={(v) => updateNodeProps(node.id, { paddingX: v })} />
                <NumberField label="Vertical" value={node.props.paddingY ?? 12} min={0} max={80} onChange={(v) => updateNodeProps(node.id, { paddingY: v })} />
              </div>
            </div>
            <div>
              <div className="text-xs font-medium text-slate-600 mb-2">Margin</div>
              <div className="grid grid-cols-2 gap-2">
                <NumberField label="Top" value={node.props.marginTop ?? 0} min={-80} max={200} onChange={(v) => updateNodeProps(node.id, { marginTop: v })} />
                <NumberField label="Bottom" value={node.props.marginBottom ?? 0} min={-80} max={200} onChange={(v) => updateNodeProps(node.id, { marginBottom: v })} />
              </div>
            </div>
            <div className="flex items-center justify-between pt-2">
              <span className="text-xs font-medium text-slate-600">Full Width</span>
              <input
                type="checkbox"
                checked={node.props.fullWidth === true}
                onChange={(e) => updateNodeProps(node.id, { fullWidth: e.target.checked })}
                className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
              />
            </div>
          </div>
        )}
      </div>

      {/* EFFECTS SECTION */}
      <div className="space-y-2">
        <SectionHeader title="Effects" section="effects" />
        {openSections.effects && (
          <div className="space-y-3 px-1">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium text-slate-600">Shadow</span>
                <input
                  type="checkbox"
                  checked={node.props.shadow !== 'none'}
                  onChange={(e) => updateNodeProps(node.id, { shadow: e.target.checked ? 'md' : 'none' })}
                  className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                />
              </div>
              {node.props.shadow !== 'none' && (
                <div className="grid grid-cols-3 gap-1">
                  {['sm', 'md', 'lg'].map((size) => (
                    <button
                      key={size}
                      onClick={() => updateNodeProps(node.id, { shadow: size })}
                      className={`h-7 rounded border text-xs uppercase transition-all ${
                        (node.props.shadow ?? 'md') === size
                          ? 'border-blue-500 bg-blue-50 text-blue-700'
                          : 'border-slate-200 hover:border-slate-300 text-slate-600'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <div>
              <div className="text-xs font-medium text-slate-600 mb-2">Opacity</div>
              <div className="flex items-center gap-3">
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={(node.props.opacity ?? 1) * 100}
                  onChange={(e) => updateNodeProps(node.id, { opacity: Number(e.target.value) / 100 })}
                  className="flex-1 h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                />
                <span className="text-xs text-slate-500 w-10 text-right">{Math.round((node.props.opacity ?? 1) * 100)}%</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

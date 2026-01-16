"use client";

import React from "react";
import { useFunnelEditorStore } from "../../store/store";
import type { ElementNode } from "../../store/types";
import { NumberField } from "../controls";
import { ChevronDown, ChevronRight } from "lucide-react";

export function ImagePanel({ node }: { node: ElementNode }) {
  const updateNodeProps = useFunnelEditorStore((s) => s.updateNodeProps);
  const [openSections, setOpenSections] = React.useState({
    source: true,
    dimensions: true,
    display: false,
    border: false,
    spacing: false,
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
      {/* SOURCE SECTION */}
      <div className="space-y-2">
        <SectionHeader title="Source" section="source" />
        {openSections.source && (
          <div className="space-y-3 px-1">
            <div>
              <div className="text-xs font-medium text-slate-600 mb-2">Image URL</div>
              <input
                type="text"
                value={node.props.src ?? ""}
                onChange={(e) => updateNodeProps(node.id, { src: e.target.value })}
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg font-mono"
                placeholder="https://example.com/image.jpg"
              />
            </div>
            <div>
              <div className="text-xs font-medium text-slate-600 mb-2">Alt Text</div>
              <input
                type="text"
                value={node.props.alt ?? ""}
                onChange={(e) => updateNodeProps(node.id, { alt: e.target.value })}
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg"
                placeholder="Describe the image"
              />
            </div>
          </div>
        )}
      </div>

      {/* DIMENSIONS SECTION */}
      <div className="space-y-2">
        <SectionHeader title="Dimensions" section="dimensions" />
        {openSections.dimensions && (
          <div className="space-y-3 px-1">
            <div>
              <div className="text-xs font-medium text-slate-600 mb-2">Max Width</div>
              <div className="flex items-center gap-3">
                <input
                  type="range"
                  min={100}
                  max={1200}
                  step={50}
                  value={node.props.maxWidth ?? 600}
                  onChange={(e) => updateNodeProps(node.id, { maxWidth: Number(e.target.value) })}
                  className="flex-1 h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                />
                <span className="text-xs text-slate-500 w-12 text-right">{node.props.maxWidth ?? 600}px</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* DISPLAY SECTION */}
      <div className="space-y-2">
        <SectionHeader title="Display" section="display" />
        {openSections.display && (
          <div className="space-y-3 px-1">
            <div>
              <div className="text-xs font-medium text-slate-600 mb-2">Object Fit</div>
              <div className="grid grid-cols-3 gap-1">
                {["cover", "contain", "fill"].map((fit) => (
                  <button
                    key={fit}
                    onClick={() => updateNodeProps(node.id, { objectFit: fit })}
                    className={`h-8 rounded border text-xs font-medium capitalize transition-all ${
                      (node.props.objectFit ?? "cover") === fit
                        ? "border-blue-500 bg-blue-50 text-blue-700"
                        : "border-slate-200 hover:border-slate-300 text-slate-600"
                    }`}
                  >
                    {fit}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <div className="text-xs font-medium text-slate-600 mb-2">Aspect Ratio</div>
              <div className="grid grid-cols-5 gap-1">
                {[
                  { label: "Auto", value: "auto" },
                  { label: "1:1", value: "1/1" },
                  { label: "4:3", value: "4/3" },
                  { label: "16:9", value: "16/9" },
                  { label: "21:9", value: "21/9" },
                ].map((ratio) => (
                  <button
                    key={ratio.value}
                    onClick={() => updateNodeProps(node.id, { aspectRatio: ratio.value })}
                    className={`h-8 rounded border text-xs font-medium transition-all ${
                      (node.props.aspectRatio ?? "auto") === ratio.value
                        ? "border-blue-500 bg-blue-50 text-blue-700"
                        : "border-slate-200 hover:border-slate-300 text-slate-600"
                    }`}
                  >
                    {ratio.label}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <div className="text-xs font-medium text-slate-600 mb-2">Frame Background</div>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={node.props.frameBackground ?? "#f1f5f9"}
                  onChange={(e) => updateNodeProps(node.id, { frameBackground: e.target.value })}
                  className="w-10 h-8 rounded border border-slate-200 cursor-pointer"
                />
                <input
                  type="text"
                  value={node.props.frameBackground ?? "#f1f5f9"}
                  onChange={(e) => updateNodeProps(node.id, { frameBackground: e.target.value })}
                  className="flex-1 px-3 py-2 text-xs border border-slate-200 rounded font-mono"
                />
              </div>
            </div>
            <div>
              <div className="text-xs font-medium text-slate-600 mb-2">Border Radius</div>
              <div className="flex items-center gap-3">
                <input
                  type="range"
                  min={0}
                  max={50}
                  value={node.props.borderRadius ?? 12}
                  onChange={(e) => updateNodeProps(node.id, { borderRadius: Number(e.target.value) })}
                  className="flex-1 h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                />
                <span className="text-xs text-slate-500 w-8 text-right">{node.props.borderRadius ?? 12}px</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* BORDER SECTION */}
      <div className="space-y-2">
        <SectionHeader title="Border" section="border" />
        {openSections.border && (
          <div className="space-y-3 px-1">
            <div>
              <div className="text-xs font-medium text-slate-600 mb-2">Border Width</div>
              <div className="flex items-center gap-3">
                <input
                  type="range"
                  min={0}
                  max={20}
                  value={node.props.borderWidth ?? 0}
                  onChange={(e) => updateNodeProps(node.id, { borderWidth: Number(e.target.value) })}
                  className="flex-1 h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                />
                <span className="text-xs text-slate-500 w-8 text-right">{node.props.borderWidth ?? 0}px</span>
              </div>
            </div>
            {(node.props.borderWidth ?? 0) > 0 && (
              <div>
                <div className="text-xs font-medium text-slate-600 mb-2">Border Color</div>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={node.props.borderColor ?? "#e2e8f0"}
                    onChange={(e) => updateNodeProps(node.id, { borderColor: e.target.value })}
                    className="w-10 h-8 rounded border border-slate-200 cursor-pointer"
                  />
                  <input
                    type="text"
                    value={node.props.borderColor ?? "#e2e8f0"}
                    onChange={(e) => updateNodeProps(node.id, { borderColor: e.target.value })}
                    className="flex-1 px-3 py-2 text-xs border border-slate-200 rounded font-mono"
                  />
                </div>
              </div>
            )}
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
                <NumberField label="Top" value={node.props.paddingTop ?? 0} min={0} max={80} onChange={(v) => updateNodeProps(node.id, { paddingTop: v })} />
                <NumberField label="Bottom" value={node.props.paddingBottom ?? 0} min={0} max={80} onChange={(v) => updateNodeProps(node.id, { paddingBottom: v })} />
                <NumberField label="Left" value={node.props.paddingLeft ?? 0} min={0} max={80} onChange={(v) => updateNodeProps(node.id, { paddingLeft: v })} />
                <NumberField label="Right" value={node.props.paddingRight ?? 0} min={0} max={80} onChange={(v) => updateNodeProps(node.id, { paddingRight: v })} />
              </div>
            </div>
            <div>
              <div className="text-xs font-medium text-slate-600 mb-2">Margin</div>
              <div className="grid grid-cols-2 gap-2">
                <NumberField label="Top" value={node.props.marginTop ?? 0} min={-80} max={200} onChange={(v) => updateNodeProps(node.id, { marginTop: v })} />
                <NumberField label="Bottom" value={node.props.marginBottom ?? 0} min={-80} max={200} onChange={(v) => updateNodeProps(node.id, { marginBottom: v })} />
              </div>
            </div>
            <div>
              <div className="text-xs font-medium text-slate-600 mb-2">Gap to Next Element</div>
              <div className="flex items-center gap-3">
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={node.props.gapToNext ?? 0}
                  onChange={(e) => updateNodeProps(node.id, { gapToNext: Number(e.target.value) })}
                  className="flex-1 h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                />
                <span className="text-xs text-slate-500 w-10 text-right">{node.props.gapToNext ?? 0}px</span>
              </div>
            </div>
            <div>
              <div className="text-xs font-medium text-slate-600 mb-2">Box Shadow</div>
              <input
                type="text"
                value={node.props.boxShadow ?? ''}
                onChange={(e) => updateNodeProps(node.id, { boxShadow: e.target.value })}
                placeholder="e.g., 0 25px 50px rgba(0,0,0,0.25)"
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg font-mono"
              />
              <p className="text-xs text-slate-500 mt-1">CSS box-shadow value</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

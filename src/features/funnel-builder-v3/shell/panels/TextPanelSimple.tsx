"use client";

import React from "react";
import { useFunnelEditorStore } from "../../store/store";
import type { ElementNode } from "../../store/types";
import { TextField, ColorField, NumberField, SelectField } from "../controls";
import { ChevronDown, ChevronRight } from "lucide-react";
import { RichText } from "../../editor/RichText";
import type { JSONContent } from "@tiptap/core";

function safeDoc(value: JSONContent | undefined, fallbackText: string) {
  if (value && typeof value === "object") return value;
  return { type: "doc", content: [{ type: "paragraph", content: [{ type: "text", text: fallbackText }] }] } as any;
}

export function TextPanelSimple({ node }: { node: ElementNode }) {
  const updateNodeProps = useFunnelEditorStore((s) => s.updateNodeProps);
  const kind = node.props.kind;
  
  const [openSections, setOpenSections] = React.useState({
    content: true,
    typography: true,
    color: false,
    spacing: false,
    advanced: false,
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
  
  const richValue = safeDoc(
    node.props.content as any, 
    kind === "heading" ? "Heading" : 
    kind === "subheading" ? "Subheading" : 
    kind === "paragraph" ? "Paragraph" : "Text"
  );

  return (
    <div className="space-y-3">
      {/* CONTENT SECTION */}
      <div className="space-y-2">
        <SectionHeader title="Content" section="content" />
        {openSections.content && (
          <div className="px-1">
            <div className="rounded-lg border border-slate-200 p-3 bg-slate-50">
              <RichText
                value={richValue}
                editable
                inline
                onChange={(next) => updateNodeProps(node.id, { content: next })}
                className="min-h-[100px]"
              />
            </div>
          </div>
        )}
      </div>

      {/* TYPOGRAPHY SECTION */}
      <div className="space-y-2">
        <SectionHeader title="Typography" section="typography" />
        {openSections.typography && (
          <div className="space-y-3 px-1">
            <SelectField
              label="Font Size"
              value={String(node.props.fontSize ?? (kind === "heading" ? 36 : kind === "subheading" ? 20 : 16))}
              options={[
                { label: "12px", value: "12" },
                { label: "14px", value: "14" },
                { label: "16px", value: "16" },
                { label: "18px", value: "18" },
                { label: "20px", value: "20" },
                { label: "24px", value: "24" },
                { label: "28px", value: "28" },
                { label: "32px", value: "32" },
                { label: "36px", value: "36" },
                { label: "48px", value: "48" },
                { label: "56px", value: "56" },
                { label: "64px", value: "64" },
              ]}
              onChange={(v) => updateNodeProps(node.id, { fontSize: Number(v) })}
            />
            
            <SelectField
              label="Font Weight"
              value={String(node.props.fontWeight ?? (kind === "heading" ? 700 : kind === "subheading" ? 600 : 400))}
              options={[
                { label: "300 - Light", value: "300" },
                { label: "400 - Normal", value: "400" },
                { label: "500 - Medium", value: "500" },
                { label: "600 - Semibold", value: "600" },
                { label: "700 - Bold", value: "700" },
                { label: "800 - Extrabold", value: "800" },
              ]}
              onChange={(v) => updateNodeProps(node.id, { fontWeight: Number(v) })}
            />

            <div>
              <div className="text-xs font-medium text-slate-600 mb-2">Line Height</div>
              <div className="flex items-center gap-3">
                <input
                  type="range"
                  min={0.8}
                  max={3}
                  step={0.1}
                  value={node.props.lineHeight ?? (kind === "heading" ? 1.1 : kind === "subheading" ? 1.2 : 1.5)}
                  onChange={(e) => updateNodeProps(node.id, { lineHeight: Number(e.target.value) })}
                  className="flex-1 h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                />
                <span className="text-xs text-slate-500 w-10 text-right">{node.props.lineHeight ?? (kind === "heading" ? 1.1 : kind === "subheading" ? 1.2 : 1.5)}</span>
              </div>
            </div>

            <div>
              <div className="text-xs font-medium text-slate-600 mb-2">Letter Spacing</div>
              <div className="flex items-center gap-3">
                <input
                  type="range"
                  min={-2}
                  max={10}
                  step={0.1}
                  value={node.props.letterSpacing ?? 0}
                  onChange={(e) => updateNodeProps(node.id, { letterSpacing: Number(e.target.value) })}
                  className="flex-1 h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                />
                <span className="text-xs text-slate-500 w-10 text-right">{node.props.letterSpacing ?? 0}px</span>
              </div>
            </div>

            <SelectField
              label="Text Align"
              value={node.props.textAlign ?? "left"}
              options={[
                { label: "Left", value: "left" },
                { label: "Center", value: "center" },
                { label: "Right", value: "right" },
                { label: "Justify", value: "justify" },
              ]}
              onChange={(v) => updateNodeProps(node.id, { textAlign: v })}
            />

            <SelectField
              label="Text Transform"
              value={node.props.textTransform ?? "none"}
              options={[
                { label: "None", value: "none" },
                { label: "Uppercase", value: "uppercase" },
                { label: "Lowercase", value: "lowercase" },
                { label: "Capitalize", value: "capitalize" },
              ]}
              onChange={(v) => updateNodeProps(node.id, { textTransform: v })}
            />
          </div>
        )}
      </div>

      {/* COLOR & EFFECTS SECTION */}
      <div className="space-y-2">
        <SectionHeader title="Color & Effects" section="color" />
        {openSections.color && (
          <div className="space-y-3 px-1">
            <ColorField
              label="Text Color"
              value={node.props.color ?? "#334155"}
              onChange={(v) => updateNodeProps(node.id, { color: v })}
            />

            <div>
              <div className="text-xs font-medium text-slate-600 mb-2">Text Shadow</div>
              <input
                type="text"
                value={node.props.textShadow ?? ""}
                onChange={(e) => updateNodeProps(node.id, { textShadow: e.target.value })}
                placeholder="e.g., 2px 2px 4px rgba(0,0,0,0.3)"
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg font-mono"
              />
              <p className="text-xs text-slate-500 mt-1">CSS text-shadow value</p>
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
                <NumberField label="Top" value={node.props.paddingTop ?? 12} min={0} max={80} onChange={(v) => updateNodeProps(node.id, { paddingTop: v })} />
                <NumberField label="Bottom" value={node.props.paddingBottom ?? 12} min={0} max={80} onChange={(v) => updateNodeProps(node.id, { paddingBottom: v })} />
                <NumberField label="Left" value={node.props.paddingLeft ?? 16} min={0} max={80} onChange={(v) => updateNodeProps(node.id, { paddingLeft: v })} />
                <NumberField label="Right" value={node.props.paddingRight ?? 16} min={0} max={80} onChange={(v) => updateNodeProps(node.id, { paddingRight: v })} />
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
          </div>
        )}
      </div>

      {/* ADVANCED SECTION */}
      <div className="space-y-2">
        <SectionHeader title="Advanced" section="advanced" />
        {openSections.advanced && (
          <div className="space-y-3 px-1">
            <ColorField
              label="Background Color"
              value={node.props.backgroundColor ?? "transparent"}
              onChange={(v) => updateNodeProps(node.id, { backgroundColor: v })}
            />

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
                <span className="text-xs text-slate-500 w-10 text-right">{node.props.borderWidth ?? 0}px</span>
              </div>
            </div>

            {(node.props.borderWidth ?? 0) > 0 && (
              <ColorField
                label="Border Color"
                value={node.props.borderColor ?? "#e2e8f0"}
                onChange={(v) => updateNodeProps(node.id, { borderColor: v })}
              />
            )}

            <div>
              <div className="text-xs font-medium text-slate-600 mb-2">Border Radius</div>
              <div className="flex items-center gap-3">
                <input
                  type="range"
                  min={0}
                  max={50}
                  value={node.props.borderRadius ?? 0}
                  onChange={(e) => updateNodeProps(node.id, { borderRadius: Number(e.target.value) })}
                  className="flex-1 h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                />
                <span className="text-xs text-slate-500 w-10 text-right">{node.props.borderRadius ?? 0}px</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

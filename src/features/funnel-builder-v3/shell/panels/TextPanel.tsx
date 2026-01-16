"use client";

import React, { useState } from "react";
import { useFunnelEditorStore } from "../../store/store";
import type { ElementNode } from "../../store/types";
import type { JSONContent } from "@tiptap/core";
import { RichText } from "../../editor/RichText";
import { TextField, NumberField, ColorField, SelectField, ToggleField, SpacingField } from "../controls";
import { ChevronDown, ChevronRight } from "lucide-react";

function safeDoc(value: JSONContent | undefined, fallbackText: string) {
  if (value && typeof value === "object") return value;
  return { type: "doc", content: [{ type: "paragraph", content: [{ type: "text", text: fallbackText }] }] } as any;
}

export function TextPanel({ node }: { node: ElementNode }) {
  const updateNodeProps = useFunnelEditorStore((s) => s.updateNodeProps);
  const kind = node.props.kind;
  
  const [openSections, setOpenSections] = useState({
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

            <NumberField
              label="Line Height"
              value={node.props.lineHeight ?? (kind === "heading" ? 1.1 : kind === "subheading" ? 1.2 : 1.5)}
              min={0.8}
              max={3}
              step={0.1}
              onChange={(v) => updateNodeProps(node.id, { lineHeight: v })}
            />

            <NumberField
              label="Letter Spacing (px)"
              value={node.props.letterSpacing ?? 0}
              min={-2}
              max={10}
              step={0.1}
              onChange={(v) => updateNodeProps(node.id, { letterSpacing: v })}
            />

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
              <div className="text-xs font-semibold text-slate-700 mb-2">Text Shadow</div>
              <TextField
                label="Shadow (CSS)"
                value={node.props.textShadow ?? ""}
                onChange={(v) => updateNodeProps(node.id, { textShadow: v })}
              />
              <div className="text-xs text-slate-500 mt-1">e.g., 2px 2px 4px rgba(0,0,0,0.3)</div>
            </div>
          </div>
        )}
      </div>

      {/* SPACING SECTION */}
      <div className="space-y-2">
        <SectionHeader title="Spacing" section="spacing" />
        {openSections.spacing && (
          <div className="space-y-4 px-1">
            <SpacingField
              label="Padding"
              top={node.props.paddingTop ?? 12}
              right={node.props.paddingRight ?? 16}
              bottom={node.props.paddingBottom ?? 12}
              left={node.props.paddingLeft ?? 16}
              onTopChange={(v) => updateNodeProps(node.id, { paddingTop: v })}
              onRightChange={(v) => updateNodeProps(node.id, { paddingRight: v })}
              onBottomChange={(v) => updateNodeProps(node.id, { paddingBottom: v })}
              onLeftChange={(v) => updateNodeProps(node.id, { paddingLeft: v })}
              max={80}
            />

            <SpacingField
              label="Margin"
              top={node.props.marginTop ?? 0}
              right={node.props.marginRight ?? 0}
              bottom={node.props.marginBottom ?? 0}
              left={node.props.marginLeft ?? 0}
              onTopChange={(v) => updateNodeProps(node.id, { marginTop: v })}
              onRightChange={(v) => updateNodeProps(node.id, { marginRight: v })}
              onBottomChange={(v) => updateNodeProps(node.id, { marginBottom: v })}
              onLeftChange={(v) => updateNodeProps(node.id, { marginLeft: v })}
              min={-80}
              max={200}
            />

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
              <div className="text-xs font-semibold text-slate-700 mb-2">Border</div>
              <div className="space-y-2">
                <NumberField
                  label="Border Width (px)"
                  value={node.props.borderWidth ?? 0}
                  min={0}
                  max={10}
                  onChange={(v) => updateNodeProps(node.id, { borderWidth: v })}
                />
                {(node.props.borderWidth ?? 0) > 0 && (
                  <ColorField
                    label="Border Color"
                    value={node.props.borderColor ?? "#e2e8f0"}
                    onChange={(v) => updateNodeProps(node.id, { borderColor: v })}
                  />
                )}
              </div>
            </div>

            <NumberField
              label="Border Radius (px)"
              value={node.props.borderRadius ?? 0}
              min={0}
              max={50}
              onChange={(v) => updateNodeProps(node.id, { borderRadius: v })}
            />

            <TextField
              label="Text Decoration"
              value={node.props.textDecoration ?? "none"}
              onChange={(v) => updateNodeProps(node.id, { textDecoration: v })}
            />
          </div>
        )}
      </div>

    </div>
  );
}

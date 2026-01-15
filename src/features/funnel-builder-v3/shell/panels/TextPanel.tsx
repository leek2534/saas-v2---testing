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
  
  const [expandedSections, setExpandedSections] = useState({
    typography: true,
    color: false,
    spacing: false,
    advanced: false,
  });

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };
  
  const richValue = safeDoc(
    node.props.content as any, 
    kind === "heading" ? "Heading" : 
    kind === "subheading" ? "Subheading" : 
    kind === "paragraph" ? "Paragraph" : "Text"
  );

  return (
    <div className="space-y-4">
      {/* Rich Text Editor */}
      <div className="space-y-2">
        <div className="text-xs font-semibold text-slate-700 uppercase tracking-wide">Content</div>
        <div className="rounded-xl border border-slate-200 p-3 bg-slate-50">
          <RichText
            value={richValue}
            editable
            inline
            onChange={(next) => updateNodeProps(node.id, { content: next })}
            className="min-h-[120px]"
          />
        </div>
      </div>

      {/* Typography Section */}
      <div className="space-y-3 rounded-xl border border-slate-200 overflow-hidden">
        <button
          onClick={() => toggleSection('typography')}
          className="w-full flex items-center justify-between p-3 bg-slate-50 hover:bg-slate-100 transition-colors"
        >
          <div className="text-xs font-semibold text-slate-700 uppercase tracking-wide">Typography</div>
          {expandedSections.typography ? <ChevronDown className="w-4 h-4 text-slate-400" /> : <ChevronRight className="w-4 h-4 text-slate-400" />}
        </button>
        {expandedSections.typography && (
          <div className="p-3 space-y-3">
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

      {/* Color & Effects Section */}
      <div className="space-y-3 rounded-xl border border-slate-200 overflow-hidden">
        <button
          onClick={() => toggleSection('color')}
          className="w-full flex items-center justify-between p-3 bg-slate-50 hover:bg-slate-100 transition-colors"
        >
          <div className="text-xs font-semibold text-slate-700 uppercase tracking-wide">Color & Effects</div>
          {expandedSections.color ? <ChevronDown className="w-4 h-4 text-slate-400" /> : <ChevronRight className="w-4 h-4 text-slate-400" />}
        </button>
        {expandedSections.color && (
          <div className="p-3 space-y-3">
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
              <div className="text-xs text-slate-500 mt-1">Example: 2px 2px 4px rgba(0,0,0,0.3)</div>
            </div>
          </div>
        )}
      </div>

      {/* Spacing Section */}
      <div className="space-y-3 rounded-xl border border-slate-200 overflow-hidden">
        <button
          onClick={() => toggleSection('spacing')}
          className="w-full flex items-center justify-between p-3 bg-slate-50 hover:bg-slate-100 transition-colors"
        >
          <div className="text-xs font-semibold text-slate-700 uppercase tracking-wide">Spacing</div>
          {expandedSections.spacing ? <ChevronDown className="w-4 h-4 text-slate-400" /> : <ChevronRight className="w-4 h-4 text-slate-400" />}
        </button>
        {expandedSections.spacing && (
          <div className="p-3 space-y-4">
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
          </div>
        )}
      </div>

      {/* Advanced Section */}
      <div className="space-y-3 rounded-xl border border-slate-200 overflow-hidden">
        <button
          onClick={() => toggleSection('advanced')}
          className="w-full flex items-center justify-between p-3 bg-slate-50 hover:bg-slate-100 transition-colors"
        >
          <div className="text-xs font-semibold text-slate-700 uppercase tracking-wide">Advanced</div>
          {expandedSections.advanced ? <ChevronDown className="w-4 h-4 text-slate-400" /> : <ChevronRight className="w-4 h-4 text-slate-400" />}
        </button>
        {expandedSections.advanced && (
          <div className="p-3 space-y-3">
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

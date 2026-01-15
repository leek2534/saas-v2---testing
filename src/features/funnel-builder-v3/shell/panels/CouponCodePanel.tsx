"use client";

import React from "react";
import { useFunnelEditorStore } from "../../store/store";
import type { ElementNode } from "../../store/types";
import { TextField, ColorField, NumberField } from "../controls";

export function CouponCodePanel({ node }: { node: ElementNode }) {
  const updateNodeProps = useFunnelEditorStore((s) => s.updateNodeProps);

  return (
    <div className="space-y-4">
      {/* Coupon Code */}
      <TextField 
        label="Coupon Code" 
        value={node.props.code ?? "SAVE20"} 
        onChange={(v) => updateNodeProps(node.id, { code: v })} 
      />

      {/* Label */}
      <TextField 
        label="Label" 
        value={node.props.label ?? "Coupon code"} 
        onChange={(v) => updateNodeProps(node.id, { label: v })} 
      />

      {/* Copy Button Text */}
      <TextField 
        label="Copy Button Text" 
        value={node.props.copyButtonText ?? "Copy"} 
        onChange={(v) => updateNodeProps(node.id, { copyButtonText: v })} 
      />

      {/* Copied Text */}
      <TextField 
        label="Copied Text" 
        value={node.props.copiedText ?? "Copied!"} 
        onChange={(v) => updateNodeProps(node.id, { copiedText: v })} 
      />

      {/* Alignment */}
      <div className="space-y-2">
        <div className="text-xs font-semibold text-slate-700">Alignment</div>
        <div className="grid grid-cols-3 gap-2">
          {["left", "center", "right"].map((align) => (
            <button
              key={align}
              onClick={() => updateNodeProps(node.id, { align })}
              className={`h-8 rounded border-2 text-xs font-medium capitalize transition-all ${
                (node.props.align ?? "center") === align
                  ? "border-blue-500 bg-blue-50 text-blue-700"
                  : "border-slate-200 hover:border-slate-300 text-slate-600"
              }`}
            >
              {align}
            </button>
          ))}
        </div>
      </div>

      {/* Colors */}
      <div className="space-y-3 rounded-xl border border-slate-200 p-3">
        <div className="text-xs font-semibold text-slate-700 uppercase tracking-wide">Colors</div>
        <ColorField 
          label="Background" 
          value={node.props.style?.background ?? "#F3F4F6"} 
          onChange={(v) => updateNodeProps(node.id, { style: { ...node.props.style, background: v } })} 
        />
        <ColorField 
          label="Border" 
          value={node.props.style?.borderColor ?? "#E5E7EB"} 
          onChange={(v) => updateNodeProps(node.id, { style: { ...node.props.style, borderColor: v } })} 
        />
        <ColorField 
          label="Text" 
          value={node.props.style?.textColor ?? "#111827"} 
          onChange={(v) => updateNodeProps(node.id, { style: { ...node.props.style, textColor: v } })} 
        />
      </div>

      {/* Font Size */}
      <div className="space-y-2">
        <div className="text-xs font-semibold text-slate-700">Code Font Size</div>
        <div className="flex items-center gap-3">
          <input
            type="range"
            min={12}
            max={40}
            value={node.props.style?.codeFontSize ?? 20}
            onChange={(e) => updateNodeProps(node.id, { style: { ...node.props.style, codeFontSize: Number(e.target.value) } })}
            className="flex-1 h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
          />
          <input
            type="number"
            value={node.props.style?.codeFontSize ?? 20}
            onChange={(e) => updateNodeProps(node.id, { style: { ...node.props.style, codeFontSize: Number(e.target.value) } })}
            className="w-14 px-2 py-1 text-xs border border-slate-200 rounded text-right"
          />
          <span className="text-xs text-slate-400">px</span>
        </div>
      </div>

      {/* Gap to Next */}
      <NumberField 
        label="Gap to Next Element" 
        value={node.props.gapToNext ?? 20} 
        min={0} 
        max={100} 
        onChange={(v) => updateNodeProps(node.id, { gapToNext: v })} 
      />
    </div>
  );
}

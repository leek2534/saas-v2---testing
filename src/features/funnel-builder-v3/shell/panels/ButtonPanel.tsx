"use client";

import React from "react";
import { useFunnelEditorStore } from "../../store/store";
import type { ElementNode } from "../../store/types";
import { TextField, ColorField, NumberField } from "../controls";

export function ButtonPanel({ node }: { node: ElementNode }) {
  const updateNodeProps = useFunnelEditorStore((s) => s.updateNodeProps);

  return (
    <div className="space-y-4">
      {/* Button Text */}
      <TextField 
        label="Button Text" 
        value={node.props.text ?? "Click me"} 
        onChange={(v) => updateNodeProps(node.id, { text: v })} 
      />

      {/* Button Link */}
      <TextField 
        label="Link URL" 
        value={node.props.href ?? ""} 
        onChange={(v) => updateNodeProps(node.id, { href: v })} 
      />

      {/* Button Size */}
      <div className="space-y-2">
        <div className="text-xs font-semibold text-slate-700">Size</div>
        <div className="grid grid-cols-3 gap-2">
          {["sm", "md", "lg"].map((size) => (
            <button
              key={size}
              onClick={() => updateNodeProps(node.id, { size })}
              className={`h-8 rounded border-2 text-xs font-medium uppercase transition-all ${
                (node.props.size ?? "md") === size
                  ? "border-blue-500 bg-blue-50 text-blue-700"
                  : "border-slate-200 hover:border-slate-300 text-slate-600"
              }`}
            >
              {size}
            </button>
          ))}
        </div>
      </div>

      {/* Button Variant */}
      <div className="space-y-2">
        <div className="text-xs font-semibold text-slate-700">Variant</div>
        <div className="grid grid-cols-2 gap-2">
          {["solid", "outline"].map((variant) => (
            <button
              key={variant}
              onClick={() => updateNodeProps(node.id, { variant })}
              className={`h-8 rounded border-2 text-xs font-medium capitalize transition-all ${
                (node.props.variant ?? "solid") === variant
                  ? "border-blue-500 bg-blue-50 text-blue-700"
                  : "border-slate-200 hover:border-slate-300 text-slate-600"
              }`}
            >
              {variant}
            </button>
          ))}
        </div>
      </div>

      {/* Colors */}
      <div className="space-y-3 rounded-xl border border-slate-200 p-3">
        <div className="text-xs font-semibold text-slate-700 uppercase tracking-wide">Colors</div>
        <ColorField 
          label="Background" 
          value={node.props.bgColor ?? "#3b82f6"} 
          onChange={(v) => updateNodeProps(node.id, { bgColor: v })} 
        />
        <ColorField 
          label="Text" 
          value={node.props.textColor ?? "#ffffff"} 
          onChange={(v) => updateNodeProps(node.id, { textColor: v })} 
        />
        <ColorField 
          label="Border" 
          value={node.props.borderColor ?? "#3b82f6"} 
          onChange={(v) => updateNodeProps(node.id, { borderColor: v })} 
        />
      </div>

      {/* Border Radius */}
      <div className="space-y-2">
        <div className="text-xs font-semibold text-slate-700">Border Radius</div>
        <div className="flex items-center gap-3">
          <input
            type="range"
            min={0}
            max={50}
            value={node.props.borderRadius ?? 8}
            onChange={(e) => updateNodeProps(node.id, { borderRadius: Number(e.target.value) })}
            className="flex-1 h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
          />
          <input
            type="number"
            value={node.props.borderRadius ?? 8}
            onChange={(e) => updateNodeProps(node.id, { borderRadius: Number(e.target.value) })}
            className="w-14 px-2 py-1 text-xs border border-slate-200 rounded text-right"
          />
          <span className="text-xs text-slate-400">px</span>
        </div>
      </div>

      {/* Padding */}
      <div className="space-y-2">
        <div className="text-xs font-semibold text-slate-700">Padding</div>
        <div className="grid grid-cols-2 gap-2">
          <NumberField label="X" value={node.props.paddingX ?? 24} min={0} max={80} onChange={(v) => updateNodeProps(node.id, { paddingX: v })} />
          <NumberField label="Y" value={node.props.paddingY ?? 12} min={0} max={80} onChange={(v) => updateNodeProps(node.id, { paddingY: v })} />
        </div>
      </div>

      {/* Margin */}
      <div className="space-y-2">
        <div className="text-xs font-semibold text-slate-700">Margin</div>
        <div className="grid grid-cols-2 gap-2">
          <NumberField label="Top" value={node.props.marginTop ?? 0} min={-80} max={200} onChange={(v) => updateNodeProps(node.id, { marginTop: v })} />
          <NumberField label="Bottom" value={node.props.marginBottom ?? 0} min={-80} max={200} onChange={(v) => updateNodeProps(node.id, { marginBottom: v })} />
        </div>
      </div>

      {/* Full Width */}
      <div className="flex items-center justify-between rounded-xl border border-slate-200 p-3">
        <span className="text-xs font-semibold text-slate-700">Full Width</span>
        <input
          type="checkbox"
          checked={node.props.fullWidth === true}
          onChange={(e) => updateNodeProps(node.id, { fullWidth: e.target.checked })}
          className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
        />
      </div>
    </div>
  );
}

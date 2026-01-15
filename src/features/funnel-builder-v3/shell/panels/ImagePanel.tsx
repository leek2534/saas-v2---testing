"use client";

import React from "react";
import { useFunnelEditorStore } from "../../store/store";
import type { ElementNode } from "../../store/types";
import { NumberField } from "../controls";

export function ImagePanel({ node }: { node: ElementNode }) {
  const updateNodeProps = useFunnelEditorStore((s) => s.updateNodeProps);

  return (
    <div className="space-y-4">
      {/* Image Preview */}
      <div className="space-y-2">
        <div className="text-xs font-semibold text-slate-700 uppercase tracking-wide">Preview</div>
        <div className="rounded-xl border border-slate-200 p-3 bg-slate-50">
          {node.props.src ? (
            <img
              src={node.props.src}
              alt={node.props.alt || "Image preview"}
              className="w-full h-auto rounded-lg"
              style={{ maxHeight: 200, objectFit: "cover" }}
            />
          ) : (
            <div className="flex items-center justify-center h-32 bg-slate-100 rounded-lg text-slate-400 text-sm">
              No image source
            </div>
          )}
        </div>
      </div>

      {/* Image Source */}
      <div className="space-y-2 rounded-xl border border-slate-200 p-3">
        <div className="text-xs font-semibold text-slate-700 uppercase tracking-wide">Image Source</div>
        <div>
          <div className="text-xs text-slate-600 mb-2">Image URL</div>
          <input
            type="text"
            value={node.props.src ?? ""}
            onChange={(e) => updateNodeProps(node.id, { src: e.target.value })}
            className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg font-mono"
            placeholder="https://example.com/image.jpg"
          />
        </div>
        <div>
          <div className="text-xs text-slate-600 mb-2">Alt Text</div>
          <input
            type="text"
            value={node.props.alt ?? ""}
            onChange={(e) => updateNodeProps(node.id, { alt: e.target.value })}
            className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg"
            placeholder="Describe the image"
          />
        </div>
      </div>

      {/* Dimensions */}
      <div className="space-y-3 rounded-xl border border-slate-200 p-3">
        <div className="text-xs font-semibold text-slate-700 uppercase tracking-wide">Dimensions</div>
        <div>
          <div className="text-xs text-slate-600 mb-2">Max Width</div>
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
            <input
              type="number"
              value={node.props.maxWidth ?? 600}
              onChange={(e) => updateNodeProps(node.id, { maxWidth: Number(e.target.value) })}
              className="w-16 px-2 py-1 text-xs border border-slate-200 rounded text-right"
            />
            <span className="text-xs text-slate-400">px</span>
          </div>
        </div>
      </div>

      {/* Display */}
      <div className="space-y-3 rounded-xl border border-slate-200 p-3">
        <div className="text-xs font-semibold text-slate-700 uppercase tracking-wide">Display</div>
        
        {/* Object Fit */}
        <div>
          <div className="text-xs text-slate-600 mb-2">Fit</div>
          <div className="grid grid-cols-3 gap-1">
            {["cover", "contain", "fill"].map((fit) => (
              <button
                key={fit}
                onClick={() => updateNodeProps(node.id, { objectFit: fit })}
                className={`h-8 rounded border-2 text-xs font-medium capitalize transition-all ${
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

        {/* Aspect Ratio */}
        <div>
          <div className="text-xs text-slate-600 mb-2">Frame Aspect Ratio</div>
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
                className={`h-8 rounded border-2 text-xs font-medium transition-all ${
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

        {/* Frame Background */}
        <div>
          <div className="text-xs text-slate-600 mb-2">Frame Background</div>
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
              placeholder="#f1f5f9"
            />
          </div>
        </div>

        {/* Border Radius */}
        <div>
          <div className="text-xs text-slate-600 mb-2">Border Radius</div>
          <div className="flex items-center gap-3">
            <input
              type="range"
              min={0}
              max={50}
              value={node.props.borderRadius ?? 12}
              onChange={(e) => updateNodeProps(node.id, { borderRadius: Number(e.target.value) })}
              className="flex-1 h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
            <input
              type="number"
              value={node.props.borderRadius ?? 12}
              onChange={(e) => updateNodeProps(node.id, { borderRadius: Number(e.target.value) })}
              className="w-14 px-2 py-1 text-xs border border-slate-200 rounded text-right"
            />
            <span className="text-xs text-slate-400">px</span>
          </div>
        </div>
      </div>

      {/* Border */}
      <div className="space-y-3 rounded-xl border border-slate-200 p-3">
        <div className="text-xs font-semibold text-slate-700 uppercase tracking-wide">Border</div>
        
        {/* Border Width */}
        <div>
          <div className="text-xs text-slate-600 mb-2">Border Width</div>
          <div className="flex items-center gap-3">
            <input
              type="range"
              min={0}
              max={20}
              value={node.props.borderWidth ?? 0}
              onChange={(e) => updateNodeProps(node.id, { borderWidth: Number(e.target.value) })}
              className="flex-1 h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
            <input
              type="number"
              value={node.props.borderWidth ?? 0}
              onChange={(e) => updateNodeProps(node.id, { borderWidth: Number(e.target.value) })}
              className="w-14 px-2 py-1 text-xs border border-slate-200 rounded text-right"
            />
            <span className="text-xs text-slate-400">px</span>
          </div>
        </div>

        {/* Border Color */}
        {(node.props.borderWidth ?? 0) > 0 && (
          <div>
            <div className="text-xs text-slate-600 mb-2">Border Color</div>
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
                placeholder="#e2e8f0"
              />
            </div>
          </div>
        )}
      </div>

      {/* Padding */}
      <div className="space-y-2">
        <div className="text-xs font-semibold text-slate-700">Padding</div>
        <div className="grid grid-cols-2 gap-2">
          <NumberField label="Top" value={node.props.paddingTop ?? 0} min={0} max={80} onChange={(v) => updateNodeProps(node.id, { paddingTop: v })} />
          <NumberField label="Bottom" value={node.props.paddingBottom ?? 0} min={0} max={80} onChange={(v) => updateNodeProps(node.id, { paddingBottom: v })} />
          <NumberField label="Left" value={node.props.paddingLeft ?? 0} min={0} max={80} onChange={(v) => updateNodeProps(node.id, { paddingLeft: v })} />
          <NumberField label="Right" value={node.props.paddingRight ?? 0} min={0} max={80} onChange={(v) => updateNodeProps(node.id, { paddingRight: v })} />
        </div>
      </div>

      {/* Margin */}
      <div className="space-y-2">
        <div className="text-xs font-semibold text-slate-700">Margin</div>
        <div className="grid grid-cols-2 gap-2">
          <NumberField label="Top" value={node.props.marginTop ?? 0} min={-80} max={200} onChange={(v) => updateNodeProps(node.id, { marginTop: v })} />
          <NumberField label="Bottom" value={node.props.marginBottom ?? 0} min={-80} max={200} onChange={(v) => updateNodeProps(node.id, { marginBottom: v })} />
          <NumberField label="Left" value={node.props.marginLeft ?? 0} min={-80} max={200} onChange={(v) => updateNodeProps(node.id, { marginLeft: v })} />
          <NumberField label="Right" value={node.props.marginRight ?? 0} min={-80} max={200} onChange={(v) => updateNodeProps(node.id, { marginRight: v })} />
        </div>
      </div>
    </div>
  );
}

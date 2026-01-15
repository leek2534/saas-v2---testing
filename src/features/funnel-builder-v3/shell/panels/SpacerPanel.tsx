"use client";

import React from "react";
import { useFunnelEditorStore } from "../../store/store";
import type { ElementNode } from "../../store/types";
import { NumberField } from "../controls";

export function SpacerPanel({ node }: { node: ElementNode }) {
  const updateNodeProps = useFunnelEditorStore((s) => s.updateNodeProps);

  return (
    <div className="space-y-4">
      {/* Height */}
      <div className="space-y-2">
        <div className="text-xs font-semibold text-slate-700">Height</div>
        <div className="flex items-center gap-3">
          <input
            type="range"
            min={0}
            max={200}
            value={node.props.height ?? 20}
            onChange={(e) => updateNodeProps(node.id, { height: Number(e.target.value) })}
            className="flex-1 h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
          />
          <input
            type="number"
            value={node.props.height ?? 20}
            onChange={(e) => updateNodeProps(node.id, { height: Number(e.target.value) })}
            className="w-16 px-2 py-1 text-xs border border-slate-200 rounded text-right"
          />
          <span className="text-xs text-slate-400">px</span>
        </div>
      </div>

      <div className="text-sm text-slate-600">
        Add vertical spacing between elements.
      </div>
    </div>
  );
}

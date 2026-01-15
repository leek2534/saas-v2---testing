"use client";

import React from "react";
import { useFunnelEditorStore } from "../store/store";
import { Paintbrush, Maximize, Zap, Copy, Trash2, ChevronLeft } from "lucide-react";
import type { ElementNode } from "../store/types";

export function InspectorPeek() {
  const selectedId = useFunnelEditorStore((s) => s.selectedId);
  const tree = useFunnelEditorStore((s) => s.tree);
  const setInspectorState = useFunnelEditorStore((s) => s.setInspectorState);

  const node = selectedId ? tree.nodes[selectedId] : null;
  const nodeType = node?.type === "element" ? (node as ElementNode).props.kind : node?.type;

  const handleExpand = () => {
    setInspectorState("open", true);
  };

  return (
    <aside className="h-full w-[88px] shrink-0 border-l border-slate-200 bg-white flex flex-col items-center py-4 gap-3 pb-[60px]">
      {/* Node type badge */}
      {nodeType && (
        <div className="px-2 py-1 bg-slate-100 rounded text-[10px] font-medium text-slate-600 capitalize text-center">
          {nodeType}
        </div>
      )}

      {/* Expand button */}
      <div className="mt-auto">
        <button
          onClick={handleExpand}
          className="p-2 rounded hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
          title="Expand inspector"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
      </div>
    </aside>
  );
}

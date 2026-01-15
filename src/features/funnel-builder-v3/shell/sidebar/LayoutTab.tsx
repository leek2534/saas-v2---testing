"use client";

import React from "react";
import { LayoutTemplate, Rows3, Columns3 } from "lucide-react";
import { useFunnelEditorStore } from "../../store/store";
import { cn } from "@/lib/utils";
import type { AnyNode } from "../../store/types";

export function LayoutTab() {
  const addSection = useFunnelEditorStore((s) => s.addSection);
  const addSectionToActivePopup = useFunnelEditorStore((s) => s.addSectionToActivePopup);
  const addRow = useFunnelEditorStore((s) => s.addRow);
  const addColumn = useFunnelEditorStore((s) => s.addColumn);
  const tree = useFunnelEditorStore((s) => s.tree);
  const selectedId = useFunnelEditorStore((s) => s.selectedId);
  const workspace = useFunnelEditorStore((s) => s.workspace);

  const selectedNode = selectedId ? (tree.nodes[selectedId] as AnyNode | undefined) : undefined;
  const canAddRow = selectedNode?.type === "section";
  const canAddColumn = selectedNode?.type === "row";

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        <div className="text-xs font-semibold text-slate-500 mb-3">Structure</div>

        {/* Add Section */}
        <button
          onClick={workspace === "popup" ? addSectionToActivePopup : addSection}
          className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-left text-sm hover:bg-slate-100 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100">
              <LayoutTemplate size={20} className="text-blue-600" />
            </div>
            <div className="flex-1">
              <div className="font-medium text-slate-900">
                {workspace === "popup" ? "Add Popup Section" : "Add Section"}
              </div>
              <div className="text-xs text-slate-500 mt-0.5">
                Container for rows and content
              </div>
            </div>
          </div>
        </button>

        {/* Add Row */}
        <button
          onClick={() => canAddRow && addRow()}
          disabled={!canAddRow}
          className={cn(
            "w-full rounded-xl border border-slate-200 px-3 py-3 text-left text-sm transition-colors",
            canAddRow ? "bg-slate-50 hover:bg-slate-100" : "bg-slate-50 opacity-40 cursor-not-allowed"
          )}
        >
          <div className="flex items-center gap-3">
            <div className={cn(
              "flex h-10 w-10 items-center justify-center rounded-lg",
              canAddRow ? "bg-green-100" : "bg-slate-100"
            )}>
              <Rows3 size={20} className={canAddRow ? "text-green-600" : "text-slate-400"} />
            </div>
            <div className="flex-1">
              <div className="font-medium text-slate-900">Add Row</div>
              <div className="text-xs text-slate-500 mt-0.5">
                {canAddRow ? "Horizontal container for columns" : "Select a section first"}
              </div>
            </div>
          </div>
        </button>

        {/* Add Column */}
        <button
          onClick={() => canAddColumn && addColumn()}
          disabled={!canAddColumn}
          className={cn(
            "w-full rounded-xl border border-slate-200 px-3 py-3 text-left text-sm transition-colors",
            canAddColumn ? "bg-slate-50 hover:bg-slate-100" : "bg-slate-50 opacity-40 cursor-not-allowed"
          )}
        >
          <div className="flex items-center gap-3">
            <div className={cn(
              "flex h-10 w-10 items-center justify-center rounded-lg",
              canAddColumn ? "bg-purple-100" : "bg-slate-100"
            )}>
              <Columns3 size={20} className={canAddColumn ? "text-purple-600" : "text-slate-400"} />
            </div>
            <div className="flex-1">
              <div className="font-medium text-slate-900">Add Column</div>
              <div className="text-xs text-slate-500 mt-0.5">
                {canAddColumn ? "Vertical space for elements" : "Select a row first"}
              </div>
            </div>
          </div>
        </button>

        {/* Layout Presets Section */}
        <div className="pt-4 border-t border-slate-200">
          <div className="text-xs font-semibold text-slate-500 mb-3">Quick Layouts</div>
          <div className="text-xs text-slate-500 bg-blue-50 border border-blue-200 rounded-lg p-3">
            Coming soon: Pre-built layout templates (2-column, 3-column, sidebar, etc.)
          </div>
        </div>
      </div>
    </div>
  );
}

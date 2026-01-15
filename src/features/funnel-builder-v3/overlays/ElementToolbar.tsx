"use client";

import React from "react";
import { Copy, Settings, Trash2, GripVertical } from "lucide-react";
import { useFunnelEditorStore } from "../store/store";

interface ElementToolbarProps {
  elementId: string;
  rect: DOMRect;
  onDragStart: (e: React.DragEvent) => void;
}

export function ElementToolbar({ elementId, rect, onDragStart }: ElementToolbarProps) {
  const duplicateElement = useFunnelEditorStore((s) => s.duplicateElement);
  const deleteNode = useFunnelEditorStore((s) => s.deleteNode);
  const select = useFunnelEditorStore((s) => s.select);

  const handleDuplicate = (e: React.MouseEvent) => {
    e.stopPropagation();
    duplicateElement(elementId);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    deleteNode(elementId);
  };

  const handleSettings = (e: React.MouseEvent) => {
    e.stopPropagation();
    select(elementId);
  };

  return (
    <>
      {/* Drag Handle - Top Left */}
      <div
        style={{
          position: "fixed",
          left: rect.left - 24,
          top: rect.top,
          zIndex: 10000,
        }}
        className="flex items-center justify-center w-6 h-6 bg-white border-2 border-slate-400 rounded cursor-move hover:border-blue-500 hover:bg-blue-50 transition-colors shadow-sm"
        draggable
        onDragStart={(e) => {
          onDragStart(e);
          // Add visual feedback to the actual element being dragged
          const elementNode = document.querySelector(`[data-node-id="${elementId}"]`);
          if (elementNode instanceof HTMLElement) {
            elementNode.dataset.dragging = "true";
            elementNode.style.opacity = "0.3";
          }
        }}
        onDragEnd={() => {
          // Reset visual feedback - remove inline styles completely
          const elementNode = document.querySelector(`[data-node-id="${elementId}"]`);
          if (elementNode instanceof HTMLElement) {
            delete elementNode.dataset.dragging;
            elementNode.style.removeProperty("opacity");
          }
        }}
      >
        <GripVertical className="h-4 w-4 text-slate-700" />
      </div>

      {/* Toolbar - Top Right */}
      <div
        style={{
          position: "fixed",
          right: window.innerWidth - rect.right,
          top: rect.top,
          zIndex: 10000,
        }}
        className="flex items-center gap-1 bg-white border border-slate-300 rounded shadow-sm"
      >
        <button
          onClick={handleDuplicate}
          className="p-1.5 hover:bg-slate-100 transition-colors rounded"
          title="Duplicate"
        >
          <Copy className="h-4 w-4 text-slate-600" />
        </button>
        <button
          onClick={handleSettings}
          className="p-1.5 hover:bg-slate-100 transition-colors rounded"
          title="Settings"
        >
          <Settings className="h-4 w-4 text-slate-600" />
        </button>
        <button
          onClick={handleDelete}
          className="p-1.5 hover:bg-red-100 transition-colors rounded"
          title="Delete"
        >
          <Trash2 className="h-4 w-4 text-red-600" />
        </button>
      </div>
    </>
  );
}

"use client";

import React from "react";

export function OutlineLabel({
  rect,
  layer,
  nodeId,
  onSelect,
  onSelectParent,
}: {
  rect: DOMRect;
  layer: "element" | "row" | "section" | "column";
  nodeId: string;
  onSelect: (id: string) => void;
  onSelectParent: (() => void) | null;
}) {
  // Don't show labels for columns - they should be invisible
  if (layer === "column") {
    return null;
  }

  const bg =
    layer === "element" ? "rgba(249,115,22,1)" :
    layer === "row" ? "rgba(34,197,94,1)" :
    "rgba(59,130,246,1)";

  const label =
    layer === "element" ? "Element" :
    layer === "row" ? "Row" :
    "Section";

  return (
    <div
      className="pointer-events-none"
      style={{
        position: "fixed",
        left: rect.left + 6,
        top: Math.max(6, rect.top - 28),
        zIndex: 60,
      }}
    >
      <div
        className="pointer-events-auto"
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 6,
          padding: "4px 8px",
          fontSize: 12,
          fontWeight: 500,
          color: "white",
          background: bg,
          borderRadius: 6,
          userSelect: "none",
          cursor: "pointer",
        }}
        data-node-id={nodeId}
        data-select-handle={layer}
        onMouseDown={(e) => {
          e.stopPropagation();
          onSelect(nodeId);
        }}
      >
        <span>{label}</span>

        {onSelectParent && (
          <button
            style={{
              marginLeft: 6,
              padding: "2px 6px",
              borderRadius: 6,
              background: "rgba(255,255,255,0.18)",
              border: "none",
              color: "white",
              cursor: "pointer",
              fontSize: 12,
              fontWeight: 600,
            }}
            onMouseDown={(e) => {
              e.stopPropagation();
              onSelectParent();
            }}
            title="Select parent"
          >
            ↑
          </button>
        )}
      </div>
    </div>
  );
}

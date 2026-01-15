"use client";

import React from "react";

export function SelectionOutline({ rect }: { rect: DOMRect }) {
  // Inset the outline slightly to keep it within boundaries
  const inset = 2;

  return (
    <div
      style={{
        position: "fixed",
        left: rect.left + inset,
        top: rect.top + inset,
        width: rect.width - (inset * 2),
        height: rect.height - (inset * 2),
        border: "2px solid #3b82f6",
        borderRadius: 6,
        boxShadow: "0 0 0 1px rgba(59,130,246,0.2)",
        pointerEvents: "none",
      }}
    />
  );
}

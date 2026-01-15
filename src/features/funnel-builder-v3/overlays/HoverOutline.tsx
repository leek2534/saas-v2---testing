"use client";

import React from "react";

export function Outline({
  rect,
  layer,
  variant,
}: {
  rect: DOMRect;
  layer: "element" | "row" | "section" | "column";
  variant: "hover" | "selected";
}) {
  // Don't show outlines for columns - they should be invisible
  if (layer === "column") {
    return null;
  }

  const color =
    layer === "element" ? "rgba(249,115,22,1)" :
    layer === "row" ? "rgba(34,197,94,1)" :
    "rgba(59,130,246,1)";

  const borderWidth = variant === "selected" ? 3 : 2;
  const opacity = variant === "selected" ? 1 : 0.85;
  const overlap = layer === "element" ? 1.5 : 0;
  
  // Add shadow for hover variant to make it more visible
  const boxShadow = variant === "hover" 
    ? `0 0 0 1px ${color}, 0 4px 12px rgba(0, 0, 0, 0.15), inset 0 0 0 1px ${color}`
    : undefined;

  return (
    <div
      style={{
        position: "fixed",
        left: rect.left,
        top: rect.top - overlap,
        width: rect.width,
        height: rect.height + overlap * 2,
        border: `${borderWidth}px solid ${color}`,
        borderRadius: 0,
        pointerEvents: "none",
        opacity,
        boxShadow,
      }}
    />
  );
}

// Legacy export for backwards compatibility
export const HoverOutline = Outline;

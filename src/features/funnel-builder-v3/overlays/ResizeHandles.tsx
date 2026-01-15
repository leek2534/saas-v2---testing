"use client";

import React, { useMemo, useState, useCallback } from "react";
import { useFunnelEditorStore } from "../store/store";
import { useDomRegistry } from "./DomRegistry";
import type { ColumnNode } from "../store/types";

// Keep these values in sync with overlays/HoverOutline.tsx so the resize UI
// visually matches row hover + row selected outlines.
const ROW_OUTLINE_COLOR = "rgba(34,197,94,1)";

export function ResizeHandles() {
  const tree = useFunnelEditorStore((s) => s.tree);
  const hovered = useFunnelEditorStore((s) => s.hovered);
  const selectedId = useFunnelEditorStore((s) => s.selectedId);
  const resizeAdjacentColumns = useFunnelEditorStore((s) => s.resizeAdjacentColumns);
  const getEl = useDomRegistry((s) => s.get);
  const viewport = useFunnelEditorStore((s) => s.viewport);

  // Recommended: column resizing only on desktop (tablet/mobile typically stacks).
  if (viewport !== "desktop") return null;

  const selectedRowId = useMemo(() => {
    if (!selectedId) return null;

    const sel = tree.nodes[selectedId];
    if (!sel) return null;

    if (sel.type === "row") return selectedId;
    if (sel.type === "column") return sel.parentId ?? null;

    if (sel.type === "element") {
      const colId = (sel as any).parentId as string | undefined;
      const col = colId ? tree.nodes[colId] : null;
      if (col?.type === "column") return col.parentId ?? null;
    }

    return null;
  }, [selectedId, tree]);

  const activeRowId = (() => {
    // Prefer explicit row hover, but fall back to hovered column/element parent row.
    if (hovered.rowId) return hovered.rowId;

    if (hovered.columnId) {
      const col = tree.nodes[hovered.columnId];
      if (col?.type === "column") return col.parentId;
    }

    if (hovered.elementId) {
      const el = tree.nodes[hovered.elementId];
      const colId = el?.parentId;
      if (colId) {
        const col = tree.nodes[colId];
        if (col?.type === "column") return col.parentId;
      }
    }

    // Recommended: if anything inside the row is selected, keep the row "active"
    // so resize handles stay visible and match the selected outline.
    if (selectedRowId) return selectedRowId;

    return null;
  })();

  const isRowSelected = !!activeRowId && !!selectedRowId && activeRowId === selectedRowId;
  const rowVariant: "hover" | "selected" = isRowSelected ? "selected" : "hover";

  const [draggingKey, setDraggingKey] = useState<string | null>(null);

  const handles = useMemo(() => {
    if (!activeRowId) return [];

    const row = tree.nodes[activeRowId];
    if (!row || row.type !== "row") return [];

    const childIds = (row as any).children || (row as any).childIds || (row as any).childrenIds || [];
    if (childIds.length < 2) return [];

    // Use row element bounds so the resize line is visually "attached" to the row.
    const rowEl = getEl(activeRowId);
    if (!rowEl) return [];
    const rowRect = rowEl.getBoundingClientRect();

    const list: Array<{
      key: string;
      leftId: string;
      rightId: string;
      x: number;
      top: number;
      height: number;
      rowWidth: number;
    }> = [];

    for (let i = 0; i < childIds.length - 1; i++) {
      const leftId = childIds[i];
      const rightId = childIds[i + 1];

      const leftEl = getEl(leftId);
      const rightEl = getEl(rightId);
      if (!leftEl || !rightEl) continue;

      const l = leftEl.getBoundingClientRect();
      const r = rightEl.getBoundingClientRect();

      // Center the handle in the gutter between columns.
      const x = (l.right + r.left) / 2;

      // Combined width of both columns (including gap between them)
      const combinedWidth = r.right - l.left;

      list.push({
        key: `${leftId}:${rightId}`,
        leftId,
        rightId,
        x,
        top: rowRect.top,
        height: rowRect.height,
        rowWidth: combinedWidth,
      });
    }

    return list;
  }, [activeRowId, tree, getEl]);

  const onPointerDown = useCallback(
    (e: React.PointerEvent, h: (typeof handles)[number]) => {
      e.preventDefault();
      e.stopPropagation();
      setDraggingKey(h.key);

      const pointerId = e.pointerId;
      (e.currentTarget as HTMLElement).setPointerCapture(pointerId);

      const left = tree.nodes[h.leftId] as ColumnNode | undefined;
      const right = tree.nodes[h.rightId] as ColumnNode | undefined;
      if (!left || !right) return;

      const startX = e.clientX;

      const leftFraction = (left.props as any).widthFraction ?? (left.props as any).widthPct ?? 50;
      const rightFraction = (right.props as any).widthFraction ?? (right.props as any).widthPct ?? 50;
      const totalFraction = leftFraction + rightFraction;

      const handleMove = (pe: PointerEvent) => {
        if (pe.pointerId !== pointerId) return;

        const dx = pe.clientX - startX;
        const deltaFraction = (dx / Math.max(h.rowWidth, 1)) * totalFraction;

        // Recommended: allow tight layouts but prevent collapsing.
        const minCol = 3; // 3% min width per column (your preference)
        const maxLeft = totalFraction - minCol;

        const nextLeft = Math.max(minCol, Math.min(maxLeft, leftFraction + deltaFraction));
        const nextRight = totalFraction - nextLeft;

        resizeAdjacentColumns(h.leftId, h.rightId, nextLeft, nextRight);
      };

      const handleUp = (pe: PointerEvent) => {
        if (pe.pointerId !== pointerId) return;
        setDraggingKey(null);
        window.removeEventListener("pointermove", handleMove);
        window.removeEventListener("pointerup", handleUp);
      };

      window.addEventListener("pointermove", handleMove);
      window.addEventListener("pointerup", handleUp);
    },
    [resizeAdjacentColumns, tree, handles]
  );

  if (!handles.length) return null;

  const outlineWidth = rowVariant === "selected" ? 3 : 2;
  const outlineOpacity = rowVariant === "selected" ? 1 : 0.85;

  // Match HoverOutline hover styling for rows (shadow only on hover).
  const hoverShadow =
    rowVariant === "hover"
      ? `0 0 0 1px ${ROW_OUTLINE_COLOR}, 0 4px 12px rgba(0, 0, 0, 0.15), inset 0 0 0 1px ${ROW_OUTLINE_COLOR}`
      : undefined;

  return (
    <>
      {handles.map((h) => {
        const isDragging = draggingKey === h.key;

        // When dragging, keep matching the row outline color; add a subtle fill to show active drag.
        const lineColor = ROW_OUTLINE_COLOR;
        const lineShadow = hoverShadow;
        const fillBg = isDragging ? "rgba(34,197,94,0.15)" : "transparent";

        const showGrip = isRowSelected || isDragging;

        return (
          <div
            key={h.key}
            className="pointer-events-auto fixed z-[10000] group"
            style={{
              left: h.x - 8,
              top: h.top,
              width: 16,
              height: h.height,
              cursor: "col-resize",
            }}
            onPointerDown={(e) => onPointerDown(e, h)}
          >
            {/* Vertical line that matches row hover/selected outline */}
            <div
              className="absolute left-1/2 -translate-x-1/2 transition-opacity"
              style={{
                height: "100%",
                width: `${outlineWidth}px`,
                background: lineColor,
                opacity: outlineOpacity,
                boxShadow: lineShadow,
              }}
            />

            {/* Resize handle/grip */}
            <div
              className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transition-opacity ${
                showGrip ? "opacity-100" : "opacity-0 group-hover:opacity-100"
              }`}
              style={{
                width: "20px",
                height: "40px",
                background: lineColor,
                borderRadius: "4px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                pointerEvents: "none",
              }}
            >
              {/* Grip dots */}
              <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                <div style={{ display: "flex", gap: "2px" }}>
                  <div style={{ width: "3px", height: "3px", borderRadius: "50%", background: "white" }} />
                  <div style={{ width: "3px", height: "3px", borderRadius: "50%", background: "white" }} />
                </div>
                <div style={{ display: "flex", gap: "2px" }}>
                  <div style={{ width: "3px", height: "3px", borderRadius: "50%", background: "white" }} />
                  <div style={{ width: "3px", height: "3px", borderRadius: "50%", background: "white" }} />
                </div>
                <div style={{ display: "flex", gap: "2px" }}>
                  <div style={{ width: "3px", height: "3px", borderRadius: "50%", background: "white" }} />
                  <div style={{ width: "3px", height: "3px", borderRadius: "50%", background: "white" }} />
                </div>
              </div>
            </div>

            {/* Drag background indicator */}
            <div
              className="absolute inset-0 transition-all rounded"
              style={{
                background: fillBg,
              }}
            />
          </div>
        );
      })}
    </>
  );
}

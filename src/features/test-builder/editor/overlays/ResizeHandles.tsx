"use client";

import React, { useState, useCallback } from "react";
import { useEditor } from "../store/useEditorStore";
import { useDomRegistry } from "./domRegistry";
import { ColumnNode } from "../schema/nodes";
import { resolveHoverLayer } from "../store/editorStore";

export function ResizeHandles() {
  const { state, dispatch } = useEditor();
  const { get } = useDomRegistry();
  const [isDragging, setIsDragging] = useState(false);

  const hoverLayer = resolveHoverLayer(state.hovered, state.selected);
  const activeRowId = state.hovered.rowId || state.selected.rowId;

  if (hoverLayer === "element" || !activeRowId) return null;

  const activeRow = state.tree.nodes[activeRowId];
  if (!activeRow || activeRow.type !== "row") return null;

  const handlePointerDown = useCallback(
    (
      e: React.PointerEvent,
      leftNode: ColumnNode,
      rightNode: ColumnNode,
      leftRect: DOMRect,
      rightRect: DOMRect
    ) => {
      e.preventDefault();
      e.stopPropagation();

      const target = e.currentTarget as HTMLElement;
      target.setPointerCapture(e.pointerId);

      setIsDragging(true);

      const startX = e.clientX;
      const totalFraction = leftNode.props.widthFraction + rightNode.props.widthFraction;
      const totalWidth = leftRect.width + rightRect.width;

      const onMove = (moveEvent: PointerEvent) => {
        const deltaX = moveEvent.clientX - startX;
        const deltaFraction = totalWidth ? (deltaX / totalWidth) * totalFraction : 0;

        let newLeft = leftNode.props.widthFraction + deltaFraction;
        let newRight = rightNode.props.widthFraction - deltaFraction;

        const minFraction = totalFraction * 0.05;
        if (newLeft < minFraction) {
          newLeft = minFraction;
          newRight = totalFraction - minFraction;
        }
        if (newRight < minFraction) {
          newRight = minFraction;
          newLeft = totalFraction - minFraction;
        }

        dispatch({ type: "UPDATE_NODE_PROPS", nodeId: leftNode.id, props: { widthFraction: newLeft } });
        dispatch({ type: "UPDATE_NODE_PROPS", nodeId: rightNode.id, props: { widthFraction: newRight } });
      };

      const onUp = () => {
        setIsDragging(false);
        window.removeEventListener("pointermove", onMove);
        window.removeEventListener("pointerup", onUp);
      };

      window.addEventListener("pointermove", onMove);
      window.addEventListener("pointerup", onUp);
    },
    [dispatch]
  );

  if (activeRow.childrenIds.length < 2) return null;

  const handles: React.ReactNode[] = [];

  for (let i = 0; i < activeRow.childrenIds.length - 1; i++) {
    const leftId = activeRow.childrenIds[i];
    const rightId = activeRow.childrenIds[i + 1];

    const leftNode = state.tree.nodes[leftId] as ColumnNode;
    const rightNode = state.tree.nodes[rightId] as ColumnNode;
    if (!leftNode || !rightNode) continue;

    const leftEl = get(leftId);
    const rightEl = get(rightId);
    if (!leftEl || !rightEl) continue;

    const leftRect = leftEl.getBoundingClientRect();
    const rightRect = rightEl.getBoundingClientRect();

    const handleLeft = leftRect.right - 3;
    const handleTop = Math.min(leftRect.top, rightRect.top);
    const handleHeight = Math.max(leftRect.bottom, rightRect.bottom) - handleTop;

    handles.push(
      <div
        key={`${leftId}-${rightId}`}
        style={{
          position: "fixed",
          left: `${handleLeft}px`,
          top: `${handleTop}px`,
          width: "6px",
          height: `${handleHeight}px`,
          cursor: "col-resize",
          pointerEvents: "auto",
          zIndex: 10000,
          background: isDragging ? "rgba(59, 130, 246, 0.3)" : "transparent",
          transition: "background 0.1s ease",
        }}
        onPointerDown={(e) => handlePointerDown(e, leftNode, rightNode, leftRect, rightRect)}
        onPointerEnter={(e) => ((e.target as HTMLElement).style.background = "rgba(59, 130, 246, 0.2)")}
        onPointerLeave={(e) => {
          if (!isDragging) (e.target as HTMLElement).style.background = "transparent";
        }}
      />
    );
  }

  return <>{handles}</>;
}

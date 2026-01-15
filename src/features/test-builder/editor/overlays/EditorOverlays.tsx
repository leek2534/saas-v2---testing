"use client";

import React from "react";
import { useEditor } from "../store/useEditorStore";
import { useDomRegistry } from "./domRegistry";
import { HoverOutline } from "./HoverOutline";
import { SelectionOutline } from "./SelectionOutline";
import { ResizeHandles } from "./ResizeHandles";
import { resolveHoverLayer } from "../store/editorStore";

function topSelectedId(selected: { sectionId: string | null; rowId: string | null; columnId: string | null; elementId: string | null } | undefined) {
  if (!selected) return null;
  return selected.elementId || selected.rowId || selected.sectionId || selected.columnId || null;
}

export function EditorOverlays() {
  const { state } = useEditor();
  const { get } = useDomRegistry();

  const hoverLayer = resolveHoverLayer(state.hovered, state.selected);

  let hoveredRect: DOMRect | null = null;

  if (hoverLayer === "element") {
    const id = state.selected?.elementId || state.hovered?.elementId;
    hoveredRect = id ? get(id)?.getBoundingClientRect() || null : null;
  } else if (hoverLayer === "row") {
    const id = state.selected?.rowId || state.hovered?.rowId;
    hoveredRect = id ? get(id)?.getBoundingClientRect() || null : null;
  } else if (hoverLayer === "section") {
    const id = state.selected?.sectionId || state.hovered?.sectionId;
    hoveredRect = id ? get(id)?.getBoundingClientRect() || null : null;
  }

  const selectedId = topSelectedId(state.selected);
  const selectedRect = selectedId ? get(selectedId)?.getBoundingClientRect() || null : null;

  const showResize = hoverLayer !== "element" && !!(state.hovered?.rowId || state.selected?.rowId);

  return (
    <div style={{ position: "absolute", inset: 0, pointerEvents: "none", zIndex: 9997 }}>
      {hoveredRect && <HoverOutline rect={hoveredRect} hoverLayer={hoverLayer} />}
      {selectedRect && <SelectionOutline rect={selectedRect} />}
      {showResize && <ResizeHandles />}
    </div>
  );
}

"use client";

import React from "react";
import { useFunnelEditorStore } from "../store/store";
import { useDomRegistry } from "./DomRegistry";
import { Outline } from "./HoverOutline";
import { OutlineLabel } from "./OutlineLabel";
import { ElementToolbar } from "./ElementToolbar";
import { ResizeHandles } from "./ResizeHandles";
import { resolveHoverTarget } from "../store/types";

function getPathFromEl(nodeEl: HTMLElement | null) {
  let sectionId: string | null = null;
  let rowId: string | null = null;
  let columnId: string | null = null;
  let elementId: string | null = null;

  let el: HTMLElement | null = nodeEl;
  while (el) {
    const type = el.getAttribute("data-node-type");
    const id = el.getAttribute("data-node-id");
    if (type && id) {
      if (type === "section" && !sectionId) sectionId = id;
      if (type === "row" && !rowId) rowId = id;
      if (type === "column" && !columnId) columnId = id;
      if (type === "element" && !elementId) elementId = id;
    }
    el = el.parentElement;
  }

  return { sectionId, rowId, columnId, elementId };
}

function getParentIdForSelected(selectedEl: HTMLElement | null): string | null {
  if (!selectedEl) return null;
  const type = selectedEl.getAttribute("data-node-type");
  const path = getPathFromEl(selectedEl);

  if (type === "element") return path.columnId ?? path.rowId ?? path.sectionId;
  if (type === "column") return path.rowId ?? path.sectionId;
  if (type === "row") return path.sectionId;
  return null;
}

export function EditorOverlays() {
  const hovered = useFunnelEditorStore((s) => s.hovered);
  const selectedId = useFunnelEditorStore((s) => s.selectedId);
  const editingElementId = useFunnelEditorStore((s) => s.editingElementId);
  const canvasEl = useFunnelEditorStore((s) => s.canvasEl);
  const mode = useFunnelEditorStore((s) => s.mode);
  const tree = useFunnelEditorStore((s) => s.tree);
  const isDragging = useFunnelEditorStore((s) => s.isDraggingElement);
  const viewport = useFunnelEditorStore((s) => s.viewport);
  const inspectorState = useFunnelEditorStore((s) => s.inspectorState);
  const select = useFunnelEditorStore((s) => s.select);
  const getEl = useDomRegistry((s) => s.get);

  const [tick, setTick] = React.useState(0);

  // Track global drag state
  React.useEffect(() => {
    const handleDragStart = (e: DragEvent) => {
      const types = Array.from(e.dataTransfer?.types || []);
      if (types.includes("elementid")) {
        useFunnelEditorStore.setState({ isDraggingElement: true });
      }
    };
    const handleDragEnd = () => {
      useFunnelEditorStore.setState({ isDraggingElement: false });
    };
    
    document.addEventListener("dragstart", handleDragStart);
    document.addEventListener("dragend", handleDragEnd);
    
    return () => {
      document.removeEventListener("dragstart", handleDragStart);
      document.removeEventListener("dragend", handleDragEnd);
    };
  }, []);

  React.useEffect(() => {
    const bump = () => {
      // Force multiple updates to catch layout changes
      setTick((t) => t + 1);
      requestAnimationFrame(() => setTick((t) => t + 1));
    };
    window.addEventListener("resize", bump);
    canvasEl?.addEventListener("scroll", bump as any, { passive: true } as any);
    return () => {
      window.removeEventListener("resize", bump);
      canvasEl?.removeEventListener("scroll", bump as any);
    };
  }, [canvasEl]);

  // Immediate update on viewport change with multiple frames and delay
  React.useEffect(() => {
    setTick((t) => t + 1);
    // Force additional updates to catch layout changes
    const raf1 = requestAnimationFrame(() => setTick((t) => t + 1));
    const raf2 = requestAnimationFrame(() => {
      requestAnimationFrame(() => setTick((t) => t + 1));
    });
    // Add a delayed update to catch final layout after CSS transitions
    const timeout = setTimeout(() => setTick((t) => t + 1), 100);
    return () => {
      cancelAnimationFrame(raf1);
      cancelAnimationFrame(raf2);
      clearTimeout(timeout);
    };
  }, [viewport]);

  // Update when inspector state changes (sidebar width changes)
  // Use interval to continuously update during transition
  React.useEffect(() => {
    setTick((t) => t + 1);
    
    // Update every 16ms (60fps) during the transition period
    const interval = setInterval(() => {
      setTick((t) => t + 1);
    }, 16);
    
    // Clear interval after transition completes (200ms + buffer)
    const timeout = setTimeout(() => {
      clearInterval(interval);
      setTick((t) => t + 1); // Final update
    }, 250);
    
    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [inspectorState]);

  // Update when hover changes
  React.useEffect(() => {
    setTick((t) => t + 1);
  }, [hovered]);

  // Immediate update on selection change
  React.useEffect(() => {
    setTick((t) => t + 1);
    const raf = requestAnimationFrame(() => setTick((t) => t + 1));
    return () => cancelAnimationFrame(raf);
  }, [selectedId]);

  // Force overlay update when tree changes (element properties updated)
  React.useEffect(() => {
    const rafId = requestAnimationFrame(() => {
      setTick((t) => t + 1);
    });
    return () => cancelAnimationFrame(rafId);
  }, [tree]);

  void tick;

  if (mode === "preview") return null;

  const getRect = (id: string | null) => {
    if (!id) return null;
    const el = getEl(id);
    if (!el) return null;
    const r = el.getBoundingClientRect();
    return new DOMRect(r.left, r.top, r.width, r.height);
  };

  const selectedEl = selectedId ? getEl(selectedId) : null;
  const selectedLayer = (selectedEl?.getAttribute("data-node-type") as any) ?? null;
  const selectedRect = selectedId ? getRect(selectedId) : null;

  const hoverTarget = resolveHoverTarget(hovered);
  const hoverEl = hoverTarget.id ? getEl(hoverTarget.id) : null;
  const hoverRect = hoverTarget.id ? getRect(hoverTarget.id) : null;

  // Hide hover while editing or when anything is selected
  const allowHover = !editingElementId && !selectedId;

  // Show hover only when nothing is selected
  const showHoverOutline = !isDragging && allowHover && !!hoverRect;

  // Toolbar policy: only show for selected elements, hide on hover when nothing selected
  // Don't show toolbar while editing text
  const toolbarElementId =
    !editingElementId && selectedLayer === "element"
      ? selectedId
      : null;

  const toolbarRect = toolbarElementId ? selectedRect : null;

  const handleDragStart = (elementId: string) => (e: React.DragEvent) => {
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("elementId", elementId);
    e.dataTransfer.setData("text/plain", elementId);
  };

  return (
    <div className="pointer-events-none fixed inset-0 top-14 z-[50]">
      {!isDragging && (
        <>
          {showHoverOutline && hoverRect && hoverTarget.layer && (
            <>
              <Outline rect={hoverRect} layer={hoverTarget.layer} variant="hover" />
              <OutlineLabel
                rect={hoverRect}
                layer={hoverTarget.layer}
                nodeId={hoverTarget.id!}
                onSelect={(id) => select(id)}
                onSelectParent={null}
              />
            </>
          )}

          {mode !== "preview" && (
            <div className="pointer-events-auto">
              <ResizeHandles />
            </div>
          )}

          {selectedRect && selectedLayer && (
            <>
              <Outline rect={selectedRect} layer={selectedLayer} variant="selected" />
              <OutlineLabel
                rect={selectedRect}
                layer={selectedLayer}
                nodeId={selectedId!}
                onSelect={(id) => select(id)}
                onSelectParent={() => {
                  const parentId = getParentIdForSelected(selectedEl ?? null);
                  if (parentId) select(parentId);
                }}
              />
            </>
          )}
        </>
      )}

      {!isDragging && toolbarElementId && toolbarRect && (
        <div className="pointer-events-auto">
          <ElementToolbar
            elementId={toolbarElementId}
            rect={toolbarRect}
            onDragStart={handleDragStart(toolbarElementId)}
          />
        </div>
      )}
    </div>
  );
}

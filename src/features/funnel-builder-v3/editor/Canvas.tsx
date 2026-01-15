"use client";

import React, { useMemo } from "react";
import { useFunnelEditorStore } from "../store/store";
import { RuntimeRenderer } from "../renderer/RuntimeRenderer";
import { PopupsRuntime } from "../popups/PopupsRuntime";
import { cn } from "@/lib/utils";

function computeViewportStyle(viewport: "desktop" | "tablet" | "mobile") {
  if (viewport === "desktop") return { width: "100%", maxWidth: "100%", minWidth: "100%" };
  if (viewport === "tablet") return { width: "768px", maxWidth: "768px", minWidth: "768px" };
  return { width: "390px", maxWidth: "390px", minWidth: "390px" };
}

type NodeHit = {
  sectionId: string | null;
  rowId: string | null;
  columnId: string | null;
  elementId: string | null;
  nodeType: "section" | "row" | "column" | "element" | null;
  nodeId: string | null;
};

function getHitPathFromTarget(target: HTMLElement | null): NodeHit {
  const nodeEl = target?.closest?.("[data-node-id][data-node-type]") as HTMLElement | null;
  if (!nodeEl) {
    return { sectionId: null, rowId: null, columnId: null, elementId: null, nodeType: null, nodeId: null };
  }

  let el: HTMLElement | null = nodeEl;
  let sectionId: string | null = null;
  let rowId: string | null = null;
  let columnId: string | null = null;
  let elementId: string | null = null;

  while (el) {
    const t = el.getAttribute("data-node-type") as NodeHit["nodeType"];
    const id = el.getAttribute("data-node-id");
    if (t && id) {
      if (t === "section" && !sectionId) sectionId = id;
      if (t === "row" && !rowId) rowId = id;
      if (t === "column" && !columnId) columnId = id;
      if (t === "element" && !elementId) elementId = id;
    }
    el = el.parentElement;
  }

  return {
    sectionId, rowId, columnId, elementId,
    nodeType: (nodeEl.getAttribute("data-node-type") as NodeHit["nodeType"]) ?? null,
    nodeId: nodeEl.getAttribute("data-node-id"),
  };
}

function deepestSelectableId(hit: Pick<NodeHit, "elementId" | "columnId" | "rowId" | "sectionId">) {
  return hit.elementId ?? hit.columnId ?? hit.rowId ?? hit.sectionId ?? null;
}

export function Canvas() {
  const viewport = useFunnelEditorStore((s) => s.viewport);
  const setHovered = useFunnelEditorStore((s) => s.setHovered);
  const clearHover = useFunnelEditorStore((s) => s.clearHover);
  const select = useFunnelEditorStore((s) => s.select);
  const selectedId = useFunnelEditorStore((s) => s.selectedId);
  const mode = useFunnelEditorStore((s) => s.mode);
  const editingElementId = useFunnelEditorStore((s) => s.editingElementId);
  const setEditingElement = useFunnelEditorStore((s) => s.setEditingElement);
  const setCanvasEl = useFunnelEditorStore((s) => s.setCanvasEl);
  const workspace = useFunnelEditorStore((s) => s.workspace);
  const activePopupId = useFunnelEditorStore((s) => s.activePopupId);
  const tree = useFunnelEditorStore((s) => s.tree);

  const isPreview = mode === "preview";

  const vpStyle = useMemo(() => computeViewportStyle(viewport), [viewport]);

  const ref = React.useRef<HTMLDivElement | null>(null);
  const viewportRef = React.useRef<HTMLDivElement | null>(null);

  React.useEffect(() => {
    setCanvasEl(ref.current);
    return () => {
      setCanvasEl(null);
    };
  }, [setCanvasEl]);

  // Track viewport transitions and force border updates during animation
  React.useEffect(() => {
    const viewportEl = viewportRef.current;
    if (!viewportEl) return;

    let animationFrameId: number;
    let isTransitioning = false;

    const updateDuringTransition = () => {
      if (isTransitioning) {
        // Trigger a window resize event to update borders
        window.dispatchEvent(new Event('resize'));
        animationFrameId = requestAnimationFrame(updateDuringTransition);
      }
    };

    const handleTransitionStart = () => {
      isTransitioning = true;
      updateDuringTransition();
    };

    const handleTransitionEnd = () => {
      isTransitioning = false;
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
      // Final update after transition completes
      window.dispatchEvent(new Event('resize'));
    };

    viewportEl.addEventListener('transitionstart', handleTransitionStart);
    viewportEl.addEventListener('transitionend', handleTransitionEnd);

    return () => {
      viewportEl.removeEventListener('transitionstart', handleTransitionStart);
      viewportEl.removeEventListener('transitionend', handleTransitionEnd);
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, []);

  const handleMouseMoveCapture = (e: React.MouseEvent) => {
    if (isPreview) return;

    const st = useFunnelEditorStore.getState();
    if (st.isDraggingElement) return;

    const target = e.target as HTMLElement | null;
    if (!target) return;

    // If editing, suppress hover only when pointer is inside the editing element
    if (st.editingElementId) {
      const insideEditing = target.closest?.(`[data-node-id="${st.editingElementId}"]`);
      if (insideEditing) return;
    }

    const hit = getHitPathFromTarget(target);
    if (!hit.nodeId) {
      clearHover();
      return;
    }

    setHovered({
      sectionId: hit.sectionId,
      rowId: hit.rowId,
      columnId: hit.columnId,
      elementId: hit.elementId,
    });

    // no auto-select
  };

  const handleMouseLeave = () => {
    if (isPreview) return;
    clearHover();
  };

  const handleBackgroundMouseDown = (e: React.MouseEvent) => {
    if (isPreview) return;

    const target = e.target as HTMLElement | null;
    if (!target) return;

    // Don't clear selection if clicking on scrollbar or during scroll gestures
    // Check if the click is on the scrollable container itself (not its children)
    const isScrollableContainer = target === ref.current;
    if (isScrollableContainer) return;

    // Exit edit if clicking outside editing element (but continue selection)
    const st = useFunnelEditorStore.getState();
    if (st.editingElementId) {
      const insideEditing = target?.closest?.(`[data-node-id="${st.editingElementId}"]`);
      if (!insideEditing) setEditingElement(null);
    }

    // Support explicit label pills / handles
    const handleEl = target?.closest?.("[data-select-handle][data-node-id]") as HTMLElement | null;
    if (handleEl) {
      const id = handleEl.getAttribute("data-node-id");
      if (id) select(id);
      return;
    }

    const hit = getHitPathFromTarget(target);

    // Only clear selection if clicking on actual background (not on any node)
    // This prevents selection from being cleared during scroll events
    if (!hit.nodeId) {
      select(null);
    }
  };

  // When editing a popup, render the popup content directly in the canvas
  if (workspace === "popup" && activePopupId) {
    const popup = tree.popups[activePopupId];
    if (popup) {
      return (
        <div
          ref={ref}
          className="h-full w-full overflow-auto bg-slate-100"
          onMouseMoveCapture={handleMouseMoveCapture}
          onMouseLeave={isPreview ? undefined : handleMouseLeave}
          onMouseDown={isPreview ? undefined : handleBackgroundMouseDown}
        >
          <div className="flex min-h-full items-center justify-center p-8">
            <div
              className="rounded-2xl bg-white shadow-xl ring-1 ring-slate-300"
              style={{
                maxWidth: popup.style?.maxWidth ?? 540,
                width: "100%",
                padding: popup.style?.padding ?? 24,
                borderRadius: popup.style?.borderRadius ?? 16,
                backgroundColor: popup.style?.background ?? "#ffffff",
              }}
            >
              <RuntimeRenderer rootIds={popup.rootIds} />
            </div>
          </div>
        </div>
      );
    }
  }

  return (
    <div
      ref={ref}
      className="h-full w-full overflow-auto bg-slate-100 relative"
      onMouseMoveCapture={handleMouseMoveCapture}
      onMouseLeave={isPreview ? undefined : handleMouseLeave}
      onMouseDown={isPreview ? undefined : handleBackgroundMouseDown}
    >
      <div className="min-h-full p-4 flex justify-center">
        <div
          ref={viewportRef}
          className={cn(
            "min-h-[200px] rounded-2xl bg-white shadow-sm ring-1 ring-slate-200 transition-all duration-300 ease-in-out"
          )}
          style={vpStyle}
        >
          <RuntimeRenderer rootIds={tree.pageRootIds} />
        </div>
      </div>

      <PopupsRuntime />
    </div>
  );
}

"use client";

import React from "react";
import { DomRegistryProvider } from "./overlays/domRegistry";
import { RuntimeRenderer } from "./renderer/RuntimeRenderer";
import { EditorOverlays } from "./overlays/EditorOverlays";
import { useEditor } from "./store/useEditorStore";

function CanvasInner() {
  const { dispatch } = useEditor();

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        background: "#ffffff",
      }}
      onPointerLeave={() => {
        // Clear hover only when leaving the canvas entirely
        dispatch({ type: "CLEAR_HOVER" });
      }}
      onPointerDown={(e) => {
        // Clicking empty canvas clears selection
        if (e.target === e.currentTarget) {
          dispatch({ type: "SELECT_NODE", nodeId: null });
        }
      }}
    >
      <RuntimeRenderer />
      <EditorOverlays />
    </div>
  );
}

export function Canvas() {
  return (
    <DomRegistryProvider>
      <CanvasInner />
    </DomRegistryProvider>
  );
}

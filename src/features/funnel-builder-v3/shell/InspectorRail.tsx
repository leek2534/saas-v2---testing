"use client";

import React from "react";
import { useFunnelEditorStore } from "../store/store";
import { InspectorOpen } from "./InspectorOpen";
import { InspectorPeek } from "./InspectorPeek";
import { InspectorCollapsed } from "./InspectorCollapsed";
import { StepSettingsPanel } from "./StepSettingsPanel";

const WIDTHS = {
  open: 380,
  peek: 88,
  collapsed: 48,
};

export function InspectorRail() {
  const inspectorState = useFunnelEditorStore((s) => s.inspectorState);
  const rightPanelView = useFunnelEditorStore((s) => s.rightPanelView);

    const effectiveState = rightPanelView === "stepSettings" ? "open" : inspectorState;

  return (
    <aside
      className="shrink-0 border-l border-slate-200 bg-white transition-[width] duration-200 ease-out overflow-hidden"
      style={{ width: WIDTHS[effectiveState] }}
    >
      {rightPanelView === "stepSettings" ? (
        <StepSettingsPanel />
      ) : effectiveState === "open" ? (
        <InspectorOpen />
      ) : effectiveState === "peek" ? (
        <InspectorPeek />
      ) : (
        <InspectorCollapsed />
      )}
    </aside>
  );
}

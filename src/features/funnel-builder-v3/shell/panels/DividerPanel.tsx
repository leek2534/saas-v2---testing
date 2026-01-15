"use client";

import React from "react";
import { useFunnelEditorStore } from "../../store/store";
import type { ElementNode } from "../../store/types";

export function DividerPanel({ node }: { node: ElementNode }) {
  const updateNodeProps = useFunnelEditorStore((s) => s.updateNodeProps);

  return (
    <div className="space-y-4">
      <div className="text-sm text-slate-600">
        A simple horizontal divider line to separate content sections.
      </div>
    </div>
  );
}

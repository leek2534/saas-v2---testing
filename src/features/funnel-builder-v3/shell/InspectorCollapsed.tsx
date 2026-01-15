"use client";

import React from "react";
import { useFunnelEditorStore } from "../store/store";
import { ChevronLeft } from "lucide-react";

export function InspectorCollapsed() {
  const setInspectorState = useFunnelEditorStore((s) => s.setInspectorState);

  return (
    <div 
      className="h-full flex flex-col items-center justify-between pb-[60px] cursor-pointer hover:bg-slate-50 transition-colors"
      onClick={() => setInspectorState("open", true)}
    >
      <div className="flex flex-col items-center pt-6">
        <div style={{ writingMode: "vertical-rl" }} className="text-xs font-medium text-slate-600 select-none">
          Inspector
        </div>
        <button 
          className="mt-6 p-1.5 rounded hover:bg-slate-200 text-slate-500"
          title="Expand inspector"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

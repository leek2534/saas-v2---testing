"use client";

import React from "react";
import { Monitor, Tablet, Smartphone } from "lucide-react";
import { useFunnelEditorStore } from "../store/store";
import { cn } from "@/lib/utils";

const ITEMS = [
  { id: "desktop" as const, icon: Monitor, label: "Desktop" },
  { id: "tablet" as const, icon: Tablet, label: "Tablet" },
  { id: "mobile" as const, icon: Smartphone, label: "Mobile" },
];

export function ViewportBar() {
  const viewport = useFunnelEditorStore((s) => s.viewport);
  const setViewport = useFunnelEditorStore((s) => s.setViewport);

  return (
    <div className="flex items-center gap-1 rounded-xl border border-slate-200 bg-white p-1">
      {ITEMS.map((it) => {
        const Icon = it.icon;
        const active = viewport === it.id;
        return (
          <button
            key={it.id}
            onClick={() => setViewport(it.id)}
            className={cn(
              "flex items-center gap-2 rounded-lg px-3 py-1.5 text-xs font-medium transition",
              active ? "bg-slate-900 text-white" : "text-slate-700 hover:bg-slate-100"
            )}
            title={it.label}
          >
            <Icon size={14} />
            <span className="hidden sm:inline">{it.label}</span>
          </button>
        );
      })}
    </div>
  );
}

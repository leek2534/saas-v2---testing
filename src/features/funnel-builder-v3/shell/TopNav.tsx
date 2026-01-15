"use client";

import React from "react";
import {
  Plus,
  Gift,
  Settings,
  Trash2,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useFunnelEditorStore } from "../store/store";
import { cn } from "@/lib/utils";

export function PopupsSection() {
  const router = useRouter();
  const tree = useFunnelEditorStore((s) => s.tree);
  const activePopupId = useFunnelEditorStore((s) => s.activePopupId);
  const createPopup = useFunnelEditorStore((s) => s.createPopup);
  const createCouponPopup = useFunnelEditorStore((s) => s.createCouponPopup);
  const editPopup = useFunnelEditorStore((s) => s.editPopup);
  const deletePopup = useFunnelEditorStore((s) => s.deletePopup);

  return (
    <div className="flex items-center gap-2">
      <div className="text-xs font-semibold text-slate-500">POPUPS</div>
      <div className="flex items-center gap-1">
        <button
          onClick={() => createPopup("blank")}
          className="flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2 py-1 text-xs font-medium text-slate-700 hover:bg-slate-50"
        >
          <Plus className="h-3 w-3" />
          New
        </button>
        <button
          onClick={createCouponPopup}
          className="flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2 py-1 text-xs font-medium text-slate-700 hover:bg-slate-50"
        >
          <Gift className="h-3 w-3" />
          Coupon
        </button>
      </div>
      {Object.values(tree.popups).length > 0 && (
        <div className="flex items-center gap-1">
          {Object.values(tree.popups)
            .slice()
            .sort((a, b) => (a.name || a.id).localeCompare(b.name || b.id))
            .map((p) => (
              <div
                key={p.id}
                className={cn(
                  "group relative flex items-center gap-1.5 rounded-lg border px-2 py-1 text-xs transition-colors",
                  activePopupId === p.id
                    ? "border-purple-600 bg-purple-600 text-white"
                    : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                )}
              >
                <span className="font-medium">{p.name || "Untitled"}</span>
                <span className={cn(
                  "rounded px-1 py-0.5 text-[10px] font-semibold",
                  activePopupId === p.id ? "bg-purple-500 text-purple-100" : "bg-slate-100 text-slate-600"
                )}>
                  {p.enabled ? "ON" : "OFF"}
                </span>
                <div className="ml-1 flex items-center gap-1 opacity-0 group-hover:opacity-100">
                  <button
                    onClick={() => editPopup(p.id)}
                    className={cn(
                      "rounded p-0.5 transition-colors",
                      activePopupId === p.id ? "hover:bg-purple-500" : "hover:bg-slate-100"
                    )}
                    title="Edit popup"
                  >
                    <Settings className="h-3 w-3" />
                  </button>
                  <button
                    onClick={() => deletePopup(p.id)}
                    className={cn(
                      "rounded p-0.5 transition-colors",
                      activePopupId === p.id ? "text-red-200 hover:bg-purple-500" : "text-red-600 hover:bg-red-50"
                    )}
                    title="Delete popup"
                  >
                    <Trash2 className="h-3 w-3" />
                  </button>
                </div>
              </div>
            ))}
        </div>
      )}
    </div>
  );
}

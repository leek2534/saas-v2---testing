"use client";

import React from "react";
import { Monitor, Tablet, Smartphone } from "lucide-react";
import type { Device } from "../types";

interface DeviceToggleProps {
  value: Device;
  onChange: (device: Device) => void;
}

export function DeviceToggle({ value, onChange }: DeviceToggleProps) {
  return (
    <div className="inline-flex items-center rounded-lg border border-slate-200 bg-white p-1">
      <button
        type="button"
        onClick={() => onChange("desktop")}
        className={`inline-flex items-center justify-center rounded px-2 py-1 text-xs font-medium transition-colors ${
          value === "desktop"
            ? "bg-slate-100 text-slate-900"
            : "text-slate-600 hover:text-slate-900"
        }`}
      >
        <Monitor size={14} />
      </button>
      <button
        type="button"
        onClick={() => onChange("tablet")}
        className={`inline-flex items-center justify-center rounded px-2 py-1 text-xs font-medium transition-colors ${
          value === "tablet"
            ? "bg-slate-100 text-slate-900"
            : "text-slate-600 hover:text-slate-900"
        }`}
      >
        <Tablet size={14} />
      </button>
      <button
        type="button"
        onClick={() => onChange("mobile")}
        className={`inline-flex items-center justify-center rounded px-2 py-1 text-xs font-medium transition-colors ${
          value === "mobile"
            ? "bg-slate-100 text-slate-900"
            : "text-slate-600 hover:text-slate-900"
        }`}
      >
        <Smartphone size={14} />
      </button>
    </div>
  );
}

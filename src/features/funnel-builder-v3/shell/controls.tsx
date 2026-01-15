"use client";

import React from "react";
import { cn } from "@/lib/utils";

export function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1">
      <div className="text-xs font-semibold text-slate-700">{label}</div>
      {children}
    </div>
  );
}

export function TextField({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <Field label={label}>
      <input
        className={cn("w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-slate-300")}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </Field>
  );
}

export function NumberField({
  label,
  value,
  min,
  max,
  step,
  onChange,
}: {
  label: string;
  value: number;
  min?: number;
  max?: number;
  step?: number;
  onChange: (v: number) => void;
}) {
  return (
    <Field label={label}>
      <input
        type="number"
        className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-slate-300"
        value={value}
        min={min}
        max={max}
        step={step ?? 1}
        onChange={(e) => onChange(Number(e.target.value))}
      />
    </Field>
  );
}

export function ColorField({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <Field label={label}>
      <div className="flex items-center gap-2">
        <input type="color" value={value} onChange={(e) => onChange(e.target.value)} className="h-9 w-12 rounded-md border border-slate-200 bg-white" />
        <input className="flex-1 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-slate-300" value={value} onChange={(e) => onChange(e.target.value)} />
      </div>
    </Field>
  );
}

export function SelectField({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: Array<{ label: string; value: string }>;
  onChange: (v: string) => void;
}) {
  return (
    <Field label={label}>
      <select className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-slate-300" value={value} onChange={(e) => onChange(e.target.value)}>
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </Field>
  );
}

export function ToggleField({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <Field label={label}>
      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} />
        <span className="text-slate-600">{checked ? "On" : "Off"}</span>
      </label>
    </Field>
  );
}

export function SpacingField({
  label,
  top,
  right,
  bottom,
  left,
  onTopChange,
  onRightChange,
  onBottomChange,
  onLeftChange,
  min = 0,
  max = 80,
}: {
  label: string;
  top: number;
  right: number;
  bottom: number;
  left: number;
  onTopChange: (v: number) => void;
  onRightChange: (v: number) => void;
  onBottomChange: (v: number) => void;
  onLeftChange: (v: number) => void;
  min?: number;
  max?: number;
}) {
  return (
    <div className="space-y-2">
      <div className="text-xs font-semibold text-slate-700">{label}</div>
      <div className="space-y-3">
        {/* Visual Box Model Diagram */}
        <div className="relative bg-gradient-to-br from-slate-50 to-slate-100 rounded-lg p-6 border border-slate-200">
          {/* Top Input */}
          <div className="absolute top-1 left-1/2 -translate-x-1/2">
            <input
              type="number"
              value={top}
              onChange={(e) => onTopChange(Number(e.target.value))}
              min={min}
              max={max}
              className="w-12 px-1 py-1 text-xs font-medium border border-slate-300 rounded bg-white text-center hover:border-blue-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-colors"
              placeholder="0"
            />
          </div>
          {/* Right Input */}
          <div className="absolute right-1 top-1/2 -translate-y-1/2">
            <input
              type="number"
              value={right}
              onChange={(e) => onRightChange(Number(e.target.value))}
              min={min}
              max={max}
              className="w-12 px-1 py-1 text-xs font-medium border border-slate-300 rounded bg-white text-center hover:border-blue-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-colors"
              placeholder="0"
            />
          </div>
          {/* Bottom Input */}
          <div className="absolute bottom-1 left-1/2 -translate-x-1/2">
            <input
              type="number"
              value={bottom}
              onChange={(e) => onBottomChange(Number(e.target.value))}
              min={min}
              max={max}
              className="w-12 px-1 py-1 text-xs font-medium border border-slate-300 rounded bg-white text-center hover:border-blue-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-colors"
              placeholder="0"
            />
          </div>
          {/* Left Input */}
          <div className="absolute left-1 top-1/2 -translate-y-1/2">
            <input
              type="number"
              value={left}
              onChange={(e) => onLeftChange(Number(e.target.value))}
              min={min}
              max={max}
              className="w-12 px-1 py-1 text-xs font-medium border border-slate-300 rounded bg-white text-center hover:border-blue-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-colors"
              placeholder="0"
            />
          </div>
          {/* Center Element Box */}
          <div className="h-16 bg-white border-2 border-blue-400 rounded-md flex items-center justify-center shadow-sm">
            <span className="text-xs font-medium text-slate-500">Element</span>
          </div>
        </div>
        
        {/* Helper Labels */}
        <div className="flex items-center justify-center gap-2 text-xs text-slate-500">
          <span>↑ Top</span>
          <span>→ Right</span>
          <span>↓ Bottom</span>
          <span>← Left</span>
        </div>
      </div>
    </div>
  );
}

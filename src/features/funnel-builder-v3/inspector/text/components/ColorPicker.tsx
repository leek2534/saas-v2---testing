"use client";

import React from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Input } from "@/components/ui/input";

interface ColorPickerProps {
  value: string;
  onChange: (color: string) => void;
  label?: string;
}

export function ColorPicker({ value, onChange, label }: ColorPickerProps) {
  return (
    <div className="flex items-center gap-2">
      {label && <span className="text-sm text-slate-700">{label}</span>}
      <Popover>
        <PopoverTrigger asChild>
          <button
            type="button"
            className="h-8 w-8 rounded border border-slate-200 shadow-sm transition-shadow hover:shadow"
            style={{ backgroundColor: value }}
          />
        </PopoverTrigger>
        <PopoverContent className="w-64">
          <div className="space-y-3">
            <div>
              <label className="text-xs font-medium text-slate-700">Color</label>
              <Input
                type="text"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder="#000000"
                className="mt-1"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-slate-700">Picker</label>
              <input
                type="color"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="mt-1 h-10 w-full cursor-pointer rounded border border-slate-200"
              />
            </div>
            {/* TODO: Add preset colors */}
          </div>
        </PopoverContent>
      </Popover>
      <Input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-8 flex-1 text-xs"
      />
    </div>
  );
}

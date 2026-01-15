"use client";

import React from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { SpacingBox } from "../types";

interface SpacingPopoverProps {
  label: string;
  value: SpacingBox;
  onChange: (value: SpacingBox) => void;
}

export function SpacingPopover({ label, value, onChange }: SpacingPopoverProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="w-full justify-start text-xs">
          {label}: {value.top}/{value.right}/{value.bottom}/{value.left}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-64">
        <div className="space-y-3">
          <div className="text-sm font-medium">{label}</div>
          <div className="relative bg-slate-50 rounded-lg p-6 border border-slate-200">
            <div className="absolute top-1 left-1/2 -translate-x-1/2">
              <Input
                type="number"
                value={value.top}
                onChange={(e) => onChange({ ...value, top: Number(e.target.value) })}
                className="w-12 h-7 px-1 text-xs text-center"
              />
            </div>
            <div className="absolute right-1 top-1/2 -translate-y-1/2">
              <Input
                type="number"
                value={value.right}
                onChange={(e) => onChange({ ...value, right: Number(e.target.value) })}
                className="w-12 h-7 px-1 text-xs text-center"
              />
            </div>
            <div className="absolute bottom-1 left-1/2 -translate-x-1/2">
              <Input
                type="number"
                value={value.bottom}
                onChange={(e) => onChange({ ...value, bottom: Number(e.target.value) })}
                className="w-12 h-7 px-1 text-xs text-center"
              />
            </div>
            <div className="absolute left-1 top-1/2 -translate-y-1/2">
              <Input
                type="number"
                value={value.left}
                onChange={(e) => onChange({ ...value, left: Number(e.target.value) })}
                className="w-12 h-7 px-1 text-xs text-center"
              />
            </div>
            <div className="h-16 bg-white border-2 border-blue-400 rounded flex items-center justify-center">
              <span className="text-xs text-slate-500">Element</span>
            </div>
          </div>
          <div className="text-xs text-slate-500 text-center">
            Top • Right • Bottom • Left
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}

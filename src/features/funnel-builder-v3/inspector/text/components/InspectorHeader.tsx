"use client";

import React from "react";
import { ChevronRight, MoreVertical, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DeviceToggle } from "./DeviceToggle";
import type { Device, TextSubtype } from "../types";

interface InspectorHeaderProps {
  title: string;
  breadcrumbs?: Array<{ id: string; label: string }>;
  device: Device;
  onDeviceChange: (device: Device) => void;
  onPresetSelect?: (presetId: string) => void;
  onReset?: () => void;
  onCollapse?: () => void;
  onBreadcrumbClick?: (id: string) => void;
}

export function InspectorHeader({
  title,
  breadcrumbs,
  device,
  onDeviceChange,
  onPresetSelect,
  onReset,
  onCollapse,
  onBreadcrumbClick,
}: InspectorHeaderProps) {
  return (
    <div className="sticky top-0 z-10 bg-white border-b border-slate-200">
      <div className="p-4 space-y-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-semibold text-slate-900 capitalize">
              {title}
            </h3>
            {breadcrumbs && breadcrumbs.length > 0 && (
              <div className="flex items-center gap-1 text-xs text-slate-500 mt-1 overflow-x-auto">
                {breadcrumbs.map((crumb, i) => (
                  <React.Fragment key={crumb.id}>
                    {i > 0 && <span className="text-slate-300">›</span>}
                    <button
                      onClick={() => onBreadcrumbClick?.(crumb.id)}
                      className="hover:text-slate-700 capitalize truncate"
                    >
                      {crumb.label}
                    </button>
                  </React.Fragment>
                ))}
              </div>
            )}
          </div>
          <div className="flex items-center gap-1 shrink-0">
            {onCollapse && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onCollapse}
                className="h-8 w-8 p-0"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between gap-2">
          <DeviceToggle value={device} onChange={onDeviceChange} />
          
          <div className="flex items-center gap-1">
            {onReset && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onReset}
                className="h-8 px-2 text-xs"
              >
                <RotateCcw className="h-3 w-3 mr-1" />
                Reset
              </Button>
            )}
            
            {onPresetSelect && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="h-8 px-2 text-xs">
                    Presets
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => onPresetSelect("hero-h1")}>
                    Hero H1
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onPresetSelect("section-title")}>
                    Section Title
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onPresetSelect("eyebrow")}>
                    Eyebrow
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onPresetSelect("lead-paragraph")}>
                    Lead Paragraph
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onPresetSelect("body")}>
                    Body
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onPresetSelect("quote")}>
                    Quote
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>Copy Styles</DropdownMenuItem>
                <DropdownMenuItem>Paste Styles</DropdownMenuItem>
                <DropdownMenuItem>Export Settings</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </div>
  );
}

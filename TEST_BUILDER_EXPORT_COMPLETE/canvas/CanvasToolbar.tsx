"use client";

import { Button } from "@/components/ui/button";
import { Sparkles, Eye, Layers, LayoutTemplate } from "lucide-react";
import { EnhancedSaveIndicator } from "../EnhancedSaveIndicator";
import { ToolbarContextIndicator } from "../ToolbarContextIndicator";
import { DevicePreview, type DeviceType } from "../DevicePreview";

interface CanvasToolbarProps {
  viewport: DeviceType;
  onViewportChange: (device: DeviceType) => void;
  onPreviewToggle: () => void;
  onLayersToggle: () => void;
  onTemplatesOpen: () => void;
  onPopupOpen: () => void;
  showLayers: boolean;
}

/**
 * CanvasToolbar - Top toolbar with device preview, save, and action buttons
 */
export function CanvasToolbar({
  viewport,
  onViewportChange,
  onPreviewToggle,
  onLayersToggle,
  onTemplatesOpen,
  onPopupOpen,
  showLayers,
}: CanvasToolbarProps) {
  return (
    <div className="flex items-center justify-between gap-3 border-b border-neutral-200 bg-white px-3 py-2.5 text-sm dark:border-neutral-800 dark:bg-neutral-950 sm:px-4">
      {/* Left side: context + device switcher */}
      <div className="flex items-center gap-3">
        <ToolbarContextIndicator />

        <div className="hidden h-5 w-px bg-neutral-200 dark:bg-neutral-800 sm:block" />

        <DevicePreview value={viewport} onChange={onViewportChange} />
      </div>

      {/* Center: save indicator */}
      <div className="hidden items-center justify-center sm:flex">
        <EnhancedSaveIndicator />
      </div>

      {/* Right side: actions */}
      <div className="flex items-center gap-2">
        <Button
          variant={showLayers ? "secondary" : "ghost"}
          size="sm"
          onClick={onLayersToggle}
        >
          <Layers className="mr-1.5 h-3.5 w-3.5" />
          <span className="hidden sm:inline">Layers</span>
        </Button>

        <Button
          variant="ghost"
          size="sm"
          onClick={onTemplatesOpen}
        >
          <LayoutTemplate className="mr-1.5 h-3.5 w-3.5" />
          <span className="hidden sm:inline">Templates</span>
        </Button>

        <Button
          variant="ghost"
          size="sm"
          onClick={onPopupOpen}
        >
          <Sparkles className="mr-1.5 h-3.5 w-3.5" />
          <span className="hidden sm:inline">Popups</span>
        </Button>

        <div className="h-5 w-px bg-neutral-200 dark:bg-neutral-800" />

        <Button
          variant="outline"
          size="sm"
          onClick={onPreviewToggle}
        >
          <Eye className="mr-1.5 h-3.5 w-3.5" />
          Preview
        </Button>
      </div>
    </div>
  );
}

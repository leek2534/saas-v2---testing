"use client";

import { Button } from '@/components/ui/button';
import { Sparkles, Eye, Layers } from 'lucide-react';
import { EnhancedSaveIndicator } from '../EnhancedSaveIndicator';
import { ToolbarContextIndicator } from '../ToolbarContextIndicator';
import { DevicePreview, type DeviceType } from '../DevicePreview';

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
    <div className="bg-card border-b border-border px-4 py-2 flex items-center justify-between">
      {/* Left: Context Indicator */}
      <div className="flex items-center">
        <ToolbarContextIndicator />
      </div>

      {/* Center: Spacer */}
      <div className="flex-1" />

      {/* Right: Action Buttons */}
      <div className="flex items-center gap-2">
        {/* Templates */}
        <Button size="sm" variant="outline" onClick={onTemplatesOpen} className="gap-2">
          <Sparkles className="w-4 h-4" />
          Templates
        </Button>

        <ToolbarDivider />

        {/* Save */}
        <EnhancedSaveIndicator />

        <ToolbarDivider />

        {/* Device Preview */}
        <DevicePreview
          selectedDevice={viewport}
          onDeviceChange={onViewportChange}
          className="h-7"
        />

        <ToolbarDivider />

        {/* Preview Mode */}
        <Button size="sm" variant="outline" onClick={onPreviewToggle}>
          <Eye className="w-4 h-4 mr-1" />
          Preview
        </Button>

        <ToolbarDivider />

        {/* Layers */}
        <Button
          size="sm"
          variant={showLayers ? "default" : "outline"}
          onClick={onLayersToggle}
        >
          <Layers className="w-4 h-4 mr-1" />
          Layers
        </Button>

        {/* Popup */}
        <Button size="sm" variant="outline" onClick={onPopupOpen}>
          <Layers className="w-4 h-4 mr-1" />
          Popup
        </Button>
      </div>
    </div>
  );
}

function ToolbarDivider() {
  return <div className="h-6 w-px bg-border" />;
}

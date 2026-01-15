'use client';

import React, { useState } from 'react';
import { useEditorStore } from '../../lib/editor/store';
import {
  ArrowUp,
  ArrowDown,
  ChevronUp,
  ChevronDown,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignVerticalJustifyCenter,
  AlignVerticalJustifyStart,
  AlignVerticalJustifyEnd,
  Lock,
  Unlock,
  Move,
  Grid3x3,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { cn } from '../../lib/utils';

/**
 * PositionSidebarPanel - Position and alignment controls in sidebar
 * Includes visual alignment guides toggle
 */
export function PositionSidebarPanel() {
  const canvas = useEditorStore((s) => s.canvas);
  const selectedIds = useEditorStore((s) => s.selectedIds);
  const elements = useEditorStore((s) => s.elements);
  const updateElement = useEditorStore((s) => s.updateElement);
  const bringToFront = useEditorStore((s) => s.bringToFront);
  const sendToBack = useEditorStore((s) => s.sendToBack);
  const bringForward = useEditorStore((s) => s.bringForward);
  const sendBackward = useEditorStore((s) => s.sendBackward);
  const pushHistory = useEditorStore((s) => s.pushHistory);
  const getStateSnapshot = useEditorStore((s) => s.getStateSnapshot);
  const setShowAlignmentGuides = useEditorStore((s) => s.setShowAlignmentGuides);
  const showAlignmentGuides = useEditorStore((s) => s.showAlignmentGuides);

  const [maintainAspectRatio, setMaintainAspectRatio] = useState(true);

  // Ensure elements is always an array
  const elementsArray = Array.isArray(elements) ? elements : [];
  const selectedElements = elementsArray.filter(el => selectedIds.includes(el.id));
  const selectedElement = selectedElements.length === 1 ? selectedElements[0] : null;

  if (!selectedElement) {
    return (
      <div className="w-80 bg-gradient-to-b from-background via-background to-muted/20 border-r border-border/30 flex flex-col h-full overflow-hidden flex-shrink-0 backdrop-blur-sm">
        <div className="p-6 border-b border-border/50 bg-gradient-to-br from-background to-muted/30">
          <div className="flex items-center gap-2 mb-2">
            <Move className="w-5 h-5 text-primary" />
            <h3 className="text-foreground font-bold text-lg tracking-tight">Position</h3>
          </div>
          <p className="text-xs text-muted-foreground">Align and position elements on canvas</p>
        </div>
        <div className="flex-1 flex items-center justify-center text-center py-12">
          <div>
            <div className="relative">
              <div className="absolute inset-0 bg-primary/10 blur-3xl rounded-full" />
              <Move className="text-muted-foreground/50 mb-4 relative mx-auto" size={64} />
            </div>
            <p className="text-muted-foreground text-sm font-medium mb-2">No element selected</p>
            <p className="text-muted-foreground/70 text-xs">Select an element to position it</p>
          </div>
        </div>
      </div>
    );
  }

  const sortedElements = [...elementsArray].sort((a, b) => (b.zIndex || 0) - (a.zIndex || 0));
  const elementIndex = sortedElements.findIndex(el => el.id === selectedElement.id);
  const isTop = elementIndex === 0;
  const isBottom = elementIndex === sortedElements.length - 1;

  // Handle layer operations
  const handleLayerOp = (op: 'front' | 'back' | 'forward' | 'backward') => {
    if (op === 'front') bringToFront(selectedElement.id);
    else if (op === 'back') sendToBack(selectedElement.id);
    else if (op === 'forward') bringForward(selectedElement.id);
    else if (op === 'backward') sendBackward(selectedElement.id);
  };

  // Handle alignment
  const handleAlign = (align: 'left' | 'center' | 'right' | 'top' | 'middle' | 'bottom') => {
    let updates: any = {};
    
    if (align === 'left') {
      updates.x = 0;
    } else if (align === 'center') {
      updates.x = (canvas.width - selectedElement.width) / 2;
    } else if (align === 'right') {
      updates.x = canvas.width - selectedElement.width;
    } else if (align === 'top') {
      updates.y = 0;
    } else if (align === 'middle') {
      updates.y = (canvas.height - selectedElement.height) / 2;
    } else if (align === 'bottom') {
      updates.y = canvas.height - selectedElement.height;
    }

    updateElement(selectedElement.id, updates);
    pushHistory(getStateSnapshot());
  };

  // Handle dimension changes
  const handleDimensionChange = (field: 'width' | 'height' | 'x' | 'y' | 'rotation', value: number) => {
    const updates: any = { [field]: value };

    // Maintain aspect ratio if locked
    if (maintainAspectRatio && (field === 'width' || field === 'height') && selectedElement.originalMeta) {
      const aspectRatio = selectedElement.originalMeta.width / selectedElement.originalMeta.height;
      if (field === 'width') {
        updates.height = value / aspectRatio;
      } else {
        updates.width = value * aspectRatio;
      }
    }

    updateElement(selectedElement.id, updates);
    pushHistory(getStateSnapshot());
  };

  return (
    <div className="w-80 bg-gradient-to-b from-background via-background to-muted/20 border-r border-border/30 flex flex-col h-full overflow-hidden flex-shrink-0 backdrop-blur-sm">
      {/* Header */}
      <div className="p-6 border-b border-border/50 bg-gradient-to-br from-background to-muted/30">
        <div className="flex items-center gap-2 mb-2">
          <Move className="w-5 h-5 text-primary" />
          <h3 className="text-foreground font-bold text-lg tracking-tight">Position</h3>
        </div>
        <p className="text-xs text-muted-foreground">Align and position elements on canvas</p>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {/* Visual Alignment Guides Toggle */}
        <div className="flex items-center justify-between p-4 bg-muted/50 rounded-xl border border-border/50 hover:bg-accent transition-all duration-300">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Grid3x3 className="w-5 h-5 text-primary" />
            </div>
            <div>
              <span className="text-sm font-medium text-foreground block">Alignment Guides</span>
              <span className="text-xs text-muted-foreground">Show visual guides</span>
            </div>
          </div>
          <button
            onClick={() => setShowAlignmentGuides(!showAlignmentGuides)}
            className={cn(
              'relative w-12 h-7 rounded-full transition-all duration-300',
              showAlignmentGuides ? 'bg-primary' : 'bg-muted'
            )}
          >
            <div
              className={cn(
                'absolute top-0.5 left-0.5 w-6 h-6 bg-white rounded-full transition-transform shadow-md',
                showAlignmentGuides && 'translate-x-5'
              )}
            />
          </button>
        </div>

        {/* Layer Controls */}
        <div>
          <h4 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
            <span className="w-1 h-4 bg-primary rounded-full"></span>
            Layer Order
          </h4>
          <div className="grid grid-cols-2 gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleLayerOp('forward')}
              disabled={isTop}
              className="h-11 justify-start bg-muted/50 border-border/50 hover:bg-accent hover:scale-105 hover:shadow-md transition-all duration-300 disabled:opacity-30"
            >
              <ChevronUp className="w-4 h-4 mr-2" />
              <span className="font-medium">Forward</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleLayerOp('backward')}
              disabled={isBottom}
              className="h-11 justify-start bg-muted/50 border-border/50 hover:bg-accent hover:scale-105 hover:shadow-md transition-all duration-300 disabled:opacity-30"
            >
              <ChevronDown className="w-4 h-4 mr-2" />
              <span className="font-medium">Backward</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleLayerOp('front')}
              disabled={isTop}
              className="h-11 justify-start bg-muted/50 border-border/50 hover:bg-accent hover:scale-105 hover:shadow-md transition-all duration-300 disabled:opacity-30"
            >
              <ArrowUp className="w-4 h-4 mr-2" />
              <span className="font-medium">To Front</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleLayerOp('back')}
              disabled={isBottom}
              className="h-11 justify-start bg-muted/50 border-border/50 hover:bg-accent hover:scale-105 hover:shadow-md transition-all duration-300 disabled:opacity-30"
            >
              <ArrowDown className="w-4 h-4 mr-2" />
              <span className="font-medium">To Back</span>
            </Button>
          </div>
        </div>

        <Separator className="bg-border/50" />

        {/* Alignment */}
        <div>
          <h4 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
            <span className="w-1 h-4 bg-primary rounded-full"></span>
            Align to Canvas
          </h4>
          <div className="space-y-3">
            {/* Horizontal Alignment */}
            <div>
              <p className="text-xs text-muted-foreground font-medium mb-2">Horizontal</p>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleAlign('left')}
                  className="flex-1 h-12 bg-muted/50 border-border/50 hover:bg-accent hover:scale-105 hover:shadow-md transition-all duration-300"
                  title="Align Left"
                >
                  <AlignLeft className="w-5 h-5" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleAlign('center')}
                  className="flex-1 h-12 bg-muted/50 border-border/50 hover:bg-accent hover:scale-105 hover:shadow-md transition-all duration-300"
                  title="Align Center"
                >
                  <AlignCenter className="w-5 h-5" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleAlign('right')}
                  className="flex-1 h-12 bg-muted/50 border-border/50 hover:bg-accent hover:scale-105 hover:shadow-md transition-all duration-300"
                  title="Align Right"
                >
                  <AlignRight className="w-5 h-5" />
                </Button>
              </div>
            </div>
            {/* Vertical Alignment */}
            <div>
              <p className="text-xs text-muted-foreground font-medium mb-2">Vertical</p>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleAlign('top')}
                  className="flex-1 h-12 bg-muted/50 border-border/50 hover:bg-accent hover:scale-105 hover:shadow-md transition-all duration-300"
                  title="Align Top"
                >
                  <AlignVerticalJustifyStart className="w-5 h-5" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleAlign('middle')}
                  className="flex-1 h-12 bg-muted/50 border-border/50 hover:bg-accent hover:scale-105 hover:shadow-md transition-all duration-300"
                  title="Align Middle"
                >
                  <AlignVerticalJustifyCenter className="w-5 h-5" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleAlign('bottom')}
                  className="flex-1 h-12 bg-muted/50 border-border/50 hover:bg-accent hover:scale-105 hover:shadow-md transition-all duration-300"
                  title="Align Bottom"
                >
                  <AlignVerticalJustifyEnd className="w-5 h-5" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        <Separator className="bg-border/50" />

        {/* Dimensions */}
        <div>
          <h4 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
            <span className="w-1 h-4 bg-primary rounded-full"></span>
            Dimensions
          </h4>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <label className="text-xs text-muted-foreground font-medium w-12">W</label>
              <Input
                type="number"
                value={Math.round(selectedElement.width || 0)}
                onChange={(e) => handleDimensionChange('width', Number(e.target.value))}
                className="flex-1 h-10 bg-muted/50 border-border/50 text-foreground text-sm font-medium rounded-lg"
              />
              <span className="text-xs text-muted-foreground font-medium">px</span>
            </div>
            <div className="flex items-center gap-3">
              <label className="text-xs text-muted-foreground font-medium w-12">H</label>
              <Input
                type="number"
                value={Math.round(selectedElement.height || 0)}
                onChange={(e) => handleDimensionChange('height', Number(e.target.value))}
                className="flex-1 h-10 bg-muted/50 border-border/50 text-foreground text-sm font-medium rounded-lg"
              />
              <span className="text-xs text-muted-foreground font-medium">px</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setMaintainAspectRatio(!maintainAspectRatio)}
                className={cn(
                  "h-10 w-10 p-0 rounded-lg hover:scale-110 transition-all duration-200",
                  maintainAspectRatio && "bg-primary/20"
                )}
                title={maintainAspectRatio ? 'Aspect ratio locked' : 'Aspect ratio unlocked'}
              >
                {maintainAspectRatio ? (
                  <Lock className="w-4 h-4 text-primary" />
                ) : (
                  <Unlock className="w-4 h-4 text-muted-foreground" />
                )}
              </Button>
            </div>
          </div>
        </div>

        <Separator className="bg-border/50" />

        {/* Position */}
        <div>
          <h4 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
            <span className="w-1 h-4 bg-primary rounded-full"></span>
            Position
          </h4>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <label className="text-xs text-muted-foreground font-medium w-12">X</label>
              <Input
                type="number"
                value={Math.round(selectedElement.x || 0)}
                onChange={(e) => handleDimensionChange('x', Number(e.target.value))}
                className="flex-1 h-10 bg-muted/50 border-border/50 text-foreground text-sm font-medium rounded-lg"
              />
              <span className="text-xs text-muted-foreground font-medium">px</span>
            </div>
            <div className="flex items-center gap-3">
              <label className="text-xs text-muted-foreground font-medium w-12">Y</label>
              <Input
                type="number"
                value={Math.round(selectedElement.y || 0)}
                onChange={(e) => handleDimensionChange('y', Number(e.target.value))}
                className="flex-1 h-10 bg-muted/50 border-border/50 text-foreground text-sm font-medium rounded-lg"
              />
              <span className="text-xs text-muted-foreground font-medium">px</span>
            </div>
          </div>
        </div>

        <Separator className="bg-border/50" />

        {/* Rotation */}
        <div>
          <h4 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
            <span className="w-1 h-4 bg-primary rounded-full"></span>
            Rotation
          </h4>
          <div className="flex items-center gap-3">
            <Input
              type="number"
              value={Math.round(selectedElement.rotation || 0)}
              onChange={(e) => handleDimensionChange('rotation', Number(e.target.value))}
              className="flex-1 h-10 bg-muted/50 border-border/50 text-foreground text-sm font-medium rounded-lg"
            />
            <span className="text-xs text-muted-foreground font-medium">°</span>
          </div>
        </div>
      </div>
    </div>
  );
}




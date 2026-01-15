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
  X,
  Layers2,
  Move,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { cn } from '../../lib/utils';

interface PositionPanelProps {
  element: any;
  onClose?: () => void;
}

/**
 * PositionPanel - Compact horizontal toolbar for positioning and alignment
 * Unique design - not copying Canva
 */
export function PositionPanel({ element, onClose }: PositionPanelProps) {
  const canvas = useEditorStore((s) => s.canvas);
  const updateElement = useEditorStore((s) => s.updateElement);
  const bringToFront = useEditorStore((s) => s.bringToFront);
  const sendToBack = useEditorStore((s) => s.sendToBack);
  const bringForward = useEditorStore((s) => s.bringForward);
  const sendBackward = useEditorStore((s) => s.sendBackward);
  const elements = useEditorStore((s) => s.elements);
  const pushHistory = useEditorStore((s) => s.pushHistory);
  const getStateSnapshot = useEditorStore((s) => s.getStateSnapshot);
  const setSelectedIds = useEditorStore((s) => s.setSelectedIds);

  const [maintainAspectRatio, setMaintainAspectRatio] = useState(true);
  const [showLayers, setShowLayers] = useState(false);

  // Ensure elements is always an array
  const elementsArray = Array.isArray(elements) ? elements : [];
  const sortedElements = [...elementsArray].sort((a, b) => (b.zIndex || 0) - (a.zIndex || 0));
  const elementIndex = sortedElements.findIndex(el => el.id === element.id);
  const isTop = elementIndex === 0;
  const isBottom = elementIndex === sortedElements.length - 1;

  // Handle layer operations
  const handleLayerOp = (op: 'front' | 'back' | 'forward' | 'backward') => {
    if (op === 'front') bringToFront(element.id);
    else if (op === 'back') sendToBack(element.id);
    else if (op === 'forward') bringForward(element.id);
    else if (op === 'backward') sendBackward(element.id);
  };

  // Handle alignment
  const handleAlign = (align: 'left' | 'center' | 'right' | 'top' | 'middle' | 'bottom') => {
    let updates: any = {};
    
    if (align === 'left') {
      updates.x = 0;
    } else if (align === 'center') {
      updates.x = (canvas.width - element.width) / 2;
    } else if (align === 'right') {
      updates.x = canvas.width - element.width;
    } else if (align === 'top') {
      updates.y = 0;
    } else if (align === 'middle') {
      updates.y = (canvas.height - element.height) / 2;
    } else if (align === 'bottom') {
      updates.y = canvas.height - element.height;
    }

    updateElement(element.id, updates);
    pushHistory(getStateSnapshot());
  };

  // Handle dimension changes
  const handleDimensionChange = (field: 'width' | 'height' | 'x' | 'y' | 'rotation', value: number) => {
    const updates: any = { [field]: value };

    // Maintain aspect ratio if locked
    if (maintainAspectRatio && (field === 'width' || field === 'height') && element.originalMeta) {
      const aspectRatio = element.originalMeta.width / element.originalMeta.height;
      if (field === 'width') {
        updates.height = value / aspectRatio;
      } else {
        updates.width = value * aspectRatio;
      }
    }

    updateElement(element.id, updates);
    pushHistory(getStateSnapshot());
  };

  return (
    <div className="w-full bg-gradient-to-b from-background via-background to-muted/20 border-t border-border/30 backdrop-blur-sm">
      {/* Compact Horizontal Layout */}
      <div className="px-6 py-4">
        <div className="flex items-center gap-4 flex-wrap">
          {/* Layer Controls - Compact */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-foreground mr-1">Layer:</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleLayerOp('forward')}
              disabled={isTop}
              className="h-8 w-8 p-0 hover:bg-accent hover:scale-110 transition-all duration-200 disabled:opacity-30 rounded-lg"
              title="Bring Forward"
            >
              <ChevronUp className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleLayerOp('backward')}
              disabled={isBottom}
              className="h-8 w-8 p-0 hover:bg-accent hover:scale-110 transition-all duration-200 disabled:opacity-30 rounded-lg"
              title="Send Backward"
            >
              <ChevronDown className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleLayerOp('front')}
              disabled={isTop}
              className="h-8 w-8 p-0 hover:bg-accent hover:scale-110 transition-all duration-200 disabled:opacity-30 rounded-lg"
              title="Bring to Front"
            >
              <ArrowUp className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleLayerOp('back')}
              disabled={isBottom}
              className="h-8 w-8 p-0 hover:bg-accent hover:scale-110 transition-all duration-200 disabled:opacity-30 rounded-lg"
              title="Send to Back"
            >
              <ArrowDown className="w-4 h-4" />
            </Button>
          </div>

          <Separator orientation="vertical" className="h-6" />

          {/* Alignment - Compact Grid */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-foreground mr-1">Align:</span>
            <div className="flex items-center gap-0.5 bg-muted/50 rounded-xl p-1 border border-border/50">
              {/* Vertical Alignment */}
              <div className="flex flex-col gap-0.5">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleAlign('top')}
                  className="h-7 w-7 p-0 hover:bg-accent hover:scale-110 transition-all duration-200 rounded-lg"
                  title="Align Top"
                >
                  <AlignVerticalJustifyStart className="w-3.5 h-3.5" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleAlign('middle')}
                  className="h-7 w-7 p-0 hover:bg-accent hover:scale-110 transition-all duration-200 rounded-lg"
                  title="Align Middle"
                >
                  <AlignVerticalJustifyCenter className="w-3.5 h-3.5" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleAlign('bottom')}
                  className="h-7 w-7 p-0 hover:bg-accent hover:scale-110 transition-all duration-200 rounded-lg"
                  title="Align Bottom"
                >
                  <AlignVerticalJustifyEnd className="w-3.5 h-3.5" />
                </Button>
              </div>
              {/* Horizontal Alignment */}
              <div className="flex gap-0.5">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleAlign('left')}
                  className="h-7 w-7 p-0 hover:bg-accent hover:scale-110 transition-all duration-200 rounded-lg"
                  title="Align Left"
                >
                  <AlignLeft className="w-3.5 h-3.5" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    handleAlign('center');
                    handleAlign('middle');
                  }}
                  className="h-7 w-7 p-0 bg-primary/20 hover:bg-primary/30 hover:scale-110 transition-all duration-200 rounded-lg"
                  title="Align Center"
                >
                  <AlignCenter className="w-3.5 h-3.5" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleAlign('right')}
                  className="h-7 w-7 p-0 hover:bg-accent hover:scale-110 transition-all duration-200 rounded-lg"
                  title="Align Right"
                >
                  <AlignRight className="w-3.5 h-3.5" />
                </Button>
              </div>
            </div>
          </div>

          <Separator orientation="vertical" className="h-6" />

          {/* Dimensions - Compact Inputs */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-foreground">Size:</span>
            <div className="flex items-center gap-1.5">
              <div className="flex items-center gap-1 bg-muted/50 rounded-lg px-2 py-1 border border-border/50">
                <span className="text-xs text-muted-foreground font-medium">W</span>
                <Input
                  type="number"
                  value={Math.round(element.width || 0)}
                  onChange={(e) => handleDimensionChange('width', Number(e.target.value))}
                  className="h-6 w-16 text-xs border-0 bg-transparent p-0 focus-visible:ring-0"
                />
              </div>
              <div className="flex items-center gap-1 bg-muted/50 rounded-lg px-2 py-1 border border-border/50">
                <span className="text-xs text-muted-foreground font-medium">H</span>
                <Input
                  type="number"
                  value={Math.round(element.height || 0)}
                  onChange={(e) => handleDimensionChange('height', Number(e.target.value))}
                  className="h-6 w-16 text-xs border-0 bg-transparent p-0 focus-visible:ring-0"
                />
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setMaintainAspectRatio(!maintainAspectRatio)}
                className={cn(
                  "h-7 w-7 p-0 hover:scale-110 transition-all duration-200 rounded-lg",
                  maintainAspectRatio && "bg-primary/20"
                )}
                title={maintainAspectRatio ? 'Aspect ratio locked' : 'Aspect ratio unlocked'}
              >
                {maintainAspectRatio ? (
                  <Lock className="w-3 h-3" />
                ) : (
                  <Unlock className="w-3 h-3" />
                )}
              </Button>
            </div>
          </div>

          <Separator orientation="vertical" className="h-6" />

          {/* Position - Compact Inputs */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-foreground">Position:</span>
            <div className="flex items-center gap-1.5">
              <div className="flex items-center gap-1 bg-muted/50 rounded-lg px-2 py-1 border border-border/50">
                <span className="text-xs text-muted-foreground font-medium">X</span>
                <Input
                  type="number"
                  value={Math.round(element.x || 0)}
                  onChange={(e) => handleDimensionChange('x', Number(e.target.value))}
                  className="h-6 w-16 text-xs border-0 bg-transparent p-0 focus-visible:ring-0"
                />
              </div>
              <div className="flex items-center gap-1 bg-muted/50 rounded-lg px-2 py-1 border border-border/50">
                <span className="text-xs text-muted-foreground font-medium">Y</span>
                <Input
                  type="number"
                  value={Math.round(element.y || 0)}
                  onChange={(e) => handleDimensionChange('y', Number(e.target.value))}
                  className="h-6 w-16 text-xs border-0 bg-transparent p-0 focus-visible:ring-0"
                />
              </div>
            </div>
          </div>

          <Separator orientation="vertical" className="h-6" />

          {/* Rotation */}
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-semibold text-foreground">Rotate:</span>
            <div className="flex items-center gap-1 bg-muted/50 rounded-lg px-2 py-1 border border-border/50">
              <Input
                type="number"
                value={Math.round(element.rotation || 0)}
                onChange={(e) => handleDimensionChange('rotation', Number(e.target.value))}
                className="h-6 w-14 text-xs border-0 bg-transparent p-0 focus-visible:ring-0 font-medium"
              />
              <span className="text-xs text-muted-foreground font-medium">°</span>
            </div>
          </div>

          {/* Layers Toggle */}
          <div className="ml-auto flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowLayers(!showLayers)}
              className={cn(
                "h-8 px-3 text-xs font-medium rounded-lg hover:scale-105 transition-all duration-200",
                showLayers && "bg-primary/20"
              )}
            >
              <Layers2 className="w-3.5 h-3.5 mr-1" />
              Layers
            </Button>
            {onClose && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="h-8 w-8 p-0 hover:scale-110 transition-all duration-200 rounded-lg"
                title="Close"
              >
                <X className="w-3.5 h-3.5" />
              </Button>
            )}
          </div>
        </div>

        {/* Layers Dropdown */}
        {showLayers && (
          <div className="mt-4 pt-4 border-t border-border/50 max-h-48 overflow-y-auto">
            <div className="grid grid-cols-2 gap-2">
              {sortedElements.map((el) => {
                const isSelected = el.id === element.id;
                return (
                  <div
                    key={el.id}
                    onClick={() => {
                      setSelectedIds([el.id]);
                      setShowLayers(false);
                    }}
                    className={cn(
                      'flex items-center gap-2 p-2 rounded-lg cursor-pointer transition-all duration-200',
                      isSelected
                        ? 'bg-primary/20 border border-primary/50 scale-[1.02]'
                        : 'hover:bg-accent hover:scale-[1.01] border border-transparent'
                    )}
                  >
                    <div className="w-6 h-6 flex items-center justify-center text-xs bg-primary/10 rounded-lg font-medium">
                      {el.type === 'text' ? 'T' : el.type === 'image' ? '🖼️' : el.type === 'shape' ? '⬜' : '•'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-foreground truncate capitalize">
                        {el.type === 'text' ? (el as any).text?.substring(0, 15) || 'Text' : el.type}
                      </p>
                      <p className="text-xs text-muted-foreground">z:{el.zIndex || 0}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

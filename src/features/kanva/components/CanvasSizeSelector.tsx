'use client';

import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ChevronDown, Smartphone, FileText, Video, Grid3x3, Presentation } from 'lucide-react';
import { useEditorStore } from '../lib/editor/store';
import { CANVA_PRESETS, getPresetById, applyPreset, type CanvasPreset } from '../lib/editor/canvasPresets';
import { cn } from '../lib/utils';

export function CanvasSizeSelector() {
  const canvas = useEditorStore((state) => state.canvas);
  const setCanvas = useEditorStore((state) => state.setCanvas);
  const [isOpen, setIsOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<CanvasPreset['category'] | 'all'>('all');
  const [customWidth, setCustomWidth] = useState(canvas?.width?.toString() || '1080');
  const [customHeight, setCustomHeight] = useState(canvas?.height?.toString() || '1080');
  const [showCustom, setShowCustom] = useState(false);

  // Safety check
  if (!canvas) {
    return null;
  }

  const currentPreset = CANVA_PRESETS.find(
    p => p.width === canvas.width && p.height === canvas.height
  );

  const categories: Array<{ id: CanvasPreset['category'] | 'all'; name: string; icon: any }> = [
    { id: 'all', name: 'All', icon: Grid3x3 },
    { id: 'social', name: 'Social', icon: Smartphone },
    { id: 'print', name: 'Print', icon: FileText },
    { id: 'presentation', name: 'Presentation', icon: Presentation },
    { id: 'video', name: 'Video', icon: Video },
    { id: 'custom', name: 'Custom', icon: Grid3x3 },
  ];

  const filteredPresets = activeCategory === 'all' 
    ? CANVA_PRESETS 
    : CANVA_PRESETS.filter(p => p.category === activeCategory);

  const handlePresetSelect = (preset: CanvasPreset) => {
    const newCanvas = applyPreset(preset);
    setCanvas(newCanvas);
    setIsOpen(false);
    // Trigger auto-fit after canvas size changes
    setTimeout(() => {
      window.dispatchEvent(new CustomEvent('kanva-canvas-size-changed'));
    }, 100);
  };

  const handleCustomSize = () => {
    const width = parseInt(customWidth) || 1080;
    const height = parseInt(customHeight) || 1080;
    setCanvas({
      width: Math.max(100, Math.min(10000, width)),
      height: Math.max(100, Math.min(10000, height)),
    });
    setIsOpen(false);
    setShowCustom(false);
    // Trigger auto-fit after canvas size changes
    setTimeout(() => {
      window.dispatchEvent(new CustomEvent('kanva-canvas-size-changed'));
    }, 100);
  };

  const [buttonRef, setButtonRef] = useState<HTMLButtonElement | null>(null);
  const buttonRect = buttonRef?.getBoundingClientRect();

  return (
    <div className="relative">
      <Button
        ref={setButtonRef}
        variant="ghost"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        className="gap-2 text-sm"
      >
        {currentPreset ? currentPreset.name : `${canvas.width} × ${canvas.height}`}
        <ChevronDown size={14} />
      </Button>

      {isOpen && buttonRect && createPortal(
        <>
          <div 
            className="fixed inset-0 z-[9998]" 
            onClick={() => setIsOpen(false)}
          />
          <div 
            className="fixed w-96 bg-card border border-border rounded-lg shadow-xl z-[9999]"
            style={{
              top: `${buttonRect.bottom + 8}px`,
              left: `${buttonRect.left}px`,
            }}
          >
            <div className="p-4 border-b border-border">
              <h3 className="text-foreground font-semibold mb-3">Canvas Size</h3>
              
              {/* Category tabs - Wrapped grid for better visibility */}
              <div className="grid grid-cols-3 gap-2 mb-3">
                {categories.map((cat) => {
                  const Icon = cat.icon;
                  return (
                    <button
                      key={cat.id}
                      onClick={() => {
                        setActiveCategory(cat.id);
                        setShowCustom(cat.id === 'custom');
                      }}
                      className={cn(
                        "flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-all duration-200",
                        activeCategory === cat.id
                          ? "bg-primary text-primary-foreground shadow-md scale-105"
                          : "bg-muted text-muted-foreground hover:bg-accent hover:scale-105"
                      )}
                    >
                      <Icon size={14} />
                      {cat.name}
                    </button>
                  );
                })}
              </div>

              {/* Custom size input */}
              {showCustom && (
                <div className="mb-3 p-3 bg-muted rounded border border-border">
                  <div className="grid grid-cols-2 gap-2 mb-2">
                    <div>
                      <label className="text-xs text-muted-foreground mb-1 block">Width</label>
                      <Input
                        type="number"
                        value={customWidth}
                        onChange={(e) => setCustomWidth(e.target.value)}
                        className="text-sm"
                        placeholder="1080"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-muted-foreground mb-1 block">Height</label>
                      <Input
                        type="number"
                        value={customHeight}
                        onChange={(e) => setCustomHeight(e.target.value)}
                        className="text-sm"
                        placeholder="1080"
                      />
                    </div>
                  </div>
                  <Button
                    size="sm"
                    onClick={handleCustomSize}
                    className="w-full text-xs"
                  >
                    Apply Custom Size
                  </Button>
                </div>
              )}
            </div>

            {/* Presets list */}
            <div className="max-h-96 overflow-y-auto p-2">
              {filteredPresets.map((preset) => {
                const isSelected = canvas.width === preset.width && canvas.height === preset.height;
                return (
                  <button
                    key={preset.id}
                    onClick={() => handlePresetSelect(preset)}
                    className={cn(
                      "w-full text-left px-3 py-2 rounded mb-1 transition-colors",
                      isSelected
                        ? "bg-primary text-primary-foreground"
                        : "text-foreground hover:bg-muted"
                    )}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium text-sm">{preset.name}</div>
                        {preset.description && (
                          <div className="text-xs opacity-75">{preset.description}</div>
                        )}
                      </div>
                      <div className="text-xs opacity-75">
                        {preset.width} × {preset.height}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </>,
        document.body
      )}
    </div>
  );
}


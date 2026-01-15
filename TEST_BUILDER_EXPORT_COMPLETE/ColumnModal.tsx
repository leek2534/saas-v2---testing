"use client";



import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Square, Check, AlignLeft, AlignCenter, AlignRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ColumnModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddColumn: (config: ColumnConfig) => void;
  rowId: string;
  currentColumnCount: number;
}

export interface ColumnConfig {
  rowId: string;
  width: number;
  position?: 'start' | 'end' | number; // Where to insert: start, end, or specific index
}

// Quick width presets
const WIDTH_PRESETS = [
  { id: 'auto', name: 'Auto', value: 0, description: 'Equal distribution' },
  { id: '25', name: '25%', value: 25, description: 'Quarter width' },
  { id: '33', name: '33%', value: 33.33, description: 'One third' },
  { id: '50', name: '50%', value: 50, description: 'Half width' },
  { id: '66', name: '66%', value: 66.66, description: 'Two thirds' },
  { id: '75', name: '75%', value: 75, description: 'Three quarters' },
  { id: '100', name: '100%', value: 100, description: 'Full width' },
];

// Position options
const POSITION_OPTIONS = [
  { id: 'start', name: 'Beginning', icon: AlignLeft, description: 'Add to start of row' },
  { id: 'end', name: 'End', icon: AlignRight, description: 'Add to end of row' },
];

export function ColumnModal({ isOpen, onClose, onAddColumn, rowId, currentColumnCount }: ColumnModalProps) {
  const [width, setWidth] = useState<number>(0); // 0 = auto
  const [position, setPosition] = useState<'start' | 'end'>('end');
  const [customWidth, setCustomWidth] = useState<number>(33);

  const handleReset = () => {
    setWidth(0);
    setPosition('end');
    setCustomWidth(33);
  };

  // Reset modal state when it opens
  useEffect(() => {
    if (isOpen) {
      handleReset();
    }
  }, [isOpen]);

  const handleClose = () => {
    handleReset();
    onClose();
  };

  const handleAddColumn = () => {
    const config: ColumnConfig = {
      rowId,
      width: width === 0 ? customWidth : width,
      position,
    };

    onAddColumn(config);
    handleClose();
  };

  const getSelectedPreset = () => {
    return WIDTH_PRESETS.find(p => p.value === width);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold flex items-center gap-2 text-foreground">
            <Square className="w-5 h-5 text-primary" />
            Add Column to Row
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Current Row Info */}
          <div className="bg-primary/10 border border-primary/20 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-foreground">Current Row</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {currentColumnCount} {currentColumnCount === 1 ? 'column' : 'columns'} currently in this row
                </p>
              </div>
              <div className="text-2xl font-bold text-primary">
                {currentColumnCount} → {currentColumnCount + 1}
              </div>
            </div>
          </div>

          {/* Width Selection */}
          <div className="space-y-4">
            <Label className="text-base font-semibold">Column Width</Label>
            
            {/* Quick Presets */}
            <div className="grid grid-cols-4 gap-2">
              {WIDTH_PRESETS.map((preset) => (
                <button
                  key={preset.id}
                  onClick={() => setWidth(preset.value)}
                  className={cn(
                    "relative p-3 border-2 rounded-lg transition-all hover:shadow-md text-center",
                    width === preset.value
                      ? "border-primary bg-primary/10 shadow-sm"
                      : "border-border hover:border-primary"
                  )}
                >
                  <div className="font-bold text-sm">{preset.name}</div>
                  <div className="text-xs text-muted-foreground mt-0.5">{preset.description}</div>
                  {width === preset.value && (
                    <div className="absolute top-1 right-1 w-4 h-4 bg-primary rounded-full flex items-center justify-center">
                      <Check className="w-2.5 h-2.5 text-primary-foreground" />
                    </div>
                  )}
                </button>
              ))}
            </div>

            {/* Custom Width Slider */}
            {width === 0 && (
              <div className="space-y-3 p-4 bg-card rounded-lg border border-border">
                <div className="flex items-center justify-between">
                  <Label className="text-sm font-medium">Custom Width</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      type="number"
                      value={customWidth}
                      onChange={(e) => setCustomWidth(Math.min(100, Math.max(1, Number(e.target.value))))}
                      className="w-16 h-8 text-sm text-center"
                      min={1}
                      max={100}
                    />
                    <span className="text-sm text-muted-foreground">%</span>
                  </div>
                </div>
                <Slider
                  value={[customWidth]}
                  onValueChange={([val]) => setCustomWidth(val)}
                  min={1}
                  max={100}
                  step={1}
                  className="w-full"
                />
                <p className="text-xs text-muted-foreground">
                  Adjust the slider or enter a value between 1-100%
                </p>
              </div>
            )}

            {/* Visual Preview */}
            <div className="p-4 bg-card border-2 border-dashed border-border rounded-lg">
              <Label className="text-xs font-medium text-foreground mb-3 block">Preview</Label>
              <div className="flex gap-2 h-20 items-stretch">
                {/* New column preview at beginning if position is 'start' */}
                {position === 'start' && (
                  <div
                    className="bg-primary rounded flex items-center justify-center font-bold text-primary-foreground"
                    style={{ width: `${width === 0 ? customWidth : width}%` }}
                  >
                    <span className="text-xs">New</span>
                  </div>
                )}
                {/* Existing columns (simplified) */}
                {Array.from({ length: currentColumnCount }).map((_, idx) => (
                  <div
                    key={idx}
                    className="flex-1 bg-muted rounded flex items-center justify-center"
                  >
                    <span className="text-xs text-muted-foreground">Col {idx + 1}</span>
                  </div>
                ))}
                {/* New column preview at end if position is 'end' */}
                {position === 'end' && (
                <div
                  className="bg-purple-400 rounded flex items-center justify-center font-bold text-white"
                  style={{ width: `${width === 0 ? customWidth : width}%` }}
                >
                  <span className="text-xs">New</span>
                </div>
                )}
              </div>
              <p className="text-xs text-muted-foreground mt-2 text-center">
                New column will be <strong>{width === 0 ? customWidth : width}%</strong> wide at the <strong>{position === 'start' ? 'beginning' : 'end'}</strong>
              </p>
            </div>
          </div>

          {/* Position Selection */}
          <div className="space-y-3">
            <Label className="text-base font-semibold">Insert Position</Label>
            <div className="grid grid-cols-2 gap-3">
              {POSITION_OPTIONS.map((option) => {
                const Icon = option.icon;
                return (
                  <button
                    key={option.id}
                    onClick={() => setPosition(option.id as 'start' | 'end')}
                    className={cn(
                      "relative p-4 border-2 rounded-xl transition-all hover:shadow-lg group text-left",
                      position === option.id
                        ? "border-primary bg-primary/10 shadow-md"
                        : "border-border hover:border-primary"
                    )}
                  >
                    <div className="flex items-start gap-3">
                      <Icon className={cn(
                        "w-5 h-5 flex-shrink-0 transition-colors",
                        position === option.id ? "text-primary" : "text-muted-foreground group-hover:text-primary"
                      )} />
                      <div className="flex-1">
                        <div className="font-bold text-sm mb-1">{option.name}</div>
                        <div className="text-xs text-muted-foreground">{option.description}</div>
                      </div>
                    </div>
                    {position === option.id && (
                      <div className="absolute top-2 right-2 w-5 h-5 bg-primary rounded-full flex items-center justify-center">
                        <Check className="w-3 h-3 text-primary-foreground" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Info Box */}
          <div className="bg-primary/10 border border-primary/20 rounded-lg p-4">
            <p className="text-sm text-foreground">
              <strong>Note:</strong> After adding the column, you can adjust all column widths in the row settings panel. 
              The row will automatically redistribute space to accommodate the new column.
            </p>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between pt-4 border-t">
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button
            onClick={handleAddColumn}
            className="bg-primary hover:bg-primary/90"
          >
            Add Column
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

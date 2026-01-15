"use client";



import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';

interface EnhancedSliderProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
  step?: number;
  unit?: string;
  showInput?: boolean;
  tooltip?: string;
}

export function EnhancedSlider({ 
  label, 
  value, 
  onChange, 
  min, 
  max, 
  step = 1, 
  unit = 'px',
  showInput = true,
  tooltip
}: EnhancedSliderProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Label className="text-xs font-medium text-foreground">{label}</Label>
          {tooltip && (
            <span className="text-xs text-muted-foreground cursor-help" title={tooltip}>ⓘ</span>
          )}
        </div>
        {showInput && (
          <div className="flex items-center gap-1.5">
            <Input
              type="number"
              value={value || 0}
              onChange={(e) => onChange(Number(e.target.value))}
              className="w-16 h-7 text-xs text-center px-2"
              min={min}
              max={max}
              step={step}
            />
            <span className="text-xs text-muted-foreground font-medium min-w-[24px]">{unit}</span>
          </div>
        )}
      </div>
      <Slider
        value={[value || 0]}
        onValueChange={([val]) => onChange(val)}
        min={min}
        max={max}
        step={step}
        className="w-full"
      />
      <div className="flex justify-between text-xs text-muted-foreground">
        <span>{min}{unit}</span>
        <span>{max}{unit}</span>
      </div>
    </div>
  );
}

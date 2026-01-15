"use client";



import React, { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ChevronUp, ChevronDown, Link2, Unlink } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PaddingControlProps {
  values: {
    top?: number;
    right?: number;
    bottom?: number;
    left?: number;
  };
  onChange: (values: {
    top?: number;
    right?: number;
    bottom?: number;
    left?: number;
  }) => void;
  min?: number;
  max?: number;
  step?: number;
  unit?: string;
  label?: string;
  showLabel?: boolean;
}

export function PaddingControl({
  values,
  onChange,
  min = 0,
  max = 200,
  step = 1,
  unit = 'px',
  label = 'Padding',
  showLabel = true,
}: PaddingControlProps) {
  const [isLinked, setIsLinked] = useState(false);

  const handleChange = (side: 'top' | 'right' | 'bottom' | 'left', value: number) => {
    const clampedValue = Math.max(min, Math.min(max, value));
    
    if (isLinked) {
      // Update all sides when linked
      onChange({
        top: clampedValue,
        right: clampedValue,
        bottom: clampedValue,
        left: clampedValue,
      });
    } else {
      // Update only the specific side
      onChange({
        ...values,
        [side]: clampedValue,
      });
    }
  };

  const increment = (side: 'top' | 'right' | 'bottom' | 'left') => {
    const currentValue = values[side] || 0;
    handleChange(side, currentValue + step);
  };

  const decrement = (side: 'top' | 'right' | 'bottom' | 'left') => {
    const currentValue = values[side] || 0;
    handleChange(side, currentValue - step);
  };

  const handleInputChange = (side: 'top' | 'right' | 'bottom' | 'left', inputValue: string) => {
    const numValue = parseInt(inputValue) || 0;
    handleChange(side, numValue);
  };

  const sides = [
    { key: 'top' as const, label: 'Top', icon: '↑' },
    { key: 'right' as const, label: 'Right', icon: '→' },
    { key: 'bottom' as const, label: 'Bottom', icon: '↓' },
    { key: 'left' as const, label: 'Left', icon: '←' },
  ];

  return (
    <div className="space-y-3">
      {showLabel && (
        <div className="flex items-center justify-between">
          <Label className="text-xs font-semibold text-gray-700 dark:text-gray-300">
            {label}
          </Label>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsLinked(!isLinked)}
            className="h-6 w-6 p-0"
            title={isLinked ? 'Unlink sides' : 'Link all sides'}
          >
            {isLinked ? (
              <Link2 size={14} className="text-blue-600 dark:text-blue-400" />
            ) : (
              <Unlink size={14} className="text-gray-400" />
            )}
          </Button>
        </div>
      )}

      <div className="grid grid-cols-2 gap-3">
        {sides.map(({ key, label: sideLabel, icon }) => (
          <div key={key} className="space-y-1">
            <Label className="text-[10px] text-gray-500 dark:text-gray-400 uppercase tracking-wide">
              {icon} {sideLabel}
            </Label>
            <div className="flex items-center gap-1">
              {/* Decrement Button */}
              <Button
                variant="outline"
                size="sm"
                onClick={() => decrement(key)}
                disabled={values[key] === min}
                className="h-8 w-8 p-0 flex-shrink-0"
              >
                <ChevronDown size={14} />
              </Button>

              {/* Input Field */}
              <div className="relative flex-1">
                <Input
                  type="number"
                  value={values[key] || 0}
                  onChange={(e) => handleInputChange(key, e.target.value)}
                  min={min}
                  max={max}
                  step={step}
                  className="h-8 text-center text-sm pr-8"
                />
                <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] text-gray-400 pointer-events-none">
                  {unit}
                </span>
              </div>

              {/* Increment Button */}
              <Button
                variant="outline"
                size="sm"
                onClick={() => increment(key)}
                disabled={values[key] === max}
                className="h-8 w-8 p-0 flex-shrink-0"
              >
                <ChevronUp size={14} />
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Visual Padding Preview */}
      <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
        <div className="text-[10px] text-gray-500 dark:text-gray-400 mb-2 text-center uppercase tracking-wide">
          Preview
        </div>
        <div 
          className="relative bg-white dark:bg-gray-900 border-2 border-dashed border-blue-300 dark:border-blue-700 rounded"
          style={{
            paddingTop: `${values.top || 0}px`,
            paddingRight: `${values.right || 0}px`,
            paddingBottom: `${values.bottom || 0}px`,
            paddingLeft: `${values.left || 0}px`,
          }}
        >
          {/* Top indicator */}
          {(values.top || 0) > 0 && (
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-blue-500 text-white text-[9px] px-1.5 py-0.5 rounded">
              {values.top}{unit}
            </div>
          )}
          
          {/* Right indicator */}
          {(values.right || 0) > 0 && (
            <div className="absolute right-0 top-1/2 translate-x-1/2 -translate-y-1/2 bg-blue-500 text-white text-[9px] px-1.5 py-0.5 rounded">
              {values.right}{unit}
            </div>
          )}
          
          {/* Bottom indicator */}
          {(values.bottom || 0) > 0 && (
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 bg-blue-500 text-white text-[9px] px-1.5 py-0.5 rounded">
              {values.bottom}{unit}
            </div>
          )}
          
          {/* Left indicator */}
          {(values.left || 0) > 0 && (
            <div className="absolute left-0 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-blue-500 text-white text-[9px] px-1.5 py-0.5 rounded">
              {values.left}{unit}
            </div>
          )}
          
          {/* Content box */}
          <div className="bg-blue-100 dark:bg-blue-900/30 rounded p-2 text-center">
            <div className="text-[10px] text-gray-600 dark:text-gray-400">Content</div>
          </div>
        </div>
      </div>

      {/* Quick Presets */}
      <div className="space-y-2">
        <Label className="text-[10px] text-gray-500 dark:text-gray-400 uppercase tracking-wide">
          Quick Presets
        </Label>
        <div className="grid grid-cols-4 gap-2">
          {[
            { label: 'None', value: 0 },
            { label: 'Small', value: 8 },
            { label: 'Medium', value: 16 },
            { label: 'Large', value: 32 },
          ].map(({ label: presetLabel, value }) => (
            <Button
              key={presetLabel}
              variant="outline"
              size="sm"
              onClick={() => onChange({
                top: value,
                right: value,
                bottom: value,
                left: value,
              })}
              className={cn(
                "h-7 text-[10px]",
                values.top === value && 
                values.right === value && 
                values.bottom === value && 
                values.left === value &&
                "bg-blue-50 dark:bg-blue-900/30 border-blue-500"
              )}
            >
              {presetLabel}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
}

// Simplified version for single value (all sides equal)
interface SimplePaddingControlProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  unit?: string;
  label?: string;
}

export function SimplePaddingControl({
  value,
  onChange,
  min = 0,
  max = 200,
  step = 1,
  unit = 'px',
  label = 'Padding',
}: SimplePaddingControlProps) {
  const handleChange = (newValue: number) => {
    const clampedValue = Math.max(min, Math.min(max, newValue));
    onChange(clampedValue);
  };

  const increment = () => handleChange(value + step);
  const decrement = () => handleChange(value - step);

  return (
    <div className="space-y-2">
      <Label className="text-xs font-semibold text-gray-700 dark:text-gray-300">
        {label}
      </Label>
      
      <div className="flex items-center gap-2">
        {/* Decrement Button */}
        <Button
          variant="outline"
          size="sm"
          onClick={decrement}
          disabled={value === min}
          className="h-9 w-9 p-0 flex-shrink-0"
        >
          <ChevronDown size={16} />
        </Button>

        {/* Input Field */}
        <div className="relative flex-1">
          <Input
            type="number"
            value={value}
            onChange={(e) => handleChange(parseInt(e.target.value) || 0)}
            min={min}
            max={max}
            step={step}
            className="h-9 text-center text-sm pr-10"
          />
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400 pointer-events-none">
            {unit}
          </span>
        </div>

        {/* Increment Button */}
        <Button
          variant="outline"
          size="sm"
          onClick={increment}
          disabled={value === max}
          className="h-9 w-9 p-0 flex-shrink-0"
        >
          <ChevronUp size={16} />
        </Button>
      </div>

      {/* Quick Presets */}
      <div className="grid grid-cols-4 gap-2">
        {[
          { label: 'None', value: 0 },
          { label: 'Small', value: 8 },
          { label: 'Medium', value: 16 },
          { label: 'Large', value: 32 },
        ].map(({ label: presetLabel, value: presetValue }) => (
          <Button
            key={presetLabel}
            variant="outline"
            size="sm"
            onClick={() => onChange(presetValue)}
            className={cn(
              "h-7 text-[10px]",
              value === presetValue && "bg-blue-50 dark:bg-blue-900/30 border-blue-500"
            )}
          >
            {presetLabel}
          </Button>
        ))}
      </div>
    </div>
  );
}

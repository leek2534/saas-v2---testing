"use client";



import React from 'react';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Monitor, Tablet, Smartphone } from 'lucide-react';

interface ResponsiveWidthControlProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  unit?: string;
  showDevicePreview?: boolean;
}

export function ResponsiveWidthControl({
  label,
  value,
  onChange,
  min = 30,
  max = 100,
  step = 1,
  unit = '%',
  showDevicePreview = true
}: ResponsiveWidthControlProps) {
  
  const getDeviceIcon = () => {
    if (value >= 80) return <Monitor size={16} className="text-blue-500" />;
    if (value >= 60) return <Tablet size={16} className="text-green-500" />;
    return <Smartphone size={16} className="text-orange-500" />;
  };

  const getWidthDescription = () => {
    if (value >= 90) return 'Full width - spans entire container';
    if (value >= 70) return 'Wide - good for desktop layouts';
    if (value >= 50) return 'Medium - balanced for all devices';
    return 'Narrow - mobile-friendly width';
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <Label className="text-sm font-medium">{label}</Label>
        {showDevicePreview && (
          <div className="flex items-center gap-2">
            {getDeviceIcon()}
            <span className="text-xs text-gray-500">{value}{unit}</span>
          </div>
        )}
      </div>

      {/* Slider Control */}
      <div className="space-y-2">
        <Slider
          value={[value]}
          onValueChange={(values) => onChange(values[0])}
          min={min}
          max={max}
          step={step}
          className="w-full"
        />
        
        {/* Quick Preset Buttons */}
        <div className="flex gap-1">
          {[33, 50, 66, 75, 100].map((preset) => (
            <button
              key={preset}
              onClick={() => onChange(preset)}
              className={`px-2 py-1 text-xs rounded transition-colors ${
                value === preset
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
              }`}
            >
              {preset}{unit}
            </button>
          ))}
        </div>
      </div>

      {/* Manual Input */}
      <div className="flex items-center gap-2">
        <Input
          type="number"
          value={value}
          onChange={(e) => {
            const newValue = Math.max(min, Math.min(max, parseInt(e.target.value) || min));
            onChange(newValue);
          }}
          min={min}
          max={max}
          step={step}
          className="w-20 h-8 text-sm"
        />
        <span className="text-sm text-gray-500">{unit}</span>
      </div>

      {/* Description */}
      {showDevicePreview && (
        <p className="text-xs text-gray-500 italic">
          {getWidthDescription()}
        </p>
      )}

      {/* Visual Preview Bar */}
      <div className="relative h-2 bg-gray-200 rounded-full overflow-hidden">
        <div 
          className="h-full bg-gradient-to-r from-blue-400 to-blue-600 rounded-full transition-all duration-300"
          style={{ width: `${value}%` }}
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-xs font-medium text-white drop-shadow">
            {value}{unit}
          </span>
        </div>
      </div>
    </div>
  );
}

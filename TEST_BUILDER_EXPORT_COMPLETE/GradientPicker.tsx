"use client";



import React, { useState } from 'react';
import { HexColorPicker } from 'react-colorful';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Plus, Trash2, GripVertical } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface GradientStop {
  color: string;
  position: number; // 0-100
}

export interface GradientValue {
  type: 'linear' | 'radial';
  angle: number; // 0-360 for linear
  stops: GradientStop[];
}

interface GradientPickerProps {
  value: GradientValue;
  onChange: (gradient: GradientValue) => void;
  label?: string;
}

export function GradientPicker({ value, onChange, label = 'Gradient' }: GradientPickerProps) {
  const [selectedStopIndex, setSelectedStopIndex] = useState(0);
  const [showColorPicker, setShowColorPicker] = useState(false);

  const selectedStop = value.stops[selectedStopIndex];

  const updateStop = (index: number, updates: Partial<GradientStop>) => {
    const newStops = [...value.stops];
    newStops[index] = { ...newStops[index], ...updates };
    onChange({ ...value, stops: newStops });
  };

  const addStop = () => {
    const newPosition = 50; // Add in the middle
    const newStop: GradientStop = {
      color: '#888888',
      position: newPosition,
    };
    onChange({
      ...value,
      stops: [...value.stops, newStop].sort((a, b) => a.position - b.position),
    });
    setSelectedStopIndex(value.stops.length);
  };

  const removeStop = (index: number) => {
    if (value.stops.length <= 2) return; // Keep at least 2 stops
    const newStops = value.stops.filter((_, i) => i !== index);
    onChange({ ...value, stops: newStops });
    if (selectedStopIndex >= newStops.length) {
      setSelectedStopIndex(newStops.length - 1);
    }
  };

  const generateCSSGradient = () => {
    const sortedStops = [...value.stops].sort((a, b) => a.position - b.position);
    const stopsString = sortedStops
      .map((stop) => `${stop.color} ${stop.position}%`)
      .join(', ');

    if (value.type === 'linear') {
      return `linear-gradient(${value.angle}deg, ${stopsString})`;
    } else {
      return `radial-gradient(circle, ${stopsString})`;
    }
  };

  return (
    <div className="space-y-4">
      <Label className="text-xs text-gray-600 dark:text-gray-400">{label}</Label>

      {/* Gradient Preview */}
      <div
        className="w-full h-20 rounded-lg border-2 border-gray-300 dark:border-gray-600"
        style={{ background: generateCSSGradient() }}
      />

      {/* Gradient Type */}
      <div>
        <Label className="text-xs text-gray-600 dark:text-gray-400 mb-2 block">Type</Label>
        <Select
          value={value.type}
          onValueChange={(type: 'linear' | 'radial') => onChange({ ...value, type })}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="linear">Linear</SelectItem>
            <SelectItem value="radial">Radial</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Angle (Linear only) */}
      {value.type === 'linear' && (
        <div>
          <div className="flex items-center justify-between mb-2">
            <Label className="text-xs text-gray-600 dark:text-gray-400">Angle</Label>
            <div className="flex items-center gap-2">
              <Input
                type="number"
                value={value.angle}
                onChange={(e) => onChange({ ...value, angle: Number(e.target.value) })}
                className="w-16 h-7 text-xs text-center"
                min={0}
                max={360}
              />
              <span className="text-xs text-gray-500">°</span>
            </div>
          </div>
          <Slider
            value={[value.angle]}
            onValueChange={([angle]) => onChange({ ...value, angle })}
            min={0}
            max={360}
            step={1}
          />
        </div>
      )}

      {/* Color Stops */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <Label className="text-xs text-gray-600 dark:text-gray-400">Color Stops</Label>
          <Button
            size="sm"
            variant="outline"
            onClick={addStop}
            className="h-7 text-xs"
          >
            <Plus className="w-3 h-3 mr-1" />
            Add Stop
          </Button>
        </div>

        {/* Stop List */}
        <div className="space-y-2">
          {value.stops.map((stop, index) => (
            <div
              key={index}
              className={cn(
                'flex items-center gap-2 p-2 rounded-lg border transition-colors cursor-pointer',
                selectedStopIndex === index
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                  : 'border-gray-300 dark:border-gray-600 hover:border-gray-400'
              )}
              onClick={() => setSelectedStopIndex(index)}
            >
              <GripVertical className="w-4 h-4 text-gray-400" />
              <div
                className="w-8 h-8 rounded border border-gray-300 dark:border-gray-600 flex-shrink-0"
                style={{ backgroundColor: stop.color }}
              />
              <div className="flex-1 text-xs font-mono text-gray-700 dark:text-gray-300">
                {stop.color}
              </div>
              <div className="text-xs text-gray-500">{stop.position}%</div>
              {value.stops.length > 2 && (
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeStop(index);
                  }}
                  className="h-7 w-7 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
                >
                  <Trash2 className="w-3 h-3" />
                </Button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Selected Stop Editor */}
      {selectedStop && (
        <div className="space-y-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
          <Label className="text-xs font-semibold text-gray-700 dark:text-gray-300">
            Edit Stop {selectedStopIndex + 1}
          </Label>

          {/* Color Picker */}
          <div>
            <Label className="text-xs text-gray-600 dark:text-gray-400 mb-2 block">Color</Label>
            <div className="relative">
              <button
                onClick={() => setShowColorPicker(!showColorPicker)}
                className="w-full flex items-center gap-2 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:border-blue-400 transition-colors bg-white dark:bg-gray-900"
              >
                <div
                  className="w-8 h-8 rounded border border-gray-300 dark:border-gray-600"
                  style={{ backgroundColor: selectedStop.color }}
                />
                <span className="text-sm font-mono text-gray-700 dark:text-gray-300">
                  {selectedStop.color}
                </span>
              </button>
              {showColorPicker && (
                <div className="absolute top-full left-0 mt-2 p-3 bg-white dark:bg-gray-900 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 z-50">
                  <HexColorPicker
                    color={selectedStop.color}
                    onChange={(color) => updateStop(selectedStopIndex, { color })}
                  />
                  <Input
                    type="text"
                    value={selectedStop.color}
                    onChange={(e) => updateStop(selectedStopIndex, { color: e.target.value })}
                    className="mt-2 text-xs font-mono"
                    placeholder="#000000"
                  />
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setShowColorPicker(false)}
                    className="w-full mt-2"
                  >
                    Done
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* Position Slider */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <Label className="text-xs text-gray-600 dark:text-gray-400">Position</Label>
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  value={selectedStop.position}
                  onChange={(e) => updateStop(selectedStopIndex, { position: Number(e.target.value) })}
                  className="w-16 h-7 text-xs text-center"
                  min={0}
                  max={100}
                />
                <span className="text-xs text-gray-500">%</span>
              </div>
            </div>
            <Slider
              value={[selectedStop.position]}
              onValueChange={([position]) => updateStop(selectedStopIndex, { position })}
              min={0}
              max={100}
              step={1}
            />
          </div>
        </div>
      )}

      {/* Preset Gradients */}
      <div>
        <Label className="text-xs text-gray-600 dark:text-gray-400 mb-2 block">Presets</Label>
        <div className="grid grid-cols-4 gap-2">
          {GRADIENT_PRESETS.map((preset, index) => (
            <button
              key={index}
              onClick={() => onChange(preset)}
              className="h-12 rounded-lg border-2 border-gray-300 dark:border-gray-600 hover:border-blue-500 transition-colors"
              style={{ background: generatePresetCSS(preset) }}
              title={preset.type === 'linear' ? `Linear ${preset.angle}°` : 'Radial'}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

// Helper function to generate CSS from preset
function generatePresetCSS(gradient: GradientValue): string {
  const sortedStops = [...gradient.stops].sort((a, b) => a.position - b.position);
  const stopsString = sortedStops
    .map((stop) => `${stop.color} ${stop.position}%`)
    .join(', ');

  if (gradient.type === 'linear') {
    return `linear-gradient(${gradient.angle}deg, ${stopsString})`;
  } else {
    return `radial-gradient(circle, ${stopsString})`;
  }
}

// Preset gradients
const GRADIENT_PRESETS: GradientValue[] = [
  {
    type: 'linear',
    angle: 90,
    stops: [
      { color: '#667eea', position: 0 },
      { color: '#764ba2', position: 100 },
    ],
  },
  {
    type: 'linear',
    angle: 135,
    stops: [
      { color: '#f093fb', position: 0 },
      { color: '#f5576c', position: 100 },
    ],
  },
  {
    type: 'linear',
    angle: 90,
    stops: [
      { color: '#4facfe', position: 0 },
      { color: '#00f2fe', position: 100 },
    ],
  },
  {
    type: 'linear',
    angle: 45,
    stops: [
      { color: '#43e97b', position: 0 },
      { color: '#38f9d7', position: 100 },
    ],
  },
  {
    type: 'linear',
    angle: 90,
    stops: [
      { color: '#fa709a', position: 0 },
      { color: '#fee140', position: 100 },
    ],
  },
  {
    type: 'linear',
    angle: 135,
    stops: [
      { color: '#30cfd0', position: 0 },
      { color: '#330867', position: 100 },
    ],
  },
  {
    type: 'radial',
    angle: 0,
    stops: [
      { color: '#ff9a9e', position: 0 },
      { color: '#fecfef', position: 100 },
    ],
  },
  {
    type: 'linear',
    angle: 90,
    stops: [
      { color: '#a8edea', position: 0 },
      { color: '#fed6e3', position: 100 },
    ],
  },
];

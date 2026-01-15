"use client";



import React from 'react';
import { cn } from '@/lib/utils';

interface VisualPositionPickerProps {
  value: string;
  onChange: (position: string) => void;
  label?: string;
}

const positions = [
  { value: 'top left', label: 'Top Left', grid: 'row-start-1 col-start-1' },
  { value: 'top center', label: 'Top Center', grid: 'row-start-1 col-start-2' },
  { value: 'top right', label: 'Top Right', grid: 'row-start-1 col-start-3' },
  { value: 'center left', label: 'Center Left', grid: 'row-start-2 col-start-1' },
  { value: 'center', label: 'Center', grid: 'row-start-2 col-start-2' },
  { value: 'center right', label: 'Center Right', grid: 'row-start-2 col-start-3' },
  { value: 'bottom left', label: 'Bottom Left', grid: 'row-start-3 col-start-1' },
  { value: 'bottom center', label: 'Bottom Center', grid: 'row-start-3 col-start-2' },
  { value: 'bottom right', label: 'Bottom Right', grid: 'row-start-3 col-start-3' },
];

export function VisualPositionPicker({ value, onChange, label = 'Position' }: VisualPositionPickerProps) {
  return (
    <div className="space-y-2">
      {label && <label className="text-xs font-medium text-gray-700 dark:text-gray-300">{label}</label>}
      
      <div className="grid grid-cols-3 grid-rows-3 gap-1 p-2 bg-gray-100 dark:bg-gray-800 rounded-lg">
        {positions.map((position) => (
          <button
            key={position.value}
            type="button"
            onClick={() => onChange(position.value)}
            className={cn(
              'w-full h-10 rounded border-2 transition-all duration-200',
              'hover:border-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20',
              'flex items-center justify-center',
              value === position.value
                ? 'border-blue-500 bg-blue-100 dark:bg-blue-900/40 shadow-sm'
                : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700'
            )}
            title={position.label}
          >
            <div
              className={cn(
                'w-2 h-2 rounded-full transition-all',
                value === position.value
                  ? 'bg-blue-500 scale-125'
                  : 'bg-gray-400 dark:bg-gray-500'
              )}
            />
          </button>
        ))}
      </div>
      
      <p className="text-xs text-gray-500 text-center">
        {positions.find(p => p.value === value)?.label || 'Center'}
      </p>
    </div>
  );
}

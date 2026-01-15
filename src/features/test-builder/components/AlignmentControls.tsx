"use client";



import React from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { AlignLeft, AlignCenter, AlignRight, AlignJustify } from 'lucide-react';
import { AlignmentValue } from '../utils/alignment';

interface AlignmentControlsProps {
  value?: AlignmentValue;
  onChange: (alignment: AlignmentValue) => void;
  label?: string;
  includeJustify?: boolean;
  className?: string;
}

/**
 * Standardized Alignment Controls Component
 * Provides consistent alignment UI across all element settings panels
 */
export function AlignmentControls({ 
  value, 
  onChange, 
  label = "Alignment",
  includeJustify = false,
  className 
}: AlignmentControlsProps) {
  const alignmentOptions = [
    { icon: AlignLeft, value: 'left' as const, label: 'Left' },
    { icon: AlignCenter, value: 'center' as const, label: 'Center' },
    { icon: AlignRight, value: 'right' as const, label: 'Right' },
    ...(includeJustify ? [{ icon: AlignJustify, value: 'justify' as const, label: 'Justify' }] : []),
  ];

  // Handle backward compatibility - check both alignment and align
  const currentValue = value || 'center';

  return (
    <div className={className}>
      <Label className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-2 block">
        {label}
      </Label>
      <div className={`grid gap-2 ${includeJustify ? 'grid-cols-4' : 'grid-cols-3'}`}>
        {alignmentOptions.map(({ icon: Icon, value: alignValue, label: alignLabel }) => (
          <Button
            key={alignValue}
            variant="outline"
            size="sm"
            onClick={() => {
              console.log(`🎯 ${label} alignment clicked:`, alignValue);
              onChange(alignValue);
            }}
            className={cn(
              "h-10 flex flex-col items-center justify-center gap-1",
              currentValue === alignValue && "bg-blue-50 dark:bg-blue-900/30 border-blue-500"
            )}
            title={alignLabel}
          >
            <Icon size={16} />
          </Button>
        ))}
      </div>
      <p className="text-xs text-gray-500 mt-2">Current: {currentValue}</p>
    </div>
  );
}

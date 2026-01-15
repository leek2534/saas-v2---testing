"use client";



import React, { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { HexColorPicker } from 'react-colorful';
import { Pipette } from 'lucide-react';

interface EnhancedColorPickerProps {
  label: string;
  value: string;
  onChange: (color: string) => void;
  presets?: string[];
  showContrastCheck?: boolean;
  contrastWith?: string;
}

export function EnhancedColorPicker({ 
  label, 
  value, 
  onChange, 
  presets,
  showContrastCheck,
  contrastWith 
}: EnhancedColorPickerProps) {
  const [showPicker, setShowPicker] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  
  const defaultPresets = presets || [
    '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', 
    '#ec4899', '#06b6d4', '#84cc16', '#6366f1', '#f43f5e',
    '#000000', '#ffffff', '#64748b', '#94a3b8'
  ];

  // Simple contrast ratio calculation
  const getContrastRatio = (color1: string, color2: string) => {
    const getLuminance = (hex: string) => {
      const rgb = parseInt(hex.slice(1), 16);
      const r = (rgb >> 16) & 0xff;
      const g = (rgb >> 8) & 0xff;
      const b = (rgb >> 0) & 0xff;
      const [rs, gs, bs] = [r, g, b].map(c => {
        c = c / 255;
        return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
      });
      return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
    };
    
    const l1 = getLuminance(color1);
    const l2 = getLuminance(color2);
    const lighter = Math.max(l1, l2);
    const darker = Math.min(l1, l2);
    return (lighter + 0.05) / (darker + 0.05);
  };

  const contrastRatio = showContrastCheck && contrastWith 
    ? getContrastRatio(value || '#000000', contrastWith)
    : null;

  const contrastLevel = contrastRatio 
    ? contrastRatio >= 7 ? 'AAA' : contrastRatio >= 4.5 ? 'AA' : 'Fail'
    : null;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Label className="text-xs font-medium text-foreground">{label}</Label>
        {showContrastCheck && contrastLevel && (
          <span className={`text-xs px-2 py-0.5 rounded ${
            contrastLevel === 'AAA' ? 'bg-green-100 text-green-700' :
            contrastLevel === 'AA' ? 'bg-yellow-100 text-yellow-700' :
            'bg-red-100 text-red-700'
          }`}>
            {contrastLevel} ({contrastRatio?.toFixed(1)}:1)
          </span>
        )}
      </div>
      
      <div className="relative">
        <button 
          onClick={() => setShowPicker(!showPicker)}
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
          className="w-full flex items-center gap-3 px-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg hover:border-blue-400 transition-all bg-white dark:bg-gray-800 group"
        >
          <div 
            className="w-10 h-10 rounded-md border-2 border-gray-300 dark:border-gray-600 transition-transform group-hover:scale-110" 
            style={{ backgroundColor: value || '#3b82f6' }} 
          />
          <div className="flex-1 text-left">
            <span className="text-sm font-mono text-foreground block">
              {value || '#3b82f6'}
            </span>
            <span className="text-xs text-muted-foreground">Click to change</span>
          </div>
          <Pipette size={16} className="text-muted-foreground group-hover:text-primary transition-colors" />
        </button>
        
        {showPicker && (
          <>
            {/* Backdrop to close picker when clicking outside */}
            <div 
              className="fixed inset-0 z-40" 
              onClick={() => setShowPicker(false)}
            />
            
            {/* Inline dropdown picker */}
            <div className="absolute top-full left-0 right-0 mt-2 z-50 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 p-4">
              <HexColorPicker color={value || '#3b82f6'} onChange={onChange} className="w-full !h-40" />
            
              <div className="mt-3 flex gap-2">
                <Input 
                  type="text" 
                  value={value || '#3b82f6'} 
                  onChange={(e) => onChange(e.target.value)} 
                  className="text-xs font-mono flex-1" 
                  placeholder="#3b82f6" 
                />
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => {
                    navigator.clipboard.writeText(value || '#3b82f6');
                  }}
                >
                  Copy
                </Button>
              </div>
              
              <div className="mt-4">
                <Label className="text-xs text-foreground mb-2 block uppercase tracking-wide">Quick Colors</Label>
                <div className="grid grid-cols-7 gap-2">
                  {defaultPresets.map((preset) => (
                    <button
                      key={preset}
                      onClick={() => onChange(preset)}
                      className="w-full h-8 rounded-md border-2 hover:border-blue-500 transition-all hover:scale-110"
                      style={{ 
                        backgroundColor: preset,
                        borderColor: preset === value ? '#3b82f6' : '#d1d5db'
                      }}
                      title={preset}
                    />
                  ))}
                </div>
              </div>
              
              <Button 
                size="sm" 
                variant="ghost" 
                onClick={() => setShowPicker(false)} 
                className="w-full mt-3"
              >
                Done
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

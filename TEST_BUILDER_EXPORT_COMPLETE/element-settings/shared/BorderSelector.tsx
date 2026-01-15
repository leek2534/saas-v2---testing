"use client";



import React, { useState, useRef, useEffect } from 'react';
import { ALL_BORDER_STYLES, BorderStyle } from './AnimatedBorders';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { Eye } from 'lucide-react';

interface BorderSelectorProps {
  value?: string;
  onChange: (borderId: string, borderProps: any) => void;
  label?: string;
}

export function BorderSelector({ value, onChange, label = 'Border Style' }: BorderSelectorProps) {
  const [hoveredBorder, setHoveredBorder] = useState<string | null>(null);
  const [previewPosition, setPreviewPosition] = useState<{ x: number; y: number } | null>(null);
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const selectedBorder = ALL_BORDER_STYLES.find(b => b.id === value);

  const handleMouseEnter = (borderId: string, event: React.MouseEvent) => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }
    
    hoverTimeoutRef.current = setTimeout(() => {
      setHoveredBorder(borderId);
      const rect = (event.currentTarget as HTMLElement).getBoundingClientRect();
      setPreviewPosition({
        x: rect.right + 10,
        y: rect.top
      });
    }, 300); // 300ms delay before showing preview
  };

  const handleMouseLeave = () => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }
    setHoveredBorder(null);
    setPreviewPosition(null);
  };

  useEffect(() => {
    return () => {
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
      }
    };
  }, []);

  const hoveredBorderData = hoveredBorder ? ALL_BORDER_STYLES.find(b => b.id === hoveredBorder) : null;

  return (
    <div className="space-y-2 relative">
      <label className="text-xs font-medium text-foreground">{label}</label>
      <Select value={value || 'none'} onValueChange={(val) => {
        if (val === 'none') {
          onChange('', {});
        } else {
          const border = ALL_BORDER_STYLES.find(b => b.id === val);
          if (border) {
            onChange(border.id, border.props);
          }
        }
      }}>
        <SelectTrigger>
          <SelectValue placeholder="Select border style" />
        </SelectTrigger>
        <SelectContent className="max-h-[400px]">
          <SelectItem value="none">None</SelectItem>
          
          {/* Animated Borders Section */}
          <div className="px-2 py-1.5">
            <div className="text-xs font-semibold text-foreground mb-1">Animated</div>
            {ALL_BORDER_STYLES.filter(b => b.category === 'animated' || b.category === 'neon').map((border) => (
              <SelectItem
                key={border.id}
                value={border.id}
                onMouseEnter={(e) => handleMouseEnter(border.id, e)}
                onMouseLeave={handleMouseLeave}
                className="cursor-pointer relative"
              >
                <div className="flex items-center justify-between w-full">
                  <div>
                    <div className="font-medium">{border.name}</div>
                    <div className="text-xs text-muted-foreground">{border.description}</div>
                  </div>
                  <Eye size={14} className="ml-2 text-muted-foreground" />
                </div>
              </SelectItem>
            ))}
          </div>

          {/* Static Borders Section */}
          <div className="px-2 py-1.5 border-t border-gray-200 dark:border-gray-700 mt-2">
            <div className="text-xs font-semibold text-foreground mb-1">Static</div>
            {ALL_BORDER_STYLES.filter(b => b.category === 'static' || b.category === 'classic' || b.category === 'gradient').map((border) => (
              <SelectItem
                key={border.id}
                value={border.id}
                onMouseEnter={(e) => handleMouseEnter(border.id, e)}
                onMouseLeave={handleMouseLeave}
                className="cursor-pointer relative"
              >
                <div className="flex items-center justify-between w-full">
                  <div>
                    <div className="font-medium">{border.name}</div>
                    <div className="text-xs text-muted-foreground">{border.description}</div>
                  </div>
                  <Eye size={14} className="ml-2 text-muted-foreground" />
                </div>
              </SelectItem>
            ))}
          </div>
        </SelectContent>
      </Select>

      {/* Preview Modal */}
      {hoveredBorderData && previewPosition && (
        <div
          className="fixed z-[9999] bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-xl p-4 w-64 pointer-events-none"
          style={{
            left: `${previewPosition.x}px`,
            top: `${previewPosition.y}px`,
          }}
          onMouseEnter={() => setHoveredBorder(hoveredBorder)}
          onMouseLeave={handleMouseLeave}
        >
          <div className="space-y-2">
            <div className="font-semibold text-sm">{hoveredBorderData.name}</div>
            <div className="text-xs text-gray-600 dark:text-gray-400">{hoveredBorderData.description}</div>
            <div className="mt-3 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden bg-white dark:bg-gray-900">
              <div className={cn("w-full h-32 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900", hoveredBorderData.cssClass)}>
                <div className="w-full h-full flex items-center justify-center text-xs text-gray-500">
                  Preview
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


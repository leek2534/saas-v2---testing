"use client";



import React from 'react';
import { Label } from '@/components/ui/label';
import { Bold, Italic, Underline, Strikethrough } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TextStyleControlsProps {
  textTransform?: string;
  textDecoration?: string;
  fontWeight?: string;
  fontStyle?: string;
  onTransformChange: (value: string) => void;
  onDecorationChange: (decorations: string[]) => void;
  onFontWeightChange?: (value: string) => void;
  onFontStyleChange?: (value: string) => void;
}

export function TextStyleControls({
  textTransform,
  textDecoration,
  fontWeight,
  fontStyle,
  onTransformChange,
  onDecorationChange,
  onFontWeightChange,
  onFontStyleChange,
}: TextStyleControlsProps) {
  // Parse current decorations into array
  const currentDecorations = textDecoration && textDecoration !== 'none' 
    ? textDecoration.split(' ').filter(Boolean)
    : [];

  // Check if bold (font-weight > 600)
  const isBold = fontWeight && parseInt(fontWeight) > 600;
  
  // Check if italic
  const isItalic = fontStyle === 'italic';

  // Toggle decoration
  const toggleDecoration = (decoration: string) => {
    let newDecorations = [...currentDecorations];
    
    if (newDecorations.includes(decoration)) {
      // Remove if already present
      newDecorations = newDecorations.filter(d => d !== decoration);
    } else {
      // Add if not present
      newDecorations.push(decoration);
    }
    
    onDecorationChange(newDecorations);
  };

  // Check if decoration is active
  const isDecorationActive = (decoration: string) => {
    return currentDecorations.includes(decoration);
  };

  return (
    <>
      {/* Text Transform */}
      <div>
        <Label className="text-xs font-medium text-foreground mb-2 block">
          Text Transform
        </Label>
        <div className="flex gap-1">
          <button
            onClick={() => onTransformChange('none')}
            className={cn(
              "flex-1 px-3 py-2 text-xs rounded border transition-colors",
              (textTransform || 'none') === 'none'
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-card border-border hover:bg-accent"
            )}
          >
            None
          </button>
          <button
            onClick={() => onTransformChange('uppercase')}
            className={cn(
              "flex-1 px-3 py-2 text-xs rounded border transition-colors",
              textTransform === 'uppercase'
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-card border-border hover:bg-accent"
            )}
          >
            ABC
          </button>
          <button
            onClick={() => onTransformChange('lowercase')}
            className={cn(
              "flex-1 px-3 py-2 text-xs rounded border transition-colors",
              textTransform === 'lowercase'
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-card border-border hover:bg-accent"
            )}
          >
            abc
          </button>
          <button
            onClick={() => onTransformChange('capitalize')}
            className={cn(
              "flex-1 px-3 py-2 text-xs rounded border transition-colors",
              textTransform === 'capitalize'
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-card border-border hover:bg-accent"
            )}
          >
            Abc
          </button>
        </div>
      </div>

      {/* Text Style (Bold, Italic, Decorations) */}
      <div>
        <Label className="text-xs font-medium text-foreground mb-2 block">
          Text Style
        </Label>
        <div className="grid grid-cols-3 gap-1">
          {/* None - Clear all decorations */}
          <button
            onClick={() => {
              onFontWeightChange?.('400');
              onFontStyleChange?.('normal');
              onDecorationChange([]);
            }}
            className={cn(
              "px-2 py-2 text-xs rounded border transition-colors flex items-center justify-center",
              !isBold && !isItalic && currentDecorations.length === 0
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-card border-border hover:bg-accent"
            )}
            title="None"
          >
            None
          </button>

          {/* Bold */}
          <button
            onClick={() => onFontWeightChange?.(isBold ? '400' : '700')}
            className={cn(
              "px-2 py-2 text-xs rounded border transition-colors flex items-center justify-center",
              isBold
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-card border-border hover:bg-accent"
            )}
            title="Bold"
          >
            <Bold className="h-4 w-4" />
          </button>

          {/* Italic */}
          <button
            onClick={() => onFontStyleChange?.(isItalic ? 'normal' : 'italic')}
            className={cn(
              "px-2 py-2 text-xs rounded border transition-colors flex items-center justify-center",
              isItalic
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-card border-border hover:bg-accent"
            )}
            title="Italic"
          >
            <Italic className="h-4 w-4" />
          </button>

          {/* Underline */}
          <button
            onClick={() => toggleDecoration('underline')}
            className={cn(
              "px-2 py-2 text-xs rounded border transition-colors flex items-center justify-center",
              isDecorationActive('underline')
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-card border-border hover:bg-accent"
            )}
            title="Underline"
          >
            <Underline className="h-4 w-4" />
          </button>

          {/* Strikethrough */}
          <button
            onClick={() => toggleDecoration('line-through')}
            className={cn(
              "px-2 py-2 text-xs rounded border transition-colors flex items-center justify-center",
              isDecorationActive('line-through')
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-card border-border hover:bg-accent"
            )}
            title="Strikethrough"
          >
            <Strikethrough className="h-4 w-4" />
          </button>

          {/* Overline */}
          <button
            onClick={() => toggleDecoration('overline')}
            className={cn(
              "px-2 py-2 text-xs rounded border transition-colors flex items-center justify-center",
              isDecorationActive('overline')
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-card border-border hover:bg-accent"
            )}
            title="Overline"
          >
            <span className="text-xs font-semibold" style={{ textDecoration: 'overline' }}>T</span>
          </button>
        </div>
      </div>
    </>
  );
}

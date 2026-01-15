'use client';

import { createPortal } from 'react-dom';
import { useEditorStore } from '../../lib/editor/store';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Palette, Maximize2, Circle, RotateCw } from 'lucide-react';
import { useState } from 'react';

/**
 * IconToolbar - Context-specific toolbar for icon/SVG elements
 * Appears when an icon is selected
 */
export function IconToolbar() {
  const selectedIds = useEditorStore((s) => s.selectedIds);
  const elements = useEditorStore((s) => s.elements);
  const updateElement = useEditorStore((s) => s.updateElement);
  
  const elementsArray = Array.isArray(elements) ? elements : [];
  const selectedIcon = elementsArray.find(
    (el: any) => selectedIds.includes(el.id) && el.type === 'icon'
  );
  
  const [showColorPicker, setShowColorPicker] = useState(false);
  
  if (!selectedIcon) return null;
  
  const color = selectedIcon.color || '#000000';
  const size = Math.max(selectedIcon.width || 64, selectedIcon.height || 64);
  const opacity = selectedIcon.opacity !== undefined ? selectedIcon.opacity : 1;
  const rotation = selectedIcon.rotation || 0;
  
  const commonColors = [
    '#000000', '#ffffff', '#f3f4f6', '#3b82f6', '#10b981', 
    '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4'
  ];
  
  const handleSizeChange = (newSize: number) => {
    updateElement(selectedIcon.id, {
      width: newSize,
      height: newSize,
    });
  };
  
  const toolbarContainer = typeof document !== 'undefined'
    ? document.getElementById('dynamic-element-toolbar-container')
    : null;

  if (!toolbarContainer) return null;

  const toolbarContent = (
    <div className="flex items-center gap-4 animate-in fade-in duration-200">
      {/* Color */}
      <div className="relative">
        <button
          onClick={() => setShowColorPicker(!showColorPicker)}
          className="flex items-center gap-2 px-3 py-2 rounded hover:bg-muted transition-colors"
          title="Icon Color"
        >
          <Palette size={16} />
          <div
            className="w-6 h-6 rounded border-2 border-border"
            style={{ backgroundColor: color }}
          />
        </button>
        
        {showColorPicker && (
          <div className="absolute top-full left-0 mt-2 bg-card border border-border rounded-lg shadow-xl p-3 z-50">
            <div className="grid grid-cols-5 gap-2 mb-3">
              {commonColors.map((c) => (
                <button
                  key={c}
                  onClick={() => {
                    updateElement(selectedIcon.id, { color: c });
                    setShowColorPicker(false);
                  }}
                  className="w-8 h-8 rounded border-2 border-border hover:scale-110 transition-transform"
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
            <Input
              type="color"
              value={color}
              onChange={(e) => updateElement(selectedIcon.id, { color: e.target.value })}
              className="w-full h-10"
            />
          </div>
        )}
      </div>
      
      <div className="w-px h-8 bg-border" />
      
      {/* Size */}
      <div className="flex items-center gap-2 min-w-[150px]">
        <Maximize2 size={16} className="text-muted-foreground" />
        <Slider
          value={[size]}
          onValueChange={([value]) => handleSizeChange(value)}
          min={16}
          max={256}
          step={4}
          className="flex-1"
        />
        <span className="text-sm text-muted-foreground w-12 text-right">{size}px</span>
      </div>
      
      <div className="w-px h-8 bg-border" />
      
      {/* Opacity */}
      <div className="flex items-center gap-2 min-w-[120px]">
        <Circle size={16} className="text-muted-foreground" style={{ opacity: 0.5 }} />
        <Slider
          value={[opacity * 100]}
          onValueChange={([value]) => updateElement(selectedIcon.id, { opacity: value / 100 })}
          min={0}
          max={100}
          step={1}
          className="flex-1"
        />
        <span className="text-sm text-muted-foreground w-10 text-right">{Math.round(opacity * 100)}%</span>
      </div>
      
      <div className="w-px h-8 bg-border" />
      
      {/* Rotation */}
      <div className="flex items-center gap-2 min-w-[120px]">
        <RotateCw size={16} className="text-muted-foreground" />
        <Slider
          value={[rotation]}
          onValueChange={([value]) => updateElement(selectedIcon.id, { rotation: value })}
          min={0}
          max={360}
          step={15}
          className="flex-1"
        />
        <span className="text-sm text-muted-foreground w-10 text-right">{rotation}°</span>
      </div>
    </div>
  );

  return createPortal(toolbarContent, toolbarContainer);
}

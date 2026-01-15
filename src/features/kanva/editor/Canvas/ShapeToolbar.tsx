'use client';

import { createPortal } from 'react-dom';
import { useEditorStore } from '../../lib/editor/store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Paintbrush, Square, Circle, Minus } from 'lucide-react';
import { useState } from 'react';

/**
 * ShapeToolbar - Context-specific toolbar for shape elements
 * Appears when a shape (rectangle, circle, triangle) is selected
 */
export function ShapeToolbar() {
  const selectedIds = useEditorStore((s) => s.selectedIds);
  const elements = useEditorStore((s) => s.elements);
  const updateElement = useEditorStore((s) => s.updateElement);
  
  const elementsArray = Array.isArray(elements) ? elements : [];
  const selectedShape = elementsArray.find(
    (el: any) => selectedIds.includes(el.id) && el.type === 'shape'
  );
  
  const [showFillPicker, setShowFillPicker] = useState(false);
  const [showStrokePicker, setShowStrokePicker] = useState(false);
  
  if (!selectedShape) return null;
  
  const fill = selectedShape.fill || '#3b82f6';
  const stroke = selectedShape.stroke || '#1e40af';
  const strokeWidth = selectedShape.strokeWidth || 2;
  const opacity = selectedShape.opacity !== undefined ? selectedShape.opacity : 1;
  
  const commonColors = [
    '#000000', '#ffffff', '#f3f4f6', '#3b82f6', '#10b981', 
    '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4'
  ];
  
  const toolbarContainer = typeof document !== 'undefined'
    ? document.getElementById('dynamic-element-toolbar-container')
    : null;

  if (!toolbarContainer) return null;

  const toolbarContent = (
    <div className="flex items-center gap-4 animate-in fade-in duration-200">
      {/* Fill Color */}
      <div className="relative">
        <button
          onClick={() => {
            setShowFillPicker(!showFillPicker);
            setShowStrokePicker(false);
          }}
          className="flex items-center gap-2 px-3 py-2 rounded hover:bg-muted transition-colors"
          title="Fill Color"
        >
          <Paintbrush size={16} />
          <div
            className="w-6 h-6 rounded border-2 border-border"
            style={{ backgroundColor: fill }}
          />
        </button>
        
        {showFillPicker && (
          <div className="absolute top-full left-0 mt-2 bg-card border border-border rounded-lg shadow-xl p-3 z-50">
            <div className="grid grid-cols-5 gap-2 mb-3">
              {commonColors.map((color) => (
                <button
                  key={color}
                  onClick={() => {
                    updateElement(selectedShape.id, { fill: color });
                    setShowFillPicker(false);
                  }}
                  className="w-8 h-8 rounded border-2 border-border hover:scale-110 transition-transform"
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
            <Input
              type="color"
              value={fill}
              onChange={(e) => updateElement(selectedShape.id, { fill: e.target.value })}
              className="w-full h-10"
            />
          </div>
        )}
      </div>
      
      <div className="w-px h-8 bg-border" />
      
      {/* Stroke Color */}
      <div className="relative">
        <button
          onClick={() => {
            setShowStrokePicker(!showStrokePicker);
            setShowFillPicker(false);
          }}
          className="flex items-center gap-2 px-3 py-2 rounded hover:bg-muted transition-colors"
          title="Stroke Color"
        >
          <Square size={16} />
          <div
            className="w-6 h-6 rounded border-2"
            style={{ borderColor: stroke, backgroundColor: 'transparent' }}
          />
        </button>
        
        {showStrokePicker && (
          <div className="absolute top-full left-0 mt-2 bg-card border border-border rounded-lg shadow-xl p-3 z-50">
            <div className="grid grid-cols-5 gap-2 mb-3">
              {commonColors.map((color) => (
                <button
                  key={color}
                  onClick={() => {
                    updateElement(selectedShape.id, { stroke: color });
                    setShowStrokePicker(false);
                  }}
                  className="w-8 h-8 rounded border-2 hover:scale-110 transition-transform"
                  style={{ borderColor: color, backgroundColor: 'transparent' }}
                />
              ))}
            </div>
            <Input
              type="color"
              value={stroke}
              onChange={(e) => updateElement(selectedShape.id, { stroke: e.target.value })}
              className="w-full h-10"
            />
          </div>
        )}
      </div>
      
      <div className="w-px h-8 bg-border" />
      
      {/* Stroke Width */}
      <div className="flex items-center gap-2 min-w-[150px]">
        <Minus size={16} className="text-muted-foreground" />
        <Slider
          value={[strokeWidth]}
          onValueChange={([value]) => updateElement(selectedShape.id, { strokeWidth: value })}
          min={0}
          max={20}
          step={1}
          className="flex-1"
        />
        <span className="text-sm text-muted-foreground w-8 text-right">{strokeWidth}px</span>
      </div>
      
      <div className="w-px h-8 bg-border" />
      
      {/* Opacity */}
      <div className="flex items-center gap-2 min-w-[150px]">
        <Circle size={16} className="text-muted-foreground" style={{ opacity: 0.5 }} />
        <Slider
          value={[opacity * 100]}
          onValueChange={([value]) => updateElement(selectedShape.id, { opacity: value / 100 })}
          min={0}
          max={100}
          step={1}
          className="flex-1"
        />
        <span className="text-sm text-muted-foreground w-10 text-right">{Math.round(opacity * 100)}%</span>
      </div>
    </div>
  );

  return createPortal(toolbarContent, toolbarContainer);
}

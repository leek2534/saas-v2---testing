'use client';

import React, { useState } from 'react';
import { useEditorStore } from '../lib/editor/store';
import type { EditorElement } from '../lib/editor/types';
import { FontSelector } from '../components/FontSelector';
import { Type, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function PropertiesPanel() {
  const elements = useEditorStore((state) => state.elements);
  const selectedIds = useEditorStore((state) => state.selectedIds);
  const updateElement = useEditorStore((state) => state.updateElement);
  const [showFontPicker, setShowFontPicker] = useState(false);

  const selectedElement =
    selectedIds.length === 1
      ? elements.find((el) => el.id === selectedIds[0])
      : null;

  if (!selectedElement) {
    return (
      <div className="w-64 bg-card border-l border-border p-4">
        <h3 className="font-semibold mb-4">Properties</h3>
      </div>
    );
  }

  const handleUpdate = (updates: Partial<EditorElement>) => {
    updateElement(selectedElement.id, updates);
  };

  return (
    <div className="w-64 bg-card border-l border-border p-4 overflow-y-auto">
      <h3 className="font-semibold mb-4">Properties</h3>

      <div className="space-y-4">
        {/* Position */}
        <div>
          <label className="text-sm font-medium mb-2 block text-gray-300">Position</label>
          <div className="grid grid-cols-2 gap-2">
            <input
              type="number"
              value={Math.round(selectedElement.x)}
              onChange={(e) =>
                handleUpdate({ x: parseFloat(e.target.value) || 0 })
              }
              className="px-2 py-1 border border-gray-700 rounded text-sm bg-gray-800 text-white"
              placeholder="X"
            />
            <input
              type="number"
              value={Math.round(selectedElement.y)}
              onChange={(e) =>
                handleUpdate({ y: parseFloat(e.target.value) || 0 })
              }
              className="px-2 py-1 border border-gray-700 rounded text-sm bg-gray-800 text-white"
              placeholder="Y"
            />
          </div>
        </div>

        {/* Size */}
        <div>
          <label className="text-sm font-medium mb-2 block text-gray-300">Size</label>
          <div className="grid grid-cols-2 gap-2">
            <input
              type="number"
              value={Math.round(selectedElement.width)}
              onChange={(e) =>
                handleUpdate({ width: parseFloat(e.target.value) || 0 })
              }
              className="px-2 py-1 border border-gray-700 rounded text-sm bg-gray-800 text-white"
              placeholder="Width"
            />
            <input
              type="number"
              value={Math.round(selectedElement.height)}
              onChange={(e) =>
                handleUpdate({ height: parseFloat(e.target.value) || 0 })
              }
              className="px-2 py-1 border border-gray-700 rounded text-sm bg-gray-800 text-white"
              placeholder="Height"
            />
          </div>
        </div>

        {/* Rotation */}
        <div>
          <label className="text-sm font-medium mb-2 block text-gray-300">Rotation</label>
          <input
            type="number"
            value={Math.round(selectedElement.rotation)}
            onChange={(e) =>
              handleUpdate({ rotation: parseFloat(e.target.value) || 0 })
            }
            className="w-full px-2 py-1 border border-gray-700 rounded text-sm bg-gray-800 text-white"
            min={0}
            max={360}
            step={1}
          />
        </div>

        {/* Opacity */}
        <div>
          <label className="text-sm font-medium mb-2 block text-gray-300">Opacity</label>
          <input
            type="range"
            min={0}
            max={1}
            step={0.01}
            value={selectedElement.opacity ?? 1}
            onChange={(e) =>
              handleUpdate({ opacity: parseFloat(e.target.value) })
            }
            className="w-full"
          />
          <span className="text-xs text-gray-400">
            {Math.round((selectedElement.opacity ?? 1) * 100)}%
          </span>
        </div>

        {/* Type-specific properties */}
        {selectedElement.type === 'text' && (
          <>
            <div>
              <label className="text-sm font-medium mb-2 block text-gray-300">Text</label>
              <textarea
                value={selectedElement.text}
                onChange={(e) => handleUpdate({ text: e.target.value })}
                className="w-full px-2 py-1 border border-gray-700 rounded text-sm bg-gray-800 text-white"
                rows={3}
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block text-gray-300">Font Family</label>
              <div className="relative">
                <Button
                  variant="outline"
                  onMouseDown={(e) => {
                    e.preventDefault(); // CRITICAL: Prevent focus loss
                    e.stopPropagation();
                    setShowFontPicker(!showFontPicker);
                  }}
                  className="w-full justify-between bg-gray-800 border-gray-700 text-white hover:bg-gray-700"
                  style={{ fontFamily: selectedElement.fontFamily }}
                >
                  <div className="flex items-center gap-2">
                    <Type size={16} />
                    <span className="text-sm">{selectedElement.fontFamily || 'Inter'}</span>
                  </div>
                  <ChevronDown size={14} />
                </Button>
                
                {showFontPicker && (
                  <>
                    <div 
                      className="fixed inset-0 z-40" 
                      onMouseDown={(e) => {
                        e.preventDefault();
                        setShowFontPicker(false);
                      }}
                    />
                    <div 
                      className="absolute top-full left-0 mt-2 z-50 bg-gray-900 border border-gray-700 rounded-lg shadow-xl w-[calc(100vw-320px)] max-w-[400px] max-h-[500px] overflow-hidden"
                      onMouseDown={(e) => e.stopPropagation()}
                    >
                      <FontSelector
                        selectedFont={selectedElement.fontFamily || 'Inter'}
                        onFontSelect={(font) => {
                          handleUpdate({ fontFamily: font });
                          setShowFontPicker(false);
                        }}
                      />
                    </div>
                  </>
                )}
              </div>
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block text-gray-300">Font Size</label>
              <input
                type="number"
                value={selectedElement.fontSize}
                onChange={(e) =>
                  handleUpdate({ fontSize: parseFloat(e.target.value) || 12 })
                }
                className="w-full px-2 py-1 border border-gray-700 rounded text-sm bg-gray-800 text-white"
                min={8}
                max={200}
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block text-gray-300">Color</label>
              <input
                type="color"
                value={selectedElement.fill}
                onChange={(e) => handleUpdate({ fill: e.target.value })}
                className="w-full h-10 border border-gray-700 rounded bg-gray-800"
              />
            </div>
          </>
        )}

        {(selectedElement.type === 'shape' || selectedElement.type === 'image') && (
          <>
            {selectedElement.type === 'shape' && (
              <div>
                <label className="text-sm font-medium mb-2 block text-gray-300">Fill Color</label>
                <input
                  type="color"
                  value={selectedElement.fill || '#3b82f6'}
                  onChange={(e) => handleUpdate({ fill: e.target.value })}
                  className="w-full h-10 border border-gray-700 rounded bg-gray-800"
                />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}


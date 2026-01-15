'use client';

import React, { useRef, useState, useEffect } from 'react';
import { useEditorStore } from '../../lib/editor/store';
import {
  ImageIcon,
  Palette,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Crop,
  FlipHorizontal,
  FlipVertical,
  Layers,
  Move,
  Paintbrush,
  Type,
  Square,
  Circle,
  Triangle,
  ArrowUp,
  ArrowDown,
  ChevronUp,
  ChevronDown,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { getNextZIndex as getNextZIndexUtil } from '../../lib/editor/utils';
import { cn } from '../../lib/utils';
import type { EditorElement } from '../../lib/editor/types';

interface CanvasToolbarProps {
  rightSidebarPanel?: 'position' | 'layers' | null;
  onToggleRightSidebar?: (panel: 'position' | 'layers') => void;
}

/**
 * CanvasToolbar - Fixed toolbar above canvas area
 * Context-aware toolbar that changes based on selected element type
 * Inspired by Canva but with unique design to avoid copyright issues
 */
export function CanvasToolbar({ rightSidebarPanel, onToggleRightSidebar }: CanvasToolbarProps = {}) {
  const selectedIds = useEditorStore((s) => s.selectedIds);
  const elements = useEditorStore((s) => s.elements);
  const canvas = useEditorStore((s) => s.canvas);
  const updateElement = useEditorStore((s) => s.updateElement);
  const addElement = useEditorStore((s) => s.addElement);
  const addAsset = useEditorStore((s) => s.addAsset);
  const bringToFront = useEditorStore((s) => s.bringToFront);
  const sendToBack = useEditorStore((s) => s.sendToBack);
  const bringForward = useEditorStore((s) => s.bringForward);
  const sendBackward = useEditorStore((s) => s.sendBackward);
  const pushHistory = useEditorStore((s) => s.pushHistory);
  const getStateSnapshot = useEditorStore((s) => s.getStateSnapshot);

  // Ensure elements is always an array
  const elementsArray = Array.isArray(elements) ? elements : [];
  const selectedElements = elementsArray.filter(el => selectedIds.includes(el.id));
  const selectedElement = selectedElements.length === 1 ? selectedElements[0] : null;


  // Determine toolbar context based on selected element
  const getToolbarContext = () => {
    if (!selectedElement) return 'none';
    return selectedElement.type;
  };

  const context = getToolbarContext();

  // Render layer operations (reusable across all contexts)
  const renderLayerOperations = () => {
    if (!selectedElement) return null;

    // Check if element is at top or bottom
    const sortedElements = [...elementsArray].sort((a, b) => (b.zIndex || 0) - (a.zIndex || 0));
    const elementIndex = sortedElements.findIndex(el => el.id === selectedElement.id);
    const isTop = elementIndex === 0;
    const isBottom = elementIndex === sortedElements.length - 1;

    return (
      <>
        <Separator orientation="vertical" className="h-6" />
        
        {/* Layer Operations */}
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => bringToFront(selectedElement.id)}
            disabled={isTop}
            className="h-9 w-9 p-0"
            title="Bring to Front (Cmd+Shift+])"
          >
            <ArrowUp className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => bringForward(selectedElement.id)}
            disabled={isTop}
            className="h-9 w-9 p-0"
            title="Bring Forward (Cmd+])"
          >
            <ChevronUp className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => sendBackward(selectedElement.id)}
            disabled={isBottom}
            className="h-9 w-9 p-0"
            title="Send Backward (Cmd+[)"
          >
            <ChevronDown className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => sendToBack(selectedElement.id)}
            disabled={isBottom}
            className="h-9 w-9 p-0"
            title="Send to Back (Cmd+Shift+[)"
          >
            <ArrowDown className="h-4 w-4" />
          </Button>
        </div>
      </>
    );
  };

  // Handle image replace/edit
  const handleImageReplace = () => {
    if (!selectedElement || selectedElement.type !== 'image') return;

    // Create file input
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.multiple = false;

    input.onchange = async (e: any) => {
      const file = e.target.files?.[0];
      if (!file) return;

      // Validate file size (50MB limit)
      if (file.size > 50 * 1024 * 1024) {
        alert('File too large (max 50MB)');
        return;
      }

      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file');
        return;
      }

      try {
        // Option 1: Upload to server (for production)
        // Uncomment this section if you want to upload to server
        /*
        const formData = new FormData();
        formData.append('file', file);
        formData.append('folder', 'canvas');

        const response = await fetch('/api/media/upload', {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) {
          throw new Error('Upload failed');
        }

        const result = await response.json();
        if (result.success && result.file?.url) {
          // Update element with new image URL
          updateElement(selectedElement.id, { src: result.file.url });
          pushHistory(getStateSnapshot());
          return;
        }
        */

        // Option 2: Use FileReader for instant preview (works offline, simpler)
        const reader = new FileReader();
        reader.onload = (event: any) => {
          const imageUrl = event.target.result;
          
          // Save as asset
          const asset = {
            id: `asset-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            src: imageUrl,
            thumbnail: imageUrl,
                    type: (file.type === 'image/gif' ? 'gif' : file.type === 'image/svg+xml' ? 'svg' : 'image') as 'image' | 'gif' | 'svg',
            uploadedAt: new Date().toISOString(),
            tags: [],
            metadata: {
              name: file.name,
              size: file.size,
              mimeType: file.type,
            },
          };
          addAsset(asset);
          
          // Load image to get dimensions
          const img = new Image();
          img.onload = () => {
            // Calculate new dimensions maintaining aspect ratio
            const currentWidth = selectedElement.width;
            const currentHeight = selectedElement.height;
            const aspectRatio = img.width / img.height;
            
            let newWidth = currentWidth;
            let newHeight = currentWidth / aspectRatio;
            
            // If height exceeds current height, scale by height instead
            if (newHeight > currentHeight) {
              newHeight = currentHeight;
              newWidth = currentHeight * aspectRatio;
            }

            // Update element with new image
            updateElement(selectedElement.id, {
              src: imageUrl,
              width: newWidth,
              height: newHeight,
              originalMeta: {
                width: img.width,
                height: img.height,
              },
            });
            
            pushHistory(getStateSnapshot());
          };
          img.onerror = () => {
            alert('Failed to load image');
          };
          img.src = imageUrl;
        };
        reader.onerror = () => {
          alert('Failed to read file');
        };
        reader.readAsDataURL(file);
      } catch (error) {
        console.error('Upload error:', error);
        alert('Failed to upload image. Please try again.');
      }
    };

    input.click();
  };

  // Handle color change
  const handleColorChange = (color: string) => {
    if (!selectedElement) return;
    
    if (selectedElement.type === 'text') {
      updateElement(selectedElement.id, { fill: color });
    } else if (selectedElement.type === 'shape') {
      updateElement(selectedElement.id, { fill: color });
    } else if (selectedElement.type === 'icon') {
      updateElement(selectedElement.id, { fill: color });
    }
    
    pushHistory(getStateSnapshot());
  };

  // Handle text alignment
  const handleTextAlign = (align: 'left' | 'center' | 'right') => {
    if (!selectedElement || selectedElement.type !== 'text') return;
    updateElement(selectedElement.id, { align });
    pushHistory(getStateSnapshot());
  };

  // Handle flip (only for images)
  const handleFlip = (direction: 'horizontal' | 'vertical') => {
    if (!selectedElement || selectedElement.type !== 'image') return;
    
    const imageElement = selectedElement as any;
    const currentFlip = imageElement.flip || { x: false, y: false };
    const newFlip = {
      x: direction === 'horizontal' ? !currentFlip.x : currentFlip.x,
      y: direction === 'vertical' ? !currentFlip.y : currentFlip.y,
    };
    
    updateElement(selectedElement.id, { flip: newFlip });
    pushHistory(getStateSnapshot());
  };

  // Handle opacity change
  const handleOpacityChange = (opacity: number) => {
    if (!selectedElement) return;
    updateElement(selectedElement.id, { opacity: opacity / 100 });
    pushHistory(getStateSnapshot());
  };

  // Handle crop (placeholder)
  const handleCrop = () => {
    console.log('Crop tool');
    // TODO: Implement crop functionality
  };

  // Handle adding new image
  const handleAddImage = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.multiple = false;

    input.onchange = async (e: any) => {
      const file = e.target.files?.[0];
      if (!file) return;

      // Validate file size (50MB limit)
      if (file.size > 50 * 1024 * 1024) {
        alert('File too large (max 50MB)');
        return;
      }

      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file');
        return;
      }

      try {
        const reader = new FileReader();
        reader.onload = (event: any) => {
          const imageUrl = event.target.result;
          
          // Save as asset
          const asset = {
            id: `asset-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            src: imageUrl,
            thumbnail: imageUrl,
                    type: (file.type === 'image/gif' ? 'gif' : file.type === 'image/svg+xml' ? 'svg' : 'image') as 'image' | 'gif' | 'svg',
            uploadedAt: new Date().toISOString(),
            tags: [],
            metadata: {
              name: file.name,
              size: file.size,
              mimeType: file.type,
            },
          };
          addAsset(asset);
          
          // Load image to get dimensions
          const img = new Image();
          img.onload = () => {
            // Calculate size to fit canvas (max 400px)
            const maxWidth = 400;
            const maxHeight = 400;
            let width = img.width;
            let height = img.height;

            if (width > maxWidth || height > maxHeight) {
              const ratio = Math.min(maxWidth / width, maxHeight / height);
              width = width * ratio;
              height = height * ratio;
            }

            // Create new image element
            const newImage = {
              id: `image-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
              type: 'image' as const,
              x: canvas.width / 2 - width / 2,
              y: canvas.height / 2 - height / 2,
              width,
              height,
              rotation: 0,
              zIndex: getNextZIndexUtil(elementsArray),
              visible: true,
              src: imageUrl,
              originalMeta: {
                width: img.width,
                height: img.height,
              },
            };
            
            addElement(newImage);
            pushHistory(getStateSnapshot());
          };
          img.onerror = () => {
            alert('Failed to load image');
          };
          img.src = imageUrl;
        };
        reader.onerror = () => {
          alert('Failed to read file');
        };
        reader.readAsDataURL(file);
      } catch (error) {
        console.error('Upload error:', error);
        alert('Failed to upload image. Please try again.');
      }
    };

    input.click();
  };

  // Render toolbar based on context
  const renderToolbarContent = () => {
    if (context === 'none') {
      return (
        <>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleAddImage}
            className="h-9 px-3 gap-2 hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <ImageIcon className="h-4 w-4" />
            <span className="text-sm">Add Image</span>
          </Button>
          <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 px-4">
            <span>or select an element to edit</span>
          </div>
        </>
      );
    }

    if (context === 'image') {
      return (
        <>
          {/* Replace Image */}
          <Button
            variant="ghost"
            size="sm"
            onClick={handleImageReplace}
            className="h-9 px-3 gap-2 hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <ImageIcon className="h-4 w-4" />
            <span className="text-sm">Replace</span>
          </Button>

          <Separator orientation="vertical" className="h-6" />

          {/* Crop */}
          <Button
            variant="ghost"
            size="sm"
            onClick={handleCrop}
            className="h-9 px-3 gap-2 hover:bg-gray-100 dark:hover:bg-gray-800"
            title="Crop"
          >
            <Crop className="h-4 w-4" />
            <span className="text-sm">Crop</span>
          </Button>

          {/* Flip */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleFlip('horizontal')}
            className="h-9 px-3 gap-2 hover:bg-gray-100 dark:hover:bg-gray-800"
            title="Flip Horizontal"
          >
            <FlipHorizontal className="h-4 w-4" />
            <span className="text-sm">Flip H</span>
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleFlip('vertical')}
            className="h-9 px-3 gap-2 hover:bg-gray-100 dark:hover:bg-gray-800"
            title="Flip Vertical"
          >
            <FlipVertical className="h-4 w-4" />
            <span className="text-sm">Flip V</span>
          </Button>

          <Separator orientation="vertical" className="h-6" />

          {/* Opacity */}
          <div className="flex items-center gap-2 px-2">
            <Layers className="h-4 w-4 text-gray-500 dark:text-gray-400" />
            <input
              type="range"
              min="0"
              max="100"
              value={((selectedElement?.opacity ?? 1) * 100)}
              onChange={(e) => handleOpacityChange(Number(e.target.value))}
              className="w-20 h-1.5 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer"
            />
            <span className="text-xs text-gray-600 dark:text-gray-400 w-10">
              {Math.round((selectedElement?.opacity ?? 1) * 100)}%
            </span>
          </div>

          <Separator orientation="vertical" className="h-6" />

        </>
      );
    }

    if (context === 'text') {
      const textElement = selectedElement as any;
      return (
        <>
          {/* Text Alignment */}
          <div className="flex items-center gap-1">
            <Button
              variant={textElement.align === 'left' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => handleTextAlign('left')}
              className="h-9 w-9 p-0"
              title="Align Left"
            >
              <AlignLeft className="h-4 w-4" />
            </Button>
            <Button
              variant={textElement.align === 'center' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => handleTextAlign('center')}
              className="h-9 w-9 p-0"
              title="Align Center"
            >
              <AlignCenter className="h-4 w-4" />
            </Button>
            <Button
              variant={textElement.align === 'right' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => handleTextAlign('right')}
              className="h-9 w-9 p-0"
              title="Align Right"
            >
              <AlignRight className="h-4 w-4" />
            </Button>
          </div>

          <Separator orientation="vertical" className="h-6" />

          {/* Color Picker */}
          <div className="flex items-center gap-2">
            <Palette className="h-4 w-4 text-gray-500 dark:text-gray-400" />
            <input
              type="color"
              value={textElement.fill || '#000000'}
              onChange={(e) => handleColorChange(e.target.value)}
              className="w-8 h-8 rounded border border-gray-300 dark:border-gray-600 cursor-pointer"
              title="Text Color"
            />
          </div>

          <Separator orientation="vertical" className="h-6" />

          {/* Font Size */}
          <div className="flex items-center gap-2 px-2">
            <Type className="h-4 w-4 text-gray-500 dark:text-gray-400" />
            <input
              type="number"
              value={textElement.fontSize || 16}
              onChange={(e) => {
                if (!selectedElement) return;
                const size = Math.max(8, Math.min(200, Number(e.target.value)));
                updateElement(selectedElement.id, { fontSize: size });
                pushHistory(getStateSnapshot());
              }}
              className="w-16 h-8 px-2 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800"
              min="8"
              max="200"
            />
            <span className="text-xs text-gray-500 dark:text-gray-400">px</span>
          </div>

          <Separator orientation="vertical" className="h-6" />

          {/* Opacity */}
          <div className="flex items-center gap-2 px-2">
            <Layers className="h-4 w-4 text-gray-500 dark:text-gray-400" />
            <input
              type="range"
              min="0"
              max="100"
              value={((selectedElement?.opacity ?? 1) * 100)}
              onChange={(e) => handleOpacityChange(Number(e.target.value))}
              className="w-20 h-1.5 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer"
            />
            <span className="text-xs text-gray-600 dark:text-gray-400 w-10">
              {Math.round((selectedElement?.opacity ?? 1) * 100)}%
            </span>
          </div>

          <Separator orientation="vertical" className="h-6" />


          {/* Layer Operations */}
          {renderLayerOperations()}
        </>
      );
    }

    if (context === 'shape') {
      const shapeElement = selectedElement as any;
      return (
        <>
          {/* Shape Type Indicator */}
          <div className="flex items-center gap-2 px-2">
            {shapeElement.shapeType === 'rectangle' && <Square className="h-4 w-4 text-gray-500 dark:text-gray-400" />}
            {shapeElement.shapeType === 'circle' && <Circle className="h-4 w-4 text-gray-500 dark:text-gray-400" />}
            {shapeElement.shapeType === 'triangle' && <Triangle className="h-4 w-4 text-gray-500 dark:text-gray-400" />}
            <span className="text-sm text-gray-600 dark:text-gray-400 capitalize">
              {shapeElement.shapeType || 'Shape'}
            </span>
          </div>

          <Separator orientation="vertical" className="h-6" />

          {/* Fill Color */}
          <div className="flex items-center gap-2">
            <Paintbrush className="h-4 w-4 text-gray-500 dark:text-gray-400" />
            <input
              type="color"
              value={shapeElement.fill || '#000000'}
              onChange={(e) => handleColorChange(e.target.value)}
              className="w-8 h-8 rounded border border-gray-300 dark:border-gray-600 cursor-pointer"
              title="Fill Color"
            />
          </div>

          <Separator orientation="vertical" className="h-6" />

          {/* Opacity */}
          <div className="flex items-center gap-2 px-2">
            <Layers className="h-4 w-4 text-gray-500 dark:text-gray-400" />
            <input
              type="range"
              min="0"
              max="100"
              value={((selectedElement?.opacity ?? 1) * 100)}
              onChange={(e) => handleOpacityChange(Number(e.target.value))}
              className="w-20 h-1.5 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer"
            />
            <span className="text-xs text-gray-600 dark:text-gray-400 w-10">
              {Math.round((selectedElement?.opacity ?? 1) * 100)}%
            </span>
          </div>

          <Separator orientation="vertical" className="h-6" />


          {/* Layer Operations */}
          {renderLayerOperations()}
        </>
      );
    }

    if (context === 'icon') {
      return (
        <>
          {/* Icon Color */}
          <div className="flex items-center gap-2">
            <Palette className="h-4 w-4 text-gray-500 dark:text-gray-400" />
            <input
              type="color"
              value={(selectedElement as any).fill || '#000000'}
              onChange={(e) => handleColorChange(e.target.value)}
              className="w-8 h-8 rounded border border-gray-300 dark:border-gray-600 cursor-pointer"
              title="Icon Color"
            />
          </div>

          <Separator orientation="vertical" className="h-6" />

          {/* Opacity */}
          <div className="flex items-center gap-2 px-2">
            <Layers className="h-4 w-4 text-gray-500 dark:text-gray-400" />
            <input
              type="range"
              min="0"
              max="100"
              value={((selectedElement?.opacity ?? 1) * 100)}
              onChange={(e) => handleOpacityChange(Number(e.target.value))}
              className="w-20 h-1.5 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer"
            />
            <span className="text-xs text-gray-600 dark:text-gray-400 w-10">
              {Math.round((selectedElement?.opacity ?? 1) * 100)}%
            </span>
          </div>

          <Separator orientation="vertical" className="h-6" />


          {/* Layer Operations */}
          {renderLayerOperations()}
        </>
      );
    }

    // Default toolbar for other element types
    return (
      <>
        <Separator orientation="vertical" className="h-6" />

        {/* Opacity */}
        <div className="flex items-center gap-2 px-2">
          <Layers className="h-4 w-4 text-gray-500 dark:text-gray-400" />
          <input
            type="range"
            min="0"
            max="100"
            value={((selectedElement?.opacity ?? 1) * 100)}
            onChange={(e) => handleOpacityChange(Number(e.target.value))}
            className="w-20 h-1.5 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer"
          />
          <span className="text-xs text-gray-600 dark:text-gray-400 w-10">
            {Math.round((selectedElement?.opacity ?? 1) * 100)}%
          </span>
        </div>

        <Separator orientation="vertical" className="h-6" />

        {/* Layer Operations */}
        {renderLayerOperations()}
      </>
    );
  };

  return (
    <div className="flex flex-col flex-shrink-0">
      {/* Main Toolbar */}
      <div className="h-14 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 flex items-center px-4 flex-shrink-0 shadow-sm">
        <div className="flex items-center gap-2 w-full overflow-x-auto scrollbar-hide">
          {renderToolbarContent()}
          
          {/* Right Sidebar Toggles - Always visible */}
          {onToggleRightSidebar && (
            <>
              <div className="ml-auto" />
              <Separator orientation="vertical" className="h-6" />
              <Button
                variant={rightSidebarPanel === 'position' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => onToggleRightSidebar('position')}
                className="h-9 px-3 gap-2 hover:bg-gray-100 dark:hover:bg-gray-800"
                title="Position & Alignment"
              >
                <Move className="h-4 w-4" />
                <span className="text-sm">Position</span>
              </Button>
              <Button
                variant={rightSidebarPanel === 'layers' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => onToggleRightSidebar('layers')}
                className="h-9 px-3 gap-2 hover:bg-gray-100 dark:hover:bg-gray-800"
                title="Layers"
              >
                <Layers className="h-4 w-4" />
                <span className="text-sm">Layers</span>
              </Button>
            </>
          )}
        </div>
      </div>

    </div>
  );
}


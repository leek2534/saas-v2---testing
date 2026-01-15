'use client';

import React, { useRef, useEffect, useState } from 'react';
import { useEditorStore } from '../../lib/editor/store';
import { CanvasElement } from './CanvasElement';
import { exportToPNG } from '../../lib/editor/canvasExport';
import { CanvasGrid } from './CanvasGrid';
import { EnhancedAlignmentGuides } from './EnhancedAlignmentGuides';
import { MarqueeSelection } from './MarqueeSelection';
import { DrawingOverlay } from './DrawingOverlay';

interface ArtboardProps {
  animatedSize?: { width: number; height: number };
}

/**
 * Artboard - The fixed-size design surface
 * Contains all canvas elements
 * Has a white background with shadow (Canva-style)
 */
export function Artboard({ animatedSize }: ArtboardProps = {}) {
  const artboardRef = useRef<HTMLDivElement>(null);
  const canvas = useEditorStore((s) => s.canvas);
  
  // Use animated size if provided, otherwise use canvas size
  const displayWidth = animatedSize?.width ?? canvas.width;
  const displayHeight = animatedSize?.height ?? canvas.height;
  const elements = useEditorStore((s) => s.elements);
  const selectedIds = useEditorStore((s) => s.selectedIds);
  const clearSelection = useEditorStore((s) => s.clearSelection);
  const activeGuides = useEditorStore((s) => s.activeGuides);
  const alignmentBadge = useEditorStore((s) => s.alignmentBadge);
  const [showGrid, setShowGrid] = useState(false);
  
  // Listen for grid toggle events
  useEffect(() => {
    const handleToggleGrid = () => setShowGrid(prev => !prev);
    window.addEventListener('kanva-toggle-grid', handleToggleGrid);
    return () => window.removeEventListener('kanva-toggle-grid', handleToggleGrid);
  }, []);

  // Ensure elements is always an array (safety check for hydration/initialization)
  const elementsArray = Array.isArray(elements) ? elements : [];
  
  // Debug: Log elements count
  useEffect(() => {
    if (elementsArray.length > 0) {
      console.log('[Artboard] Rendering', elementsArray.length, 'elements:', elementsArray.map(el => ({ id: el.id, type: el.type, x: el.x, y: el.y, visible: el.visible })));
    }
  }, [elementsArray.length]);
  
  // Filter elements that are within canvas bounds
  const isElementInBounds = (element: any) => {
    const elementRight = element.x + (element.width || 0);
    const elementBottom = element.y + (element.height || 0);
    
    // Element is out of bounds if:
    // - Completely to the left (right edge < 0)
    // - Completely to the right (left edge > canvas width)
    // - Completely above (bottom edge < 0)
    // - Completely below (top edge > canvas height)
    const isOutOfBounds = 
      elementRight < 0 || 
      element.x > canvas.width ||
      elementBottom < 0 ||
      element.y > canvas.height;
    
    return !isOutOfBounds;
  };
  
  // Filter and sort elements
  const visibleElements = elementsArray.filter(isElementInBounds);
  const sortedElements = [...visibleElements].sort((a, b) => (a.zIndex || 0) - (b.zIndex || 0));

  const handleArtboardClick = (e: React.MouseEvent) => {
    // Only clear selection if clicking directly on artboard (not on elements)
    if (e.target === e.currentTarget) {
      clearSelection();
    }
  };

  // Handle export event
  useEffect(() => {
    const handleExport = async () => {
      if (!artboardRef.current) return;
      
      try {
        await exportToPNG(artboardRef.current, 'kanva-design.png');
      } catch (error) {
        console.error('Export failed:', error);
      }
    };

    window.addEventListener('kanva-export', handleExport);
    return () => window.removeEventListener('kanva-export', handleExport);
  }, []);

  return (
    <div
      ref={artboardRef}
      id="kanva-artboard"
      className="relative"
      style={{
        width: displayWidth,
        height: displayHeight,
        backgroundColor: canvas.background?.color || '#ffffff',
        borderRadius: '8px',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15), 0 0 0 1px rgba(0, 0, 0, 0.05)',
        minHeight: '200px', // Ensure visibility
        overflow: 'hidden', // Clip elements at canvas edges
        transition: 'none', // Animation handled by parent
      }}
      onClick={handleArtboardClick}
    >
      {/* Grid overlay */}
      <CanvasGrid gridSize={10} showGrid={showGrid} />
      
      {/* Enhanced Alignment Guides */}
      <EnhancedAlignmentGuides
        activeGuides={activeGuides}
        canvasRect={{
          left: 0,
          top: 0,
          width: canvas.width,
          height: canvas.height,
        }}
        badge={alignmentBadge}
      />
      
      {/* Marquee Selection */}
      <MarqueeSelection />
      
      {/* Drawing Overlay */}
      <DrawingOverlay />
      
      {/* Render all elements */}
      {sortedElements.map((element) => (
        <CanvasElement
          key={element.id}
          element={element}
          isSelected={selectedIds.includes(element.id)}
        />
      ))}
      
      {/* Empty state */}
      {sortedElements.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center text-gray-400 pointer-events-none">
          <div className="text-center">
            <p className="text-lg font-medium">Your canvas is ready!</p>
            <p className="text-sm mt-2">Add images, text, or shapes from the sidebar</p>
          </div>
        </div>
      )}
    </div>
  );
}


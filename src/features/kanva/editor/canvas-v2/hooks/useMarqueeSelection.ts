/**
 * Marquee Selection Hook
 * 
 * Handles rectangular selection (drag-to-select) with:
 * - Preview of elements that will be selected
 * - Intersection-based selection
 * - Shift-key for additive selection
 */

'use client';

import { useCallback, useRef, useState } from 'react';
import { useEditorStore } from '../../../lib/editor/store';
import type { EditorElement } from '../../../lib/editor/types';
import type { Point, Bounds, MarqueeState } from '../types';
import { boundsIntersect, createBounds } from '../utils/geometry';

// ============================================
// TYPES
// ============================================

export interface UseMarqueeSelectionOptions {
  zoom: number;
  measureElement: (element: EditorElement) => { width: number; height: number };
}

export interface MarqueeSelection {
  // State
  isSelecting: boolean;
  marquee: MarqueeState | null;
  previewIds: string[];
  
  // Handlers
  startMarquee: (point: Point) => void;
  updateMarquee: (point: Point, shiftKey: boolean) => void;
  endMarquee: (shiftKey: boolean) => void;
  cancelMarquee: () => void;
  
  // Computed
  getMarqueeBounds: () => Bounds | null;
}

// ============================================
// HOOK IMPLEMENTATION
// ============================================

export function useMarqueeSelection(
  options: UseMarqueeSelectionOptions
): MarqueeSelection {
  const { zoom, measureElement } = options;
  
  // Store
  const elements = useEditorStore(state => state.elements);
  const selectedIds = useEditorStore(state => state.selectedIds);
  const setSelectedIds = useEditorStore(state => state.setSelectedIds);
  
  // State
  const [isSelecting, setIsSelecting] = useState(false);
  const [marquee, setMarquee] = useState<MarqueeState | null>(null);
  const [previewIds, setPreviewIds] = useState<string[]>([]);
  
  // Ref to track if we just finished (prevents click from clearing)
  const justFinishedRef = useRef(false);
  
  // ============================================
  // HELPERS
  // ============================================
  
  const getElementsInMarquee = useCallback((start: Point, end: Point): string[] => {
    const minX = Math.min(start.x, end.x);
    const minY = Math.min(start.y, end.y);
    const maxX = Math.max(start.x, end.x);
    const maxY = Math.max(start.y, end.y);
    
    const marqueeBounds: Bounds = { minX, minY, maxX, maxY };
    
    return elements
      .filter(el => {
        if (el.locked) return false;
        
        const measured = measureElement(el);
        const elementBounds = createBounds(el.x, el.y, measured.width, measured.height);
        
        return boundsIntersect(marqueeBounds, elementBounds);
      })
      .map(el => el.id);
  }, [elements, measureElement]);
  
  // ============================================
  // HANDLERS
  // ============================================
  
  const startMarquee = useCallback((point: Point) => {
    // Convert to canvas coordinates
    const canvasPoint = {
      x: point.x / zoom,
      y: point.y / zoom,
    };
    
    setMarquee({ start: canvasPoint, end: canvasPoint });
    setIsSelecting(true);
    setPreviewIds([]);
  }, [zoom]);
  
  const updateMarquee = useCallback((point: Point, shiftKey: boolean) => {
    if (!marquee) return;
    
    const canvasPoint = {
      x: point.x / zoom,
      y: point.y / zoom,
    };
    
    setMarquee(prev => prev ? { ...prev, end: canvasPoint } : null);
    
    // Calculate preview
    const intersecting = getElementsInMarquee(marquee.start, canvasPoint);
    
    if (shiftKey) {
      // Additive: include currently selected + new
      const combined = new Set([...selectedIds, ...intersecting]);
      setPreviewIds(Array.from(combined));
    } else {
      setPreviewIds(intersecting);
    }
  }, [zoom, marquee, selectedIds, getElementsInMarquee]);
  
  const endMarquee = useCallback((shiftKey: boolean) => {
    if (!marquee) {
      setIsSelecting(false);
      return;
    }
    
    const intersecting = getElementsInMarquee(marquee.start, marquee.end);
    
    if (intersecting.length > 0) {
      if (shiftKey) {
        // Additive selection
        const combined = new Set([...selectedIds, ...intersecting]);
        setSelectedIds(Array.from(combined));
      } else {
        setSelectedIds(intersecting);
      }
      
      // Prevent subsequent click from clearing
      justFinishedRef.current = true;
      setTimeout(() => {
        justFinishedRef.current = false;
      }, 0);
    }
    
    setMarquee(null);
    setIsSelecting(false);
    setPreviewIds([]);
  }, [marquee, selectedIds, setSelectedIds, getElementsInMarquee]);
  
  const cancelMarquee = useCallback(() => {
    setMarquee(null);
    setIsSelecting(false);
    setPreviewIds([]);
  }, []);
  
  const getMarqueeBounds = useCallback((): Bounds | null => {
    if (!marquee) return null;
    
    return {
      minX: Math.min(marquee.start.x, marquee.end.x),
      minY: Math.min(marquee.start.y, marquee.end.y),
      maxX: Math.max(marquee.start.x, marquee.end.x),
      maxY: Math.max(marquee.start.y, marquee.end.y),
    };
  }, [marquee]);
  
  return {
    isSelecting,
    marquee,
    previewIds,
    startMarquee,
    updateMarquee,
    endMarquee,
    cancelMarquee,
    getMarqueeBounds,
  };
}

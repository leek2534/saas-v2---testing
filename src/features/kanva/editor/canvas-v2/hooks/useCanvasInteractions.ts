/**
 * Canvas Interactions Hook
 * 
 * Manages all canvas interactions (drag, resize, rotate) with:
 * - Refs for transient state (no re-renders during drag)
 * - Batched store updates
 * - Proper cleanup
 */

'use client';

import { useCallback, useRef, useState } from 'react';
import { useEditorStore } from '../../../lib/editor/store';
import type { EditorElement } from '../../../lib/editor/types';
import type { 
  Point, 
  Bounds, 
  InteractionMode, 
  DragState, 
  ResizeState, 
  RotateState,
  HandlePosition,
  SnapGuide,
} from '../types';
import { HANDLE_CURSORS } from '../types';
import { 
  calculateSnap, 
  snapRotation,
  type SnapTarget,
} from '../utils/snapping';
import {
  createBounds,
  getBoundsCenter,
  angleBetween,
  calculateResize,
  calculateMultiResize,
  type ElementTransform,
} from '../utils/geometry';

// ============================================
// TYPES
// ============================================

export interface UseCanvasInteractionsOptions {
  zoom: number;
  canvasSize: { width: number; height: number };
  measureElement: (element: EditorElement) => { width: number; height: number };
}

export interface CanvasInteractions {
  // State
  mode: InteractionMode;
  activeSnapGuides: SnapGuide[];
  cursor: string;
  
  // Drag handlers
  startDrag: (elementId: string, point: Point, elements: EditorElement[]) => void;
  updateDrag: (point: Point) => void;
  endDrag: () => void;
  
  // Resize handlers
  startResize: (elementId: string | null, handle: HandlePosition, point: Point, elements: EditorElement[]) => void;
  updateResize: (point: Point) => void;
  endResize: () => void;
  
  // Rotate handlers
  startRotate: (elementId: string, point: Point, element: EditorElement) => void;
  updateRotate: (point: Point) => void;
  endRotate: () => void;
  
  // Reset
  reset: () => void;
}

// ============================================
// HOOK IMPLEMENTATION
// ============================================

export function useCanvasInteractions(
  options: UseCanvasInteractionsOptions
): CanvasInteractions {
  const { zoom, canvasSize, measureElement } = options;
  
  // Store actions
  const updateElement = useEditorStore(state => state.updateElement);
  const selectedIds = useEditorStore(state => state.selectedIds);
  const elements = useEditorStore(state => state.elements);
  
  // Reactive state (causes re-renders)
  const [mode, setMode] = useState<InteractionMode>('idle');
  const [activeSnapGuides, setActiveSnapGuides] = useState<SnapGuide[]>([]);
  const [cursor, setCursor] = useState('default');
  
  // Refs for transient state (no re-renders during interaction)
  const dragRef = useRef<DragState | null>(null);
  const resizeRef = useRef<ResizeState | null>(null);
  const rotateRef = useRef<RotateState | null>(null);
  
  // ============================================
  // DRAG HANDLERS
  // ============================================
  
  const startDrag = useCallback((
    elementId: string,
    point: Point,
    allElements: EditorElement[]
  ) => {
    const element = allElements.find(el => el.id === elementId);
    if (!element) return;
    
    // Calculate offsets for all selected elements
    const elementOffsets = new Map<string, Point>();
    const idsToMove = selectedIds.includes(elementId) ? selectedIds : [elementId];
    
    idsToMove.forEach(id => {
      const el = allElements.find(e => e.id === id);
      if (el) {
        elementOffsets.set(id, { x: el.x, y: el.y });
      }
    });
    
    dragRef.current = {
      elementId,
      startPoint: point,
      currentPoint: point,
      offset: { x: element.x, y: element.y },
      elementOffsets,
    };
    
    setMode('dragging');
    setCursor('grabbing');
  }, [selectedIds]);
  
  const updateDrag = useCallback((point: Point) => {
    const drag = dragRef.current;
    if (!drag) return;
    
    const dx = (point.x - drag.startPoint.x) / zoom;
    const dy = (point.y - drag.startPoint.y) / zoom;
    
    // Get primary element for snapping
    const primaryElement = elements.find(el => el.id === drag.elementId);
    if (!primaryElement) return;
    
    const measured = measureElement(primaryElement);
    const newX = drag.offset.x + dx;
    const newY = drag.offset.y + dy;
    
    // Calculate snap
    const draggedBounds = createBounds(newX, newY, measured.width, measured.height);
    const snapTargets: SnapTarget[] = elements
      .filter(el => !drag.elementOffsets.has(el.id))
      .map(el => {
        const m = measureElement(el);
        return {
          id: el.id,
          bounds: createBounds(el.x, el.y, m.width, m.height),
        };
      });
    
    const snapResult = calculateSnap(draggedBounds, snapTargets, canvasSize);
    
    // Calculate snap delta
    const snapDx = snapResult.x - newX;
    const snapDy = snapResult.y - newY;
    
    // Update all selected elements
    drag.elementOffsets.forEach((originalPos, id) => {
      updateElement(id, {
        x: originalPos.x + dx + snapDx,
        y: originalPos.y + dy + snapDy,
      });
    });
    
    drag.currentPoint = point;
    setActiveSnapGuides(snapResult.guides);
  }, [zoom, elements, canvasSize, measureElement, updateElement]);
  
  const endDrag = useCallback(() => {
    dragRef.current = null;
    setMode('idle');
    setCursor('default');
    setActiveSnapGuides([]);
  }, []);
  
  // ============================================
  // RESIZE HANDLERS
  // ============================================
  
  const startResize = useCallback((
    elementId: string | null,
    handle: HandlePosition,
    point: Point,
    allElements: EditorElement[]
  ) => {
    const idsToResize = elementId ? [elementId] : selectedIds;
    
    // Calculate bounds of all elements
    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
    const elementStarts: ElementTransform[] = [];
    
    idsToResize.forEach(id => {
      const el = allElements.find(e => e.id === id);
      if (!el) return;
      
      const measured = measureElement(el);
      minX = Math.min(minX, el.x);
      minY = Math.min(minY, el.y);
      maxX = Math.max(maxX, el.x + measured.width);
      maxY = Math.max(maxY, el.y + measured.height);
      
      elementStarts.push({
        id: el.id,
        x: el.x,
        y: el.y,
        width: measured.width,
        height: measured.height,
        fontSize: (el as any).fontSize,
      });
    });
    
    resizeRef.current = {
      elementId,
      handle,
      startPoint: point,
      startBounds: { minX, minY, maxX, maxY },
      elementStarts,
      preserveAspect: idsToResize.length > 1, // Always preserve for multi-select
    };
    
    setMode('resizing');
    setCursor(HANDLE_CURSORS[handle]);
  }, [selectedIds, measureElement]);
  
  const updateResize = useCallback((point: Point) => {
    const resize = resizeRef.current;
    if (!resize) return;
    
    const dx = (point.x - resize.startPoint.x) / zoom;
    const dy = (point.y - resize.startPoint.y) / zoom;
    
    if (resize.elementStarts.length === 1) {
      // Single element resize
      const start = resize.elementStarts[0];
      const result = calculateResize(
        { x: start.x, y: start.y, width: start.width, height: start.height },
        resize.handle,
        dx,
        dy,
        resize.preserveAspect
      );
      
      updateElement(start.id, {
        x: result.x,
        y: result.y,
        width: result.width,
        height: result.height,
      });
    } else {
      // Multi-element resize
      const results = calculateMultiResize(
        resize.elementStarts,
        resize.startBounds,
        resize.handle,
        dx,
        dy,
        true // Always preserve aspect for multi
      );
      
      results.forEach(result => {
        const updates: Partial<EditorElement> = {
          x: result.x,
          y: result.y,
          width: result.width,
          height: result.height,
        };
        
        if (result.fontSize !== undefined) {
          (updates as any).fontSize = result.fontSize;
        }
        
        updateElement(result.id, updates);
      });
    }
  }, [zoom, updateElement]);
  
  const endResize = useCallback(() => {
    resizeRef.current = null;
    setMode('idle');
    setCursor('default');
    setActiveSnapGuides([]);
  }, []);
  
  // ============================================
  // ROTATE HANDLERS
  // ============================================
  
  const startRotate = useCallback((
    elementId: string,
    point: Point,
    element: EditorElement
  ) => {
    const measured = measureElement(element);
    const center = {
      x: element.x + measured.width / 2,
      y: element.y + measured.height / 2,
    };
    
    const startAngle = angleBetween(center, {
      x: point.x / zoom,
      y: point.y / zoom,
    });
    
    rotateRef.current = {
      elementId,
      startAngle,
      startRotation: element.rotation || 0,
      center,
    };
    
    setMode('rotating');
    setCursor('grabbing');
  }, [zoom, measureElement]);
  
  const updateRotate = useCallback((point: Point) => {
    const rotate = rotateRef.current;
    if (!rotate) return;
    
    const currentAngle = angleBetween(rotate.center, {
      x: point.x / zoom,
      y: point.y / zoom,
    });
    
    let newRotation = rotate.startRotation + (currentAngle - rotate.startAngle);
    
    // Snap rotation
    const snapped = snapRotation(newRotation);
    newRotation = snapped.angle;
    
    updateElement(rotate.elementId, { rotation: newRotation });
  }, [zoom, updateElement]);
  
  const endRotate = useCallback(() => {
    rotateRef.current = null;
    setMode('idle');
    setCursor('default');
  }, []);
  
  // ============================================
  // RESET
  // ============================================
  
  const reset = useCallback(() => {
    dragRef.current = null;
    resizeRef.current = null;
    rotateRef.current = null;
    setMode('idle');
    setCursor('default');
    setActiveSnapGuides([]);
  }, []);
  
  return {
    mode,
    activeSnapGuides,
    cursor,
    startDrag,
    updateDrag,
    endDrag,
    startResize,
    updateResize,
    endResize,
    startRotate,
    updateRotate,
    endRotate,
    reset,
  };
}

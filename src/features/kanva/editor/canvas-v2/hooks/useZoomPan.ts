/**
 * Zoom & Pan Hook
 * 
 * Handles canvas viewport transformations:
 * - Mouse wheel zoom (with Ctrl/Cmd)
 * - Middle-click pan
 * - Spacebar + drag pan
 * - Zoom to fit
 * - Zoom to selection
 */

'use client';

import { useCallback, useRef, useState, useEffect } from 'react';
import type { Point, ViewportState, PanState } from '../types';

// ============================================
// CONSTANTS
// ============================================

const MIN_ZOOM = 0.1;
const MAX_ZOOM = 5;
const ZOOM_STEP = 0.1;
const ZOOM_WHEEL_SENSITIVITY = 0.001;

// ============================================
// TYPES
// ============================================

export interface UseZoomPanOptions {
  initialZoom?: number;
  initialPan?: Point;
  containerRef: React.RefObject<HTMLElement>;
}

export interface ZoomPan {
  // State
  zoom: number;
  panX: number;
  panY: number;
  isPanning: boolean;
  
  // Actions
  setZoom: (zoom: number, center?: Point) => void;
  zoomIn: (center?: Point) => void;
  zoomOut: (center?: Point) => void;
  zoomToFit: (contentSize: { width: number; height: number }, padding?: number) => void;
  zoomToSelection: (bounds: { minX: number; minY: number; maxX: number; maxY: number }, padding?: number) => void;
  resetView: () => void;
  
  // Pan handlers
  startPan: (point: Point) => void;
  updatePan: (point: Point) => void;
  endPan: () => void;
  
  // Wheel handler
  handleWheel: (e: WheelEvent) => void;
  
  // Transform helpers
  screenToCanvas: (point: Point) => Point;
  canvasToScreen: (point: Point) => Point;
}

// ============================================
// HOOK IMPLEMENTATION
// ============================================

export function useZoomPan(options: UseZoomPanOptions): ZoomPan {
  const { initialZoom = 1, initialPan = { x: 0, y: 0 }, containerRef } = options;
  
  // State
  const [zoom, setZoomState] = useState(initialZoom);
  const [panX, setPanX] = useState(initialPan.x);
  const [panY, setPanY] = useState(initialPan.y);
  const [isPanning, setIsPanning] = useState(false);
  
  // Refs for pan state
  const panRef = useRef<PanState | null>(null);
  
  // ============================================
  // ZOOM ACTIONS
  // ============================================
  
  const setZoom = useCallback((newZoom: number, center?: Point) => {
    const clampedZoom = Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, newZoom));
    
    if (center && containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const containerCenter = center || {
        x: rect.width / 2,
        y: rect.height / 2,
      };
      
      // Calculate new pan to keep the center point stationary
      const zoomRatio = clampedZoom / zoom;
      const newPanX = containerCenter.x - (containerCenter.x - panX) * zoomRatio;
      const newPanY = containerCenter.y - (containerCenter.y - panY) * zoomRatio;
      
      setPanX(newPanX);
      setPanY(newPanY);
    }
    
    setZoomState(clampedZoom);
  }, [zoom, panX, panY, containerRef]);
  
  const zoomIn = useCallback((center?: Point) => {
    setZoom(zoom + ZOOM_STEP, center);
  }, [zoom, setZoom]);
  
  const zoomOut = useCallback((center?: Point) => {
    setZoom(zoom - ZOOM_STEP, center);
  }, [zoom, setZoom]);
  
  const zoomToFit = useCallback((
    contentSize: { width: number; height: number },
    padding: number = 50
  ) => {
    if (!containerRef.current) return;
    
    const rect = containerRef.current.getBoundingClientRect();
    const availableWidth = rect.width - padding * 2;
    const availableHeight = rect.height - padding * 2;
    
    const scaleX = availableWidth / contentSize.width;
    const scaleY = availableHeight / contentSize.height;
    const newZoom = Math.min(scaleX, scaleY, 1); // Don't zoom in past 100%
    
    // Center the content
    const newPanX = (rect.width - contentSize.width * newZoom) / 2;
    const newPanY = (rect.height - contentSize.height * newZoom) / 2;
    
    setZoomState(newZoom);
    setPanX(newPanX);
    setPanY(newPanY);
  }, [containerRef]);
  
  const zoomToSelection = useCallback((
    bounds: { minX: number; minY: number; maxX: number; maxY: number },
    padding: number = 50
  ) => {
    if (!containerRef.current) return;
    
    const rect = containerRef.current.getBoundingClientRect();
    const selectionWidth = bounds.maxX - bounds.minX;
    const selectionHeight = bounds.maxY - bounds.minY;
    
    const availableWidth = rect.width - padding * 2;
    const availableHeight = rect.height - padding * 2;
    
    const scaleX = availableWidth / selectionWidth;
    const scaleY = availableHeight / selectionHeight;
    const newZoom = Math.min(scaleX, scaleY, 2); // Max 200% for selection
    
    // Center the selection
    const selectionCenterX = (bounds.minX + bounds.maxX) / 2;
    const selectionCenterY = (bounds.minY + bounds.maxY) / 2;
    
    const newPanX = rect.width / 2 - selectionCenterX * newZoom;
    const newPanY = rect.height / 2 - selectionCenterY * newZoom;
    
    setZoomState(newZoom);
    setPanX(newPanX);
    setPanY(newPanY);
  }, [containerRef]);
  
  const resetView = useCallback(() => {
    setZoomState(1);
    setPanX(0);
    setPanY(0);
  }, []);
  
  // ============================================
  // PAN HANDLERS
  // ============================================
  
  const startPan = useCallback((point: Point) => {
    panRef.current = {
      startPoint: point,
      startOffset: { x: panX, y: panY },
    };
    setIsPanning(true);
  }, [panX, panY]);
  
  const updatePan = useCallback((point: Point) => {
    const pan = panRef.current;
    if (!pan) return;
    
    const dx = point.x - pan.startPoint.x;
    const dy = point.y - pan.startPoint.y;
    
    setPanX(pan.startOffset.x + dx);
    setPanY(pan.startOffset.y + dy);
  }, []);
  
  const endPan = useCallback(() => {
    panRef.current = null;
    setIsPanning(false);
  }, []);
  
  // ============================================
  // WHEEL HANDLER
  // ============================================
  
  const handleWheel = useCallback((e: WheelEvent) => {
    // Only zoom if Ctrl/Cmd is pressed
    if (!e.ctrlKey && !e.metaKey) return;
    
    e.preventDefault();
    
    const delta = -e.deltaY * ZOOM_WHEEL_SENSITIVITY;
    const newZoom = Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, zoom * (1 + delta)));
    
    // Zoom toward cursor position
    const rect = containerRef.current?.getBoundingClientRect();
    if (rect) {
      const cursorX = e.clientX - rect.left;
      const cursorY = e.clientY - rect.top;
      setZoom(newZoom, { x: cursorX, y: cursorY });
    } else {
      setZoomState(newZoom);
    }
  }, [zoom, setZoom, containerRef]);
  
  // ============================================
  // COORDINATE TRANSFORMS
  // ============================================
  
  const screenToCanvas = useCallback((point: Point): Point => {
    return {
      x: (point.x - panX) / zoom,
      y: (point.y - panY) / zoom,
    };
  }, [zoom, panX, panY]);
  
  const canvasToScreen = useCallback((point: Point): Point => {
    return {
      x: point.x * zoom + panX,
      y: point.y * zoom + panY,
    };
  }, [zoom, panX, panY]);
  
  return {
    zoom,
    panX,
    panY,
    isPanning,
    setZoom,
    zoomIn,
    zoomOut,
    zoomToFit,
    zoomToSelection,
    resetView,
    startPan,
    updatePan,
    endPan,
    handleWheel,
    screenToCanvas,
    canvasToScreen,
  };
}

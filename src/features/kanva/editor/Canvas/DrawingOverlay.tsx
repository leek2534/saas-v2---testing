'use client';

import React, { useRef, useState, useCallback, useEffect } from 'react';
import { useEditorStore } from '../../lib/editor/store';
import { generateId, getNextZIndex } from '../../lib/editor/utils';
import type { PathElement } from '../../lib/editor/types';

interface Point {
  x: number;
  y: number;
}

/**
 * DrawingOverlay - Captures drawing input and creates path elements
 * Overlays the canvas when drawing mode is active
 */
export function DrawingOverlay() {
  const isDrawingMode = useEditorStore((s) => s.isDrawingMode);
  const drawingConfig = useEditorStore((s) => s.drawingConfig);
  const elements = useEditorStore((s) => s.elements);
  const addElement = useEditorStore((s) => s.addElement);
  
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentPath, setCurrentPath] = useState<Point[]>([]);
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Convert points array to SVG path data
  const pointsToPathData = useCallback((points: Point[]): string => {
    if (points.length === 0) return '';
    if (points.length === 1) {
      // Single point - draw a small circle
      return `M ${points[0].x} ${points[0].y} L ${points[0].x + 0.1} ${points[0].y}`;
    }
    
    // Use quadratic curves for smoother lines
    let pathData = `M ${points[0].x} ${points[0].y}`;
    
    for (let i = 1; i < points.length; i++) {
      const prev = points[i - 1];
      const curr = points[i];
      
      // Use quadratic curve for smoother drawing
      if (i < points.length - 1) {
        const next = points[i + 1];
        const cpX = curr.x;
        const cpY = curr.y;
        const endX = (curr.x + next.x) / 2;
        const endY = (curr.y + next.y) / 2;
        pathData += ` Q ${cpX} ${cpY}, ${endX} ${endY}`;
      } else {
        // Last point - just line to it
        pathData += ` L ${curr.x} ${curr.y}`;
      }
    }
    
    return pathData;
  }, []);

  // Get mouse/touch position relative to canvas
  const getCanvasPoint = useCallback((clientX: number, clientY: number): Point | null => {
    if (!containerRef.current) return null;
    
    // Get the artboard element (parent of this overlay)
    const artboard = containerRef.current.parentElement;
    if (!artboard) return null;
    
    // Get the transformed container (artboard's parent with zoom/pan)
    const transformedContainer = artboard.parentElement;
    if (!transformedContainer) return null;
    
    // Get the viewport container (to get screen coordinates)
    const viewport = transformedContainer.parentElement;
    if (!viewport) return null;
    
    // Get viewport bounds
    const viewportRect = viewport.getBoundingClientRect();
    
    // Calculate position relative to viewport
    const viewportX = clientX - viewportRect.left;
    const viewportY = clientY - viewportRect.top;
    
    // Get the transform from the transformed container
    const transform = window.getComputedStyle(transformedContainer).transform;
    
    // Parse transform matrix to get pan and zoom
    let panX = 0, panY = 0, zoom = 1;
    if (transform && transform !== 'none') {
      const matrix = transform.match(/matrix\(([^)]+)\)/);
      if (matrix) {
        const values = matrix[1].split(',').map(parseFloat);
        // matrix(scaleX, skewY, skewX, scaleY, translateX, translateY)
        zoom = values[0]; // scaleX
        panX = values[4]; // translateX
        panY = values[5]; // translateY
      }
    }
    
    // Convert from viewport coordinates to canvas coordinates
    // Reverse the transform: (viewportCoord - pan) / zoom
    const x = (viewportX - panX) / zoom;
    const y = (viewportY - panY) / zoom;
    
    // Get artboard bounds for validation
    const artboardRect = artboard.getBoundingClientRect();
    
    // Ensure point is within canvas bounds (in canvas space)
    if (x < 0 || x > artboardRect.width / zoom || y < 0 || y > artboardRect.height / zoom) {
      return null;
    }
    
    return { x, y };
  }, []);

  // Start drawing
  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    if (!isDrawingMode) return;
    
    e.preventDefault();
    e.stopPropagation();
    
    const point = getCanvasPoint(e.clientX, e.clientY);
    if (!point) return;
    
    setIsDrawing(true);
    setCurrentPath([point]);
    
    // Capture pointer for smooth drawing
    if (containerRef.current) {
      containerRef.current.setPointerCapture(e.pointerId);
    }
  }, [isDrawingMode, getCanvasPoint]);

  // Continue drawing
  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    if (!isDrawing || !isDrawingMode) return;
    
    e.preventDefault();
    
    const point = getCanvasPoint(e.clientX, e.clientY);
    if (!point) return;
    
    // Add point to path (with some distance threshold to avoid too many points)
    setCurrentPath((prev) => {
      if (prev.length === 0) return [point];
      
      const lastPoint = prev[prev.length - 1];
      const distance = Math.sqrt(
        Math.pow(point.x - lastPoint.x, 2) + Math.pow(point.y - lastPoint.y, 2)
      );
      
      // Only add point if it's far enough from the last one
      if (distance > 2) {
        return [...prev, point];
      }
      return prev;
    });
  }, [isDrawing, isDrawingMode, getCanvasPoint]);

  // Detect if path is a recognizable shape
  const detectShape = useCallback((points: Point[]) => {
    if (points.length < 10) return null;
    
    const xs = points.map(p => p.x);
    const ys = points.map(p => p.y);
    const minX = Math.min(...xs);
    const minY = Math.min(...ys);
    const maxX = Math.max(...xs);
    const maxY = Math.max(...ys);
    const width = maxX - minX;
    const height = maxY - minY;
    
    // Check if it's roughly a circle/ellipse
    const centerX = (minX + maxX) / 2;
    const centerY = (minY + maxY) / 2;
    const avgRadius = (width + height) / 4;
    
    let sumDistanceError = 0;
    points.forEach(p => {
      const dist = Math.sqrt(Math.pow(p.x - centerX, 2) + Math.pow(p.y - centerY, 2));
      sumDistanceError += Math.abs(dist - avgRadius);
    });
    const avgError = sumDistanceError / points.length;
    
    // If average error is small relative to radius, it's a circle
    if (avgError < avgRadius * 0.2) {
      return { type: 'circle' as const, centerX, centerY, radiusX: width / 2, radiusY: height / 2 };
    }
    
    // Check if it's roughly a rectangle (check if points are near edges)
    const nearEdgeCount = points.filter(p => {
      const nearLeft = Math.abs(p.x - minX) < width * 0.1;
      const nearRight = Math.abs(p.x - maxX) < width * 0.1;
      const nearTop = Math.abs(p.y - minY) < height * 0.1;
      const nearBottom = Math.abs(p.y - maxY) < height * 0.1;
      return (nearLeft || nearRight) && (nearTop || nearBottom);
    }).length;
    
    if (nearEdgeCount > points.length * 0.6) {
      return { type: 'rectangle' as const, x: minX, y: minY, width, height };
    }
    
    // Check if it's roughly a straight line
    const firstPoint = points[0];
    const lastPoint = points[points.length - 1];
    const lineLength = Math.sqrt(
      Math.pow(lastPoint.x - firstPoint.x, 2) + Math.pow(lastPoint.y - firstPoint.y, 2)
    );
    
    let sumLineError = 0;
    points.forEach(p => {
      // Distance from point to line
      const A = lastPoint.y - firstPoint.y;
      const B = firstPoint.x - lastPoint.x;
      const C = lastPoint.x * firstPoint.y - firstPoint.x * lastPoint.y;
      const dist = Math.abs(A * p.x + B * p.y + C) / Math.sqrt(A * A + B * B);
      sumLineError += dist;
    });
    const avgLineError = sumLineError / points.length;
    
    if (avgLineError < 10 && lineLength > 30) {
      return { type: 'line' as const, x1: firstPoint.x, y1: firstPoint.y, x2: lastPoint.x, y2: lastPoint.y };
    }
    
    return null;
  }, []);

  // Finish drawing
  const handlePointerUp = useCallback((e: React.PointerEvent) => {
    if (!isDrawing || !isDrawingMode) return;
    
    e.preventDefault();
    
    // Release pointer capture
    if (containerRef.current) {
      containerRef.current.releasePointerCapture(e.pointerId);
    }
    
    // Create path element if we have enough points
    if (currentPath.length > 1) {
      // Calculate bounding box
      const xs = currentPath.map(p => p.x);
      const ys = currentPath.map(p => p.y);
      const minX = Math.min(...xs);
      const minY = Math.min(...ys);
      const maxX = Math.max(...xs);
      const maxY = Math.max(...ys);
      
      // Add some padding for stroke width
      const padding = (drawingConfig?.strokeWidth || 5) / 2 + 2;
      
      // Detect if it's a recognizable shape
      const shape = detectShape(currentPath);
      
      if (shape) {
        // Create a clean shape element instead of freeform path
        if (shape.type === 'circle') {
          addElement({
            id: generateId('shape'),
            type: 'shape',
            shapeType: 'circle',
            x: shape.centerX - shape.radiusX,
            y: shape.centerY - shape.radiusY,
            width: shape.radiusX * 2,
            height: shape.radiusY * 2,
            rotation: 0,
            zIndex: getNextZIndex(elements),
            visible: true,
            fill: 'none',
            stroke: drawingConfig?.color || '#000000',
            strokeWidth: drawingConfig?.strokeWidth || 5,
          });
        } else if (shape.type === 'rectangle') {
          addElement({
            id: generateId('shape'),
            type: 'shape',
            shapeType: 'rect',
            x: shape.x,
            y: shape.y,
            width: shape.width,
            height: shape.height,
            rotation: 0,
            zIndex: getNextZIndex(elements),
            visible: true,
            fill: 'none',
            stroke: drawingConfig?.color || '#000000',
            strokeWidth: drawingConfig?.strokeWidth || 5,
          });
        } else if (shape.type === 'line') {
          // For lines, create a path element
          const linePathData = `M ${shape.x1} ${shape.y1} L ${shape.x2} ${shape.y2}`;
          const lineMinX = Math.min(shape.x1, shape.x2);
          const lineMinY = Math.min(shape.y1, shape.y2);
          const lineMaxX = Math.max(shape.x1, shape.x2);
          const lineMaxY = Math.max(shape.y1, shape.y2);
          
          addElement({
            id: generateId('path'),
            type: 'path',
            x: lineMinX - padding,
            y: lineMinY - padding,
            width: lineMaxX - lineMinX + padding * 2,
            height: lineMaxY - lineMinY + padding * 2,
            rotation: 0,
            zIndex: getNextZIndex(elements),
            visible: true,
            pathData: `M ${shape.x1 - (lineMinX - padding)} ${shape.y1 - (lineMinY - padding)} L ${shape.x2 - (lineMinX - padding)} ${shape.y2 - (lineMinY - padding)}`,
            stroke: drawingConfig?.color || '#000000',
            strokeWidth: drawingConfig?.strokeWidth || 5,
            fill: 'none',
            strokeLinecap: 'round',
            strokeLinejoin: 'round',
          });
        }
      } else {
        // Create freeform path element
        // Translate path points to be relative to element position
        const relativePoints = currentPath.map(p => ({
          x: p.x - (minX - padding),
          y: p.y - (minY - padding),
        }));
        
        const pathData = pointsToPathData(relativePoints);
        
        addElement({
          id: generateId('path'),
          type: 'path',
          x: minX - padding,
          y: minY - padding,
          width: maxX - minX + padding * 2,
          height: maxY - minY + padding * 2,
          rotation: 0,
          zIndex: getNextZIndex(elements),
          visible: true,
          pathData,
          stroke: drawingConfig?.color || '#000000',
          strokeWidth: drawingConfig?.strokeWidth || 5,
          fill: 'none',
          strokeLinecap: 'round',
          strokeLinejoin: 'round',
        });
      }
    }
    
    // Reset drawing state
    setIsDrawing(false);
    setCurrentPath([]);
  }, [isDrawing, isDrawingMode, currentPath, pointsToPathData, drawingConfig, elements, addElement, detectShape]);

  // Cancel drawing on escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isDrawing) {
        setIsDrawing(false);
        setCurrentPath([]);
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isDrawing]);

  if (!isDrawingMode) return null;

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 z-50 cursor-crosshair"
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      style={{
        touchAction: 'none', // Prevent default touch behaviors
      }}
    >
      {/* SVG overlay for current drawing */}
      <svg
        ref={svgRef}
        className="absolute inset-0 w-full h-full pointer-events-none"
      >
        {currentPath.length > 0 && (
          <path
            d={pointsToPathData(currentPath)}
            stroke={drawingConfig?.color || '#000000'}
            strokeWidth={drawingConfig?.strokeWidth || 5}
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity={0.8}
          />
        )}
      </svg>
      
      {/* Drawing mode indicator */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground px-4 py-2 rounded-full text-sm font-medium shadow-lg pointer-events-none">
        Drawing Mode • Press ESC to exit
      </div>
    </div>
  );
}

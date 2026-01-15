'use client';

import React, { useRef, useState, useCallback, useEffect } from 'react';
import { useEditorStore } from '../../lib/editor/store';
import { Artboard } from './Artboard';
import { AlignmentGuides } from './AlignmentGuides';

/**
 * CanvasViewport - Main canvas container
 * Handles pan and zoom for the entire canvas area
 * The artboard is centered within this viewport
 */
export function CanvasViewport() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const MIN_ZOOM = 0.25; // Don't allow zooming out too far (25%)
  const MAX_ZOOM = 5; // Allow more zoom for detailed edits like Canva (500%)
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState({ x: 0, y: 0 });
  const [pinchStart, setPinchStart] = useState<{ distance: number; center: { x: number; y: number }; zoom: number; pan: { x: number; y: number } } | null>(null);
  const canvas = useEditorStore((s) => s.canvas);

  // Calculate fit-to-screen zoom and centering
  const calculateFitToScreen = useCallback(() => {
    if (!containerRef.current) return { zoom: 1, pan: { x: 0, y: 0 } };
    
    const container = containerRef.current.getBoundingClientRect();
    const padding = 80; // Padding around artboard
    const availableWidth = Math.max(100, container.width - padding * 2);
    const availableHeight = Math.max(100, container.height - padding * 2);
    
    // Calculate scale to fit artboard in viewport
    const scaleX = availableWidth / canvas.width;
    const scaleY = availableHeight / canvas.height;
    const fitZoom = Math.min(scaleX, scaleY, 1); // Don't zoom in beyond 100%
    
    // Center the artboard accounting for zoom
    const containerCenterX = container.width / 2;
    const containerCenterY = container.height / 2;
    const artboardCenterX = (canvas.width * fitZoom) / 2;
    const artboardCenterY = (canvas.height * fitZoom) / 2;
    
    return {
      zoom: fitZoom,
      pan: {
        x: containerCenterX - artboardCenterX,
        y: containerCenterY - artboardCenterY,
      },
    };
  }, [canvas.width, canvas.height]);

  // Calculate centering for a specific zoom level
  const calculateCenteredPosition = useCallback((zoomLevel: number) => {
    if (!containerRef.current) return { x: 0, y: 0 };
    
    const container = containerRef.current.getBoundingClientRect();
    const containerCenterX = container.width / 2;
    const containerCenterY = container.height / 2;
    const artboardCenterX = (canvas.width * zoomLevel) / 2;
    const artboardCenterY = (canvas.height * zoomLevel) / 2;
    
    return {
      x: containerCenterX - artboardCenterX,
      y: containerCenterY - artboardCenterY,
    };
  }, [canvas.width, canvas.height]);

  // Constrain pan to reasonable bounds
  const constrainPan = useCallback((panX: number, panY: number, currentZoom: number) => {
    if (!containerRef.current) return { x: panX, y: panY };
    
    const container = containerRef.current.getBoundingClientRect();
    const artboardWidth = canvas.width * currentZoom;
    const artboardHeight = canvas.height * currentZoom;
    
    // Always keep horizontally centered (no horizontal panning)
    const centeredX = (container.width - artboardWidth) / 2;
    
    // Allow vertical panning but with limits
    // Allow panning up to show bottom of artboard at top of viewport
    // and top of artboard at bottom of viewport
    const maxPanY = container.height - artboardHeight / 2; // Can pan down
    const minPanY = -artboardHeight / 2; // Can pan up
    
    return {
      x: centeredX, // Always centered horizontally
      y: Math.max(minPanY, Math.min(maxPanY, panY)), // Constrained vertically
    };
  }, [canvas.width, canvas.height]);

  // Initialize fit-to-screen on mount and when canvas size changes
  useEffect(() => {
    // Small delay to ensure container is rendered
    const timer = setTimeout(() => {
      const fit = calculateFitToScreen();
      setZoom(fit.zoom);
      setPan(fit.pan);
    }, 100);
    return () => clearTimeout(timer);
  }, [canvas.width, canvas.height, calculateFitToScreen]);

  // Handle container resize (e.g., sidebar toggle)
  useEffect(() => {
    if (!containerRef.current) return;

    let resizeTimer: NodeJS.Timeout;
    const resizeObserver = new ResizeObserver(() => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        // Only auto-fit if zoom is close to fit-to-screen (don't interrupt user zoom)
        const fit = calculateFitToScreen();
        const currentZoomPercent = Math.round(zoom * 100);
        const fitZoomPercent = Math.round(fit.zoom * 100);
        
        // If zoom is within 5% of fit, update to new fit
        if (Math.abs(currentZoomPercent - fitZoomPercent) < 5) {
          setZoom(fit.zoom);
          setPan(fit.pan);
        } else {
          // Otherwise just re-center at current zoom
          const centeredPos = calculateCenteredPosition(zoom);
          setPan(centeredPos);
        }
      }, 300);
    });

    resizeObserver.observe(containerRef.current);
    return () => {
      clearTimeout(resizeTimer);
      resizeObserver.disconnect();
    };
  }, [zoom, calculateFitToScreen, calculateCenteredPosition]);

  // Calculate distance between two touch points
  const getTouchDistance = (touch1: Touch, touch2: Touch): number => {
    const dx = touch1.clientX - touch2.clientX;
    const dy = touch1.clientY - touch2.clientY;
    return Math.sqrt(dx * dx + dy * dy);
  };

  // Calculate center point between two touches
  const getTouchCenter = (touch1: Touch, touch2: Touch, containerRect: DOMRect): { x: number; y: number } => {
    return {
      x: ((touch1.clientX + touch2.clientX) / 2) - containerRect.left,
      y: ((touch1.clientY + touch2.clientY) / 2) - containerRect.top,
    };
  };

  // Handle wheel zoom (scroll wheel and trackpad pinch)
  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault();
    
    if (!containerRef.current) return;
    
    const rect = containerRef.current.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    
    // Detect pinch zoom (trackpad) vs scroll wheel
    // Trackpad pinch gesture automatically sets ctrlKey in most browsers
    // This is the standard way browsers signal a pinch-to-zoom gesture
    const isPinchZoom = e.ctrlKey || e.metaKey;
    
    let zoomDelta = 0;
    if (isPinchZoom) {
      // Pinch zoom: use deltaY directly with smooth scaling
      // Trackpad pinch sends continuous deltaY values
      // Negative deltaY = pinch out (zoom in)
      // Positive deltaY = pinch in (zoom out)
      // Increased sensitivity for more responsive trackpad pinch
      const sensitivity = 0.01; // Smooth and responsive
      zoomDelta = -e.deltaY * sensitivity;
    } else {
      // Scroll wheel: use deltaY with exponential scaling for smooth zoom
      // Negative deltaY = scroll down = zoom out
      // Positive deltaY = scroll up = zoom in
      const scrollAmount = Math.abs(e.deltaY);
      const scrollDirection = Math.sign(e.deltaY);
      
      // Exponential zoom for smoother feel
      // Smaller scrolls = smaller zoom steps, larger scrolls = larger steps
      // Normalize based on deltaMode (0=px, 1=lines, 2=pages)
      const normalizedAmount = e.deltaMode === 0 ? scrollAmount : scrollAmount * (e.deltaMode === 1 ? 20 : 100);
      const zoomStep = Math.min(normalizedAmount / 120, 0.12); // Max 12% per step
      zoomDelta = -scrollDirection * zoomStep;
    }
    
    // Calculate new zoom with smooth exponential scaling
    const zoomFactor = 1 + zoomDelta;
    const newZoom = Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, zoom * zoomFactor));
    
    // Zoom towards mouse position (accounting for current pan and zoom)
    // Convert mouse position to artboard coordinates
    const artboardX = (mouseX - pan.x) / zoom;
    const artboardY = (mouseY - pan.y) / zoom;
    
    // Calculate new pan to keep mouse point fixed
    const newPanX = mouseX - artboardX * newZoom;
    const newPanY = mouseY - artboardY * newZoom;
    
    // Apply constraints
    const constrainedPan = constrainPan(newPanX, newPanY, newZoom);
    
    setZoom(newZoom);
    setPan(constrainedPan);
  }, [zoom, pan]);

  // Handle touch start (for pinch zoom on touch devices)
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (e.touches.length === 2 && containerRef.current) {
      e.preventDefault();
      const rect = containerRef.current.getBoundingClientRect();
      const distance = getTouchDistance(e.touches[0], e.touches[1]);
      const center = getTouchCenter(e.touches[0], e.touches[1], rect);
      
      setPinchStart({
        distance,
        center,
        zoom,
        pan: { ...pan },
      });
    }
  }, [zoom, pan]);

  // Handle touch move (pinch zoom)
  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (e.touches.length === 2 && pinchStart && containerRef.current) {
      e.preventDefault();
      const rect = containerRef.current.getBoundingClientRect();
      const distance = getTouchDistance(e.touches[0], e.touches[1]);
      const center = getTouchCenter(e.touches[0], e.touches[1], rect);
      
      // Calculate zoom based on distance change
      const scale = distance / pinchStart.distance;
      const newZoom = Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, pinchStart.zoom * scale));
      
      // Zoom towards pinch center
      const artboardX = (center.x - pinchStart.pan.x) / pinchStart.zoom;
      const artboardY = (center.y - pinchStart.pan.y) / pinchStart.zoom;
      
      const newPanX = center.x - artboardX * newZoom;
      const newPanY = center.y - artboardY * newZoom;
      
      // Apply constraints
      const constrainedPan = constrainPan(newPanX, newPanY, newZoom);
      
      setZoom(newZoom);
      setPan(constrainedPan);
    }
  }, [pinchStart]);

  // Handle touch end
  const handleTouchEnd = useCallback(() => {
    setPinchStart(null);
  }, []);

  // Handle pan start (middle mouse or space + drag)
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    // Space + left click for vertical panning only
    if (e.button === 0 && e.shiftKey) {
      e.preventDefault();
      setIsPanning(true);
      setPanStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
    }
    // Disable middle mouse button panning
  }, [pan]);

  // Handle pan move (vertical only)
  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isPanning) return;
    
    const newPanX = e.clientX - panStart.x;
    const newPanY = e.clientY - panStart.y;
    
    // Apply constraints (will keep horizontal centered)
    const constrainedPan = constrainPan(newPanX, newPanY, zoom);
    setPan(constrainedPan);
  }, [isPanning, panStart, zoom, constrainPan]);

  // Handle pan end
  const handleMouseUp = useCallback(() => {
    setIsPanning(false);
  }, []);

  // Global mouse up listener
  useEffect(() => {
    const handleGlobalMouseUp = () => setIsPanning(false);
    window.addEventListener('mouseup', handleGlobalMouseUp);
    return () => window.removeEventListener('mouseup', handleGlobalMouseUp);
  }, []);

  // Expose zoom controls via custom events
  useEffect(() => {
    const handleZoomChange = (e: CustomEvent) => {
      const newZoomPercentage = e.detail.zoom;
      const isFitting = e.detail.isFitting ?? false;
      
      if (isFitting) {
        // Fit to screen
        const fit = calculateFitToScreen();
        setZoom(fit.zoom);
        setPan(fit.pan);
      } else {
        // Set specific zoom percentage and re-center
        const newZoom = Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, newZoomPercentage / 100));
        const centeredPos = calculateCenteredPosition(newZoom);
        const constrainedPos = constrainPan(centeredPos.x, centeredPos.y, newZoom);
        setZoom(newZoom);
        setPan(constrainedPos);
      }
    };

    window.addEventListener('kanva-zoom-change', handleZoomChange as EventListener);
    return () => window.removeEventListener('kanva-zoom-change', handleZoomChange as EventListener);
  }, [calculateFitToScreen, calculateCenteredPosition, constrainPan]);

  // Expose zoom percentage for UI
  useEffect(() => {
    const event = new CustomEvent('canvas-zoom-updated', { detail: { zoom: Math.round(zoom * 100) } });
    window.dispatchEvent(event);
  }, [zoom]);

  return (
    <div
      ref={containerRef}
      className="w-full h-full relative overflow-hidden bg-muted"
      onWheel={handleWheel}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      style={{ 
        cursor: isPanning ? 'grabbing' : 'default',
        touchAction: 'none', // Prevent default touch behaviors for pinch zoom
      }}
    >
      {/* Canvas content with pan and zoom transform */}
      <div
        style={{
          transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
          transformOrigin: '0 0',
          position: 'absolute',
          top: 0,
          left: 0,
        }}
      >
        <Artboard />
        <AlignmentGuides />
      </div>

      {/* Canvas info overlay */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 pointer-events-none z-50">
        <div className="bg-gray-800 text-white text-xs px-3 py-1 rounded font-mono shadow-lg whitespace-nowrap">
          {canvas.width} × {canvas.height}px • {Math.round(zoom * 100)}%
        </div>
      </div>
    </div>
  );
}


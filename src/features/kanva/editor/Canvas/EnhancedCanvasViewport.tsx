'use client';

import React, { useRef, useState, useCallback, useEffect } from 'react';
import { useGesture } from '@use-gesture/react';
import { useEditorStore } from '../../lib/editor/store';
import { Artboard } from './Artboard';
import { AlignmentGuides } from './AlignmentGuides';

/**
 * EnhancedCanvasViewport - Improved canvas with @use-gesture/react
 * Features:
 * - Smooth trackpad pinch zoom
 * - Momentum scrolling
 * - Better touch support
 * - Improved performance
 */
export function EnhancedCanvasViewport() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [animatedCanvasSize, setAnimatedCanvasSize] = useState({ width: 1080, height: 1080 });
  const MIN_ZOOM = 0.25;
  const MAX_ZOOM = 5;
  const canvas = useEditorStore((s) => s.canvas);

  // Calculate fit-to-screen zoom and centering
  const calculateFitToScreen = useCallback(() => {
    if (!containerRef.current) return { zoom: 1, pan: { x: 0, y: 0 } };
    
    const container = containerRef.current.getBoundingClientRect();
    const padding = 100; // Increased padding for better visibility
    const availableWidth = Math.max(100, container.width - padding * 2);
    const availableHeight = Math.max(100, container.height - padding * 2);
    
    // Calculate scale to fit canvas with padding
    const scaleX = availableWidth / canvas.width;
    const scaleY = availableHeight / canvas.height;
    const fitZoom = Math.min(scaleX, scaleY, 1); // Don't zoom in beyond 100%
    
    // Ensure minimum zoom for visibility
    const finalZoom = Math.max(fitZoom, MIN_ZOOM);
    
    const containerCenterX = container.width / 2;
    const containerCenterY = container.height / 2;
    const artboardCenterX = (canvas.width * finalZoom) / 2;
    const artboardCenterY = (canvas.height * finalZoom) / 2;
    
    return {
      zoom: finalZoom,
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
    
    // Always keep horizontally centered
    const centeredX = (container.width - artboardWidth) / 2;
    
    // Allow vertical scrolling with generous bounds
    // Allow scrolling to see entire canvas plus some padding
    const padding = 100;
    const maxPanY = padding; // Can scroll down to see top
    const minPanY = container.height - artboardHeight - padding; // Can scroll up to see bottom
    
    // If canvas is smaller than container, center it
    if (artboardHeight < container.height) {
      return {
        x: centeredX,
        y: (container.height - artboardHeight) / 2,
      };
    }
    
    return {
      x: centeredX,
      y: Math.max(minPanY, Math.min(maxPanY, panY)),
    };
  }, [canvas.width, canvas.height]);

  // Smooth canvas size animation
  useEffect(() => {
    const startSize = { ...animatedCanvasSize };
    const targetSize = { width: canvas.width, height: canvas.height };
    
    // If sizes are the same, no animation needed
    if (startSize.width === targetSize.width && startSize.height === targetSize.height) {
      return;
    }
    
    const duration = 500; // 500ms animation
    const startTime = performance.now();
    
    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Ease-out cubic for smooth deceleration
      const eased = 1 - Math.pow(1 - progress, 3);
      
      const currentWidth = startSize.width + (targetSize.width - startSize.width) * eased;
      const currentHeight = startSize.height + (targetSize.height - startSize.height) * eased;
      
      setAnimatedCanvasSize({
        width: Math.round(currentWidth),
        height: Math.round(currentHeight),
      });
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };
    
    requestAnimationFrame(animate);
  }, [canvas.width, canvas.height]);

  // Initialize fit-to-screen on mount and when canvas size changes
  const hasInitialized = useRef(false);
  const previousCanvasSize = useRef({ width: canvas.width, height: canvas.height });
  
  useEffect(() => {
    // Check if canvas size actually changed (user selected new size)
    const sizeChanged = 
      previousCanvasSize.current.width !== canvas.width || 
      previousCanvasSize.current.height !== canvas.height;
    
    // Fit to screen if: first load OR user changed canvas size
    if (!hasInitialized.current || sizeChanged) {
      // Show transition animation for size changes (not initial load)
      if (hasInitialized.current && sizeChanged) {
        setIsTransitioning(true);
      }
      
      const timer = setTimeout(() => {
        const fit = calculateFitToScreen();
        setZoom(fit.zoom);
        setPan(fit.pan);
        hasInitialized.current = true;
        previousCanvasSize.current = { width: canvas.width, height: canvas.height };
        
        // End transition after animation completes
        if (sizeChanged) {
          setTimeout(() => setIsTransitioning(false), 500);
        }
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [canvas.width, canvas.height, calculateFitToScreen]);

  // Handle container resize
  useEffect(() => {
    if (!containerRef.current) return;

    let resizeTimer: NodeJS.Timeout;
    const resizeObserver = new ResizeObserver(() => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        const fit = calculateFitToScreen();
        const currentZoomPercent = Math.round(zoom * 100);
        const fitZoomPercent = Math.round(fit.zoom * 100);
        
        if (Math.abs(currentZoomPercent - fitZoomPercent) < 5) {
          setZoom(fit.zoom);
          setPan(fit.pan);
        } else {
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

  // Enhanced gesture handling with @use-gesture/react
  const bindGestures = useGesture(
    {
      // Pinch to zoom (trackpad and touch)
      onPinch: ({ offset: [scale], origin: [ox, oy], first, memo }) => {
        if (!containerRef.current) return;

        if (first) {
          // Store initial state
          const rect = containerRef.current.getBoundingClientRect();
          return {
            initialZoom: zoom,
            initialPan: { ...pan },
            origin: { x: ox - rect.left, y: oy - rect.top },
          };
        }

        // Calculate new zoom
        const newZoom = Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, memo.initialZoom * scale));
        
        // Zoom towards pinch origin
        const artboardX = (memo.origin.x - memo.initialPan.x) / memo.initialZoom;
        const artboardY = (memo.origin.y - memo.initialPan.y) / memo.initialZoom;
        
        const newPanX = memo.origin.x - artboardX * newZoom;
        const newPanY = memo.origin.y - artboardY * newZoom;
        
        const constrainedPan = constrainPan(newPanX, newPanY, newZoom);
        
        setZoom(newZoom);
        setPan(constrainedPan);

        return memo;
      },

      // Wheel for zoom (scroll wheel and trackpad)
      onWheel: ({ event, delta: [, dy], ctrlKey }) => {
        event.preventDefault();
        
        if (!containerRef.current) return;
        
        const rect = containerRef.current.getBoundingClientRect();
        const mouseX = (event as WheelEvent).clientX - rect.left;
        const mouseY = (event as WheelEvent).clientY - rect.top;
        
        // Detect pinch zoom vs scroll
        const isPinchZoom = ctrlKey;
        
        if (isPinchZoom) {
          // Trackpad pinch zoom
          const sensitivity = 0.01;
          const zoomDelta = -dy * sensitivity;
          const zoomFactor = 1 + zoomDelta;
          const newZoom = Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, zoom * zoomFactor));
          
          // Zoom towards mouse
          const artboardX = (mouseX - pan.x) / zoom;
          const artboardY = (mouseY - pan.y) / zoom;
          
          const newPanX = mouseX - artboardX * newZoom;
          const newPanY = mouseY - artboardY * newZoom;
          
          const constrainedPan = constrainPan(newPanX, newPanY, newZoom);
          
          setZoom(newZoom);
          setPan(constrainedPan);
        } else {
          // Regular scroll - pan vertically
          const scrollSensitivity = 1;
          const newPanY = pan.y - (dy * scrollSensitivity);
          const constrainedPan = constrainPan(pan.x, newPanY, zoom);
          setPan(constrainedPan);
        }
      },

      // Drag for panning (Shift + drag for vertical only)
      onDrag: ({ offset: [, y], event, first, memo }) => {
        const shiftKey = (event as MouseEvent).shiftKey;
        
        if (!shiftKey) return;
        
        if (first) {
          return { initialPan: { ...pan } };
        }

        const newPanY = memo.initialPan.y + y;
        const constrainedPan = constrainPan(pan.x, newPanY, zoom);
        
        setPan(constrainedPan);

        return memo;
      },
    },
    {
      eventOptions: { passive: false },
      pinch: {
        scaleBounds: { min: MIN_ZOOM, max: MAX_ZOOM },
        rubberband: true,
      },
      drag: {
        filterTaps: true,
      },
    }
  );

  // Expose zoom controls via custom events
  useEffect(() => {
    const handleZoomChange = (e: CustomEvent) => {
      const newZoomPercentage = e.detail.zoom;
      const isFitting = e.detail.isFitting ?? false;
      
      if (isFitting) {
        const fit = calculateFitToScreen();
        setZoom(fit.zoom);
        setPan(fit.pan);
      } else {
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
      {...bindGestures()}
      className="w-full h-full relative overflow-hidden bg-muted"
      style={{ 
        touchAction: 'none',
        cursor: 'default',
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
          willChange: 'transform',
          transition: isTransitioning ? 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)' : 'none',
        }}
      >
        <Artboard animatedSize={animatedCanvasSize} />
        <AlignmentGuides />
      </div>
      
      {/* Smooth transition overlay when canvas size changes */}
      {isTransitioning && (
        <div 
          className="absolute inset-0 bg-background/50 backdrop-blur-sm z-40 flex items-center justify-center"
          style={{
            animation: 'fadeIn 0.2s ease-out',
          }}
        >
          <div className="bg-card border border-border rounded-lg px-6 py-4 shadow-xl">
            <div className="flex items-center gap-3">
              <div className="w-5 h-5 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
              <span className="text-sm font-medium">Resizing canvas...</span>
            </div>
          </div>
        </div>
      )}

      {/* Canvas info moved to bottom bar */}
    </div>
  );
}

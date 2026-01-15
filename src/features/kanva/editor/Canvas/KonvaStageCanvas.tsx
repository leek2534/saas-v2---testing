/**
 * KonvaStage - Main canvas component using Konva.js
 * Handles rendering, snapping, and alignment guides like Polotno
 */

'use client';

import { useEffect, useRef, useState } from 'react';
import { Stage, Layer, Rect, Text as KonvaText, Circle, Line, Transformer, Group, Image as KonvaImage } from 'react-konva';
import useImage from 'use-image';
import Konva from 'konva';
import { useGesture } from '@use-gesture/react';
import { useEditorStore } from '../../lib/editor/store';
import { FloatingToolbar } from './FloatingToolbar';

const SNAP_THRESHOLD = 10;
const ROTATION_SNAP_THRESHOLD = 5; // degrees
const ROTATION_SNAP_ANGLES = [0, 45, 90, 135, 180, 225, 270, 315];

const measureTextDimensions = (element: any) => {
  // Konva uses fontStyle for both style and weight combined (e.g., "italic bold")
  const fontStyle = `${element.fontStyle || 'normal'} ${element.fontWeight || 'normal'}`;
  const textNode = new Konva.Text({
    text: element.text || 'Text',
    fontSize: element.fontSize || 32,
    fontFamily: element.fontFamily || 'Inter',
    fontStyle,
    align: element.align || 'left',
    lineHeight: element.lineHeight || 1.2,
    width: element.width,
    wrap: 'word',
  });

  return {
    width: textNode.width(),
    height: textNode.height(),
  };
};

type SnapLine = {
  pos: number;
  isCanvas: boolean;
  elementId?: string;
  bounds?: { min: number; max: number };
};

// ============================================
// ELEMENT COMPONENTS - Must be OUTSIDE main component for hooks to work!
// ============================================

// Debug helper for video loading
const debugVideo = (message: string, element: any) => {
  console.log(`🎬 Video Debug [${element.id}]: ${message}`, {
    src: element.src,
    loaded: element.videoLoaded,
    playing: element.isPlaying
  });
};

// Image element component
function ImageElement({ element, isHovered, showOutline, onSelect, onHover, onDragMove, onDragEnd }: any) {
  const [image] = useImage(element.src || element.url || '');

  return (
    <Group
      id={element.id}
      name="draggable"
      x={element.x}
      y={element.y}
      rotation={element.rotation || 0}
      draggable
      onClick={(e: any) => onSelect(element.id, e)}
      onTap={(e: any) => onSelect(element.id, e)}
      onMouseEnter={() => onHover(element.id)}
      onMouseLeave={() => onHover(null)}
      onDragMove={onDragMove}
      onDragEnd={onDragEnd}
    >
      {image ? (
        <KonvaImage
          image={image}
          width={element.width}
          height={element.height}
          opacity={isHovered ? 0.9 : 1}
        />
      ) : (
        <Rect
          width={element.width}
          height={element.height}
          fill="#f0f0f0"
          stroke="#ddd"
          strokeWidth={1}
        />
      )}
      {showOutline && (
        <Rect
          x={0}
          y={0}
          width={element.width}
          height={element.height}
          stroke="#6366F1"
          strokeWidth={3}
        />
      )}
    </Group>
  );
}

// Icon element component - renders SVG path icons
function IconElement({ element, isHovered, showOutline, onSelect, onHover, onDragMove, onDragEnd }: any) {
  const iconSvg = element.iconPath
    ? `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="${element.width}" height="${element.height}"><path d="${element.iconPath}" fill="${element.fill || '#000000'}" stroke="${element.stroke || 'none'}" stroke-width="${element.strokeWidth || 0}"/></svg>`
    : null;
  const svgDataUrl = iconSvg ? `data:image/svg+xml;base64,${btoa(iconSvg)}` : '';
  const [image] = useImage(svgDataUrl);

  return (
    <Group
      id={element.id}
      name="draggable"
      x={element.x}
      y={element.y}
      rotation={element.rotation || 0}
      draggable
      onClick={(e: any) => onSelect(element.id, e)}
      onTap={(e: any) => onSelect(element.id, e)}
      onMouseEnter={() => onHover(element.id)}
      onMouseLeave={() => onHover(null)}
      onDragMove={onDragMove}
      onDragEnd={onDragEnd}
    >
      {image ? (
        <KonvaImage
          image={image}
          width={element.width}
          height={element.height}
          opacity={isHovered ? 0.9 : 1}
        />
      ) : (
        <Rect
          width={element.width}
          height={element.height}
          fill="#f0f0f0"
          stroke="#ddd"
          strokeWidth={1}
        />
      )}
      {showOutline && (
        <Rect
          x={0}
          y={0}
          width={element.width}
          height={element.height}
          stroke="#6366F1"
          strokeWidth={3}
        />
      )}
    </Group>
  );
}

// Video element component - renders actual playable video using HTML5 overlay
function VideoElement({ element, isHovered, showOutline, onSelect, onHover, onDragMove, onDragEnd, zoom = 1, stageRef }: any) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showControls, setShowControls] = useState(false);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  // Calculate video position on screen
  const getVideoPosition = () => {
    if (!stageRef || !stageRef.current) return { x: 0, y: 0, width: 0, height: 0 };

    const stage = stageRef.current;
    const stageBox = stage.container().getBoundingClientRect();
    const scale = zoom;

    // Convert canvas coordinates to screen coordinates
    const screenX = stageBox.left + (element.x * scale);
    const screenY = stageBox.top + (element.y * scale);
    const screenWidth = element.width * scale;
    const screenHeight = element.height * scale;

    return { x: screenX, y: screenY, width: screenWidth, height: screenHeight };
  };

  // Handle video loading
  useEffect(() => {
    if (!element.src) return;

    debugVideo('Initializing video element', element);

    // Reset state when src changes
    setVideoLoaded(false);
    setIsPlaying(false);
    setHasError(false);

    if (!videoRef.current) {
      debugVideo('Video ref not available', element);
      return;
    }

    const video = videoRef.current;
    video.src = element.src;
    video.preload = 'metadata';

    // Apply video properties
    video.autoplay = false; // Never autoplay to avoid browser restrictions
    video.loop = element.loop || false;
    video.muted = element.muted !== false; // Default to muted to allow autoplay
    video.controls = false; // We handle controls ourselves

    const handleLoadedMetadata = () => {
      debugVideo('Loaded metadata', element);
      setVideoLoaded(true);
    };

    const handlePlay = () => {
      debugVideo('Started playing', element);
      setIsPlaying(true);
    };

    const handlePause = () => {
      debugVideo('Paused', element);
      setIsPlaying(false);
    };

    const handleError = (e: any) => {
      debugVideo(`Load error: ${e?.message || 'Unknown error'}`, element);
      setVideoLoaded(false);
      setHasError(true);
    };

    const handleCanPlay = () => {
      debugVideo('Can play', element);
    };

    video.addEventListener('loadedmetadata', handleLoadedMetadata);
    video.addEventListener('play', handlePlay);
    video.addEventListener('pause', handlePause);
    video.addEventListener('error', handleError);
    video.addEventListener('canplay', handleCanPlay);

    // Force load
    video.load();

    return () => {
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
      video.removeEventListener('play', handlePlay);
      video.removeEventListener('pause', handlePause);
      video.removeEventListener('error', handleError);
      video.removeEventListener('canplay', handleCanPlay);
    };
  }, [element.src, element.loop, element.muted]);

  // Update video position when zoom or element changes (for dynamic updates)
  useEffect(() => {
    if (!videoRef.current || !stageRef || !stageRef.current) return;

    const position = getVideoPosition();
    const video = videoRef.current;

    video.style.left = `${position.x}px`;
    video.style.top = `${position.y}px`;
    video.style.width = `${position.width}px`;
    video.style.height = `${position.height}px`;
    video.style.pointerEvents = showControls ? 'auto' : 'none';
  }, [zoom, element.x, element.y, element.width, element.height, showControls, videoLoaded]);

  const handleClick = (e: any) => {
    if (!videoRef.current) {
      onSelect(element.id, e);
      return;
    }

    const video = videoRef.current;

    if (!videoLoaded) {
      // Video not loaded yet, just select the element
      onSelect(element.id, e);
      return;
    }

    // Toggle play/pause
    if (video.paused || video.ended) {
      video.play().catch((error) => {
        console.warn('Video play failed:', error);
        // Show controls on play failure
        setShowControls(true);
      });
    } else {
      video.pause();
    }

    onSelect(element.id, e);
  };

  // Get current video position for rendering
  const currentPosition = getVideoPosition();

  return (
    <>
      {/* HTML5 Video Element (positioned absolutely) */}
      {element.src && (
        <video
          ref={videoRef}
          style={{
            position: 'fixed',
            left: `${currentPosition.x}px`,
            top: `${currentPosition.y}px`,
            width: `${currentPosition.width}px`,
            height: `${currentPosition.height}px`,
            pointerEvents: showControls ? 'auto' : 'none',
            zIndex: 1000,
            borderRadius: '4px',
            display: videoLoaded ? 'block' : 'none',
            objectFit: 'cover',
          }}
          onMouseEnter={() => setShowControls(true)}
          onMouseLeave={() => setShowControls(false)}
          playsInline
        />
      )}

      {/* Konva Placeholder/Group for interaction */}
      <Group
        id={element.id}
        name="draggable"
        x={element.x}
        y={element.y}
        rotation={element.rotation || 0}
        draggable
        onClick={handleClick}
        onTap={(e: any) => onSelect(element.id, e)}
        onMouseEnter={() => {
          onHover(element.id);
          setShowControls(true);
        }}
        onMouseLeave={() => {
          onHover(null);
          setShowControls(false);
        }}
        onDragMove={onDragMove}
        onDragEnd={onDragEnd}
      >
        {/* Video container background (shown when video not loaded or paused) */}
        <Rect
          width={element.width}
          height={element.height}
          fill="#000000"
          cornerRadius={4}
          opacity={isHovered ? 1 : 0.8}
        />

        {/* Show placeholder when video not loaded or not playing */}
        {(!videoLoaded || !isPlaying || hasError) && (
          <>
            {/* Different states: loading, error, or ready to play */}
            {hasError ? (
              // Error state
              <>
                <Circle
                  x={element.width / 2}
                  y={element.height / 2}
                  radius={Math.min(element.width, element.height) / 8}
                  fill="rgba(239, 68, 68, 0.8)"
                  stroke="rgba(255, 255, 255, 0.5)"
                  strokeWidth={2}
                />
                <KonvaText
                  x={0}
                  y={element.height / 2 - 6}
                  width={element.width}
                  text="Error"
                  fontSize={10}
                  fill="#ffffff"
                  align="center"
                  opacity={0.8}
                />
              </>
            ) : !videoLoaded ? (
              // Loading state
              <>
                <Circle
                  x={element.width / 2}
                  y={element.height / 2}
                  radius={Math.min(element.width, element.height) / 8}
                  fill="rgba(255, 255, 255, 0.2)"
                  stroke="rgba(255, 255, 255, 0.5)"
                  strokeWidth={2}
                />
                <KonvaText
                  x={0}
                  y={element.height / 2 - 6}
                  width={element.width}
                  text="Loading..."
                  fontSize={10}
                  fill="#ffffff"
                  align="center"
                  opacity={0.8}
                />
              </>
            ) : (
              // Play button for loaded but paused video
              <>
                <Circle
                  x={element.width / 2}
                  y={element.height / 2}
                  radius={Math.min(element.width, element.height) / 6}
                  fill="rgba(0, 0, 0, 0.7)"
                  stroke="rgba(255, 255, 255, 0.5)"
                  strokeWidth={2}
                />
                <Line
                  points={[
                    element.width / 2 - 8, element.height / 2 - 12,
                    element.width / 2 - 8, element.height / 2 + 12,
                    element.width / 2 + 12, element.height / 2,
                  ]}
                  fill="#ffffff"
                  closed
                />
              </>
            )}

            {/* Video label */}
            <KonvaText
              x={0}
              y={element.height - 25}
              width={element.width}
              text={
                hasError ? "Video failed to load" :
                videoLoaded ? "Click to play" :
                "Loading video..."
              }
              fontSize={12}
              fill="#ffffff"
              align="center"
              opacity={0.8}
            />
          </>
        )}

        {/* Play/pause controls overlay */}
        {showControls && (
          <Circle
            x={element.width - 20}
            y={20}
            radius={12}
            fill="rgba(0, 0, 0, 0.7)"
            stroke="rgba(255, 255, 255, 0.5)"
            strokeWidth={1}
          />
        )}

        {/* Play/Pause icon */}
        {showControls && (
          isPlaying ? (
            // Pause icon
            <>
              <Rect
                x={element.width - 26}
                y={16}
                width={4}
                height={8}
                fill="#ffffff"
              />
              <Rect
                x={element.width - 18}
                y={16}
                width={4}
                height={8}
                fill="#ffffff"
              />
            </>
          ) : (
            // Play icon
            <Line
              points={[
                element.width - 26, 16,
                element.width - 26, 24,
                element.width - 16, 20,
              ]}
              fill="#ffffff"
              closed
            />
          )
        )}

        {showOutline && (
          <Rect
            x={0}
            y={0}
            width={element.width}
            height={element.height}
            stroke="#6366F1"
            strokeWidth={3}
            cornerRadius={4}
          />
        )}
      </Group>
    </>
  );
}

// ============================================
// MAIN CANVAS COMPONENT
// ============================================

export function KonvaStageCanvas() {
  const stageRef = useRef<Konva.Stage>(null);
  const transformerRef = useRef<Konva.Transformer>(null);
  
  const canvas = useEditorStore((s) => s.canvas);
  const elements = useEditorStore((s) => s.elements);
  const selectedIds = useEditorStore((s) => s.selectedIds);
  const setSelectedIds = useEditorStore((s) => s.setSelectedIds);
  const updateElement = useEditorStore((s) => s.updateElement);
  const showAlignmentGuides = useEditorStore((s) => s.showAlignmentGuides) ?? true;
  const setActiveGuides = useEditorStore((s) => s.setActiveGuides);
  const activeGuides = useEditorStore((s) => s.activeGuides) ?? [];
  
  const [zoom, setZoom] = useState(0.5); // Start at 50% to fit in viewport
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  type EditingTextState = {
    id: string;
    textNode: Konva.Text;
  };

  // Text editing state
  const [editingText, setEditingText] = useState<EditingTextState | null>(null);
  const textAreaRef = useRef<HTMLTextAreaElement | null>(null);
  
  // Box selection state (Konva best practice)
  const [isSelecting, setIsSelecting] = useState(false);
  const [selectionBox, setSelectionBox] = useState({
    visible: false,
    x1: 0,
    y1: 0,
    x2: 0,
    y2: 0,
  });
  
  // Handle wheel zoom
  const handleWheel = (e: Konva.KonvaEventObject<WheelEvent>) => {
    e.evt.preventDefault();
    
    const stage = stageRef.current;
    if (!stage) return;
    
    const oldScale = zoom;
    const pointer = stage.getPointerPosition();
    if (!pointer) return;
    
    const scaleBy = 1.05;
    const newScale = e.evt.deltaY > 0 ? oldScale / scaleBy : oldScale * scaleBy;
    const clampedScale = Math.max(0.1, Math.min(3, newScale));
    
    setZoom(clampedScale);
    
    // Notify BottomBar
    window.dispatchEvent(new CustomEvent('canvas-zoom-updated', { 
      detail: { zoom: Math.round(clampedScale * 100) } 
    }));
  };
  
  // Calculate initial zoom to fit canvas in viewport
  useEffect(() => {
    if (!containerRef.current) return;
    
    const container = containerRef.current;
    const containerWidth = container.clientWidth;
    const containerHeight = container.clientHeight;
    
    // Calculate zoom to fit with some padding (80% of viewport)
    const scaleX = (containerWidth * 0.8) / canvas.width;
    const scaleY = (containerHeight * 0.8) / canvas.height;
    const initialZoom = Math.min(scaleX, scaleY, 1); // Don't zoom in beyond 100%
    
    setZoom(initialZoom);
    
    // Notify BottomBar of initial zoom
    window.dispatchEvent(new CustomEvent('canvas-zoom-updated', { 
      detail: { zoom: Math.round(initialZoom * 100) } 
    }));
  }, [canvas.width, canvas.height]);
  
  // Listen to zoom changes from BottomBar
  useEffect(() => {
    const handleZoomChange = (e: CustomEvent) => {
      const { zoom: zoomPercent, isFitting } = e.detail;
      
      if (isFitting && containerRef.current) {
        // Fit to screen
        const container = containerRef.current;
        const containerWidth = container.clientWidth;
        const containerHeight = container.clientHeight;
        const scaleX = (containerWidth * 0.8) / canvas.width;
        const scaleY = (containerHeight * 0.8) / canvas.height;
        const fitZoom = Math.min(scaleX, scaleY, 1);
        setZoom(fitZoom);
        
        // Update BottomBar
        window.dispatchEvent(new CustomEvent('canvas-zoom-updated', { 
          detail: { zoom: Math.round(fitZoom * 100) } 
        }));
      } else {
        // Set specific zoom level
        const newZoom = zoomPercent / 100;
        setZoom(newZoom);
      }
    };
    
    window.addEventListener('kanva-zoom-change', handleZoomChange as EventListener);
    return () => {
      window.removeEventListener('kanva-zoom-change', handleZoomChange as EventListener);
    };
  }, [canvas.width, canvas.height]);
  
  // Pinch-to-zoom gesture
  useGesture(
    {
      onPinch: ({ offset: [scale] }) => {
        const clampedScale = Math.max(0.1, Math.min(3, scale));
        setZoom(clampedScale);
        
        // Notify BottomBar
        window.dispatchEvent(new CustomEvent('canvas-zoom-updated', { 
          detail: { zoom: Math.round(clampedScale * 100) } 
        }));
      },
    },
    {
      target: containerRef,
      eventOptions: { passive: false },
      pinch: { scaleBounds: { min: 0.1, max: 3 }, rubberband: true },
    }
  );
  
  // Kanva doesn't need stage reference in store
  useEffect(() => {
    // Skip - Kanva store doesn't have setStage
  }, []);
  
  // Get snap guide lines - Konva best practice approach
  // Works for all canvas sizes (1080x1080, 1920x1080, etc.)
  const getLineGuideStops = (skipNode: Konva.Node) => {
    const vertical: SnapLine[] = [];
    const horizontal: SnapLine[] = [];
    
    // Stage borders and center - always snap to canvas edges
    vertical.push({ pos: 0, isCanvas: true });
    vertical.push({ pos: canvas.width / 2, isCanvas: true });
    vertical.push({ pos: canvas.width, isCanvas: true });
    horizontal.push({ pos: 0, isCanvas: true });
    horizontal.push({ pos: canvas.height / 2, isCanvas: true });
    horizontal.push({ pos: canvas.height, isCanvas: true });
    
    // Get all shapes on stage (excluding the one being dragged)
    const stage = stageRef.current;
    if (!stage) return { vertical, horizontal };
    
    stage.find('.draggable').forEach((guideItem) => {
      if (guideItem === skipNode) return;
      
      // Use getClientRect for accurate bounds (handles rotation, scale, etc.)
      const box = guideItem.getClientRect();
      
      // Snap to all edges and center of each shape
      vertical.push({ 
        pos: box.x, 
        isCanvas: false, 
        elementId: guideItem.id(),
        bounds: { min: box.y, max: box.y + box.height }
      });
      vertical.push({ 
        pos: box.x + box.width / 2, 
        isCanvas: false, 
        elementId: guideItem.id(),
        bounds: { min: box.y, max: box.y + box.height }
      });
      vertical.push({ 
        pos: box.x + box.width, 
        isCanvas: false, 
        elementId: guideItem.id(),
        bounds: { min: box.y, max: box.y + box.height }
      });
      
      horizontal.push({ 
        pos: box.y, 
        isCanvas: false, 
        elementId: guideItem.id(),
        bounds: { min: box.x, max: box.x + box.width }
      });
      horizontal.push({ 
        pos: box.y + box.height / 2, 
        isCanvas: false, 
        elementId: guideItem.id(),
        bounds: { min: box.x, max: box.x + box.width }
      });
      horizontal.push({ 
        pos: box.y + box.height, 
        isCanvas: false, 
        elementId: guideItem.id(),
        bounds: { min: box.x, max: box.x + box.width }
      });
    });
    
    return { vertical, horizontal };
  };
  
  // Handle element drag with snapping - Konva best practice
  const handleDragMove = (e: Konva.KonvaEventObject<DragEvent>) => {
    const node = e.target;
    const element = elements.find((el) => el.id === node.id());
    if (!element) return;
    
    // Get all possible snap lines
    const lineGuideStops = getLineGuideStops(node);
    const guides: any[] = [];
    
    // Get snapping edges of current object using getClientRect for accuracy
    const box = node.getClientRect();
    const absPos = node.absolutePosition();
    
    // Define snapping edges for the dragged object
    const itemBounds = {
      vertical: [
        { guide: Math.round(box.x), offset: Math.round(absPos.x - box.x), snap: 'start' },
        { guide: Math.round(box.x + box.width / 2), offset: Math.round(absPos.x - box.x - box.width / 2), snap: 'center' },
        { guide: Math.round(box.x + box.width), offset: Math.round(absPos.x - box.x - box.width), snap: 'end' },
      ],
      horizontal: [
        { guide: Math.round(box.y), offset: Math.round(absPos.y - box.y), snap: 'start' },
        { guide: Math.round(box.y + box.height / 2), offset: Math.round(absPos.y - box.y - box.height / 2), snap: 'center' },
        { guide: Math.round(box.y + box.height), offset: Math.round(absPos.y - box.y - box.height), snap: 'end' },
      ],
    };
    
    // Find all possible snaps
    const resultV: any[] = [];
    const resultH: any[] = [];
    
    lineGuideStops.vertical.forEach((lineGuide) => {
      itemBounds.vertical.forEach((itemBound) => {
        const diff = Math.abs(lineGuide.pos - itemBound.guide);
        if (diff < SNAP_THRESHOLD) {
          resultV.push({
            lineGuide: lineGuide.pos,
            diff: diff,
            snap: itemBound.snap,
            offset: itemBound.offset,
            isCanvas: lineGuide.isCanvas,
            bounds: lineGuide.bounds,
          });
        }
      });
    });
    
    lineGuideStops.horizontal.forEach((lineGuide) => {
      itemBounds.horizontal.forEach((itemBound) => {
        const diff = Math.abs(lineGuide.pos - itemBound.guide);
        if (diff < SNAP_THRESHOLD) {
          resultH.push({
            lineGuide: lineGuide.pos,
            diff: diff,
            snap: itemBound.snap,
            offset: itemBound.offset,
            isCanvas: lineGuide.isCanvas,
            bounds: lineGuide.bounds,
          });
        }
      });
    });
    
    // Find closest snaps
    const minV = resultV.sort((a, b) => a.diff - b.diff)[0];
    const minH = resultH.sort((a, b) => a.diff - b.diff)[0];
    
    // Create guides for rendering
    if (minV) {
      guides.push({
        id: `v-${minV.lineGuide}-${minV.snap}`,
        type: 'v',
        pos: minV.lineGuide,
        isCanvas: minV.isCanvas,
        bounds: minV.bounds,
        elementBounds: minV.isCanvas ? undefined : {
          min: Math.min(box.y, minV.bounds?.min || box.y),
          max: Math.max(box.y + box.height, minV.bounds?.max || box.y + box.height)
        }
      });
      
      // Apply snap
      absPos.x = minV.lineGuide + minV.offset;
    }
    
    if (minH) {
      guides.push({
        id: `h-${minH.lineGuide}-${minH.snap}`,
        type: 'h',
        pos: minH.lineGuide,
        isCanvas: minH.isCanvas,
        bounds: minH.bounds,
        elementBounds: minH.isCanvas ? undefined : {
          min: Math.min(box.x, minH.bounds?.min || box.x),
          max: Math.max(box.x + box.width, minH.bounds?.max || box.x + box.width)
        }
      });
      
      // Apply snap
      absPos.y = minH.lineGuide + minH.offset;
    }
    
    // Update node position
    node.absolutePosition(absPos);
    
    // Update guides safely
    if (setActiveGuides) {
      setActiveGuides(guides);
    }
  };
  
  const handleDragEnd = (e: Konva.KonvaEventObject<DragEvent>) => {
    const node = e.target;
    const element = elements.find((el) => el.id === node.id());
    if (!element) return;

    // Update element position and rotation
    updateElement(element.id, {
      x: node.x(),
      y: node.y(),
      rotation: node.rotation() || 0,
    });

    // Clear guides safely
    if (setActiveGuides) {
      setActiveGuides([]);
    }
  };
  
  // Handle selection
  // Konva best practice: Handle selection with multi-select support
  const handleSelect = (id: string, event?: any) => {
    const metaPressed = event?.evt?.shiftKey || event?.evt?.ctrlKey || event?.evt?.metaKey;
    const isSelected = selectedIds.includes(id);

    if (!metaPressed && !isSelected) {
      // Single select - no modifier keys
      setSelectedIds([id]);
    } else if (metaPressed && isSelected) {
      // Deselect if already selected with modifier
      setSelectedIds(selectedIds.filter(selectedId => selectedId !== id));
    } else if (metaPressed && !isSelected) {
      // Add to selection with modifier
      setSelectedIds([...selectedIds, id]);
    }
  };

  // Handle text editing using Konva's approach
  const handleTextDoubleClick = (element: any) => {
    if (element.type !== 'text') return;

    // Find the Konva text node
    const textNode = stageRef.current?.findOne(`#${element.id}`) as Konva.Text;
    if (!textNode) return;

    // Keep element selected while editing
    setSelectedIds([element.id]);

    // Hide the Konva text node while editing so we don't see double-rendered text.
    // Transformer stays visible so the selection box remains the same.
    textNode.hide();

    setEditingText({
      id: element.id,
      textNode: textNode,
    });
  };

  const handleTextSave = (newText: string) => {
    if (!editingText) return;

    const element = elements.find(el => el.id === editingText.id);
    if (!element || element.type !== 'text') return;

    // Measure final dimensions
    const finalMeasured = measureTextDimensions({
      ...element,
      text: newText,
    });

    updateElement(editingText.id, {
      text: newText,
      height: finalMeasured.height,
    });

    // Show the text node and transformer again
    editingText.textNode.show();
    transformerRef.current?.show();
    transformerRef.current?.forceUpdate();

    setEditingText(null);
  };

  const handleTextCancel = () => {
    if (!editingText) return;
    
    // Show the text node and transformer again without saving
    editingText.textNode.show();
    transformerRef.current?.show();
    transformerRef.current?.forceUpdate();
    
    setEditingText(null);
  };
  
  const handleDeselect = () => {
    setSelectedIds([]);
  };
  
  // Box selection handlers (Konva best practice)
  const handleMouseDown = (e: Konva.KonvaEventObject<MouseEvent>) => {
    if (editingText) {
      return;
    }
    // Start selection if clicking on stage or background (not on draggable elements)
    const clickedOnEmpty = e.target === e.target.getStage() || e.target.name() === 'background';
    
    if (!clickedOnEmpty) {
      return;
    }
    
    setIsSelecting(true);
    const pos = e.target.getStage()!.getPointerPosition()!;
    setSelectionBox({
      visible: true,
      x1: pos.x,
      y1: pos.y,
      x2: pos.x,
      y2: pos.y,
    });
  };
  
  const handleMouseMove = (e: Konva.KonvaEventObject<MouseEvent>) => {
    if (editingText) return;
    if (!isSelecting) return;
    
    const pos = e.target.getStage()!.getPointerPosition()!;
    setSelectionBox(prev => ({
      ...prev,
      x2: pos.x,
      y2: pos.y,
    }));
  };
  
  const handleMouseUp = () => {
    if (editingText) return;
    if (!isSelecting) return;
    
    setIsSelecting(false);
    
    // Calculate selection box bounds
    const box = {
      x: Math.min(selectionBox.x1, selectionBox.x2),
      y: Math.min(selectionBox.y1, selectionBox.y2),
      width: Math.abs(selectionBox.x2 - selectionBox.x1),
      height: Math.abs(selectionBox.y2 - selectionBox.y1),
    };
    
    // Only select if box has some size
    if (box.width > 5 && box.height > 5) {
      // Find elements that intersect with selection box
      const selected = elements.filter(element => {
        const elementBox = {
          x: element.x,
          y: element.y,
          width: element.width || 0,
          height: element.height || 0,
        };
        
        // Check intersection using Konva.Util.haveIntersection
        return Konva.Util.haveIntersection(box, elementBox);
      });
      
      setSelectedIds(selected.map(el => el.id));
    }
    
    // Hide selection box
    setSelectionBox({
      visible: false,
      x1: 0,
      y1: 0,
      x2: 0,
      y2: 0,
    });
  };
  
  // Rotation snapping function
  const snapRotation = (rotation: number): number => {
    // Normalize rotation to 0-360 range
    const normalizedRotation = ((rotation % 360) + 360) % 360;

    for (const snapAngle of ROTATION_SNAP_ANGLES) {
      if (Math.abs(normalizedRotation - snapAngle) <= ROTATION_SNAP_THRESHOLD) {
        return snapAngle;
      }
    }

    return rotation;
  };

  // Update transformer when selection changes
  // Store refs for transform state to avoid stale closures
  const elementsRef = useRef(elements);
  elementsRef.current = elements;

  const updateElementRef = useRef(updateElement);
  updateElementRef.current = updateElement;

  useEffect(() => {
    if (!transformerRef.current || !stageRef.current) return;

    const transformer = transformerRef.current;

    const selectedNodes = selectedIds
      .map((id) => stageRef.current?.findOne(`#${id}`))
      .filter(Boolean) as Konva.Node[];

    transformer.nodes(selectedNodes);

    // Remove old listeners to prevent stacking
    transformer.off('transform');
    transformer.off('transformend');

    if (selectedNodes.length > 0) {
      // During transform: rotation snapping + live side-handle reflow for text
      transformer.on('transform', () => {
        const node = selectedNodes[0];
        if (!node) return;

        // Rotation snapping
        if (node.rotation) {
          const currentRotation = node.rotation();
          const snappedRotation = snapRotation(currentRotation);
          if (Math.abs(snappedRotation - currentRotation) <= ROTATION_SNAP_THRESHOLD) {
            node.rotation(snappedRotation);
          }
        }

        // For text: live reflow on side-handle drag (no stretching)
        const scaleX = node.scaleX();
        const scaleY = node.scaleY();
        const isSideResize = Math.abs(scaleY - 1) < 0.02;

        if (isSideResize && Math.abs(scaleX - 1) > 0.001) {
          const currentElements = elementsRef.current;
          const element = currentElements.find((el) => el.id === node.id());

          if (element?.type === 'text') {
            const baseElement = element as any;

            // Calculate new width from current scale
            const newWidth = Math.max(node.width() * scaleX, 20);

            // Measure new height for text reflow
            const remeasured = measureTextDimensions({
              ...baseElement,
              width: newWidth,
            });

            // Apply directly to node (no stretching)
            node.scaleX(1);
            node.scaleY(1);
            node.width(newWidth);
            node.height(remeasured.height);
          }
        }
      });

      // On transform end, apply final dimensions
      transformer.on('transformend', () => {
        const node = selectedNodes[0];
        if (!node) return;

        const currentElements = elementsRef.current;
        const element = currentElements.find((el) => el.id === node.id());
        if (!element) return;

        const scaleX = node.scaleX();
        const scaleY = node.scaleY();

        if (element.type === 'text') {
          const baseElement = element as any;
          const baseWidth =
            typeof baseElement.width === 'number'
              ? baseElement.width
              : measureTextDimensions(baseElement).width;
          const baseFontSize = baseElement.fontSize || 32;

          // Calculate new width from scale
          const newWidth = Math.max(node.width() * scaleX, 20);

          // Side resize: scaleY stays ~1, only width changes
          const isSideResize = Math.abs(scaleY - 1) < 0.05;

          const updates: any = {
            x: node.x(),
            y: node.y(),
            rotation: node.rotation() || 0,
          };

          if (isSideResize) {
            // Width-only: keep fontSize, reflow height
            const remeasured = measureTextDimensions({
              ...baseElement,
              width: newWidth,
            });

            updates.width = newWidth;
            updates.height = remeasured.height;
          } else {
            // Corner resize: scale fontSize + width together
            const avgScale = (Math.abs(scaleX) + Math.abs(scaleY)) / 2 || 1;
            const newFontSize = baseFontSize * avgScale;
            const scaledWidth = baseWidth * avgScale;

            const remeasured = measureTextDimensions({
              ...baseElement,
              fontSize: newFontSize,
              width: scaledWidth,
            });

            updates.fontSize = newFontSize;
            updates.width = scaledWidth;
            updates.height = remeasured.height;
          }

          updateElementRef.current(element.id, updates);

          // Reset scale after applying dimensions
          node.scaleX(1);
          node.scaleY(1);
        } else {
          // Non-text elements: standard resize
          updateElementRef.current(element.id, {
            x: node.x(),
            y: node.y(),
            rotation: node.rotation() || 0,
            width: node.width() * scaleX,
            height: node.height() * scaleY,
          });

          node.scaleX(1);
          node.scaleY(1);
        }
      });
    }

    transformer.getLayer()?.batchDraw();

    return () => {
      transformer.off('transform');
      transformer.off('transformend');
    };
  }, [selectedIds, editingText]);
  
  // Render element based on type
  const renderElement = (element: any) => {
    const isSelected = selectedIds.includes(element.id);
    const isHovered = hoveredId === element.id;
    const showOutline = isHovered && !isSelected;

    switch (element.type) {
      case 'text': {
        // Measure text to get actual bounds with wrapping support
        const measured = measureTextDimensions(element);
        const textWidth = element.width ?? measured.width;
        const textHeight = measured.height;
        const isEditingThisText = editingText?.id === element.id;
        return (
          <Group
            key={element.id}
            id={element.id}
            name="draggable"
            x={element.x}
            y={element.y}
            width={textWidth}
            height={textHeight}
            rotation={element.rotation || 0}
            draggable={!isEditingThisText}
            listening={!isEditingThisText}
            onClick={(e) => handleSelect(element.id, e)}
            onTap={(e) => handleSelect(element.id, e)}
            onDblClick={() => handleTextDoubleClick(element)}
            onMouseEnter={() => setHoveredId(element.id)}
            onMouseLeave={() => setHoveredId(null)}
            onDragMove={handleDragMove}
            onDragEnd={handleDragEnd}
          >
            {/* Invisible bounding rect for accurate Transformer selection */}
            <Rect
              x={0}
              y={0}
              width={textWidth}
              height={textHeight}
              fill="transparent"
              listening={true}
            />
            {showOutline && (
              <Rect
                x={-4}
                y={-4}
                width={textWidth + 8}
                height={textHeight + 8}
                stroke="#6366F1"
                strokeWidth={2}
                cornerRadius={4}
              />
            )}
            <KonvaText
              text={element.text || 'Text'}
              fontSize={element.fontSize || 32}
              fontFamily={element.fontFamily || 'Inter'}
              fontStyle={`${element.fontStyle || 'normal'} ${element.fontWeight || 'normal'}`}
              fill={element.fill || '#000000'}
              opacity={isEditingThisText ? 0 : isHovered ? 0.9 : 1}
              width={textWidth}
              height={textHeight}
              lineHeight={element.lineHeight || 1.2}
              align={element.align || 'left'}
              verticalAlign={element.verticalAlign || 'top'}
              wrap="word"
              listening={false}
            />
          </Group>
        );
      }
      
      case 'shape':
        if (element.shapeType === 'rect') {
          return (
            <Rect
              key={element.id}
              id={element.id}
              name="draggable"
              x={element.x}
              y={element.y}
              width={element.width}
              height={element.height}
              rotation={element.rotation || 0}
              fill={element.fill || '#4F46E5'}
              stroke={showOutline ? '#6366F1' : element.stroke}
              strokeWidth={showOutline ? 3 : element.strokeWidth || 0}
              opacity={isHovered ? 0.9 : 1}
              draggable
              onClick={(e) => handleSelect(element.id, e)}
              onTap={(e) => handleSelect(element.id, e)}
              onMouseEnter={() => setHoveredId(element.id)}
              onMouseLeave={() => setHoveredId(null)}
              onDragMove={handleDragMove}
              onDragEnd={handleDragEnd}
            />
          );
        } else if (element.shapeType === 'circle') {
          return (
            <Circle
              key={element.id}
              id={element.id}
              name="draggable"
              x={element.x + element.width / 2}
              y={element.y + element.height / 2}
              radius={element.width / 2}
              rotation={element.rotation || 0}
              fill={element.fill || '#EC4899'}
              stroke={showOutline ? '#6366F1' : element.stroke}
              strokeWidth={showOutline ? 3 : element.strokeWidth || 0}
              opacity={isHovered ? 0.9 : 1}
              draggable
              onClick={(e) => handleSelect(element.id, e)}
              onTap={(e) => handleSelect(element.id, e)}
              onMouseEnter={() => setHoveredId(element.id)}
              onMouseLeave={() => setHoveredId(null)}
              onDragMove={handleDragMove}
              onDragEnd={handleDragEnd}
            />
          );
        }
        return null;
      
      case 'image':
      case 'svg':
        return <ImageElement key={element.id} element={element} isHovered={isHovered} showOutline={showOutline} onSelect={handleSelect} onHover={setHoveredId} onDragMove={handleDragMove} onDragEnd={handleDragEnd} />;
      
      case 'icon':
        return <IconElement key={element.id} element={element} isHovered={isHovered} showOutline={showOutline} onSelect={handleSelect} onHover={setHoveredId} onDragMove={handleDragMove} onDragEnd={handleDragEnd} />;
      
      case 'video':
        return <VideoElement key={element.id} element={element} isHovered={isHovered} showOutline={showOutline} onSelect={handleSelect} onHover={setHoveredId} onDragMove={handleDragMove} onDragEnd={handleDragEnd} zoom={zoom} stageRef={stageRef} />;
      
      default:
        return null;
    }
  };
  
  return (
    <div 
      ref={containerRef}
      className="absolute inset-0 bg-muted/30 overflow-hidden"
      style={{ 
        touchAction: 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <div 
        className="relative"
        style={{
          transform: `scale(${zoom})`,
          transformOrigin: 'center center',
          transition: 'transform 0.1s ease-out',
        }}
      >
        {/* Floating Toolbar */}
        <FloatingToolbar />
        
        {/* Canvas container with shadow */}
        <div className="rounded-lg shadow-2xl overflow-hidden">
          <Stage
            ref={stageRef}
            width={canvas.width}
            height={canvas.height}
            style={{ cursor: hoveredId ? 'pointer' : isSelecting ? 'crosshair' : 'default' }}
            onWheel={handleWheel}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onClick={(e) => {
              // Don't handle click if we were selecting
              if (selectionBox.visible) {
                return;
              }
              
              // Konva best practice: Check if clicked on empty area or background
              const clickedOnEmpty = e.target === e.target.getStage() || e.target.name() === 'background';
              
              if (clickedOnEmpty) {
                handleDeselect();
                return;
              }
              
              // Check if clicked on a shape with name 'draggable'
              if (!e.target.hasName('draggable')) {
                return;
              }
            }}
          >
            {/* Background Layer */}
            <Layer>
              <Rect
                name="background"
                x={0}
                y={0}
                width={canvas.width}
                height={canvas.height}
                fill={canvas.background?.color || '#ffffff'}
              />
            </Layer>
            
            {/* Elements Layer */}
            <Layer>
              {[...elements]
                .sort((a, b) => (a.zIndex || 0) - (b.zIndex || 0))
                .map((element) => renderElement(element))}
            </Layer>
            
            {/* Guides Layer */}
            {showAlignmentGuides && (
              <Layer listening={false}>
                {/* Canvas border - more visible */}
                <Rect
                  x={0}
                  y={0}
                  width={canvas.width}
                  height={canvas.height}
                  stroke="#9CA3AF"
                  strokeWidth={2}
                />
                
                {/* Center guidelines - always visible, properly centered */}
                <Line
                  points={[canvas.width / 2, 0, canvas.width / 2, canvas.height]}
                  stroke="#D1D5DB"
                  strokeWidth={1}
                  dash={[6, 6]}
                  opacity={0.6}
                />
                <Line
                  points={[0, canvas.height / 2, canvas.width, canvas.height / 2]}
                  stroke="#D1D5DB"
                  strokeWidth={1}
                  dash={[6, 6]}
                  opacity={0.6}
                />
                
                {/* Active alignment guides - show when dragging */}
                {activeGuides.map((guide: any) => {
                  // For element-to-element alignment, show shorter connecting lines
                  if (!guide.isCanvas && guide.elementBounds) {
                    return (
                      <Line
                        key={guide.id}
                        points={
                          guide.type === 'v'
                            ? [guide.pos, guide.elementBounds.min, guide.pos, guide.elementBounds.max]
                            : [guide.elementBounds.min, guide.pos, guide.elementBounds.max, guide.pos]
                        }
                        stroke="#6366F1"
                        strokeWidth={2}
                        opacity={1}
                        shadowColor="#6366F1"
                        shadowBlur={6}
                        shadowOpacity={0.4}
                      />
                    );
                  }
                  
                  // For canvas alignment, show full-length guides
                  return (
                    <Line
                      key={guide.id}
                      points={
                        guide.type === 'v'
                          ? [guide.pos, 0, guide.pos, canvas.height]
                          : [0, guide.pos, canvas.width, guide.pos]
                      }
                      stroke="#6366F1"
                      strokeWidth={1.5}
                      dash={[8, 4]}
                      opacity={1}
                      shadowColor="#6366F1"
                      shadowBlur={4}
                      shadowOpacity={0.3}
                    />
                  );
                })}
              </Layer>
            )}
            
            {/* Selection Layer */}
            <Layer>
              {/* Box selection rectangle */}
              {selectionBox.visible && (
                <Rect
                  x={Math.min(selectionBox.x1, selectionBox.x2)}
                  y={Math.min(selectionBox.y1, selectionBox.y2)}
                  width={Math.abs(selectionBox.x2 - selectionBox.x1)}
                  height={Math.abs(selectionBox.y2 - selectionBox.y1)}
                  fill="rgba(99, 102, 241, 0.15)"
                  stroke="#6366F1"
                  strokeWidth={2}
                  dash={[5, 5]}
                  listening={false}
                />
              )}
              
              <Transformer
                ref={transformerRef}
                borderStroke="#6366F1"
                borderStrokeWidth={2}
                anchorSize={12}
                anchorStroke="#6366F1"
                anchorFill="white"
                anchorStrokeWidth={2}
                anchorCornerRadius={3}
                enabledAnchors={[
                  'top-left',
                  'top-right',
                  'bottom-left',
                  'bottom-right',
                  'middle-left',
                  'middle-right',
                ]}
                rotateEnabled={true}
                boundBoxFunc={(oldBox, newBox) => {
                  // Limit minimum size
                  if (newBox.width < 20 || newBox.height < 20) {
                    return oldBox;
                  }
                  return newBox;
                }}
              />
            </Layer>
          </Stage>
        </div>
      </div>

      {/* Inline text editing overlay using Konva's approach */}
      {editingText && stageRef.current && (() => {
        const textNode = editingText.textNode;
        const textPosition = textNode.absolutePosition();
        const stageBox = stageRef.current!.container().getBoundingClientRect();
        const scale = zoom;
        
        const areaPosition = {
          x: stageBox.left + textPosition.x * scale,
          y: stageBox.top + textPosition.y * scale,
        };

        const element = elements.find(el => el.id === editingText.id);
        if (!element || element.type !== 'text') return null;

        return (
          <textarea
            ref={(el) => {
              if (el) {
                textAreaRef.current = el;
                el.value = element.text || '';
                el.focus();
                el.setSelectionRange(el.value.length, el.value.length);
                // Auto-size height on mount
                el.style.height = 'auto';
                el.style.height = `${el.scrollHeight}px`;
              }
            }}
            onChange={(e) => {
              // Auto-resize height as user types
              const textarea = e.target;
              textarea.style.height = 'auto';
              textarea.style.height = `${textarea.scrollHeight}px`;

              // Update element text + height in store so Konva text and
              // Transformer selection box react to new lines in real time.
              const newText = textarea.value;
              const current = elements.find((el) => el.id === editingText.id);
              if (!current || current.type !== 'text') return;

              const measured = measureTextDimensions({
                ...current,
                text: newText,
              });

              updateElement(editingText.id, {
                text: newText,
                height: measured.height,
              });

              transformerRef.current?.getLayer()?.batchDraw();
            }}
            onKeyDown={(e) => {
              if (e.key === 'Escape') {
                e.preventDefault();
                handleTextCancel();
              } else if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleTextSave(e.currentTarget.value);
              }
            }}
            onBlur={(e) => {
              handleTextSave(e.currentTarget.value);
            }}
            spellCheck={false}
            style={{
              position: 'fixed',
              top: `${areaPosition.y}px`,
              left: `${areaPosition.x}px`,
              width: `${textNode.width() * scale}px`,
              minHeight: `${element.fontSize * scale * (element.lineHeight || 1.2)}px`,
              fontSize: `${element.fontSize * scale}px`,
              lineHeight: element.lineHeight || 1.2,
              fontFamily: element.fontFamily || 'Inter',
              fontWeight: element.fontWeight || 'normal',
              fontStyle: element.fontStyle || 'normal',
              color: element.fill || '#000000',
              textAlign: (element.align || 'left') as any,
              transformOrigin: 'left top',
              transform: `rotateZ(${textNode.rotation()}deg)`,
              border: 'none',
              padding: 0,
              margin: 0,
              background: 'transparent',
              overflow: 'visible',
              outline: 'none',
              resize: 'none',
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-word',
              zIndex: 1200,
            }}
          />
        );
      })()}
    </div>
  );
}

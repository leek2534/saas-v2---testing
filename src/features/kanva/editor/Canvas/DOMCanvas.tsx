/**
 * DOMCanvas - Pure React/DOM canvas editor (no Konva)
 * Handles rendering, selection, resizing, and text editing
 */

'use client';

import React, { useRef, useState, useCallback, useEffect, useMemo } from 'react';
import { useEditorStore } from '../../lib/editor/store';
import { FloatingToolbar } from './FloatingToolbar';
import { TextToolbar } from './TextToolbar';
import { getEditor } from '../../lib/editor/editorRegistry';
import { CollaborationSelectionOverlay } from '../../collab/CollaborationSelectionOverlay';
import { 
  ChevronRight, 
  Copy, 
  Clipboard, 
  ClipboardPaste,
  Trash2, 
  Lock, 
  Unlock, 
  Group, 
  Ungroup,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignStartVertical,
  AlignCenterVertical,
  AlignEndVertical,
  GalleryHorizontal,
  GalleryVertical,
  LayoutGrid,
  Layers,
  ArrowUp,
  ArrowDown,
  ChevronsUp,
  ChevronsDown,
  X,
  Keyboard,
  Search,
  Command,
  ZoomIn,
  Undo2,
  Redo2,
} from 'lucide-react';

// ============================================
// TYPES
// ============================================

interface Point {
  x: number;
  y: number;
}

interface ResizeHandle {
  position: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'middle-left' | 'middle-right' | 'middle-top' | 'middle-bottom';
  cursor: string;
}

const RESIZE_HANDLES: ResizeHandle[] = [
  { position: 'top-left', cursor: 'nwse-resize' },
  { position: 'top-right', cursor: 'nesw-resize' },
  { position: 'bottom-left', cursor: 'nesw-resize' },
  { position: 'bottom-right', cursor: 'nwse-resize' },
  { position: 'middle-left', cursor: 'ew-resize' },
  { position: 'middle-right', cursor: 'ew-resize' },
  { position: 'middle-top', cursor: 'ns-resize' },
  { position: 'middle-bottom', cursor: 'ns-resize' },
];

const ROTATION_SNAP_THRESHOLD = 5;
const ROTATION_SNAP_ANGLES = [0, 45, 90, 135, 180, 225, 270, 315];

// Snapping configuration
const SNAP_THRESHOLD = 8; // pixels

interface SnapGuide {
  orientation: 'horizontal' | 'vertical';
  position: number;
  type: 'edge' | 'center';
}

interface SnapResult {
  x: number;
  y: number;
  guides: SnapGuide[];
}

// Context menu types
interface ContextMenuState {
  visible: boolean;
  x: number;
  y: number;
  elementId: string | null;
}

// ============================================
// UTILITY FUNCTIONS
// ============================================

function snapRotation(rotation: number): number {
  const normalized = ((rotation % 360) + 360) % 360;
  for (const angle of ROTATION_SNAP_ANGLES) {
    if (Math.abs(normalized - angle) <= ROTATION_SNAP_THRESHOLD) {
      return angle;
    }
  }
  return rotation;
}

/**
 * Calculate snap position for an element being dragged
 * Snaps to canvas edges, canvas center, and other elements' edges/centers
 */
function calculateSnap(
  draggedElement: { x: number; y: number; width: number; height: number; id: string },
  allElements: any[],
  canvas: { width: number; height: number },
  measureFn: (el: any) => { width: number; height: number }
): SnapResult {
  const guides: SnapGuide[] = [];
  let snapX = draggedElement.x;
  let snapY = draggedElement.y;
  
  const draggedWidth = draggedElement.width;
  const draggedHeight = draggedElement.height;
  
  // Dragged element edges and center
  const draggedLeft = draggedElement.x;
  const draggedRight = draggedElement.x + draggedWidth;
  const draggedCenterX = draggedElement.x + draggedWidth / 2;
  const draggedTop = draggedElement.y;
  const draggedBottom = draggedElement.y + draggedHeight;
  const draggedCenterY = draggedElement.y + draggedHeight / 2;
  
  // Collect all snap lines (vertical = x positions, horizontal = y positions)
  const verticalLines: { pos: number; type: 'edge' | 'center' }[] = [];
  const horizontalLines: { pos: number; type: 'edge' | 'center' }[] = [];
  
  // Canvas edges and center
  verticalLines.push({ pos: 0, type: 'edge' }); // left
  verticalLines.push({ pos: canvas.width, type: 'edge' }); // right
  verticalLines.push({ pos: canvas.width / 2, type: 'center' }); // center
  horizontalLines.push({ pos: 0, type: 'edge' }); // top
  horizontalLines.push({ pos: canvas.height, type: 'edge' }); // bottom
  horizontalLines.push({ pos: canvas.height / 2, type: 'center' }); // center
  
  // Other elements' edges and centers
  allElements.forEach(el => {
    if (el.id === draggedElement.id) return;
    
    const measured = el.type === 'text' ? measureFn(el) : null;
    const elWidth = measured?.width || el.width || 100;
    const elHeight = measured?.height || el.height || 100;
    
    // Vertical lines (x positions)
    verticalLines.push({ pos: el.x, type: 'edge' }); // left
    verticalLines.push({ pos: el.x + elWidth, type: 'edge' }); // right
    verticalLines.push({ pos: el.x + elWidth / 2, type: 'center' }); // center
    
    // Horizontal lines (y positions)
    horizontalLines.push({ pos: el.y, type: 'edge' }); // top
    horizontalLines.push({ pos: el.y + elHeight, type: 'edge' }); // bottom
    horizontalLines.push({ pos: el.y + elHeight / 2, type: 'center' }); // center
  });
  
  // Find closest vertical snap (for X position)
  let closestVertical: { diff: number; snapTo: number; draggedEdge: number; type: 'edge' | 'center' } | null = null;
  
  [
    { edge: draggedLeft, offset: 0 },
    { edge: draggedRight, offset: draggedWidth },
    { edge: draggedCenterX, offset: draggedWidth / 2 },
  ].forEach(({ edge, offset }) => {
    verticalLines.forEach(line => {
      const diff = Math.abs(edge - line.pos);
      if (diff < SNAP_THRESHOLD && (!closestVertical || diff < closestVertical.diff)) {
        closestVertical = { diff, snapTo: line.pos - offset, draggedEdge: line.pos, type: line.type };
      }
    });
  });
  
  // Find closest horizontal snap (for Y position)
  let closestHorizontal: { diff: number; snapTo: number; draggedEdge: number; type: 'edge' | 'center' } | null = null;
  
  [
    { edge: draggedTop, offset: 0 },
    { edge: draggedBottom, offset: draggedHeight },
    { edge: draggedCenterY, offset: draggedHeight / 2 },
  ].forEach(({ edge, offset }) => {
    horizontalLines.forEach(line => {
      const diff = Math.abs(edge - line.pos);
      if (diff < SNAP_THRESHOLD && (!closestHorizontal || diff < closestHorizontal.diff)) {
        closestHorizontal = { diff, snapTo: line.pos - offset, draggedEdge: line.pos, type: line.type };
      }
    });
  });
  
  // Apply snaps and create guides
  if (closestVertical) {
    snapX = closestVertical.snapTo;
    guides.push({ orientation: 'vertical', position: closestVertical.draggedEdge, type: closestVertical.type });
  }
  
  if (closestHorizontal) {
    snapY = closestHorizontal.snapTo;
    guides.push({ orientation: 'horizontal', position: closestHorizontal.draggedEdge, type: closestHorizontal.type });
  }
  
  return { x: snapX, y: snapY, guides };
}

function measureTextDimensions(element: any): { width: number; height: number; containerWidth?: number } {
  // Create a temporary element to measure text
  const temp = document.createElement('div');
  temp.style.position = 'absolute';
  temp.style.visibility = 'hidden';
  temp.style.left = '-9999px';
  temp.style.top = '-9999px';
  
  // Font settings must match exactly what we render
  const fontSize = element.fontSize || 32;
  const fontFamily = element.fontFamily || 'Inter';
  const fontWeight = element.fontWeight || 'normal';
  const fontStyle = element.fontStyle || 'normal';
  
  temp.style.fontSize = `${fontSize}px`;
  temp.style.fontFamily = fontFamily;
  temp.style.fontWeight = fontWeight;
  temp.style.fontStyle = fontStyle;
  temp.style.lineHeight = '1.2'; // Standard line height for readability
  temp.style.padding = '0';
  temp.style.margin = '0';
  temp.style.border = '0';
  temp.style.boxSizing = 'border-box';
  
  const hasFixedWidth = element.width && element.width > 0;
  
  // Auto-width mode: no width constraint, single line
  // Fixed-width mode: constrain width, allow wrapping
  if (hasFixedWidth) {
    temp.style.width = `${element.width}px`;
    temp.style.whiteSpace = 'pre-wrap';
    temp.style.wordWrap = 'break-word';
    temp.style.overflowWrap = 'break-word';
  } else {
    temp.style.whiteSpace = 'nowrap';
    temp.style.width = 'auto';
    temp.style.display = 'inline-block';
  }
  
  temp.textContent = element.text || 'Text';
  
  document.body.appendChild(temp);
  const rect = temp.getBoundingClientRect();
  document.body.removeChild(temp);
  
  // For fixed-width text, return the container width (for resize handles)
  // but the actual height based on text reflow
  return {
    width: hasFixedWidth ? element.width : Math.ceil(rect.width),
    height: Math.ceil(rect.height),
    containerWidth: hasFixedWidth ? element.width : undefined,
  };
}

function getHandlePosition(handle: ResizeHandle['position'], width: number, height: number): Point {
  const positions: Record<ResizeHandle['position'], Point> = {
    'top-left': { x: 0, y: 0 },
    'top-right': { x: width, y: 0 },
    'bottom-left': { x: 0, y: height },
    'bottom-right': { x: width, y: height },
    'middle-left': { x: 0, y: height / 2 },
    'middle-right': { x: width, y: height / 2 },
    'middle-top': { x: width / 2, y: 0 },
    'middle-bottom': { x: width / 2, y: height },
  };
  return positions[handle];
}

// ============================================
// TRANSFORMER COMPONENT
// ============================================

interface TransformerProps {
  element: any;
  onResizeStart: (handle: ResizeHandle['position'], e: React.MouseEvent) => void;
  onRotateStart: (e: React.MouseEvent) => void;
  isEditing?: boolean;
  isResizing?: boolean;
  isRotating?: boolean;
  isDragging?: boolean;
}

function Transformer({ element, onResizeStart, onRotateStart, isEditing: _isEditing, isResizing, isRotating, isDragging }: TransformerProps) {
  const measured = element.type === 'text' ? measureTextDimensions(element) : null;
  
  // For text: always use measured dimensions for tight selection box
  // The measurement already accounts for element.width (wrapping) if set
  const width = measured?.width || element.width || 100;
  const height = measured?.height || element.height || 100;
  const rotation = element.rotation || 0;

  // Filter handles based on element type - text only gets side and corner handles (no top/bottom middle)
  const handles = element.type === 'text'
    ? RESIZE_HANDLES.filter(h => 
        ['top-left', 'top-right', 'bottom-left', 'bottom-right', 'middle-left', 'middle-right'].includes(h.position)
      )
    : RESIZE_HANDLES;

  // Check if element is being actively dragged/resized (no transition needed)
  const isActivelyManipulating = isResizing || isRotating || isDragging;

  return (
    <div
      className="absolute pointer-events-none"
      style={{
        left: element.x,
        top: element.y,
        width,
        height,
        transform: `rotate(${element.rotation || 0}deg) translateZ(0)`,
        transformOrigin: 'center center',
        transition: isActivelyManipulating ? 'none' : 'left 100ms ease-out, top 100ms ease-out, width 100ms ease-out, height 100ms ease-out',
        willChange: 'left, top, width, height',
      }}
    >
      {/* Selection border - uses outline so it doesn't affect layout */}
      <div
        className="absolute pointer-events-none"
        style={{
          inset: -1, // Slightly outside the element
          border: '2px solid #3b82f6',
          borderRadius: 2,
        }}
      />

      {/* Resize handles */}
      {handles.map((handle) => {
        const pos = getHandlePosition(handle.position, width, height);
        return (
          <div
            key={handle.position}
            className="absolute w-3 h-3 bg-white border-2 border-blue-500 rounded-sm pointer-events-auto"
            style={{
              left: pos.x - 6,
              top: pos.y - 6,
              cursor: handle.cursor,
            }}
            onMouseDown={(e) => {
              e.stopPropagation();
              onResizeStart(handle.position, e);
            }}
          />
        );
      })}

      {/* Rotation handle */}
      <div
        className="absolute pointer-events-auto"
        style={{
          left: width / 2 - 6,
          top: -30,
          width: 12,
          height: 12,
          cursor: 'grab',
        }}
        onMouseDown={(e) => {
          e.stopPropagation();
          onRotateStart(e);
        }}
      >
        <div className="w-3 h-3 bg-white border-2 border-blue-500 rounded-full" />
        {/* Line connecting to box */}
        <div
          className="absolute left-1/2 top-3 w-px h-4 bg-blue-500"
          style={{ transform: 'translateX(-50%)' }}
        />
      </div>

      {/* Dimension tooltip - shown during resize */}
      {isResizing && (
        <div
          className="absolute bg-gray-900 text-white text-xs px-2 py-1 rounded pointer-events-none whitespace-nowrap"
          style={{
            left: width / 2,
            top: height + 8,
            transform: 'translateX(-50%)',
          }}
        >
          {Math.round(width)} × {Math.round(height)}
        </div>
      )}

      {/* Rotation angle tooltip - shown during rotate */}
      {isRotating && (
        <div
          className="absolute bg-gray-900 text-white text-xs px-2 py-1 rounded pointer-events-none whitespace-nowrap"
          style={{
            left: width / 2,
            top: -50,
            transform: 'translateX(-50%)',
          }}
        >
          {Math.round(rotation)}°
        </div>
      )}
    </div>
  );
}

// ============================================
// MULTI-SELECT TRANSFORMER COMPONENT
// ============================================

interface MultiSelectTransformerProps {
  bounds: { minX: number; minY: number; maxX: number; maxY: number };
  onResizeStart: (handle: ResizeHandle['position'], e: React.MouseEvent) => void;
  isGrouped: boolean;
  isDragging?: boolean;
  isResizing?: boolean;
}

function MultiSelectTransformer({ bounds, onResizeStart, isGrouped, isDragging, isResizing }: MultiSelectTransformerProps) {
  const width = bounds.maxX - bounds.minX;
  const height = bounds.maxY - bounds.minY;
  
  // Only corner handles for multi-select (proportional scaling)
  const cornerHandles = RESIZE_HANDLES.filter(h => 
    ['top-left', 'top-right', 'bottom-left', 'bottom-right'].includes(h.position)
  );

  // Disable transitions during active manipulation
  const isActivelyManipulating = isDragging || isResizing;

  return (
    <div
      className="absolute pointer-events-none"
      style={{
        left: bounds.minX - 2,
        top: bounds.minY - 2,
        width: width + 4,
        height: height + 4,
        transform: 'translateZ(0)',
        transition: isActivelyManipulating ? 'none' : 'left 100ms ease-out, top 100ms ease-out, width 100ms ease-out, height 100ms ease-out',
        willChange: 'left, top, width, height',
      }}
    >
      {/* Selection border */}
      <div
        className="absolute inset-0"
        style={{
          border: isGrouped ? '2px solid #3b82f6' : '1px dashed #94a3b8',
          borderRadius: 2,
        }}
      />

      {/* Corner resize handles */}
      {cornerHandles.map((handle) => {
        const pos = getHandlePosition(handle.position, width + 4, height + 4);
        return (
          <div
            key={handle.position}
            className="absolute w-3 h-3 bg-white border-2 border-blue-500 rounded-sm pointer-events-auto"
            style={{
              left: pos.x - 6,
              top: pos.y - 6,
              cursor: handle.cursor,
            }}
            onMouseDown={(e) => {
              e.stopPropagation();
              onResizeStart(handle.position, e);
            }}
          />
        );
      })}
    </div>
  );
}

// ============================================
// ELEMENT COMPONENTS
// ============================================

interface ElementProps {
  element: any;
  isSelected: boolean;
  isHovered: boolean;
  isEditing: boolean;
  onSelect: (id: string, e: React.MouseEvent) => void;
  onDoubleClick: (element: any, e: React.MouseEvent) => void;
  onHover: (id: string | null) => void;
  onDragStart: (element: any, e: React.MouseEvent) => void;
}

function TextElement({ element, isSelected, isHovered, isEditing, onSelect, onDoubleClick, onHover, onDragStart }: ElementProps) {
  const measured = measureTextDimensions(element);
  const isDragging = useEditorStore((state) => state.selectedIds.includes(element.id) && state.selectedIds.length > 0);
  
  // Check if we have a fixed width (user has resized)
  const hasFixedWidth = element.width && element.width > 0;
  
  // Use element.width if set (fixed width mode), otherwise use measured width
  // Always use measured height (depends on text reflow)
  const width = hasFixedWidth ? element.width : measured.width;
  const height = measured.height;
  const scaleX = (element as any).scaleX ?? 1;
  const scaleY = (element as any).scaleY ?? 1;

  return (
    <div
      className="absolute select-none"
      style={{
        left: element.x,
        top: element.y,
        width,
        height,
        transform: `rotate(${element.rotation || 0}deg) scaleX(${scaleX}) scaleY(${scaleY}) translateZ(0)`,
        transformOrigin: 'center center',
        cursor: isEditing ? 'text' : 'move',
        opacity: (element.opacity ?? 1) * (isHovered && !isSelected ? 0.9 : 1),
        willChange: isSelected ? 'left, top, transform' : 'auto',
        transition: isSelected ? 'none' : 'left 100ms ease-out, top 100ms ease-out',
      }}
      onClick={(e) => onSelect(element.id, e)}
      onDoubleClick={(e) => onDoubleClick(element, e)}
      onMouseEnter={() => onHover(element.id)}
      onMouseLeave={() => onHover(null)}
      onMouseDown={(e) => {
        if (!isEditing) {
          onDragStart(element, e);
        }
      }}
    >
      {/* Hover outline - slightly outside the element */}
      {isHovered && !isSelected && (
        <div
          className="absolute pointer-events-none"
          style={{
            inset: -1,
            border: '2px solid #6366f1',
            borderRadius: 2,
          }}
        />
      )}

      {/* Text content - styles must match measureTextDimensions exactly */}
      <div
        style={{
          fontSize: element.fontSize || 32,
          fontFamily: element.fontFamily || 'Inter',
          fontWeight: element.fontWeight || 'normal',
          fontStyle: element.fontStyle || 'normal',
          color: element.fill || '#000000',
          lineHeight: element.lineHeight || 1.2, // Must match measurement
          letterSpacing: element.letterSpacing ? `${element.letterSpacing}px` : 'normal',
          textAlign: element.align || 'left',
          textDecoration: element.textDecoration || 'none',
          textTransform: element.textTransform || 'none',
          whiteSpace: hasFixedWidth ? 'pre-wrap' : 'nowrap',
          wordWrap: 'break-word',
          overflowWrap: 'break-word',
          visibility: isEditing ? 'hidden' : 'visible',
          padding: 0,
          margin: 0,
          width: hasFixedWidth ? element.width : 'auto',
        }}
      >
        {element.text || 'Text'}
      </div>
    </div>
  );
}

function ShapeElement({ element, isSelected, isHovered, onSelect, onHover, onDragStart }: Omit<ElementProps, 'isEditing' | 'onDoubleClick'>) {
  const width = element.width || 100;
  const height = element.height || 100;
  const scaleX = (element as any).scaleX ?? 1;
  const scaleY = (element as any).scaleY ?? 1;

  const renderShape = () => {
    switch (element.shapeType) {
      case 'circle':
        return (
          <div
            className="w-full h-full rounded-full"
            style={{
              backgroundColor: element.fill || '#3B82F6',
              border: element.stroke ? `${element.strokeWidth || 2}px solid ${element.stroke}` : 'none',
            }}
          />
        );
      case 'triangle':
        return (
          <div
            style={{
              width: 0,
              height: 0,
              borderLeft: `${width / 2}px solid transparent`,
              borderRight: `${width / 2}px solid transparent`,
              borderBottom: `${height}px solid ${element.fill || '#3B82F6'}`,
            }}
          />
        );
      default: // rect
        return (
          <div
            className="w-full h-full"
            style={{
              backgroundColor: element.fill || '#3B82F6',
              border: element.stroke ? `${element.strokeWidth || 2}px solid ${element.stroke}` : 'none',
              borderRadius: element.cornerRadius || 0,
            }}
          />
        );
    }
  };

  return (
    <div
      className="absolute select-none"
      style={{
        left: element.x,
        top: element.y,
        width,
        height,
        transform: `rotate(${element.rotation || 0}deg) scaleX(${scaleX}) scaleY(${scaleY}) translateZ(0)`,
        transformOrigin: 'center center',
        cursor: 'move',
        opacity: (element.opacity ?? 1) * (isHovered && !isSelected ? 0.9 : 1),
        willChange: isSelected ? 'left, top, transform' : 'auto',
        transition: isSelected ? 'none' : 'left 100ms ease-out, top 100ms ease-out',
      }}
      onClick={(e) => onSelect(element.id, e)}
      onMouseEnter={() => onHover(element.id)}
      onMouseLeave={() => onHover(null)}
      onMouseDown={(e) => onDragStart(element, e)}
    >
      {/* Hover outline - slightly outside the element */}
      {isHovered && !isSelected && (
        <div
          className="absolute pointer-events-none"
          style={{
            inset: -1,
            border: '2px solid #6366f1',
            borderRadius: 2,
          }}
        />
      )}
      {renderShape()}
    </div>
  );
}

function ImageElement({ element, isSelected, isHovered, onSelect, onHover, onDragStart }: Omit<ElementProps, 'isEditing' | 'onDoubleClick'>) {
  const width = element.width || 200;
  const height = element.height || 200;
  const scaleX = (element as any).scaleX ?? 1;
  const scaleY = (element as any).scaleY ?? 1;
  
  // Build CSS filter string for image adjustments
  const brightness = element.brightness ?? 100;
  const contrast = element.contrast ?? 100;
  const saturation = element.saturation ?? 100;
  const filterString = `brightness(${brightness}%) contrast(${contrast}%) saturate(${saturation}%)`;

  return (
    <div
      className="absolute select-none overflow-hidden"
      style={{
        left: element.x,
        top: element.y,
        width,
        height,
        transform: `rotate(${element.rotation || 0}deg) scaleX(${scaleX}) scaleY(${scaleY}) translateZ(0)`,
        transformOrigin: 'center center',
        cursor: 'move',
        opacity: (element.opacity ?? 1) * (isHovered && !isSelected ? 0.9 : 1),
        borderRadius: element.borderRadius || 0,
        willChange: isSelected ? 'left, top, transform' : 'auto',
        transition: isSelected ? 'none' : 'left 100ms ease-out, top 100ms ease-out',
      }}
      onClick={(e) => onSelect(element.id, e)}
      onMouseEnter={() => onHover(element.id)}
      onMouseLeave={() => onHover(null)}
      onMouseDown={(e) => onDragStart(element, e)}
    >
      {/* Hover outline - slightly outside the element */}
      {isHovered && !isSelected && (
        <div
          className="absolute pointer-events-none"
          style={{
            inset: -1,
            border: '2px solid #6366f1',
            borderRadius: element.borderRadius ? element.borderRadius + 2 : 2,
          }}
        />
      )}
      <img
        src={element.src || element.url}
        alt=""
        className="w-full h-full object-cover pointer-events-none"
        style={{
          filter: filterString,
          borderRadius: element.borderRadius || 0,
        }}
        draggable={false}
      />
    </div>
  );
}

function IconElement({ element, isSelected, isHovered, onSelect, onHover, onDragStart }: Omit<ElementProps, 'isEditing' | 'onDoubleClick'>) {
  const width = element.width || 64;
  const height = element.height || 64;
  const scaleX = (element as any).scaleX ?? 1;
  const scaleY = (element as any).scaleY ?? 1;

  return (
    <div
      className="absolute select-none"
      style={{
        left: element.x,
        top: element.y,
        width,
        height,
        transform: `rotate(${element.rotation || 0}deg) scaleX(${scaleX}) scaleY(${scaleY}) translateZ(0)`,
        transformOrigin: 'center center',
        cursor: 'move',
        opacity: (element.opacity ?? 1) * (isHovered && !isSelected ? 0.9 : 1),
        willChange: isSelected ? 'left, top, transform' : 'auto',
        transition: isSelected ? 'none' : 'left 100ms ease-out, top 100ms ease-out',
      }}
      onClick={(e) => onSelect(element.id, e)}
      onMouseEnter={() => onHover(element.id)}
      onMouseLeave={() => onHover(null)}
      onMouseDown={(e) => onDragStart(element, e)}
    >
      {/* Hover outline */}
      {isHovered && !isSelected && (
        <div
          className="absolute pointer-events-none"
          style={{
            inset: -1,
            border: '2px solid #6366f1',
            borderRadius: 2,
          }}
        />
      )}
      {/* Render SVG icon with color */}
      {element.src ? (
        <img
          src={element.src}
          alt=""
          className="w-full h-full pointer-events-none"
          style={{
            filter: element.color && element.color !== '#000000' 
              ? `drop-shadow(0 0 0 ${element.color})` 
              : 'none',
          }}
          draggable={false}
        />
      ) : (
        <div
          className="w-full h-full flex items-center justify-center text-gray-400"
          style={{ color: element.fill || element.color || '#000000' }}
        >
          <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
          </svg>
        </div>
      )}
    </div>
  );
}

function VideoElement({ element, isSelected, isHovered, onSelect, onHover, onDragStart }: Omit<ElementProps, 'isEditing' | 'onDoubleClick'>) {
  const width = element.width || 400;
  const height = element.height || 300;
  const scaleX = (element as any).scaleX ?? 1;
  const scaleY = (element as any).scaleY ?? 1;

  return (
    <div
      className="absolute select-none overflow-hidden"
      style={{
        left: element.x,
        top: element.y,
        width,
        height,
        transform: `rotate(${element.rotation || 0}deg) scaleX(${scaleX}) scaleY(${scaleY}) translateZ(0)`,
        transformOrigin: 'center center',
        cursor: 'move',
        opacity: (element.opacity ?? 1) * (isHovered && !isSelected ? 0.9 : 1),
        borderRadius: element.borderRadius || 0,
        willChange: isSelected ? 'left, top, transform' : 'auto',
        transition: isSelected ? 'none' : 'left 100ms ease-out, top 100ms ease-out',
      }}
      onClick={(e) => onSelect(element.id, e)}
      onMouseEnter={() => onHover(element.id)}
      onMouseLeave={() => onHover(null)}
      onMouseDown={(e) => onDragStart(element, e)}
    >
      {/* Hover outline */}
      {isHovered && !isSelected && (
        <div
          className="absolute pointer-events-none"
          style={{
            inset: -1,
            border: '2px solid #6366f1',
            borderRadius: element.borderRadius ? element.borderRadius + 2 : 2,
          }}
        />
      )}
      <video
        src={element.src || element.url}
        className="w-full h-full object-cover pointer-events-none"
        style={{
          borderRadius: element.borderRadius || 0,
        }}
        muted={element.volume === 0}
        autoPlay={element.autoPlay ?? false}
        loop={element.loop ?? true}
        playsInline
        draggable={false}
      />
    </div>
  );
}

// ============================================
// TOOLBAR POSITIONER
// ============================================

interface ToolbarPositionerProps {
  selectedIds: string[];
  elements: any[];
  zoom: number;
  pan: { x: number; y: number };
  containerRef: React.RefObject<HTMLDivElement>;
  canvasRef: React.RefObject<HTMLDivElement>;
  editingTextId: string | null;
}

function ToolbarPositioner({ selectedIds, elements, zoom, pan, containerRef, canvasRef, editingTextId }: ToolbarPositionerProps) {
  const toolbarContainerRef = useRef<HTMLDivElement>(null);
  const [editorUpdateTrigger, setEditorUpdateTrigger] = useState(0);

  // Listen for editor registration/unregistration to trigger updates
  useEffect(() => {
    const handleEditorChange = () => {
      setEditorUpdateTrigger(prev => prev + 1);
    };

    // Poll for editor changes (simple approach - could be improved with event system)
    const interval = setInterval(() => {
      handleEditorChange();
    }, 200); // Check every 200ms

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const toolbarContainer = toolbarContainerRef.current;
    if (!toolbarContainer || !containerRef.current || !canvasRef.current) return;

    // Find text element that is either selected OR being edited
    // Check for active TipTap editor to detect editing state
    let textElement = elements.find(el => selectedIds.includes(el.id) && el.type === 'text');
    
    // If no selected text, check if any text element is being edited (has active TipTap editor)
    if (!textElement) {
      textElement = elements.find(el => {
        if (el.type !== 'text') return false;
        const editor = getEditor(el.id);
        return editor !== undefined;
      });
    }
    
    // Show toolbar if we have a text element (selected or editing)
    if (!textElement) {
      toolbarContainer.style.display = 'none';
      return;
    }

    // Get element position and dimensions
    const canvasRect = canvasRef.current.getBoundingClientRect();
    const containerRect = containerRef.current.getBoundingClientRect();
    
    // Calculate element position in screen coordinates
    const canvasScreenLeft = canvasRect.left - containerRect.left;
    const canvasScreenTop = canvasRect.top - containerRect.top;
    
    // Element position in canvas space
    const elementX = textElement.x;
    const elementY = textElement.y;
    
    // Convert to screen coordinates
    const screenX = canvasScreenLeft + elementX * zoom;
    const screenY = canvasScreenTop + elementY * zoom;
    
    // Position toolbar above the text element
    const toolbarY = screenY - 56; // 56px above element
    
    // Center horizontally on element
    const measured = measureTextDimensions(textElement);
    const elementWidth = measured.width || textElement.width || 100;
    const toolbarX = screenX + (elementWidth * zoom) / 2;
    
    // Clamp to container bounds
    const toolbarWidth = toolbarContainer.offsetWidth || 400;
    const clampedX = Math.max(toolbarWidth / 2 + 8, Math.min(containerRect.width - toolbarWidth / 2 - 8, toolbarX));
    const clampedY = Math.max(8, toolbarY);
    
    toolbarContainer.style.display = 'block';
    toolbarContainer.style.left = `${clampedX}px`;
    toolbarContainer.style.top = `${clampedY}px`;
    toolbarContainer.style.transform = 'translateX(-50%)';
  }, [selectedIds, elements, zoom, pan, editingTextId, editorUpdateTrigger, containerRef, canvasRef]);

  return (
    <div 
      ref={toolbarContainerRef}
      id="dynamic-element-toolbar-container" 
      className="absolute"
      style={{ zIndex: 1000, display: 'none' }}
    />
  );
}

// ============================================
// TEXT EDITOR OVERLAY
// ============================================

interface TextEditorProps {
  element: any;
  onSave: (text: string) => void;
  onCancel: () => void;
  onChange: (text: string) => void; // Real-time updates
  clickPosition?: { x: number; y: number }; // Position where user clicked to edit
}

function TextEditor({ element, onSave, onCancel, onChange, clickPosition }: TextEditorProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [text, setText] = useState(element.text || '');
  const measured = measureTextDimensions({ ...element, text });

  const hasFixedWidth = element.width && element.width > 0;

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.focus();
      
      // If we have a click position, try to position cursor there
      if (clickPosition) {
        // Calculate approximate character position based on click
        const textarea = textareaRef.current;
        const fontSize = element.fontSize || 32;
        const charWidth = fontSize * 0.6; // Approximate character width
        const lineHeight = fontSize * 1.2;
        
        // Calculate relative position within the text element
        const relX = clickPosition.x - element.x;
        const relY = clickPosition.y - element.y;
        
        // Estimate line and character position
        const lineIndex = Math.floor(relY / lineHeight);
        const charIndex = Math.floor(relX / charWidth);
        
        // Split text into lines and calculate position
        const lines = text.split('\n');
        let position = 0;
        for (let i = 0; i < Math.min(lineIndex, lines.length); i++) {
          position += lines[i].length + 1; // +1 for newline
        }
        if (lineIndex < lines.length) {
          position += Math.min(charIndex, lines[lineIndex]?.length || 0);
        }
        
        // Set cursor position
        textarea.setSelectionRange(position, position);
      } else {
        // Default: select all text
        textareaRef.current.select();
      }
    }
  }, [clickPosition, element.x, element.y, element.fontSize, text]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onCancel();
    }
    // Stop propagation to prevent canvas keyboard shortcuts
    e.stopPropagation();
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newText = e.target.value;
    setText(newText);
    onChange(newText); // Update store in real-time for selection box
  };

  const handleBlur = () => {
    onSave(text);
  };

  return (
    <div
      className="absolute"
      style={{
        left: element.x,
        top: element.y,
        transform: `rotate(${element.rotation || 0}deg)`,
        transformOrigin: 'center center',
      }}
      onClick={(e) => e.stopPropagation()} // Prevent deselection
    >
      <textarea
        ref={textareaRef}
        value={text}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        onBlur={handleBlur}
        className="resize-none outline-none bg-transparent caret-blue-500"
        style={{
          width: hasFixedWidth ? element.width : Math.max(measured.width, 50),
          minHeight: measured.height,
          fontSize: element.fontSize || 32,
          fontFamily: element.fontFamily || 'Inter',
          fontWeight: element.fontWeight || 'normal',
          fontStyle: element.fontStyle || 'normal',
          color: element.fill || '#000000',
          lineHeight: 1.2, // Must match measurement and TextElement
          textAlign: element.align || 'left',
          border: 'none',
          padding: 0,
          margin: 0,
          overflow: 'hidden',
          caretColor: '#3b82f6', // Blue caret for visibility
        }}
      />
    </div>
  );
}

// ============================================
// MAIN CANVAS COMPONENT
// ============================================

export function DOMCanvas() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLDivElement>(null);

  // Store
  const {
    canvas,
    elements,
    selectedIds,
    setSelectedIds,
    updateElement,
    addElement,
    clearSelection,
    deleteElements,
    duplicateElements,
    bringToFront,
    sendToBack,
    bringForward,
    sendBackward,
    groupElements,
    ungroupElements,
    getGroupElements,
    getElementGroup,
    pushHistory,
    getStateSnapshot,
    undo,
    redo,
  } = useEditorStore();

  // Local state
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [editingTextId, setEditingTextId] = useState<string | null>(null);
  
  // ============================================
  // CAMERA STATE (following tldraw/Figma patterns)
  // Camera represents the viewport's position and zoom
  // x, y = camera position in canvas space
  // z = zoom level (1 = 100%)
  // ============================================
  
  const [camera, setCamera] = useState({ x: 0, y: 0, z: 1 });
  const [hasInitialized, setHasInitialized] = useState(false);
  
  // Convenience aliases for backward compatibility
  const zoom = camera.z;
  const setZoom = useCallback((zOrFn: number | ((z: number) => number)) => {
    setCamera(cam => ({
      ...cam,
      z: typeof zOrFn === 'function' ? zOrFn(cam.z) : zOrFn
    }));
  }, []);
  
  // Pan in screen space (for CSS positioning)
  const pan = useMemo(() => {
    if (!containerRef.current) return { x: 0, y: 0 };
    // Convert camera position to screen-space offset for CSS
    // When camera.x increases, canvas should move right (positive screen offset)
    return {
      x: camera.x * camera.z,
      y: camera.y * camera.z,
    };
  }, [camera]);
  
  const setPan = useCallback((panOrFn: Point | ((p: Point) => Point)) => {
    setCamera(cam => {
      const newPan = typeof panOrFn === 'function' 
        ? panOrFn({ x: cam.x * cam.z, y: cam.y * cam.z })
        : panOrFn;
      return {
        ...cam,
        x: newPan.x / cam.z,
        y: newPan.y / cam.z,
      };
    });
  }, []);
  
  // Helper to clamp camera position within bounds
  // Key behavior:
  // - If canvas fits in viewport (in that dimension), lock pan to 0 (centered)
  // - If canvas exceeds viewport, allow panning to see edges + a small margin
  const clampCamera = useCallback((cam: { x: number; y: number; z: number }): { x: number; y: number; z: number } => {
    if (!containerRef.current) return cam;
    
    const containerRect = containerRef.current.getBoundingClientRect();
    
    // Scaled canvas dimensions (how big the canvas appears on screen)
    const scaledCanvasWidth = canvas.width * cam.z;
    const scaledCanvasHeight = canvas.height * cam.z;
    
    // Extra margin to show a bit of off-canvas area (in screen pixels)
    const edgeMargin = 40;
    
    // Check if canvas fits within viewport in each dimension
    const canvasFitsHorizontally = scaledCanvasWidth <= containerRect.width;
    const canvasFitsVertically = scaledCanvasHeight <= containerRect.height;
    
    let clampedX = cam.x;
    let clampedY = cam.y;
    
    if (canvasFitsHorizontally) {
      // Canvas fits horizontally - no horizontal panning allowed, keep centered
      clampedX = 0;
    } else {
      // Canvas exceeds viewport width - allow panning to see edges + margin
      const excessWidth = scaledCanvasWidth - containerRect.width;
      // Max pan in canvas space = (excess / 2 + margin) / zoom
      const maxPanX = (excessWidth / 2 + edgeMargin) / cam.z;
      clampedX = Math.max(-maxPanX, Math.min(maxPanX, cam.x));
    }
    
    if (canvasFitsVertically) {
      // Canvas fits vertically - no vertical panning allowed, keep centered
      clampedY = 0;
    } else {
      // Canvas exceeds viewport height - allow panning to see edges + margin
      const excessHeight = scaledCanvasHeight - containerRect.height;
      const maxPanY = (excessHeight / 2 + edgeMargin) / cam.z;
      clampedY = Math.max(-maxPanY, Math.min(maxPanY, cam.y));
    }
    
    return {
      x: clampedX,
      y: clampedY,
      z: cam.z,
    };
  }, [canvas.width, canvas.height]);
  
  // Pan camera by screen-space delta (for drag/scroll)
  const panCamera = useCallback((dx: number, dy: number) => {
    setCamera(cam => {
      // Divide by zoom for consistent pan speed at all zoom levels
      const newCam = {
        x: cam.x + dx / cam.z,
        y: cam.y + dy / cam.z,
        z: cam.z,
      };
      return clampCamera(newCam);
    });
  }, [clampCamera]);
  
  // Zoom camera toward a screen point
  const zoomCameraTo = useCallback((screenPoint: Point, newZoom: number) => {
    setCamera(cam => {
      // Clamp zoom
      const clampedZoom = Math.max(0.1, Math.min(5, newZoom));
      
      if (!containerRef.current) return { ...cam, z: clampedZoom };
      
      const rect = containerRef.current.getBoundingClientRect();
      
      // Convert screen point to position relative to container center
      const containerCenterX = rect.width / 2;
      const containerCenterY = rect.height / 2;
      const screenX = screenPoint.x - rect.left;
      const screenY = screenPoint.y - rect.top;
      
      // Point in canvas space before zoom
      const canvasPointX = (screenX - containerCenterX) / cam.z - cam.x;
      const canvasPointY = (screenY - containerCenterY) / cam.z - cam.y;
      
      // Point in canvas space after zoom (should be same)
      // Solve for new camera position to keep point stationary
      const newCamX = (screenX - containerCenterX) / clampedZoom - canvasPointX;
      const newCamY = (screenY - containerCenterY) / clampedZoom - canvasPointY;
      
      return clampCamera({
        x: newCamX,
        y: newCamY,
        z: clampedZoom,
      });
    });
  }, [clampCamera]);

  // Pan state (spacebar + drag)
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState<Point | null>(null);
  const [spacePressed, setSpacePressed] = useState(false);

  // Drag state
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState<Point | null>(null);
  const [dragElement, setDragElement] = useState<any | null>(null);
  const [dragOffset, setDragOffset] = useState<Point>({ x: 0, y: 0 });
  const [dragOffsets, setDragOffsets] = useState<Map<string, Point>>(new Map()); // For multi-select drag

  // Resize state
  const [isResizing, setIsResizing] = useState(false);
  const [resizeHandle, setResizeHandle] = useState<ResizeHandle['position'] | null>(null);
  const [resizeStart, setResizeStart] = useState<{ x: number; y: number; width: number; height: number; fontSize?: number; elementX: number; elementY: number } | null>(null);

  // Multi-select resize state
  const [isMultiResizing, setIsMultiResizing] = useState(false);
  const [multiResizeStart, setMultiResizeStart] = useState<{
    mouseX: number;
    mouseY: number;
    bounds: { minX: number; minY: number; maxX: number; maxY: number };
    elements: Array<{ id: string; x: number; y: number; width: number; height: number; fontSize?: number }>;
  } | null>(null);

  // Rotation state
  const [isRotating, setIsRotating] = useState(false);
  const [rotateStart, setRotateStart] = useState<{ angle: number; elementRotation: number } | null>(null);

  // Snap guides state
  const [activeSnapGuides, setActiveSnapGuides] = useState<SnapGuide[]>([]);

  // Context menu state
  const [contextMenu, setContextMenu] = useState<ContextMenuState>({
    visible: false,
    x: 0,
    y: 0,
    elementId: null,
  });

  // Marquee selection state
  const [isMarqueeSelecting, setIsMarqueeSelecting] = useState(false);
  const [marqueeStart, setMarqueeStart] = useState<Point | null>(null);
  const [marqueeEnd, setMarqueeEnd] = useState<Point | null>(null);
  const justFinishedMarqueeRef = useRef(false); // Prevent click from clearing selection after marquee

  // Text editing click position (for cursor positioning)
  const [textEditClickPos, setTextEditClickPos] = useState<Point | null>(null);
  
  // Clipboard for copy/paste
  const [clipboard, setClipboard] = useState<any[]>([]);
  
  // Context menu submenu state
  const [contextSubmenu, setContextSubmenu] = useState<'align' | 'arrange' | null>(null);
  
  // Keyboard shortcuts help panel
  const [showShortcutsPanel, setShowShortcutsPanel] = useState(false);
  
  // Command palette state
  const [showCommandPalette, setShowCommandPalette] = useState(false);
  const [commandSearch, setCommandSearch] = useState('');
  
  // Alt+drag duplicate state
  const [isDuplicateDrag, setIsDuplicateDrag] = useState(false);

  // Get selected element
  const selectedElement = selectedIds.length === 1 
    ? elements.find((el) => el.id === selectedIds[0]) 
    : null;

  // ============================================
  // EVENT HANDLERS
  // ============================================

  const handleSelect = useCallback((id: string, e: React.MouseEvent) => {
    e.stopPropagation();

    // Check if element is part of a group
    const groupId = getElementGroup(id);

    if (e.shiftKey) {
      // Multi-select - add/remove individual element (or group)
      if (groupId) {
        // If clicking on grouped element with Shift, toggle entire group
        const groupElementIds = getGroupElements(groupId).map(el => el.id);
        const allGroupSelected = groupElementIds.every(gid => selectedIds.includes(gid));

        if (allGroupSelected) {
          // Remove entire group from selection
          setSelectedIds(selectedIds.filter(sid => !groupElementIds.includes(sid)));
        } else {
          // Add entire group to selection
          setSelectedIds([...new Set([...selectedIds, ...groupElementIds])]);
        }
      } else {
        // Regular element - toggle individual
        setSelectedIds(
          selectedIds.includes(id)
            ? selectedIds.filter((sid) => sid !== id)
            : [...selectedIds, id]
        );
      }
    } else {
      // Single select - ALWAYS clear all selections first, then select the clicked element/group
      if (groupId) {
        // Select entire group
        const groupElementIds = getGroupElements(groupId).map(el => el.id);
        setSelectedIds(groupElementIds);
      } else {
        setSelectedIds([id]);
      }
    }
  }, [selectedIds, setSelectedIds, getElementGroup, getGroupElements]);

  const handleCanvasClick = useCallback((e: React.MouseEvent) => {
    // Close context menu on any click
    setContextMenu(prev => ({ ...prev, visible: false }));
    
    // Don't clear selection if we just finished a marquee selection
    if (justFinishedMarqueeRef.current) {
      return;
    }
    
    if (e.target === canvasRef.current || e.target === containerRef.current) {
      clearSelection();
      setEditingTextId(null);
    }
  }, [clearSelection]);

  const handleContextMenu = useCallback((e: React.MouseEvent, elementId?: string) => {
    e.preventDefault();
    
    // If right-clicking on an element, select it
    if (elementId && !selectedIds.includes(elementId)) {
      setSelectedIds([elementId]);
    }
    
    setContextMenu({
      visible: true,
      x: e.clientX,
      y: e.clientY,
      elementId: elementId || null,
    });
  }, [selectedIds, setSelectedIds]);

  const closeContextMenu = useCallback(() => {
    setContextMenu(prev => ({ ...prev, visible: false }));
  }, []);
  
  // Copy selected elements to clipboard
  const handleCopy = useCallback(() => {
    const selectedElements = elements.filter(el => selectedIds.includes(el.id));
    if (selectedElements.length > 0) {
      setClipboard(selectedElements.map(el => ({ ...el })));
    }
  }, [elements, selectedIds]);
  
  // Paste elements from clipboard
  const handlePaste = useCallback(() => {
    if (clipboard.length === 0) return;
    
    const newIds: string[] = [];
    clipboard.forEach(el => {
      const newId = `${el.type}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      const newElement = {
        ...el,
        id: newId,
        x: el.x + 20,
        y: el.y + 20,
      };
      addElement(newElement);
      newIds.push(newId);
    });
    
    setSelectedIds(newIds);
    pushHistory(getStateSnapshot());
  }, [clipboard, addElement, setSelectedIds, pushHistory, getStateSnapshot]);
  
  // Toggle lock on selected elements
  const handleToggleLock = useCallback(() => {
    const selectedElements = elements.filter(el => selectedIds.includes(el.id));
    const isCurrentlyLocked = selectedElements.some(el => (el as any).metadata?.lock);
    
    selectedElements.forEach(el => {
      updateElement(el.id, {
        metadata: { ...(el as any).metadata, lock: !isCurrentlyLocked },
      } as any);
    });
    pushHistory(getStateSnapshot());
  }, [elements, selectedIds, updateElement, pushHistory, getStateSnapshot]);
  
  // Alignment handlers
  const handleAlignLeft = useCallback(() => {
    const selectedElements = elements.filter(el => selectedIds.includes(el.id));
    if (selectedElements.length <= 1) {
      selectedElements.forEach(el => updateElement(el.id, { x: 0 }));
    } else {
      const minX = Math.min(...selectedElements.map(el => el.x));
      selectedElements.forEach(el => updateElement(el.id, { x: minX }));
    }
    pushHistory(getStateSnapshot());
  }, [elements, selectedIds, updateElement, pushHistory, getStateSnapshot]);
  
  const handleAlignCenter = useCallback(() => {
    const selectedElements = elements.filter(el => selectedIds.includes(el.id));
    const centerX = canvas.width / 2;
    selectedElements.forEach(el => {
      const width = el.width || 100;
      updateElement(el.id, { x: centerX - width / 2 });
    });
    pushHistory(getStateSnapshot());
  }, [elements, selectedIds, canvas.width, updateElement, pushHistory, getStateSnapshot]);
  
  const handleAlignRight = useCallback(() => {
    const selectedElements = elements.filter(el => selectedIds.includes(el.id));
    if (selectedElements.length <= 1) {
      selectedElements.forEach(el => {
        const width = el.width || 100;
        updateElement(el.id, { x: canvas.width - width });
      });
    } else {
      const maxX = Math.max(...selectedElements.map(el => el.x + (el.width || 100)));
      selectedElements.forEach(el => {
        const width = el.width || 100;
        updateElement(el.id, { x: maxX - width });
      });
    }
    pushHistory(getStateSnapshot());
  }, [elements, selectedIds, canvas.width, updateElement, pushHistory, getStateSnapshot]);
  
  const handleAlignTop = useCallback(() => {
    const selectedElements = elements.filter(el => selectedIds.includes(el.id));
    if (selectedElements.length <= 1) {
      selectedElements.forEach(el => updateElement(el.id, { y: 0 }));
    } else {
      const minY = Math.min(...selectedElements.map(el => el.y));
      selectedElements.forEach(el => updateElement(el.id, { y: minY }));
    }
    pushHistory(getStateSnapshot());
  }, [elements, selectedIds, updateElement, pushHistory, getStateSnapshot]);
  
  const handleAlignMiddle = useCallback(() => {
    const selectedElements = elements.filter(el => selectedIds.includes(el.id));
    const centerY = canvas.height / 2;
    selectedElements.forEach(el => {
      const height = el.height || 100;
      updateElement(el.id, { y: centerY - height / 2 });
    });
    pushHistory(getStateSnapshot());
  }, [elements, selectedIds, canvas.height, updateElement, pushHistory, getStateSnapshot]);
  
  const handleAlignBottom = useCallback(() => {
    const selectedElements = elements.filter(el => selectedIds.includes(el.id));
    if (selectedElements.length <= 1) {
      selectedElements.forEach(el => {
        const height = el.height || 100;
        updateElement(el.id, { y: canvas.height - height });
      });
    } else {
      const maxY = Math.max(...selectedElements.map(el => el.y + (el.height || 100)));
      selectedElements.forEach(el => {
        const height = el.height || 100;
        updateElement(el.id, { y: maxY - height });
      });
    }
    pushHistory(getStateSnapshot());
  }, [elements, selectedIds, canvas.height, updateElement, pushHistory, getStateSnapshot]);
  
  // Distribution handlers
  const handleDistributeHorizontal = useCallback(() => {
    const selectedElements = elements.filter(el => selectedIds.includes(el.id));
    if (selectedElements.length < 3) return;
    
    const sorted = [...selectedElements].sort((a, b) => a.x - b.x);
    const first = sorted[0];
    const last = sorted[sorted.length - 1];
    const totalWidth = (last.x + (last.width || 100)) - first.x;
    const elementsWidth = sorted.reduce((sum, el) => sum + (el.width || 100), 0);
    const spacing = (totalWidth - elementsWidth) / (sorted.length - 1);
    
    let currentX = first.x;
    sorted.forEach((el, i) => {
      if (i > 0) updateElement(el.id, { x: currentX });
      currentX += (el.width || 100) + spacing;
    });
    pushHistory(getStateSnapshot());
  }, [elements, selectedIds, updateElement, pushHistory, getStateSnapshot]);
  
  const handleDistributeVertical = useCallback(() => {
    const selectedElements = elements.filter(el => selectedIds.includes(el.id));
    if (selectedElements.length < 3) return;
    
    const sorted = [...selectedElements].sort((a, b) => a.y - b.y);
    const first = sorted[0];
    const last = sorted[sorted.length - 1];
    const totalHeight = (last.y + (last.height || 100)) - first.y;
    const elementsHeight = sorted.reduce((sum, el) => sum + (el.height || 100), 0);
    const spacing = (totalHeight - elementsHeight) / (sorted.length - 1);
    
    let currentY = first.y;
    sorted.forEach((el, i) => {
      if (i > 0) updateElement(el.id, { y: currentY });
      currentY += (el.height || 100) + spacing;
    });
    pushHistory(getStateSnapshot());
  }, [elements, selectedIds, updateElement, pushHistory, getStateSnapshot]);
  
  // Tidy Up - arrange elements into a grid
  const handleTidyUp = useCallback(() => {
    const selectedElements = elements.filter(el => selectedIds.includes(el.id));
    if (selectedElements.length < 2) return;
    
    // Calculate grid dimensions
    const cols = Math.ceil(Math.sqrt(selectedElements.length));
    
    // Find average element size for spacing
    const avgWidth = selectedElements.reduce((sum, el) => sum + (el.width || 100), 0) / selectedElements.length;
    const avgHeight = selectedElements.reduce((sum, el) => sum + (el.height || 100), 0) / selectedElements.length;
    const gap = 20;
    
    // Start from top-left of bounding box
    const minX = Math.min(...selectedElements.map(el => el.x));
    const minY = Math.min(...selectedElements.map(el => el.y));
    
    // Sort by position (top-left to bottom-right)
    const sorted = [...selectedElements].sort((a, b) => {
      const rowA = Math.floor((a.y - minY) / (avgHeight + gap));
      const rowB = Math.floor((b.y - minY) / (avgHeight + gap));
      if (rowA !== rowB) return rowA - rowB;
      return a.x - b.x;
    });
    
    sorted.forEach((el, i) => {
      const col = i % cols;
      const row = Math.floor(i / cols);
      updateElement(el.id, {
        x: minX + col * (avgWidth + gap),
        y: minY + row * (avgHeight + gap),
      });
    });
    pushHistory(getStateSnapshot());
  }, [elements, selectedIds, updateElement, pushHistory, getStateSnapshot]);
  
  // Paste in place (same position as original)
  const handlePasteInPlace = useCallback(() => {
    if (clipboard.length === 0) return;
    
    const newIds: string[] = [];
    clipboard.forEach(el => {
      const newId = `${el.type}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      addElement({ ...el, id: newId });
      newIds.push(newId);
    });
    
    setSelectedIds(newIds);
    pushHistory(getStateSnapshot());
  }, [clipboard, addElement, setSelectedIds, pushHistory, getStateSnapshot]);

  const handleDoubleClick = useCallback((element: any, e?: React.MouseEvent) => {
    // Check if element is locked - prevent editing
    if ((element as any).metadata?.lock) return;
    
    if (element.type === 'text') {
      setEditingTextId(element.id);
      
      // Capture click position for cursor positioning
      if (e && canvasRef.current) {
        const rect = canvasRef.current.getBoundingClientRect();
        setTextEditClickPos({
          x: (e.clientX - rect.left) / zoom,
          y: (e.clientY - rect.top) / zoom,
        });
      } else {
        setTextEditClickPos(null);
      }
    }
  }, [zoom]);

  const handleTextSave = useCallback((text: string) => {
    if (editingTextId) {
      const element = elements.find((el) => el.id === editingTextId);
      if (element) {
        const measured = measureTextDimensions({ ...element, text });
        updateElement(editingTextId, { text, height: measured.height });
      }
      setEditingTextId(null);
    }
  }, [editingTextId, elements, updateElement]);

  const handleTextCancel = useCallback(() => {
    setEditingTextId(null);
  }, []);

  // Real-time text change handler - updates store so selection box updates
  const handleTextChange = useCallback((text: string) => {
    if (editingTextId) {
      const element = elements.find((el) => el.id === editingTextId);
      if (element) {
        const measured = measureTextDimensions({ ...element, text });
        updateElement(editingTextId, { text, height: measured.height });
      }
    }
  }, [editingTextId, elements, updateElement]);

  // ============================================
  // DRAG HANDLERS
  // ============================================

  const handleDragStart = useCallback((element: any, e: React.MouseEvent) => {
    if (editingTextId) return;
    
    // Check if element is locked - prevent dragging
    if ((element as any).metadata?.lock) {
      // Still allow selection, just don't start dragging
      if (!selectedIds.includes(element.id)) {
        setSelectedIds([element.id]);
      }
      return;
    }
    
    e.preventDefault();
    setIsDragging(true);
    setDragElement(element);
    setDragStart({ x: e.clientX, y: e.clientY });
    setDragOffset({ x: element.x, y: element.y });
    
    // Check if element is part of a group
    const groupId = getElementGroup(element.id);
    
    // If element is already selected, capture all selected elements' positions for multi-drag
    if (selectedIds.includes(element.id)) {
      const offsets = new Map<string, Point>();
      selectedIds.forEach(id => {
        const el = elements.find(e => e.id === id);
        if (el) {
          offsets.set(id, { x: el.x, y: el.y });
        }
      });
      setDragOffsets(offsets);
    } else {
      // If clicking on unselected element, check if it's part of a group
      if (groupId) {
        // Select entire group and set up drag for all group elements
        const groupElementsList = getGroupElements(groupId);
        const groupIds = groupElementsList.map(el => el.id);
        setSelectedIds(groupIds);
        
        const offsets = new Map<string, Point>();
        groupElementsList.forEach(el => {
          offsets.set(el.id, { x: el.x, y: el.y });
        });
        setDragOffsets(offsets);
      } else {
        // Single ungrouped element
        setSelectedIds([element.id]);
        setDragOffsets(new Map([[element.id, { x: element.x, y: element.y }]]));
      }
    }
  }, [editingTextId, selectedIds, setSelectedIds, elements, getElementGroup, getGroupElements]);

  const handleMouseUp = useCallback(() => {
    // Finalize marquee selection
    if (isMarqueeSelecting && marqueeStart && marqueeEnd) {
      const minX = Math.min(marqueeStart.x, marqueeEnd.x);
      const maxX = Math.max(marqueeStart.x, marqueeEnd.x);
      const minY = Math.min(marqueeStart.y, marqueeEnd.y);
      const maxY = Math.max(marqueeStart.y, marqueeEnd.y);
      
      // Find elements that intersect with the marquee
      const selectedElements = elements.filter(el => {
        const measured = el.type === 'text' ? measureTextDimensions(el) : null;
        const elWidth = measured?.width || el.width || 100;
        const elHeight = measured?.height || el.height || 100;
        
        // Check if element intersects with marquee rectangle
        return !(el.x + elWidth < minX || el.x > maxX || el.y + elHeight < minY || el.y > maxY);
      });
      
      if (selectedElements.length > 0) {
        setSelectedIds(selectedElements.map(el => el.id));
        // Prevent the subsequent click event from clearing the selection
        justFinishedMarqueeRef.current = true;
        setTimeout(() => { justFinishedMarqueeRef.current = false; }, 0);
      }
    }
    
    setIsMarqueeSelecting(false);
    setMarqueeStart(null);
    setMarqueeEnd(null);
    setIsDragging(false);
    setDragStart(null);
    setDragElement(null);
    setIsResizing(false);
    setResizeHandle(null);
    setResizeStart(null);
    setIsRotating(false);
    setRotateStart(null);
    setIsMultiResizing(false);
    setMultiResizeStart(null);
    setActiveSnapGuides([]); // Clear snap guides
    setIsDuplicateDrag(false); // Reset duplicate drag state
  }, [isMarqueeSelecting, marqueeStart, marqueeEnd, elements, setSelectedIds]);

  // ============================================
  // RESIZE HANDLERS
  // ============================================

  const handleResizeStart = useCallback((handle: ResizeHandle['position'], e: React.MouseEvent) => {
    if (!selectedElement) return;
    
    // Check if element is locked - prevent resizing
    if ((selectedElement as any).metadata?.lock) return;
    
    e.preventDefault();
    setIsResizing(true);
    setResizeHandle(handle);
    
    const measured = selectedElement.type === 'text' ? measureTextDimensions(selectedElement) : null;
    
    // For text, use measured dimensions as the starting point
    // This ensures multi-line text is handled correctly
    const startWidth = measured?.width || selectedElement.width || 100;
    const startHeight = measured?.height || selectedElement.height || 100;
    
    setResizeStart({
      x: e.clientX,
      y: e.clientY,
      width: startWidth,
      height: startHeight,
      fontSize: (selectedElement as any).fontSize || 32,
      elementX: selectedElement.x,
      elementY: selectedElement.y,
    });
  }, [selectedElement]);

  const handleResize = useCallback((e: React.MouseEvent) => {
    if (!selectedElement || !resizeStart || !resizeHandle) return;

    const dx = (e.clientX - resizeStart.x) / zoom;
    const dy = (e.clientY - resizeStart.y) / zoom;

    let newWidth = resizeStart.width;
    let newHeight = resizeStart.height;
    // Use original position from resizeStart, not current element position
    let newX = resizeStart.elementX;
    let newY = resizeStart.elementY;
    let newFontSize = resizeStart.fontSize;

    const isSideHandle = ['middle-left', 'middle-right'].includes(resizeHandle);
    const isCornerHandle = ['top-left', 'top-right', 'bottom-left', 'bottom-right'].includes(resizeHandle);

    if (selectedElement.type === 'text') {
      if (isSideHandle) {
        // Side handles: width only, text reflows
        if (resizeHandle === 'middle-right') {
          newWidth = Math.max(resizeStart.width + dx, 20);
        } else if (resizeHandle === 'middle-left') {
          const widthChange = resizeStart.width - Math.max(resizeStart.width - dx, 20);
          newWidth = Math.max(resizeStart.width - dx, 20);
          newX = resizeStart.elementX + widthChange;
        }
        
        // Recalculate height for text reflow
        const measured = measureTextDimensions({
          ...selectedElement,
          width: newWidth,
        });
        newHeight = measured.height;
        
      } else if (isCornerHandle) {
        // Corner handles: scale font size proportionally
        const scaleX = (resizeStart.width + dx) / resizeStart.width;
        const scaleY = (resizeStart.height + dy) / resizeStart.height;
        const scale = Math.max((scaleX + scaleY) / 2, 0.1);
        
        newFontSize = Math.max((resizeStart.fontSize || 32) * scale, 8);
        newWidth = Math.max(resizeStart.width * scale, 20);
        
        // Recalculate height with new font size
        const measured = measureTextDimensions({
          ...selectedElement,
          fontSize: newFontSize,
          width: newWidth,
        });
        newHeight = measured.height;
        
        // Adjust position for corner handles based on original position
        if (resizeHandle.includes('left')) {
          newX = resizeStart.elementX + (resizeStart.width - newWidth);
        }
        if (resizeHandle.includes('top')) {
          newY = resizeStart.elementY + (resizeStart.height - newHeight);
        }
      }

      updateElement(selectedElement.id, {
        x: newX,
        y: newY,
        width: newWidth,
        height: newHeight,
        ...(newFontSize !== resizeStart.fontSize && { fontSize: newFontSize }),
      });
    } else {
      // Non-text elements: standard resize using original position
      switch (resizeHandle) {
        case 'bottom-right':
          newWidth = Math.max(resizeStart.width + dx, 20);
          newHeight = Math.max(resizeStart.height + dy, 20);
          break;
        case 'bottom-left':
          newWidth = Math.max(resizeStart.width - dx, 20);
          newHeight = Math.max(resizeStart.height + dy, 20);
          newX = resizeStart.elementX + dx;
          break;
        case 'top-right':
          newWidth = Math.max(resizeStart.width + dx, 20);
          newHeight = Math.max(resizeStart.height - dy, 20);
          newY = resizeStart.elementY + dy;
          break;
        case 'top-left':
          newWidth = Math.max(resizeStart.width - dx, 20);
          newHeight = Math.max(resizeStart.height - dy, 20);
          newX = resizeStart.elementX + dx;
          newY = resizeStart.elementY + dy;
          break;
        case 'middle-right':
          newWidth = Math.max(resizeStart.width + dx, 20);
          break;
        case 'middle-left':
          newWidth = Math.max(resizeStart.width - dx, 20);
          newX = resizeStart.elementX + dx;
          break;
        case 'middle-bottom':
          newHeight = Math.max(resizeStart.height + dy, 20);
          break;
        case 'middle-top':
          newHeight = Math.max(resizeStart.height - dy, 20);
          newY = resizeStart.elementY + dy;
          break;
      }

      updateElement(selectedElement.id, {
        x: newX,
        y: newY,
        width: newWidth,
        height: newHeight,
      });
    }
  }, [selectedElement, resizeStart, resizeHandle, zoom, updateElement]);

  // ============================================
  // MULTI-SELECT RESIZE HANDLERS
  // ============================================

  const handleMultiResizeStart = useCallback((handle: ResizeHandle['position'], e: React.MouseEvent) => {
    if (selectedIds.length < 2) return;
    
    e.preventDefault();
    setIsMultiResizing(true);
    setResizeHandle(handle);
    
    // Calculate bounds and capture all element positions/sizes
    const selectedElements = elements.filter(el => selectedIds.includes(el.id));
    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
    
    const elementData = selectedElements.map(el => {
      const measured = el.type === 'text' ? measureTextDimensions(el) : null;
      const w = measured?.width || el.width || 100;
      const h = measured?.height || el.height || 100;
      minX = Math.min(minX, el.x);
      minY = Math.min(minY, el.y);
      maxX = Math.max(maxX, el.x + w);
      maxY = Math.max(maxY, el.y + h);
      return {
        id: el.id,
        x: el.x,
        y: el.y,
        width: w,
        height: h,
        fontSize: (el as any).fontSize,
      };
    });
    
    setMultiResizeStart({
      mouseX: e.clientX,
      mouseY: e.clientY,
      bounds: { minX, minY, maxX, maxY },
      elements: elementData,
    });
  }, [selectedIds, elements]);

  const handleMultiResize = useCallback((e: React.MouseEvent) => {
    if (!multiResizeStart || !resizeHandle) return;
    
    const { bounds, elements: startElements } = multiResizeStart;
    const boundsWidth = bounds.maxX - bounds.minX;
    const boundsHeight = bounds.maxY - bounds.minY;
    
    const dx = (e.clientX - multiResizeStart.mouseX) / zoom;
    const dy = (e.clientY - multiResizeStart.mouseY) / zoom;
    
    // Calculate scale factor based on handle position
    let scaleX = 1, scaleY = 1;
    let originX = bounds.minX, originY = bounds.minY;
    
    switch (resizeHandle) {
      case 'bottom-right':
        scaleX = Math.max((boundsWidth + dx) / boundsWidth, 0.1);
        scaleY = Math.max((boundsHeight + dy) / boundsHeight, 0.1);
        break;
      case 'bottom-left':
        scaleX = Math.max((boundsWidth - dx) / boundsWidth, 0.1);
        scaleY = Math.max((boundsHeight + dy) / boundsHeight, 0.1);
        originX = bounds.maxX;
        break;
      case 'top-right':
        scaleX = Math.max((boundsWidth + dx) / boundsWidth, 0.1);
        scaleY = Math.max((boundsHeight - dy) / boundsHeight, 0.1);
        originY = bounds.maxY;
        break;
      case 'top-left':
        scaleX = Math.max((boundsWidth - dx) / boundsWidth, 0.1);
        scaleY = Math.max((boundsHeight - dy) / boundsHeight, 0.1);
        originX = bounds.maxX;
        originY = bounds.maxY;
        break;
    }
    
    // Use uniform scale (average of X and Y) for proportional scaling
    const scale = (scaleX + scaleY) / 2;
    
    // Update each element
    startElements.forEach(startEl => {
      const el = elements.find(e => e.id === startEl.id);
      if (!el) return;
      
      // Calculate new position relative to origin
      const relX = startEl.x - originX;
      const relY = startEl.y - originY;
      const newX = originX + relX * scale;
      const newY = originY + relY * scale;
      
      // Calculate new size
      const newWidth = startEl.width * scale;
      const newHeight = startEl.height * scale;
      
      const updates: any = {
        x: newX,
        y: newY,
        width: Math.max(newWidth, 10),
        height: Math.max(newHeight, 10),
      };
      
      // Scale font size for text elements
      if (el.type === 'text' && startEl.fontSize) {
        updates.fontSize = Math.max(Math.round(startEl.fontSize * scale), 8);
      }
      
      updateElement(startEl.id, updates);
    });
  }, [multiResizeStart, resizeHandle, zoom, elements, updateElement]);

  // ============================================
  // ROTATION HANDLERS
  // ============================================

  const handleRotateStart = useCallback((e: React.MouseEvent) => {
    if (!selectedElement || !canvasRef.current) return;
    
    // Check if element is locked - prevent rotating
    if ((selectedElement as any).metadata?.lock) return;
    
    e.preventDefault();
    setIsRotating(true);

    const measured = selectedElement.type === 'text' ? measureTextDimensions(selectedElement) : null;
    const width = selectedElement.width || measured?.width || 100;
    const height = selectedElement.height || measured?.height || 100;

    // Calculate center of element
    const centerX = selectedElement.x + width / 2;
    const centerY = selectedElement.y + height / 2;

    // Get canvas position - getBoundingClientRect accounts for all transforms
    const canvasRect = canvasRef.current.getBoundingClientRect();
    // Convert screen coords to canvas coords
    const mouseX = (e.clientX - canvasRect.left) / zoom;
    const mouseY = (e.clientY - canvasRect.top) / zoom;

    // Calculate initial angle
    const angle = Math.atan2(mouseY - centerY, mouseX - centerX) * (180 / Math.PI);

    setRotateStart({
      angle,
      elementRotation: selectedElement.rotation || 0,
    });
  }, [selectedElement, zoom]);

  const handleRotate = useCallback((e: React.MouseEvent) => {
    if (!selectedElement || !rotateStart || !canvasRef.current) return;

    const measured = selectedElement.type === 'text' ? measureTextDimensions(selectedElement) : null;
    const width = selectedElement.width || measured?.width || 100;
    const height = selectedElement.height || measured?.height || 100;

    // Calculate center of element
    const centerX = selectedElement.x + width / 2;
    const centerY = selectedElement.y + height / 2;

    // Get canvas position - getBoundingClientRect accounts for all transforms
    const canvasRect = canvasRef.current.getBoundingClientRect();
    // Convert screen coords to canvas coords
    const mouseX = (e.clientX - canvasRect.left) / zoom;
    const mouseY = (e.clientY - canvasRect.top) / zoom;

    // Calculate current angle
    const currentAngle = Math.atan2(mouseY - centerY, mouseX - centerX) * (180 / Math.PI);
    const deltaAngle = currentAngle - rotateStart.angle;
    let newRotation = rotateStart.elementRotation + deltaAngle;

    // Snap rotation
    newRotation = snapRotation(newRotation);

    updateElement(selectedElement.id, { rotation: newRotation });
  }, [selectedElement, rotateStart, zoom, updateElement]);

  // ============================================
  // MOUSE MOVE HANDLER (after resize/rotate are defined)
  // ============================================

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    // Handle panning (spacebar + drag)
    if (isPanning && panStart) {
      const dx = e.clientX - panStart.x;
      const dy = e.clientY - panStart.y;
      panCamera(dx, dy);
      setPanStart({ x: e.clientX, y: e.clientY });
      return;
    }
    
    // Handle marquee selection
    if (isMarqueeSelecting && marqueeStart) {
      const rect = canvasRef.current?.getBoundingClientRect();
      if (rect) {
        // Calculate position in canvas coordinates (matching handleContainerMouseDown)
        const x = (e.clientX - rect.left) / zoom;
        const y = (e.clientY - rect.top) / zoom;
        setMarqueeEnd({ x, y });
      }
      return;
    }
    
    if (isDragging && dragStart && dragElement) {
      let dx = (e.clientX - dragStart.x) / zoom;
      let dy = (e.clientY - dragStart.y) / zoom;
      
      // Shift+Drag: Constrain to horizontal or vertical axis
      if (e.shiftKey) {
        if (Math.abs(dx) > Math.abs(dy)) {
          dy = 0; // Constrain to horizontal
        } else {
          dx = 0; // Constrain to vertical
        }
      }
      
      // Alt+Drag: Duplicate elements on first move
      if (e.altKey && !isDuplicateDrag) {
        setIsDuplicateDrag(true);
        // Duplicate all selected elements
        const newIds: string[] = [];
        const newOffsets = new Map<string, Point>();
        
        dragOffsets.forEach((offset, id) => {
          const el = elements.find(e => e.id === id);
          if (el) {
            const newId = `${el.type}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
            addElement({ ...el, id: newId });
            newIds.push(newId);
            newOffsets.set(newId, { x: offset.x, y: offset.y });
          }
        });
        
        // Switch to dragging the new duplicates
        setSelectedIds(newIds);
        setDragOffsets(newOffsets);
        const newDragEl = elements.find(e => e.id === dragElement.id);
        if (newDragEl) {
          const newId = newIds[0];
          setDragElement({ ...newDragEl, id: newId });
        }
        return;
      }
      
      // Calculate new position for the primary drag element
      let newX = dragOffset.x + dx;
      let newY = dragOffset.y + dy;
      
      // Get element dimensions for snapping
      const measured = dragElement.type === 'text' ? measureTextDimensions(dragElement) : null;
      const width = measured?.width || dragElement.width || 100;
      const height = measured?.height || dragElement.height || 100;
      
      // Calculate snap position (only snap the primary element)
      const snapResult = calculateSnap(
        { x: newX, y: newY, width, height, id: dragElement.id },
        elements.filter(el => !selectedIds.includes(el.id)), // Exclude selected elements from snap targets
        canvas,
        measureTextDimensions
      );
      
      // Calculate the snap delta
      const snapDx = snapResult.x - newX;
      const snapDy = snapResult.y - newY;
      
      // Move all selected elements together
      if (dragOffsets.size > 1) {
        // Multi-select drag: move all selected elements
        dragOffsets.forEach((offset, id) => {
          updateElement(id, {
            x: offset.x + dx + snapDx,
            y: offset.y + dy + snapDy,
          });
        });
      } else {
        // Single element drag
        updateElement(dragElement.id, {
          x: snapResult.x,
          y: snapResult.y,
        });
      }
      
      // Update active snap guides for visual feedback
      setActiveSnapGuides(snapResult.guides);
    }

    if (isResizing && resizeHandle && selectedElement && resizeStart) {
      handleResize(e);
    }

    if (isMultiResizing && resizeHandle && multiResizeStart) {
      handleMultiResize(e);
    }

    if (isRotating && selectedElement && rotateStart) {
      handleRotate(e);
    }
  }, [isPanning, panStart, isMarqueeSelecting, marqueeStart, isDragging, dragStart, dragElement, dragOffset, dragOffsets, selectedIds, zoom, elements, canvas, isResizing, resizeHandle, selectedElement, resizeStart, isMultiResizing, multiResizeStart, isRotating, rotateStart, updateElement, handleResize, handleMultiResize, handleRotate]);

  // ============================================
  // ZOOM & PAN HANDLERS
  // ============================================

  // Use native wheel event listener with passive: false to prevent browser zoom
  // React's onWheel can't always prevent default for pinch-to-zoom
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    
    const handleWheel = (e: WheelEvent) => {
      // Always prevent default to stop browser zoom
      e.preventDefault();
      
      // Pinch-to-zoom on trackpad sends ctrlKey with wheel events
      // Ctrl/Cmd + scroll = zoom
      if (e.ctrlKey || e.metaKey) {
        // For pinch gestures, deltaY is the zoom amount
        // Smaller multiplier for smoother pinch zoom
        const zoomSensitivity = 0.01;
        const currentZoom = camera.z;
        const newZoom = currentZoom * (1 - e.deltaY * zoomSensitivity);
        
        // Zoom toward mouse/pinch center position
        zoomCameraTo({ x: e.clientX, y: e.clientY }, newZoom);
      } else {
        // Normal scroll = pan around the canvas
        // Shift + scroll = horizontal pan
        const deltaX = e.shiftKey ? e.deltaY : e.deltaX;
        const deltaY = e.shiftKey ? 0 : e.deltaY;
        
        // Pan (negative because we're moving the camera, not the content)
        panCamera(-deltaX, -deltaY);
      }
    };
    
    // Add with passive: false to allow preventDefault
    container.addEventListener('wheel', handleWheel, { passive: false });
    
    return () => {
      container.removeEventListener('wheel', handleWheel);
    };
  }, [camera.z, panCamera, zoomCameraTo]);
  
  // ============================================
  // TOUCH/PINCH ZOOM HANDLERS
  // ============================================
  
  const lastTouchDistance = useRef<number | null>(null);
  const lastTouchCenter = useRef<Point | null>(null);
  
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (e.touches.length === 2) {
      // Two finger touch - prepare for pinch zoom
      const touch1 = e.touches[0];
      const touch2 = e.touches[1];
      const distance = Math.hypot(
        touch2.clientX - touch1.clientX,
        touch2.clientY - touch1.clientY
      );
      lastTouchDistance.current = distance;
      lastTouchCenter.current = {
        x: (touch1.clientX + touch2.clientX) / 2,
        y: (touch1.clientY + touch2.clientY) / 2,
      };
    }
  }, []);
  
  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (e.touches.length === 2 && lastTouchDistance.current !== null && lastTouchCenter.current !== null) {
      e.preventDefault();
      
      const touch1 = e.touches[0];
      const touch2 = e.touches[1];
      const newDistance = Math.hypot(
        touch2.clientX - touch1.clientX,
        touch2.clientY - touch1.clientY
      );
      const newCenter = {
        x: (touch1.clientX + touch2.clientX) / 2,
        y: (touch1.clientY + touch2.clientY) / 2,
      };
      
      // Calculate zoom change
      const scale = newDistance / lastTouchDistance.current;
      const newZoom = zoom * scale;
      
      // Zoom toward pinch center
      zoomCameraTo(newCenter, newZoom);
      
      // Also pan if the center moved
      const dx = newCenter.x - lastTouchCenter.current.x;
      const dy = newCenter.y - lastTouchCenter.current.y;
      if (Math.abs(dx) > 1 || Math.abs(dy) > 1) {
        panCamera(dx, dy);
      }
      
      lastTouchDistance.current = newDistance;
      lastTouchCenter.current = newCenter;
    }
  }, [zoom, zoomCameraTo, panCamera]);
  
  const handleTouchEnd = useCallback(() => {
    lastTouchDistance.current = null;
    lastTouchCenter.current = null;
  }, []);

  // ============================================
  // KEYBOARD HANDLERS
  // ============================================

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Spacebar for panning
      if (e.code === 'Space' && !editingTextId) {
        e.preventDefault();
        setSpacePressed(true);
      }
      
      if (editingTextId) return;

      if (e.key === 'Delete' || e.key === 'Backspace') {
        if (selectedIds.length > 0) {
          const { deleteElements } = useEditorStore.getState();
          deleteElements(selectedIds);
        }
      }

      if (e.key === 'Escape') {
        clearSelection();
        setEditingTextId(null);
      }
      
      // Copy (Ctrl/Cmd + C)
      if ((e.ctrlKey || e.metaKey) && e.key === 'c') {
        e.preventDefault();
        handleCopy();
      }
      
      // Paste (Ctrl/Cmd + V) or Paste in Place (Ctrl/Cmd + Shift + V)
      if ((e.ctrlKey || e.metaKey) && e.key === 'v') {
        e.preventDefault();
        if (e.shiftKey) {
          handlePasteInPlace();
        } else {
          handlePaste();
        }
      }
      
      // Show keyboard shortcuts (?)
      if (e.key === '?' || (e.shiftKey && e.key === '/')) {
        e.preventDefault();
        setShowShortcutsPanel(prev => !prev);
      }
      
      // Undo (Ctrl/Cmd + Z)
      if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey) {
        e.preventDefault();
        undo();
      }
      
      // Redo (Ctrl/Cmd + Shift + Z or Ctrl/Cmd + Y)
      if ((e.ctrlKey || e.metaKey) && ((e.key === 'z' && e.shiftKey) || e.key === 'y')) {
        e.preventDefault();
        redo();
      }
      
      // Command Palette (Ctrl/Cmd + K)
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setShowCommandPalette(prev => !prev);
        setCommandSearch('');
      }
      
      // Zoom to Selection (Z key)
      if (e.key === 'z' && !e.ctrlKey && !e.metaKey && selectedIds.length > 0) {
        e.preventDefault();
        // Calculate bounding box of selected elements
        const selectedEls = elements.filter(el => selectedIds.includes(el.id));
        if (selectedEls.length > 0 && containerRef.current) {
          let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
          selectedEls.forEach(el => {
            minX = Math.min(minX, el.x);
            minY = Math.min(minY, el.y);
            maxX = Math.max(maxX, el.x + (el.width || 100));
            maxY = Math.max(maxY, el.y + (el.height || 100));
          });
          
          const containerRect = containerRef.current.getBoundingClientRect();
          const padding = 100;
          const selectionWidth = maxX - minX;
          const selectionHeight = maxY - minY;
          const scaleX = (containerRect.width - padding * 2) / selectionWidth;
          const scaleY = (containerRect.height - padding * 2) / selectionHeight;
          const newZoom = Math.min(scaleX, scaleY, 2); // Max zoom 200%
          
          // Center on selection
          const centerX = (minX + maxX) / 2;
          const centerY = (minY + maxY) / 2;
          
          setZoom(newZoom);
          setPan({ x: -centerX + canvas.width / 2, y: -centerY + canvas.height / 2 });
        }
      }
      
      // Lock (Ctrl/Cmd + L)
      if ((e.ctrlKey || e.metaKey) && e.key === 'l') {
        e.preventDefault();
        if (selectedIds.length > 0) {
          handleToggleLock();
        }
      }
      
      // Zoom shortcuts
      if ((e.ctrlKey || e.metaKey) && (e.key === '=' || e.key === '+')) {
        e.preventDefault();
        setZoom(z => Math.min(5, z * 1.2));
      }
      if ((e.ctrlKey || e.metaKey) && e.key === '-') {
        e.preventDefault();
        setZoom(z => Math.max(0.1, z / 1.2));
      }
      if ((e.ctrlKey || e.metaKey) && e.key === '0') {
        e.preventDefault();
        // Use zoomToFit via ref since this is in useEffect
        if (containerRef.current) {
          const containerRect = containerRef.current.getBoundingClientRect();
          const padding = 60;
          const availableWidth = containerRect.width - padding * 2;
          const availableHeight = containerRect.height - padding * 2;
          const { canvas } = useEditorStore.getState();
          const scaleX = availableWidth / canvas.width;
          const scaleY = availableHeight / canvas.height;
          const newZoom = Math.min(scaleX, scaleY, 1);
          setZoom(newZoom);
          setPan({ x: 0, y: 0 });
        }
      }
      
      // Arrow keys - nudge selected elements or pan canvas
      const nudgeAmount = e.shiftKey ? 10 : 1; // Shift for larger nudge
      const panAmount = e.shiftKey ? 50 : 20;
      
      if (e.key === 'ArrowUp' || e.key === 'ArrowDown' || e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
        e.preventDefault();
        
        // If elements are selected and not holding space, nudge elements
        if (selectedIds.length > 0 && !spacePressed) {
          const dx = e.key === 'ArrowLeft' ? -nudgeAmount : e.key === 'ArrowRight' ? nudgeAmount : 0;
          const dy = e.key === 'ArrowUp' ? -nudgeAmount : e.key === 'ArrowDown' ? nudgeAmount : 0;
          
          const { elements: currentElements, updateElement: update, pushHistory: push, getStateSnapshot: getSnapshot } = useEditorStore.getState();
          // Only nudge unlocked elements
          let anyMoved = false;
          selectedIds.forEach(id => {
            const el = currentElements.find(e => e.id === id);
            if (el && !(el as any).metadata?.lock) {
              update(id, { x: el.x + dx, y: el.y + dy });
              anyMoved = true;
            }
          });
          if (anyMoved) push(getSnapshot());
        } else {
          // Pan canvas
          const doPan = (dx: number, dy: number) => {
            setCamera(cam => {
              if (!containerRef.current) return cam;
              
              const containerRect = containerRef.current.getBoundingClientRect();
              const { canvas: canvasState } = useEditorStore.getState();
              
              const scaledCanvasWidth = canvasState.width * cam.z;
              const scaledCanvasHeight = canvasState.height * cam.z;
              const canvasFitsHorizontally = scaledCanvasWidth <= containerRect.width;
              const canvasFitsVertically = scaledCanvasHeight <= containerRect.height;
              const edgeMargin = 40;
              
              let newX = cam.x + dx / cam.z;
              let newY = cam.y + dy / cam.z;
              
              if (canvasFitsHorizontally) {
                newX = 0;
              } else {
                const excessWidth = scaledCanvasWidth - containerRect.width;
                const maxPanX = (excessWidth / 2 + edgeMargin) / cam.z;
                newX = Math.max(-maxPanX, Math.min(maxPanX, newX));
              }
              
              if (canvasFitsVertically) {
                newY = 0;
              } else {
                const excessHeight = scaledCanvasHeight - containerRect.height;
                const maxPanY = (excessHeight / 2 + edgeMargin) / cam.z;
                newY = Math.max(-maxPanY, Math.min(maxPanY, newY));
              }
              
              return { x: newX, y: newY, z: cam.z };
            });
          };
          
          if (e.key === 'ArrowUp') doPan(0, panAmount);
          if (e.key === 'ArrowDown') doPan(0, -panAmount);
          if (e.key === 'ArrowLeft') doPan(panAmount, 0);
          if (e.key === 'ArrowRight') doPan(-panAmount, 0);
        }
      }
    };
    
    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        setSpacePressed(false);
        setIsPanning(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [selectedIds, editingTextId, clearSelection, spacePressed, zoom, handleCopy, handlePaste, handlePasteInPlace, handleToggleLock, undo, redo, elements, canvas]);

  // ============================================
  // ZOOM TO FIT ON INITIAL LOAD
  // ============================================
  
  const zoomToFit = useCallback(() => {
    if (!containerRef.current) return;
    
    const containerRect = containerRef.current.getBoundingClientRect();
    const containerWidth = containerRect.width;
    const containerHeight = containerRect.height;
    
    // Add padding around the canvas (like Figma does)
    const padding = 60;
    const availableWidth = containerWidth - padding * 2;
    const availableHeight = containerHeight - padding * 2;
    
    // Calculate scale to fit canvas in viewport
    const scaleX = availableWidth / canvas.width;
    const scaleY = availableHeight / canvas.height;
    const newZoom = Math.min(scaleX, scaleY, 1); // Don't zoom in past 100%
    
    // Reset camera to center with new zoom
    setCamera({ x: 0, y: 0, z: newZoom });
  }, [canvas.width, canvas.height]);

  // Initialize zoom to fit on mount
  useEffect(() => {
    if (!hasInitialized && containerRef.current) {
      // Small delay to ensure container is properly sized
      const timer = setTimeout(() => {
        zoomToFit();
        setHasInitialized(true);
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [hasInitialized, zoomToFit]);

  // Re-fit when canvas size changes (e.g., switching presets)
  // Store previous dimensions to detect actual changes
  const prevCanvasSizeRef = useRef({ width: canvas.width, height: canvas.height });
  
  useEffect(() => {
    const prevSize = prevCanvasSizeRef.current;
    const sizeChanged = prevSize.width !== canvas.width || prevSize.height !== canvas.height;
    
    if (hasInitialized && sizeChanged) {
      // Update ref
      prevCanvasSizeRef.current = { width: canvas.width, height: canvas.height };
      // Zoom to fit with new dimensions
      zoomToFit();
    }
  }, [canvas.width, canvas.height, hasInitialized, zoomToFit]);
  
  // Also listen for the custom event from CanvasSizeSelector
  useEffect(() => {
    const handleCanvasSizeChanged = () => {
      // Small delay to ensure store has updated
      setTimeout(() => {
        zoomToFit();
      }, 50);
    };
    
    window.addEventListener('kanva-canvas-size-changed', handleCanvasSizeChanged);
    return () => window.removeEventListener('kanva-canvas-size-changed', handleCanvasSizeChanged);
  }, [zoomToFit]);

  // ============================================
  // RENDER
  // ============================================

  const editingElement = editingTextId ? elements.find((el) => el.id === editingTextId) : null;

  // Handle pan start when spacebar is pressed, or marquee selection on empty canvas
  const handleContainerMouseDown = useCallback((e: React.MouseEvent) => {
    if (spacePressed) {
      e.preventDefault();
      setIsPanning(true);
      setPanStart({ x: e.clientX, y: e.clientY });
      return;
    }
    
    // Start marquee selection if clicking on empty canvas (not on an element)
    const target = e.target as HTMLElement;
    if (target === containerRef.current || target === canvasRef.current) {
      const rect = canvasRef.current?.getBoundingClientRect();
      if (rect) {
        // getBoundingClientRect returns the scaled/transformed rect
        // So we need to convert screen coords to canvas coords by dividing by zoom
        const x = (e.clientX - rect.left) / zoom;
        const y = (e.clientY - rect.top) / zoom;
        
        // Clear selection unless Shift is held (for additive selection)
        if (!e.shiftKey) {
          clearSelection();
        }
        
        setIsMarqueeSelecting(true);
        setMarqueeStart({ x, y });
        setMarqueeEnd({ x, y });
      }
    }
  }, [spacePressed, zoom, clearSelection]);

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full overflow-hidden bg-gray-100 touch-none"
      style={{ cursor: spacePressed ? 'grab' : 'default' }}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onMouseDown={handleContainerMouseDown}
      onClick={handleCanvasClick}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onContextMenu={(e) => handleContextMenu(e)}
    >
      {/* Canvas area - centered with zoom and pan */}
      <div
        ref={canvasRef}
        className="absolute shadow-lg"
        style={{
          // Position canvas at center of container, then apply user pan
          left: `calc(50% + ${pan.x}px)`,
          top: `calc(50% + ${pan.y}px)`,
          width: canvas.width,
          height: canvas.height,
          // Scale from center, offset by half dimensions to keep centered
          transform: `translate(-50%, -50%) scale(${zoom})`,
          transformOrigin: 'center center',
          backgroundColor: canvas.background?.color || '#ffffff',
          backgroundImage: canvas.background?.gradient 
            ? canvas.background.gradient 
            : canvas.background?.pattern?.css 
              ? canvas.background.pattern.css.split('; background-image: ')[1] || 'none'
              : canvas.background?.image 
                ? `url(${canvas.background.image})` 
                : 'none',
          backgroundSize: canvas.background?.image ? 'cover' : 'auto',
        }}
      >
        {/* Render elements */}
        {elements.map((element) => {
          const isSelected = selectedIds.includes(element.id);
          const isHovered = hoveredId === element.id;
          const isEditing = editingTextId === element.id;
          const isLocked = (element as any).metadata?.lock;

          const elementNode = (() => {
            switch (element.type) {
              case 'text':
                return (
                  <TextElement
                    key={element.id}
                    element={element}
                    isSelected={isSelected}
                    isHovered={isHovered}
                    isEditing={isEditing}
                    onSelect={handleSelect}
                    onDoubleClick={handleDoubleClick}
                    onHover={setHoveredId}
                    onDragStart={handleDragStart}
                  />
                );
              case 'shape':
                return (
                  <ShapeElement
                    key={element.id}
                    element={element}
                    isSelected={isSelected}
                    isHovered={isHovered}
                    onSelect={handleSelect}
                    onHover={setHoveredId}
                    onDragStart={handleDragStart}
                  />
                );
              case 'image':
                return (
                  <ImageElement
                    key={element.id}
                    element={element}
                    isSelected={isSelected}
                    isHovered={isHovered}
                    onSelect={handleSelect}
                    onHover={setHoveredId}
                    onDragStart={handleDragStart}
                  />
                );
              case 'icon':
                return (
                  <IconElement
                    key={element.id}
                    element={element}
                    isSelected={isSelected}
                    isHovered={isHovered}
                    onSelect={handleSelect}
                    onHover={setHoveredId}
                    onDragStart={handleDragStart}
                  />
                );
              case 'video':
                return (
                  <VideoElement
                    key={element.id}
                    element={element}
                    isSelected={isSelected}
                    isHovered={isHovered}
                    onSelect={handleSelect}
                    onHover={setHoveredId}
                    onDragStart={handleDragStart}
                  />
                );
              default:
                return null;
            }
          })();

          // Add lock indicator for locked elements
          if (isLocked) {
            const measured = element.type === 'text' ? measureTextDimensions(element) : null;
            const w = measured?.width || element.width || 100;
            const h = measured?.height || element.height || 100;
            return (
              <React.Fragment key={element.id}>
                {elementNode}
                {/* Lock overlay - dashed border matching selection style */}
                {(isSelected || isHovered) && (
                  <div
                    className="absolute pointer-events-none"
                    style={{
                      left: element.x - 1,
                      top: element.y - 1,
                      width: w + 2,
                      height: h + 2,
                      transform: `rotate(${element.rotation || 0}deg)`,
                      transformOrigin: 'center center',
                      border: '2px dashed #6366f1',
                      borderRadius: 2,
                    }}
                  />
                )}
                {/* Lock badge - matches UI style */}
                <div
                  className="absolute pointer-events-none flex items-center gap-1.5 bg-white border border-gray-200 shadow-md"
                  style={{
                    left: element.x + w / 2 - 32,
                    top: element.y - 32,
                    padding: '4px 10px',
                    borderRadius: 6,
                    transform: `rotate(${element.rotation || 0}deg)`,
                    transformOrigin: `32px ${32 + h / 2}px`,
                  }}
                >
                  <Lock size={12} className="text-gray-500" />
                  <span className="text-gray-600 text-[11px] font-medium">Locked</span>
                </div>
              </React.Fragment>
            );
          }

          return elementNode;
        })}

        {/* Collaboration: Show other users' selections */}
        <CollaborationSelectionOverlay />

        {/* Transformer for selected element - visible during editing too */}
        {selectedElement && (
          <Transformer
            element={selectedElement}
            onResizeStart={handleResizeStart}
            onRotateStart={handleRotateStart}
            isEditing={editingTextId === selectedElement.id}
            isResizing={isResizing}
            isRotating={isRotating}
            isDragging={isDragging}
          />
        )}

        {/* Multi-selection visual feedback */}
        {selectedIds.length > 1 && (() => {
          const selectedElements = elements.filter(el => selectedIds.includes(el.id));
          if (selectedElements.length === 0) return null;
          
          // Check if all selected elements are in the same group
          const firstGroupId = selectedElements[0]?.groupId;
          const allSameGroup = firstGroupId && selectedElements.every(el => el.groupId === firstGroupId);
          
          // Calculate bounding box of all selected elements
          let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
          selectedElements.forEach(el => {
            const measured = el.type === 'text' ? measureTextDimensions(el) : null;
            const w = measured?.width || el.width || 100;
            const h = measured?.height || el.height || 100;
            minX = Math.min(minX, el.x);
            minY = Math.min(minY, el.y);
            maxX = Math.max(maxX, el.x + w);
            maxY = Math.max(maxY, el.y + h);
          });
          
          const bounds = { minX, minY, maxX, maxY };
          
          if (allSameGroup) {
            // GROUPED: Show single unified box with resize handles
            return (
              <MultiSelectTransformer
                bounds={bounds}
                onResizeStart={handleMultiResizeStart}
                isGrouped={true}
                isDragging={isDragging}
                isResizing={isResizing}
              />
            );
          } else {
            // UNGROUPED: Show individual selection box for each element + outer box with resize handles
            return (
              <>
                {/* Individual selection boxes for each element */}
                {selectedElements.map(el => {
                  const measured = el.type === 'text' ? measureTextDimensions(el) : null;
                  const w = measured?.width || el.width || 100;
                  const h = measured?.height || el.height || 100;
                  const isActivelyManipulating = isDragging || isResizing;
                  return (
                    <div
                      key={`selection-${el.id}`}
                      className="absolute pointer-events-none"
                      style={{
                        left: el.x - 1,
                        top: el.y - 1,
                        width: w + 2,
                        height: h + 2,
                        border: '2px solid #3b82f6',
                        borderRadius: 2,
                        transform: `rotate(${el.rotation || 0}deg) translateZ(0)`,
                        transformOrigin: 'center center',
                        transition: isActivelyManipulating ? 'none' : 'left 100ms ease-out, top 100ms ease-out, width 100ms ease-out, height 100ms ease-out',
                        willChange: 'left, top, width, height',
                      }}
                    />
                  );
                })}
                {/* Outer bounding box with resize handles */}
                <MultiSelectTransformer
                  bounds={bounds}
                  onResizeStart={handleMultiResizeStart}
                  isGrouped={false}
                  isDragging={isDragging}
                  isResizing={isResizing}
                />
              </>
            );
          }
        })()}

        {/* Snap guides - visual feedback during drag */}
        {activeSnapGuides.map((guide, index) => (
          <div
            key={`guide-${index}`}
            className="absolute pointer-events-none"
            style={{
              backgroundColor: '#3b82f6',
              ...(guide.orientation === 'vertical'
                ? {
                    left: guide.position,
                    top: 0,
                    width: 1,
                    height: canvas.height,
                  }
                : {
                    left: 0,
                    top: guide.position,
                    width: canvas.width,
                    height: 1,
                  }),
            }}
          />
        ))}

        {/* Text editor overlay */}
        {editingElement && (
          <TextEditor
            element={editingElement}
            onSave={handleTextSave}
            onCancel={handleTextCancel}
            onChange={handleTextChange}
            clickPosition={textEditClickPos || undefined}
          />
        )}

        {/* Marquee selection rectangle + preview selection boxes */}
        {isMarqueeSelecting && marqueeStart && marqueeEnd && (() => {
          const minX = Math.min(marqueeStart.x, marqueeEnd.x);
          const maxX = Math.max(marqueeStart.x, marqueeEnd.x);
          const minY = Math.min(marqueeStart.y, marqueeEnd.y);
          const maxY = Math.max(marqueeStart.y, marqueeEnd.y);
          
          // Find elements that would be selected
          const previewElements = elements.filter(el => {
            const measured = el.type === 'text' ? measureTextDimensions(el) : null;
            const elWidth = measured?.width || el.width || 100;
            const elHeight = measured?.height || el.height || 100;
            return !(el.x + elWidth < minX || el.x > maxX || el.y + elHeight < minY || el.y > maxY);
          });
          
          return (
            <>
              {/* Preview selection boxes for elements inside marquee */}
              {previewElements.map(el => {
                const measured = el.type === 'text' ? measureTextDimensions(el) : null;
                const w = measured?.width || el.width || 100;
                const h = measured?.height || el.height || 100;
                return (
                  <div
                    key={`preview-${el.id}`}
                    className="absolute pointer-events-none"
                    style={{
                      left: el.x - 1,
                      top: el.y - 1,
                      width: w + 2,
                      height: h + 2,
                      border: '2px solid #3b82f6',
                      borderRadius: 2,
                      transform: `rotate(${el.rotation || 0}deg)`,
                      transformOrigin: 'center center',
                    }}
                  />
                );
              })}
              {/* Marquee rectangle */}
              <div
                className="absolute pointer-events-none border-2 border-blue-500 bg-blue-500/10"
                style={{
                  left: minX,
                  top: minY,
                  width: maxX - minX,
                  height: maxY - minY,
                }}
              />
            </>
          );
        })()}
      </div>

      {/* Dynamic toolbar container for inline toolbars (TextToolbar, etc.) */}
      <ToolbarPositioner 
        selectedIds={selectedIds}
        elements={elements}
        zoom={zoom}
        pan={pan}
        containerRef={containerRef}
        canvasRef={canvasRef}
        editingTextId={editingTextId}
      />

      {/* Text toolbar - inline toolbar for text elements */}
      <TextToolbar />

      {/* Floating toolbar */}
      {selectedIds.length > 0 && !editingTextId && (
        <FloatingToolbar 
          zoom={zoom}
          pan={pan}
          containerRef={containerRef}
          canvasRef={canvasRef}
        />
      )}

      {/* Bottom toolbar - Zoom controls */}
      <div className="absolute bottom-4 left-4 flex items-center gap-1 bg-white rounded-lg shadow-md px-2 py-1.5">
        <button
          onClick={() => setZoom(z => Math.max(0.1, z / 1.2))}
          className="w-7 h-7 flex items-center justify-center hover:bg-gray-100 rounded text-base font-medium"
          title="Zoom Out (Ctrl+-)"
        >
          −
        </button>
        <button
          onClick={() => setCamera({ x: 0, y: 0, z: 1 })}
          className="text-sm font-medium w-12 text-center hover:bg-gray-100 rounded py-1"
          title="Click to reset to 100% centered"
        >
          {Math.round(zoom * 100)}%
        </button>
        <button
          onClick={() => setZoom(z => Math.min(5, z * 1.2))}
          className="w-7 h-7 flex items-center justify-center hover:bg-gray-100 rounded text-base font-medium"
          title="Zoom In (Ctrl++)"
        >
          +
        </button>
        <div className="w-px h-5 bg-gray-200 mx-1" />
        <button
          onClick={zoomToFit}
          className="px-2 h-7 flex items-center justify-center hover:bg-gray-100 rounded text-xs font-medium"
          title="Zoom to Fit (Ctrl+0)"
        >
          Fit
        </button>
      </div>

      {/* Keyboard shortcuts hint */}
      <div className="absolute bottom-4 right-4 flex items-center gap-2">
        <button
          onClick={() => setShowCommandPalette(true)}
          className="flex items-center gap-1.5 bg-white rounded-lg shadow-md px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-50"
          title="Command Palette (⌘K)"
        >
          <Command size={14} />
          <span>⌘K</span>
        </button>
        <button
          onClick={() => setShowShortcutsPanel(true)}
          className="flex items-center gap-1.5 bg-white rounded-lg shadow-md px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-50"
          title="Keyboard Shortcuts (?)"
        >
          <Keyboard size={14} />
          <span>?</span>
        </button>
      </div>

      {/* Context Menu - Compact Design */}
      {contextMenu.visible && (
        <div
          className="fixed bg-white rounded-lg shadow-xl border border-gray-200 py-1 z-50 min-w-[160px] text-[13px]"
          style={{ left: contextMenu.x, top: contextMenu.y }}
          onClick={(e) => e.stopPropagation()}
        >
          {selectedIds.length > 0 ? (
            <>
              {/* Edit actions */}
              <button
                className="w-full px-3 py-1.5 text-left hover:bg-gray-100 flex items-center gap-2"
                onClick={() => { handleCopy(); closeContextMenu(); }}
              >
                <Copy size={14} className="text-gray-500" />
                <span className="flex-1">Copy</span>
                <kbd className="text-[10px] text-gray-400 bg-gray-100 px-1 rounded">⌘C</kbd>
              </button>
              <button
                className={`w-full px-3 py-1.5 text-left hover:bg-gray-100 flex items-center gap-2 ${clipboard.length === 0 ? 'opacity-50' : ''}`}
                onClick={() => { handlePaste(); closeContextMenu(); }}
                disabled={clipboard.length === 0}
              >
                <ClipboardPaste size={14} className="text-gray-500" />
                <span className="flex-1">Paste</span>
                <kbd className="text-[10px] text-gray-400 bg-gray-100 px-1 rounded">⌘V</kbd>
              </button>
              <button
                className={`w-full px-3 py-1.5 text-left hover:bg-gray-100 flex items-center gap-2 ${clipboard.length === 0 ? 'opacity-50' : ''}`}
                onClick={() => { handlePasteInPlace(); closeContextMenu(); }}
                disabled={clipboard.length === 0}
              >
                <Clipboard size={14} className="text-gray-500" />
                <span className="flex-1">Paste in Place</span>
                <kbd className="text-[10px] text-gray-400 bg-gray-100 px-1 rounded">⌘⇧V</kbd>
              </button>
              <button
                className="w-full px-3 py-1.5 text-left hover:bg-gray-100 flex items-center gap-2"
                onClick={() => { duplicateElements(selectedIds); closeContextMenu(); }}
              >
                <Copy size={14} className="text-gray-500" />
                <span className="flex-1">Duplicate</span>
                <kbd className="text-[10px] text-gray-400 bg-gray-100 px-1 rounded">⌘D</kbd>
              </button>
              
              <div className="h-px bg-gray-200 my-1" />
              
              {/* Align submenu */}
              <div 
                className="relative group"
                onMouseEnter={() => setContextSubmenu('align')}
                onMouseLeave={() => setContextSubmenu(null)}
              >
                <button className="w-full px-3 py-1.5 text-left hover:bg-gray-100 flex items-center gap-2">
                  <AlignCenter size={14} className="text-gray-500" />
                  <span className="flex-1">Align</span>
                  <ChevronRight size={14} className="text-gray-400" />
                </button>
                {contextSubmenu === 'align' && (
                  <div className="absolute left-full top-0 ml-0.5 bg-white rounded-lg shadow-xl border border-gray-200 py-1 min-w-[140px] z-50">
                    <div className="px-2 py-1 text-[10px] font-medium text-gray-400 uppercase">Align</div>
                    <button onClick={() => { handleAlignLeft(); closeContextMenu(); }} className="w-full px-3 py-1.5 text-left hover:bg-gray-100 flex items-center gap-2">
                      <AlignLeft size={14} /> Left
                    </button>
                    <button onClick={() => { handleAlignCenter(); closeContextMenu(); }} className="w-full px-3 py-1.5 text-left hover:bg-gray-100 flex items-center gap-2">
                      <AlignCenter size={14} /> Center
                    </button>
                    <button onClick={() => { handleAlignRight(); closeContextMenu(); }} className="w-full px-3 py-1.5 text-left hover:bg-gray-100 flex items-center gap-2">
                      <AlignRight size={14} /> Right
                    </button>
                    <div className="h-px bg-gray-200 my-1" />
                    <button onClick={() => { handleAlignTop(); closeContextMenu(); }} className="w-full px-3 py-1.5 text-left hover:bg-gray-100 flex items-center gap-2">
                      <AlignStartVertical size={14} /> Top
                    </button>
                    <button onClick={() => { handleAlignMiddle(); closeContextMenu(); }} className="w-full px-3 py-1.5 text-left hover:bg-gray-100 flex items-center gap-2">
                      <AlignCenterVertical size={14} /> Middle
                    </button>
                    <button onClick={() => { handleAlignBottom(); closeContextMenu(); }} className="w-full px-3 py-1.5 text-left hover:bg-gray-100 flex items-center gap-2">
                      <AlignEndVertical size={14} /> Bottom
                    </button>
                    {selectedIds.length >= 3 && (
                      <>
                        <div className="h-px bg-gray-200 my-1" />
                        <div className="px-2 py-1 text-[10px] font-medium text-gray-400 uppercase">Distribute</div>
                        <button onClick={() => { handleDistributeHorizontal(); closeContextMenu(); }} className="w-full px-3 py-1.5 text-left hover:bg-gray-100 flex items-center gap-2">
                          <GalleryHorizontal size={14} /> Horizontal
                        </button>
                        <button onClick={() => { handleDistributeVertical(); closeContextMenu(); }} className="w-full px-3 py-1.5 text-left hover:bg-gray-100 flex items-center gap-2">
                          <GalleryVertical size={14} /> Vertical
                        </button>
                      </>
                    )}
                    {selectedIds.length >= 2 && (
                      <>
                        <div className="h-px bg-gray-200 my-1" />
                        <button onClick={() => { handleTidyUp(); closeContextMenu(); }} className="w-full px-3 py-1.5 text-left hover:bg-gray-100 flex items-center gap-2">
                          <LayoutGrid size={14} /> Tidy Up
                        </button>
                      </>
                    )}
                  </div>
                )}
              </div>
              
              {/* Arrange submenu */}
              <div 
                className="relative group"
                onMouseEnter={() => setContextSubmenu('arrange')}
                onMouseLeave={() => setContextSubmenu(null)}
              >
                <button className="w-full px-3 py-1.5 text-left hover:bg-gray-100 flex items-center gap-2">
                  <Layers size={14} className="text-gray-500" />
                  <span className="flex-1">Arrange</span>
                  <ChevronRight size={14} className="text-gray-400" />
                </button>
                {contextSubmenu === 'arrange' && (
                  <div className="absolute left-full top-0 ml-0.5 bg-white rounded-lg shadow-xl border border-gray-200 py-1 min-w-[140px] z-50">
                    <button onClick={() => { selectedIds.forEach(id => bringToFront(id)); closeContextMenu(); }} className="w-full px-3 py-1.5 text-left hover:bg-gray-100 flex items-center gap-2">
                      <ChevronsUp size={14} /> Bring to Front
                    </button>
                    <button onClick={() => { selectedIds.forEach(id => bringForward(id)); closeContextMenu(); }} className="w-full px-3 py-1.5 text-left hover:bg-gray-100 flex items-center gap-2">
                      <ArrowUp size={14} /> Bring Forward
                    </button>
                    <button onClick={() => { selectedIds.forEach(id => sendBackward(id)); closeContextMenu(); }} className="w-full px-3 py-1.5 text-left hover:bg-gray-100 flex items-center gap-2">
                      <ArrowDown size={14} /> Send Backward
                    </button>
                    <button onClick={() => { selectedIds.forEach(id => sendToBack(id)); closeContextMenu(); }} className="w-full px-3 py-1.5 text-left hover:bg-gray-100 flex items-center gap-2">
                      <ChevronsDown size={14} /> Send to Back
                    </button>
                  </div>
                )}
              </div>
              
              <div className="h-px bg-gray-200 my-1" />
              
              {/* Lock */}
              <button
                className="w-full px-3 py-1.5 text-left hover:bg-gray-100 flex items-center gap-2"
                onClick={() => { handleToggleLock(); closeContextMenu(); }}
              >
                {elements.filter(el => selectedIds.includes(el.id)).some(el => (el as any).metadata?.lock) 
                  ? <><Unlock size={14} className="text-gray-500" /><span className="flex-1">Unlock</span></>
                  : <><Lock size={14} className="text-gray-500" /><span className="flex-1">Lock</span></>
                }
                <kbd className="text-[10px] text-gray-400 bg-gray-100 px-1 rounded">⌘L</kbd>
              </button>
              
              {/* Group/Ungroup */}
              {selectedIds.length >= 2 && !selectedIds.every(id => {
                const el = elements.find(e => e.id === id);
                return el?.groupId && el.groupId === elements.find(e => e.id === selectedIds[0])?.groupId;
              }) && (
                <button
                  className="w-full px-3 py-1.5 text-left hover:bg-gray-100 flex items-center gap-2"
                  onClick={() => { groupElements(selectedIds); closeContextMenu(); }}
                >
                  <Group size={14} className="text-gray-500" />
                  <span className="flex-1">Group</span>
                  <kbd className="text-[10px] text-gray-400 bg-gray-100 px-1 rounded">⌘G</kbd>
                </button>
              )}
              {(() => {
                const firstEl = elements.find(e => e.id === selectedIds[0]);
                const groupId = firstEl?.groupId;
                if (groupId && selectedIds.every(id => elements.find(e => e.id === id)?.groupId === groupId)) {
                  return (
                    <button
                      className="w-full px-3 py-1.5 text-left hover:bg-gray-100 flex items-center gap-2"
                      onClick={() => { ungroupElements(groupId); closeContextMenu(); }}
                    >
                      <Ungroup size={14} className="text-gray-500" />
                      <span className="flex-1">Ungroup</span>
                      <kbd className="text-[10px] text-gray-400 bg-gray-100 px-1 rounded">⌘⇧G</kbd>
                    </button>
                  );
                }
                return null;
              })()}
              
              <div className="h-px bg-gray-200 my-1" />
              
              {/* Delete */}
              <button
                className="w-full px-3 py-1.5 text-left hover:bg-gray-100 flex items-center gap-2 text-red-600"
                onClick={() => { deleteElements(selectedIds); closeContextMenu(); }}
              >
                <Trash2 size={14} />
                <span className="flex-1">Delete</span>
                <kbd className="text-[10px] text-red-300 bg-red-50 px-1 rounded">⌫</kbd>
              </button>
            </>
          ) : (
            <div className="px-3 py-1.5 text-gray-400">
              No element selected
            </div>
          )}
        </div>
      )}
      
      {/* Keyboard Shortcuts Panel */}
      {showShortcutsPanel && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[100]" onClick={() => setShowShortcutsPanel(false)}>
          <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full mx-4 max-h-[80vh] overflow-hidden" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between px-5 py-4 border-b">
              <div className="flex items-center gap-2">
                <Keyboard size={20} className="text-gray-600" />
                <h2 className="text-lg font-semibold">Keyboard Shortcuts</h2>
              </div>
              <button onClick={() => setShowShortcutsPanel(false)} className="p-1 hover:bg-gray-100 rounded">
                <X size={20} />
              </button>
            </div>
            <div className="p-5 overflow-y-auto max-h-[60vh] space-y-4">
              <div>
                <h3 className="text-xs font-semibold text-gray-500 uppercase mb-2">General</h3>
                <div className="space-y-1.5 text-sm">
                  <div className="flex justify-between"><span>Copy</span><kbd className="bg-gray-100 px-1.5 py-0.5 rounded text-xs">⌘C</kbd></div>
                  <div className="flex justify-between"><span>Paste</span><kbd className="bg-gray-100 px-1.5 py-0.5 rounded text-xs">⌘V</kbd></div>
                  <div className="flex justify-between"><span>Paste in Place</span><kbd className="bg-gray-100 px-1.5 py-0.5 rounded text-xs">⌘⇧V</kbd></div>
                  <div className="flex justify-between"><span>Duplicate</span><kbd className="bg-gray-100 px-1.5 py-0.5 rounded text-xs">⌘D</kbd></div>
                  <div className="flex justify-between"><span>Delete</span><kbd className="bg-gray-100 px-1.5 py-0.5 rounded text-xs">⌫</kbd></div>
                  <div className="flex justify-between"><span>Deselect</span><kbd className="bg-gray-100 px-1.5 py-0.5 rounded text-xs">Esc</kbd></div>
                </div>
              </div>
              <div>
                <h3 className="text-xs font-semibold text-gray-500 uppercase mb-2">View</h3>
                <div className="space-y-1.5 text-sm">
                  <div className="flex justify-between"><span>Zoom In</span><kbd className="bg-gray-100 px-1.5 py-0.5 rounded text-xs">⌘+</kbd></div>
                  <div className="flex justify-between"><span>Zoom Out</span><kbd className="bg-gray-100 px-1.5 py-0.5 rounded text-xs">⌘-</kbd></div>
                  <div className="flex justify-between"><span>Zoom to Fit</span><kbd className="bg-gray-100 px-1.5 py-0.5 rounded text-xs">⌘0</kbd></div>
                  <div className="flex justify-between"><span>Pan</span><kbd className="bg-gray-100 px-1.5 py-0.5 rounded text-xs">Space + Drag</kbd></div>
                </div>
              </div>
              <div>
                <h3 className="text-xs font-semibold text-gray-500 uppercase mb-2">Elements</h3>
                <div className="space-y-1.5 text-sm">
                  <div className="flex justify-between"><span>Lock/Unlock</span><kbd className="bg-gray-100 px-1.5 py-0.5 rounded text-xs">⌘L</kbd></div>
                  <div className="flex justify-between"><span>Group</span><kbd className="bg-gray-100 px-1.5 py-0.5 rounded text-xs">⌘G</kbd></div>
                  <div className="flex justify-between"><span>Ungroup</span><kbd className="bg-gray-100 px-1.5 py-0.5 rounded text-xs">⌘⇧G</kbd></div>
                </div>
              </div>
              <div>
                <h3 className="text-xs font-semibold text-gray-500 uppercase mb-2">History</h3>
                <div className="space-y-1.5 text-sm">
                  <div className="flex justify-between"><span>Undo</span><kbd className="bg-gray-100 px-1.5 py-0.5 rounded text-xs">⌘Z</kbd></div>
                  <div className="flex justify-between"><span>Redo</span><kbd className="bg-gray-100 px-1.5 py-0.5 rounded text-xs">⌘⇧Z</kbd></div>
                </div>
              </div>
              <div>
                <h3 className="text-xs font-semibold text-gray-500 uppercase mb-2">Navigation</h3>
                <div className="space-y-1.5 text-sm">
                  <div className="flex justify-between"><span>Nudge</span><kbd className="bg-gray-100 px-1.5 py-0.5 rounded text-xs">Arrow Keys</kbd></div>
                  <div className="flex justify-between"><span>Nudge Fast</span><kbd className="bg-gray-100 px-1.5 py-0.5 rounded text-xs">⇧ + Arrow Keys</kbd></div>
                  <div className="flex justify-between"><span>Zoom to Selection</span><kbd className="bg-gray-100 px-1.5 py-0.5 rounded text-xs">Z</kbd></div>
                  <div className="flex justify-between"><span>Command Palette</span><kbd className="bg-gray-100 px-1.5 py-0.5 rounded text-xs">⌘K</kbd></div>
                  <div className="flex justify-between"><span>Show Shortcuts</span><kbd className="bg-gray-100 px-1.5 py-0.5 rounded text-xs">?</kbd></div>
                </div>
              </div>
              <div>
                <h3 className="text-xs font-semibold text-gray-500 uppercase mb-2">Drag Modifiers</h3>
                <div className="space-y-1.5 text-sm">
                  <div className="flex justify-between"><span>Constrain to Axis</span><kbd className="bg-gray-100 px-1.5 py-0.5 rounded text-xs">⇧ + Drag</kbd></div>
                  <div className="flex justify-between"><span>Duplicate</span><kbd className="bg-gray-100 px-1.5 py-0.5 rounded text-xs">⌥ + Drag</kbd></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Command Palette */}
      {showCommandPalette && (
        <div className="fixed inset-0 bg-black/50 flex items-start justify-center pt-[20vh] z-[100]" onClick={() => setShowCommandPalette(false)}>
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md mx-4 overflow-hidden" onClick={e => e.stopPropagation()}>
            <div className="flex items-center gap-2 px-4 py-3 border-b">
              <Search size={18} className="text-gray-400" />
              <input
                type="text"
                placeholder="Type a command..."
                className="flex-1 outline-none text-sm"
                value={commandSearch}
                onChange={(e) => setCommandSearch(e.target.value)}
                autoFocus
              />
              <kbd className="text-xs text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded">Esc</kbd>
            </div>
            <div className="max-h-[300px] overflow-y-auto py-2">
              {[
                { label: 'Copy', shortcut: '⌘C', action: () => { handleCopy(); setShowCommandPalette(false); }, icon: Copy },
                { label: 'Paste', shortcut: '⌘V', action: () => { handlePaste(); setShowCommandPalette(false); }, icon: ClipboardPaste },
                { label: 'Duplicate', shortcut: '⌘D', action: () => { duplicateElements(selectedIds); setShowCommandPalette(false); }, icon: Copy },
                { label: 'Delete', shortcut: '⌫', action: () => { deleteElements(selectedIds); setShowCommandPalette(false); }, icon: Trash2 },
                { label: 'Undo', shortcut: '⌘Z', action: () => { undo(); setShowCommandPalette(false); }, icon: Undo2 },
                { label: 'Redo', shortcut: '⌘⇧Z', action: () => { redo(); setShowCommandPalette(false); }, icon: Redo2 },
                { label: 'Zoom to Fit', shortcut: '⌘0', action: () => { zoomToFit(); setShowCommandPalette(false); }, icon: ZoomIn },
                { label: 'Align Left', action: () => { handleAlignLeft(); setShowCommandPalette(false); }, icon: AlignLeft },
                { label: 'Align Center', action: () => { handleAlignCenter(); setShowCommandPalette(false); }, icon: AlignCenter },
                { label: 'Align Right', action: () => { handleAlignRight(); setShowCommandPalette(false); }, icon: AlignRight },
                { label: 'Bring to Front', action: () => { selectedIds.forEach(id => bringToFront(id)); setShowCommandPalette(false); }, icon: ChevronsUp },
                { label: 'Send to Back', action: () => { selectedIds.forEach(id => sendToBack(id)); setShowCommandPalette(false); }, icon: ChevronsDown },
                { label: 'Lock/Unlock', shortcut: '⌘L', action: () => { handleToggleLock(); setShowCommandPalette(false); }, icon: Lock },
                { label: 'Show Shortcuts', shortcut: '?', action: () => { setShowCommandPalette(false); setShowShortcutsPanel(true); }, icon: Keyboard },
              ]
                .filter(cmd => cmd.label.toLowerCase().includes(commandSearch.toLowerCase()))
                .map((cmd, i) => (
                  <button
                    key={i}
                    onClick={cmd.action}
                    className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 flex items-center gap-3"
                  >
                    <cmd.icon size={16} className="text-gray-500" />
                    <span className="flex-1">{cmd.label}</span>
                    {cmd.shortcut && <kbd className="text-xs text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded">{cmd.shortcut}</kbd>}
                  </button>
                ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default DOMCanvas;

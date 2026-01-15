/**
 * Canvas V2 - Type Definitions
 * Comprehensive types for the refactored canvas editor
 */

// ============================================
// GEOMETRY TYPES
// ============================================

export interface Point {
  x: number;
  y: number;
}

export interface Size {
  width: number;
  height: number;
}

export interface Rect extends Point, Size {}

export interface Bounds {
  minX: number;
  minY: number;
  maxX: number;
  maxY: number;
}

export interface Transform {
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  scaleX?: number;
  scaleY?: number;
}

// ============================================
// HANDLE TYPES
// ============================================

export type HandlePosition =
  | 'top-left'
  | 'top-center'
  | 'top-right'
  | 'middle-left'
  | 'middle-right'
  | 'bottom-left'
  | 'bottom-center'
  | 'bottom-right';

export interface Handle {
  position: HandlePosition;
  cursor: string;
  x: number;
  y: number;
}

export const HANDLE_CURSORS: Record<HandlePosition, string> = {
  'top-left': 'nwse-resize',
  'top-center': 'ns-resize',
  'top-right': 'nesw-resize',
  'middle-left': 'ew-resize',
  'middle-right': 'ew-resize',
  'bottom-left': 'nesw-resize',
  'bottom-center': 'ns-resize',
  'bottom-right': 'nwse-resize',
};

// ============================================
// INTERACTION TYPES
// ============================================

export type InteractionMode =
  | 'idle'
  | 'selecting'
  | 'dragging'
  | 'resizing'
  | 'rotating'
  | 'panning'
  | 'marquee'
  | 'drawing';

export interface DragState {
  elementId: string;
  startPoint: Point;
  currentPoint: Point;
  offset: Point;
  // For multi-select drag
  elementOffsets: Map<string, Point>;
}

export interface ResizeState {
  elementId: string | null; // null for multi-select
  handle: HandlePosition;
  startPoint: Point;
  startBounds: Bounds;
  // For multi-select
  elementStarts: Array<{
    id: string;
    x: number;
    y: number;
    width: number;
    height: number;
    fontSize?: number;
  }>;
  aspectRatio?: number;
  preserveAspect: boolean;
}

export interface RotateState {
  elementId: string;
  startAngle: number;
  startRotation: number;
  center: Point;
}

export interface MarqueeState {
  start: Point;
  end: Point;
}

export interface PanState {
  startPoint: Point;
  startOffset: Point;
}

// ============================================
// SNAP TYPES
// ============================================

export type SnapType = 'edge' | 'center' | 'distribution';
export type SnapOrientation = 'horizontal' | 'vertical';

export interface SnapGuide {
  orientation: SnapOrientation;
  position: number;
  type: SnapType;
  label?: string;
}

export interface SnapResult {
  x: number;
  y: number;
  guides: SnapGuide[];
  snappedX: boolean;
  snappedY: boolean;
}

// ============================================
// CANVAS STATE
// ============================================

export interface ViewportState {
  zoom: number;
  panX: number;
  panY: number;
}

export interface CanvasInteractionState {
  mode: InteractionMode;
  drag: DragState | null;
  resize: ResizeState | null;
  rotate: RotateState | null;
  marquee: MarqueeState | null;
  pan: PanState | null;
  hoveredId: string | null;
  activeSnapGuides: SnapGuide[];
}

// ============================================
// CONTEXT MENU
// ============================================

export interface ContextMenuState {
  visible: boolean;
  x: number;
  y: number;
  elementId: string | null;
}

export interface ContextMenuItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
  shortcut?: string;
  disabled?: boolean;
  danger?: boolean;
  separator?: boolean;
  action?: () => void;
}

// ============================================
// ACCESSIBILITY
// ============================================

export interface A11yAnnouncement {
  message: string;
  priority: 'polite' | 'assertive';
}

// ============================================
// ELEMENT MEASUREMENT
// ============================================

export interface MeasuredElement {
  id: string;
  bounds: Bounds;
  width: number;
  height: number;
}

// ============================================
// CONSTANTS
// ============================================

export const SNAP_THRESHOLD = 8;
export const ROTATION_SNAP_THRESHOLD = 5;
export const ROTATION_SNAP_ANGLES = [0, 45, 90, 135, 180, 225, 270, 315, 360];
export const MIN_ELEMENT_SIZE = 10;
export const HANDLE_SIZE = 8;
export const ROTATION_HANDLE_OFFSET = 24;

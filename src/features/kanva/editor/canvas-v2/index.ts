/**
 * Canvas V2 - Public API
 */

// Main component
export { CanvasV2, default } from './Canvas';

// Types
export type {
  Point,
  Size,
  Rect,
  Bounds,
  Transform,
  HandlePosition,
  Handle,
  InteractionMode,
  DragState,
  ResizeState,
  RotateState,
  MarqueeState,
  PanState,
  SnapGuide,
  SnapResult,
  ViewportState,
  CanvasInteractionState,
  ContextMenuState,
  ContextMenuItem,
  A11yAnnouncement,
  MeasuredElement,
} from './types';

// Constants
export {
  HANDLE_CURSORS,
  SNAP_THRESHOLD,
  ROTATION_SNAP_THRESHOLD,
  ROTATION_SNAP_ANGLES,
  MIN_ELEMENT_SIZE,
  HANDLE_SIZE,
  ROTATION_HANDLE_OFFSET,
} from './types';

// Hooks
export { useCanvasInteractions } from './hooks/useCanvasInteractions';
export { useMarqueeSelection } from './hooks/useMarqueeSelection';
export { useZoomPan } from './hooks/useZoomPan';
export { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts';

// Layers
export { SelectionLayer } from './layers/SelectionLayer';
export { GuidesLayer } from './layers/GuidesLayer';

// Components
export { CanvasElement } from './components/CanvasElement';

// Utils - Geometry
export {
  addPoints,
  subtractPoints,
  scalePoint,
  distanceBetween,
  angleBetween,
  rotatePoint,
  createBounds,
  getBoundsSize,
  getBoundsCenter,
  expandBounds,
  mergeBounds,
  boundsContainsPoint,
  boundsIntersect,
  boundsContainsBounds,
  getTransformBounds,
  getTransformCenter,
  calculateResize,
  calculateMultiResize,
  isPointInRotatedRect,
  getHandleAtPoint,
} from './utils/geometry';

// Utils - Snapping
export {
  calculateSnap,
  snapRotation,
  calculateResizeSnap,
  calculateDistributionSnap,
  boundsToRect,
  rectToBounds,
} from './utils/snapping';

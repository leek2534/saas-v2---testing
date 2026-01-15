export type ID = string;

// Canvas Configuration
export interface CanvasConfig {
  width: number;
  height: number;
  background?: {
    color?: string;
    image?: string;
    gradient?: string;
    pattern?: {
      id: string;
      foregroundColor: string;
      backgroundColor: string;
      opacity: number;
      css?: string;
    };
  };
}

// Base Element
export interface BaseElement {
  id: ID;
  type: string;
  x: number;
  y: number;
  width?: number; // Optional - undefined means auto-width (measured from content)
  height?: number; // Optional - undefined means auto-height (measured from content)
  rotation: number;
  zIndex: number;
  visible: boolean;
  locked?: boolean;
  opacity?: number;
  groupId?: string;
  metadata?: {
    lock?: boolean;
    [key: string]: any;
  };
  lockedBy?: string | null;
  lockedByName?: string | null;
}

// Text Element
export interface TextElement extends BaseElement {
  type: 'text';
  text: string; // Keep for backwards compatibility
  textJSON?: any; // TipTap JSONContent - NEW: Rich text document structure
  fontSize: number;
  fontFamily: string;
  fontWeight: 'normal' | 'bold' | '100' | '200' | '300' | '400' | '500' | '600' | '700' | '800' | '900';
  fontStyle: 'normal' | 'italic';
  fill: string;
  align: 'left' | 'center' | 'right';
  verticalAlign: 'top' | 'middle' | 'bottom';
  lineHeight?: number;
  letterSpacing?: number;
  textDecoration?: 'none' | 'underline' | 'line-through';
  autoWidth?: boolean;
  textTransform?: 'none' | 'uppercase' | 'lowercase' | 'capitalize';
}

// Image Element
export interface ImageElement extends BaseElement {
  type: 'image';
  src: string;
  originalMeta?: {
    width: number;
    height: number;
  };
  filters?: {
    brightness?: number;
    contrast?: number;
    saturation?: number;
    blur?: number;
  };
}

// Shape Element
export interface ShapeElement extends BaseElement {
  type: 'shape';
  shapeType: 'rect' | 'circle' | 'triangle' | 'line' | 'polygon';
  fill?: string;
  stroke?: string;
  strokeWidth?: number;
  cornerRadius?: number;
}

// Icon Element
export interface IconElement extends BaseElement {
  type: 'icon';
  iconName: string;
  fill?: string;
  stroke?: string;
  strokeWidth?: number;
}

// Path Element (for free drawing)
export interface PathElement extends BaseElement {
  type: 'path';
  pathData: string; // SVG path data (d attribute)
  stroke: string;
  strokeWidth: number;
  fill?: string;
  strokeLinecap?: 'butt' | 'round' | 'square';
  strokeLinejoin?: 'miter' | 'round' | 'bevel';
}

// Video Element
export interface VideoElement extends BaseElement {
  type: 'video';
  src: string;
  poster?: string;
  autoplay?: boolean;
  loop?: boolean;
  muted?: boolean;
  controls?: boolean;
  provider?: 'file' | 'youtube' | 'vimeo';
}

// SVG Element
export interface SvgElement extends BaseElement {
  type: 'svg';
  src: string;
  fill?: string;
}

// Union type for all elements
export type EditorElement = TextElement | ImageElement | ShapeElement | IconElement | PathElement | VideoElement | SvgElement;

// Asset
export interface Asset {
  id: ID;
  type: 'image' | 'video' | 'audio';
  url: string;
  thumbnail?: string;
  name: string;
  size?: number;
  createdAt: string;
}

// History
export interface HistoryState {
  stack: any[];
  index: number;
  maxSize: number;
}

// Template
export interface Template {
  id: ID;
  name: string;
  thumbnail?: string;
  canvas: CanvasConfig;
  elements: EditorElement[];
  createdAt: string;
  updatedAt: string;
  tags?: string[];
  category?: string;
}

// Page (for multi-page support)
export interface Page {
  id: ID;
  name: string;
  canvas: CanvasConfig;
  elements: EditorElement[];
  thumbnail?: string;
  order: number;
}

// Editor State
export interface EditorState {
  canvas: CanvasConfig;
  elements: EditorElement[];
  selectedIds: ID[];
  history: HistoryState;
  assets: Asset[];
  showAlignmentGuides?: boolean;
  snapThreshold?: number;
  showSnapGuides?: boolean;
  activeGuides?: any[];
  alignmentBadge?: { x: number; y: number; text: string } | null;
  meta: {
    projectName: string;
    createdAt: string;
    updatedAt: string;
  };
  // Multi-page support (future)
  pages?: Page[];
  activePageId?: ID;
  // Drawing mode
  isDrawingMode?: boolean;
  drawingConfig?: {
    color: string;
    strokeWidth: number;
  };
  // Video editor mode
  videoEditorMode?: boolean;
}

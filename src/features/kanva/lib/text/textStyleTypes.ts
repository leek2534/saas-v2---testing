/**
 * Professional Text Style System
 * Supports layered effects, shadows, strokes, decorations, and textures
 * Similar to Canva's text preset system
 */

export type LayerType = 'fill' | 'stroke' | 'shadow' | 'glow' | 'texture' | 'gradient';
export type DecorationKind = 'bar' | 'blob' | 'swash' | 'sticker' | 'underline' | 'highlight' | 'shape';
export type DecorationPosition = 'behind' | 'front' | 'inline';
export type RenderMode = 'svg' | 'html' | 'auto';
export type ScaleBehavior = 'scale' | 'wrap' | 'truncate';
export type StrokeAlign = 'center' | 'outside' | 'inside';
export type BlendMode = 'normal' | 'multiply' | 'screen' | 'overlay' | 'darken' | 'lighten';

export interface Offset {
  x: number;
  y: number;
}

export interface Layer {
  id: string;
  type: LayerType;
  offset?: Offset;
  blur?: number;
  color?: string;
  strokeWidth?: number;
  strokeAlign?: StrokeAlign;
  opacity?: number;
  transform?: string;
  blendMode?: BlendMode;
  // Gradient-specific
  gradientColors?: string[];
  gradientAngle?: number;
  // SVG filter reference
  svgFilter?: string;
  // Texture reference
  textureId?: string;
}

export interface Decoration {
  id: string;
  kind: DecorationKind;
  position: DecorationPosition;
  width?: number;
  height?: number;
  transform?: string;
  color?: string;
  opacity?: number;
  borderRadius?: number;
  rotation?: number;
}

export interface ResponsiveRules {
  maxFontSize: number;
  minFontSize: number;
  scaleBehavior: ScaleBehavior;
  maintainAspectRatio?: boolean;
}

export interface TextStylePreset {
  id: string;
  name: string;
  category: string;
  tags?: string[];
  renderMode: RenderMode;
  
  // Typography
  fonts: {
    primary: string;
    secondary?: string;
  };
  
  // Color palette (3-5 colors for the preset)
  palette: string[];
  
  // Layered effects (ordered back-to-front)
  layers: Layer[];
  
  // Background/foreground decorations
  decorations?: Decoration[];
  
  // Responsive behavior
  responsiveRules?: ResponsiveRules;
  
  // Metadata
  metadata?: {
    previewSvg?: string;
    thumbnail?: string;
    description?: string;
  };
}

// Legacy support - extends old interface
export interface TextCombinationElement {
  id: string;
  type: 'text';
  content: string;
  fontFamily: string;
  fontSize: number;
  fontWeight?: string;
  color: string;
  textAlign?: 'left' | 'center' | 'right';
  position: { x: number; y: number };
  letterSpacing?: number;
  rotation?: number;
  opacity?: number;
  
  // NEW: Enhanced styling
  layers?: Layer[];
  decorations?: Decoration[];
}

export interface TextCombinationTemplate {
  id: string;
  name: string;
  category: string;
  tags: string[];
  grouping: boolean;
  width: number;
  height: number;
  elements: TextCombinationElement[];
  preview: string;
  
  // NEW: Style preset reference
  stylePreset?: TextStylePreset;
}

// Preset categories
export const PRESET_CATEGORIES = {
  PROMO: 'Bold Performance Promo',
  EDITORIAL: 'Elegant Editorial Serif',
  SOCIAL: 'Trendy Social / Creator Style',
  Y2K: 'Y2K / Retro Future',
  HANDWRITTEN: 'Handwritten & Marker Styles',
  MINIMAL: 'Minimal Clean UI Text',
  GLITCH: 'Glitch / Grunge / Noise',
  CUTE: 'Cute / Kids / Craft',
} as const;

export type PresetCategory = typeof PRESET_CATEGORIES[keyof typeof PRESET_CATEGORIES];

/**
 * Premium Text Style Presets
 * 40 professional text combinations across 8 categories
 */

import { TextStylePreset, PRESET_CATEGORIES } from './textStyleTypes';

export const premiumTextPresets: TextStylePreset[] = [
  // ============================================
  // BOLD PERFORMANCE PROMO (5 presets)
  // ============================================
  {
    id: 'promo-metallic-gold',
    name: 'Metallic Gold',
    category: PRESET_CATEGORIES.PROMO,
    tags: ['promo', 'luxury', 'metallic'],
    renderMode: 'svg',
    fonts: { primary: 'Inter', secondary: 'Inter' },
    palette: ['#FFD700', '#0A0A0A', '#FFFFFF'],
    layers: [
      { id: 'shadow', type: 'shadow', offset: { x: 8, y: 8 }, blur: 10, color: '#000000', opacity: 0.45 },
      { id: 'fill', type: 'fill', color: '#FFFFFF' },
      { id: 'stroke', type: 'stroke', color: '#FFD700', strokeWidth: 8, strokeAlign: 'outside' },
    ],
    decorations: [
      { id: 'stripe', kind: 'bar', position: 'behind', width: 400, height: 56, color: '#0A0A0A', opacity: 0.85 },
    ],
    responsiveRules: { maxFontSize: 120, minFontSize: 18, scaleBehavior: 'scale' },
  },

  {
    id: 'promo-neon-blast',
    name: 'Neon Blast',
    category: PRESET_CATEGORIES.PROMO,
    tags: ['promo', 'neon', 'bright'],
    renderMode: 'svg',
    fonts: { primary: 'Oswald' },
    palette: ['#FF006E', '#FFBE0B', '#FFFFFF'],
    layers: [
      { id: 'glow', type: 'glow', blur: 20, color: '#FF006E', opacity: 0.8 },
      { id: 'fill', type: 'fill', color: '#FFFFFF' },
      { id: 'stroke', type: 'stroke', color: '#FFBE0B', strokeWidth: 6 },
    ],
    responsiveRules: { maxFontSize: 110, minFontSize: 16, scaleBehavior: 'scale' },
  },

  {
    id: 'promo-bold-impact',
    name: 'Bold Impact',
    category: PRESET_CATEGORIES.PROMO,
    tags: ['promo', 'bold', 'impact'],
    renderMode: 'svg',
    fonts: { primary: 'Anton' },
    palette: ['#EF4444', '#0F172A', '#FFFFFF'],
    layers: [
      { id: 'shadow', type: 'shadow', offset: { x: 6, y: 6 }, blur: 0, color: '#EF4444', opacity: 1 },
      { id: 'fill', type: 'fill', color: '#0F172A' },
    ],
    decorations: [
      { id: 'underline', kind: 'underline', position: 'behind', height: 8, color: '#EF4444' },
    ],
    responsiveRules: { maxFontSize: 100, minFontSize: 14, scaleBehavior: 'scale' },
  },

  {
    id: 'promo-chrome-shine',
    name: 'Chrome Shine',
    category: PRESET_CATEGORIES.PROMO,
    tags: ['promo', 'chrome', 'metallic'],
    renderMode: 'svg',
    fonts: { primary: 'Bebas Neue' },
    palette: ['#E6E6FA', '#2B2B2B', '#B9F2FF'],
    layers: [
      { id: 'base', type: 'fill', color: '#E6E6FA' },
      { id: 'bevel', type: 'stroke', strokeWidth: 6, color: '#B9F2FF', opacity: 0.95 },
    ],
    responsiveRules: { maxFontSize: 120, minFontSize: 18, scaleBehavior: 'scale' },
  },

  {
    id: 'promo-power-gradient',
    name: 'Power Gradient',
    category: PRESET_CATEGORIES.PROMO,
    tags: ['promo', 'gradient', 'modern'],
    renderMode: 'svg',
    fonts: { primary: 'Space Grotesk' },
    palette: ['#6366F1', '#EC4899', '#FFFFFF'],
    layers: [
      { id: 'shadow', type: 'shadow', offset: { x: 4, y: 4 }, blur: 8, color: '#000000', opacity: 0.3 },
      { id: 'gradient', type: 'gradient', gradientColors: ['#6366F1', '#EC4899'], gradientAngle: 45 },
      { id: 'stroke', type: 'stroke', color: '#FFFFFF', strokeWidth: 4, strokeAlign: 'outside' },
    ],
    responsiveRules: { maxFontSize: 96, minFontSize: 16, scaleBehavior: 'scale' },
  },

  // ============================================
  // ELEGANT EDITORIAL SERIF (5 presets)
  // ============================================
  {
    id: 'editorial-gold-foil',
    name: 'Gold Foil',
    category: PRESET_CATEGORIES.EDITORIAL,
    tags: ['editorial', 'luxury', 'serif'],
    renderMode: 'svg',
    fonts: { primary: 'Playfair Display', secondary: 'Playfair Display' },
    palette: ['#111111', '#D4AF37', '#FFFFFF'],
    layers: [
      { id: 'base', type: 'fill', color: '#111111' },
      { id: 'foil', type: 'stroke', color: '#D4AF37', strokeWidth: 2, opacity: 0.95 },
    ],
    decorations: [
      { id: 'swash', kind: 'underline', position: 'front', height: 6, color: '#D4AF37' },
    ],
    responsiveRules: { maxFontSize: 96, minFontSize: 18, scaleBehavior: 'wrap' },
  },

  {
    id: 'editorial-minimal-serif',
    name: 'Minimal Serif',
    category: PRESET_CATEGORIES.EDITORIAL,
    tags: ['editorial', 'minimal', 'clean'],
    renderMode: 'html',
    fonts: { primary: 'Lora', secondary: 'Lora' },
    palette: ['#0F172A', '#64748B', '#FFFFFF'],
    layers: [
      { id: 'fill', type: 'fill', color: '#0F172A' },
    ],
    decorations: [
      { id: 'accent', kind: 'bar', position: 'behind', width: 60, height: 4, color: '#64748B' },
    ],
    responsiveRules: { maxFontSize: 72, minFontSize: 14, scaleBehavior: 'wrap' },
  },

  {
    id: 'editorial-fashion-mag',
    name: 'Fashion Magazine',
    category: PRESET_CATEGORIES.EDITORIAL,
    tags: ['editorial', 'fashion', 'elegant'],
    renderMode: 'svg',
    fonts: { primary: 'Bodoni Moda', secondary: 'Montserrat' },
    palette: ['#000000', '#FFFFFF', '#E5E5E5'],
    layers: [
      { id: 'fill', type: 'fill', color: '#000000' },
      { id: 'shadow', type: 'shadow', offset: { x: 2, y: 2 }, blur: 4, color: '#E5E5E5', opacity: 0.6 },
    ],
    responsiveRules: { maxFontSize: 84, minFontSize: 16, scaleBehavior: 'wrap' },
  },

  {
    id: 'editorial-classic-bold',
    name: 'Classic Bold',
    category: PRESET_CATEGORIES.EDITORIAL,
    tags: ['editorial', 'bold', 'classic'],
    renderMode: 'svg',
    fonts: { primary: 'Merriweather', secondary: 'Merriweather' },
    palette: ['#1E293B', '#F59E0B', '#FFFFFF'],
    layers: [
      { id: 'fill', type: 'fill', color: '#1E293B' },
    ],
    decorations: [
      { id: 'highlight', kind: 'highlight', position: 'behind', color: '#F59E0B', opacity: 0.2 },
    ],
    responsiveRules: { maxFontSize: 78, minFontSize: 14, scaleBehavior: 'wrap' },
  },

  {
    id: 'editorial-script-elegant',
    name: 'Script Elegant',
    category: PRESET_CATEGORIES.EDITORIAL,
    tags: ['editorial', 'script', 'elegant'],
    renderMode: 'svg',
    fonts: { primary: 'Great Vibes', secondary: 'Lato' },
    palette: ['#2C3E50', '#E74C3C', '#FFFFFF'],
    layers: [
      { id: 'fill', type: 'fill', color: '#2C3E50' },
      { id: 'shadow', type: 'shadow', offset: { x: 3, y: 3 }, blur: 6, color: '#E74C3C', opacity: 0.3 },
    ],
    responsiveRules: { maxFontSize: 90, minFontSize: 18, scaleBehavior: 'scale' },
  },

  // ============================================
  // TRENDY SOCIAL / CREATOR STYLE (5 presets)
  // ============================================
  {
    id: 'social-bubble-pop',
    name: 'Bubble Pop',
    category: PRESET_CATEGORIES.SOCIAL,
    tags: ['social', 'trendy', 'bubble'],
    renderMode: 'svg',
    fonts: { primary: 'Poppins', secondary: 'Poppins' },
    palette: ['#FF6B6B', '#FFD93D', '#FFFFFF'],
    layers: [
      { id: 'backShadow', type: 'shadow', offset: { x: 6, y: 6 }, blur: 8, color: '#FF6B6B', opacity: 0.14 },
      { id: 'fill', type: 'fill', color: '#FFFFFF' },
      { id: 'colorShadow', type: 'shadow', offset: { x: -6, y: -6 }, blur: 6, color: '#FFD93D', opacity: 0.6 },
    ],
    decorations: [
      { id: 'blob', kind: 'blob', position: 'behind', color: '#FF6B6B', opacity: 0.18 },
    ],
    responsiveRules: { maxFontSize: 72, minFontSize: 14, scaleBehavior: 'scale' },
  },

  {
    id: 'social-pastel-dream',
    name: 'Pastel Dream',
    category: PRESET_CATEGORIES.SOCIAL,
    tags: ['social', 'pastel', 'soft'],
    renderMode: 'svg',
    fonts: { primary: 'Quicksand', secondary: 'Quicksand' },
    palette: ['#FFB6C1', '#B4E7CE', '#FFF5BA'],
    layers: [
      { id: 'fill', type: 'fill', color: '#FFFFFF' },
      { id: 'stroke', type: 'stroke', color: '#FFB6C1', strokeWidth: 6 },
    ],
    decorations: [
      { id: 'blob', kind: 'blob', position: 'behind', color: '#B4E7CE', opacity: 0.3 },
    ],
    responsiveRules: { maxFontSize: 68, minFontSize: 12, scaleBehavior: 'scale' },
  },

  {
    id: 'social-neon-vibe',
    name: 'Neon Vibe',
    category: PRESET_CATEGORIES.SOCIAL,
    tags: ['social', 'neon', 'vibrant'],
    renderMode: 'svg',
    fonts: { primary: 'Urbanist', secondary: 'Urbanist' },
    palette: ['#00F5FF', '#FF00FF', '#0F172A'],
    layers: [
      { id: 'glow', type: 'glow', blur: 16, color: '#00F5FF', opacity: 0.7 },
      { id: 'fill', type: 'fill', color: '#FFFFFF' },
      { id: 'stroke', type: 'stroke', color: '#FF00FF', strokeWidth: 4 },
    ],
    responsiveRules: { maxFontSize: 76, minFontSize: 14, scaleBehavior: 'scale' },
  },

  {
    id: 'social-gradient-wave',
    name: 'Gradient Wave',
    category: PRESET_CATEGORIES.SOCIAL,
    tags: ['social', 'gradient', 'modern'],
    renderMode: 'svg',
    fonts: { primary: 'Plus Jakarta Sans', secondary: 'Plus Jakarta Sans' },
    palette: ['#667EEA', '#764BA2', '#F093FB'],
    layers: [
      { id: 'gradient', type: 'gradient', gradientColors: ['#667EEA', '#764BA2', '#F093FB'] },
      { id: 'shadow', type: 'shadow', offset: { x: 4, y: 4 }, blur: 8, color: '#000000', opacity: 0.2 },
    ],
    responsiveRules: { maxFontSize: 70, minFontSize: 14, scaleBehavior: 'scale' },
  },

  {
    id: 'social-playful-bold',
    name: 'Playful Bold',
    category: PRESET_CATEGORIES.SOCIAL,
    tags: ['social', 'playful', 'bold'],
    renderMode: 'svg',
    fonts: { primary: 'Fredoka', secondary: 'Fredoka' },
    palette: ['#FF6B9D', '#FEC84D', '#4ECDC4'],
    layers: [
      { id: 'shadow', type: 'shadow', offset: { x: 5, y: 5 }, blur: 0, color: '#4ECDC4', opacity: 1 },
      { id: 'fill', type: 'fill', color: '#FF6B9D' },
      { id: 'stroke', type: 'stroke', color: '#FFFFFF', strokeWidth: 3, strokeAlign: 'outside' },
    ],
    responsiveRules: { maxFontSize: 74, minFontSize: 14, scaleBehavior: 'scale' },
  },

  // ============================================
  // Y2K / RETRO FUTURE (5 presets)
  // ============================================
  {
    id: 'y2k-holographic',
    name: 'Holographic',
    category: PRESET_CATEGORIES.Y2K,
    tags: ['y2k', 'holographic', 'futuristic'],
    renderMode: 'svg',
    fonts: { primary: 'Orbitron' },
    palette: ['#56F0FF', '#9B64FF', '#0A0A0A'],
    layers: [
      { id: 'neon', type: 'stroke', color: '#56F0FF', strokeWidth: 6, blur: 4, opacity: 0.98 },
      { id: 'fill', type: 'fill', color: '#9B64FF' },
      { id: 'glow', type: 'glow', blur: 22, color: '#56F0FF', opacity: 0.5 },
    ],
    responsiveRules: { maxFontSize: 110, minFontSize: 16, scaleBehavior: 'scale' },
  },

  {
    id: 'y2k-chrome-3d',
    name: 'Chrome 3D',
    category: PRESET_CATEGORIES.Y2K,
    tags: ['y2k', 'chrome', '3d'],
    renderMode: 'svg',
    fonts: { primary: 'Teko' },
    palette: ['#C0C0C0', '#E8E8E8', '#404040'],
    layers: [
      { id: 'shadow1', type: 'shadow', offset: { x: 4, y: 4 }, blur: 0, color: '#404040', opacity: 1 },
      { id: 'shadow2', type: 'shadow', offset: { x: 8, y: 8 }, blur: 0, color: '#606060', opacity: 1 },
      { id: 'fill', type: 'fill', color: '#E8E8E8' },
      { id: 'stroke', type: 'stroke', color: '#FFFFFF', strokeWidth: 2 },
    ],
    responsiveRules: { maxFontSize: 100, minFontSize: 16, scaleBehavior: 'scale' },
  },

  {
    id: 'y2k-pixel-perfect',
    name: 'Pixel Perfect',
    category: PRESET_CATEGORIES.Y2K,
    tags: ['y2k', 'pixel', 'retro'],
    renderMode: 'svg',
    fonts: { primary: 'Press Start 2P' },
    palette: ['#00FF00', '#FF00FF', '#000000'],
    layers: [
      { id: 'shadow', type: 'shadow', offset: { x: 4, y: 4 }, blur: 0, color: '#FF00FF', opacity: 1 },
      { id: 'fill', type: 'fill', color: '#00FF00' },
    ],
    responsiveRules: { maxFontSize: 64, minFontSize: 12, scaleBehavior: 'scale' },
  },

  {
    id: 'y2k-vaporwave',
    name: 'Vaporwave',
    category: PRESET_CATEGORIES.Y2K,
    tags: ['y2k', 'vaporwave', 'aesthetic'],
    renderMode: 'svg',
    fonts: { primary: 'Righteous' },
    palette: ['#FF71CE', '#01CDFE', '#05FFA1'],
    layers: [
      { id: 'gradient', type: 'gradient', gradientColors: ['#FF71CE', '#01CDFE', '#05FFA1'] },
      { id: 'glow', type: 'glow', blur: 18, color: '#FF71CE', opacity: 0.6 },
    ],
    responsiveRules: { maxFontSize: 92, minFontSize: 14, scaleBehavior: 'scale' },
  },

  {
    id: 'y2k-glitch-rgb',
    name: 'Glitch RGB',
    category: PRESET_CATEGORIES.Y2K,
    tags: ['y2k', 'glitch', 'rgb'],
    renderMode: 'svg',
    fonts: { primary: 'Audiowide' },
    palette: ['#FF0000', '#00FF00', '#0000FF'],
    layers: [
      { id: 'red', type: 'fill', offset: { x: -3, y: 0 }, color: '#FF0000', opacity: 0.7 },
      { id: 'green', type: 'fill', offset: { x: 3, y: 0 }, color: '#00FF00', opacity: 0.7 },
      { id: 'blue', type: 'fill', color: '#0000FF' },
    ],
    responsiveRules: { maxFontSize: 88, minFontSize: 14, scaleBehavior: 'scale' },
  },

  // ============================================
  // HANDWRITTEN & MARKER STYLES (5 presets)
  // ============================================
  {
    id: 'handwritten-brush-marker',
    name: 'Brush Marker',
    category: PRESET_CATEGORIES.HANDWRITTEN,
    tags: ['handwritten', 'brush', 'marker'],
    renderMode: 'svg',
    fonts: { primary: 'Permanent Marker' },
    palette: ['#151515', '#FF8A5B', '#FFFFFF'],
    layers: [
      { id: 'fill', type: 'fill', color: '#151515' },
    ],
    decorations: [
      { id: 'swipe', kind: 'swash', position: 'behind', color: '#FF8A5B', opacity: 0.9 },
    ],
    responsiveRules: { maxFontSize: 96, minFontSize: 18, scaleBehavior: 'wrap' },
  },

  {
    id: 'handwritten-chalk-board',
    name: 'Chalk Board',
    category: PRESET_CATEGORIES.HANDWRITTEN,
    tags: ['handwritten', 'chalk', 'textured'],
    renderMode: 'svg',
    fonts: { primary: 'Caveat' },
    palette: ['#FFFFFF', '#2C3E50', '#95A5A6'],
    layers: [
      { id: 'fill', type: 'fill', color: '#FFFFFF', opacity: 0.95 },
      { id: 'shadow', type: 'shadow', offset: { x: 2, y: 2 }, blur: 3, color: '#95A5A6', opacity: 0.4 },
    ],
    decorations: [
      { id: 'bg', kind: 'bar', position: 'behind', color: '#2C3E50', opacity: 1 },
    ],
    responsiveRules: { maxFontSize: 86, minFontSize: 16, scaleBehavior: 'wrap' },
  },

  {
    id: 'handwritten-script-flow',
    name: 'Script Flow',
    category: PRESET_CATEGORIES.HANDWRITTEN,
    tags: ['handwritten', 'script', 'flowing'],
    renderMode: 'svg',
    fonts: { primary: 'Dancing Script' },
    palette: ['#8B4513', '#FFE4B5', '#FFFFFF'],
    layers: [
      { id: 'fill', type: 'fill', color: '#8B4513' },
      { id: 'shadow', type: 'shadow', offset: { x: 3, y: 3 }, blur: 5, color: '#FFE4B5', opacity: 0.5 },
    ],
    responsiveRules: { maxFontSize: 82, minFontSize: 16, scaleBehavior: 'scale' },
  },

  {
    id: 'handwritten-doodle-fun',
    name: 'Doodle Fun',
    category: PRESET_CATEGORIES.HANDWRITTEN,
    tags: ['handwritten', 'doodle', 'playful'],
    renderMode: 'svg',
    fonts: { primary: 'Indie Flower' },
    palette: ['#2C3E50', '#E74C3C', '#F39C12'],
    layers: [
      { id: 'fill', type: 'fill', color: '#2C3E50' },
      { id: 'stroke', type: 'stroke', color: '#E74C3C', strokeWidth: 3 },
    ],
    decorations: [
      { id: 'shape', kind: 'shape', position: 'front', color: '#F39C12', opacity: 0.8 },
    ],
    responsiveRules: { maxFontSize: 78, minFontSize: 14, scaleBehavior: 'wrap' },
  },

  {
    id: 'handwritten-signature-style',
    name: 'Signature Style',
    category: PRESET_CATEGORIES.HANDWRITTEN,
    tags: ['handwritten', 'signature', 'elegant'],
    renderMode: 'svg',
    fonts: { primary: 'Satisfy' },
    palette: ['#1A1A1A', '#D4AF37', '#FFFFFF'],
    layers: [
      { id: 'fill', type: 'fill', color: '#1A1A1A' },
    ],
    decorations: [
      { id: 'underline', kind: 'underline', position: 'behind', height: 3, color: '#D4AF37', opacity: 0.7 },
    ],
    responsiveRules: { maxFontSize: 88, minFontSize: 16, scaleBehavior: 'scale' },
  },

  // ============================================
  // MINIMAL CLEAN UI TEXT (5 presets)
  // ============================================
  {
    id: 'minimal-clean-ui',
    name: 'Clean UI',
    category: PRESET_CATEGORIES.MINIMAL,
    tags: ['minimal', 'clean', 'ui'],
    renderMode: 'html',
    fonts: { primary: 'Inter', secondary: 'Inter' },
    palette: ['#0B1220', '#3B82F6', '#F8FAFC'],
    layers: [
      { id: 'fill', type: 'fill', color: '#0B1220' },
    ],
    decorations: [
      { id: 'underline', kind: 'underline', position: 'behind', height: 4, color: '#3B82F6' },
    ],
    responsiveRules: { maxFontSize: 48, minFontSize: 12, scaleBehavior: 'truncate' },
  },

  {
    id: 'minimal-modern-sans',
    name: 'Modern Sans',
    category: PRESET_CATEGORIES.MINIMAL,
    tags: ['minimal', 'modern', 'sans'],
    renderMode: 'html',
    fonts: { primary: 'Raleway', secondary: 'Raleway' },
    palette: ['#0F172A', '#94A3B8', '#FFFFFF'],
    layers: [
      { id: 'fill', type: 'fill', color: '#0F172A' },
    ],
    responsiveRules: { maxFontSize: 56, minFontSize: 12, scaleBehavior: 'wrap' },
  },

  {
    id: 'minimal-tech-mono',
    name: 'Tech Mono',
    category: PRESET_CATEGORIES.MINIMAL,
    tags: ['minimal', 'tech', 'monospace'],
    renderMode: 'svg',
    fonts: { primary: 'JetBrains Mono' },
    palette: ['#3B82F6', '#0F172A', '#FFFFFF'],
    layers: [
      { id: 'fill', type: 'fill', color: '#3B82F6' },
    ],
    decorations: [
      { id: 'bar', kind: 'bar', position: 'behind', height: 6, color: '#0F172A', opacity: 0.1 },
    ],
    responsiveRules: { maxFontSize: 52, minFontSize: 12, scaleBehavior: 'truncate' },
  },

  {
    id: 'minimal-light-weight',
    name: 'Light Weight',
    category: PRESET_CATEGORIES.MINIMAL,
    tags: ['minimal', 'light', 'thin'],
    renderMode: 'html',
    fonts: { primary: 'Roboto', secondary: 'Roboto' },
    palette: ['#334155', '#E2E8F0', '#FFFFFF'],
    layers: [
      { id: 'fill', type: 'fill', color: '#334155' },
    ],
    responsiveRules: { maxFontSize: 60, minFontSize: 14, scaleBehavior: 'wrap' },
  },

  {
    id: 'minimal-geometric',
    name: 'Geometric',
    category: PRESET_CATEGORIES.MINIMAL,
    tags: ['minimal', 'geometric', 'modern'],
    renderMode: 'svg',
    fonts: { primary: 'Outfit' },
    palette: ['#1E293B', '#6366F1', '#FFFFFF'],
    layers: [
      { id: 'fill', type: 'fill', color: '#1E293B' },
    ],
    decorations: [
      { id: 'accent', kind: 'bar', position: 'behind', width: 80, height: 4, color: '#6366F1' },
    ],
    responsiveRules: { maxFontSize: 54, minFontSize: 12, scaleBehavior: 'scale' },
  },

  // ============================================
  // GLITCH / GRUNGE / NOISE (5 presets)
  // ============================================
  {
    id: 'glitch-cmyk-split',
    name: 'CMYK Split',
    category: PRESET_CATEGORIES.GLITCH,
    tags: ['glitch', 'cmyk', 'rgb'],
    renderMode: 'svg',
    fonts: { primary: 'Anton' },
    palette: ['#FF0000', '#00FF00', '#0000FF'],
    layers: [
      { id: 'red', type: 'fill', offset: { x: 3, y: 0 }, color: '#FF0000', opacity: 0.85 },
      { id: 'green', type: 'fill', offset: { x: -3, y: 0 }, color: '#00FF00', opacity: 0.85 },
      { id: 'base', type: 'fill', color: '#0B0B0B' },
    ],
    responsiveRules: { maxFontSize: 100, minFontSize: 14, scaleBehavior: 'scale' },
  },

  {
    id: 'glitch-distortion',
    name: 'Distortion',
    category: PRESET_CATEGORIES.GLITCH,
    tags: ['glitch', 'distortion', 'digital'],
    renderMode: 'svg',
    fonts: { primary: 'Barlow Condensed' },
    palette: ['#00FFFF', '#FF00FF', '#000000'],
    layers: [
      { id: 'cyan', type: 'fill', offset: { x: -2, y: 1 }, color: '#00FFFF', opacity: 0.7 },
      { id: 'magenta', type: 'fill', offset: { x: 2, y: -1 }, color: '#FF00FF', opacity: 0.7 },
      { id: 'base', type: 'fill', color: '#FFFFFF' },
    ],
    responsiveRules: { maxFontSize: 94, minFontSize: 14, scaleBehavior: 'scale' },
  },

  {
    id: 'glitch-grunge-texture',
    name: 'Grunge Texture',
    category: PRESET_CATEGORIES.GLITCH,
    tags: ['glitch', 'grunge', 'texture'],
    renderMode: 'svg',
    fonts: { primary: 'Oswald' },
    palette: ['#2C3E50', '#E74C3C', '#ECF0F1'],
    layers: [
      { id: 'fill', type: 'fill', color: '#2C3E50' },
      { id: 'stroke', type: 'stroke', color: '#E74C3C', strokeWidth: 4 },
    ],
    responsiveRules: { maxFontSize: 90, minFontSize: 14, scaleBehavior: 'scale' },
  },

  {
    id: 'glitch-static-noise',
    name: 'Static Noise',
    category: PRESET_CATEGORIES.GLITCH,
    tags: ['glitch', 'static', 'noise'],
    renderMode: 'svg',
    fonts: { primary: 'Archivo Black' },
    palette: ['#FFFFFF', '#000000', '#808080'],
    layers: [
      { id: 'fill', type: 'fill', color: '#FFFFFF' },
      { id: 'stroke', type: 'stroke', color: '#000000', strokeWidth: 6 },
    ],
    responsiveRules: { maxFontSize: 96, minFontSize: 14, scaleBehavior: 'scale' },
  },

  {
    id: 'glitch-vhs-effect',
    name: 'VHS Effect',
    category: PRESET_CATEGORIES.GLITCH,
    tags: ['glitch', 'vhs', 'retro'],
    renderMode: 'svg',
    fonts: { primary: 'VT323' },
    palette: ['#FF00FF', '#00FFFF', '#FFFF00'],
    layers: [
      { id: 'shadow1', type: 'shadow', offset: { x: 2, y: 2 }, blur: 0, color: '#FF00FF', opacity: 0.8 },
      { id: 'shadow2', type: 'shadow', offset: { x: -2, y: -2 }, blur: 0, color: '#00FFFF', opacity: 0.8 },
      { id: 'fill', type: 'fill', color: '#FFFF00' },
    ],
    responsiveRules: { maxFontSize: 88, minFontSize: 14, scaleBehavior: 'scale' },
  },

  // ============================================
  // CUTE / KIDS / CRAFT (5 presets)
  // ============================================
  {
    id: 'cute-puffy-sticker',
    name: 'Puffy Sticker',
    category: PRESET_CATEGORIES.CUTE,
    tags: ['cute', 'sticker', 'puffy'],
    renderMode: 'svg',
    fonts: { primary: 'Fredoka' },
    palette: ['#FFB6C1', '#FFDAB9', '#FFFFFF'],
    layers: [
      { id: 'shadow', type: 'shadow', offset: { x: 6, y: 6 }, blur: 12, color: '#000000', opacity: 0.12 },
      { id: 'fill', type: 'fill', color: '#FFFFFF' },
      { id: 'stroke', type: 'stroke', color: '#FFB6C1', strokeWidth: 10, strokeAlign: 'outside' },
    ],
    decorations: [
      { id: 'sparkle', kind: 'shape', position: 'front', color: '#FFDAB9', opacity: 0.9 },
    ],
    responsiveRules: { maxFontSize: 72, minFontSize: 12, scaleBehavior: 'wrap' },
  },

  {
    id: 'cute-rainbow-fun',
    name: 'Rainbow Fun',
    category: PRESET_CATEGORIES.CUTE,
    tags: ['cute', 'rainbow', 'colorful'],
    renderMode: 'svg',
    fonts: { primary: 'Baloo 2' },
    palette: ['#FF6B6B', '#FFA500', '#FFD93D', '#6BCF7F', '#4D96FF', '#9B59B6'],
    layers: [
      { id: 'gradient', type: 'gradient', gradientColors: ['#FF6B6B', '#FFA500', '#FFD93D', '#6BCF7F', '#4D96FF', '#9B59B6'] },
      { id: 'stroke', type: 'stroke', color: '#FFFFFF', strokeWidth: 6 },
    ],
    responsiveRules: { maxFontSize: 68, minFontSize: 12, scaleBehavior: 'scale' },
  },

  {
    id: 'cute-soft-pastel',
    name: 'Soft Pastel',
    category: PRESET_CATEGORIES.CUTE,
    tags: ['cute', 'pastel', 'soft'],
    renderMode: 'svg',
    fonts: { primary: 'Quicksand' },
    palette: ['#FFE5E5', '#E5F5FF', '#FFF5E5'],
    layers: [
      { id: 'fill', type: 'fill', color: '#FFE5E5' },
      { id: 'shadow', type: 'shadow', offset: { x: 4, y: 4 }, blur: 8, color: '#E5F5FF', opacity: 0.6 },
    ],
    decorations: [
      { id: 'blob', kind: 'blob', position: 'behind', color: '#FFF5E5', opacity: 0.4 },
    ],
    responsiveRules: { maxFontSize: 64, minFontSize: 12, scaleBehavior: 'wrap' },
  },

  {
    id: 'cute-cartoon-bold',
    name: 'Cartoon Bold',
    category: PRESET_CATEGORIES.CUTE,
    tags: ['cute', 'cartoon', 'bold'],
    renderMode: 'svg',
    fonts: { primary: 'Titan One' },
    palette: ['#FF6B9D', '#FEC84D', '#4ECDC4'],
    layers: [
      { id: 'shadow', type: 'shadow', offset: { x: 5, y: 5 }, blur: 0, color: '#4ECDC4', opacity: 1 },
      { id: 'fill', type: 'fill', color: '#FF6B9D' },
      { id: 'stroke', type: 'stroke', color: '#FFFFFF', strokeWidth: 4, strokeAlign: 'outside' },
    ],
    responsiveRules: { maxFontSize: 70, minFontSize: 14, scaleBehavior: 'scale' },
  },

  {
    id: 'cute-bubble-letters',
    name: 'Bubble Letters',
    category: PRESET_CATEGORIES.CUTE,
    tags: ['cute', 'bubble', 'rounded'],
    renderMode: 'svg',
    fonts: { primary: 'Bubblegum Sans' },
    palette: ['#FFB3BA', '#FFDFBA', '#FFFFBA', '#BAFFC9', '#BAE1FF'],
    layers: [
      { id: 'fill', type: 'fill', color: '#FFB3BA' },
      { id: 'stroke', type: 'stroke', color: '#FFFFFF', strokeWidth: 8 },
      { id: 'shadow', type: 'shadow', offset: { x: 4, y: 4 }, blur: 6, color: '#BAE1FF', opacity: 0.5 },
    ],
    responsiveRules: { maxFontSize: 66, minFontSize: 12, scaleBehavior: 'scale' },
  },
];

// Export by category for easy filtering
export const presetsByCategory = {
  [PRESET_CATEGORIES.PROMO]: premiumTextPresets.filter(p => p.category === PRESET_CATEGORIES.PROMO),
  [PRESET_CATEGORIES.EDITORIAL]: premiumTextPresets.filter(p => p.category === PRESET_CATEGORIES.EDITORIAL),
  [PRESET_CATEGORIES.SOCIAL]: premiumTextPresets.filter(p => p.category === PRESET_CATEGORIES.SOCIAL),
  [PRESET_CATEGORIES.Y2K]: premiumTextPresets.filter(p => p.category === PRESET_CATEGORIES.Y2K),
  [PRESET_CATEGORIES.HANDWRITTEN]: premiumTextPresets.filter(p => p.category === PRESET_CATEGORIES.HANDWRITTEN),
  [PRESET_CATEGORIES.MINIMAL]: premiumTextPresets.filter(p => p.category === PRESET_CATEGORIES.MINIMAL),
  [PRESET_CATEGORIES.GLITCH]: premiumTextPresets.filter(p => p.category === PRESET_CATEGORIES.GLITCH),
  [PRESET_CATEGORIES.CUTE]: premiumTextPresets.filter(p => p.category === PRESET_CATEGORIES.CUTE),
};

// Helper to get preset by ID
export function getPresetById(id: string): TextStylePreset | undefined {
  return premiumTextPresets.find(p => p.id === id);
}

// Helper to search presets by tag
export function searchPresetsByTag(tag: string): TextStylePreset[] {
  return premiumTextPresets.filter(p => p.tags?.includes(tag.toLowerCase()));
}

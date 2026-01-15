/**
 * Hero Patterns - Free repeatable SVG background patterns
 * Source: https://heropatterns.com/ (CC BY 4.0 License)
 */

export interface HeroPattern {
  id: string;
  name: string;
  category: 'geometric' | 'organic' | 'abstract' | 'minimal';
  svg: string;
}

// Generate pattern style with custom colors
export function getPatternStyle(
  pattern: HeroPattern,
  fgColor: string = '#9C92AC',
  bgColor: string = '#ffffff',
  opacity: number = 0.4
): { backgroundColor: string; backgroundImage: string } {
  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? `${parseInt(result[1], 16)},${parseInt(result[2], 16)},${parseInt(result[3], 16)}` : '0,0,0';
  };
  const rgb = hexToRgb(fgColor);
  const colorStr = `rgba(${rgb},${opacity})`.replace(/[()]/g, m => m === '(' ? '%28' : '%29').replace(/,/g, '%2C');
  const svgWithColor = pattern.svg.replace(/%239C92AC/g, colorStr);
  return { backgroundColor: bgColor, backgroundImage: `url("data:image/svg+xml,${svgWithColor}")` };
}

export const HERO_PATTERNS: HeroPattern[] = [
  { id: 'texture', name: 'Texture', category: 'minimal', svg: `%3Csvg xmlns='http://www.w3.org/2000/svg' width='4' height='4' viewBox='0 0 4 4'%3E%3Cpath fill='%239C92AC' fill-opacity='0.4' d='M1 3h1v1H1V3zm2-2h1v1H3V1z'/%3E%3C/svg%3E` },
  { id: 'dots', name: 'Dots', category: 'minimal', svg: `%3Csvg xmlns='http://www.w3.org/2000/svg' width='20' height='20' viewBox='0 0 20 20'%3E%3Ccircle fill='%239C92AC' fill-opacity='0.4' cx='10' cy='10' r='2'/%3E%3C/svg%3E` },
  { id: 'polka-dots', name: 'Polka Dots', category: 'minimal', svg: `%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40' viewBox='0 0 40 40'%3E%3Ccircle fill='%239C92AC' fill-opacity='0.4' cx='20' cy='20' r='8'/%3E%3C/svg%3E` },
  { id: 'plus', name: 'Plus', category: 'minimal', svg: `%3Csvg xmlns='http://www.w3.org/2000/svg' width='60' height='60' viewBox='0 0 60 60'%3E%3Cpath fill='%239C92AC' fill-opacity='0.4' d='M28 0h4v28h28v4H32v28h-4V32H0v-4h28V0z'/%3E%3C/svg%3E` },
  { id: 'diagonal-lines', name: 'Diagonal Lines', category: 'minimal', svg: `%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='10' viewBox='0 0 10 10'%3E%3Cpath stroke='%239C92AC' stroke-opacity='0.4' d='M-1 1l2-2M0 10L10 0M9 11l2-2'/%3E%3C/svg%3E` },
  { id: 'zigzag', name: 'Zigzag', category: 'geometric', svg: `%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='12' viewBox='0 0 40 12'%3E%3Cpath fill='%239C92AC' fill-opacity='0.4' d='M0 6l5-3 5 3 5-3 5 3 5-3 5 3 5-3 5 3v6H0z'/%3E%3C/svg%3E` },
  { id: 'waves', name: 'Waves', category: 'organic', svg: `%3Csvg xmlns='http://www.w3.org/2000/svg' width='75' height='100' viewBox='0 0 75 100'%3E%3Cpath fill='%239C92AC' fill-opacity='0.4' d='M37.5 0c12.5 0 12.5 25 25 25S75 0 75 0v50c0 0-12.5 25-25 25s-12.5-25-25-25S12.5 75 0 75V25c0 0 12.5-25 25-25s12.5 25 25 25z'/%3E%3C/svg%3E` },
  { id: 'bamboo', name: 'Bamboo', category: 'organic', svg: `%3Csvg xmlns='http://www.w3.org/2000/svg' width='8' height='16' viewBox='0 0 8 16'%3E%3Cpath fill='%239C92AC' fill-opacity='0.4' d='M0 0h1v16H0V0zm4 0h1v16H4V0z'/%3E%3C/svg%3E` },
  { id: 'autumn', name: 'Autumn', category: 'organic', svg: `%3Csvg xmlns='http://www.w3.org/2000/svg' width='20' height='20' viewBox='0 0 20 20'%3E%3Cpath fill='%239C92AC' fill-opacity='0.4' d='M0 0h20L0 20z'/%3E%3C/svg%3E` },
  { id: 'squares', name: 'Squares', category: 'geometric', svg: `%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40' viewBox='0 0 40 40'%3E%3Crect fill='%239C92AC' fill-opacity='0.4' x='0' y='0' width='20' height='20'/%3E%3Crect fill='%239C92AC' fill-opacity='0.4' x='20' y='20' width='20' height='20'/%3E%3C/svg%3E` },
  { id: 'triangles', name: 'Triangles', category: 'geometric', svg: `%3Csvg xmlns='http://www.w3.org/2000/svg' width='36' height='72' viewBox='0 0 36 72'%3E%3Cpath fill='%239C92AC' fill-opacity='0.4' d='M18 0l18 36H0zM18 72L0 36h36z'/%3E%3C/svg%3E` },
  { id: 'hexagons', name: 'Hexagons', category: 'geometric', svg: `%3Csvg xmlns='http://www.w3.org/2000/svg' width='28' height='49' viewBox='0 0 28 49'%3E%3Cpath fill='%239C92AC' fill-opacity='0.4' d='M13.99 9.25l13 7.5v15l-13 7.5L1 31.75v-15l12.99-7.5zM3 17.9v12.7l10.99 6.34 11-6.35V17.9l-11-6.34L3 17.9z'/%3E%3C/svg%3E` },
  { id: 'stars', name: 'Stars', category: 'geometric', svg: `%3Csvg xmlns='http://www.w3.org/2000/svg' width='60' height='60' viewBox='0 0 60 60'%3E%3Cpath fill='%239C92AC' fill-opacity='0.4' d='M30 0l7.5 22.5L60 30l-22.5 7.5L30 60l-7.5-22.5L0 30l22.5-7.5z'/%3E%3C/svg%3E` },
  { id: 'circles', name: 'Circles', category: 'organic', svg: `%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Ccircle fill='none' stroke='%239C92AC' stroke-opacity='0.4' stroke-width='2' cx='50' cy='50' r='40'/%3E%3C/svg%3E` },
  { id: 'bubbles', name: 'Bubbles', category: 'organic', svg: `%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Ccircle fill='%239C92AC' fill-opacity='0.4' cx='25' cy='25' r='15'/%3E%3Ccircle fill='%239C92AC' fill-opacity='0.4' cx='75' cy='75' r='15'/%3E%3C/svg%3E` },
  { id: 'grid', name: 'Grid', category: 'minimal', svg: `%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40' viewBox='0 0 40 40'%3E%3Cpath fill='none' stroke='%239C92AC' stroke-opacity='0.4' d='M0 20h40M20 0v40'/%3E%3C/svg%3E` },
  { id: 'cross', name: 'Cross', category: 'minimal', svg: `%3Csvg xmlns='http://www.w3.org/2000/svg' width='20' height='20' viewBox='0 0 20 20'%3E%3Cpath fill='%239C92AC' fill-opacity='0.4' d='M8 0h4v8h8v4h-8v8H8v-8H0V8h8z'/%3E%3C/svg%3E` },
  { id: 'diamond', name: 'Diamond', category: 'geometric', svg: `%3Csvg xmlns='http://www.w3.org/2000/svg' width='32' height='32' viewBox='0 0 32 32'%3E%3Cpath fill='%239C92AC' fill-opacity='0.4' d='M16 0l16 16-16 16L0 16z'/%3E%3C/svg%3E` },
  { id: 'stripes', name: 'Stripes', category: 'minimal', svg: `%3Csvg xmlns='http://www.w3.org/2000/svg' width='20' height='20' viewBox='0 0 20 20'%3E%3Crect fill='%239C92AC' fill-opacity='0.4' width='20' height='4'/%3E%3C/svg%3E` },
  { id: 'checkerboard', name: 'Checkerboard', category: 'geometric', svg: `%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40' viewBox='0 0 40 40'%3E%3Crect fill='%239C92AC' fill-opacity='0.4' width='20' height='20'/%3E%3Crect fill='%239C92AC' fill-opacity='0.4' x='20' y='20' width='20' height='20'/%3E%3C/svg%3E` },
  { id: 'confetti', name: 'Confetti', category: 'abstract', svg: `%3Csvg xmlns='http://www.w3.org/2000/svg' width='60' height='60' viewBox='0 0 60 60'%3E%3Crect fill='%239C92AC' fill-opacity='0.4' x='5' y='5' width='6' height='6' transform='rotate(45 8 8)'/%3E%3Crect fill='%239C92AC' fill-opacity='0.4' x='35' y='25' width='6' height='6' transform='rotate(30 38 28)'/%3E%3Crect fill='%239C92AC' fill-opacity='0.4' x='15' y='40' width='6' height='6' transform='rotate(60 18 43)'/%3E%3C/svg%3E` },
  { id: 'moroccan', name: 'Moroccan', category: 'geometric', svg: `%3Csvg xmlns='http://www.w3.org/2000/svg' width='30' height='30' viewBox='0 0 30 30'%3E%3Cpath fill='%239C92AC' fill-opacity='0.4' d='M15 0l15 15-15 15L0 15zm0 5L5 15l10 10 10-10z'/%3E%3C/svg%3E` },
  { id: 'brick', name: 'Brick', category: 'geometric', svg: `%3Csvg xmlns='http://www.w3.org/2000/svg' width='42' height='22' viewBox='0 0 42 22'%3E%3Crect fill='%239C92AC' fill-opacity='0.4' width='20' height='10'/%3E%3Crect fill='%239C92AC' fill-opacity='0.4' x='22' width='20' height='10'/%3E%3Crect fill='%239C92AC' fill-opacity='0.4' x='11' y='12' width='20' height='10'/%3E%3C/svg%3E` },
  { id: 'circuit', name: 'Circuit', category: 'abstract', svg: `%3Csvg xmlns='http://www.w3.org/2000/svg' width='50' height='50' viewBox='0 0 50 50'%3E%3Cpath fill='none' stroke='%239C92AC' stroke-opacity='0.4' d='M0 25h20M30 25h20M25 0v20M25 30v20'/%3E%3Ccircle fill='%239C92AC' fill-opacity='0.4' cx='25' cy='25' r='4'/%3E%3C/svg%3E` },
];

// Pattern categories for filtering
export const PATTERN_CATEGORIES = [
  { id: 'all', name: 'All' },
  { id: 'minimal', name: 'Minimal' },
  { id: 'geometric', name: 'Geometric' },
  { id: 'organic', name: 'Organic' },
  { id: 'abstract', name: 'Abstract' },
];

// Get patterns by category
export function getPatternsByCategory(category: string): HeroPattern[] {
  if (category === 'all') return HERO_PATTERNS;
  return HERO_PATTERNS.filter(p => p.category === category);
}

export type FontCategory = 
  | 'serif'
  | 'sans-serif'
  | 'display'
  | 'handwriting'
  | 'monospace';

export interface Font {
  name: string;
  category: FontCategory;
  variants?: string[];
  fallback?: string;
}

export const FONTS: Font[] = [
  // Sans-serif
  { name: 'Inter', category: 'sans-serif', fallback: 'sans-serif' },
  { name: 'Roboto', category: 'sans-serif', fallback: 'sans-serif' },
  { name: 'Open Sans', category: 'sans-serif', fallback: 'sans-serif' },
  { name: 'Lato', category: 'sans-serif', fallback: 'sans-serif' },
  { name: 'Montserrat', category: 'sans-serif', fallback: 'sans-serif' },
  { name: 'Poppins', category: 'sans-serif', fallback: 'sans-serif' },
  { name: 'Raleway', category: 'sans-serif', fallback: 'sans-serif' },
  { name: 'Nunito', category: 'sans-serif', fallback: 'sans-serif' },
  
  // Serif
  { name: 'Playfair Display', category: 'serif', fallback: 'serif' },
  { name: 'Merriweather', category: 'serif', fallback: 'serif' },
  { name: 'Lora', category: 'serif', fallback: 'serif' },
  { name: 'PT Serif', category: 'serif', fallback: 'serif' },
  { name: 'Crimson Text', category: 'serif', fallback: 'serif' },
  
  // Display
  { name: 'Bebas Neue', category: 'display', fallback: 'sans-serif' },
  { name: 'Righteous', category: 'display', fallback: 'sans-serif' },
  { name: 'Pacifico', category: 'display', fallback: 'cursive' },
  { name: 'Lobster', category: 'display', fallback: 'cursive' },
  
  // Handwriting
  { name: 'Dancing Script', category: 'handwriting', fallback: 'cursive' },
  { name: 'Caveat', category: 'handwriting', fallback: 'cursive' },
  { name: 'Satisfy', category: 'handwriting', fallback: 'cursive' },
  
  // Monospace
  { name: 'Roboto Mono', category: 'monospace', fallback: 'monospace' },
  { name: 'Fira Code', category: 'monospace', fallback: 'monospace' },
  { name: 'Source Code Pro', category: 'monospace', fallback: 'monospace' },
];

export const FONT_CATEGORIES: { value: FontCategory; label: string }[] = [
  { value: 'sans-serif', label: 'Sans Serif' },
  { value: 'serif', label: 'Serif' },
  { value: 'display', label: 'Display' },
  { value: 'handwriting', label: 'Handwriting' },
  { value: 'monospace', label: 'Monospace' },
];

export function searchFonts(query: string): Font[] {
  const lowerQuery = query.toLowerCase();
  return FONTS.filter(font => 
    font.name.toLowerCase().includes(lowerQuery)
  );
}

export function getFontsByCategory(category: FontCategory): Font[] {
  return FONTS.filter(font => font.category === category);
}

export * from './loadFont';
export * from './googleFontsApi';

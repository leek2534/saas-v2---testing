// Comprehensive font library with popular fonts
// Organized by category for filtering

export interface Font {
  name: string;
  category: 'sans-serif' | 'serif' | 'monospace' | 'display' | 'handwriting' | 'cursive' | 'bold' | 'elegant';
  weights?: number[];
  style?: 'normal' | 'italic';
}

export type FontCategory = Font['category'];

export const FONTS: Font[] = [
  // Sans-Serif
  { name: 'Inter', category: 'sans-serif', weights: [300, 400, 500, 600, 700, 800] },
  { name: 'Roboto', category: 'sans-serif', weights: [300, 400, 500, 700, 900] },
  { name: 'Open Sans', category: 'sans-serif', weights: [300, 400, 600, 700, 800] },
  { name: 'Lato', category: 'sans-serif', weights: [300, 400, 700, 900] },
  { name: 'Montserrat', category: 'sans-serif', weights: [300, 400, 500, 600, 700, 800, 900] },
  { name: 'Poppins', category: 'sans-serif', weights: [300, 400, 500, 600, 700, 800, 900] },
  { name: 'Raleway', category: 'sans-serif', weights: [300, 400, 500, 600, 700, 800, 900] },
  { name: 'Source Sans Pro', category: 'sans-serif', weights: [300, 400, 600, 700, 900] },
  { name: 'Nunito', category: 'sans-serif', weights: [300, 400, 600, 700, 800, 900] },
  { name: 'Ubuntu', category: 'sans-serif', weights: [300, 400, 500, 700] },
  { name: 'Work Sans', category: 'sans-serif', weights: [300, 400, 500, 600, 700, 800, 900] },
  { name: 'PT Sans', category: 'sans-serif', weights: [400, 700] },
  { name: 'Oswald', category: 'sans-serif', weights: [300, 400, 500, 600, 700] },
  { name: 'Fira Sans', category: 'sans-serif', weights: [300, 400, 500, 600, 700, 800, 900] },
  { name: 'Quicksand', category: 'sans-serif', weights: [300, 400, 500, 600, 700] },
  { name: 'Rubik', category: 'sans-serif', weights: [300, 400, 500, 600, 700, 800, 900] },
  { name: 'Cabin', category: 'sans-serif', weights: [400, 500, 600, 700] },
  { name: 'Karla', category: 'sans-serif', weights: [400, 700] },
  { name: 'Barlow', category: 'sans-serif', weights: [300, 400, 500, 600, 700, 800, 900] },
  { name: 'DM Sans', category: 'sans-serif', weights: [400, 500, 700] },
  { name: 'Manrope', category: 'sans-serif', weights: [300, 400, 500, 600, 700, 800] },
  { name: 'Sora', category: 'sans-serif', weights: [300, 400, 500, 600, 700, 800] },
  
  // Serif
  { name: 'Playfair Display', category: 'serif', weights: [400, 500, 600, 700, 800, 900] },
  { name: 'Merriweather', category: 'serif', weights: [300, 400, 700, 900] },
  { name: 'Georgia', category: 'serif' },
  { name: 'Lora', category: 'serif', weights: [400, 500, 600, 700] },
  { name: 'Crimson Text', category: 'serif', weights: [400, 600, 700] },
  { name: 'PT Serif', category: 'serif', weights: [400, 700] },
  { name: 'Libre Baskerville', category: 'serif', weights: [400, 700] },
  { name: 'Cormorant Garamond', category: 'serif', weights: [300, 400, 500, 600, 700] },
  { name: 'Bitter', category: 'serif', weights: [400, 700, 900] },
  { name: 'Alegreya', category: 'serif', weights: [400, 500, 700, 800, 900] },
  { name: 'EB Garamond', category: 'serif', weights: [400, 500, 600, 700, 800] },
  
  // Display/Bold
  { name: 'Bebas Neue', category: 'bold', weights: [400] },
  { name: 'Anton', category: 'bold', weights: [400] },
  { name: 'Righteous', category: 'bold', weights: [400] },
  { name: 'Bangers', category: 'bold', weights: [400] },
  { name: 'Fredoka One', category: 'bold', weights: [400] },
  { name: 'Russo One', category: 'bold', weights: [400] },
  { name: 'Orbitron', category: 'bold', weights: [400, 500, 600, 700, 800, 900] },
  { name: 'Audiowide', category: 'bold', weights: [400] },
  { name: 'Bungee', category: 'bold', weights: [400] },
  
  // Elegant
  { name: 'Cinzel', category: 'elegant', weights: [400, 500, 600, 700, 800, 900] },
  { name: 'Dancing Script', category: 'elegant', weights: [400, 500, 600, 700] },
  { name: 'Great Vibes', category: 'elegant', weights: [400] },
  { name: 'Allura', category: 'elegant', weights: [400] },
  { name: 'Parisienne', category: 'elegant', weights: [400] },
  { name: 'Sacramento', category: 'elegant', weights: [400] },
  { name: 'Tangerine', category: 'elegant', weights: [400, 700] },
  { name: 'Amatic SC', category: 'elegant', weights: [400, 700] },
  { name: 'Caveat', category: 'elegant', weights: [400, 500, 600, 700] },
  { name: 'Permanent Marker', category: 'elegant', weights: [400] },
  
  // Handwriting/Cursive
  { name: 'Pacifico', category: 'cursive', weights: [400] },
  { name: 'Indie Flower', category: 'cursive', weights: [400] },
  { name: 'Gloria Hallelujah', category: 'cursive', weights: [400] },
  { name: 'Comfortaa', category: 'cursive', weights: [300, 400, 500, 600, 700] },
  { name: 'Handlee', category: 'cursive', weights: [400] },
  
  // Monospace
  { name: 'Courier New', category: 'monospace' },
  { name: 'Monaco', category: 'monospace' },
  { name: 'Consolas', category: 'monospace' },
  { name: 'Roboto Mono', category: 'monospace', weights: [300, 400, 500, 700] },
  { name: 'Source Code Pro', category: 'monospace', weights: [300, 400, 500, 600, 700, 800, 900] },
  { name: 'Fira Code', category: 'monospace', weights: [300, 400, 500, 600, 700] },
];

export const FONT_CATEGORIES: FontCategory[] = [
  'sans-serif',
  'serif',
  'bold',
  'elegant',
  'cursive',
  'monospace',
];

export function searchFonts(query: string): Font[] {
  const lowerQuery = query.toLowerCase();
  return FONTS.filter(font => 
    font.name.toLowerCase().includes(lowerQuery) ||
    font.category.toLowerCase().includes(lowerQuery)
  );
}

export function getFontsByCategory(category: FontCategory): Font[] {
  return FONTS.filter(font => font.category === category);
}






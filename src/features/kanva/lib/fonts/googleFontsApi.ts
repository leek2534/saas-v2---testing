// Google Fonts API integration
// API Key should be stored in environment variables for production
// In Next.js, use NEXT_PUBLIC_ prefix for client-side env vars

const GOOGLE_FONTS_API_KEY = 
  (typeof process !== 'undefined' && process.env?.NEXT_PUBLIC_GOOGLE_FONTS_API_KEY) || 
  '';
const GOOGLE_FONTS_API_URL = 'https://www.googleapis.com/webfonts/v1/webfonts';

export interface GoogleFont {
  family: string;
  variants: string[];
  subsets: string[];
  version: string;
  lastModified: string;
  files: Record<string, string>;
  category: 'sans-serif' | 'serif' | 'display' | 'handwriting' | 'monospace';
  kind: string;
  menu?: string;
}

export interface GoogleFontsResponse {
  kind: string;
  items: GoogleFont[];
}

// Cache for fonts data
let fontsCache: GoogleFont[] | null = null;
let cacheTimestamp: number = 0;
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours

/**
 * Fetch all fonts from Google Fonts API
 */
export async function fetchGoogleFonts(): Promise<GoogleFont[]> {
  // Check cache first
  if (fontsCache && Date.now() - cacheTimestamp < CACHE_DURATION) {
    return fontsCache;
  }

  try {
    const url = GOOGLE_FONTS_API_KEY
      ? `${GOOGLE_FONTS_API_URL}?key=${GOOGLE_FONTS_API_KEY}&sort=popularity`
      : `${GOOGLE_FONTS_API_URL}?sort=popularity`;

    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch fonts: ${response.statusText}`);
    }

    const data: GoogleFontsResponse = await response.json();
    
    // Cache the results
    fontsCache = data.items;
    cacheTimestamp = Date.now();
    
    return data.items;
  } catch (error) {
    console.error('Error fetching Google Fonts:', error);
    
    // Return fallback fonts if API fails
    return getFallbackFonts();
  }
}

/**
 * Get fonts filtered by category
 */
export async function getFontsByCategory(category: string): Promise<GoogleFont[]> {
  const allFonts = await fetchGoogleFonts();
  
  if (category === 'all') {
    return allFonts;
  }
  
  return allFonts.filter(font => font.category === category);
}

/**
 * Search fonts by name
 */
export async function searchFonts(query: string): Promise<GoogleFont[]> {
  const allFonts = await fetchGoogleFonts();
  const lowerQuery = query.toLowerCase();
  
  return allFonts.filter(font => 
    font.family.toLowerCase().includes(lowerQuery)
  );
}

/**
 * Convert Google Font variant to weight number
 */
export function variantToWeight(variant: string): string {
  // Handle italic variants
  const cleanVariant = variant.replace('italic', '');
  
  // Map variant names to weights
  const weightMap: Record<string, string> = {
    'thin': '100',
    'extralight': '200',
    'light': '300',
    'regular': '400',
    'medium': '500',
    'semibold': '600',
    'bold': '700',
    'extrabold': '800',
    'black': '900',
  };
  
  // If it's already a number, return it
  if (/^\d+$/.test(cleanVariant)) {
    return cleanVariant;
  }
  
  // Otherwise map from name
  return weightMap[cleanVariant.toLowerCase()] || '400';
}

/**
 * Get available weights for a font
 */
export function getFontWeights(font: GoogleFont): string[] {
  return font.variants
    .filter(v => !v.includes('italic')) // Exclude italic variants
    .map(v => variantToWeight(v))
    .filter((v, i, arr) => arr.indexOf(v) === i) // Remove duplicates
    .sort((a, b) => parseInt(a) - parseInt(b));
}

/**
 * Fallback fonts if API fails
 */
function getFallbackFonts(): GoogleFont[] {
  return [
    {
      family: 'Inter',
      category: 'sans-serif',
      variants: ['300', '400', '500', '600', '700', '800', '900'],
      subsets: ['latin'],
      version: 'v1',
      lastModified: '2024-01-01',
      files: {},
      kind: 'webfonts#webfont'
    },
    {
      family: 'Roboto',
      category: 'sans-serif',
      variants: ['300', '400', '500', '700', '900'],
      subsets: ['latin'],
      version: 'v1',
      lastModified: '2024-01-01',
      files: {},
      kind: 'webfonts#webfont'
    },
    {
      family: 'Open Sans',
      category: 'sans-serif',
      variants: ['300', '400', '500', '600', '700', '800'],
      subsets: ['latin'],
      version: 'v1',
      lastModified: '2024-01-01',
      files: {},
      kind: 'webfonts#webfont'
    },
    {
      family: 'Playfair Display',
      category: 'serif',
      variants: ['400', '500', '600', '700', '800', '900'],
      subsets: ['latin'],
      version: 'v1',
      lastModified: '2024-01-01',
      files: {},
      kind: 'webfonts#webfont'
    },
    {
      family: 'Dancing Script',
      category: 'handwriting',
      variants: ['400', '500', '600', '700'],
      subsets: ['latin'],
      version: 'v1',
      lastModified: '2024-01-01',
      files: {},
      kind: 'webfonts#webfont'
    },
  ];
}

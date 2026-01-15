'use client';

import { useState, useMemo, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Search, Check } from 'lucide-react';
import { cn } from '../lib/utils';
import { loadGoogleFont } from '../lib/fonts/loadFont';

export interface Font {
  name: string;
  category: 'sans-serif' | 'serif' | 'display' | 'handwriting' | 'monospace';
  weights?: string[];
}

export interface FontWithWeight {
  fontFamily: string;
  fontWeight: string;
  displayName: string;
}

// All fonts from Google Fonts - Free and readily available
export const FONTS: Font[] = [
  // Sans Serif - Modern & Clean
  { name: 'Inter', category: 'sans-serif', weights: ['300', '400', '500', '600', '700', '800', '900'] },
  { name: 'Roboto', category: 'sans-serif', weights: ['300', '400', '500', '700', '900'] },
  { name: 'Open Sans', category: 'sans-serif', weights: ['300', '400', '500', '600', '700', '800'] },
  { name: 'Lato', category: 'sans-serif', weights: ['300', '400', '700', '900'] },
  { name: 'Montserrat', category: 'sans-serif', weights: ['300', '400', '500', '600', '700', '800', '900'] },
  { name: 'Poppins', category: 'sans-serif', weights: ['300', '400', '500', '600', '700', '800', '900'] },
  { name: 'Nunito', category: 'sans-serif', weights: ['300', '400', '500', '600', '700', '800', '900'] },
  { name: 'Raleway', category: 'sans-serif', weights: ['300', '400', '500', '600', '700', '800', '900'] },
  { name: 'Source Sans Pro', category: 'sans-serif', weights: ['300', '400', '600', '700', '900'] },
  { name: 'Work Sans', category: 'sans-serif', weights: ['300', '400', '500', '600', '700', '800', '900'] },
  { name: 'Manrope', category: 'sans-serif', weights: ['300', '400', '500', '600', '700', '800'] },
  { name: 'DM Sans', category: 'sans-serif', weights: ['400', '500', '700'] },
  { name: 'Lexend', category: 'sans-serif', weights: ['300', '400', '500', '600', '700', '800'] },
  { name: 'Space Grotesk', category: 'sans-serif', weights: ['300', '400', '500', '600', '700'] },
  { name: 'Outfit', category: 'sans-serif', weights: ['300', '400', '500', '600', '700', '800', '900'] },
  { name: 'Plus Jakarta Sans', category: 'sans-serif', weights: ['400', '500', '600', '700', '800'] },
  { name: 'Sora', category: 'sans-serif', weights: ['300', '400', '500', '600', '700', '800'] },
  { name: 'Archivo', category: 'sans-serif', weights: ['300', '400', '500', '600', '700', '800', '900'] },
  { name: 'Rubik', category: 'sans-serif', weights: ['300', '400', '500', '600', '700', '800', '900'] },
  { name: 'Karla', category: 'sans-serif', weights: ['300', '400', '500', '600', '700', '800'] },
  { name: 'Quicksand', category: 'sans-serif', weights: ['300', '400', '500', '600', '700'] },
  { name: 'Barlow', category: 'sans-serif', weights: ['300', '400', '500', '600', '700', '800', '900'] },
  { name: 'Jost', category: 'sans-serif', weights: ['300', '400', '500', '600', '700', '800', '900'] },
  { name: 'Urbanist', category: 'sans-serif', weights: ['300', '400', '500', '600', '700', '800', '900'] },
  { name: 'Red Hat Display', category: 'sans-serif', weights: ['400', '500', '600', '700', '800', '900'] },
  { name: 'Hind', category: 'sans-serif', weights: ['300', '400', '500', '600', '700'] },
  { name: 'Mulish', category: 'sans-serif', weights: ['300', '400', '500', '600', '700', '800', '900'] },
  { name: 'Cabin', category: 'sans-serif', weights: ['400', '500', '600', '700'] },
  { name: 'Asap', category: 'sans-serif', weights: ['400', '500', '600', '700'] },
  { name: 'Titillium Web', category: 'sans-serif', weights: ['300', '400', '600', '700', '900'] },
  { name: 'Exo 2', category: 'sans-serif', weights: ['300', '400', '500', '600', '700', '800', '900'] },
  { name: 'Noto Sans', category: 'sans-serif', weights: ['400', '700'] },
  { name: 'Heebo', category: 'sans-serif', weights: ['300', '400', '500', '600', '700', '800', '900'] },
  { name: 'Varela Round', category: 'sans-serif', weights: ['400'] },
  { name: 'Oxygen', category: 'sans-serif', weights: ['300', '400', '700'] },
  { name: 'PT Sans', category: 'sans-serif', weights: ['400', '700'] },
  { name: 'Ubuntu', category: 'sans-serif', weights: ['300', '400', '500', '700'] },
  { name: 'Josefin Sans', category: 'sans-serif', weights: ['300', '400', '600', '700'] },
  { name: 'Fira Sans', category: 'sans-serif', weights: ['300', '400', '500', '600', '700', '800', '900'] },
  { name: 'Dosis', category: 'sans-serif', weights: ['300', '400', '500', '600', '700', '800'] },
  
  // Serif - Elegant & Traditional
  { name: 'Playfair Display', category: 'serif', weights: ['400', '500', '600', '700', '800', '900'] },
  { name: 'Merriweather', category: 'serif', weights: ['300', '400', '700', '900'] },
  { name: 'Lora', category: 'serif', weights: ['400', '500', '600', '700'] },
  { name: 'PT Serif', category: 'serif', weights: ['400', '700'] },
  { name: 'Crimson Text', category: 'serif', weights: ['400', '600', '700'] },
  { name: 'Libre Baskerville', category: 'serif', weights: ['400', '700'] },
  { name: 'Cormorant Garamond', category: 'serif', weights: ['300', '400', '500', '600', '700'] },
  { name: 'EB Garamond', category: 'serif', weights: ['400', '500', '600', '700', '800'] },
  { name: 'Spectral', category: 'serif', weights: ['300', '400', '500', '600', '700', '800'] },
  { name: 'Cardo', category: 'serif', weights: ['400', '700'] },
  { name: 'Bitter', category: 'serif', weights: ['300', '400', '500', '600', '700', '800'] },
  { name: 'Arvo', category: 'serif', weights: ['400', '700'] },
  { name: 'Rokkitt', category: 'serif', weights: ['300', '400', '500', '600', '700', '800', '900'] },
  { name: 'Vollkorn', category: 'serif', weights: ['400', '500', '600', '700', '800', '900'] },
  { name: 'Abril Fatface', category: 'serif', weights: ['400'] },
  { name: 'Bodoni Moda', category: 'serif', weights: ['400', '500', '600', '700', '800', '900'] },
  { name: 'Alegreya', category: 'serif', weights: ['400', '500', '600', '700', '800', '900'] },
  { name: 'Zilla Slab', category: 'serif', weights: ['300', '400', '500', '600', '700'] },
  { name: 'Cinzel', category: 'serif', weights: ['400', '500', '600', '700', '800', '900'] },
  { name: 'Old Standard TT', category: 'serif', weights: ['400', '700'] },
  { name: 'Gelasio', category: 'serif', weights: ['400', '500', '600', '700'] },
  { name: 'Noticia Text', category: 'serif', weights: ['400', '700'] },
  { name: 'Domine', category: 'serif', weights: ['400', '500', '600', '700'] },
  { name: 'Noto Serif', category: 'serif', weights: ['400', '700'] },
  { name: 'Source Serif Pro', category: 'serif', weights: ['300', '400', '600', '700', '900'] },
  
  // Display - Bold & Eye-catching
  { name: 'Oswald', category: 'display', weights: ['300', '400', '500', '600', '700'] },
  { name: 'Bebas Neue', category: 'display', weights: ['400'] },
  { name: 'Anton', category: 'display', weights: ['400'] },
  { name: 'Righteous', category: 'display', weights: ['400'] },
  { name: 'Fredoka One', category: 'display', weights: ['400'] },
  { name: 'Bangers', category: 'display', weights: ['400'] },
  { name: 'Alfa Slab One', category: 'display', weights: ['400'] },
  { name: 'Archivo Black', category: 'display', weights: ['400'] },
  { name: 'Black Ops One', category: 'display', weights: ['400'] },
  { name: 'Bungee', category: 'display', weights: ['400'] },
  { name: 'Passion One', category: 'display', weights: ['400', '700', '900'] },
  { name: 'Russo One', category: 'display', weights: ['400'] },
  { name: 'Staatliches', category: 'display', weights: ['400'] },
  { name: 'Titan One', category: 'display', weights: ['400'] },
  { name: 'Ultra', category: 'display', weights: ['400'] },
  { name: 'Monoton', category: 'display', weights: ['400'] },
  { name: 'Lobster', category: 'display', weights: ['400'] },
  { name: 'Paytone One', category: 'display', weights: ['400'] },
  { name: 'Fugaz One', category: 'display', weights: ['400'] },
  { name: 'Bowlby One', category: 'display', weights: ['400'] },
  { name: 'Barlow Condensed', category: 'display', weights: ['300', '400', '500', '600', '700', '800', '900'] },
  { name: 'Fjalla One', category: 'display', weights: ['400'] },
  { name: 'Orbitron', category: 'display', weights: ['400', '500', '600', '700', '800', '900'] },
  { name: 'Rajdhani', category: 'display', weights: ['300', '400', '500', '600', '700'] },
  { name: 'Teko', category: 'display', weights: ['300', '400', '500', '600', '700'] },
  { name: 'Squada One', category: 'display', weights: ['400'] },
  { name: 'Audiowide', category: 'display', weights: ['400'] },
  { name: 'Bungee Inline', category: 'display', weights: ['400'] },
  { name: 'Creepster', category: 'display', weights: ['400'] },
  { name: 'Eater', category: 'display', weights: ['400'] },
  { name: 'Fascinate', category: 'display', weights: ['400'] },
  { name: 'Faster One', category: 'display', weights: ['400'] },
  { name: 'Holtwood One SC', category: 'display', weights: ['400'] },
  { name: 'Luckiest Guy', category: 'display', weights: ['400'] },
  { name: 'Modak', category: 'display', weights: ['400'] },
  { name: 'Shrikhand', category: 'display', weights: ['400'] },
  { name: 'Sigmar One', category: 'display', weights: ['400'] },
  
  // Handwriting - Script & Casual (All handwriting/script style fonts)
  { name: 'Dancing Script', category: 'handwriting', weights: ['400', '500', '600', '700'] },
  { name: 'Pacifico', category: 'handwriting', weights: ['400'] },
  { name: 'Caveat', category: 'handwriting', weights: ['400', '500', '600', '700'] },
  { name: 'Great Vibes', category: 'handwriting', weights: ['400'] },
  { name: 'Allura', category: 'handwriting', weights: ['400'] },
  { name: 'Sacramento', category: 'handwriting', weights: ['400'] },
  { name: 'Tangerine', category: 'handwriting', weights: ['400', '700'] },
  { name: 'Yellowtail', category: 'handwriting', weights: ['400'] },
  { name: 'Kaushan Script', category: 'handwriting', weights: ['400'] },
  { name: 'Satisfy', category: 'handwriting', weights: ['400'] },
  { name: 'Courgette', category: 'handwriting', weights: ['400'] },
  { name: 'Cookie', category: 'handwriting', weights: ['400'] },
  { name: 'Damion', category: 'handwriting', weights: ['400'] },
  { name: 'Mr Dafoe', category: 'handwriting', weights: ['400'] },
  { name: 'Pinyon Script', category: 'handwriting', weights: ['400'] },
  { name: 'Rochester', category: 'handwriting', weights: ['400'] },
  { name: 'Zeyada', category: 'handwriting', weights: ['400'] },
  { name: 'Cedarville Cursive', category: 'handwriting', weights: ['400'] },
  { name: 'Marck Script', category: 'handwriting', weights: ['400'] },
  { name: 'Alex Brush', category: 'handwriting', weights: ['400'] },
  { name: 'Parisienne', category: 'handwriting', weights: ['400'] },
  { name: 'Monsieur La Doulaise', category: 'handwriting', weights: ['400'] },
  { name: 'Petit Formal Script', category: 'handwriting', weights: ['400'] },
  { name: 'Qwigley', category: 'handwriting', weights: ['400'] },
  { name: 'La Belle Aurore', category: 'handwriting', weights: ['400'] },
  { name: 'Herr Von Muellerhoff', category: 'handwriting', weights: ['400'] },
  { name: 'Shadows Into Light', category: 'handwriting', weights: ['400'] },
  { name: 'Indie Flower', category: 'handwriting', weights: ['400'] },
  { name: 'Patrick Hand', category: 'handwriting', weights: ['400'] },
  { name: 'Architects Daughter', category: 'handwriting', weights: ['400'] },
  { name: 'Handlee', category: 'handwriting', weights: ['400'] },
  { name: 'Covered By Your Grace', category: 'handwriting', weights: ['400'] },
  { name: 'Reenie Beanie', category: 'handwriting', weights: ['400'] },
  { name: 'Nothing You Could Do', category: 'handwriting', weights: ['400'] },
  { name: 'Kalam', category: 'handwriting', weights: ['300', '400', '700'] },
  { name: 'Homemade Apple', category: 'handwriting', weights: ['400'] },
  { name: 'Bad Script', category: 'handwriting', weights: ['400'] },
  { name: 'Amatic SC', category: 'handwriting', weights: ['400', '700'] },
  { name: 'Permanent Marker', category: 'handwriting', weights: ['400'] },
  
  // Monospace - Code & Tech
  { name: 'Roboto Mono', category: 'monospace', weights: ['300', '400', '500', '600', '700'] },
  { name: 'Source Code Pro', category: 'monospace', weights: ['300', '400', '500', '600', '700', '800', '900'] },
  { name: 'JetBrains Mono', category: 'monospace', weights: ['300', '400', '500', '600', '700', '800'] },
  { name: 'Fira Code', category: 'monospace', weights: ['300', '400', '500', '600', '700'] },
  { name: 'Space Mono', category: 'monospace', weights: ['400', '700'] },
  { name: 'IBM Plex Mono', category: 'monospace', weights: ['300', '400', '500', '600', '700'] },
  { name: 'Inconsolata', category: 'monospace', weights: ['400', '700'] },
  { name: 'Ubuntu Mono', category: 'monospace', weights: ['400', '700'] },
  { name: 'PT Mono', category: 'monospace', weights: ['400'] },
  { name: 'Anonymous Pro', category: 'monospace', weights: ['400', '700'] },
  { name: 'Overpass Mono', category: 'monospace', weights: ['300', '400', '500', '600', '700'] },
  { name: 'Cousine', category: 'monospace', weights: ['400', '700'] },
  { name: 'Share Tech Mono', category: 'monospace', weights: ['400'] },
  { name: 'VT323', category: 'monospace', weights: ['400'] },
  { name: 'Azeret Mono', category: 'monospace', weights: ['300', '400', '500', '600', '700', '800', '900'] },
];

// Font weight variants
const WEIGHT_VARIANTS: Record<string, string> = {
  '300': 'Light',
  '400': 'Regular',
  '500': 'Medium',
  '600': 'SemiBold',
  '700': 'Bold',
  '800': 'ExtraBold',
  '900': 'Black',
};

interface FontSelectorProps {
  selectedFont: string;
  selectedWeight?: string;
  onFontSelect: (font: string, weight?: string) => void;
  onClose?: () => void;
}

export function FontSelector({ selectedFont, selectedWeight = '400', onFontSelect, onClose }: FontSelectorProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedFont, setExpandedFont] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'font' | 'styles'>('font');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [recentlyUsed] = useState<string[]>(['Inter', 'Montserrat', 'Poppins', 'Roboto']);

  // Filtered fonts based on category and search
  const filteredFonts = useMemo(() => {
    let fonts = FONTS;
    
    // Filter by category
    if (selectedCategory !== 'all') {
      fonts = fonts.filter(f => f.category === selectedCategory);
    }
    
    // Filter by search
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      fonts = fonts.filter(font => 
        font.name.toLowerCase().includes(query)
      );
    }
    
    return fonts;
  }, [searchQuery, selectedCategory]);

  // Popular fonts - curated selection
  const popularFonts = useMemo(() => {
    let fonts = FONTS.filter(f => 
      ['Roboto', 'Open Sans', 'Lato', 'Montserrat', 'Poppins', 'Oswald', 'Raleway', 'Nunito', 'Playfair Display', 'Bebas Neue'].includes(f.name)
    );
    
    // Filter by category if not 'all'
    if (selectedCategory !== 'all') {
      fonts = fonts.filter(f => f.category === selectedCategory);
    }
    
    return fonts;
  }, [selectedCategory]);

  // Load fonts as they're displayed
  useEffect(() => {
    const loadFonts = async () => {
      const fontsToLoad = [...recentlyUsed, ...popularFonts.map(f => f.name)]
        .slice(0, 15);
      await Promise.all(fontsToLoad.map(font => loadGoogleFont(font)));
    };
    loadFonts();
  }, [recentlyUsed, popularFonts]);

  const FontItem = ({ font, isExpanded, onToggle }: { font: Font; isExpanded: boolean; onToggle: () => void }) => {
    const isSelected = selectedFont === font.name;
    const hasWeights = font.weights && font.weights.length > 1;

    return (
      <div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              // Only apply the font with default weight (400)
              onFontSelect(font.name, '400');
            }}
            className={cn(
              "flex-1 text-left px-3 py-2.5 rounded-lg transition-all duration-200 group flex items-center justify-between",
              isSelected
                ? "bg-primary text-primary-foreground"
                : "hover:bg-muted/70"
            )}
            style={{ fontFamily: font.name }}
          >
            <span className="text-sm font-medium">{font.name}</span>
            {isSelected && (
              <Check size={16} className="flex-shrink-0" />
            )}
          </button>
          {hasWeights && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggle();
              }}
              className="px-2 py-2.5 rounded-lg hover:bg-muted/70 transition-colors text-xs text-muted-foreground"
            >
              {isExpanded ? '−' : '+'}
            </button>
          )}
        </div>

        {/* Weight Variants */}
        {isExpanded && hasWeights && (
          <div className="ml-4 mt-1 space-y-1 pl-3 border-l-2 border-border/50">
            {font.weights?.map((weight) => {
              const isWeightSelected = isSelected && selectedWeight === weight;
              return (
                <button
                  key={weight}
                  onClick={() => onFontSelect(font.name, weight)}
                  className={cn(
                    "w-full text-left px-3 py-2 rounded-lg transition-all duration-200 flex items-center justify-between text-sm",
                    isWeightSelected
                      ? "bg-primary/10 text-primary font-medium"
                      : "hover:bg-muted/50 text-muted-foreground"
                  )}
                  style={{ fontFamily: font.name, fontWeight: weight }}
                >
                  <span>{WEIGHT_VARIANTS[weight] || weight}</span>
                  {isWeightSelected && (
                    <Check size={14} className="flex-shrink-0" />
                  )}
                </button>
              );
            })}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="w-full h-full flex flex-col bg-background">
      {/* Tabs */}
      <div className="flex border-b border-border">
        <button
          onClick={() => setActiveTab('font')}
          className={cn(
            "flex-1 px-4 py-3 text-sm font-medium transition-colors relative",
            activeTab === 'font'
              ? "text-foreground"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          Font
          {activeTab === 'font' && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
          )}
        </button>
        <button
          onClick={() => setActiveTab('styles')}
          className={cn(
            "flex-1 px-4 py-3 text-sm font-medium transition-colors relative",
            activeTab === 'styles'
              ? "text-foreground"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          Text styles
          {activeTab === 'styles' && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
          )}
        </button>
      </div>

      {/* Search */}
      <div className="p-4 border-b border-border space-y-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={16} />
          <Input
            placeholder='Try "Calligraphy" or "Open Sans"'
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 bg-background border-border text-foreground text-sm h-9"
          />
        </div>
        
        {/* Category Pills */}
        {activeTab === 'font' && !searchQuery.trim() && (
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
            {[
              { id: 'all', label: 'All' },
              { id: 'handwriting', label: 'Handwriting' },
              { id: 'sans-serif', label: 'Sans serif' },
              { id: 'serif', label: 'Serif' },
              { id: 'display', label: 'Display' },
              { id: 'monospace', label: 'Monospace' },
            ].map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={cn(
                  "px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors",
                  selectedCategory === category.id
                    ? "bg-foreground text-background"
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                )}
              >
                {category.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Content */}
      {activeTab === 'font' ? (
        <div className="flex-1 overflow-y-auto p-4">
        {searchQuery.trim() ? (
          // Search Results
          <div className="space-y-1">
            {filteredFonts.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground text-sm">
                No fonts found
              </div>
            ) : (
              filteredFonts.map((font) => (
                <FontItem
                  key={font.name}
                  font={font}
                  isExpanded={expandedFont === font.name}
                  onToggle={() => setExpandedFont(expandedFont === font.name ? null : font.name)}
                />
              ))
            )}
          </div>
        ) : (
          // Category View - Recently Used + All Fonts in Category
          <div className="space-y-6">
            {/* Recently Used */}
            {recentlyUsed.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-3.5 h-3.5 rounded-full border-2 border-muted-foreground" />
                  <h4 className="text-xs font-semibold text-foreground">Recently used</h4>
                </div>
                <div className="space-y-1">
                  {FONTS.filter(f => recentlyUsed.includes(f.name)).map((font) => (
                    <FontItem
                      key={font.name}
                      font={font}
                      isExpanded={expandedFont === font.name}
                      onToggle={() => setExpandedFont(expandedFont === font.name ? null : font.name)}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* All Fonts in Selected Category */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="text-sm">📝</span>
                <h4 className="text-xs font-semibold text-foreground">
                  {selectedCategory === 'all' ? 'All fonts' : 
                   selectedCategory === 'sans-serif' ? 'Sans serif fonts' :
                   selectedCategory === 'serif' ? 'Serif fonts' :
                   selectedCategory === 'display' ? 'Display fonts' :
                   selectedCategory === 'handwriting' ? 'Handwriting fonts' :
                   selectedCategory === 'monospace' ? 'Monospace fonts' : 'Fonts'}
                </h4>
                <span className="text-xs text-muted-foreground">({filteredFonts.length})</span>
              </div>
              <div className="space-y-1">
                {filteredFonts.map((font) => (
                  <FontItem
                    key={font.name}
                    font={font}
                    isExpanded={expandedFont === font.name}
                    onToggle={() => setExpandedFont(expandedFont === font.name ? null : font.name)}
                  />
                ))}
              </div>
            </div>

            {/* Upload Font */}
            <div className="pt-4 border-t border-border">
              <button className="text-xs text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2">
                <span>Upload a font</span>
                <span className="px-2 py-0.5 bg-orange-500/10 text-orange-500 rounded text-xs font-medium">Learn more</span>
              </button>
            </div>
          </div>
        )}
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto p-4">
          <div className="text-center py-12 text-muted-foreground text-sm">
            <p>Text styles coming soon</p>
            <p className="text-xs mt-2">Create and save custom text styles</p>
          </div>
        </div>
      )}
    </div>
  );
}


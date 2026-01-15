/**
 * GoogleFontSelector - Enhanced font selector with ALL Google Fonts
 * Fetches fonts dynamically from Google Fonts API
 * Supports 1000+ fonts with search, categories, and weight variants
 */

import { useState, useMemo, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Search, Check, Loader2, AlertCircle } from 'lucide-react';
import { cn } from '../lib/utils';
import { loadGoogleFont } from '../lib/fonts/loadFont';
import {
  fetchGoogleFonts,
  getFontWeights,
  type GoogleFont
} from '../lib/fonts/googleFontsApi';

// Font weight variants
const WEIGHT_VARIANTS: Record<string, string> = {
  '100': 'Thin',
  '200': 'ExtraLight',
  '300': 'Light',
  '400': 'Regular',
  '500': 'Medium',
  '600': 'SemiBold',
  '700': 'Bold',
  '800': 'ExtraBold',
  '900': 'Black',
};

interface GoogleFontSelectorProps {
  selectedFont: string;
  selectedWeight?: string;
  onFontSelect: (font: string, weight?: string) => void;
}

export function GoogleFontSelector({ 
  selectedFont, 
  selectedWeight = '400', 
  onFontSelect
}: GoogleFontSelectorProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedFont, setExpandedFont] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'font' | 'styles'>('font');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [allFonts, setAllFonts] = useState<GoogleFont[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [recentlyUsed] = useState<string[]>(['Inter', 'Montserrat', 'Poppins', 'Roboto']);

  // Fetch all fonts on mount
  useEffect(() => {
    const loadFonts = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const fonts = await fetchGoogleFonts();
        setAllFonts(fonts);
      } catch (err) {
        setError('Failed to load fonts. Using fallback fonts.');
        console.error('Error loading Google Fonts:', err);
      } finally {
        setIsLoading(false);
      }
    };
    loadFonts();
  }, []);

  // Filtered fonts based on category and search
  const filteredFonts = useMemo(() => {
    let fonts = allFonts;
    
    // Filter by category
    if (selectedCategory !== 'all') {
      fonts = fonts.filter(f => f.category === selectedCategory);
    }
    
    // Filter by search
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      fonts = fonts.filter(font => 
        font.family.toLowerCase().includes(query)
      );
    }
    
    return fonts;
  }, [allFonts, searchQuery, selectedCategory]);

  // Popular fonts - top 20 by popularity
  const popularFonts = useMemo(() => {
    let fonts = allFonts.slice(0, 20);
    
    // Filter by category if not 'all'
    if (selectedCategory !== 'all') {
      fonts = fonts.filter(f => f.category === selectedCategory);
    }
    
    return fonts;
  }, [allFonts, selectedCategory]);

  // Load preview fonts - load visible fonts immediately
  useEffect(() => {
    const loadPreviewFonts = async () => {
      // Load recently used fonts
      const recentlyUsedFonts = recentlyUsed;
      
      // Load popular/visible fonts based on category
      const visibleFonts = filteredFonts.slice(0, 50).map(f => f.family);
      
      // Combine and load
      const fontsToLoad = [...new Set([...recentlyUsedFonts, ...visibleFonts])];
      await Promise.all(fontsToLoad.map(font => loadGoogleFont(font)));
    };
    
    if (allFonts.length > 0) {
      loadPreviewFonts();
    }
  }, [recentlyUsed, filteredFonts, allFonts]);

  const FontItem = ({ 
    font, 
    isExpanded, 
    onToggle 
  }: { 
    font: GoogleFont; 
    isExpanded: boolean; 
    onToggle: () => void 
  }) => {
    const isSelected = selectedFont === font.family;
    const weights = getFontWeights(font);
    const hasWeights = weights.length > 1;

    return (
      <div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              onFontSelect(font.family, '400');
            }}
            className={cn(
              "flex-1 text-left px-3 py-2.5 rounded-lg transition-all duration-200 group flex items-center justify-between",
              isSelected
                ? "bg-primary text-primary-foreground"
                : "hover:bg-muted/70"
            )}
            style={{ fontFamily: font.family }}
          >
            <span className="text-sm font-medium">{font.family}</span>
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
            {weights.map((weight) => {
              const isWeightSelected = isSelected && selectedWeight === weight;
              return (
                <button
                  key={weight}
                  onClick={() => onFontSelect(font.family, weight)}
                  className={cn(
                    "w-full text-left px-3 py-2 rounded-lg transition-all duration-200 flex items-center justify-between text-sm",
                    isWeightSelected
                      ? "bg-primary/10 text-primary font-medium"
                      : "hover:bg-muted/50 text-muted-foreground"
                  )}
                  style={{ fontFamily: font.family, fontWeight: weight }}
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
            placeholder={`Search ${allFonts.length}+ Google Fonts...`}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 bg-background border-border text-foreground text-sm h-9"
          />
        </div>
        
        {/* Category Pills */}
        {activeTab === 'font' && !searchQuery.trim() && (
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
            {[
              { id: 'all', label: `All (${allFonts.length})` },
              { id: 'sans-serif', label: 'Sans serif' },
              { id: 'serif', label: 'Serif' },
              { id: 'display', label: 'Display' },
              { id: 'handwriting', label: 'Handwriting' },
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

        {/* Error Message */}
        {error && (
          <div className="flex items-center gap-2 text-xs text-orange-600 bg-orange-50 dark:bg-orange-950/20 px-3 py-2 rounded-lg">
            <AlertCircle size={14} />
            <span>{error}</span>
          </div>
        )}
      </div>

      {/* Content */}
      {activeTab === 'font' ? (
        <div className="flex-1 overflow-y-auto p-4">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
              <Loader2 className="w-8 h-8 animate-spin mb-3" />
              <p className="text-sm">Loading Google Fonts...</p>
              <p className="text-xs mt-1">Fetching 1000+ fonts</p>
            </div>
          ) : searchQuery.trim() ? (
            // Search Results
            <div className="space-y-1">
              {filteredFonts.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground text-sm">
                  <p>No fonts found for "{searchQuery}"</p>
                  <p className="text-xs mt-2">Try a different search term</p>
                </div>
              ) : (
                <>
                  <div className="mb-3 text-xs text-muted-foreground">
                    {filteredFonts.length} font{filteredFonts.length !== 1 ? 's' : ''} found
                  </div>
                  {filteredFonts.map((font) => (
                    <FontItem
                      key={font.family}
                      font={font}
                      isExpanded={expandedFont === font.family}
                      onToggle={() => setExpandedFont(expandedFont === font.family ? null : font.family)}
                    />
                  ))}
                </>
              )}
            </div>
          ) : (
            // Category View - Recently Used + Popular + All Fonts
            <div className="space-y-6">
              {/* Recently Used */}
              {recentlyUsed.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-3.5 h-3.5 rounded-full border-2 border-muted-foreground" />
                    <h4 className="text-xs font-semibold text-foreground">Recently used</h4>
                  </div>
                  <div className="space-y-1">
                    {allFonts.filter(f => recentlyUsed.includes(f.family)).map((font) => (
                      <FontItem
                        key={font.family}
                        font={font}
                        isExpanded={expandedFont === font.family}
                        onToggle={() => setExpandedFont(expandedFont === font.family ? null : font.family)}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Popular Fonts */}
              {popularFonts.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-sm">🔥</span>
                    <h4 className="text-xs font-semibold text-foreground">Popular fonts</h4>
                  </div>
                  <div className="space-y-1">
                    {popularFonts.map((font) => (
                      <FontItem
                        key={font.family}
                        font={font}
                        isExpanded={expandedFont === font.family}
                        onToggle={() => setExpandedFont(expandedFont === font.family ? null : font.family)}
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
                  {filteredFonts.slice(0, 100).map((font) => (
                    <FontItem
                      key={font.family}
                      font={font}
                      isExpanded={expandedFont === font.family}
                      onToggle={() => setExpandedFont(expandedFont === font.family ? null : font.family)}
                    />
                  ))}
                  {filteredFonts.length > 100 && (
                    <div className="text-center py-4 text-xs text-muted-foreground">
                      Showing 100 of {filteredFonts.length} fonts. Use search to find more.
                    </div>
                  )}
                </div>
              </div>

              {/* Upload Font */}
              <div className="pt-4 border-t border-border">
                <button className="text-xs text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2">
                  <span>Upload a custom font</span>
                  <span className="px-2 py-0.5 bg-orange-500/10 text-orange-500 rounded text-xs font-medium">PRO</span>
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

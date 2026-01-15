/**
 * TextPresetsGallery - Browse and apply professional text style presets
 * Displays 40 premium presets organized by category
 */

'use client';

import React, { useState } from 'react';
import { TextStyleRenderer } from './TextStyleRenderer';
import { 
  premiumTextPresets, 
  presetsByCategory, 
  getPresetById,
  searchPresetsByTag 
} from '../lib/text/premiumPresets';
import { PRESET_CATEGORIES, TextStylePreset } from '../lib/text/textStyleTypes';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Sparkles, Zap, Newspaper, Instagram, Cpu, PenTool, Minimize2, Skull, Heart } from 'lucide-react';
import { cn } from '../lib/utils';

interface TextPresetsGalleryProps {
  onSelectPreset: (preset: TextStylePreset) => void;
  className?: string;
}

// Category icons mapping
const CATEGORY_ICONS: Record<string, React.ElementType> = {
  [PRESET_CATEGORIES.PROMO]: Zap,
  [PRESET_CATEGORIES.EDITORIAL]: Newspaper,
  [PRESET_CATEGORIES.SOCIAL]: Instagram,
  [PRESET_CATEGORIES.Y2K]: Cpu,
  [PRESET_CATEGORIES.HANDWRITTEN]: PenTool,
  [PRESET_CATEGORIES.MINIMAL]: Minimize2,
  [PRESET_CATEGORIES.GLITCH]: Skull,
  [PRESET_CATEGORIES.CUTE]: Heart,
};

// Category short names for tabs
const CATEGORY_SHORT_NAMES: Record<string, string> = {
  [PRESET_CATEGORIES.PROMO]: 'Promo',
  [PRESET_CATEGORIES.EDITORIAL]: 'Editorial',
  [PRESET_CATEGORIES.SOCIAL]: 'Social',
  [PRESET_CATEGORIES.Y2K]: 'Y2K',
  [PRESET_CATEGORIES.HANDWRITTEN]: 'Handwritten',
  [PRESET_CATEGORIES.MINIMAL]: 'Minimal',
  [PRESET_CATEGORIES.GLITCH]: 'Glitch',
  [PRESET_CATEGORIES.CUTE]: 'Cute',
};

export function TextPresetsGallery({ onSelectPreset, className }: TextPresetsGalleryProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Filter presets based on search and category
  const filteredPresets = React.useMemo(() => {
    let presets = premiumTextPresets;

    // Filter by category
    if (selectedCategory !== 'all') {
      presets = presets.filter(p => p.category === selectedCategory);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      presets = presets.filter(p => 
        p.name.toLowerCase().includes(query) ||
        p.category.toLowerCase().includes(query) ||
        p.tags?.some(tag => tag.toLowerCase().includes(query))
      );
    }

    return presets;
  }, [searchQuery, selectedCategory]);

  return (
    <div className={cn("flex flex-col h-full bg-background", className)}>
      {/* Header */}
      <div className="p-4 border-b border-border/50">
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="w-5 h-5 text-indigo-500" />
          <h2 className="text-lg font-semibold">Text Presets</h2>
          <span className="ml-auto text-xs text-muted-foreground">
            {filteredPresets.length} styles
          </span>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search presets..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 h-9 text-sm"
          />
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex-1 flex flex-col">
        <div className="px-4 pt-3 border-b border-border/50">
          <div className="w-full overflow-x-auto">
            <div className="inline-flex h-9 items-center justify-start w-full bg-transparent p-0 gap-1">
              <button
                onClick={() => setSelectedCategory('all')}
                className={cn(
                  "px-3 py-1.5 text-xs rounded-md transition-colors",
                  selectedCategory === 'all'
                    ? "bg-indigo-500 text-white"
                    : "hover:bg-accent"
                )}
              >
                All
              </button>
              {Object.entries(PRESET_CATEGORIES).map(([key, category]) => {
                const Icon = CATEGORY_ICONS[category];
                return (
                  <button
                    key={key}
                    onClick={() => setSelectedCategory(category)}
                    className={cn(
                      "px-3 py-1.5 text-xs rounded-md transition-colors flex items-center",
                      selectedCategory === category
                        ? "bg-indigo-500 text-white"
                        : "hover:bg-accent"
                    )}
                  >
                    <Icon className="w-3 h-3 mr-1.5" />
                    {CATEGORY_SHORT_NAMES[category]}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Presets Grid */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-4">
            <div className="grid grid-cols-2 gap-3">
              {filteredPresets.map((preset) => (
                <PresetCard
                  key={preset.id}
                  preset={preset}
                  onClick={() => onSelectPreset(preset)}
                />
              ))}
            </div>

            {/* Empty State */}
            {filteredPresets.length === 0 && (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <Search className="w-12 h-12 text-muted-foreground/50 mb-3" />
                <p className="text-sm text-muted-foreground">No presets found</p>
                <p className="text-xs text-muted-foreground/70 mt-1">
                  Try a different search or category
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Individual Preset Card
interface PresetCardProps {
  preset: TextStylePreset;
  onClick: () => void;
}

function PresetCard({ preset, onClick }: PresetCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={cn(
        "group relative flex flex-col items-center gap-2 p-3 rounded-lg transition-all duration-200",
        "bg-card",
        "border-2.5 border-border/50",
        "hover:border-[#4F46E5] hover:scale-[1.02]"
      )}
      style={{
        boxShadow: isHovered 
          ? '0 0 0 1px rgba(79, 70, 229, 0.3), 0 0 6px rgba(79, 70, 229, 0.2), 0 4px 12px rgba(0, 0, 0, 0.1)'
          : 'none'
      }}
    >
      {/* Preview */}
      <div className="w-full h-20 flex items-center justify-center bg-muted/30 rounded-md overflow-hidden">
        <div className="scale-[0.4] origin-center">
          <TextStyleRenderer
            preset={preset}
            text={isHovered ? "Sample" : preset.name.split(' ')[0]}
            fontSize={64}
            maxWidth={400}
          />
        </div>
      </div>

      {/* Name */}
      <div className="w-full text-center">
        <p className="text-xs font-medium text-foreground truncate">
          {preset.name}
        </p>
        <p className="text-[10px] text-muted-foreground truncate mt-0.5">
          {CATEGORY_SHORT_NAMES[preset.category]}
        </p>
      </div>

      {/* Hover Effect */}
      <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-indigo-500/0 to-purple-600/0 group-hover:from-indigo-500/5 group-hover:to-purple-600/5 transition-all duration-200 pointer-events-none" />
    </button>
  );
}

// Compact version for sidebars
export function TextPresetsGalleryCompact({ onSelectPreset, className }: TextPresetsGalleryProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>(PRESET_CATEGORIES.PROMO);

  const categoryPresets = presetsByCategory[selectedCategory as keyof typeof presetsByCategory] || [];

  return (
    <div className={cn("flex flex-col h-full", className)}>
      {/* Category Selector */}
      <div className="p-3 border-b border-border/50">
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="w-full px-3 py-2 text-sm border border-border rounded-md bg-background"
        >
          {Object.entries(PRESET_CATEGORIES).map(([key, category]) => (
            <option key={key} value={category}>
              {CATEGORY_SHORT_NAMES[category]}
            </option>
          ))}
        </select>
      </div>

      {/* Presets List */}
      <ScrollArea className="flex-1">
        <div className="p-3 space-y-2">
          {categoryPresets.map((preset) => {
            const [isHovered, setIsHovered] = React.useState(false);
            return (
            <button
              key={preset.id}
              onClick={() => onSelectPreset(preset)}
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
              className="w-full p-2 rounded-md border-2 border-border/50 hover:border-[#4F46E5] transition-all text-left"
              style={{
                boxShadow: isHovered 
                  ? '0 0 0 1px rgba(79, 70, 229, 0.3), 0 0 6px rgba(79, 70, 229, 0.2)'
                  : 'none'
              }}
            >
              <div className="h-12 flex items-center justify-center bg-muted/30 rounded mb-1.5 overflow-hidden">
                <div className="scale-[0.25] origin-center">
                  <TextStyleRenderer
                    preset={preset}
                    text={preset.name.split(' ')[0]}
                    fontSize={64}
                    maxWidth={300}
                  />
                </div>
              </div>
              <p className="text-xs font-medium text-center truncate">
                {preset.name}
              </p>
            </button>
            );
          })}
        </div>
      </ScrollArea>
    </div>
  );
}

'use client';

import { useState } from 'react';
import { Grid3x3, Palette, Image as ImageIcon } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { cn } from '../lib/utils';
import { HERO_PATTERNS, PATTERN_CATEGORIES, getPatternsByCategory, getPatternStyle } from '../lib/patterns/heroPatterns';
import type { CanvasConfig } from '../lib/editor/types';

interface BackgroundPanelProps {
  canvas: CanvasConfig;
  setCanvas: (canvas: Partial<CanvasConfig>) => void;
}

// Preset solid colors
const SOLID_COLORS = [
  '#ffffff', '#f8fafc', '#f1f5f9', '#e2e8f0', '#cbd5e1', '#94a3b8', '#64748b', '#475569', '#334155', '#1e293b', '#0f172a', '#000000',
  '#fef2f2', '#fee2e2', '#fecaca', '#fca5a5', '#f87171', '#ef4444', '#dc2626', '#b91c1c', '#991b1b', '#7f1d1d',
  '#fff7ed', '#ffedd5', '#fed7aa', '#fdba74', '#fb923c', '#f97316', '#ea580c', '#c2410c', '#9a3412', '#7c2d12',
  '#fefce8', '#fef9c3', '#fef08a', '#fde047', '#facc15', '#eab308', '#ca8a04', '#a16207', '#854d0e', '#713f12',
  '#f0fdf4', '#dcfce7', '#bbf7d0', '#86efac', '#4ade80', '#22c55e', '#16a34a', '#15803d', '#166534', '#14532d',
  '#ecfeff', '#cffafe', '#a5f3fc', '#67e8f9', '#22d3ee', '#06b6d4', '#0891b2', '#0e7490', '#155e75', '#164e63',
  '#eff6ff', '#dbeafe', '#bfdbfe', '#93c5fd', '#60a5fa', '#3b82f6', '#2563eb', '#1d4ed8', '#1e40af', '#1e3a8a',
  '#f5f3ff', '#ede9fe', '#ddd6fe', '#c4b5fd', '#a78bfa', '#8b5cf6', '#7c3aed', '#6d28d9', '#5b21b6', '#4c1d95',
  '#fdf4ff', '#fae8ff', '#f5d0fe', '#f0abfc', '#e879f9', '#d946ef', '#c026d3', '#a21caf', '#86198f', '#701a75',
  '#fdf2f8', '#fce7f3', '#fbcfe8', '#f9a8d4', '#f472b6', '#ec4899', '#db2777', '#be185d', '#9d174d', '#831843',
];

// Preset gradients
const GRADIENTS = [
  { name: 'Sunset', colors: ['#f97316', '#ec4899'] },
  { name: 'Ocean', colors: ['#06b6d4', '#3b82f6'] },
  { name: 'Forest', colors: ['#22c55e', '#14532d'] },
  { name: 'Purple Haze', colors: ['#8b5cf6', '#ec4899'] },
  { name: 'Fire', colors: ['#ef4444', '#f97316'] },
  { name: 'Sky', colors: ['#38bdf8', '#818cf8'] },
  { name: 'Mint', colors: ['#34d399', '#06b6d4'] },
  { name: 'Rose', colors: ['#fb7185', '#f472b6'] },
  { name: 'Gold', colors: ['#fbbf24', '#f97316'] },
  { name: 'Night', colors: ['#1e293b', '#0f172a'] },
  { name: 'Peach', colors: ['#fda4af', '#fcd34d'] },
  { name: 'Aurora', colors: ['#22d3ee', '#a78bfa', '#f472b6'] },
];

export function BackgroundPanel({ canvas, setCanvas }: BackgroundPanelProps) {
  const [activeSubTab, setActiveSubTab] = useState<'colors' | 'gradients' | 'patterns'>('colors');
  const [patternCategory, setPatternCategory] = useState('all');
  const [patternColor, setPatternColor] = useState('#6366f1');
  const [patternOpacity, setPatternOpacity] = useState(0.4);
  const [customColor, setCustomColor] = useState(canvas.background?.color || '#ffffff');

  const handleSolidColor = (color: string) => {
    setCanvas({
      background: { color, pattern: undefined, gradient: undefined }
    });
  };

  const handleGradient = (colors: string[]) => {
    const gradient = colors.length === 2
      ? `linear-gradient(135deg, ${colors[0]} 0%, ${colors[1]} 100%)`
      : `linear-gradient(135deg, ${colors[0]} 0%, ${colors[1]} 50%, ${colors[2]} 100%)`;
    setCanvas({
      background: { color: undefined, gradient, pattern: undefined }
    });
  };

  const handlePattern = (patternId: string) => {
    const pattern = HERO_PATTERNS.find(p => p.id === patternId);
    if (pattern) {
      const style = getPatternStyle(pattern, patternColor, '#ffffff', patternOpacity);
      setCanvas({
        background: {
          color: '#ffffff',
          pattern: {
            id: patternId,
            foregroundColor: patternColor,
            backgroundColor: '#ffffff',
            opacity: patternOpacity,
            css: `${style.backgroundColor}; background-image: ${style.backgroundImage}`,
          }
        }
      });
    }
  };

  const filteredPatterns = getPatternsByCategory(patternCategory);

  return (
    <div className="w-96 bg-gradient-to-b from-background via-background to-muted/20 border-r border-border/30 flex flex-col h-full overflow-hidden flex-shrink-0 backdrop-blur-sm">
      {/* Header */}
      <div className="p-6 border-b border-border/50 bg-gradient-to-br from-background to-muted/30">
        <div className="flex items-center gap-2 mb-2">
          <Grid3x3 className="w-5 h-5 text-primary" />
          <h3 className="text-foreground font-bold text-lg tracking-tight">Background</h3>
        </div>
        <p className="text-xs text-muted-foreground mb-4">Colors, gradients & patterns</p>

        {/* Sub-tabs */}
        <div className="flex gap-2">
          {[
            { id: 'colors', label: 'Colors', icon: Palette },
            { id: 'gradients', label: 'Gradients', icon: Palette },
            { id: 'patterns', label: 'Patterns', icon: Grid3x3 },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id as typeof activeSubTab)}
              className={cn(
                "flex-1 px-3 py-2 rounded-lg text-xs font-medium transition-all",
                activeSubTab === tab.id
                  ? "bg-primary text-primary-foreground shadow-lg"
                  : "bg-muted/50 text-muted-foreground hover:bg-accent"
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4">
        {/* Solid Colors */}
        {activeSubTab === 'colors' && (
          <div className="space-y-4">
            {/* Custom color picker */}
            <div className="space-y-2">
              <label className="text-xs font-medium text-muted-foreground">Custom Color</label>
              <div className="flex gap-2">
                <div className="relative">
                  <input
                    type="color"
                    value={customColor}
                    onChange={(e) => {
                      setCustomColor(e.target.value);
                      handleSolidColor(e.target.value);
                    }}
                    className="w-10 h-10 rounded-lg cursor-pointer border-2 border-border"
                  />
                </div>
                <Input
                  value={customColor}
                  onChange={(e) => {
                    setCustomColor(e.target.value);
                    if (/^#[0-9A-Fa-f]{6}$/.test(e.target.value)) {
                      handleSolidColor(e.target.value);
                    }
                  }}
                  className="flex-1 font-mono text-sm"
                  placeholder="#ffffff"
                />
              </div>
            </div>

            {/* Preset colors */}
            <div className="space-y-2">
              <label className="text-xs font-medium text-muted-foreground">Preset Colors</label>
              <div className="grid grid-cols-10 gap-1.5">
                {SOLID_COLORS.map((color) => (
                  <button
                    key={color}
                    onClick={() => handleSolidColor(color)}
                    className={cn(
                      "w-7 h-7 rounded-md border-2 transition-all hover:scale-110",
                      canvas.background?.color === color ? "border-primary ring-2 ring-primary/30" : "border-border/50"
                    )}
                    style={{ backgroundColor: color }}
                    title={color}
                  />
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Gradients */}
        {activeSubTab === 'gradients' && (
          <div className="space-y-4">
            <label className="text-xs font-medium text-muted-foreground">Preset Gradients</label>
            <div className="grid grid-cols-3 gap-3">
              {GRADIENTS.map((gradient) => (
                <button
                  key={gradient.name}
                  onClick={() => handleGradient(gradient.colors)}
                  className="group relative aspect-square rounded-xl overflow-hidden border-2 border-border/50 hover:border-primary transition-all hover:scale-105"
                  style={{
                    background: gradient.colors.length === 2
                      ? `linear-gradient(135deg, ${gradient.colors[0]} 0%, ${gradient.colors[1]} 100%)`
                      : `linear-gradient(135deg, ${gradient.colors[0]} 0%, ${gradient.colors[1]} 50%, ${gradient.colors[2]} 100%)`
                  }}
                >
                  <div className="absolute inset-x-0 bottom-0 bg-black/50 backdrop-blur-sm px-2 py-1">
                    <span className="text-[10px] text-white font-medium">{gradient.name}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Patterns */}
        {activeSubTab === 'patterns' && (
          <div className="space-y-4">
            {/* Pattern color picker */}
            <div className="space-y-2">
              <label className="text-xs font-medium text-muted-foreground">Pattern Color</label>
              <div className="flex gap-2">
                <input
                  type="color"
                  value={patternColor}
                  onChange={(e) => setPatternColor(e.target.value)}
                  className="w-10 h-10 rounded-lg cursor-pointer border-2 border-border"
                />
                <Input
                  type="range"
                  min="0.1"
                  max="1"
                  step="0.1"
                  value={patternOpacity}
                  onChange={(e) => setPatternOpacity(parseFloat(e.target.value))}
                  className="flex-1"
                />
                <span className="text-xs text-muted-foreground w-8">{Math.round(patternOpacity * 100)}%</span>
              </div>
            </div>

            {/* Pattern categories */}
            <div className="flex gap-2 overflow-x-auto pb-2">
              {PATTERN_CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setPatternCategory(cat.id)}
                  className={cn(
                    "px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all",
                    patternCategory === cat.id
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted/50 text-muted-foreground hover:bg-accent"
                  )}
                >
                  {cat.name}
                </button>
              ))}
            </div>

            {/* Pattern grid */}
            <div className="grid grid-cols-3 gap-3">
              {filteredPatterns.map((pattern) => {
                const style = getPatternStyle(pattern, patternColor, '#ffffff', patternOpacity);
                return (
                  <button
                    key={pattern.id}
                    onClick={() => handlePattern(pattern.id)}
                    className="group relative aspect-square rounded-xl overflow-hidden border-2 border-border/50 hover:border-primary transition-all hover:scale-105"
                    style={style}
                  >
                    <div className="absolute inset-x-0 bottom-0 bg-black/50 backdrop-blur-sm px-2 py-1">
                      <span className="text-[10px] text-white font-medium">{pattern.name}</span>
                    </div>
                  </button>
                );
              })}
            </div>

            <p className="text-[10px] text-muted-foreground text-center mt-4">
              Patterns from Hero Patterns (CC BY 4.0)
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

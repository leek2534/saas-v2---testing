"use client";



import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export interface CountdownPreset {
  id: string;
  name: string;
  description: string;
  category: 'modern' | 'classic' | 'minimal' | 'bold' | 'elegant' | 'playful';
  props: {
    // Layout
    layout?: 'horizontal' | 'vertical' | 'grid' | 'compact' | 'circular';
    boxStyle?: 'filled' | 'outlined' | 'glass' | 'shadow' | 'flat' | 'gradient';
    
    // Colors
    backgroundColor?: string;
    backgroundGradient?: {
      type: 'linear' | 'radial';
      angle: number;
      stops: Array<{ color: string; position: number }>;
    };
    numberColor?: string;
    labelColor?: string;
    boxColor?: string;
    borderColor?: string;
    
    // Typography
    numberSize?: number;
    labelSize?: number;
    fontWeight?: string;
    fontFamily?: string;
    
    // Spacing
    gap?: number;
    padding?: number;
    borderRadius?: number;
    borderWidth?: number;
    
    // Effects
    shadow?: string;
    animation?: 'none' | 'pulse' | 'flip' | 'slide' | 'glow';
    showSeparator?: boolean;
    separatorStyle?: ':' | '|' | '·';
  };
  preview: React.ReactNode;
}

export const COUNTDOWN_PRESETS: CountdownPreset[] = [
  // MODERN CATEGORY
  {
    id: 'modern-gradient',
    name: 'Modern Gradient',
    description: 'Vibrant gradient with glass morphism effect',
    category: 'modern',
    props: {
      layout: 'horizontal',
      boxStyle: 'glass',
      backgroundGradient: {
        type: 'linear',
        angle: 135,
        stops: [
          { color: '#667eea', position: 0 },
          { color: '#764ba2', position: 100 },
        ],
      },
      numberColor: '#ffffff',
      labelColor: 'rgba(255, 255, 255, 0.8)',
      numberSize: 48,
      labelSize: 14,
      fontWeight: 'bold',
      gap: 16,
      padding: 24,
      borderRadius: 16,
      shadow: '0 20px 60px rgba(102, 126, 234, 0.4)',
      animation: 'pulse',
    },
    preview: (
      <div className="bg-gradient-to-br from-purple-600 to-purple-800 rounded-2xl p-6 shadow-2xl">
        <div className="flex gap-4 justify-center">
          {['07', '23', '45', '12'].map((num, i) => (
            <div key={i} className="bg-white/20 backdrop-blur-lg rounded-xl p-4 min-w-[70px]">
              <div className="text-3xl font-bold text-white text-center">{num}</div>
              <div className="text-xs text-white/80 text-center mt-1">
                {['Days', 'Hrs', 'Min', 'Sec'][i]}
              </div>
            </div>
          ))}
        </div>
      </div>
    ),
  },
  
  {
    id: 'modern-neon',
    name: 'Neon Glow',
    description: 'Dark theme with neon glow effects',
    category: 'modern',
    props: {
      layout: 'horizontal',
      boxStyle: 'outlined',
      backgroundColor: '#0a0a0a',
      numberColor: '#00ff88',
      labelColor: '#888888',
      borderColor: '#00ff88',
      numberSize: 52,
      labelSize: 12,
      fontWeight: 'extrabold',
      fontFamily: 'monospace',
      gap: 20,
      padding: 20,
      borderRadius: 8,
      borderWidth: 2,
      shadow: '0 0 30px rgba(0, 255, 136, 0.5), inset 0 0 20px rgba(0, 255, 136, 0.1)',
      animation: 'glow',
    },
    preview: (
      <div className="bg-black rounded-lg p-6 shadow-xl">
        <div className="flex gap-5 justify-center">
          {['07', '23', '45', '12'].map((num, i) => (
            <div key={i} className="border-2 border-green-400 rounded-lg p-3 min-w-[65px] shadow-[0_0_20px_rgba(0,255,136,0.4)]">
              <div className="text-3xl font-bold text-green-400 text-center font-mono">{num}</div>
              <div className="text-xs text-gray-500 text-center mt-1">
                {['DAYS', 'HRS', 'MIN', 'SEC'][i]}
              </div>
            </div>
          ))}
        </div>
      </div>
    ),
  },

  // CLASSIC CATEGORY
  {
    id: 'classic-flip',
    name: 'Flip Clock',
    description: 'Traditional flip clock style',
    category: 'classic',
    props: {
      layout: 'horizontal',
      boxStyle: 'shadow',
      backgroundColor: '#1a1a1a',
      numberColor: '#ffffff',
      labelColor: '#999999',
      numberSize: 56,
      labelSize: 13,
      fontWeight: 'bold',
      fontFamily: 'monospace',
      gap: 12,
      padding: 16,
      borderRadius: 4,
      shadow: '0 4px 8px rgba(0, 0, 0, 0.3), inset 0 -2px 0 rgba(0, 0, 0, 0.5)',
      animation: 'flip',
      showSeparator: true,
      separatorStyle: ':',
    },
    preview: (
      <div className="bg-gray-100 rounded-lg p-6">
        <div className="flex gap-3 justify-center items-center">
          {['07', '23', '45', '12'].map((num, i) => (
            <React.Fragment key={i}>
              <div className="bg-gray-900 rounded shadow-lg p-3 min-w-[60px]">
                <div className="text-3xl font-bold text-white text-center font-mono">{num}</div>
                <div className="text-xs text-gray-400 text-center mt-1">
                  {['Days', 'Hrs', 'Min', 'Sec'][i]}
                </div>
              </div>
              {i < 3 && <span className="text-2xl font-bold text-gray-600">:</span>}
            </React.Fragment>
          ))}
        </div>
      </div>
    ),
  },

  {
    id: 'classic-digital',
    name: 'Digital Display',
    description: 'LED digital clock aesthetic',
    category: 'classic',
    props: {
      layout: 'horizontal',
      boxStyle: 'flat',
      backgroundColor: '#000000',
      numberColor: '#ff3333',
      labelColor: '#ff3333',
      numberSize: 48,
      labelSize: 11,
      fontWeight: 'bold',
      fontFamily: 'monospace',
      gap: 8,
      padding: 20,
      borderRadius: 2,
      shadow: 'inset 0 0 20px rgba(255, 51, 51, 0.2)',
      animation: 'none',
      showSeparator: true,
      separatorStyle: ':',
    },
    preview: (
      <div className="bg-black rounded p-6 shadow-inner">
        <div className="flex gap-2 justify-center items-center">
          {['07', '23', '45', '12'].map((num, i) => (
            <React.Fragment key={i}>
              <div className="min-w-[55px]">
                <div className="text-3xl font-bold text-red-500 text-center font-mono">{num}</div>
                <div className="text-[10px] text-red-500 text-center mt-1">
                  {['DAYS', 'HRS', 'MIN', 'SEC'][i]}
                </div>
              </div>
              {i < 3 && <span className="text-2xl font-bold text-red-500/50">:</span>}
            </React.Fragment>
          ))}
        </div>
      </div>
    ),
  },

  // MINIMAL CATEGORY
  {
    id: 'minimal-clean',
    name: 'Clean Minimal',
    description: 'Simple and elegant design',
    category: 'minimal',
    props: {
      layout: 'horizontal',
      boxStyle: 'flat',
      backgroundColor: 'transparent',
      numberColor: '#000000',
      labelColor: '#666666',
      numberSize: 64,
      labelSize: 12,
      fontWeight: 'light',
      fontFamily: 'Inter',
      gap: 32,
      padding: 0,
      borderRadius: 0,
      shadow: 'none',
      animation: 'none',
    },
    preview: (
      <div className="bg-white rounded-lg p-6">
        <div className="flex gap-8 justify-center">
          {['07', '23', '45', '12'].map((num, i) => (
            <div key={i} className="min-w-[60px]">
              <div className="text-4xl font-light text-gray-900 text-center">{num}</div>
              <div className="text-xs text-gray-500 text-center mt-2 uppercase tracking-wide">
                {['Days', 'Hours', 'Minutes', 'Seconds'][i]}
              </div>
            </div>
          ))}
        </div>
      </div>
    ),
  },

  {
    id: 'minimal-dots',
    name: 'Dot Separator',
    description: 'Minimal with dot separators',
    category: 'minimal',
    props: {
      layout: 'horizontal',
      boxStyle: 'flat',
      backgroundColor: 'transparent',
      numberColor: '#1a1a1a',
      labelColor: '#888888',
      numberSize: 56,
      labelSize: 11,
      fontWeight: 'medium',
      gap: 24,
      padding: 0,
      borderRadius: 0,
      shadow: 'none',
      animation: 'none',
      showSeparator: true,
      separatorStyle: '·',
    },
    preview: (
      <div className="bg-gray-50 rounded-lg p-6">
        <div className="flex gap-6 justify-center items-center">
          {['07', '23', '45', '12'].map((num, i) => (
            <React.Fragment key={i}>
              <div className="min-w-[55px]">
                <div className="text-3xl font-medium text-gray-900 text-center">{num}</div>
                <div className="text-[10px] text-gray-500 text-center mt-1 uppercase">
                  {['Days', 'Hrs', 'Min', 'Sec'][i]}
                </div>
              </div>
              {i < 3 && <span className="text-2xl text-gray-400">·</span>}
            </React.Fragment>
          ))}
        </div>
      </div>
    ),
  },

  // BOLD CATEGORY
  {
    id: 'bold-blocks',
    name: 'Bold Blocks',
    description: 'Large colorful blocks',
    category: 'bold',
    props: {
      layout: 'horizontal',
      boxStyle: 'filled',
      boxColor: '#ff6b6b',
      numberColor: '#ffffff',
      labelColor: '#ffffff',
      numberSize: 60,
      labelSize: 14,
      fontWeight: 'black',
      gap: 16,
      padding: 28,
      borderRadius: 12,
      shadow: '0 8px 24px rgba(255, 107, 107, 0.4)',
      animation: 'pulse',
    },
    preview: (
      <div className="bg-gray-100 rounded-lg p-6">
        <div className="flex gap-4 justify-center">
          {['07', '23', '45', '12'].map((num, i) => (
            <div key={i} className="bg-red-500 rounded-xl p-5 min-w-[75px] shadow-lg">
              <div className="text-4xl font-black text-white text-center">{num}</div>
              <div className="text-xs text-white text-center mt-1 font-semibold">
                {['DAYS', 'HRS', 'MIN', 'SEC'][i]}
              </div>
            </div>
          ))}
        </div>
      </div>
    ),
  },

  {
    id: 'bold-urgency',
    name: 'Urgency Alert',
    description: 'High-contrast urgent style',
    category: 'bold',
    props: {
      layout: 'horizontal',
      boxStyle: 'gradient',
      backgroundGradient: {
        type: 'linear',
        angle: 90,
        stops: [
          { color: '#ff0000', position: 0 },
          { color: '#cc0000', position: 100 },
        ],
      },
      numberColor: '#ffff00',
      labelColor: '#ffffff',
      numberSize: 56,
      labelSize: 13,
      fontWeight: 'extrabold',
      gap: 12,
      padding: 24,
      borderRadius: 8,
      shadow: '0 10px 40px rgba(255, 0, 0, 0.5)',
      animation: 'pulse',
    },
    preview: (
      <div className="bg-gray-900 rounded-lg p-6">
        <div className="flex gap-3 justify-center">
          {['07', '23', '45', '12'].map((num, i) => (
            <div key={i} className="bg-gradient-to-b from-red-600 to-red-700 rounded-lg p-4 min-w-[70px] shadow-xl">
              <div className="text-3xl font-extrabold text-yellow-400 text-center">{num}</div>
              <div className="text-xs text-white text-center mt-1 font-bold">
                {['DAYS', 'HRS', 'MIN', 'SEC'][i]}
              </div>
            </div>
          ))}
        </div>
      </div>
    ),
  },

  // ELEGANT CATEGORY
  {
    id: 'elegant-gold',
    name: 'Elegant Gold',
    description: 'Luxurious gold theme',
    category: 'elegant',
    props: {
      layout: 'horizontal',
      boxStyle: 'outlined',
      backgroundColor: '#1a1a1a',
      numberColor: '#d4af37',
      labelColor: '#b8960f',
      borderColor: '#d4af37',
      numberSize: 52,
      labelSize: 12,
      fontWeight: 'semibold',
      fontFamily: 'Georgia',
      gap: 20,
      padding: 24,
      borderRadius: 4,
      borderWidth: 2,
      shadow: '0 8px 32px rgba(212, 175, 55, 0.2)',
      animation: 'none',
    },
    preview: (
      <div className="bg-gray-900 rounded-lg p-6">
        <div className="flex gap-5 justify-center">
          {['07', '23', '45', '12'].map((num, i) => (
            <div key={i} className="border-2 border-yellow-600 rounded p-4 min-w-[65px] bg-gray-900">
              <div className="text-3xl font-semibold text-yellow-600 text-center" style={{fontFamily: 'Georgia'}}>{num}</div>
              <div className="text-xs text-yellow-700 text-center mt-1">
                {['Days', 'Hours', 'Minutes', 'Seconds'][i]}
              </div>
            </div>
          ))}
        </div>
      </div>
    ),
  },

  {
    id: 'elegant-serif',
    name: 'Classic Serif',
    description: 'Timeless serif typography',
    category: 'elegant',
    props: {
      layout: 'horizontal',
      boxStyle: 'flat',
      backgroundColor: '#f8f8f8',
      numberColor: '#2c2c2c',
      labelColor: '#666666',
      numberSize: 64,
      labelSize: 13,
      fontWeight: 'normal',
      fontFamily: 'Georgia',
      gap: 28,
      padding: 16,
      borderRadius: 0,
      shadow: 'none',
      animation: 'none',
    },
    preview: (
      <div className="bg-gray-50 rounded-lg p-6">
        <div className="flex gap-7 justify-center">
          {['07', '23', '45', '12'].map((num, i) => (
            <div key={i} className="min-w-[60px]">
              <div className="text-4xl text-gray-800 text-center" style={{fontFamily: 'Georgia'}}>{num}</div>
              <div className="text-xs text-gray-600 text-center mt-2 uppercase tracking-wider">
                {['Days', 'Hours', 'Minutes', 'Seconds'][i]}
              </div>
            </div>
          ))}
        </div>
      </div>
    ),
  },

  // PLAYFUL CATEGORY
  {
    id: 'playful-rainbow',
    name: 'Rainbow Fun',
    description: 'Colorful and playful',
    category: 'playful',
    props: {
      layout: 'horizontal',
      boxStyle: 'filled',
      numberColor: '#ffffff',
      labelColor: '#ffffff',
      numberSize: 48,
      labelSize: 12,
      fontWeight: 'bold',
      fontFamily: 'Arial',
      gap: 16,
      padding: 20,
      borderRadius: 20,
      shadow: '0 8px 24px rgba(0, 0, 0, 0.15)',
      animation: 'pulse',
    },
    preview: (
      <div className="bg-white rounded-lg p-6">
        <div className="flex gap-4 justify-center">
          {[
            { num: '07', bg: 'bg-pink-500' },
            { num: '23', bg: 'bg-purple-500' },
            { num: '45', bg: 'bg-blue-500' },
            { num: '12', bg: 'bg-green-500' },
          ].map(({ num, bg }, i) => (
            <div key={i} className={`${bg} rounded-2xl p-4 min-w-[65px] shadow-lg`}>
              <div className="text-3xl font-bold text-white text-center">{num}</div>
              <div className="text-xs text-white text-center mt-1 font-semibold">
                {['DAYS', 'HRS', 'MIN', 'SEC'][i]}
              </div>
            </div>
          ))}
        </div>
      </div>
    ),
  },

  {
    id: 'playful-bubble',
    name: 'Bubble Pop',
    description: 'Soft rounded bubbles',
    category: 'playful',
    props: {
      layout: 'horizontal',
      boxStyle: 'filled',
      boxColor: '#ff9ff3',
      numberColor: '#ffffff',
      labelColor: '#ffffff',
      numberSize: 52,
      labelSize: 13,
      fontWeight: 'extrabold',
      fontFamily: 'Arial',
      gap: 20,
      padding: 24,
      borderRadius: 9999,
      shadow: '0 12px 32px rgba(255, 159, 243, 0.4)',
      animation: 'pulse',
    },
    preview: (
      <div className="bg-gradient-to-br from-pink-100 to-purple-100 rounded-lg p-6">
        <div className="flex gap-5 justify-center">
          {['07', '23', '45', '12'].map((num, i) => (
            <div key={i} className="bg-pink-400 rounded-full p-5 min-w-[70px] min-h-[70px] flex flex-col items-center justify-center shadow-xl">
              <div className="text-2xl font-extrabold text-white text-center">{num}</div>
              <div className="text-[9px] text-white text-center mt-1 font-bold">
                {['DAYS', 'HRS', 'MIN', 'SEC'][i]}
              </div>
            </div>
          ))}
        </div>
      </div>
    ),
  },

  // Additional Modern Styles
  {
    id: 'modern-3d',
    name: '3D Effect',
    description: 'Modern 3D depth effect',
    category: 'modern',
    props: {
      layout: 'horizontal',
      boxStyle: 'shadow',
      backgroundColor: '#4a5568',
      numberColor: '#ffffff',
      labelColor: '#cbd5e0',
      numberSize: 56,
      labelSize: 12,
      fontWeight: 'bold',
      gap: 16,
      padding: 24,
      borderRadius: 12,
      shadow: '0 10px 0 #2d3748, 0 15px 30px rgba(0, 0, 0, 0.3)',
      animation: 'none',
    },
    preview: (
      <div className="bg-gray-200 rounded-lg p-6 pt-8">
        <div className="flex gap-4 justify-center">
          {['07', '23', '45', '12'].map((num, i) => (
            <div 
              key={i} 
              className="bg-gray-600 rounded-xl p-4 min-w-[70px] shadow-[0_8px_0_#2d3748,0_12px_24px_rgba(0,0,0,0.3)]"
            >
              <div className="text-3xl font-bold text-white text-center">{num}</div>
              <div className="text-xs text-gray-300 text-center mt-1">
                {['Days', 'Hrs', 'Min', 'Sec'][i]}
              </div>
            </div>
          ))}
        </div>
      </div>
    ),
  },

  {
    id: 'modern-neumorphic',
    name: 'Neumorphic',
    description: 'Soft UI neumorphic design',
    category: 'modern',
    props: {
      layout: 'horizontal',
      boxStyle: 'shadow',
      backgroundColor: '#e0e5ec',
      numberColor: '#2c3e50',
      labelColor: '#7f8c8d',
      numberSize: 52,
      labelSize: 12,
      fontWeight: 'semibold',
      gap: 20,
      padding: 24,
      borderRadius: 20,
      shadow: '8px 8px 16px #b8bec5, -8px -8px 16px #ffffff',
      animation: 'none',
    },
    preview: (
      <div className="bg-gray-200 rounded-lg p-6">
        <div className="flex gap-5 justify-center">
          {['07', '23', '45', '12'].map((num, i) => (
            <div 
              key={i} 
              className="bg-gray-200 rounded-2xl p-4 min-w-[65px]"
              style={{
                boxShadow: '6px 6px 12px #b8bec5, -6px -6px 12px #ffffff'
              }}
            >
              <div className="text-3xl font-semibold text-gray-700 text-center">{num}</div>
              <div className="text-xs text-gray-500 text-center mt-1">
                {['Days', 'Hrs', 'Min', 'Sec'][i]}
              </div>
            </div>
          ))}
        </div>
      </div>
    ),
  },
];

interface CountdownPresetPickerProps {
  value?: string;
  onChange: (preset: CountdownPreset) => void;
  onClose?: () => void;
}

export function CountdownPresetPicker({ value, onChange, onClose }: CountdownPresetPickerProps) {
  const [currentIndex, setCurrentIndex] = React.useState(() => {
    const index = COUNTDOWN_PRESETS.findIndex(p => p.id === value);
    return index >= 0 ? index : 0;
  });
  const [selectedCategory, setSelectedCategory] = React.useState<string>('all');

  const categories = ['all', 'modern', 'classic', 'minimal', 'bold', 'elegant', 'playful'];
  
  const filteredPresets = selectedCategory === 'all' 
    ? COUNTDOWN_PRESETS 
    : COUNTDOWN_PRESETS.filter(p => p.category === selectedCategory);

  const currentPreset = filteredPresets[currentIndex] || filteredPresets[0];

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? filteredPresets.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === filteredPresets.length - 1 ? 0 : prev + 1));
  };

  const handleSelect = () => {
    onChange(currentPreset);
    onClose?.();
  };

  return (
    <div className="space-y-4">
      {/* Category Filter */}
      <div className="flex gap-2 flex-wrap">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => {
              setSelectedCategory(cat);
              setCurrentIndex(0);
            }}
            className={cn(
              "px-3 py-1.5 rounded-lg text-xs font-medium transition-all",
              selectedCategory === cat
                ? "bg-blue-600 text-white shadow-md"
                : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
            )}
          >
            {cat.charAt(0).toUpperCase() + cat.slice(1)}
          </button>
        ))}
      </div>

      {/* Preview Card */}
      <div className="bg-white dark:bg-gray-900 rounded-xl border-2 border-gray-200 dark:border-gray-700 overflow-hidden">
        {/* Preview */}
        <div className="p-6 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900">
          <div className="transform transition-all duration-300 hover:scale-105">
            {currentPreset.preview}
          </div>
        </div>

        {/* Info */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-start justify-between mb-3">
            <div>
              <h3 className="font-semibold text-sm text-gray-900 dark:text-white">
                {currentPreset.name}
              </h3>
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                {currentPreset.description}
              </p>
            </div>
            <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs rounded-md font-medium">
              {currentPreset.category}
            </span>
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between">
            <Button
              variant="outline"
              size="sm"
              onClick={handlePrevious}
              className="h-8"
            >
              <ChevronLeft size={16} className="mr-1" />
              Previous
            </Button>

            <span className="text-xs text-gray-500 dark:text-gray-400">
              {currentIndex + 1} / {filteredPresets.length}
            </span>

            <Button
              variant="outline"
              size="sm"
              onClick={handleNext}
              className="h-8"
            >
              Next
              <ChevronRight size={16} className="ml-1" />
            </Button>
          </div>

          {/* Apply Button */}
          <Button
            onClick={handleSelect}
            className="w-full mt-3"
            size="sm"
          >
            Apply This Style
          </Button>
        </div>
      </div>

      {/* Quick Grid View */}
      <div className="grid grid-cols-3 gap-2 max-h-[200px] overflow-y-auto">
        {filteredPresets.map((preset, index) => (
          <button
            key={preset.id}
            onClick={() => setCurrentIndex(index)}
            className={cn(
              "p-2 rounded-lg border-2 transition-all hover:scale-105",
              currentIndex === index
                ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
            )}
          >
            <div className="transform scale-50 origin-top-left">
              {preset.preview}
            </div>
            <p className="text-[10px] font-medium text-gray-700 dark:text-gray-300 mt-1 truncate">
              {preset.name}
            </p>
          </button>
        ))}
      </div>
    </div>
  );
}

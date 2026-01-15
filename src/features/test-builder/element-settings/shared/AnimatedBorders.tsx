"use client";



import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

export interface BorderStyle {
  id: string;
  name: string;
  description: string;
  category: 'animated' | 'static' | 'neon' | 'gradient' | 'classic';
  cssClass: string;
  preview: React.ReactNode;
  props: {
    borderWidth?: number;
    borderColor?: string;
    borderStyle?: string;
    [key: string]: any;
  };
}

// Border Preview Component
const BorderPreview = ({ 
  borderStyle, 
  className 
}: { 
  borderStyle: BorderStyle; 
  className?: string;
}) => {
  return (
    <div className={cn("relative w-full h-full", className)}>
      <div 
        className={cn(
          "w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 rounded-lg flex items-center justify-center",
          borderStyle.cssClass
        )}
        style={{
          minHeight: '120px',
          minWidth: '120px',
        }}
      >
        <div className="text-xs text-gray-500 dark:text-gray-400 text-center px-2">
          Preview
        </div>
      </div>
    </div>
  );
};

// Animated Border Styles
export const ANIMATED_BORDER_STYLES: BorderStyle[] = [
  {
    id: 'neon-pulse',
    name: 'Neon Pulse',
    description: 'Pulsing neon glow that breathes',
    category: 'neon',
    cssClass: 'border-neon-pulse',
    props: { borderWidth: 3, borderColor: '#00ffff' },
    preview: <BorderPreview borderStyle={{ id: '', name: '', description: '', category: 'neon', cssClass: 'border-neon-pulse', preview: null, props: {} }} />,
  },
  {
    id: 'electric-shock',
    name: 'Electric Shock',
    description: 'Lightning-like energy racing around',
    category: 'animated',
    cssClass: 'border-electric-shock',
    props: { borderWidth: 4, borderColor: '#ff00ff' },
    preview: <BorderPreview borderStyle={{ id: '', name: '', description: '', category: 'animated', cssClass: 'border-electric-shock', preview: null, props: {} }} />,
  },
  {
    id: 'rainbow-rotating',
    name: 'Rainbow Rotating',
    description: 'Rotating rainbow gradient border',
    category: 'animated',
    cssClass: 'border-rainbow-rotating',
    props: { borderWidth: 4 },
    preview: <BorderPreview borderStyle={{ id: '', name: '', description: '', category: 'animated', cssClass: 'border-rainbow-rotating', preview: null, props: {} }} />,
  },
  {
    id: 'neon-trail',
    name: 'Neon Trail',
    description: 'Glowing trail that follows the border',
    category: 'neon',
    cssClass: 'border-neon-trail',
    props: { borderWidth: 3, borderColor: '#00ff00' },
    preview: <BorderPreview borderStyle={{ id: '', name: '', description: '', category: 'neon', cssClass: 'border-neon-trail', preview: null, props: {} }} />,
  },
  {
    id: 'glitch-border',
    name: 'Glitch Border',
    description: 'Digital glitch effect with color shifts',
    category: 'animated',
    cssClass: 'border-glitch',
    props: { borderWidth: 3 },
    preview: <BorderPreview borderStyle={{ id: '', name: '', description: '', category: 'animated', cssClass: 'border-glitch', preview: null, props: {} }} />,
  },
  {
    id: 'particle-flow',
    name: 'Particle Flow',
    description: 'Particles flowing around the border',
    category: 'animated',
    cssClass: 'border-particle-flow',
    props: { borderWidth: 4, borderColor: '#ff6b00' },
    preview: <BorderPreview borderStyle={{ id: '', name: '', description: '', category: 'animated', cssClass: 'border-particle-flow', preview: null, props: {} }} />,
  },
  {
    id: 'holographic',
    name: 'Holographic',
    description: 'Iridescent holographic shimmer',
    category: 'gradient',
    cssClass: 'border-holographic',
    props: { borderWidth: 4 },
    preview: <BorderPreview borderStyle={{ id: '', name: '', description: '', category: 'gradient', cssClass: 'border-holographic', preview: null, props: {} }} />,
  },
  {
    id: 'matrix-rain',
    name: 'Matrix Rain',
    description: 'Digital rain effect on border',
    category: 'animated',
    cssClass: 'border-matrix-rain',
    props: { borderWidth: 3, borderColor: '#00ff41' },
    preview: <BorderPreview borderStyle={{ id: '', name: '', description: '', category: 'animated', cssClass: 'border-matrix-rain', preview: null, props: {} }} />,
  },
  {
    id: 'energy-wave',
    name: 'Energy Wave',
    description: 'Wave of energy circling the border',
    category: 'animated',
    cssClass: 'border-energy-wave',
    props: { borderWidth: 4, borderColor: '#00d4ff' },
    preview: <BorderPreview borderStyle={{ id: '', name: '', description: '', category: 'animated', cssClass: 'border-energy-wave', preview: null, props: {} }} />,
  },
  {
    id: 'neon-outline',
    name: 'Neon Outline',
    description: 'Bright neon outline with glow',
    category: 'neon',
    cssClass: 'border-neon-outline',
    props: { borderWidth: 3, borderColor: '#ff0080' },
    preview: <BorderPreview borderStyle={{ id: '', name: '', description: '', category: 'neon', cssClass: 'border-neon-outline', preview: null, props: {} }} />,
  },
];

// Static Border Styles
export const STATIC_BORDER_STYLES: BorderStyle[] = [
  {
    id: 'solid-classic',
    name: 'Solid Classic',
    description: 'Clean solid border',
    category: 'classic',
    cssClass: 'border-solid',
    props: { borderWidth: 2, borderColor: '#000000', borderStyle: 'solid' },
    preview: <BorderPreview borderStyle={{ id: '', name: '', description: '', category: 'classic', cssClass: 'border-solid', preview: null, props: {} }} />,
  },
  {
    id: 'dashed-modern',
    name: 'Dashed Modern',
    description: 'Modern dashed border',
    category: 'classic',
    cssClass: 'border-dashed',
    props: { borderWidth: 2, borderColor: '#666666', borderStyle: 'dashed' },
    preview: <BorderPreview borderStyle={{ id: '', name: '', description: '', category: 'classic', cssClass: 'border-dashed', preview: null, props: {} }} />,
  },
  {
    id: 'dotted-playful',
    name: 'Dotted Playful',
    description: 'Playful dotted border',
    category: 'classic',
    cssClass: 'border-dotted',
    props: { borderWidth: 2, borderColor: '#999999', borderStyle: 'dotted' },
    preview: <BorderPreview borderStyle={{ id: '', name: '', description: '', category: 'classic', cssClass: 'border-dotted', preview: null, props: {} }} />,
  },
  {
    id: 'double-elegant',
    name: 'Double Elegant',
    description: 'Elegant double border',
    category: 'classic',
    cssClass: 'border-double',
    props: { borderWidth: 4, borderColor: '#333333', borderStyle: 'double' },
    preview: <BorderPreview borderStyle={{ id: '', name: '', description: '', category: 'classic', cssClass: 'border-double', preview: null, props: {} }} />,
  },
  {
    id: 'gradient-sunset',
    name: 'Gradient Sunset',
    description: 'Sunset gradient border',
    category: 'gradient',
    cssClass: 'border-gradient-sunset',
    props: { borderWidth: 4 },
    preview: <BorderPreview borderStyle={{ id: '', name: '', description: '', category: 'gradient', cssClass: 'border-gradient-sunset', preview: null, props: {} }} />,
  },
  {
    id: 'gradient-ocean',
    name: 'Gradient Ocean',
    description: 'Ocean blue gradient',
    category: 'gradient',
    cssClass: 'border-gradient-ocean',
    props: { borderWidth: 4 },
    preview: <BorderPreview borderStyle={{ id: '', name: '', description: '', category: 'gradient', cssClass: 'border-gradient-ocean', preview: null, props: {} }} />,
  },
  {
    id: 'shadow-depth',
    name: 'Shadow Depth',
    description: 'Deep shadow border effect',
    category: 'static',
    cssClass: 'border-shadow-depth',
    props: { borderWidth: 2, borderColor: '#000000' },
    preview: <BorderPreview borderStyle={{ id: '', name: '', description: '', category: 'static', cssClass: 'border-shadow-depth', preview: null, props: {} }} />,
  },
  {
    id: 'glow-soft',
    name: 'Soft Glow',
    description: 'Soft glowing border',
    category: 'static',
    cssClass: 'border-glow-soft',
    props: { borderWidth: 3, borderColor: '#ffffff' },
    preview: <BorderPreview borderStyle={{ id: '', name: '', description: '', category: 'static', cssClass: 'border-glow-soft', preview: null, props: {} }} />,
  },
];

export const ALL_BORDER_STYLES = [...ANIMATED_BORDER_STYLES, ...STATIC_BORDER_STYLES];






import React from 'react';
import { CountdownTimer } from '../elements/CountdownTimer';
import { cn } from '@/lib/utils';

export interface CountdownStylePreset {
  id: string;
  name: string;
  description: string;
  category: 'minimal' | 'modern' | 'classic' | 'bold' | 'elegant' | 'retro';
  props: {
    visualStyle?: 'minimal' | 'boxed' | 'digital' | 'flip' | 'circular';
    backgroundColor?: string;
    numberColor?: string;
    labelColor?: string;
    fontSize?: number;
    labelFontSize?: number;
    fontWeight?: string;
    borderRadius?: number;
    gap?: number;
    showSeparator?: boolean;
    [key: string]: any;
  };
  preview: React.ReactNode;
}

// Calculate preview time (static for preview)
const PREVIEW_TIME = { days: 2, hours: 14, minutes: 30, seconds: 45 };

// Preview component wrapper
const PreviewWrapper = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <div className={cn("flex items-center justify-center p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700", className)}>
    {children}
  </div>
);

// Countdown Style Presets with Visual Previews - Different Visual Styles
export const COUNTDOWN_STYLE_PRESETS: CountdownStylePreset[] = [
  // MINIMAL STYLE
  {
    id: 'minimal-clean',
    name: 'Minimal Clean',
    description: 'Simple text-only countdown',
    category: 'minimal',
    props: {
      visualStyle: 'minimal',
      backgroundColor: 'transparent',
      numberColor: '#111827',
      labelColor: '#6b7280',
      fontSize: 48,
      labelFontSize: 14,
      fontWeight: '600',
      borderRadius: 0,
      gap: 20,
      showSeparator: true,
      countdownType: 'fixed',
      displayFormat: 'full',
    },
    preview: (
      <PreviewWrapper>
        <div className="scale-75 origin-center">
          <CountdownTimer
            visualStyle="minimal"
            backgroundColor="transparent"
            numberColor="#111827"
            labelColor="#6b7280"
            fontSize={48}
            labelFontSize={14}
            fontWeight="600"
            borderRadius={0}
            gap={20}
            showSeparator={true}
            daysLabel="DAYS"
            hoursLabel="HOURS"
            minutesLabel="MINUTES"
            secondsLabel="SECONDS"
            targetDate={new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString()}
            countdownType="fixed"
            displayFormat="full"
          />
        </div>
      </PreviewWrapper>
    ),
  },
  {
    id: 'minimal-dark',
    name: 'Minimal Dark',
    description: 'Dark theme minimal style',
    category: 'minimal',
    props: {
      visualStyle: 'minimal',
      backgroundColor: 'transparent',
      numberColor: '#ffffff',
      labelColor: '#9ca3af',
      fontSize: 48,
      labelFontSize: 14,
      fontWeight: '600',
      borderRadius: 0,
      gap: 20,
      showSeparator: true,
      countdownType: 'fixed',
      displayFormat: 'full',
    },
    preview: (
      <PreviewWrapper className="bg-gray-900">
        <div className="scale-75 origin-center">
          <CountdownTimer
            visualStyle="minimal"
            backgroundColor="transparent"
            numberColor="#ffffff"
            labelColor="#9ca3af"
            fontSize={48}
            labelFontSize={14}
            fontWeight="600"
            borderRadius={0}
            gap={20}
            showSeparator={true}
            daysLabel="DAYS"
            hoursLabel="HOURS"
            minutesLabel="MINUTES"
            secondsLabel="SECONDS"
            targetDate={new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString()}
            countdownType="fixed"
            displayFormat="full"
          />
        </div>
      </PreviewWrapper>
    ),
  },

  // BOXED STYLE
  {
    id: 'boxed-modern',
    name: 'Boxed Modern',
    description: 'Numbers in rounded boxes',
    category: 'modern',
    props: {
      visualStyle: 'boxed',
      backgroundColor: '#ffffff',
      numberColor: '#3b82f6',
      labelColor: '#6b7280',
      fontSize: 48,
      labelFontSize: 12,
      fontWeight: '700',
      borderRadius: 12,
      gap: 16,
      showSeparator: true,
      countdownType: 'fixed',
      displayFormat: 'full',
    },
    preview: (
      <PreviewWrapper>
        <div className="scale-75 origin-center">
          <CountdownTimer
            visualStyle="boxed"
            backgroundColor="#ffffff"
            numberColor="#3b82f6"
            labelColor="#6b7280"
            fontSize={48}
            labelFontSize={12}
            fontWeight="700"
            borderRadius={12}
            gap={16}
            showSeparator={true}
            daysLabel="DAYS"
            hoursLabel="HOURS"
            minutesLabel="MINUTES"
            secondsLabel="SECONDS"
            targetDate={new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString()}
            countdownType="fixed"
            displayFormat="full"
          />
        </div>
      </PreviewWrapper>
    ),
  },
  {
    id: 'boxed-bold',
    name: 'Boxed Bold',
    description: 'Bold colored boxes',
    category: 'bold',
    props: {
      visualStyle: 'boxed',
      backgroundColor: '#dc2626',
      numberColor: '#ffffff',
      labelColor: '#fecaca',
      fontSize: 52,
      labelFontSize: 13,
      fontWeight: '800',
      borderRadius: 10,
      gap: 18,
      showSeparator: true,
      countdownType: 'fixed',
      displayFormat: 'full',
    },
    preview: (
      <PreviewWrapper>
        <div className="scale-75 origin-center">
          <CountdownTimer
            visualStyle="boxed"
            backgroundColor="#dc2626"
            numberColor="#ffffff"
            labelColor="#fecaca"
            fontSize={52}
            labelFontSize={13}
            fontWeight="800"
            borderRadius={10}
            gap={18}
            showSeparator={true}
            daysLabel="DAYS"
            hoursLabel="HOURS"
            minutesLabel="MINUTES"
            secondsLabel="SECONDS"
            targetDate={new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString()}
            countdownType="fixed"
            displayFormat="full"
          />
        </div>
      </PreviewWrapper>
    ),
  },

  // DIGITAL STYLE
  {
    id: 'digital-led',
    name: 'Digital LED',
    description: 'LED digital display style',
    category: 'retro',
    props: {
      visualStyle: 'digital',
      backgroundColor: '#000000',
      numberColor: '#00ff00',
      labelColor: '#00cc00',
      fontSize: 56,
      labelFontSize: 14,
      fontWeight: '700',
      borderRadius: 8,
      gap: 20,
      showSeparator: true,
      countdownType: 'fixed',
      displayFormat: 'full',
    },
    preview: (
      <PreviewWrapper className="bg-gray-900">
        <div className="scale-75 origin-center">
          <CountdownTimer
            visualStyle="digital"
            backgroundColor="#000000"
            numberColor="#00ff00"
            labelColor="#00cc00"
            fontSize={56}
            labelFontSize={14}
            fontWeight="700"
            borderRadius={8}
            gap={20}
            showSeparator={true}
            daysLabel="DAYS"
            hoursLabel="HOURS"
            minutesLabel="MINUTES"
            secondsLabel="SECONDS"
            targetDate={new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString()}
            countdownType="fixed"
            displayFormat="full"
          />
        </div>
      </PreviewWrapper>
    ),
  },
  {
    id: 'digital-red',
    name: 'Digital Red',
    description: 'Red LED digital clock',
    category: 'retro',
    props: {
      visualStyle: 'digital',
      backgroundColor: '#1a0000',
      numberColor: '#ff0000',
      labelColor: '#cc0000',
      fontSize: 54,
      labelFontSize: 13,
      fontWeight: '700',
      borderRadius: 6,
      gap: 18,
      showSeparator: true,
      countdownType: 'fixed',
      displayFormat: 'full',
    },
    preview: (
      <PreviewWrapper className="bg-gray-900">
        <div className="scale-75 origin-center">
          <CountdownTimer
            visualStyle="digital"
            backgroundColor="#1a0000"
            numberColor="#ff0000"
            labelColor="#cc0000"
            fontSize={54}
            labelFontSize={13}
            fontWeight="700"
            borderRadius={6}
            gap={18}
            showSeparator={true}
            daysLabel="DAYS"
            hoursLabel="HOURS"
            minutesLabel="MINUTES"
            secondsLabel="SECONDS"
            targetDate={new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString()}
            countdownType="fixed"
            displayFormat="full"
          />
        </div>
      </PreviewWrapper>
    ),
  },

  // FLIP STYLE
  {
    id: 'flip-classic',
    name: 'Flip Clock',
    description: 'Classic flip card animation',
    category: 'classic',
    props: {
      visualStyle: 'flip',
      backgroundColor: '#1f2937',
      numberColor: '#ffffff',
      labelColor: '#9ca3af',
      fontSize: 48,
      labelFontSize: 12,
      fontWeight: '700',
      borderRadius: 8,
      gap: 16,
      showSeparator: true,
      countdownType: 'fixed',
      displayFormat: 'full',
    },
    preview: (
      <PreviewWrapper className="bg-gray-900">
        <div className="scale-75 origin-center">
          <CountdownTimer
            visualStyle="flip"
            backgroundColor="#1f2937"
            numberColor="#ffffff"
            labelColor="#9ca3af"
            fontSize={48}
            labelFontSize={12}
            fontWeight="700"
            borderRadius={8}
            gap={16}
            showSeparator={true}
            daysLabel="DAYS"
            hoursLabel="HOURS"
            minutesLabel="MINUTES"
            secondsLabel="SECONDS"
            targetDate={new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString()}
            countdownType="fixed"
            displayFormat="full"
          />
        </div>
      </PreviewWrapper>
    ),
  },
  {
    id: 'flip-modern',
    name: 'Flip Modern',
    description: 'Modern flip cards with color',
    category: 'modern',
    props: {
      visualStyle: 'flip',
      backgroundColor: '#3b82f6',
      numberColor: '#ffffff',
      labelColor: '#dbeafe',
      fontSize: 50,
      labelFontSize: 12,
      fontWeight: '700',
      borderRadius: 10,
      gap: 18,
      showSeparator: true,
      countdownType: 'fixed',
      displayFormat: 'full',
    },
    preview: (
      <PreviewWrapper>
        <div className="scale-75 origin-center">
          <CountdownTimer
            visualStyle="flip"
            backgroundColor="#3b82f6"
            numberColor="#ffffff"
            labelColor="#dbeafe"
            fontSize={50}
            labelFontSize={12}
            fontWeight="700"
            borderRadius={10}
            gap={18}
            showSeparator={true}
            daysLabel="DAYS"
            hoursLabel="HOURS"
            minutesLabel="MINUTES"
            secondsLabel="SECONDS"
            targetDate={new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString()}
            countdownType="fixed"
            displayFormat="full"
          />
        </div>
      </PreviewWrapper>
    ),
  },

  // CIRCULAR STYLE
  {
    id: 'circular-elegant',
    name: 'Circular Elegant',
    description: 'Circular progress rings',
    category: 'elegant',
    props: {
      visualStyle: 'circular',
      backgroundColor: 'transparent',
      numberColor: '#1f2937',
      labelColor: '#6b7280',
      fontSize: 40,
      labelFontSize: 12,
      fontWeight: '600',
      borderRadius: 0,
      gap: 20,
      showSeparator: false,
      countdownType: 'fixed',
      displayFormat: 'full',
    },
    preview: (
      <PreviewWrapper>
        <div className="scale-75 origin-center">
          <CountdownTimer
            visualStyle="circular"
            backgroundColor="transparent"
            numberColor="#1f2937"
            labelColor="#6b7280"
            fontSize={40}
            labelFontSize={12}
            fontWeight="600"
            borderRadius={0}
            gap={20}
            showSeparator={false}
            daysLabel="DAYS"
            hoursLabel="HOURS"
            minutesLabel="MINUTES"
            secondsLabel="SECONDS"
            targetDate={new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString()}
            countdownType="fixed"
            displayFormat="full"
          />
        </div>
      </PreviewWrapper>
    ),
  },
  {
    id: 'circular-modern',
    name: 'Circular Modern',
    description: 'Modern circular progress',
    category: 'modern',
    props: {
      visualStyle: 'circular',
      backgroundColor: 'transparent',
      numberColor: '#3b82f6',
      labelColor: '#6b7280',
      fontSize: 42,
      labelFontSize: 13,
      fontWeight: '700',
      borderRadius: 0,
      gap: 24,
      showSeparator: false,
      countdownType: 'fixed',
      displayFormat: 'full',
    },
    preview: (
      <PreviewWrapper>
        <div className="scale-75 origin-center">
          <CountdownTimer
            visualStyle="circular"
            backgroundColor="transparent"
            numberColor="#3b82f6"
            labelColor="#6b7280"
            fontSize={42}
            labelFontSize={13}
            fontWeight="700"
            borderRadius={0}
            gap={24}
            showSeparator={false}
            daysLabel="DAYS"
            hoursLabel="HOURS"
            minutesLabel="MINUTES"
            secondsLabel="SECONDS"
            targetDate={new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString()}
            countdownType="fixed"
            displayFormat="full"
          />
        </div>
      </PreviewWrapper>
    ),
  },
];


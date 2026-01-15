import { forwardRef } from 'react';
import { cn } from '@/lib/utils';
import { Monitor, Tablet, Smartphone } from 'lucide-react';

// Standard viewport sizes based on 2025 web design standards
export const VIEWPORT_SIZES = {
  mobile: { width: '375px', minWidth: '375px', maxWidth: undefined, label: 'Mobile · 375px' },
  tablet: { width: '768px', minWidth: '768px', maxWidth: undefined, label: 'Tablet · 768px' },
  desktop: { width: '100%', minWidth: '320px', maxWidth: '1440px', label: 'Desktop · 1440px' },
} as const;

export type ViewportType = keyof typeof VIEWPORT_SIZES;

interface CanvasViewportProps {
  viewport: ViewportType;
  viewMode: 'edit' | 'preview';
  children: React.ReactNode;
}

/**
 * CanvasViewport - Handles viewport sizing and indicator badge
 * Wraps the canvas content with proper width constraints
 */
export const CanvasViewport = forwardRef<HTMLDivElement, CanvasViewportProps>(
  ({ viewport, viewMode, children }, ref) => {
    const sizes = VIEWPORT_SIZES[viewport];

    return (
      <div
        ref={ref}
        className={cn(
          "mx-auto transition-all duration-300 ease-in-out overflow-x-hidden relative",
          viewMode === 'edit' && "pb-8"
        )}
        style={{
          width: sizes.width,
          maxWidth: viewport === 'desktop' ? sizes.maxWidth : undefined,
          minWidth: sizes.minWidth,
        }}
      >
        {/* Viewport Indicator Badge */}
        {viewMode === 'edit' && (
          <ViewportIndicator viewport={viewport} />
        )}

        {children}
      </div>
    );
  }
);

CanvasViewport.displayName = 'CanvasViewport';

/**
 * ViewportIndicator - Shows current viewport size with icon
 */
function ViewportIndicator({ viewport }: { viewport: ViewportType }) {
  const config = {
    mobile: { icon: Smartphone, colors: 'bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-900/30 dark:text-orange-300 dark:border-orange-800' },
    tablet: { icon: Tablet, colors: 'bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-900/30 dark:text-purple-300 dark:border-purple-800' },
    desktop: { icon: Monitor, colors: 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800' },
  };

  const { icon: Icon, colors } = config[viewport];
  const label = VIEWPORT_SIZES[viewport].label;

  return (
    <div className="flex items-center justify-center mb-4">
      <div className={cn(
        "flex items-center gap-2 px-4 py-2 rounded-full font-medium text-xs shadow-sm border transition-all",
        colors
      )}>
        <Icon size={14} />
        <span className="font-mono">{label}</span>
      </div>
    </div>
  );
}

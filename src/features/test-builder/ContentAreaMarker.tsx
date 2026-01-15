

import React from 'react';
import { useTestBuilderV2Store } from './store';
import { cn } from '@/lib/utils';

/**
 * ContentAreaMarker - Visual guide showing non-visible areas that will be cut off
 * Displays shaded areas on left/right that won't be visible on the selected viewport
 */
export function ContentAreaMarker() {
  const { sections, viewMode, viewport } = useTestBuilderV2Store();

  // Only show in edit mode
  if (viewMode !== 'edit') return null;

  // Get viewport width based on current viewport setting
  const getViewportWidth = () => {
    return viewport === 'mobile' ? 375 :
           viewport === 'tablet' ? 768 :
           1920; // Desktop - use a reasonable max width
  };

  // Get the most common section width or default
  const getContentAreaWidth = () => {
    if (sections.length === 0) {
      return viewport === 'mobile' ? 375 :
             viewport === 'tablet' ? 768 :
             960; // Standard desktop content area
    }

    // Find the most common section maxWidth
    const sectionWidths = sections
      .map(section => {
        const maxWidth = section.props.maxWidth || 
          (section.props.containerType === 'full-width' ? '100%' : 
           section.props.containerType === 'wide' ? '1280px' :
           section.props.containerType === 'standard' ? '960px' :
           section.props.containerType === 'medium' ? '1024px' :
           section.props.containerType === 'small' || section.props.containerType === 'narrow' ? '768px' : '960px');
        return maxWidth;
      })
      .filter(w => w !== '100%'); // Exclude full-width sections

    if (sectionWidths.length === 0) {
      return 960; // Default
    }

    // Return the most common width, or default
    const counts: Record<string, number> = {};
    sectionWidths.forEach(w => {
      counts[w] = (counts[w] || 0) + 1;
    });
    const mostCommon = Object.entries(counts).sort((a, b) => b[1] - a[1])[0];
    return mostCommon ? parseInt(mostCommon[0]) : 960;
  };

  const contentWidth = getContentAreaWidth();
  const viewportWidth = getViewportWidth();
  
  // Don't show marker for full-width sections or if content fits viewport
  if (contentWidth === 0 || contentWidth <= viewportWidth) return null;

  // Calculate non-visible areas
  const totalWidth = contentWidth;
  const visibleWidth = Math.min(totalWidth, viewportWidth);
  const nonVisibleWidth = (totalWidth - visibleWidth) / 2;

  // Only show if there are non-visible areas
  if (nonVisibleWidth <= 0) return null;

  return (
    <div 
      className="absolute inset-0 pointer-events-none z-[5]"
      style={{
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
      }}
    >
      {/* Left non-visible area (shaded) */}
      <div
        className="absolute top-0 bottom-0 bg-red-500/20 border-r-2 border-dashed border-red-500"
        style={{
          left: `calc(50% - ${totalWidth / 2}px)`,
          width: `${nonVisibleWidth}px`,
          boxShadow: 'inset 0 0 20px rgba(239, 68, 68, 0.3)',
        }}
      >
        {/* Label */}
        <div className="absolute top-4 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded whitespace-nowrap font-mono shadow-lg z-10">
          ⚠️ Hidden
        </div>
      </div>

      {/* Right non-visible area (shaded) */}
      <div
        className="absolute top-0 bottom-0 bg-red-500/20 border-l-2 border-dashed border-red-500"
        style={{
          left: `calc(50% + ${totalWidth / 2}px - ${nonVisibleWidth}px)`,
          width: `${nonVisibleWidth}px`,
          boxShadow: 'inset 0 0 20px rgba(239, 68, 68, 0.3)',
        }}
      >
        {/* Label */}
        <div className="absolute top-4 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded whitespace-nowrap font-mono shadow-lg z-10">
          ⚠️ Hidden
        </div>
      </div>

      {/* Top indicator bar showing visible area */}
      <div
        className="absolute top-0 h-1 bg-gradient-to-r from-red-500/40 via-green-400/40 to-red-500/40"
        style={{
          left: `calc(50% - ${totalWidth / 2}px)`,
          width: `${totalWidth}px`,
        }}
      >
        {/* Width label */}
        <div className="absolute top-3 left-1/2 -translate-x-1/2 bg-red-500 text-white text-xs px-3 py-1.5 rounded-full whitespace-nowrap font-mono font-semibold shadow-lg border-2 border-red-300">
          👁️ Visible: {viewportWidth}px | Content: {contentWidth}px
        </div>
      </div>

      {/* Bottom indicator bar */}
      <div
        className="absolute bottom-0 h-1 bg-gradient-to-r from-red-500/40 via-green-400/40 to-red-500/40"
        style={{
          left: `calc(50% - ${totalWidth / 2}px)`,
          width: `${totalWidth}px`,
        }}
      />

      {/* Visible area indicator (green border) */}
      <div
        className="absolute top-0 bottom-0 border-l-2 border-r-2 border-green-500"
        style={{
          left: `calc(50% - ${visibleWidth / 2}px)`,
          width: `${visibleWidth}px`,
          pointerEvents: 'none',
        }}
      />
    </div>
  );
}


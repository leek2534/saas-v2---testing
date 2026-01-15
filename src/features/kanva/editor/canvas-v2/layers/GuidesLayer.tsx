/**
 * Guides Layer
 * 
 * Renders visual guides:
 * - Snap guides during drag/resize
 * - Grid overlay (optional)
 * - Ruler guides (future)
 */

'use client';

import React, { memo } from 'react';
import type { SnapGuide } from '../types';

// ============================================
// TYPES
// ============================================

export interface GuidesLayerProps {
  guides: SnapGuide[];
  canvasWidth: number;
  canvasHeight: number;
  showGrid?: boolean;
  gridSize?: number;
}

// ============================================
// SNAP GUIDE COMPONENT
// ============================================

interface SnapGuideLineProps {
  guide: SnapGuide;
  canvasWidth: number;
  canvasHeight: number;
}

const SnapGuideLine = memo<SnapGuideLineProps>(({ guide, canvasWidth, canvasHeight }) => {
  const isVertical = guide.orientation === 'vertical';
  
  const style: React.CSSProperties = isVertical
    ? {
        position: 'absolute',
        left: guide.position,
        top: 0,
        width: 1,
        height: canvasHeight,
        backgroundColor: guide.type === 'center' ? '#f59e0b' : '#3b82f6',
        pointerEvents: 'none',
        zIndex: 1000,
      }
    : {
        position: 'absolute',
        left: 0,
        top: guide.position,
        width: canvasWidth,
        height: 1,
        backgroundColor: guide.type === 'center' ? '#f59e0b' : '#3b82f6',
        pointerEvents: 'none',
        zIndex: 1000,
      };

  return (
    <div style={style}>
      {/* Label for distribution guides */}
      {guide.label && (
        <div
          className="absolute bg-blue-500 text-white text-xs px-1 rounded"
          style={{
            ...(isVertical
              ? { top: '50%', left: 4, transform: 'translateY(-50%)' }
              : { left: '50%', top: 4, transform: 'translateX(-50%)' }
            ),
          }}
        >
          {guide.label}
        </div>
      )}
    </div>
  );
});

SnapGuideLine.displayName = 'SnapGuideLine';

// ============================================
// GRID OVERLAY
// ============================================

interface GridOverlayProps {
  width: number;
  height: number;
  gridSize: number;
}

const GridOverlay = memo<GridOverlayProps>(({ width, height, gridSize }) => {
  return (
    <svg
      className="absolute inset-0 pointer-events-none"
      width={width}
      height={height}
      style={{ opacity: 0.3 }}
    >
      <defs>
        <pattern
          id="grid-pattern"
          width={gridSize}
          height={gridSize}
          patternUnits="userSpaceOnUse"
        >
          <path
            d={`M ${gridSize} 0 L 0 0 0 ${gridSize}`}
            fill="none"
            stroke="#e5e7eb"
            strokeWidth="0.5"
          />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#grid-pattern)" />
    </svg>
  );
});

GridOverlay.displayName = 'GridOverlay';

// ============================================
// GUIDES LAYER
// ============================================

export const GuidesLayer = memo<GuidesLayerProps>(({
  guides,
  canvasWidth,
  canvasHeight,
  showGrid = false,
  gridSize = 20,
}) => {
  return (
    <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 999 }}>
      {/* Grid overlay */}
      {showGrid && (
        <GridOverlay
          width={canvasWidth}
          height={canvasHeight}
          gridSize={gridSize}
        />
      )}
      
      {/* Snap guides */}
      {guides.map((guide, index) => (
        <SnapGuideLine
          key={`guide-${index}-${guide.orientation}-${guide.position}`}
          guide={guide}
          canvasWidth={canvasWidth}
          canvasHeight={canvasHeight}
        />
      ))}
    </div>
  );
});

GuidesLayer.displayName = 'GuidesLayer';

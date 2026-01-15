'use client';

import React from 'react';
import type { Guide } from '../../lib/editor/snapEnhanced';

interface EnhancedAlignmentGuidesProps {
  activeGuides: Guide[];
  canvasRect?: { left: number; top: number; width: number; height: number };
  badge?: { x: number; y: number; text: string } | null;
}

/**
 * EnhancedAlignmentGuides - Professional Canva-style alignment guides
 * 
 * Features:
 * - Vertical and horizontal guide lines
 * - Labels for canvas guides
 * - Alignment badges showing snap type
 * - Smooth animations
 * - Different colors for canvas vs element guides
 * 
 * IMPORTANT: Guide positions are in canvas coordinate space.
 * This component renders within the Artboard, so positions are relative to canvas origin.
 */
export function EnhancedAlignmentGuides({
  activeGuides,
  canvasRect,
  badge,
}: EnhancedAlignmentGuidesProps) {
  if (!activeGuides || activeGuides.length === 0) return null;

  return (
    <div className="absolute inset-0 pointer-events-none z-[1500]">
      {/* Render guide lines */}
      {activeGuides.map((guide, index) => {
        const isCanvasGuide = guide.source === 'canvas';
        const guideColor = isCanvasGuide ? 'bg-cyan-400' : 'bg-yellow-400';
        const labelBg = isCanvasGuide ? 'bg-cyan-600' : 'bg-yellow-600';

        if (guide.type === 'v') {
          // Vertical guide
          return (
            <div
              key={guide.id + index}
              className={`absolute top-0 h-full w-0.5 ${guideColor} opacity-80 transition-opacity duration-200`}
              style={{
                left: `${guide.pos}px`,
                transform: 'translateX(-0.5px)',
                boxShadow: isCanvasGuide
                  ? '0 0 8px rgba(34, 211, 238, 0.6)'
                  : '0 0 8px rgba(250, 204, 21, 0.6)',
              }}
            >
              {/* Label for canvas guides */}
              {guide.label && isCanvasGuide && (
                <div
                  className={`absolute top-2 left-2 ${labelBg} text-white text-xs px-2 py-0.5 rounded font-medium whitespace-nowrap shadow-lg`}
                  style={{
                    transform: 'translateX(4px)',
                  }}
                >
                  {guide.label}
                </div>
              )}
            </div>
          );
        } else {
          // Horizontal guide
          return (
            <div
              key={guide.id + index}
              className={`absolute left-0 w-full h-0.5 ${guideColor} opacity-80 transition-opacity duration-200`}
              style={{
                top: `${guide.pos}px`,
                transform: 'translateY(-0.5px)',
                boxShadow: isCanvasGuide
                  ? '0 0 8px rgba(34, 211, 238, 0.6)'
                  : '0 0 8px rgba(250, 204, 21, 0.6)',
              }}
            >
              {/* Label for canvas guides */}
              {guide.label && isCanvasGuide && (
                <div
                  className={`absolute left-2 ${labelBg} text-white text-xs px-2 py-0.5 rounded font-medium whitespace-nowrap shadow-lg`}
                  style={{
                    top: '-24px',
                  }}
                >
                  {guide.label}
                </div>
              )}
            </div>
          );
        }
      })}

      {/* Alignment badge */}
      {badge && (
        <div
          className="absolute bg-primary text-primary-foreground text-xs px-2 py-1 rounded-md font-semibold shadow-lg animate-in fade-in zoom-in duration-150"
          style={{
            left: badge.x > 0 ? `${badge.x + 12}px` : '50%',
            top: badge.y > 0 ? `${badge.y + 12}px` : '50%',
            transform:
              badge.x === 0 && badge.y === 0
                ? 'translate(-50%, -50%)'
                : badge.x === 0
                ? 'translateX(-50%)'
                : badge.y === 0
                ? 'translateY(-50%)'
                : 'none',
          }}
        >
          {formatBadgeText(badge.text)}
        </div>
      )}
    </div>
  );
}

/**
 * Format badge text for better readability
 */
function formatBadgeText(text: string): string {
  const map: Record<string, string> = {
    left: '← Left',
    right: 'Right →',
    top: '↑ Top',
    bottom: 'Bottom ↓',
    centerX: '↔ Center X',
    centerY: '↕ Center Y',
  };

  // Handle combined alignments (e.g., "centerX + centerY")
  if (text.includes('+')) {
    const parts = text.split('+').map((p) => p.trim());
    return parts.map((p) => map[p] || p).join(' + ');
  }

  return map[text] || text;
}

/**
 * Example usage:
 * 
 * const [activeGuides, setActiveGuides] = useState<Guide[]>([]);
 * const [badge, setBadge] = useState<{ x: number; y: number; text: string } | null>(null);
 * 
 * // During drag:
 * const snap = computeSnap(canvasRect, elements, movingBounds, excludeIds, 8);
 * setActiveGuides(snap.activeGuides);
 * setBadge(snap.badge);
 * 
 * // Render:
 * <EnhancedAlignmentGuides
 *   activeGuides={activeGuides}
 *   canvasRect={canvasRect}
 *   badge={badge}
 * />
 */

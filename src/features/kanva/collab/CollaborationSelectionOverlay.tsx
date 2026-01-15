/**
 * Collaboration Selection Overlay
 * Shows colored borders around elements that other users have selected
 */

'use client';

import { useOthers } from '@liveblocks/react';
import { useEditorStore } from '../lib/editor/store';
import type { CanvasPresence } from './presence';

export function CollaborationSelectionOverlay() {
  const others = useOthers();
  const elements = useEditorStore((state) => state.elements);
  const canvas = useEditorStore((state) => state.canvas);

  return (
    <>
      {others.map(({ connectionId, presence }) => {
        const p = presence as unknown as CanvasPresence;
        if (!p?.selection || p.selection.length === 0) return null;

        return p.selection.map((elementId: string) => {
          const element = elements.find(el => el.id === elementId);
          if (!element) return null;

          return (
            <div
              key={`${connectionId}-${elementId}`}
              className="pointer-events-none absolute"
              style={{
                left: element.x,
                top: element.y,
                width: element.width || 100,
                height: element.height || 100,
                border: `2px solid ${p.color || '#3b82f6'}`,
                borderRadius: '4px',
                boxShadow: `0 0 0 1px ${p.color || '#3b82f6'}20, 0 4px 12px ${p.color || '#3b82f6'}30`,
                transition: 'left 120ms ease-out, top 120ms ease-out, width 120ms ease-out, height 120ms ease-out',
                willChange: 'left, top, width, height',
              }}
            >
              {/* User name badge */}
              <div
                className="absolute -top-6 left-0 flex items-center gap-1 whitespace-nowrap rounded px-1.5 py-0.5 text-[10px] font-medium text-white shadow-sm"
                style={{ backgroundColor: p.color || '#3b82f6' }}
              >
                <span className="inline-block h-1.5 w-1.5 rounded-full bg-white/80 animate-pulse" />
                {p.name || 'Anonymous'}
              </div>
            </div>
          );
        });
      })}
    </>
  );
}

/**
 * Presence Indicators
 * Shows live cursors and user avatars for collaboration
 */

'use client';

import { useOthers, useUpdateMyPresence, useRoom } from '@liveblocks/react';
import { useEffect, useCallback, useState } from 'react';
import { getUserInitials, type CanvasPresence } from './presence';

/**
 * Live Cursors - Shows other users' cursor positions on the canvas
 */
export function LiveCursors() {
  const others = useOthers();

  return (
    <>
      {others.map(({ connectionId, presence }) => {
        const p = presence as unknown as CanvasPresence;
        if (!p?.cursor) return null;
        
        return (
          <div
            key={connectionId}
            className="pointer-events-none absolute z-[9999]"
            style={{
              transform: `translate3d(${p.cursor.x}px, ${p.cursor.y}px, 0)`,
              transition: 'transform 80ms cubic-bezier(0.22, 1, 0.36, 1)',
              willChange: 'transform',
            }}
          >
            {/* Cursor SVG */}
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              style={{
                filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.3))',
              }}
            >
              <path
                d="M5.65376 12.4563L12.9998 3L12.9998 21L5.65376 12.4563Z"
                fill={p.color || '#3b82f6'}
                stroke="white"
                strokeWidth="1.5"
              />
            </svg>
            
            {/* User name label */}
            <div
              className="absolute left-4 top-4 whitespace-nowrap rounded px-2 py-1 text-xs font-medium text-white shadow-md"
              style={{ backgroundColor: p.color || '#3b82f6' }}
            >
              {p.name || 'Anonymous'}
            </div>
          </div>
        );
      })}
    </>
  );
}

/**
 * Hook to track and broadcast cursor position
 */
export function useCursorTracking(containerRef: React.RefObject<HTMLElement>) {
  const updateMyPresence = useUpdateMyPresence();

  const handlePointerMove = useCallback(
    (e: PointerEvent) => {
      if (!containerRef.current) return;
      
      const rect = containerRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      updateMyPresence({ cursor: { x, y } });
    },
    [updateMyPresence, containerRef]
  );

  const handlePointerLeave = useCallback(() => {
    updateMyPresence({ cursor: null });
  }, [updateMyPresence]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    container.addEventListener('pointermove', handlePointerMove);
    container.addEventListener('pointerleave', handlePointerLeave);

    return () => {
      container.removeEventListener('pointermove', handlePointerMove);
      container.removeEventListener('pointerleave', handlePointerLeave);
    };
  }, [containerRef, handlePointerMove, handlePointerLeave]);
}

/**
 * Collaborators List - Shows avatars of all users in the room
 * Uses useRoom to check connection status and force re-renders
 */
export function CollaboratorsList() {
  const others = useOthers();
  const room = useRoom();
  const [, forceUpdate] = useState(0);
  
  // Subscribe to room status changes to force re-renders
  useEffect(() => {
    const unsubscribe = room.subscribe('others', () => {
      forceUpdate(n => n + 1);
    });
    return unsubscribe;
  }, [room]);

  if (others.length === 0) {
    return (
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
        Only you
      </div>
    );
  }

  return (
    <div className="flex items-center gap-1">
      {/* Show up to 4 avatars */}
      {others.slice(0, 4).map(({ connectionId, presence }) => {
        const p = presence as unknown as CanvasPresence;
        return (
          <div
            key={connectionId}
            className="relative flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold text-white shadow-sm ring-2 ring-background transition-all duration-200"
            style={{ backgroundColor: p?.color || '#3b82f6' }}
            title={p?.name || 'Anonymous'}
          >
            {getUserInitials(p?.name || 'A')}
            {/* Online indicator */}
            <div className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-green-500 ring-2 ring-background" />
          </div>
        );
      })}
      
      {/* Show +N if more than 4 */}
      {others.length > 4 && (
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-xs font-medium text-muted-foreground ring-2 ring-background">
          +{others.length - 4}
        </div>
      )}
      
      {/* Count label */}
      <span className="ml-2 text-xs text-muted-foreground">
        {others.length} other{others.length !== 1 ? 's' : ''} editing
      </span>
    </div>
  );
}

/**
 * Selection Highlights - Shows which elements other users have selected
 */
export function SelectionHighlights() {
  const others = useOthers();

  return (
    <>
      {others.map(({ connectionId, presence }) => {
        const p = presence as unknown as CanvasPresence;
        if (!p?.selection || p.selection.length === 0) return null;
        
        return p.selection.map((elementId: string) => (
          <div
            key={`${connectionId}-${elementId}`}
            data-collab-selection={elementId}
            className="pointer-events-none absolute"
            style={{
              outline: `2px solid ${p.color || '#3b82f6'}`,
              outlineOffset: '2px',
            }}
          >
            <div
              className="absolute -top-6 left-0 whitespace-nowrap rounded px-1.5 py-0.5 text-[10px] font-medium text-white"
              style={{ backgroundColor: p.color || '#3b82f6' }}
            >
              {p.name || 'Anonymous'}
            </div>
          </div>
        ));
      })}
    </>
  );
}

/**
 * Wrapper component that provides cursor tracking for a container
 */
export function CursorTrackingArea({ 
  children, 
  className = '' 
}: { 
  children: React.ReactNode;
  className?: string;
}) {
  const updateMyPresence = useUpdateMyPresence();

  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      updateMyPresence({ cursor: { x, y } });
    },
    [updateMyPresence]
  );

  const handlePointerLeave = useCallback(() => {
    updateMyPresence({ cursor: null });
  }, [updateMyPresence]);

  return (
    <div
      className={`relative ${className}`}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
    >
      {children}
      <LiveCursors />
    </div>
  );
}

/**
 * Kanva Stage with Collaboration Features
 * Example showing how to add cursors, selections, and presence tracking
 */

'use client';

import { useMemo } from 'react';
import { Stage, Layer } from 'react-konva';
import { useOthers, useUpdateMyPresence } from '@liveblocks/react';
import { throttle } from 'lodash';
import { RemoteCursors } from './components/RemoteCursors';
import { RemoteSelections } from './components/RemoteSelections';

interface KanvaStageWithCollaborationProps {
  width: number;
  height: number;
  children: React.ReactNode;
}

/**
 * Drop-in replacement for your Konva Stage that adds collaboration
 * 
 * Usage:
 * <KanvaStageWithCollaboration width={1080} height={1080}>
 *   <Layer>
 *     {elements.map(el => <YourElement key={el.id} {...el} />)}
 *   </Layer>
 * </KanvaStageWithCollaboration>
 */
export function KanvaStageWithCollaboration({
  width,
  height,
  children,
}: KanvaStageWithCollaborationProps) {
  const others = useOthers();
  const updatePresence = useUpdateMyPresence();

  // Throttle cursor updates to 60fps
  const updateCursor = useMemo(
    () =>
      throttle((pos: { x: number; y: number } | null) => {
        updatePresence({ cursor: pos });
      }, 16),
    [updatePresence]
  );

  return (
    <Stage
      width={width}
      height={height}
      onMouseMove={(e) => {
        const stage = e.target.getStage();
        const point = stage?.getPointerPosition();
        if (point) {
          updateCursor(point);
        }
      }}
      onMouseLeave={() => {
        updateCursor(null);
      }}
    >
      {/* Your existing layers */}
      {children}

      {/* Collaboration layers */}
      <RemoteSelections users={others} />
      <RemoteCursors cursors={others} />
    </Stage>
  );
}

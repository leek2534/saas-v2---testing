/**
 * Example: Konva Element with Collaboration Operations
 * Shows how to convert a regular element to use operations
 */

'use client';

import { useCallback, useMemo } from 'react';
import { Rect, Transformer } from 'react-konva';
import { throttle } from 'lodash';
import { useCanvasCollab } from '../useCanvasCollab';
import { useLiveblocks } from '../useLiveblocks';
import { useEditorStore } from '../../lib/editor/store';
import type { ShapeElement } from '../../lib/editor/types';

interface CollaborativeRectProps {
  element: ShapeElement;
  isSelected: boolean;
  onSelect: () => void;
  userId: string;
  userName: string;
  canvasId: string;
}

/**
 * Example of a collaborative rectangle element
 * Replace your existing element components with this pattern
 */
export function CollaborativeRect({
  element,
  isSelected,
  onSelect,
  userId,
  userName,
  canvasId,
}: CollaborativeRectProps) {
  const { broadcast, onEvent } = useLiveblocks({
    roomId: canvasId,
    userId,
    userName,
    userColor: '#3b82f6',
    role: 'owner',
  });

  const { applyLocal } = useCanvasCollab({
    userId,
    userName,
    canvasId,
    onBroadcast: broadcast,
    onRemoteOperation: onEvent,
  });

  // Check if element is locked by another user
  const isLockedByOther = element.lockedBy && element.lockedBy !== userId;

  // Throttled drag broadcasting (25fps)
  const dragBroadcast = useMemo(
    () =>
      throttle((x: number, y: number) => {
        applyLocal({
          type: 'element:drag',
          elementId: element.id,
          x,
          y,
          userId,
          ts: Date.now(),
        });
      }, 40),
    [element.id, userId, applyLocal]
  );

  const handleDragStart = useCallback(() => {
    // Lock element when starting to drag
    applyLocal({
      type: 'element:lock',
      elementId: element.id,
      userId,
      userName,
      ts: Date.now(),
    });
  }, [element.id, userId, userName, applyLocal]);

  const handleDragMove = useCallback(
    (e: any) => {
      const node = e.target;
      // Broadcast live position
      dragBroadcast(node.x(), node.y());
    },
    [dragBroadcast]
  );

  const handleDragEnd = useCallback(
    (e: any) => {
      const node = e.target;

      // Commit final position (undoable)
      applyLocal({
        type: 'element:update',
        elementId: element.id,
        updates: {
          x: node.x(),
          y: node.y(),
        },
        userId,
        ts: Date.now(),
        undoable: true,
      });

      // Unlock element
      applyLocal({
        type: 'element:unlock',
        elementId: element.id,
        userId,
        ts: Date.now(),
      });
    },
    [element.id, userId, applyLocal]
  );

  const handleTransformEnd = useCallback(
    (e: any) => {
      const node = e.target;
      const scaleX = node.scaleX();
      const scaleY = node.scaleY();

      // Reset scale and apply to width/height
      node.scaleX(1);
      node.scaleY(1);

      applyLocal({
        type: 'element:update',
        elementId: element.id,
        updates: {
          x: node.x(),
          y: node.y(),
          width: Math.max(5, node.width() * scaleX),
          height: Math.max(5, node.height() * scaleY),
          rotation: node.rotation(),
        },
        userId,
        ts: Date.now(),
        undoable: true,
      });

      applyLocal({
        type: 'element:unlock',
        elementId: element.id,
        userId,
        ts: Date.now(),
      });
    },
    [element.id, userId, applyLocal]
  );

  return (
    <>
      <Rect
        id={element.id}
        x={element.x}
        y={element.y}
        width={element.width}
        height={element.height}
        fill={element.fill}
        rotation={element.rotation}
        draggable={!isLockedByOther}
        onClick={onSelect}
        onTap={onSelect}
        onDragStart={handleDragStart}
        onDragMove={handleDragMove}
        onDragEnd={handleDragEnd}
        onTransformStart={handleDragStart}
        onTransformEnd={handleTransformEnd}
        // Visual feedback for locked elements
        opacity={isLockedByOther ? 0.5 : 1}
      />

      {/* Show lock badge if locked by another user */}
      {isLockedByOther && element.lockedByName && (
        <LockBadge
          x={element.x}
          y={element.y}
          userName={element.lockedByName}
        />
      )}
    </>
  );
}

// Simple lock badge component
function LockBadge({ x, y, userName }: { x: number; y: number; userName: string }) {
  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y - 30,
        background: '#ef4444',
        color: 'white',
        padding: '4px 8px',
        borderRadius: '4px',
        fontSize: '11px',
        pointerEvents: 'none',
        whiteSpace: 'nowrap',
      }}
    >
      Editing by {userName}
    </div>
  );
}

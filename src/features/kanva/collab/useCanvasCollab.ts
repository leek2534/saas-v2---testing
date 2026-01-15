/**
 * Collaboration Bridge
 * Abstracts networking from canvas operations
 */

import { useCallback, useEffect, useRef } from 'react';
import { useEditorStore } from '../lib/editor/store';
import type { CanvasOperation } from './operations';

interface UseCanvasCollabProps {
  userId: string;
  userName: string;
  canvasId: string;
  onBroadcast: (op: CanvasOperation) => void;
  onRemoteOperation: (handler: (op: CanvasOperation) => void) => void;
}

export function useCanvasCollab({
  userId,
  userName,
  canvasId,
  onBroadcast,
  onRemoteOperation,
}: UseCanvasCollabProps) {
  const applyOperation = useEditorStore((state) => state.applyOperation);
  const lastDragTs = useRef<number>(0);
  const lastTextUpdateTs = useRef<number>(0);

  const applyLocal = useCallback(
    (op: CanvasOperation) => {
      applyOperation(op);
      onBroadcast(op);
    },
    [applyOperation, onBroadcast]
  );

  const applyRemote = useCallback(
    (op: CanvasOperation) => {
      if (op.userId === userId) return;

      if (op.type === 'element:drag') {
        const now = Date.now();
        if (now - lastDragTs.current < 40) return;
        lastDragTs.current = now;
      }

      if (op.type === 'text:update') {
        const now = Date.now();
        if (now - lastTextUpdateTs.current < 300) return;
        lastTextUpdateTs.current = now;
      }

      applyOperation(op);
    },
    [userId, applyOperation]
  );

  useEffect(() => {
    const cleanup = onRemoteOperation(applyRemote);
    return cleanup;
  }, [onRemoteOperation, applyRemote]);

  return {
    applyLocal,
    applyRemote,
  };
}

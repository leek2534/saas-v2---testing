/**
 * Collaboration Sync Component
 * Handles real-time state synchronization between clients via Liveblocks
 */

'use client';

import { useEffect, useCallback, useRef } from 'react';
import { useBroadcastEvent, useEventListener, useRoom, useUpdateMyPresence } from '@liveblocks/react';
import { useEditorStore } from '../lib/editor/store';
import type { EditorElement } from '../lib/editor/types';

type CanvasEvent = {
  type: 'element-update' | 'element-add' | 'element-remove' | 'sync-request' | 'sync-response' | 'full-sync';
  elementId?: string;
  updates?: Partial<EditorElement>;
  element?: EditorElement;
  elements?: EditorElement[];
  canvas?: any;
  requesterId?: string;
  [key: string]: any;
};

export function CollaborationSync() {
  const broadcast = useBroadcastEvent();
  const room = useRoom();
  const updateMyPresence = useUpdateMyPresence();
  const hasRequestedSync = useRef(false);
  const connectionId = room.getSelf()?.connectionId;
  const previousElementsRef = useRef<EditorElement[]>([]);
  const isRemoteUpdate = useRef(false);
  
  // Subscribe to local store changes and broadcast them
  useEffect(() => {
    const unsubscribe = useEditorStore.subscribe((state, prevState) => {
      // Skip if this was a remote update we just applied
      if (isRemoteUpdate.current) {
        isRemoteUpdate.current = false;
        return;
      }
      
      // Broadcast selection changes to show what user is editing
      if (state.selectedIds !== prevState.selectedIds) {
        updateMyPresence({ selection: state.selectedIds });
      }
      
      const currentElements = state.elements;
      const prevElements = prevState.elements;
      
      // Detect added elements
      currentElements.forEach(el => {
        const existed = prevElements.find(p => p.id === el.id);
        if (!existed) {
          console.log('[Collab] Broadcasting add:', el.id);
          broadcast({ type: 'element-add', element: el } as CanvasEvent);
        }
      });
      
      // Detect removed elements
      prevElements.forEach(el => {
        const stillExists = currentElements.find(c => c.id === el.id);
        if (!stillExists) {
          console.log('[Collab] Broadcasting remove:', el.id);
          broadcast({ type: 'element-remove', elementId: el.id } as CanvasEvent);
        }
      });
      
      // Detect updated elements
      currentElements.forEach(el => {
        const prev = prevElements.find(p => p.id === el.id);
        if (prev && JSON.stringify(prev) !== JSON.stringify(el)) {
          console.log('[Collab] Broadcasting update:', el.id);
          broadcast({ type: 'element-update', elementId: el.id, updates: el } as CanvasEvent);
        }
      });
    });
    
    return unsubscribe;
  }, [broadcast]);
  
  // Request sync from other clients when joining
  useEffect(() => {
    if (!hasRequestedSync.current && connectionId) {
      const timeout = setTimeout(() => {
        console.log('[Collab] Requesting sync from other clients...');
        broadcast({ 
          type: 'sync-request', 
          requesterId: String(connectionId) 
        } as CanvasEvent);
        hasRequestedSync.current = true;
      }, 500);
      
      return () => clearTimeout(timeout);
    }
  }, [broadcast, connectionId]);

  // Listen for events from other clients
  useEventListener(({ event }) => {
    const canvasEvent = event as CanvasEvent;
    const store = useEditorStore.getState();
    
    // Mark that we're applying a remote update to prevent re-broadcasting
    isRemoteUpdate.current = true;
    
    switch (canvasEvent.type) {
      case 'element-update':
        if (canvasEvent.elementId && canvasEvent.updates) {
          console.log('[Collab] Received element update:', canvasEvent.elementId);
          store.updateElement(canvasEvent.elementId, canvasEvent.updates);
        }
        break;
        
      case 'element-add':
        if (canvasEvent.element) {
          console.log('[Collab] Received element add:', canvasEvent.element.id);
          const exists = store.elements.some(el => el.id === canvasEvent.element!.id);
          if (!exists) {
            store.addElement(canvasEvent.element);
          }
        }
        break;
        
      case 'element-remove':
        if (canvasEvent.elementId) {
          console.log('[Collab] Received element remove:', canvasEvent.elementId);
          store.deleteElements([canvasEvent.elementId]);
        }
        break;
        
      case 'sync-request':
        // Someone new joined, send them our state
        if (canvasEvent.requesterId !== String(connectionId)) {
          console.log('[Collab] Sending sync response to new client');
          const currentState = useEditorStore.getState();
          broadcast({
            type: 'sync-response',
            elements: currentState.elements,
            canvas: currentState.canvas,
          } as CanvasEvent);
        }
        isRemoteUpdate.current = false; // Don't skip next local update
        break;
        
      case 'sync-response':
        // Received state from another client
        if (canvasEvent.elements) {
          console.log('[Collab] Received sync response with', canvasEvent.elements.length, 'elements');
          const currentElements = store.elements;
          // Only apply if we have fewer elements (we're the new joiner)
          if (currentElements.length < canvasEvent.elements.length) {
            store.deleteElements(currentElements.map(el => el.id));
            canvasEvent.elements.forEach(el => store.addElement(el));
            if (canvasEvent.canvas) {
              store.setCanvas(canvasEvent.canvas);
            }
          }
        }
        break;
        
      case 'full-sync':
        // Full state sync (for major changes)
        if (canvasEvent.elements) {
          console.log('[Collab] Received full sync');
          const currentElements = store.elements;
          store.deleteElements(currentElements.map(el => el.id));
          canvasEvent.elements.forEach(el => store.addElement(el));
          if (canvasEvent.canvas) {
            store.setCanvas(canvasEvent.canvas);
          }
        }
        break;
    }
  });

  return null;
}

/**
 * Hook to broadcast element changes to other clients
 */
export function useCollaborativeBroadcast() {
  const broadcast = useBroadcastEvent();
  
  const broadcastUpdate = useCallback((elementId: string, updates: Partial<EditorElement>) => {
    broadcast({ type: 'element-update', elementId, updates } as CanvasEvent);
  }, [broadcast]);
  
  const broadcastAdd = useCallback((element: EditorElement) => {
    broadcast({ type: 'element-add', element } as CanvasEvent);
  }, [broadcast]);
  
  const broadcastRemove = useCallback((elementId: string) => {
    broadcast({ type: 'element-remove', elementId } as CanvasEvent);
  }, [broadcast]);
  
  const broadcastFullSync = useCallback(() => {
    const state = useEditorStore.getState();
    broadcast({ 
      type: 'full-sync', 
      elements: state.elements,
      canvas: state.canvas 
    } as CanvasEvent);
  }, [broadcast]);
  
  return { broadcastUpdate, broadcastAdd, broadcastRemove, broadcastFullSync };
}

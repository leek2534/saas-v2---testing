'use client';

import { useEffect, useRef } from 'react';
import { useEditorStore } from "../../lib/editor/store";
import { nanoid } from 'nanoid';

// Clipboard storage (in-memory for same-session copy/paste)
let clipboard: any[] = [];

/**
 * KeyboardShortcuts - Global keyboard event handler
 * Handles Delete, Arrow keys, Undo/Redo, Copy/Paste, Zoom, etc.
 */
export function KeyboardShortcuts() {
  const selectedIds = useEditorStore((s) => s.selectedIds);
  const elements = useEditorStore((s) => s.elements);
  const deleteElements = useEditorStore((s) => s.deleteElements);
  const updateElement = useEditorStore((s) => s.updateElement);
  const addElement = useEditorStore((s) => s.addElement);
  const setSelectedIds = useEditorStore((s) => s.setSelectedIds);
  const undo = useEditorStore((s) => s.undo);
  const redo = useEditorStore((s) => s.redo);
  const bringToFront = useEditorStore((s) => s.bringToFront);
  const sendToBack = useEditorStore((s) => s.sendToBack);
  const bringForward = useEditorStore((s) => s.bringForward);
  const sendBackward = useEditorStore((s) => s.sendBackward);
  const duplicateElements = useEditorStore((s) => s.duplicateElements);
  const pushHistory = useEditorStore((s) => s.pushHistory);
  const getStateSnapshot = useEditorStore((s) => s.getStateSnapshot);
  const groupElements = useEditorStore((s) => s.groupElements);
  const ungroupElements = useEditorStore((s) => s.ungroupElements);
  
  // Debounce timer for arrow key history
  const arrowDebounceRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if typing in an input
      const target = e.target as HTMLElement;
      if (
        target.tagName === 'INPUT' || 
        target.tagName === 'TEXTAREA' || 
        target.contentEditable === 'true'
      ) {
        return;
      }

      // Ensure elements is always an array
      const elementsArray = Array.isArray(elements) ? elements : [];
      const selectedElements = elementsArray.filter(el => selectedIds.includes(el.id));
      if (selectedElements.length === 0 && !['z', 'Z'].includes(e.key)) return;

      // Delete
      if (e.key === 'Delete' || e.key === 'Backspace') {
        e.preventDefault();
        deleteElements(selectedIds);
        pushHistory(getStateSnapshot());
      }

      // Arrow keys - move elements
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
        e.preventDefault();
        const moveAmount = e.shiftKey ? 10 : 1; // Shift = 10px, normal = 1px
        
        selectedElements.forEach(el => {
          let newX = el.x;
          let newY = el.y;
          
          if (e.key === 'ArrowLeft') newX -= moveAmount;
          if (e.key === 'ArrowRight') newX += moveAmount;
          if (e.key === 'ArrowUp') newY -= moveAmount;
          if (e.key === 'ArrowDown') newY += moveAmount;
          
          updateElement(el.id, { x: newX, y: newY });
        });
        
        // Debounced history push - clear previous timer
        if (arrowDebounceRef.current) {
          clearTimeout(arrowDebounceRef.current);
        }
        arrowDebounceRef.current = setTimeout(() => {
          pushHistory(getStateSnapshot());
          arrowDebounceRef.current = null;
        }, 300);
      }

      // Undo (Cmd/Ctrl + Z)
      if ((e.metaKey || e.ctrlKey) && e.key === 'z' && !e.shiftKey) {
        e.preventDefault();
        undo();
      }

      // Redo (Cmd/Ctrl + Shift + Z)
      if ((e.metaKey || e.ctrlKey) && e.key === 'z' && e.shiftKey) {
        e.preventDefault();
        redo();
      }

      // Select all (Cmd/Ctrl + A)
      if ((e.metaKey || e.ctrlKey) && e.key === 'a') {
        e.preventDefault();
        const elementsArray = Array.isArray(elements) ? elements : [];
        const allIds = elementsArray.map(el => el.id);
        useEditorStore.getState().setSelectedIds(allIds);
      }

      // Duplicate (Cmd/Ctrl + D)
      if ((e.metaKey || e.ctrlKey) && e.key === 'd') {
        e.preventDefault();
        duplicateElements(selectedIds);
        pushHistory(getStateSnapshot());
      }

      // Copy (Cmd/Ctrl + C)
      if ((e.metaKey || e.ctrlKey) && e.key === 'c') {
        e.preventDefault();
        // Deep clone selected elements to clipboard
        clipboard = selectedElements.map(el => JSON.parse(JSON.stringify(el)));
      }

      // Cut (Cmd/Ctrl + X)
      if ((e.metaKey || e.ctrlKey) && e.key === 'x') {
        e.preventDefault();
        // Copy then delete
        clipboard = selectedElements.map(el => JSON.parse(JSON.stringify(el)));
        deleteElements(selectedIds);
        pushHistory(getStateSnapshot());
      }

      // Paste (Cmd/Ctrl + V)
      if ((e.metaKey || e.ctrlKey) && e.key === 'v') {
        e.preventDefault();
        if (clipboard.length > 0) {
          const newIds: string[] = [];
          const offset = 20; // Offset pasted elements so they're visible
          
          clipboard.forEach(el => {
            const newId = nanoid();
            const newElement = {
              ...el,
              id: newId,
              x: el.x + offset,
              y: el.y + offset,
            };
            addElement(newElement);
            newIds.push(newId);
          });
          
          // Select the pasted elements
          setSelectedIds(newIds);
          
          // Update clipboard positions for next paste
          clipboard = clipboard.map(el => ({
            ...el,
            x: el.x + offset,
            y: el.y + offset,
          }));
          
          pushHistory(getStateSnapshot());
        }
      }

      // Layer operations
      if (selectedElements.length > 0) {
        // Bring to Front (Cmd/Ctrl + Shift + ])
        if ((e.metaKey || e.ctrlKey) && e.shiftKey && e.key === ']') {
          e.preventDefault();
          selectedElements.forEach(el => bringToFront(el.id));
        }

        // Send to Back (Cmd/Ctrl + Shift + [)
        if ((e.metaKey || e.ctrlKey) && e.shiftKey && e.key === '[') {
          e.preventDefault();
          selectedElements.forEach(el => sendToBack(el.id));
        }

        // Bring Forward (Cmd/Ctrl + ])
        if ((e.metaKey || e.ctrlKey) && !e.shiftKey && e.key === ']') {
          e.preventDefault();
          selectedElements.forEach(el => bringForward(el.id));
        }

        // Send Backward (Cmd/Ctrl + [)
        if ((e.metaKey || e.ctrlKey) && !e.shiftKey && e.key === '[') {
          e.preventDefault();
          selectedElements.forEach(el => sendBackward(el.id));
        }

        // Group (Cmd/Ctrl + G)
        if ((e.metaKey || e.ctrlKey) && !e.shiftKey && e.key === 'g') {
          e.preventDefault();
          if (selectedIds.length >= 2) {
            groupElements(selectedIds);
          }
        }

        // Ungroup (Cmd/Ctrl + Shift + G)
        if ((e.metaKey || e.ctrlKey) && e.shiftKey && e.key === 'G') {
          e.preventDefault();
          // Check if all selected elements are in the same group
          const firstEl = selectedElements[0];
          const groupId = firstEl?.groupId;
          if (groupId && selectedElements.every(el => el.groupId === groupId)) {
            ungroupElements(groupId);
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      // Cleanup debounce timer
      if (arrowDebounceRef.current) {
        clearTimeout(arrowDebounceRef.current);
      }
    };
  }, [selectedIds, elements, deleteElements, updateElement, addElement, setSelectedIds, undo, redo, bringToFront, sendToBack, bringForward, sendBackward, duplicateElements, pushHistory, getStateSnapshot, groupElements, ungroupElements]);

  return null;
}


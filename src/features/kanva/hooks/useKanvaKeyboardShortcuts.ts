'use client';

import { useEffect } from 'react';
import { useEditorStore } from '../lib/editor/store';

const ARROW_KEY_INCREMENT = 1; // Move by 1px per press, can be increased with Shift

export function useKanvaKeyboardShortcuts() {
  const selectedIds = useEditorStore((state) => state.selectedIds);
  const elements = useEditorStore((state) => state.elements);
  const updateElement = useEditorStore((state) => state.updateElement);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger shortcuts when typing in inputs or contenteditable
      const target = e.target as HTMLElement;
      if (
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.isContentEditable ||
        target.closest('[contenteditable="true"]')
      ) {
        return;
      }

      // Only handle arrow keys if elements are selected
      if (selectedIds.length === 0) return;

      const isArrowKey = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key);
      if (!isArrowKey) return;

      e.preventDefault();
      e.stopPropagation();

      // Determine increment (Shift = 10px, normal = 1px)
      const increment = e.shiftKey ? 10 : ARROW_KEY_INCREMENT;

      // Calculate movement delta
      let deltaX = 0;
      let deltaY = 0;

      switch (e.key) {
        case 'ArrowUp':
          deltaY = -increment;
          break;
        case 'ArrowDown':
          deltaY = increment;
          break;
        case 'ArrowLeft':
          deltaX = -increment;
          break;
        case 'ArrowRight':
          deltaX = increment;
          break;
      }

      // Move all selected elements
      selectedIds.forEach((id) => {
        const element = elements.find((el) => el.id === id);
        if (element && !element.metadata?.lock) {
          updateElement(id, {
            x: element.x + deltaX,
            y: element.y + deltaY,
          });
        }
      });
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [selectedIds, elements, updateElement]);
}




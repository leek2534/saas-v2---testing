import { useEffect, useState } from 'react';

/**
 * useKeyboardModifiers - Track keyboard modifier keys
 * 
 * Returns the current state of modifier keys:
 * - shift: Lock aspect ratio, snap rotation
 * - alt: Resize from center
 * - meta/ctrl: Command key (Mac) or Control key (Windows/Linux)
 */
export function useKeyboardModifiers() {
  const [modifiers, setModifiers] = useState({
    shift: false,
    alt: false,
    meta: false,
    ctrl: false,
  });

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      setModifiers({
        shift: e.shiftKey,
        alt: e.altKey,
        meta: e.metaKey,
        ctrl: e.ctrlKey,
      });
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      setModifiers({
        shift: e.shiftKey,
        alt: e.altKey,
        meta: e.metaKey,
        ctrl: e.ctrlKey,
      });
    };

    // Handle window blur (user switches tabs)
    const handleBlur = () => {
      setModifiers({
        shift: false,
        alt: false,
        meta: false,
        ctrl: false,
      });
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    window.addEventListener('blur', handleBlur);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      window.removeEventListener('blur', handleBlur);
    };
  }, []);

  return modifiers;
}

/**
 * useArrowKeyNudge - Handle arrow key nudging of selected elements
 * 
 * @param selectedIds - Array of selected element IDs
 * @param updateElement - Function to update element position
 * @param pushHistory - Function to push history state
 * @param getStateSnapshot - Function to get current state
 */
export function useArrowKeyNudge(
  selectedIds: string[],
  updateElement: (id: string, updates: any) => void,
  pushHistory: (state: any) => void,
  getStateSnapshot: () => any
) {
  useEffect(() => {
    if (selectedIds.length === 0) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Only handle arrow keys
      if (!['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
        return;
      }

      // Don't handle if user is typing in an input
      const target = e.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable) {
        return;
      }

      e.preventDefault();

      // Determine nudge amount (10px with Shift, 1px without)
      const nudgeAmount = e.shiftKey ? 10 : 1;

      let dx = 0;
      let dy = 0;

      switch (e.key) {
        case 'ArrowUp':
          dy = -nudgeAmount;
          break;
        case 'ArrowDown':
          dy = nudgeAmount;
          break;
        case 'ArrowLeft':
          dx = -nudgeAmount;
          break;
        case 'ArrowRight':
          dx = nudgeAmount;
          break;
      }

      // Update all selected elements
      selectedIds.forEach((id) => {
        // Get current element position
        const element = document.querySelector(`[data-element-id="${id}"]`) as HTMLElement;
        if (!element) return;

        const currentX = parseFloat(element.style.left || '0');
        const currentY = parseFloat(element.style.top || '0');

        updateElement(id, {
          x: currentX + dx,
          y: currentY + dy,
        });
      });

      // Push to history after nudge
      pushHistory(getStateSnapshot());
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [selectedIds, updateElement, pushHistory, getStateSnapshot]);
}

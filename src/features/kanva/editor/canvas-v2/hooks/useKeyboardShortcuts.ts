/**
 * Keyboard Shortcuts Hook
 * 
 * Centralized keyboard handling with:
 * - Modifier key detection (Cmd/Ctrl, Shift, Alt)
 * - Conflict prevention with text editing
 * - Accessibility announcements
 */

'use client';

import { useCallback, useEffect, useRef } from 'react';
import { useEditorStore } from '../../../lib/editor/store';
import { useCommandHistory } from '../../../lib/commands';

// ============================================
// TYPES
// ============================================

export interface KeyboardShortcut {
  key: string;
  ctrl?: boolean;
  shift?: boolean;
  alt?: boolean;
  action: () => void;
  description: string;
  /** If true, shortcut works even when editing text */
  allowInTextEdit?: boolean;
}

export interface UseKeyboardShortcutsOptions {
  enabled?: boolean;
  isEditingText?: boolean;
  onAnnounce?: (message: string) => void;
}

// ============================================
// HOOK IMPLEMENTATION
// ============================================

export function useKeyboardShortcuts(
  options: UseKeyboardShortcutsOptions = {}
) {
  const { enabled = true, isEditingText = false, onAnnounce } = options;
  
  // Store actions
  const selectedIds = useEditorStore(state => state.selectedIds);
  const elements = useEditorStore(state => state.elements);
  const deleteElements = useEditorStore(state => state.deleteElements);
  const duplicateElements = useEditorStore(state => state.duplicateElements);
  const setSelectedIds = useEditorStore(state => state.setSelectedIds);
  const clearSelection = useEditorStore(state => state.clearSelection);
  const bringToFront = useEditorStore(state => state.bringToFront);
  const sendToBack = useEditorStore(state => state.sendToBack);
  const groupElements = useEditorStore(state => state.groupElements);
  const ungroupElements = useEditorStore(state => state.ungroupElements);
  const getSelectedGroup = useEditorStore(state => state.getSelectedGroup);
  
  // Command history
  const { undo, redo, canUndo, canRedo } = useCommandHistory();
  
  // Spacebar state for pan mode
  const isSpacePressed = useRef(false);
  
  // ============================================
  // SHORTCUT DEFINITIONS
  // ============================================
  
  const shortcuts: KeyboardShortcut[] = [
    // Undo/Redo
    {
      key: 'z',
      ctrl: true,
      action: () => {
        if (canUndo()) {
          undo();
          onAnnounce?.('Undo');
        }
      },
      description: 'Undo',
    },
    {
      key: 'z',
      ctrl: true,
      shift: true,
      action: () => {
        if (canRedo()) {
          redo();
          onAnnounce?.('Redo');
        }
      },
      description: 'Redo',
    },
    {
      key: 'y',
      ctrl: true,
      action: () => {
        if (canRedo()) {
          redo();
          onAnnounce?.('Redo');
        }
      },
      description: 'Redo (alternative)',
    },
    
    // Selection
    {
      key: 'a',
      ctrl: true,
      action: () => {
        const allIds = elements.filter(el => !el.locked).map(el => el.id);
        setSelectedIds(allIds);
        onAnnounce?.(`Selected ${allIds.length} elements`);
      },
      description: 'Select all',
    },
    {
      key: 'Escape',
      action: () => {
        clearSelection();
        onAnnounce?.('Selection cleared');
      },
      description: 'Clear selection',
      allowInTextEdit: true,
    },
    
    // Delete
    {
      key: 'Delete',
      action: () => {
        if (selectedIds.length > 0) {
          deleteElements(selectedIds);
          onAnnounce?.(`Deleted ${selectedIds.length} elements`);
        }
      },
      description: 'Delete selected',
    },
    {
      key: 'Backspace',
      action: () => {
        if (selectedIds.length > 0) {
          deleteElements(selectedIds);
          onAnnounce?.(`Deleted ${selectedIds.length} elements`);
        }
      },
      description: 'Delete selected',
    },
    
    // Duplicate
    {
      key: 'd',
      ctrl: true,
      action: () => {
        if (selectedIds.length > 0) {
          duplicateElements(selectedIds);
          onAnnounce?.(`Duplicated ${selectedIds.length} elements`);
        }
      },
      description: 'Duplicate selected',
    },
    
    // Copy/Paste (placeholder - needs clipboard implementation)
    {
      key: 'c',
      ctrl: true,
      action: () => {
        // TODO: Implement copy to clipboard
        onAnnounce?.('Copied to clipboard');
      },
      description: 'Copy',
    },
    {
      key: 'v',
      ctrl: true,
      action: () => {
        // TODO: Implement paste from clipboard
        onAnnounce?.('Pasted from clipboard');
      },
      description: 'Paste',
    },
    
    // Layer ordering
    {
      key: ']',
      ctrl: true,
      action: () => {
        if (selectedIds.length === 1) {
          bringToFront(selectedIds[0]);
          onAnnounce?.('Brought to front');
        }
      },
      description: 'Bring to front',
    },
    {
      key: '[',
      ctrl: true,
      action: () => {
        if (selectedIds.length === 1) {
          sendToBack(selectedIds[0]);
          onAnnounce?.('Sent to back');
        }
      },
      description: 'Send to back',
    },
    
    // Grouping
    {
      key: 'g',
      ctrl: true,
      action: () => {
        if (selectedIds.length >= 2) {
          groupElements(selectedIds);
          onAnnounce?.('Elements grouped');
        }
      },
      description: 'Group elements',
    },
    {
      key: 'g',
      ctrl: true,
      shift: true,
      action: () => {
        const groupId = getSelectedGroup();
        if (groupId) {
          ungroupElements(groupId);
          onAnnounce?.('Elements ungrouped');
        }
      },
      description: 'Ungroup elements',
    },
    
    // Nudge with arrow keys
    {
      key: 'ArrowUp',
      action: () => nudgeSelection(0, -1),
      description: 'Nudge up',
    },
    {
      key: 'ArrowDown',
      action: () => nudgeSelection(0, 1),
      description: 'Nudge down',
    },
    {
      key: 'ArrowLeft',
      action: () => nudgeSelection(-1, 0),
      description: 'Nudge left',
    },
    {
      key: 'ArrowRight',
      action: () => nudgeSelection(1, 0),
      description: 'Nudge right',
    },
    {
      key: 'ArrowUp',
      shift: true,
      action: () => nudgeSelection(0, -10),
      description: 'Nudge up (large)',
    },
    {
      key: 'ArrowDown',
      shift: true,
      action: () => nudgeSelection(0, 10),
      description: 'Nudge down (large)',
    },
    {
      key: 'ArrowLeft',
      shift: true,
      action: () => nudgeSelection(-10, 0),
      description: 'Nudge left (large)',
    },
    {
      key: 'ArrowRight',
      shift: true,
      action: () => nudgeSelection(10, 0),
      description: 'Nudge right (large)',
    },
  ];
  
  // ============================================
  // HELPERS
  // ============================================
  
  const updateElement = useEditorStore(state => state.updateElement);
  
  const nudgeSelection = useCallback((dx: number, dy: number) => {
    selectedIds.forEach(id => {
      const element = elements.find(el => el.id === id);
      if (element) {
        updateElement(id, {
          x: element.x + dx,
          y: element.y + dy,
        });
      }
    });
  }, [selectedIds, elements, updateElement]);
  
  // ============================================
  // EVENT HANDLER
  // ============================================
  
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (!enabled) return;
    
    // Track spacebar for pan mode
    if (e.code === 'Space') {
      isSpacePressed.current = true;
      return;
    }
    
    // Find matching shortcut
    const isCtrlOrCmd = e.ctrlKey || e.metaKey;
    
    for (const shortcut of shortcuts) {
      const keyMatch = e.key.toLowerCase() === shortcut.key.toLowerCase() ||
                       e.key === shortcut.key;
      const ctrlMatch = !!shortcut.ctrl === isCtrlOrCmd;
      const shiftMatch = !!shortcut.shift === e.shiftKey;
      const altMatch = !!shortcut.alt === e.altKey;
      
      if (keyMatch && ctrlMatch && shiftMatch && altMatch) {
        // Skip if editing text and shortcut doesn't allow it
        if (isEditingText && !shortcut.allowInTextEdit) {
          continue;
        }
        
        e.preventDefault();
        shortcut.action();
        return;
      }
    }
  }, [enabled, isEditingText, shortcuts]);
  
  const handleKeyUp = useCallback((e: KeyboardEvent) => {
    if (e.code === 'Space') {
      isSpacePressed.current = false;
    }
  }, []);
  
  // ============================================
  // EFFECT
  // ============================================
  
  useEffect(() => {
    if (!enabled) return;
    
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [enabled, handleKeyDown, handleKeyUp]);
  
  return {
    isSpacePressed,
    shortcuts,
  };
}

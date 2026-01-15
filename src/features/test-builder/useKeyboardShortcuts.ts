"use client";

import { useEffect, useCallback } from 'react';
import { useTestBuilderV2Store } from './store';
import { toast } from 'sonner';

/**
 * Keyboard shortcuts for Test Builder
 * 
 * Shortcuts:
 * - Delete/Backspace: Delete selected element/column/row/section
 * - Ctrl/Cmd + D: Duplicate selected element/section
 * - Ctrl/Cmd + Z: Undo
 * - Ctrl/Cmd + Shift + Z / Ctrl/Cmd + Y: Redo
 * - Escape: Deselect all
 * - Arrow Up/Down: Move selected element up/down
 */
export function useKeyboardShortcuts() {
  const {
    selectedSectionId,
    selectedRowId,
    selectedColumnId,
    selectedElementId,
    deleteSection,
    deleteRow,
    deleteColumn,
    deleteElement,
    duplicateSection,
    duplicateElement,
    moveElementUp,
    moveElementDown,
    selectSection,
    selectRow,
    selectColumn,
    selectElement,
    undo,
    redo,
    canUndo,
    canRedo,
    sections,
  } = useTestBuilderV2Store();

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    // Don't trigger shortcuts when typing in inputs
    const target = e.target as HTMLElement;
    if (
      target.tagName === 'INPUT' ||
      target.tagName === 'TEXTAREA' ||
      target.isContentEditable ||
      target.closest('[contenteditable="true"]')
    ) {
      return;
    }

    const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
    const ctrlKey = isMac ? e.metaKey : e.ctrlKey;

    // Delete - Delete selected item
    if (e.key === 'Delete' || e.key === 'Backspace') {
      e.preventDefault();
      
      if (selectedElementId) {
        deleteElement(selectedElementId);
        toast.success('Element deleted');
      } else if (selectedColumnId && selectedRowId && selectedSectionId) {
        // Check if it's the last column
        const section = sections.find(s => s.id === selectedSectionId);
        const row = section?.rows.find(r => r.id === selectedRowId);
        if (row && row.columns.length > 1) {
          deleteColumn(selectedSectionId, selectedRowId, selectedColumnId);
          toast.success('Column deleted');
        } else {
          toast.error("Can't delete the last column");
        }
      } else if (selectedRowId && selectedSectionId) {
        deleteRow(selectedSectionId, selectedRowId);
        toast.success('Row deleted');
      } else if (selectedSectionId) {
        deleteSection(selectedSectionId);
        toast.success('Section deleted');
      }
      return;
    }

    // Ctrl/Cmd + D - Duplicate
    if (ctrlKey && e.key === 'd') {
      e.preventDefault();
      
      if (selectedElementId) {
        duplicateElement(selectedElementId);
        toast.success('Element duplicated');
      } else if (selectedSectionId) {
        duplicateSection(selectedSectionId);
        toast.success('Section duplicated');
      }
      return;
    }

    // Ctrl/Cmd + Z - Undo
    if (ctrlKey && e.key === 'z' && !e.shiftKey) {
      e.preventDefault();
      if (canUndo()) {
        undo();
        toast.success('Undo');
      }
      return;
    }

    // Ctrl/Cmd + Shift + Z or Ctrl/Cmd + Y - Redo
    if ((ctrlKey && e.shiftKey && e.key === 'z') || (ctrlKey && e.key === 'y')) {
      e.preventDefault();
      if (canRedo()) {
        redo();
        toast.success('Redo');
      }
      return;
    }

    // Escape - Deselect all
    if (e.key === 'Escape') {
      e.preventDefault();
      selectElement(null);
      selectColumn(null);
      selectRow(null);
      selectSection(null);
      return;
    }

    // Arrow Up - Move element up
    if (e.key === 'ArrowUp' && selectedElementId && !ctrlKey) {
      e.preventDefault();
      moveElementUp(selectedElementId);
      return;
    }

    // Arrow Down - Move element down
    if (e.key === 'ArrowDown' && selectedElementId && !ctrlKey) {
      e.preventDefault();
      moveElementDown(selectedElementId);
      return;
    }
  }, [
    selectedSectionId,
    selectedRowId,
    selectedColumnId,
    selectedElementId,
    deleteSection,
    deleteRow,
    deleteColumn,
    deleteElement,
    duplicateSection,
    duplicateElement,
    moveElementUp,
    moveElementDown,
    selectSection,
    selectRow,
    selectColumn,
    selectElement,
    undo,
    redo,
    canUndo,
    canRedo,
    sections,
  ]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);
}

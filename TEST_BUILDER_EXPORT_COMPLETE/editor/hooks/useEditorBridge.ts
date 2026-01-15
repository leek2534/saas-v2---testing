/**
 * Hook that bridges the new editor store with the old TestBuilderV2Store interface
 * This allows TestBuilderSidebar to work with the new editor
 */

import { useCallback } from 'react';
import { useEditor } from '../store/useEditorStore';
import { createAddElementAction } from '../actions/editorActions';
import { getNode, getChildren } from '../schema/nodes';

export function useEditorBridge() {
  const { state, dispatch } = useEditor();

  // Find selected node and determine what's selected
  const selectedNode = state.selectedId ? getNode(state.tree, state.selectedId) : null;
  
  let selectedSectionId: string | null = null;
  let selectedRowId: string | null = null;
  let selectedColumnId: string | null = null;
  let selectedElementId: string | null = null;

  if (selectedNode) {
    if (selectedNode.type === 'section') {
      selectedSectionId = selectedNode.id;
    } else if (selectedNode.type === 'row') {
      selectedRowId = selectedNode.id;
      selectedSectionId = selectedNode.parentId;
    } else if (selectedNode.type === 'column') {
      selectedColumnId = selectedNode.id;
      const rowNode = selectedNode.parentId ? getNode(state.tree, selectedNode.parentId) : null;
      selectedRowId = rowNode?.id || null;
      selectedSectionId = rowNode?.parentId || null;
    } else if (selectedNode.type === 'element') {
      selectedElementId = selectedNode.id;
      const columnNode = selectedNode.parentId ? getNode(state.tree, selectedNode.parentId) : null;
      selectedColumnId = columnNode?.id || null;
      const rowNode = columnNode?.parentId ? getNode(state.tree, columnNode.parentId) : null;
      selectedRowId = rowNode?.id || null;
      selectedSectionId = rowNode?.parentId || null;
    }
  }

  const addElement = useCallback((
    sectionId: string,
    rowId: string,
    columnId: string,
    type: string,
    insertIndex?: number
  ) => {
    const action = createAddElementAction(columnId, type, insertIndex);
    dispatch(action);
  }, [dispatch]);

  // Mock sections array for TestBuilderSidebar's element insertion logic
  const sections: any[] = [];

  return {
    selectedSectionId,
    selectedRowId,
    selectedColumnId,
    selectedElementId,
    addElement,
    sections,
  };
}

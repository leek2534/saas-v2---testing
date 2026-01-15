"use client";

import React, { useCallback } from 'react';
import { TestBuilderSidebar } from '../../TestBuilderSidebar';
import { useEditor } from '../store/useEditorStore';
import { createAddSectionAction, createAddRowAction, createAddColumnAction, createAddElementAction } from '../actions/editorActions';
import { getNode } from '../schema/nodes';

/**
 * Bridge component that wraps TestBuilderSidebar and connects it to the new editor
 */
export function EditorSidebarBridge() {
  const { state, dispatch } = useEditor();

  // Get selected IDs from editor state
  const selectedSectionId = state.selectedId && getNode(state.tree, state.selectedId)?.type === 'section' 
    ? state.selectedId 
    : null;
  
  const selectedRowId = state.selectedId && getNode(state.tree, state.selectedId)?.type === 'row'
    ? state.selectedId
    : null;
  
  const selectedColumnId = state.selectedId && getNode(state.tree, state.selectedId)?.type === 'column'
    ? state.selectedId
    : null;

  const handleAddSection = useCallback(() => {
    const action = createAddSectionAction();
    dispatch(action);
  }, [dispatch]);

  const handleAddRow = useCallback((sectionId: string) => {
    const actions = createAddRowAction(sectionId, 2);
    actions.forEach(action => dispatch(action));
  }, [dispatch]);

  const handleAddColumn = useCallback((sectionId: string, rowId: string) => {
    const action = createAddColumnAction(rowId);
    dispatch(action);
  }, [dispatch]);

  // Create a mock store interface that TestBuilderSidebar expects
  const mockStoreProps = {
    selectedSectionId,
    selectedRowId,
    selectedColumnId,
    selectedElementId: state.selectedId && getNode(state.tree, state.selectedId)?.type === 'element'
      ? state.selectedId
      : null,
    addElement: (sectionId: string, rowId: string, columnId: string, type: any, index?: number) => {
      const action = createAddElementAction(columnId, type, index);
      dispatch(action);
    },
    sections: [], // TestBuilderSidebar uses this for element insertion logic
    addSection: () => {
      handleAddSection();
    },
  };

  return (
    <TestBuilderSidebar
      onAddSection={handleAddSection}
      onAddRow={handleAddRow}
      onAddColumn={handleAddColumn}
    />
  );
}

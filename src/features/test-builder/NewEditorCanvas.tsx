"use client";

import React, { useCallback, useMemo } from 'react';
import { EditorProvider, useEditor } from './editor/store/useEditorStore';
import { Canvas } from './editor/Canvas';
import { createDemoState } from './editor/utils/createDemoState';
import { TestBuilderSidebar } from './TestBuilderSidebar';
import { UnifiedSettingsPanel } from './UnifiedSettingsPanel';
import { createAddSectionAction, createAddRowAction, createAddColumnAction } from './editor/actions/editorActions';
import { useEditorBridge } from './editor/hooks/useEditorBridge';
import { useTestBuilderV2Store } from './store';

/**
 * Inner component that has access to editor context
 */
function EditorCanvasInner() {
  const { dispatch } = useEditor();
  const editorBridge = useEditorBridge();
  
  // Get the old store to provide to TestBuilderSidebar
  const oldStore = useTestBuilderV2Store();

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

  // Sync selection state to old store only when it changes
  React.useEffect(() => {
    useTestBuilderV2Store.setState({
      selectedSectionId: editorBridge.selectedSectionId,
      selectedRowId: editorBridge.selectedRowId,
      selectedColumnId: editorBridge.selectedColumnId,
      selectedElementId: editorBridge.selectedElementId,
    });
  }, [
    editorBridge.selectedSectionId,
    editorBridge.selectedRowId,
    editorBridge.selectedColumnId,
    editorBridge.selectedElementId,
  ]);

  const hasSelection = !!(
    editorBridge.selectedSectionId ||
    editorBridge.selectedRowId ||
    editorBridge.selectedColumnId ||
    editorBridge.selectedElementId
  );

  return (
    <div className="flex h-full w-full bg-background overflow-hidden">
      {/* Left Sidebar - Single sidebar with nav rail + expandable panel */}
      <TestBuilderSidebar
        onAddSection={handleAddSection}
        onAddRow={handleAddRow}
        onAddColumn={handleAddColumn}
      />

      {/* Main Canvas Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Toolbar */}
        <div className="h-14 border-b bg-background flex items-center justify-between px-4 flex-shrink-0">
          <span className="text-sm font-medium">Visual Editor</span>
        </div>

        {/* Canvas */}
        <div className="flex-1 overflow-auto">
          <Canvas />
        </div>
      </div>

      {/* Right Settings Panel - Only shows when something is selected */}
      {hasSelection && <UnifiedSettingsPanel />}
    </div>
  );
}

/**
 * NewEditorCanvas - Single sidebar with 4 options (Layout, Elements, Templates, Tools)
 * Matches original test-builder sidebar design
 */
export function NewEditorCanvas() {
  // Start with empty canvas instead of demo state
  const initialState = {
    tree: {
      rootId: '',
      nodes: {},
    },
    hovered: {
      sectionId: null,
      rowId: null,
      columnId: null,
      elementId: null,
    },
    selectedId: null,
  };

  return (
    <EditorProvider initialState={initialState}>
      <EditorCanvasInner />
    </EditorProvider>
  );
}

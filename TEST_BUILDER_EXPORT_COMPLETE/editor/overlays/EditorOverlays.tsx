"use client";

import React from 'react';
import { useEditor } from '../store/useEditorStore';
import { useDomRegistry } from './domRegistry';
import { HoverOutline } from './HoverOutline';
import { SelectionOutline } from './SelectionOutline';
import { ResizeHandles } from './ResizeHandles';

export function EditorOverlays() {
  const { state } = useEditor();
  const { get } = useDomRegistry();

  // Get hover rect
  const hoveredRect = state.hoveredId ? get(state.hoveredId)?.getBoundingClientRect() : null;

  // Get selection rect
  const selectedRect = state.selectedId ? get(state.selectedId)?.getBoundingClientRect() : null;

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        pointerEvents: 'none',
        zIndex: 9997,
      }}
    >
      {hoveredRect && <HoverOutline rect={hoveredRect} />}
      {selectedRect && <SelectionOutline rect={selectedRect} />}
      <ResizeHandles />
    </div>
  );
}

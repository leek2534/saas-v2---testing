/**
 * Canvas V2 - Main Component
 * 
 * Refactored canvas editor with:
 * - Modular architecture
 * - Optimized performance (memoization, refs for transient state)
 * - Accessibility support
 * - Clean separation of concerns
 */

'use client';

import React, { 
  useRef, 
  useCallback, 
  useMemo, 
  useState,
  useEffect,
} from 'react';
import { useEditorStore } from '../../lib/editor/store';
import type { EditorElement, TextElement } from '../../lib/editor/types';
import type { HandlePosition, ContextMenuState } from './types';

// Layers
import { SelectionLayer } from './layers/SelectionLayer';
import { GuidesLayer } from './layers/GuidesLayer';

// Components
import { CanvasElement } from './components/CanvasElement';

// Hooks
import { useCanvasInteractions } from './hooks/useCanvasInteractions';
import { useMarqueeSelection } from './hooks/useMarqueeSelection';
import { useZoomPan } from './hooks/useZoomPan';
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts';

// ============================================
// TEXT MEASUREMENT
// ============================================

function measureTextDimensions(element: TextElement): { width: number; height: number } {
  // Create offscreen element for measurement
  const measureDiv = document.createElement('div');
  measureDiv.style.cssText = `
    position: absolute;
    visibility: hidden;
    white-space: ${element.autoWidth ? 'nowrap' : 'pre-wrap'};
    word-break: break-word;
    font-family: ${element.fontFamily};
    font-size: ${element.fontSize}px;
    font-weight: ${element.fontWeight};
    font-style: ${element.fontStyle};
    line-height: ${element.lineHeight || 1.2};
    letter-spacing: ${element.letterSpacing || 0}px;
    ${element.width ? `width: ${element.width}px;` : ''}
  `;
  measureDiv.textContent = element.text || ' ';
  
  document.body.appendChild(measureDiv);
  const rect = measureDiv.getBoundingClientRect();
  document.body.removeChild(measureDiv);
  
  return {
    width: element.width || Math.ceil(rect.width),
    height: element.height || Math.ceil(rect.height),
  };
}

function measureElement(element: EditorElement): { width: number; height: number } {
  if (element.type === 'text') {
    return measureTextDimensions(element as TextElement);
  }
  return {
    width: element.width || 100,
    height: element.height || 100,
  };
}

// ============================================
// CONTEXT MENU
// ============================================

interface ContextMenuProps {
  state: ContextMenuState;
  onClose: () => void;
  selectedCount: number;
  isGrouped: boolean;
  onGroup: () => void;
  onUngroup: () => void;
  onDelete: () => void;
  onDuplicate: () => void;
  onBringToFront: () => void;
  onSendToBack: () => void;
}

const ContextMenu: React.FC<ContextMenuProps> = ({
  state,
  onClose,
  selectedCount,
  isGrouped,
  onGroup,
  onUngroup,
  onDelete,
  onDuplicate,
  onBringToFront,
  onSendToBack,
}) => {
  if (!state.visible) return null;

  const menuItems = [
    { label: 'Duplicate', action: onDuplicate, shortcut: '⌘D' },
    { label: 'Delete', action: onDelete, shortcut: '⌫', danger: true },
    { separator: true },
    { label: 'Bring to Front', action: onBringToFront, shortcut: '⌘]' },
    { label: 'Send to Back', action: onSendToBack, shortcut: '⌘[' },
    ...(selectedCount >= 2 && !isGrouped ? [
      { separator: true },
      { label: 'Group', action: onGroup, shortcut: '⌘G' },
    ] : []),
    ...(isGrouped ? [
      { separator: true },
      { label: 'Ungroup', action: onUngroup, shortcut: '⌘⇧G' },
    ] : []),
  ];

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-50"
        onClick={onClose}
      />
      
      {/* Menu */}
      <div
        className="fixed z-50 bg-white rounded-lg shadow-lg border border-gray-200 py-1 min-w-[180px]"
        style={{ left: state.x, top: state.y }}
        role="menu"
      >
        {menuItems.map((item, index) => {
          if ('separator' in item && item.separator) {
            return <div key={index} className="border-t border-gray-100 my-1" />;
          }
          
          const menuItem = item as { label: string; action: () => void; shortcut?: string; danger?: boolean };
          
          return (
            <button
              key={menuItem.label}
              className={`w-full px-3 py-1.5 text-left text-sm flex items-center justify-between hover:bg-gray-100 ${
                menuItem.danger ? 'text-red-600' : 'text-gray-700'
              }`}
              onClick={() => {
                menuItem.action();
                onClose();
              }}
              role="menuitem"
            >
              <span>{menuItem.label}</span>
              {menuItem.shortcut && (
                <span className="text-gray-400 text-xs ml-4">{menuItem.shortcut}</span>
              )}
            </button>
          );
        })}
      </div>
    </>
  );
};

// ============================================
// ACCESSIBILITY ANNOUNCER
// ============================================

const A11yAnnouncer: React.FC<{ message: string }> = ({ message }) => (
  <div
    role="status"
    aria-live="polite"
    aria-atomic="true"
    className="sr-only"
  >
    {message}
  </div>
);

// ============================================
// MAIN CANVAS COMPONENT
// ============================================

export interface CanvasV2Props {
  className?: string;
}

export function CanvasV2({ className = '' }: CanvasV2Props) {
  // Refs
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLDivElement>(null);
  
  // Store
  const canvas = useEditorStore(state => state.canvas);
  const elements = useEditorStore(state => state.elements);
  const selectedIds = useEditorStore(state => state.selectedIds);
  const setSelectedIds = useEditorStore(state => state.setSelectedIds);
  const clearSelection = useEditorStore(state => state.clearSelection);
  const deleteElements = useEditorStore(state => state.deleteElements);
  const duplicateElements = useEditorStore(state => state.duplicateElements);
  const bringToFront = useEditorStore(state => state.bringToFront);
  const sendToBack = useEditorStore(state => state.sendToBack);
  const groupElements = useEditorStore(state => state.groupElements);
  const ungroupElements = useEditorStore(state => state.ungroupElements);
  const getSelectedGroup = useEditorStore(state => state.getSelectedGroup);
  const getElementGroup = useEditorStore(state => state.getElementGroup);
  const getGroupElements = useEditorStore(state => state.getGroupElements);
  
  // Local state
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [editingTextId, setEditingTextId] = useState<string | null>(null);
  const [contextMenu, setContextMenu] = useState<ContextMenuState>({
    visible: false,
    x: 0,
    y: 0,
    elementId: null,
  });
  const [a11yMessage, setA11yMessage] = useState('');
  
  // Zoom & Pan
  const zoomPan = useZoomPan({
    containerRef: containerRef as React.RefObject<HTMLElement>,
    initialZoom: 1,
  });
  
  // Canvas interactions
  const interactions = useCanvasInteractions({
    zoom: zoomPan.zoom,
    canvasSize: { width: canvas.width, height: canvas.height },
    measureElement,
  });
  
  // Marquee selection
  const marquee = useMarqueeSelection({
    zoom: zoomPan.zoom,
    measureElement,
  });
  
  // Keyboard shortcuts
  useKeyboardShortcuts({
    enabled: !editingTextId,
    isEditingText: !!editingTextId,
    onAnnounce: setA11yMessage,
  });
  
  // ============================================
  // COMPUTED VALUES
  // ============================================
  
  const selectedElements = useMemo(() => 
    elements.filter(el => selectedIds.includes(el.id)),
    [elements, selectedIds]
  );
  
  const isGrouped = useMemo(() => {
    if (selectedElements.length < 2) return false;
    const firstGroupId = selectedElements[0]?.groupId;
    return !!firstGroupId && selectedElements.every(el => el.groupId === firstGroupId);
  }, [selectedElements]);
  
  // ============================================
  // EVENT HANDLERS
  // ============================================
  
  const handleSelect = useCallback((id: string, e: React.MouseEvent) => {
    // Check if element is part of a group
    const groupId = getElementGroup(id);
    
    if (groupId) {
      // Select entire group
      const groupElements = getGroupElements(groupId);
      const groupIds = groupElements.map(el => el.id);
      
      if (e.shiftKey) {
        // Add group to selection
        const combined = new Set([...selectedIds, ...groupIds]);
        setSelectedIds(Array.from(combined));
      } else {
        setSelectedIds(groupIds);
      }
    } else {
      // Single element selection
      if (e.shiftKey) {
        // Toggle selection
        if (selectedIds.includes(id)) {
          setSelectedIds(selectedIds.filter(sid => sid !== id));
        } else {
          setSelectedIds([...selectedIds, id]);
        }
      } else {
        setSelectedIds([id]);
      }
    }
  }, [selectedIds, setSelectedIds, getElementGroup, getGroupElements]);
  
  const handleDragStart = useCallback((id: string, e: React.MouseEvent) => {
    const point = { x: e.clientX, y: e.clientY };
    interactions.startDrag(id, point, elements);
  }, [elements, interactions]);
  
  const handleResizeStart = useCallback((
    elementId: string | null,
    handle: HandlePosition,
    e: React.MouseEvent
  ) => {
    const point = { x: e.clientX, y: e.clientY };
    interactions.startResize(elementId, handle, point, elements);
  }, [elements, interactions]);
  
  const handleRotateStart = useCallback((elementId: string, e: React.MouseEvent) => {
    const element = elements.find(el => el.id === elementId);
    if (!element) return;
    
    const point = { x: e.clientX, y: e.clientY };
    interactions.startRotate(elementId, point, element);
  }, [elements, interactions]);
  
  const handleDoubleClick = useCallback((id: string) => {
    const element = elements.find(el => el.id === id);
    if (element?.type === 'text') {
      setEditingTextId(id);
    }
  }, [elements]);
  
  const handleCanvasMouseDown = useCallback((e: React.MouseEvent) => {
    // Only handle left click on canvas background
    if (e.button !== 0) return;
    if (e.target !== canvasRef.current) return;
    
    // Start marquee selection
    const rect = canvasRef.current?.getBoundingClientRect();
    if (rect) {
      const point = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
      marquee.startMarquee(point);
    }
  }, [marquee]);
  
  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    const point = { x: e.clientX, y: e.clientY };
    
    if (zoomPan.isPanning) {
      zoomPan.updatePan(point);
      return;
    }
    
    if (marquee.isSelecting) {
      const rect = canvasRef.current?.getBoundingClientRect();
      if (rect) {
        marquee.updateMarquee(
          { x: e.clientX - rect.left, y: e.clientY - rect.top },
          e.shiftKey
        );
      }
      return;
    }
    
    if (interactions.mode === 'dragging') {
      interactions.updateDrag(point);
    } else if (interactions.mode === 'resizing') {
      interactions.updateResize(point);
    } else if (interactions.mode === 'rotating') {
      interactions.updateRotate(point);
    }
  }, [zoomPan, marquee, interactions]);
  
  const handleMouseUp = useCallback((e: React.MouseEvent) => {
    if (zoomPan.isPanning) {
      zoomPan.endPan();
    }
    
    if (marquee.isSelecting) {
      marquee.endMarquee(e.shiftKey);
    }
    
    if (interactions.mode !== 'idle') {
      interactions.reset();
    }
  }, [zoomPan, marquee, interactions]);
  
  const handleContextMenu = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    
    if (selectedIds.length > 0) {
      setContextMenu({
        visible: true,
        x: e.clientX,
        y: e.clientY,
        elementId: selectedIds[0],
      });
    }
  }, [selectedIds]);
  
  const handleCanvasClick = useCallback((e: React.MouseEvent) => {
    // Clear selection when clicking on canvas background
    if (e.target === canvasRef.current && !marquee.isSelecting) {
      clearSelection();
    }
  }, [clearSelection, marquee.isSelecting]);
  
  // ============================================
  // CONTEXT MENU ACTIONS
  // ============================================
  
  const handleGroup = useCallback(() => {
    if (selectedIds.length >= 2) {
      groupElements(selectedIds);
      setA11yMessage('Elements grouped');
    }
  }, [selectedIds, groupElements]);
  
  const handleUngroup = useCallback(() => {
    const groupId = getSelectedGroup();
    if (groupId) {
      ungroupElements(groupId);
      setA11yMessage('Elements ungrouped');
    }
  }, [getSelectedGroup, ungroupElements]);
  
  const handleDelete = useCallback(() => {
    if (selectedIds.length > 0) {
      deleteElements(selectedIds);
      setA11yMessage(`Deleted ${selectedIds.length} elements`);
    }
  }, [selectedIds, deleteElements]);
  
  const handleDuplicate = useCallback(() => {
    if (selectedIds.length > 0) {
      duplicateElements(selectedIds);
      setA11yMessage(`Duplicated ${selectedIds.length} elements`);
    }
  }, [selectedIds, duplicateElements]);
  
  const handleBringToFront = useCallback(() => {
    if (selectedIds.length === 1) {
      bringToFront(selectedIds[0]);
      setA11yMessage('Brought to front');
    }
  }, [selectedIds, bringToFront]);
  
  const handleSendToBack = useCallback(() => {
    if (selectedIds.length === 1) {
      sendToBack(selectedIds[0]);
      setA11yMessage('Sent to back');
    }
  }, [selectedIds, sendToBack]);
  
  // ============================================
  // WHEEL HANDLER
  // ============================================
  
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    
    const handleWheel = (e: WheelEvent) => {
      if (e.ctrlKey || e.metaKey) {
        e.preventDefault();
        zoomPan.handleWheel(e);
      }
    };
    
    container.addEventListener('wheel', handleWheel, { passive: false });
    return () => container.removeEventListener('wheel', handleWheel);
  }, [zoomPan]);
  
  // ============================================
  // RENDER
  // ============================================
  
  const marqueeBounds = marquee.getMarqueeBounds();
  
  return (
    <div
      ref={containerRef}
      className={`relative overflow-hidden bg-gray-100 ${className}`}
      style={{ cursor: interactions.cursor }}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      {/* Accessibility announcer */}
      <A11yAnnouncer message={a11yMessage} />
      
      {/* Canvas viewport */}
      <div
        className="absolute"
        style={{
          transform: `translate(${zoomPan.panX}px, ${zoomPan.panY}px) scale(${zoomPan.zoom})`,
          transformOrigin: '0 0',
        }}
      >
        {/* Canvas artboard */}
        <div
          ref={canvasRef}
          className="relative shadow-lg"
          style={{
            width: canvas.width,
            height: canvas.height,
            backgroundColor: canvas.background?.color || '#ffffff',
            backgroundImage: canvas.background?.image 
              ? `url(${canvas.background.image})` 
              : undefined,
            backgroundSize: 'cover',
          }}
          onMouseDown={handleCanvasMouseDown}
          onClick={handleCanvasClick}
          onContextMenu={handleContextMenu}
          role="application"
          aria-label="Canvas editor"
          tabIndex={0}
        >
          {/* Elements */}
          {elements.map(element => {
            const measured = measureElement(element);
            const isSelected = selectedIds.includes(element.id);
            const isHovered = hoveredId === element.id;
            const isPreview = marquee.previewIds.includes(element.id);
            
            return (
              <React.Fragment key={element.id}>
                <CanvasElement
                  element={element}
                  isSelected={isSelected || isPreview}
                  isHovered={isHovered}
                  onSelect={handleSelect}
                  onHover={setHoveredId}
                  onDragStart={handleDragStart}
                  onDoubleClick={handleDoubleClick}
                  measuredWidth={measured.width}
                  measuredHeight={measured.height}
                />
              </React.Fragment>
            );
          })}
          
          {/* Selection layer */}
          <SelectionLayer
            selectedElements={selectedElements}
            measureElement={measureElement}
            onResizeStart={handleResizeStart}
            onRotateStart={handleRotateStart}
            isGrouped={isGrouped}
            zoom={zoomPan.zoom}
          />
          
          {/* Guides layer */}
          <GuidesLayer
            guides={interactions.activeSnapGuides}
            canvasWidth={canvas.width}
            canvasHeight={canvas.height}
          />
          
          {/* Marquee selection rectangle */}
          {marquee.isSelecting && marqueeBounds && (
            <div
              className="absolute border border-blue-500 bg-blue-500/10 pointer-events-none"
              style={{
                left: marqueeBounds.minX,
                top: marqueeBounds.minY,
                width: marqueeBounds.maxX - marqueeBounds.minX,
                height: marqueeBounds.maxY - marqueeBounds.minY,
              }}
            />
          )}
        </div>
      </div>
      
      {/* Context menu */}
      <ContextMenu
        state={contextMenu}
        onClose={() => setContextMenu(prev => ({ ...prev, visible: false }))}
        selectedCount={selectedIds.length}
        isGrouped={isGrouped}
        onGroup={handleGroup}
        onUngroup={handleUngroup}
        onDelete={handleDelete}
        onDuplicate={handleDuplicate}
        onBringToFront={handleBringToFront}
        onSendToBack={handleSendToBack}
      />
      
      {/* Zoom indicator */}
      <div className="absolute bottom-4 right-4 bg-white/90 px-2 py-1 rounded text-sm text-gray-600 shadow">
        {Math.round(zoomPan.zoom * 100)}%
      </div>
    </div>
  );
}

export default CanvasV2;

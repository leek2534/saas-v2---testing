'use client';

import React, { useRef, useState, useCallback, useEffect } from 'react';
import { useEditorStore } from '../../../lib/editor/store';
import type { TextElement as TextElementType } from '../../../lib/editor/types';
import { SelectionBox } from '../SelectionBox';
import { CanvasTextEditor } from '../CanvasTextEditor';
import { renderHTMLFromJSON, textToJSON, extractTextFromJSON } from '../../../lib/editor/renderText';
import { registerEditModeTrigger, unregisterEditModeTrigger } from '../../../lib/editor/editorRegistry';

interface TextElementProps {
  element: TextElementType;
  isSelected: boolean;
  isHovered: boolean;
  isEditing: boolean;
  onSelect: (id: string, e: React.MouseEvent) => void;
  onDoubleClick: (element: TextElementType) => void;
  onHover: (id: string | null) => void;
  onDragStart: (element: TextElementType) => void;
}

/**
 * TextElement - Canonical three-layer structure (Canva/Figma/Notion style)
 * 
 * Layer 1: Canvas Element Shell - positioning, rotation, selection
 * Layer 2: Text Container - sizing & wrapping
 * Layer 3: Editor Surface - TipTap (editing) OR HTML (read-only)
 */
export function TextElement({ element, isSelected, isHovered, isEditing: isEditingProp, onSelect, onDoubleClick, onHover, onDragStart }: TextElementProps) {
  // Refs for each layer
  const shellRef = useRef<HTMLDivElement>(null); // Layer 1: Canvas shell
  const containerRef = useRef<HTMLDivElement>(null); // Layer 2: Text container (what SelectionBox measures)
  
  const [isDragging, setIsDragging] = useState(false);
  const [localEditing, setLocalEditing] = useState(false);
  const isEditing = isEditingProp || localEditing;
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const resizeMode = element.metadata?.textResizeMode || 'fixed';
  const [actualBounds, setActualBounds] = useState({ width: element.width || 200, height: element.height || 50 });
  const dragStartRef = useRef({ x: 0, y: 0, elementX: 0, elementY: 0 });
  
  const updateElement = useEditorStore((s) => s.updateElement);
  const pushHistory = useEditorStore((s) => s.pushHistory);
  const getStateSnapshot = useEditorStore((s) => s.getStateSnapshot);

  // Handle double-click to enter edit mode
  const handleDoubleClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    
    // Don't process if it came from a toolbar button
    const target = e.target as HTMLElement;
    if (target.closest('button') || target.closest('[role="button"]') || target.closest('.popover-content') || target.closest('[data-radix-portal]')) {
      return;
    }
    
    // Double-click → enter edit mode
    if (!element.metadata?.lock && !isDragging && isSelected) {
      e.preventDefault();
      setLocalEditing(true);
    }
  }, [element.metadata?.lock, isSelected, isDragging]);

  // Handle single click - only for selection, NOT editing
  const handleClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    
    // Don't process click if it came from a toolbar button
    const target = e.target as HTMLElement;
    if (target.closest('button') || target.closest('[role="button"]') || target.closest('.popover-content') || target.closest('[data-radix-portal]')) {
      return;
    }
  }, []);

  // Handle text change from TipTap editor
  const handleTextChange = useCallback((json: any) => {
    // Extract plain text for backwards compatibility
    const plainText = extractTextFromJSON(json);
    
    // Update both textJSON and text
    updateElement(element.id, { 
      textJSON: json,
      text: plainText,
    });
    
    // Recalculate bounds from container (not editor)
    // Use requestAnimationFrame to ensure DOM has updated
    requestAnimationFrame(() => {
      requestAnimationFrame(() => { // Double RAF to ensure layout is complete
        if (containerRef.current) {
          const rect = containerRef.current.getBoundingClientRect();
          const newWidth = Math.max(rect.width, 20); // Ensure minimum width
          const newHeight = Math.max(rect.height, 20); // Ensure minimum height
          
          if (resizeMode === 'auto') {
            updateElement(element.id, {
              width: newWidth,
              height: newHeight,
            });
          } else {
            updateElement(element.id, {
              height: newHeight,
            });
          }
          
          // Update actualBounds for SelectionBox
          setActualBounds({
            width: newWidth,
            height: newHeight,
          });
        }
      });
    });
  }, [element.id, updateElement, resizeMode]);

  // Handle blur (finish editing)
  const handleBlur = useCallback(() => {
    setLocalEditing(false);
    
    // Update element dimensions from container
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      
      if (resizeMode === 'auto') {
        updateElement(element.id, { 
          width: rect.width,
          height: rect.height,
        });
      } else {
        updateElement(element.id, { 
          height: rect.height,
        });
      }
    }
    
    pushHistory(getStateSnapshot());
  }, [pushHistory, getStateSnapshot, element.id, updateElement, resizeMode]);

  // Register edit mode trigger so toolbars can programmatically enter edit mode
  useEffect(() => {
    const triggerEditMode = () => {
      if (!element.metadata?.lock && !isDragging && isSelected) {
        setLocalEditing(true);
      }
    };
    
    registerEditModeTrigger(element.id, triggerEditMode);
    return () => {
      unregisterEditModeTrigger(element.id);
    };
  }, [element.id, element.metadata?.lock, isDragging, isSelected]);

  // Update dimensions when content or styles change
  useEffect(() => {
    if (containerRef.current) {
      // Use requestAnimationFrame to ensure DOM has updated
      requestAnimationFrame(() => {
        if (containerRef.current) {
          const rect = containerRef.current.getBoundingClientRect();
          const newWidth = rect.width;
          const newHeight = rect.height;
          
          // Only update if dimensions actually changed to avoid unnecessary updates
          if (newWidth !== actualBounds.width || newHeight !== actualBounds.height) {
            setActualBounds({
              width: newWidth,
              height: newHeight,
            });
            
            // Update element dimensions if not editing (to persist size)
            if (!isEditing && resizeMode === 'auto') {
              updateElement(element.id, {
                width: newWidth,
                height: newHeight,
              });
            } else if (!isEditing) {
              updateElement(element.id, {
                height: newHeight,
              });
            }
          }
        }
      });
    }
  }, [element.textJSON, element.text, element.fontSize, element.fontFamily, element.width, isEditing, actualBounds.width, actualBounds.height, resizeMode, element.id, updateElement]);

  // Handle drag start
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    // CRITICAL: While editing, disable ALL canvas interactions
    if (isEditing) {
      e.stopPropagation();
      return;
    }
    
    // Don't process if click came from a toolbar button
    const target = e.target as HTMLElement;
    if (target.closest('button') || target.closest('[role="button"]') || target.closest('.popover-content') || target.closest('[data-radix-portal]')) {
      return;
    }
    
    e.stopPropagation();
    onSelect(element.id, e);

    if (element.metadata?.lock) return;

    onHover(null);
    onDragStart(element);

    setIsDragging(true);
    setDragOffset({ x: 0, y: 0 });
    dragStartRef.current = {
      x: e.clientX,
      y: e.clientY,
      elementX: element.x,
      elementY: element.y,
    };
  }, [element.id, element.x, element.y, element.metadata?.lock, isEditing, onSelect, onHover, onDragStart]);

  // Handle drag move
  useEffect(() => {
    if (!isDragging) return;

    let rafId: number | null = null;
    let pendingUpdate = { x: 0, y: 0 };
    let zoom = 1;

    const artboard = document.getElementById('kanva-artboard');
    const artboardParent = artboard?.parentElement;
    if (artboardParent) {
      const computedStyle = window.getComputedStyle(artboardParent);
      const transform = computedStyle.transform;
      if (transform && transform !== 'none') {
        const matrix = new DOMMatrix(transform);
        zoom = matrix.a;
      }
    }

    const updatePosition = () => {
      setDragOffset(pendingUpdate);
      rafId = null;
    };

    const handleMouseMove = (e: MouseEvent) => {
      const deltaX = e.clientX - dragStartRef.current.x;
      const deltaY = e.clientY - dragStartRef.current.y;
      
      pendingUpdate = {
        x: deltaX / zoom,
        y: deltaY / zoom,
      };

      if (rafId === null) {
        rafId = requestAnimationFrame(updatePosition);
      }
    };

    const handleMouseUp = () => {
      if (rafId !== null) {
        cancelAnimationFrame(rafId);
      }

      const finalX = dragStartRef.current.elementX + pendingUpdate.x;
      const finalY = dragStartRef.current.elementY + pendingUpdate.y;
      
      updateElement(element.id, {
        x: finalX,
        y: finalY,
      });
      
      setIsDragging(false);
      setDragOffset({ x: 0, y: 0 });
      pushHistory(getStateSnapshot());
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      if (rafId !== null) {
        cancelAnimationFrame(rafId);
      }
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, element.id, updateElement, pushHistory, getStateSnapshot]);

  // Text styles for editor/content
  const textStyle: React.CSSProperties = {
    fontFamily: element.fontFamily || 'Inter, sans-serif',
    fontSize: `${element.fontSize || 16}px`,
    fontWeight: element.fontWeight || 400,
    color: element.fill || '#000000',
    textAlign: (element.align as any) || 'left',
    lineHeight: element.lineHeight || 1.2,
    letterSpacing: element.letterSpacing ? `${element.letterSpacing}px` : 'normal',
    textDecoration: element.textDecoration || 'none',
    fontStyle: element.fontStyle || 'normal',
    whiteSpace: 'normal',
    wordBreak: 'break-word',
    overflowWrap: 'break-word',
    margin: 0,
  };

  const transformValue = isDragging 
    ? `translate(${dragOffset.x}px, ${dragOffset.y}px) rotate(${element.rotation || 0}deg)`
    : `rotate(${element.rotation || 0}deg)`;

  return (
    <>
      {/* ============================================
          LAYER 1: Canvas Element Shell
          Responsibilities: positioning, rotation, selection
          Rules: NOT contentEditable, NO text selection, NO focus
      ============================================ */}
      <div
        ref={shellRef}
        data-element-id={element.id}
        className="absolute"
        style={{
          left: element.x,
          top: element.y,
          transform: transformValue,
          opacity: element.opacity ?? 1,
          cursor: element.metadata?.lock ? 'not-allowed' : isEditing ? 'text' : isDragging ? 'grabbing' : 'grab',
          pointerEvents: 'auto',
          userSelect: 'none', // Shell never allows text selection
          willChange: isDragging ? 'transform' : 'auto',
          zIndex: (element.zIndex || 0) + (isSelected ? 1000 : 0),
        }}
        onMouseDown={handleMouseDown}
        onClick={handleClick}
        onDoubleClick={(e) => {
          e.stopPropagation();
          handleDoubleClick(e);
          onDoubleClick(element);
        }}
        onMouseEnter={(e) => {
          e.stopPropagation();
          if (!isDragging && !isEditing) {
            onHover(element.id);
          }
        }}
        onMouseLeave={(e) => {
          e.stopPropagation();
          if (!isEditing) {
            onHover(null);
          }
        }}
      >
        {/* ============================================
            LAYER 2: Text Container
            Responsibilities: sizing & wrapping, padding, alignment
            Rules: NOT editable, NO pointer events when not editing
            📌 This is what SelectionBox measures
        ============================================ */}
        <div
          ref={containerRef}
          style={{
            maxWidth: resizeMode === 'fixed' && element.width ? `${element.width}px` : 'fit-content',
            minWidth: '20px',
            padding: '8px 12px',
            whiteSpace: 'normal',
            wordBreak: 'break-word',
            overflowWrap: 'break-word',
            pointerEvents: isEditing ? 'auto' : 'none', // Only allow interaction when editing
          }}
        >
          {/* ============================================
              LAYER 3: Editor Surface
              Responsibilities: selection, cursor, inline formatting
              Rules: ONLY layer that is editable, mounted only when isEditing === true
          ============================================ */}
          {isEditing ? (
            <CanvasTextEditor
              elementId={element.id}
              value={element.textJSON || textToJSON(element.text || '')}
              autoFocus
              onChange={handleTextChange}
              onBlur={handleBlur}
              style={textStyle}
            />
          ) : (
            <div
              dangerouslySetInnerHTML={{
                __html: renderHTMLFromJSON(element.textJSON || textToJSON(element.text || '')),
              }}
              style={textStyle}
            />
          )}
        </div>

        {/* Selection box - measures container, not editor */}
        {isSelected && (
          <SelectionBox
            element={{
              ...element,
              width: actualBounds.width,
              height: actualBounds.height,
            }}
            dragOffset={{ x: 0, y: 0 }}
            isLocked={element.metadata?.lock || isEditing} // Disable resize while editing
            isHovered={isHovered}
            onResize={(width, _height, x, y) => {
              if (element.metadata?.lock || isEditing) return;
              
              const updates: any = {};
              
              if (resizeMode === 'fixed') {
                updates.width = width;
              } else {
                updates.width = element.width;
              }
              
              if (x !== undefined) updates.x = x;
              if (y !== undefined) updates.y = y;
              
              updateElement(element.id, updates);
              
              // Recalculate height from container after width change
              setTimeout(() => {
                if (containerRef.current) {
                  const rect = containerRef.current.getBoundingClientRect();
                  setActualBounds({
                    width: rect.width,
                    height: rect.height,
                  });
                  updateElement(element.id, { height: rect.height });
                }
              }, 0);
            }}
            onRotate={(rotation) => {
              if (element.metadata?.lock || isEditing) return;
              updateElement(element.id, { rotation });
            }}
            onResizeEnd={() => {
              pushHistory(getStateSnapshot());
            }}
          />
        )}
      </div>
    </>
  );
}

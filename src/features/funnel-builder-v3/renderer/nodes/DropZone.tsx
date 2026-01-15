"use client";

import React, { useState, useRef, useCallback } from "react";
import { useFunnelEditorStore } from "../../store/store";

interface DropZoneProps {
  parentId: string;
  index: number;
  isDragging: boolean;
}

export function DropZone({ parentId, index, isDragging }: DropZoneProps) {
  const [isOver, setIsOver] = useState(false);
  const moveNode = useFunnelEditorStore((s) => s.moveNode);
  const dropZoneRef = useRef<HTMLDivElement>(null);
  const dragOverTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Reset isOver when dragging stops
  React.useEffect(() => {
    if (!isDragging && isOver) {
      setIsOver(false);
    }
  }, [isDragging, isOver]);

  // Cleanup timeout on unmount
  React.useEffect(() => {
    return () => {
      if (dragOverTimeoutRef.current) {
        clearTimeout(dragOverTimeoutRef.current);
      }
    };
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    e.dataTransfer.dropEffect = "move";
    
    // Clear any pending timeout
    if (dragOverTimeoutRef.current) {
      clearTimeout(dragOverTimeoutRef.current);
      dragOverTimeoutRef.current = null;
    }
    
    // Always set to true on dragOver
    setIsOver(true);
    
    // Set a timeout to hide the drop zone if no more dragOver events
    dragOverTimeoutRef.current = setTimeout(() => {
      setIsOver(false);
      dragOverTimeoutRef.current = null;
    }, 150);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsOver(false);

    const elementId = e.dataTransfer.getData("elementId");
    if (elementId) {
      moveNode(elementId, { parentId, index });
    }
  }, [moveNode, parentId, index]);

  if (!isDragging) return null;

  return (
    <div
      ref={dropZoneRef}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      className="relative w-full"
      style={{ height: 0 }}
    >
      {/* Absolutely positioned drop zone that doesn't affect layout */}
      <div 
        className="absolute left-0 right-0 flex items-center justify-center"
        style={{
          top: '-4px',
          height: '8px',
          pointerEvents: 'auto',
        }}
      >
        <div 
          className="w-full transition-all duration-100 bg-blue-500 rounded-full"
          style={{
            height: isOver ? '2px' : '0px',
            opacity: isOver ? 1 : 0,
          }}
        />
      </div>
    </div>
  );
}

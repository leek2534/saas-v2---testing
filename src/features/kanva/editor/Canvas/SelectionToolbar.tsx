'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useEditorStore } from "../../lib/editor/store";
import { Trash2, Copy, Lock, Unlock, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useBackgroundRemoval } from "../../stubs/useBackgroundRemoval";
import { BackgroundRemovalModal } from "../../stubs/BackgroundRemovalModal";

/**
 * SelectionToolbar - Floating toolbar for selected elements
 * Shows actions: Delete, Duplicate, Lock, Align
 * Positions itself above the selected element(s)
 */
export function SelectionToolbar() {
  const selectedIds = useEditorStore((s) => s.selectedIds);
  const elements = useEditorStore((s) => s.elements);
  const updateElement = useEditorStore((s) => s.updateElement);
  const deleteElements = useEditorStore((s) => s.deleteElements);
  const duplicateElements = useEditorStore((s) => s.duplicateElements);
  const pushHistory = useEditorStore((s) => s.pushHistory);
  const getStateSnapshot = useEditorStore((s) => s.getStateSnapshot);
  const [toolbarPosition, setToolbarPosition] = useState({ top: 0, left: 0 });
  const toolbarRef = useRef<HTMLDivElement>(null);

  // Ensure elements is always an array
  const elementsArray = Array.isArray(elements) ? elements : [];
  const selectedElements = elementsArray.filter(el => selectedIds.includes(el.id));
  const isLocked = selectedElements.some(el => el.metadata?.lock);
  
  // Check if any selected element is an image
  const hasImageSelected = selectedElements.some(el => el.type === 'image');
  const selectedImage = selectedElements.find(el => el.type === 'image');
  
  // Background removal hook
  const bgRemoval = useBackgroundRemoval({
    onSuccess: (processedSrc) => {
      // Update the image element with the processed image
      if (selectedImage) {
        updateElement(selectedImage.id, {
          src: processedSrc,
        });
        pushHistory(getStateSnapshot());
      }
    },
  });

  // Calculate toolbar position above selected element(s)
  useEffect(() => {
    if (selectedIds.length === 0 || selectedElements.length === 0) return;

    // Get the artboard and its transform
    const artboard = document.getElementById('kanva-artboard');
    const artboardParent = artboard?.parentElement;
    if (!artboard || !artboardParent) return;

    // Get zoom and pan from the artboard's parent transform
    let zoom = 1;
    let panX = 0;
    let panY = 0;

    const computedStyle = window.getComputedStyle(artboardParent);
    const transform = computedStyle.transform;
    if (transform && transform !== 'none') {
      const matrix = new DOMMatrix(transform);
      zoom = matrix.a;
      panX = matrix.e;
      panY = matrix.f;
    }

    // Get artboard's position on screen
    const artboardRect = artboard.getBoundingClientRect();

    // Calculate bounding box of all selected elements
    let minX = Infinity;
    let minY = Infinity;
    let maxX = -Infinity;
    let maxY = -Infinity;

    selectedElements.forEach(el => {
      const elX = el.x;
      const elY = el.y;
      const elWidth = el.width || 100;
      const elHeight = el.height || 100;

      minX = Math.min(minX, elX);
      minY = Math.min(minY, elY);
      maxX = Math.max(maxX, elX + elWidth);
      maxY = Math.max(maxY, elY + elHeight);
    });

    // Calculate center of selected elements in artboard coordinates
    const centerX = (minX + maxX) / 2;
    const centerY = minY; // Top of the selection

    // Convert to screen coordinates
    const screenX = artboardRect.left + (centerX * zoom) + panX;
    const screenY = artboardRect.top + (centerY * zoom) + panY;

    // Position toolbar above the element (with some offset)
    const toolbarHeight = toolbarRef.current?.offsetHeight || 50;
    const offset = 20; // Space between element and toolbar

    setToolbarPosition({
      left: screenX,
      top: screenY - toolbarHeight - offset,
    });
  }, [selectedIds, elements]);

  if (selectedIds.length === 0) return null;

  const handleDelete = () => {
    deleteElements(selectedIds);
    pushHistory(getStateSnapshot());
  };

  const handleDuplicate = () => {
    if (selectedIds.length === 0) return;
    duplicateElements(selectedIds);
    pushHistory(getStateSnapshot());
  };

  const handleToggleLock = () => {
    selectedElements.forEach(el => {
      updateElement(el.id, {
        metadata: { ...el.metadata, lock: !el.metadata?.lock },
      });
    });
    pushHistory(getStateSnapshot());
  };
  
  const handleRemoveBackground = () => {
    if (selectedImage && 'src' in selectedImage) {
      bgRemoval.showModal(selectedImage.src);
    }
  };

  return (
    <div
      ref={toolbarRef}
      className="fixed z-50 animate-in fade-in slide-in-from-top-2 duration-200 pointer-events-none"
      style={{
        left: `${toolbarPosition.left}px`,
        top: `${toolbarPosition.top}px`,
        transform: 'translateX(-50%)', // Center horizontally on the element
      }}
    >
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 px-3 py-2 flex items-center gap-1.5 backdrop-blur-sm pointer-events-auto">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleDelete}
          className="h-9 w-9 p-0 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400 transition-colors"
          title="Delete (Delete key)"
        >
          <Trash2 className="h-4 w-4" />
        </Button>

        <Button
          variant="ghost"
          size="sm"
          onClick={handleDuplicate}
          className="h-9 w-9 p-0 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
          title="Duplicate (Cmd+D)"
        >
          <Copy className="h-4 w-4" />
        </Button>

        <div className="w-px h-6 bg-gray-200 dark:bg-gray-700 mx-1" />

        <Button
          variant="ghost"
          size="sm"
          onClick={handleToggleLock}
          className="h-9 w-9 p-0 hover:bg-purple-50 dark:hover:bg-purple-900/20 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
          title={isLocked ? "Unlock" : "Lock"}
        >
          {isLocked ? <Unlock className="h-4 w-4" /> : <Lock className="h-4 w-4" />}
        </Button>
        
        {/* Remove Background button - only show for images */}
        {hasImageSelected && (
          <>
            <div className="w-px h-6 bg-gray-200 dark:bg-gray-700 mx-1" />
            
            <Button
              variant="ghost"
              size="sm"
              onClick={handleRemoveBackground}
              className="h-9 px-3 hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 dark:hover:from-purple-900/20 dark:hover:to-pink-900/20 hover:text-purple-600 dark:hover:text-purple-400 transition-all gap-1.5"
              title="Remove Background (AI)"
            >
              <Sparkles className="h-4 w-4" />
              <span className="text-xs font-medium">Remove BG</span>
            </Button>
          </>
        )}

        <div className="text-xs font-medium text-gray-600 dark:text-gray-300 px-2.5 py-1 bg-gray-100 dark:bg-gray-700 rounded-md">
          {selectedIds.length} selected
        </div>
      </div>
      
      {/* Background Removal Modal */}
      <BackgroundRemovalModal
        open={bgRemoval.isOpen}
        onOpenChange={bgRemoval.closeModal}
        onConfirm={bgRemoval.processImage}
        onSkip={bgRemoval.skipRemoval}
        isProcessing={bgRemoval.isProcessing}
        error={bgRemoval.error}
      />
    </div>
  );
}


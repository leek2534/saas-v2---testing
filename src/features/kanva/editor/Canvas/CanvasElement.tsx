'use client';

import React, { useEffect } from 'react';
import type { EditorElement } from '../../lib/editor/types';
import { ImageElement } from './elements/ImageElement';
import { TextElement } from './elements/TextElement';
import { ShapeElement } from './elements/ShapeElement';
import { VideoElement } from './elements/VideoElement';
import { IconElement } from './elements/IconElement';
import { PathElement } from './elements/PathElement';

interface CanvasElementProps {
  element: EditorElement;
  isSelected: boolean;
}

/**
 * CanvasElement - Router component
 * Renders the appropriate element component based on type
 */
export function CanvasElement({ element, isSelected }: CanvasElementProps) {
  // Debug: Log element routing
  useEffect(() => {
    console.log('[CanvasElement] Routing element:', { id: element.id, type: element.type, visible: element.visible });
  }, [element.id, element.type, element.visible]);

  if (!element.visible) {
    console.log('[CanvasElement] Element not visible:', element.id);
    return null;
  }

  switch (element.type) {
    case 'image':
      return <ImageElement element={element} isSelected={isSelected} />;
    case 'text':
      return <TextElement element={element} isSelected={isSelected} />;
    case 'shape':
      return <ShapeElement element={element} isSelected={isSelected} />;
    case 'video':
      return <VideoElement element={element} isSelected={isSelected} />;
    case 'icon':
      return <IconElement element={element} isSelected={isSelected} />;
    case 'path':
      return <PathElement element={element} />;
    default:
      console.warn('[CanvasElement] Unknown element type:', element.type, element);
      return null;
  }
}


"use client";

import React from 'react';

interface HoverOutlineProps {
  rect: DOMRect;
  hoverLayer: 'element' | 'row' | 'section' | null;
}

export function HoverOutline({ rect, hoverLayer }: HoverOutlineProps) {
  // Different styles for different hover layers
  const getOutlineStyle = () => {
    switch (hoverLayer) {
      case 'element':
        return {
          border: '2px dashed #f97316', // Orange for elements
          boxShadow: '0 0 0 1px rgba(249, 115, 22, 0.2)',
        };
      case 'row':
        return {
          border: '2px dashed #3b82f6', // Blue for rows
          boxShadow: '0 0 0 1px rgba(59, 130, 246, 0.2)',
        };
      case 'section':
        return {
          border: '2px dashed #10b981', // Green for sections
          boxShadow: '0 0 0 1px rgba(16, 185, 129, 0.2)',
        };
      default:
        return {
          border: '2px dashed #3b82f6',
        };
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        left: `${rect.left}px`,
        top: `${rect.top}px`,
        width: `${rect.width}px`,
        height: `${rect.height}px`,
        pointerEvents: 'none',
        zIndex: 9998,
        transition: 'all 0.1s ease-out',
        ...getOutlineStyle(),
      }}
    />
  );
}

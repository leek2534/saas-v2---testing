"use client";

import React from 'react';

interface HoverOutlineProps {
  rect: DOMRect;
}

export function HoverOutline({ rect }: HoverOutlineProps) {
  return (
    <div
      style={{
        position: 'fixed',
        left: `${rect.left}px`,
        top: `${rect.top}px`,
        width: `${rect.width}px`,
        height: `${rect.height}px`,
        border: '2px dashed #3b82f6',
        pointerEvents: 'none',
        zIndex: 9998,
        transition: 'all 0.1s ease-out',
      }}
    />
  );
}

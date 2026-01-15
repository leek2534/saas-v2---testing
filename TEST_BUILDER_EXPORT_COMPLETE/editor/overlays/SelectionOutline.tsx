"use client";

import React from 'react';

interface SelectionOutlineProps {
  rect: DOMRect;
}

export function SelectionOutline({ rect }: SelectionOutlineProps) {
  return (
    <div
      style={{
        position: 'fixed',
        left: `${rect.left}px`,
        top: `${rect.top}px`,
        width: `${rect.width}px`,
        height: `${rect.height}px`,
        border: '2px solid #10b981',
        boxShadow: '0 0 0 1px rgba(16, 185, 129, 0.2), 0 0 12px rgba(16, 185, 129, 0.3)',
        pointerEvents: 'none',
        zIndex: 9999,
        transition: 'all 0.1s ease-out',
      }}
    />
  );
}

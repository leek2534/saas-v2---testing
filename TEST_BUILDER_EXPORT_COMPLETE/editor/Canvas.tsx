"use client";

import React from 'react';
import { DomRegistryProvider } from './overlays/domRegistry';
import { RuntimeRenderer } from './renderer/RuntimeRenderer';
import { EditorOverlays } from './overlays/EditorOverlays';

export function Canvas() {
  return (
    <DomRegistryProvider>
      <div
        style={{
          position: 'relative',
          width: '100%',
          height: '100%',
          background: '#ffffff',
        }}
      >
        <RuntimeRenderer />
        <EditorOverlays />
      </div>
    </DomRegistryProvider>
  );
}

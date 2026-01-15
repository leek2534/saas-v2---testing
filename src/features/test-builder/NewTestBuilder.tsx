/**
 * NEW TEST BUILDER - CONTAINER SYSTEM
 * Enforces strict Page > Section > Row > Column > Element hierarchy
 */

import React from 'react';
import { EditorCanvas } from './editor/EditorCanvas';
import { Toolbar } from './editor/Toolbar';

export const NewTestBuilder: React.FC = () => {
  return (
    <div style={{ width: '100%', height: '100%', position: 'relative' }}>
      <Toolbar />
      <EditorCanvas />
    </div>
  );
};

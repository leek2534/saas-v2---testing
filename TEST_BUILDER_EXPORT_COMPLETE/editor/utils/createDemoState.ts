/**
 * Creates a demo initial state for the editor
 */

import { EditorState } from '../store/editorStore';
import { createNode } from '../schema/nodes';

export function createDemoState(): EditorState {
  // Create section
  const section1 = createNode('section', null, {
    background: '#f9fafb',
    paddingY: 60,
    paddingX: 20,
  });

  // Create row 1 with 2 columns
  const row1 = createNode('row', section1.id, {
    gap: 24,
    paddingY: 20,
  });

  const col1_1 = createNode('column', row1.id, {
    widthFraction: 1,
  });

  const col1_2 = createNode('column', row1.id, {
    widthFraction: 1,
  });

  // Create elements in first row
  const heading1 = createNode('element', col1_1.id, {
    elementType: 'heading',
    content: 'Welcome to the Visual Editor',
  });

  const text1 = createNode('element', col1_1.id, {
    elementType: 'text',
    content: 'This is a schema-first editor with strict hierarchy enforcement.',
  });

  const button1 = createNode('element', col1_2.id, {
    elementType: 'button',
    content: 'Get Started',
  });

  const text2 = createNode('element', col1_2.id, {
    elementType: 'text',
    content: 'Click elements to select them. Hover to see outlines.',
  });

  // Create row 2 with 3 columns
  const row2 = createNode('row', section1.id, {
    gap: 16,
    paddingY: 30,
  });

  const col2_1 = createNode('column', row2.id, {
    widthFraction: 1,
  });

  const col2_2 = createNode('column', row2.id, {
    widthFraction: 2,
  });

  const col2_3 = createNode('column', row2.id, {
    widthFraction: 1,
  });

  const image1 = createNode('element', col2_1.id, {
    elementType: 'image',
    src: 'https://via.placeholder.com/400x300/3b82f6/ffffff?text=Image+1',
    alt: 'Placeholder image 1',
  });

  const heading2 = createNode('element', col2_2.id, {
    elementType: 'heading',
    content: 'Feature Highlights',
  });

  const text3 = createNode('element', col2_2.id, {
    elementType: 'text',
    content: 'Drag the handles between columns to resize them. The layout uses fractional units for responsive design.',
  });

  const divider1 = createNode('element', col2_2.id, {
    elementType: 'divider',
  });

  const button2 = createNode('element', col2_3.id, {
    elementType: 'button',
    content: 'Learn More',
  });

  // Build the tree
  col1_1.childrenIds = [heading1.id, text1.id];
  col1_2.childrenIds = [button1.id, text2.id];
  row1.childrenIds = [col1_1.id, col1_2.id];

  col2_1.childrenIds = [image1.id];
  col2_2.childrenIds = [heading2.id, text3.id, divider1.id];
  col2_3.childrenIds = [button2.id];
  row2.childrenIds = [col2_1.id, col2_2.id, col2_3.id];

  section1.childrenIds = [row1.id, row2.id];

  const nodes = {
    [section1.id]: section1,
    [row1.id]: row1,
    [col1_1.id]: col1_1,
    [col1_2.id]: col1_2,
    [heading1.id]: heading1,
    [text1.id]: text1,
    [button1.id]: button1,
    [text2.id]: text2,
    [row2.id]: row2,
    [col2_1.id]: col2_1,
    [col2_2.id]: col2_2,
    [col2_3.id]: col2_3,
    [image1.id]: image1,
    [heading2.id]: heading2,
    [text3.id]: text3,
    [divider1.id]: divider1,
    [button2.id]: button2,
  };

  return {
    tree: {
      rootId: section1.id,
      nodes,
    },
    hoveredId: null,
    selectedId: null,
  };
}

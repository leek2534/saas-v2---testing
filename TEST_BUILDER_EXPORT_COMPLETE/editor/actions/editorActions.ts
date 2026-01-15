/**
 * Helper actions for adding nodes to the editor
 */

import { createNode, SectionNode, RowNode, ColumnNode, ElementNode } from '../schema/nodes';
import { EditorAction } from '../store/editorStore';

/**
 * Create action to add a new section
 */
export function createAddSectionAction(): EditorAction {
  const section = createNode('section', null, {
    background: '#f9fafb',
    paddingY: 60,
    paddingX: 20,
  }) as SectionNode;

  return {
    type: 'INSERT_NODE',
    parentId: null,
    node: section,
  };
}

/**
 * Create action to add a new row to a section
 */
export function createAddRowAction(sectionId: string, columnCount: number = 2): EditorAction[] {
  const row = createNode('row', sectionId, {
    gap: 24,
    paddingY: 20,
  }) as RowNode;

  const actions: EditorAction[] = [
    {
      type: 'INSERT_NODE',
      parentId: sectionId,
      node: row,
    },
  ];

  // Add columns to the row
  for (let i = 0; i < columnCount; i++) {
    const column = createNode('column', row.id, {
      widthFraction: 1,
      minWidth: 0,
    }) as ColumnNode;

    actions.push({
      type: 'INSERT_NODE',
      parentId: row.id,
      node: column,
    });
  }

  return actions;
}

/**
 * Create action to add a new column to a row
 */
export function createAddColumnAction(rowId: string): EditorAction {
  const column = createNode('column', rowId, {
    widthFraction: 1,
    minWidth: 0,
  }) as ColumnNode;

  return {
    type: 'INSERT_NODE',
    parentId: rowId,
    node: column,
  };
}

/**
 * Create action to add an element to a column
 */
export function createAddElementAction(
  columnId: string,
  elementType: string,
  index?: number
): EditorAction {
  const elementProps: Record<string, any> = {
    elementType,
  };

  // Set default content based on element type
  switch (elementType) {
    case 'heading':
      elementProps.content = 'New Heading';
      break;
    case 'text':
      elementProps.content = 'New paragraph text';
      break;
    case 'button':
      elementProps.content = 'Click Me';
      break;
    case 'image':
      elementProps.src = 'https://via.placeholder.com/400x300';
      elementProps.alt = 'Placeholder image';
      break;
    case 'video':
      elementProps.src = '';
      break;
    case 'divider':
      // No content needed
      break;
    default:
      elementProps.content = `New ${elementType}`;
  }

  const element = createNode('element', columnId, elementProps) as ElementNode;

  return {
    type: 'INSERT_NODE',
    parentId: columnId,
    node: element,
    index,
  };
}

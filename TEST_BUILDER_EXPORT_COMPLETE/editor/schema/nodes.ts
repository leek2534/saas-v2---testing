/**
 * Schema-first normalized node model for the editor
 * Enforces strict hierarchy: Page > Section > Row > Column > Element
 */

export type NodeType = 'section' | 'row' | 'column' | 'element';

export interface BaseNode {
  id: string;
  type: NodeType;
  parentId: string | null;
  childrenIds: string[];
  props: Record<string, any>;
  editorMeta?: Record<string, any>;
}

export interface SectionNode extends BaseNode {
  type: 'section';
  props: {
    background?: string;
    paddingY?: number;
    paddingX?: number;
    minHeight?: number;
    [key: string]: any;
  };
}

export interface RowNode extends BaseNode {
  type: 'row';
  props: {
    gap?: number;
    paddingY?: number;
    paddingX?: number;
    [key: string]: any;
  };
}

export interface ColumnNode extends BaseNode {
  type: 'column';
  props: {
    widthFraction: number;
    minWidth?: number;
    [key: string]: any;
  };
}

export interface ElementNode extends BaseNode {
  type: 'element';
  props: {
    elementType: 'text' | 'image' | 'button' | 'heading' | 'video' | 'divider';
    content?: string;
    src?: string;
    alt?: string;
    href?: string;
    [key: string]: any;
  };
}

export type AnyNode = SectionNode | RowNode | ColumnNode | ElementNode;

export interface EditorTree {
  rootId: string;
  nodes: Record<string, AnyNode>;
}

/**
 * Validates parent-child relationships according to hierarchy rules
 * 
 * Rules:
 * - Root level (parent=null): only 'section' allowed
 * - Section children: only 'row' allowed
 * - Row children: only 'column' allowed
 * - Column children: only 'element' allowed
 * - Elements cannot have children
 */
export function validateParentChild(
  parent: AnyNode | null,
  child: AnyNode
): boolean {
  // Root level - only sections allowed
  if (parent === null) {
    return child.type === 'section';
  }

  // Section can only contain rows
  if (parent.type === 'section') {
    return child.type === 'row';
  }

  // Row can only contain columns
  if (parent.type === 'row') {
    return child.type === 'column';
  }

  // Column can only contain elements
  if (parent.type === 'column') {
    return child.type === 'element';
  }

  // Elements cannot have children
  if (parent.type === 'element') {
    return false;
  }

  return false;
}

/**
 * Helper to create a new node with defaults
 */
export function createNode(
  type: NodeType,
  parentId: string | null,
  props: Record<string, any> = {}
): AnyNode {
  const id = `${type}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  
  const baseNode: BaseNode = {
    id,
    type,
    parentId,
    childrenIds: [],
    props,
  };

  switch (type) {
    case 'section':
      return {
        ...baseNode,
        type: 'section',
        props: {
          background: 'transparent',
          paddingY: 40,
          paddingX: 20,
          ...props,
        },
      } as SectionNode;

    case 'row':
      return {
        ...baseNode,
        type: 'row',
        props: {
          gap: 16,
          paddingY: 20,
          paddingX: 0,
          ...props,
        },
      } as RowNode;

    case 'column':
      return {
        ...baseNode,
        type: 'column',
        props: {
          widthFraction: 1,
          minWidth: 0,
          ...props,
        },
      } as ColumnNode;

    case 'element':
      return {
        ...baseNode,
        type: 'element',
        props: {
          elementType: 'text',
          content: 'New element',
          ...props,
        },
      } as ElementNode;

    default:
      throw new Error(`Unknown node type: ${type}`);
  }
}

/**
 * Helper to get a node by ID
 */
export function getNode(tree: EditorTree, nodeId: string): AnyNode | null {
  return tree.nodes[nodeId] || null;
}

/**
 * Helper to get children of a node
 */
export function getChildren(tree: EditorTree, nodeId: string): AnyNode[] {
  const node = getNode(tree, nodeId);
  if (!node) return [];
  return node.childrenIds.map(id => tree.nodes[id]).filter(Boolean);
}

/**
 * Helper to get parent of a node
 */
export function getParent(tree: EditorTree, nodeId: string): AnyNode | null {
  const node = getNode(tree, nodeId);
  if (!node || !node.parentId) return null;
  return getNode(tree, node.parentId);
}

/**
 * Editor store - manages editor state with reducer pattern
 */

import { EditorTree, AnyNode, validateParentChild, getNode } from '../schema/nodes';

export interface EditorState {
  tree: EditorTree;
  hoveredId: string | null;
  selectedId: string | null;
}

export type EditorAction =
  | { type: 'HOVER_NODE'; nodeId: string | null }
  | { type: 'SELECT_NODE'; nodeId: string | null }
  | { type: 'INSERT_NODE'; parentId: string | null; node: AnyNode; index?: number }
  | { type: 'MOVE_NODE'; nodeId: string; newParentId: string | null; index?: number }
  | { type: 'UPDATE_NODE_PROPS'; nodeId: string; props: Record<string, any> }
  | { type: 'DELETE_NODE'; nodeId: string };

export function editorReducer(state: EditorState, action: EditorAction): EditorState {
  switch (action.type) {
    case 'HOVER_NODE':
      return {
        ...state,
        hoveredId: action.nodeId,
      };

    case 'SELECT_NODE':
      return {
        ...state,
        selectedId: action.nodeId,
      };

    case 'INSERT_NODE': {
      const { parentId, node, index } = action;
      const parent = parentId ? state.tree.nodes[parentId] : null;

      // Validate parent-child relationship
      if (!validateParentChild(parent, node)) {
        console.warn('Invalid parent-child relationship', { parent, node });
        return state;
      }

      const newNodes = { ...state.tree.nodes };
      newNodes[node.id] = node;

      // Update parent's children
      if (parent) {
        const updatedParent = { ...parent };
        const insertIndex = index !== undefined ? index : updatedParent.childrenIds.length;
        updatedParent.childrenIds = [
          ...updatedParent.childrenIds.slice(0, insertIndex),
          node.id,
          ...updatedParent.childrenIds.slice(insertIndex),
        ];
        newNodes[parent.id] = updatedParent;
      }

      // Set root if empty
      const newRootId = state.tree.rootId || node.id;

      return {
        ...state,
        tree: {
          rootId: newRootId,
          nodes: newNodes,
        },
      };
    }

    case 'MOVE_NODE': {
      const { nodeId, newParentId, index } = action;
      const node = state.tree.nodes[nodeId];
      if (!node) return state;

      const oldParent = node.parentId ? state.tree.nodes[node.parentId] : null;
      const newParent = newParentId ? state.tree.nodes[newParentId] : null;

      // Validate new parent-child relationship
      if (!validateParentChild(newParent, node)) {
        console.warn('Invalid move: parent-child relationship', { newParent, node });
        return state;
      }

      const newNodes = { ...state.tree.nodes };

      // Remove from old parent
      if (oldParent) {
        const updatedOldParent = { ...oldParent };
        updatedOldParent.childrenIds = updatedOldParent.childrenIds.filter(id => id !== nodeId);
        newNodes[oldParent.id] = updatedOldParent;
      }

      // Add to new parent
      if (newParent) {
        const updatedNewParent = { ...newParent };
        const insertIndex = index !== undefined ? index : updatedNewParent.childrenIds.length;
        updatedNewParent.childrenIds = [
          ...updatedNewParent.childrenIds.slice(0, insertIndex),
          nodeId,
          ...updatedNewParent.childrenIds.slice(insertIndex),
        ];
        newNodes[newParent.id] = updatedNewParent;
      }

      // Update node's parentId
      const updatedNode = { ...node, parentId: newParentId };
      newNodes[nodeId] = updatedNode;

      return {
        ...state,
        tree: {
          ...state.tree,
          nodes: newNodes,
        },
      };
    }

    case 'UPDATE_NODE_PROPS': {
      const { nodeId, props } = action;
      const node = state.tree.nodes[nodeId];
      if (!node) return state;

      const newNodes = { ...state.tree.nodes };
      newNodes[nodeId] = {
        ...node,
        props: {
          ...node.props,
          ...props,
        },
      };

      return {
        ...state,
        tree: {
          ...state.tree,
          nodes: newNodes,
        },
      };
    }

    case 'DELETE_NODE': {
      const { nodeId } = action;
      const node = state.tree.nodes[nodeId];
      if (!node) return state;

      const newNodes = { ...state.tree.nodes };

      // Remove from parent's children
      if (node.parentId) {
        const parent = newNodes[node.parentId];
        if (parent) {
          newNodes[node.parentId] = {
            ...parent,
            childrenIds: parent.childrenIds.filter(id => id !== nodeId),
          };
        }
      }

      // Recursively delete children
      const deleteRecursive = (id: string) => {
        const n = newNodes[id];
        if (!n) return;
        n.childrenIds.forEach(deleteRecursive);
        delete newNodes[id];
      };

      deleteRecursive(nodeId);

      return {
        ...state,
        tree: {
          ...state.tree,
          nodes: newNodes,
        },
        hoveredId: state.hoveredId === nodeId ? null : state.hoveredId,
        selectedId: state.selectedId === nodeId ? null : state.selectedId,
      };
    }

    default:
      return state;
  }
}

export function createInitialState(): EditorState {
  return {
    tree: {
      rootId: '',
      nodes: {},
    },
    hoveredId: null,
    selectedId: null,
  };
}

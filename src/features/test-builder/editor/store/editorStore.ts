/**
 * Editor store - manages editor state with reducer pattern
 *
 * Refactor goals:
 * - Typed hover actions (section/row/element) to avoid flicker and preserve parent context
 * - Canvas-level CLEAR_HOVER (so child leave doesn't nuke hover)
 * - Typed selection path so overlays/resize can behave correctly
 * - Hover/selection priority: element > row > section
 */

import { EditorTree, AnyNode, validateParentChild, getNode } from "../schema/nodes";

export interface PathState {
  sectionId: string | null;
  rowId: string | null;
  columnId: string | null;
  elementId: string | null;
}

export const emptyPath = (): PathState => ({
  sectionId: null,
  rowId: null,
  columnId: null,
  elementId: null,
});

export interface EditorState {
  tree: EditorTree;
  hovered: PathState;
  selected: PathState;
}

export type EditorAction =
  // Hover (typed)
  | { type: "HOVER_SECTION"; sectionId: string | null }
  | { type: "HOVER_ROW"; rowId: string | null }
  | { type: "HOVER_COLUMN"; columnId: string | null } // structural/invisible, optional context
  | { type: "HOVER_ELEMENT"; elementId: string | null }
  | { type: "CLEAR_HOVER" }
  // Selection (typed by node id)
  | { type: "SELECT_NODE"; nodeId: string | null }
  // Tree ops
  | { type: "INSERT_NODE"; parentId: string | null; node: AnyNode; index?: number }
  | { type: "MOVE_NODE"; nodeId: string; newParentId: string | null; index?: number }
  | { type: "UPDATE_NODE_PROPS"; nodeId: string; props: Record<string, any> }
  | { type: "DELETE_NODE"; nodeId: string };

export function resolveHoverLayer(
  hovered: PathState,
  selected?: PathState
): "element" | "row" | "section" | null {
  if (selected?.elementId || hovered.elementId) return "element";
  if (selected?.rowId || hovered.rowId) return "row";
  if (selected?.sectionId || hovered.sectionId) return "section";
  return null;
}

export function editorReducer(state: EditorState, action: EditorAction): EditorState {
  switch (action.type) {
    // ===== Hover typed =====
    case "HOVER_SECTION":
      return {
        ...state,
        hovered: {
          sectionId: action.sectionId,
          rowId: null,
          columnId: null,
          elementId: null,
        },
      };

    case "HOVER_ROW":
      return {
        ...state,
        hovered: {
          ...state.hovered,
          rowId: action.rowId,
          columnId: null,
          elementId: null,
        },
      };

    case "HOVER_COLUMN":
      // Column is structural-only; no UI should depend on this directly.
      return {
        ...state,
        hovered: {
          ...state.hovered,
          columnId: action.columnId,
          elementId: null,
        },
      };

    case "HOVER_ELEMENT":
      return {
        ...state,
        hovered: {
          ...state.hovered,
          elementId: action.elementId,
        },
      };

    case "CLEAR_HOVER":
      return { ...state, hovered: emptyPath() };

    // ===== Selection =====
    case "SELECT_NODE": {
      if (!action.nodeId) return { ...state, selected: emptyPath() };

      const node = getNode(state.tree, action.nodeId);
      if (!node) return state;

      const selected = emptyPath();
      switch (node.type) {
        case "section":
          selected.sectionId = node.id;
          break;
        case "row":
          selected.rowId = node.id;
          break;
        case "column":
          selected.columnId = node.id;
          break;
        case "element":
          selected.elementId = node.id;
          break;
      }
      return { ...state, selected };
    }

    // ===== Tree ops (unchanged) =====
    case "INSERT_NODE": {
      const { parentId, node, index } = action;
      const parent = parentId ? state.tree.nodes[parentId] : null;

      if (!validateParentChild(parent, node)) {
        console.warn("Invalid parent-child relationship", { parent, node });
        return state;
      }

      const newNodes = { ...state.tree.nodes };
      newNodes[node.id] = node;

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

      const newRootId = state.tree.rootId || node.id;

      return { ...state, tree: { rootId: newRootId, nodes: newNodes } };
    }

    case "MOVE_NODE": {
      const { nodeId, newParentId, index } = action;
      const node = state.tree.nodes[nodeId];
      if (!node) return state;

      const oldParent = node.parentId ? state.tree.nodes[node.parentId] : null;
      const newParent = newParentId ? state.tree.nodes[newParentId] : null;

      if (!validateParentChild(newParent, node)) {
        console.warn("Invalid move: parent-child relationship", { newParent, node });
        return state;
      }

      const newNodes = { ...state.tree.nodes };

      if (oldParent) {
        const updatedOldParent = { ...oldParent };
        updatedOldParent.childrenIds = updatedOldParent.childrenIds.filter((id) => id !== nodeId);
        newNodes[oldParent.id] = updatedOldParent;
      }

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

      newNodes[nodeId] = { ...node, parentId: newParentId };

      return { ...state, tree: { ...state.tree, nodes: newNodes } };
    }

    case "UPDATE_NODE_PROPS": {
      const { nodeId, props } = action;
      const node = state.tree.nodes[nodeId];
      if (!node) return state;

      const newNodes = { ...state.tree.nodes };
      newNodes[nodeId] = {
        ...node,
        props: {
          ...node.props,
          ...props,
        } as any,
      };

      return { ...state, tree: { ...state.tree, nodes: newNodes } };
    }

    case "DELETE_NODE": {
      const { nodeId } = action;
      const node = state.tree.nodes[nodeId];
      if (!node) return state;

      const newNodes = { ...state.tree.nodes };

      if (node.parentId) {
        const parent = newNodes[node.parentId];
        if (parent) {
          newNodes[node.parentId] = {
            ...parent,
            childrenIds: parent.childrenIds.filter((id) => id !== nodeId),
          };
        }
      }

      const deleteRecursive = (id: string) => {
        const n = newNodes[id];
        if (!n) return;
        n.childrenIds.forEach(deleteRecursive);
        delete newNodes[id];
      };
      deleteRecursive(nodeId);

      const strip = (p: PathState): PathState => ({
        sectionId: p.sectionId === nodeId ? null : p.sectionId,
        rowId: p.rowId === nodeId ? null : p.rowId,
        columnId: p.columnId === nodeId ? null : p.columnId,
        elementId: p.elementId === nodeId ? null : p.elementId,
      });

      return {
        ...state,
        tree: { ...state.tree, nodes: newNodes },
        hovered: strip(state.hovered),
        selected: strip(state.selected),
      };
    }

    default:
      return state;
  }
}

export function createInitialState(): EditorState {
  return {
    tree: { rootId: "", nodes: {} },
    hovered: emptyPath(),
    selected: emptyPath(),
  };
}

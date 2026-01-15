/**
 * Collaboration Store Extension
 * Adds operation-based collaboration to Zustand store
 */

import { produce } from 'immer';
import type { StateCreator } from 'zustand';
import type { EditorElement, ID } from './types';
import type { CanvasOperation } from '../../collab/operations';
import { createInverseOperation } from '../../collab/operations';

export interface CollabState {
  undoStack: CanvasOperation[];
  redoStack: CanvasOperation[];
  textEditingState: {
    elementId: string | null;
    userId: string | null;
  };
}

export interface CollabActions {
  applyOperation: (op: CanvasOperation) => void;
  undoOperation: () => void;
  redoOperation: () => void;
  clearUndoRedo: () => void;
}

export const createCollabSlice: StateCreator<
  CollabState & CollabActions & { elements: EditorElement[]; canvas: any },
  [],
  [],
  CollabState & CollabActions
> = (set, get) => ({
  undoStack: [],
  redoStack: [],
  textEditingState: {
    elementId: null,
    userId: null,
  },

  applyOperation: (op: CanvasOperation) => {
    set(
      produce((state: any) => {
        switch (op.type) {
          case 'element:update': {
            const index = state.elements.findIndex((el: EditorElement) => el.id === op.elementId);
            if (index !== -1) {
              state.elements[index] = { ...state.elements[index], ...op.updates };
            }
            if (op.undoable) {
              state.undoStack.push(op);
              state.redoStack = [];
            }
            break;
          }

          case 'element:add': {
            state.elements.push(op.element);
            if (op.undoable) {
              state.undoStack.push(op);
              state.redoStack = [];
            }
            break;
          }

          case 'element:remove': {
            const index = state.elements.findIndex((el: EditorElement) => el.id === op.elementId);
            if (index !== -1) {
              state.elements.splice(index, 1);
            }
            if (op.undoable) {
              state.undoStack.push(op);
              state.redoStack = [];
            }
            break;
          }

          case 'element:lock': {
            const index = state.elements.findIndex((el: EditorElement) => el.id === op.elementId);
            if (index !== -1) {
              state.elements[index].lockedBy = op.userId;
              state.elements[index].lockedByName = op.userName;
            }
            break;
          }

          case 'element:unlock': {
            const index = state.elements.findIndex((el: EditorElement) => el.id === op.elementId);
            if (index !== -1) {
              state.elements[index].lockedBy = null;
              state.elements[index].lockedByName = null;
            }
            break;
          }

          case 'element:drag': {
            const index = state.elements.findIndex((el: EditorElement) => el.id === op.elementId);
            if (index !== -1) {
              state.elements[index].x = op.x;
              state.elements[index].y = op.y;
            }
            break;
          }

          case 'text:start': {
            state.textEditingState = {
              elementId: op.elementId,
              userId: op.userId,
            };
            const index = state.elements.findIndex((el: EditorElement) => el.id === op.elementId);
            if (index !== -1) {
              state.elements[index].lockedBy = op.userId;
              state.elements[index].lockedByName = op.userName;
            }
            break;
          }

          case 'text:update': {
            const index = state.elements.findIndex((el: EditorElement) => el.id === op.elementId);
            if (index !== -1 && state.elements[index].type === 'text') {
              (state.elements[index] as any).text = op.text;
              if (op.textJSON) {
                (state.elements[index] as any).textJSON = op.textJSON;
              }
            }
            break;
          }

          case 'text:commit': {
            const index = state.elements.findIndex((el: EditorElement) => el.id === op.elementId);
            if (index !== -1 && state.elements[index].type === 'text') {
              (state.elements[index] as any).text = op.text;
              if (op.textJSON) {
                (state.elements[index] as any).textJSON = op.textJSON;
              }
              state.elements[index].lockedBy = null;
              state.elements[index].lockedByName = null;
            }
            state.textEditingState = {
              elementId: null,
              userId: null,
            };
            if (op.undoable) {
              state.undoStack.push(op);
              state.redoStack = [];
            }
            break;
          }

          case 'element:z-index': {
            const index = state.elements.findIndex((el: EditorElement) => el.id === op.elementId);
            if (index !== -1) {
              state.elements[index].zIndex = op.zIndex;
            }
            if (op.undoable) {
              state.undoStack.push(op);
              state.redoStack = [];
            }
            break;
          }

          case 'canvas:restore': {
            state.elements = op.elements;
            state.canvas = op.canvas;
            break;
          }
        }
      })
    );
  },

  undoOperation: () => {
    const state = get();
    if (state.undoStack.length === 0) return;

    const lastOp = state.undoStack[state.undoStack.length - 1];
    const inverseOp = createInverseOperation(lastOp, state.elements);

    if (inverseOp) {
      state.applyOperation(inverseOp);
      set(
        produce((s: any) => {
          s.undoStack.pop();
          s.redoStack.push(lastOp);
        })
      );
    }
  },

  redoOperation: () => {
    const state = get();
    if (state.redoStack.length === 0) return;

    const lastOp = state.redoStack[state.redoStack.length - 1];
    state.applyOperation(lastOp);
    set(
      produce((s: any) => {
        s.redoStack.pop();
        s.undoStack.push(lastOp);
      })
    );
  },

  clearUndoRedo: () => {
    set({ undoStack: [], redoStack: [] });
  },
});

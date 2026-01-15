/**
 * Canvas Operations Protocol
 * Defines all collaborative operations for the Kanva editor
 */

import type { EditorElement, CanvasConfig } from '../lib/editor/types';

export type CanvasOperation =
  | ElementUpdateOp
  | ElementAddOp
  | ElementRemoveOp
  | ElementLockOp
  | ElementUnlockOp
  | ElementDragOp
  | TextStartOp
  | TextUpdateOp
  | TextCommitOp
  | ElementZIndexOp
  | CanvasRestoreOp;

export interface ElementUpdateOp {
  type: 'element:update';
  elementId: string;
  updates: Partial<EditorElement>;
  userId: string;
  ts: number;
  undoable: boolean;
}

export interface ElementAddOp {
  type: 'element:add';
  element: EditorElement;
  userId: string;
  ts: number;
  undoable: boolean;
}

export interface ElementRemoveOp {
  type: 'element:remove';
  elementId: string;
  removedElement?: EditorElement;
  userId: string;
  ts: number;
  undoable: boolean;
}

export interface ElementLockOp {
  type: 'element:lock';
  elementId: string;
  userId: string;
  userName: string;
  ts: number;
}

export interface ElementUnlockOp {
  type: 'element:unlock';
  elementId: string;
  userId: string;
  ts: number;
}

export interface ElementDragOp {
  type: 'element:drag';
  elementId: string;
  x: number;
  y: number;
  userId: string;
  ts: number;
}

export interface TextStartOp {
  type: 'text:start';
  elementId: string;
  userId: string;
  userName: string;
  ts: number;
}

export interface TextUpdateOp {
  type: 'text:update';
  elementId: string;
  text: string;
  textJSON?: any;
  userId: string;
  ts: number;
}

export interface TextCommitOp {
  type: 'text:commit';
  elementId: string;
  text: string;
  textJSON?: any;
  userId: string;
  ts: number;
  undoable: boolean;
}

export interface ElementZIndexOp {
  type: 'element:z-index';
  elementId: string;
  zIndex: number;
  userId: string;
  ts: number;
  undoable: boolean;
}

export interface CanvasRestoreOp {
  type: 'canvas:restore';
  elements: EditorElement[];
  canvas: CanvasConfig;
  userId: string;
  ts: number;
}

export function createInverseOperation(
  op: CanvasOperation,
  currentElements: EditorElement[]
): CanvasOperation | null {
  switch (op.type) {
    case 'element:update': {
      const element = currentElements.find((el) => el.id === op.elementId);
      if (!element) return null;
      
      const oldValues: Partial<EditorElement> = {};
      Object.keys(op.updates).forEach((key) => {
        oldValues[key as keyof EditorElement] = element[key as keyof EditorElement] as any;
      });
      
      return {
        type: 'element:update',
        elementId: op.elementId,
        updates: oldValues,
        userId: op.userId,
        ts: Date.now(),
        undoable: true,
      };
    }

    case 'element:add': {
      return {
        type: 'element:remove',
        elementId: op.element.id,
        removedElement: op.element,
        userId: op.userId,
        ts: Date.now(),
        undoable: true,
      };
    }

    case 'element:remove': {
      if (!op.removedElement) return null;
      return {
        type: 'element:add',
        element: op.removedElement,
        userId: op.userId,
        ts: Date.now(),
        undoable: true,
      };
    }

    default:
      return null;
  }
}

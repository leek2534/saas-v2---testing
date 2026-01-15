/**
 * Editor Registry - Simple registry to store active TipTap editor instances
 * Allows toolbars to access the editor without prop drilling
 */

const editorRegistry = new Map<string, any>();
const editModeTriggers = new Map<string, () => void>();

export function registerEditor(elementId: string, editor: any) {
  editorRegistry.set(elementId, editor);
}

export function unregisterEditor(elementId: string) {
  editorRegistry.delete(elementId);
}

export function getEditor(elementId: string): any {
  return editorRegistry.get(elementId);
}

export function getAllEditors(): Map<string, any> {
  return editorRegistry;
}

// Register a function to trigger edit mode for an element
export function registerEditModeTrigger(elementId: string, trigger: () => void) {
  editModeTriggers.set(elementId, trigger);
}

export function unregisterEditModeTrigger(elementId: string) {
  editModeTriggers.delete(elementId);
}

export function triggerEditMode(elementId: string) {
  const trigger = editModeTriggers.get(elementId);
  if (trigger) {
    trigger();
  }
}


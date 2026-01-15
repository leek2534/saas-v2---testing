/**
 * Command Pattern Implementation for Undo/Redo
 * 
 * Benefits over snapshot-based history:
 * - Memory efficient (stores only changes, not full state)
 * - Supports command batching and merging
 * - Enables collaborative editing (commands can be serialized)
 * - Provides semantic undo (knows what action was performed)
 */

import { useEditorStore } from '../editor/store';
import type { EditorElement, ID } from '../editor/types';

// ============================================
// COMMAND INTERFACE
// ============================================

export interface CommandResult {
  success: boolean;
  affectedIds?: ID[];
  error?: string;
}

export interface Command {
  /** Unique identifier for this command type */
  readonly type: string;
  
  /** Human-readable description for UI */
  readonly description: string;
  
  /** Execute the command */
  execute(): CommandResult;
  
  /** Undo the command */
  undo(): CommandResult;
  
  /** Redo the command (usually same as execute) */
  redo(): CommandResult;
  
  /** Check if this command can merge with another (for batching) */
  canMergeWith?(other: Command): boolean;
  
  /** Merge with another command */
  mergeWith?(other: Command): Command;
  
  /** Timestamp for ordering */
  readonly timestamp: number;
}

// ============================================
// BASE COMMAND CLASS
// ============================================

export abstract class BaseCommand implements Command {
  abstract readonly type: string;
  abstract readonly description: string;
  readonly timestamp: number;
  
  constructor() {
    this.timestamp = Date.now();
  }
  
  abstract execute(): CommandResult;
  abstract undo(): CommandResult;
  
  redo(): CommandResult {
    return this.execute();
  }
  
  canMergeWith(_other: Command): boolean {
    return false;
  }
  
  mergeWith(_other: Command): Command {
    return this;
  }
  
  protected getStore(): ReturnType<typeof useEditorStore.getState> {
    return useEditorStore.getState();
  }
}

// ============================================
// UPDATE ELEMENT COMMAND
// ============================================

export interface ElementUpdate {
  id: ID;
  before: Partial<EditorElement>;
  after: Partial<EditorElement>;
}

export class UpdateElementCommand extends BaseCommand {
  readonly type = 'UPDATE_ELEMENT';
  readonly description: string;
  
  private updates: ElementUpdate[];
  private mergeWindow = 500; // ms to allow merging
  
  constructor(updates: ElementUpdate[], description?: string) {
    super();
    this.updates = updates;
    this.description = description || `Update ${updates.length} element(s)`;
  }
  
  execute(): CommandResult {
    const store = this.getStore();
    
    try {
      this.updates.forEach(({ id, after }) => {
        store.updateElement(id, after);
      });
      
      return {
        success: true,
        affectedIds: this.updates.map(u => u.id),
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }
  
  undo(): CommandResult {
    const store = this.getStore();
    
    try {
      this.updates.forEach(({ id, before }) => {
        store.updateElement(id, before);
      });
      
      return {
        success: true,
        affectedIds: this.updates.map(u => u.id),
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }
  
  canMergeWith(other: Command): boolean {
    if (!(other instanceof UpdateElementCommand)) return false;
    if (other.timestamp - this.timestamp > this.mergeWindow) return false;
    
    // Can merge if updating same elements with same property types
    const thisIds = new Set(this.updates.map(u => u.id));
    const otherIds = new Set(other.updates.map(u => u.id));
    
    // Must be same elements
    if (thisIds.size !== otherIds.size) return false;
    for (const id of thisIds) {
      if (!otherIds.has(id)) return false;
    }
    
    return true;
  }
  
  mergeWith(other: Command): Command {
    if (!(other instanceof UpdateElementCommand)) return this;
    
    // Merge: keep original 'before', use new 'after'
    const mergedUpdates = this.updates.map(update => {
      const otherUpdate = other.updates.find(u => u.id === update.id);
      return {
        id: update.id,
        before: update.before, // Keep original before
        after: otherUpdate?.after || update.after, // Use latest after
      };
    });
    
    return new UpdateElementCommand(mergedUpdates, this.description);
  }
}

// ============================================
// ADD ELEMENT COMMAND
// ============================================

export class AddElementCommand extends BaseCommand {
  readonly type = 'ADD_ELEMENT';
  readonly description: string;
  
  private element: EditorElement;
  
  constructor(element: EditorElement) {
    super();
    this.element = element;
    this.description = `Add ${element.type}`;
  }
  
  execute(): CommandResult {
    const store = this.getStore();
    
    try {
      store.addElement(this.element);
      return {
        success: true,
        affectedIds: [this.element.id],
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }
  
  undo(): CommandResult {
    const store = this.getStore();
    
    try {
      store.deleteElements([this.element.id]);
      return {
        success: true,
        affectedIds: [this.element.id],
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }
}

// ============================================
// DELETE ELEMENTS COMMAND
// ============================================

export class DeleteElementsCommand extends BaseCommand {
  readonly type = 'DELETE_ELEMENTS';
  readonly description: string;
  
  private elements: EditorElement[];
  private ids: ID[];
  
  constructor(elements: EditorElement[]) {
    super();
    this.elements = elements;
    this.ids = elements.map(e => e.id);
    this.description = `Delete ${elements.length} element(s)`;
  }
  
  execute(): CommandResult {
    const store = this.getStore();
    
    try {
      store.deleteElements(this.ids);
      return {
        success: true,
        affectedIds: this.ids,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }
  
  undo(): CommandResult {
    const store = this.getStore();
    
    try {
      // Re-add elements in original order
      this.elements.forEach(element => {
        store.addElement(element);
      });
      return {
        success: true,
        affectedIds: this.ids,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }
}

// ============================================
// COMPOSITE COMMAND (for batching)
// ============================================

export class CompositeCommand extends BaseCommand {
  readonly type = 'COMPOSITE';
  readonly description: string;
  
  private commands: Command[];
  
  constructor(commands: Command[], description: string) {
    super();
    this.commands = commands;
    this.description = description;
  }
  
  execute(): CommandResult {
    const affectedIds: ID[] = [];
    
    for (const command of this.commands) {
      const result = command.execute();
      if (!result.success) {
        // Rollback executed commands
        this.undoExecuted(this.commands.indexOf(command));
        return result;
      }
      if (result.affectedIds) {
        affectedIds.push(...result.affectedIds);
      }
    }
    
    return { success: true, affectedIds };
  }
  
  undo(): CommandResult {
    const affectedIds: ID[] = [];
    
    // Undo in reverse order
    for (let i = this.commands.length - 1; i >= 0; i--) {
      const result = this.commands[i].undo();
      if (!result.success) {
        return result;
      }
      if (result.affectedIds) {
        affectedIds.push(...result.affectedIds);
      }
    }
    
    return { success: true, affectedIds };
  }
  
  private undoExecuted(upToIndex: number): void {
    for (let i = upToIndex - 1; i >= 0; i--) {
      this.commands[i].undo();
    }
  }
}

// ============================================
// GROUP COMMANDS
// ============================================

export class GroupElementsCommand extends BaseCommand {
  readonly type = 'GROUP_ELEMENTS';
  readonly description = 'Group elements';
  
  private ids: ID[];
  private groupId: string | null = null;
  
  constructor(ids: ID[]) {
    super();
    this.ids = ids;
  }
  
  execute(): CommandResult {
    const store = this.getStore();
    
    try {
      this.groupId = store.groupElements(this.ids);
      return {
        success: !!this.groupId,
        affectedIds: this.ids,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }
  
  undo(): CommandResult {
    const store = this.getStore();
    
    try {
      if (this.groupId) {
        store.ungroupElements(this.groupId);
      }
      return {
        success: true,
        affectedIds: this.ids,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }
}

export class UngroupElementsCommand extends BaseCommand {
  readonly type = 'UNGROUP_ELEMENTS';
  readonly description = 'Ungroup elements';
  
  private groupId: string;
  private elementIds: ID[] = [];
  
  constructor(groupId: string) {
    super();
    this.groupId = groupId;
  }
  
  execute(): CommandResult {
    const store = this.getStore();
    
    try {
      // Store element IDs before ungrouping
      const elements = store.getGroupElements(this.groupId);
      this.elementIds = elements.map(e => e.id);
      
      store.ungroupElements(this.groupId);
      return {
        success: true,
        affectedIds: this.elementIds,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }
  
  undo(): CommandResult {
    const store = this.getStore();
    
    try {
      // Re-group with same group ID
      this.elementIds.forEach(id => {
        store.updateElement(id, { groupId: this.groupId });
      });
      return {
        success: true,
        affectedIds: this.elementIds,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }
}

/**
 * Command History Manager
 * 
 * Manages the undo/redo stack with support for:
 * - Command merging (e.g., multiple typing keystrokes = 1 undo)
 * - Maximum history size
 * - History persistence (optional)
 */

import { create } from 'zustand';
import type { Command } from './Command';

// ============================================
// HISTORY STATE
// ============================================

interface CommandHistoryState {
  /** Past commands (can be undone) */
  past: Command[];
  
  /** Future commands (can be redone) */
  future: Command[];
  
  /** Maximum number of commands to keep */
  maxSize: number;
  
  /** Whether currently executing a command (prevents recursion) */
  isExecuting: boolean;
}

interface CommandHistoryActions {
  /** Execute a command and add to history */
  execute: (command: Command) => boolean;
  
  /** Undo the last command */
  undo: () => boolean;
  
  /** Redo the last undone command */
  redo: () => boolean;
  
  /** Check if undo is available */
  canUndo: () => boolean;
  
  /** Check if redo is available */
  canRedo: () => boolean;
  
  /** Clear all history */
  clear: () => void;
  
  /** Get the last command description */
  getLastCommandDescription: () => string | null;
  
  /** Get the next redo command description */
  getNextRedoDescription: () => string | null;
  
  /** Set max history size */
  setMaxSize: (size: number) => void;
}

type CommandHistoryStore = CommandHistoryState & CommandHistoryActions;

// ============================================
// HISTORY STORE
// ============================================

const DEFAULT_MAX_SIZE = 100;

export const useCommandHistory = create<CommandHistoryStore>((set, get) => ({
  past: [],
  future: [],
  maxSize: DEFAULT_MAX_SIZE,
  isExecuting: false,
  
  execute: (command: Command) => {
    const state = get();
    
    // Prevent recursive execution
    if (state.isExecuting) {
      console.warn('Command execution blocked: already executing');
      return false;
    }
    
    set({ isExecuting: true });
    
    try {
      // Execute the command
      const result = command.execute();
      
      if (!result.success) {
        console.error('Command execution failed:', result.error);
        set({ isExecuting: false });
        return false;
      }
      
      // Check if we can merge with the last command
      const lastCommand = state.past[state.past.length - 1];
      let newPast: Command[];
      
      if (lastCommand && command.canMergeWith?.(lastCommand)) {
        // Merge with last command
        const mergedCommand = lastCommand.mergeWith?.(command) || command;
        newPast = [...state.past.slice(0, -1), mergedCommand];
      } else {
        // Add as new command
        newPast = [...state.past, command];
      }
      
      // Trim history if needed
      if (newPast.length > state.maxSize) {
        newPast = newPast.slice(newPast.length - state.maxSize);
      }
      
      set({
        past: newPast,
        future: [], // Clear redo stack on new action
        isExecuting: false,
      });
      
      return true;
    } catch (error) {
      console.error('Command execution error:', error);
      set({ isExecuting: false });
      return false;
    }
  },
  
  undo: () => {
    const state = get();
    
    if (state.past.length === 0 || state.isExecuting) {
      return false;
    }
    
    set({ isExecuting: true });
    
    try {
      const command = state.past[state.past.length - 1];
      const result = command.undo();
      
      if (!result.success) {
        console.error('Undo failed:', result.error);
        set({ isExecuting: false });
        return false;
      }
      
      set({
        past: state.past.slice(0, -1),
        future: [command, ...state.future],
        isExecuting: false,
      });
      
      return true;
    } catch (error) {
      console.error('Undo error:', error);
      set({ isExecuting: false });
      return false;
    }
  },
  
  redo: () => {
    const state = get();
    
    if (state.future.length === 0 || state.isExecuting) {
      return false;
    }
    
    set({ isExecuting: true });
    
    try {
      const command = state.future[0];
      const result = command.redo();
      
      if (!result.success) {
        console.error('Redo failed:', result.error);
        set({ isExecuting: false });
        return false;
      }
      
      set({
        past: [...state.past, command],
        future: state.future.slice(1),
        isExecuting: false,
      });
      
      return true;
    } catch (error) {
      console.error('Redo error:', error);
      set({ isExecuting: false });
      return false;
    }
  },
  
  canUndo: () => {
    const state = get();
    return state.past.length > 0 && !state.isExecuting;
  },
  
  canRedo: () => {
    const state = get();
    return state.future.length > 0 && !state.isExecuting;
  },
  
  clear: () => {
    set({ past: [], future: [] });
  },
  
  getLastCommandDescription: () => {
    const state = get();
    const lastCommand = state.past[state.past.length - 1];
    return lastCommand?.description || null;
  },
  
  getNextRedoDescription: () => {
    const state = get();
    const nextCommand = state.future[0];
    return nextCommand?.description || null;
  },
  
  setMaxSize: (size: number) => {
    set(state => ({
      maxSize: size,
      past: state.past.slice(-size),
    }));
  },
}));

// ============================================
// CONVENIENCE HOOKS
// ============================================

export function useCanUndo(): boolean {
  return useCommandHistory(state => state.past.length > 0 && !state.isExecuting);
}

export function useCanRedo(): boolean {
  return useCommandHistory(state => state.future.length > 0 && !state.isExecuting);
}

export function useUndoDescription(): string | null {
  return useCommandHistory(state => state.past[state.past.length - 1]?.description || null);
}

export function useRedoDescription(): string | null {
  return useCommandHistory(state => state.future[0]?.description || null);
}

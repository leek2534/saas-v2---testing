/**
 * src/features/test-builder/storeV2.ts
 *
 * Composed Zustand store that combines the domain slices.
 * This file MUST exist because many components import it via ./store (barrel).
 *
 * If you see TS errors about missing exports from slice files, open each slice
 * in src/features/test-builder/domain/*Slice.ts and ensure it exports the expected
 * `createXSlice` function used below.
 */

import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';

// Slice creators (expected exports from your domain folder)
import { createLayoutSlice } from './domain/layoutSlice';
import { createSelectionSlice } from './domain/selectionSlice';
import { createHistorySlice } from './domain/historySlice';
import { createUISlice } from './domain/uiSlice';
import { createFunnelSlice } from './domain/funnelSlice';
import { createClipboardSlice } from './domain/clipboardSlice';

type AnyStateCreator = any;

// Compose slices into a single store type (keep as `any` to avoid compile blockers)
export type TestBuilderStore = any;

// Main store hook used everywhere
export const useTestBuilderStore = create<TestBuilderStore>()(
  subscribeWithSelector(((set: any, get: any, api: any) => ({
    ...(createLayoutSlice as AnyStateCreator)(set, get, api),
    ...(createSelectionSlice as AnyStateCreator)(set, get, api),
    ...(createHistorySlice as AnyStateCreator)(set, get, api),
    ...(createUISlice as AnyStateCreator)(set, get, api),
    ...(createFunnelSlice as AnyStateCreator)(set, get, api),
    ...(createClipboardSlice as AnyStateCreator)(set, get, api),
  })) as any)
);

// Optional convenience selectors (safe, used by some components)
export const useSelection = <T,>(selector: (s: any) => T) => useTestBuilderStore(selector);
export const useHistory = <T,>(selector: (s: any) => T) => useTestBuilderStore(selector);
export const useUI = <T,>(selector: (s: any) => T) => useTestBuilderStore(selector);
export const useLayout = <T,>(selector: (s: any) => T) => useTestBuilderStore(selector);
export const useFunnel = <T,>(selector: (s: any) => T) => useTestBuilderStore(selector);
export const useClipboard = <T,>(selector: (s: any) => T) => useTestBuilderStore(selector);

export default useTestBuilderStore;

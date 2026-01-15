/**
 * src/features/test-builder/store.ts
 * Compatibility barrel. Keep all feature imports stable: `import { useTestBuilderV2Store } from './store'`
 */
export { useTestBuilderStore as useTestBuilderV2Store, useTestBuilderStore } from './storeV2';
export type { TestBuilderStore } from './storeV2';

// Re-export shared types used across the feature (optional but common).
export type {
  Section,
  Row,
  Column,
  Element,
  ElementType,
  HoverType,
  ViewMode,
  Viewport,
  SaveStatus,
  Funnel,
  FunnelStep,
  StepType,
  PopupConfig,
} from '@/types';

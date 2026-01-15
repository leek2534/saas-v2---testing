import { StateCreator } from 'zustand';

export interface FunnelSlice {
  funnelId: string | null;
  currentStepId: string | null;
  steps: any[];
  setFunnel: (funnelId: string) => void;
  setCurrentStep: (stepId: string) => void;
  addStep: (step: any) => void;
  updateStep: (stepId: string, updates: any) => void;
  removeStep: (stepId: string) => void;
  reorderSteps: (stepIds: string[]) => void;
}

export const createFunnelSlice: StateCreator<FunnelSlice> = (set) => ({
  funnelId: null,
  currentStepId: null,
  steps: [],
  setFunnel: (funnelId) => set({ funnelId }),
  setCurrentStep: (stepId) => set({ currentStepId: stepId }),
  addStep: (step) =>
    set((state) => ({
      steps: [...state.steps, step],
    })),
  updateStep: (stepId, updates) =>
    set((state) => ({
      steps: state.steps.map((s) =>
        s.id === stepId ? { ...s, ...updates } : s
      ),
    })),
  removeStep: (stepId) =>
    set((state) => ({
      steps: state.steps.filter((s) => s.id !== stepId),
    })),
  reorderSteps: (stepIds) =>
    set((state) => ({
      steps: stepIds.map((id) => state.steps.find((s) => s.id === id)).filter(Boolean),
    })),
});

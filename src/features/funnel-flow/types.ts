import { Id } from "@/convex/_generated/dataModel";
import type { CheckoutConfig, OfferConfig } from "../funnel-builder-v3/types/payments";

/**
 * Multi-step funnel flow system
 * Separate from the page builder (funnel-builder-v3)
 */

export type StepKind = "checkout" | "offer" | "thank_you" | "page";

export interface BaseStep {
  id: string;
  name: string;
  kind: StepKind;
  pageId?: string; // Reference to a page built with funnel-builder-v3
}

export interface CheckoutStep extends BaseStep {
  kind: "checkout";
  config: CheckoutConfig;
}

export interface OfferStep extends BaseStep {
  kind: "offer";
  config: OfferConfig;
}

export interface ThankYouStep extends BaseStep {
  kind: "thank_you";
  config: {
    message?: string;
  };
}

export interface PageStep extends BaseStep {
  kind: "page";
  config: {
    nextStepId?: string | null;
  };
}

export type FunnelStep = CheckoutStep | OfferStep | ThankYouStep | PageStep;

export interface Funnel {
  _id: Id<"funnels">;
  orgId: Id<"teams">;
  name: string;
  handle: string;
  status: "draft" | "active" | "archived";
  steps: FunnelStep[];
  entryStepId: string;
  _creationTime: number;
  _updatedTime?: number;
}

export interface FunnelFlowState {
  funnel: Funnel | null;
  currentStepId: string | null;
  selectedStepId: string | null;
  
  // Actions
  loadFunnel: (funnelId: Id<"funnels">) => Promise<void>;
  setSelectedStep: (stepId: string | null) => void;
  updateStepConfig: (stepId: string, config: any) => Promise<void>;
  addStep: (step: Partial<FunnelStep>, afterStepId?: string) => void;
  removeStep: (stepId: string) => void;
  reorderSteps: (stepIds: string[]) => void;
}

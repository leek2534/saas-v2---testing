import { Id } from "@/convex/_generated/dataModel";

/**
 * Step configuration types for funnel steps
 * Stored as JSON string in funnelSteps.config
 * Based on Funnel v2 Block Config Explainer spec
 */

export type CheckoutMode = "payment_intent" | "checkout_session";

export interface CheckoutConfig {
  mode: CheckoutMode;
  
  // What is purchased
  priceIds: string[];      // Id<"catalogPrices"> serialized
  quantities: number[];    // same length as priceIds
  
  // One-click offers depend on saving a reusable payment method
  enableOneClickOffers: boolean; // -> savePaymentMethod boolean in createPaymentIntent
  
  // Routing
  onSuccessStepId?: string | null; // Step to navigate to after successful checkout
  
  // UI knobs (optional)
  ui?: {
    layout?: "compact" | "standard" | "wide";
    showTrustBadges?: boolean;
    showGuarantee?: boolean;
    showSecurityNote?: boolean;
  };
  
  // Stripe Appearance customization
  appearance?: {
    colorPrimary?: string;
    colorBackground?: string;
    colorText?: string;
    colorDanger?: string;
    fontFamily?: string;
    borderRadius?: string;
  };
  
  // Data capture (optional)
  collectEmail?: "required" | "optional" | "hidden";
  collectName?: boolean;
}

export interface OfferConfig {
  offerId: string;         // stable ID for analytics / dedupe
  priceId: string;         // Id<"catalogPrices"> serialized
  quantity?: number;       // default 1
  
  // Copy
  headline?: string;
  subheadline?: string;
  bullets?: string[];
  imageUrl?: string;
  
  // Routing
  onAcceptStepId?: string | null;
  onDeclineStepId?: string | null;
  
  // Rules
  requireCompletedCheckout?: boolean; // default true
  requireOneTimeCheckout?: boolean;   // default true
  
  // UI knobs
  ui?: {
    layout?: "split" | "stacked" | "minimal";
    badgeText?: string;
  };
}

export type StepConfig = CheckoutConfig | OfferConfig;

/**
 * Runtime context injected into funnel pages
 */
export interface FunnelRuntimeContext {
  funnelId: Id<"funnels">;
  stepId: Id<"funnelSteps">;
  stepType: "checkout" | "offer" | "thankyou" | "page";
  config: StepConfig | null;
  runId: string;
  orderState?: {
    orderId?: string;
    paymentMethodId?: string;
    customerEmail?: string;
  };
}

/**
 * Checkout attempt tracking
 */
export interface CheckoutAttempt {
  _id: Id<"checkoutAttempts">;
  orgId: Id<"teams">;
  funnelId: Id<"funnels">;
  stepId: Id<"funnelSteps">;
  runId: string;
  customerEmail?: string;
  stripePaymentIntentId?: string;
  stripeCheckoutSessionId?: string;
  paymentMethodId?: string;
  amount: number;
  currency: string;
  status: "pending" | "completed" | "failed";
  billingType: "one_time" | "recurring";
  _creationTime: number;
}

/**
 * Funnel run tracking
 */
export interface FunnelRun {
  _id: Id<"funnelRuns">;
  orgId: Id<"teams">;
  funnelId: Id<"funnels">;
  currentStepId: Id<"funnelSteps">;
  customerEmail?: string;
  checkoutAttemptId?: Id<"checkoutAttempts">;
  status: "in_progress" | "completed" | "abandoned";
  _creationTime: number;
}

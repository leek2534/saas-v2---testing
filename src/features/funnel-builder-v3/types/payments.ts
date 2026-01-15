import { Id } from "@/convex/_generated/dataModel";

/**
 * Checkout Page Configuration
 */
export type CheckoutConfig = {
  items: Array<{
    catalogPriceId: Id<"catalogPrices">;
    quantity: number;
  }>;
  
  orderBumps: Array<{
    bumpId: string;
    catalogPriceId: Id<"catalogPrices">;
    headline: string;
    description: string;
    imageId?: Id<"_storage">;
  }>;

  // Checkout Screens (internal wizard)
  screensMode: 1 | 2 | 3; // 1=all-in-one, 2=details→payment, 3=products→details→payment

  // One-time only
  oneClickOffersEnabled: boolean;

  // Subscription only
  subscription: {
    experience: "embedded_checkout" | "custom_checkout" | "hosted_redirect";
    collectShipping: boolean;
    allowedShippingCountries?: string[];
    returnPath: string; // e.g. /f/:funnelId/return
  };

  // Routing
  onSuccessStepId: string | null;
};

/**
 * Offer Page Configuration
 */
export type OfferConfig = {
  kind: "oto" | "upsell" | "downsell";
  catalogPriceId: Id<"catalogPrices"> | null;
  oneClickEnabled: boolean;

  routing: {
    onAcceptStepId: string | null;
    onDeclineStepId: string | null;
  };

  template: {
    hasAcceptButton: boolean;
    hasDeclineButton: boolean;
  };
};

/**
 * Price with sync status
 */
export type PriceWithStatus = {
  _id: Id<"catalogPrices">;
  productId: Id<"catalogProducts">;
  nickname: string;
  currency: string;
  amount: number;
  billing: {
    type: "one_time";
  } | {
    type: "recurring";
    interval: "month" | "year";
    intervalCount: number;
  };
  active: boolean;
  isDefault: boolean;
  stripePriceId?: string;
  
  // Computed status
  syncStatus: "synced" | "needs_sync" | "syncing";
  compatible: boolean;
  incompatibilityReason?: string;
};

/**
 * Product with prices for picker
 */
export type ProductWithPrices = {
  _id: Id<"catalogProducts">;
  name: string;
  status: "draft" | "active" | "archived";
  type: "digital" | "physical" | "service";
  shortDescription?: string;
  defaultImageId?: Id<"_storage">;
  stripeProductId?: string;
  prices: PriceWithStatus[];
};

/**
 * Billing type for compatibility checking
 */
export type BillingType = "one_time" | "recurring";

/**
 * Readiness issue severity
 */
export type IssueSeverity = "blocker" | "warning" | "info";

/**
 * Readiness issue
 */
export type ReadinessIssue = {
  id: string;
  severity: IssueSeverity;
  scope: "global" | "step";
  stepId?: string;
  title: string;
  description: string;
  fixAction?: FixAction;
};

/**
 * Fix action types
 */
export type FixAction = 
  | { type: "open_payments_settings" }
  | { type: "open_catalog_product"; productId: Id<"catalogProducts"> }
  | { type: "sync_options"; priceIds: Id<"catalogPrices">[] }
  | { type: "enable_one_click"; stepId: string }
  | { type: "repair_offer_routing"; stepId: string }
  | { type: "insert_offer_buttons"; stepId: string }
  | { type: "split_checkout_by_billing"; stepId: string };

/**
 * Step readiness
 */
export type StepReadiness = {
  stepId: string;
  badges: {
    mode?: string;
    sync?: "synced" | "needs_sync";
    env?: "test" | "live";
    charge?: "immediate" | "deferred";
  };
  checklist: Array<{
    id: string;
    status: "ok" | "warn" | "fail";
    label: string;
    fixAction?: FixAction;
  }>;
  issues: ReadinessIssue[];
};

/**
 * Funnel readiness
 */
export type FunnelReadiness = {
  publishBlocked: boolean;
  globalIssues: ReadinessIssue[];
  steps: Map<string, StepReadiness>;
};

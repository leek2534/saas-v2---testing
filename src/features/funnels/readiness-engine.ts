import { Id } from "@/convex/_generated/dataModel";
import type { CheckoutConfig, OfferConfig } from "./types";

export interface ReadinessIssue {
  id: string;
  severity: "blocker" | "warning" | "info";
  scope: "global" | "step";
  stepId?: string;
  title: string;
  description: string;
  fixAction?: FixAction;
}

export type FixAction =
  | { type: "OPEN_PAYMENTS_SETTINGS" }
  | { type: "OPEN_STEP"; stepId: string }
  | { type: "OPEN_PRICE_PICKER"; stepId: string }
  | { type: "SYNC_REQUIRED_PRICES"; priceIds: Id<"catalogPrices">[] }
  | { type: "ENABLE_ONE_CLICK"; stepId: string }
  | { type: "REPAIR_OFFER_ROUTING"; stepId: string }
  | { type: "INSERT_OFFER_BUTTONS"; stepId: string }
  | { type: "SPLIT_CHECKOUT_BY_BILLING"; stepId: string };

export interface StepReadiness {
  stepId: string;
  badges: {
    mode?: "one-time" | "subscription" | "mixed";
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
}

export interface FunnelReadiness {
  publishBlocked: boolean;
  globalIssues: ReadinessIssue[];
  stepReadiness: Map<string, StepReadiness>;
}

interface FunnelStep {
  _id: string;
  type: "checkout" | "offer" | "thankyou" | "page";
  name: string;
  config?: string;
}

interface Price {
  _id: Id<"catalogPrices">;
  stripePriceId?: string;
  active: boolean;
  billing: { type: "one_time" } | { type: "recurring"; interval: string; intervalCount: number };
}

export async function computeFunnelReadiness(
  steps: FunnelStep[],
  prices: Price[],
  hasStripeConnected: boolean
): Promise<FunnelReadiness> {
  const globalIssues: ReadinessIssue[] = [];
  const stepReadiness = new Map<string, StepReadiness>();

  // Global: Stripe connected
  if (!hasStripeConnected) {
    globalIssues.push({
      id: "no-stripe",
      severity: "blocker",
      scope: "global",
      title: "Stripe Not Connected",
      description: "Connect your Stripe account to accept payments",
      fixAction: { type: "OPEN_PAYMENTS_SETTINGS" },
    });
  }

  // Check each step
  for (const step of steps) {
    const issues: ReadinessIssue[] = [];
    let config: CheckoutConfig | OfferConfig | null = null;

    if (step.config) {
      try {
        config = JSON.parse(step.config);
      } catch {
        config = null;
      }
    }

    if (step.type === "checkout" && config) {
      const checkoutConfig = config as CheckoutConfig;
      
      // Check has items
      if (!checkoutConfig.items || checkoutConfig.items.length === 0) {
        issues.push({
          id: `empty-checkout-${step._id}`,
          severity: "warning",
          scope: "step",
          stepId: step._id,
          title: "Empty Checkout",
          description: "No products selected for checkout",
          fixAction: { type: "OPEN_PRICE_PICKER", stepId: step._id },
        });
      }

      // Check all prices exist, active, and synced
      const allPriceIds = [
        ...checkoutConfig.items.map(i => i.catalogPriceId),
        ...checkoutConfig.orderBumps.map(b => b.catalogPriceId),
      ];

      const unsyncedPrices: Id<"catalogPrices">[] = [];
      const billingTypes = new Set<string>();

      for (const priceId of allPriceIds) {
        const price = prices.find(p => p._id === priceId);
        
        if (!price) {
          issues.push({
            id: `missing-price-${priceId}`,
            severity: "blocker",
            scope: "step",
            stepId: step._id,
            title: "Price Not Found",
            description: `Price ${priceId} does not exist`,
          });
          continue;
        }

        if (!price.active) {
          issues.push({
            id: `inactive-price-${priceId}`,
            severity: "blocker",
            scope: "step",
            stepId: step._id,
            title: "Inactive Price",
            description: `Price ${priceId} is not active`,
          });
          continue;
        }

        if (!price.stripePriceId) {
          unsyncedPrices.push(priceId);
        }

        billingTypes.add(price.billing.type);
      }

      // Check for unsynced prices
      if (unsyncedPrices.length > 0) {
        issues.push({
          id: `unsynced-prices-${step._id}`,
          severity: "blocker",
          scope: "step",
          stepId: step._id,
          title: "Unsynced Prices",
          description: `${unsyncedPrices.length} price(s) not synced to Stripe`,
          fixAction: { type: "SYNC_REQUIRED_PRICES", priceIds: unsyncedPrices },
        });
      }

      // Check for mixed billing
      if (billingTypes.size > 1) {
        issues.push({
          id: `mixed-billing-${step._id}`,
          severity: "blocker",
          scope: "step",
          stepId: step._id,
          title: "Mixed Billing Types",
          description: "Cannot mix one-time and subscription in same checkout",
          fixAction: { type: "SPLIT_CHECKOUT_BY_BILLING", stepId: step._id },
        });
      }
    }

    if (step.type === "offer" && config) {
      const offerConfig = config as OfferConfig;

      // Check has price
      if (!offerConfig.catalogPriceId) {
        issues.push({
          id: `no-offer-price-${step._id}`,
          severity: "blocker",
          scope: "step",
          stepId: step._id,
          title: "No Price Selected",
          description: "Offer needs a product price",
          fixAction: { type: "OPEN_PRICE_PICKER", stepId: step._id },
        });
      } else {
        // Check price synced
        const price = prices.find(p => p._id === offerConfig.catalogPriceId);
        if (price && !price.stripePriceId) {
          issues.push({
            id: `unsynced-offer-${step._id}`,
            severity: "blocker",
            scope: "step",
            stepId: step._id,
            title: "Unsynced Offer Price",
            description: "Offer price must be synced to Stripe",
            fixAction: { type: "SYNC_REQUIRED_PRICES", priceIds: [offerConfig.catalogPriceId] },
          });
        }

        // Check one-time only
        if (price && price.billing.type !== "one_time") {
          issues.push({
            id: `subscription-offer-${step._id}`,
            severity: "blocker",
            scope: "step",
            stepId: step._id,
            title: "Subscription Offers Not Supported",
            description: "Offers only support one-time payments (Day-1)",
          });
        }
      }

      // Check routing
      if (!offerConfig.onAcceptStepId || !offerConfig.onDeclineStepId) {
        issues.push({
          id: `incomplete-routing-${step._id}`,
          severity: "warning",
          scope: "step",
          stepId: step._id,
          title: "Incomplete Routing",
          description: "Offer needs both accept and decline routes",
          fixAction: { type: "REPAIR_OFFER_ROUTING", stepId: step._id },
        });
      }
    }

    // Generate badges
    const badges = generateBadges(step, config, prices);

    // Generate checklist
    const checklist = issues.map(issue => ({
      id: issue.id,
      status: issue.severity === "blocker" ? "fail" as const : 
              issue.severity === "warning" ? "warn" as const : "ok" as const,
      label: issue.title,
      fixAction: issue.fixAction,
    }));

    stepReadiness.set(step._id, {
      stepId: step._id,
      badges,
      checklist,
      issues,
    });
  }

  const allIssues = [
    ...globalIssues,
    ...Array.from(stepReadiness.values()).flatMap(s => s.issues),
  ];

  const publishBlocked = allIssues.some(i => i.severity === "blocker");

  return {
    publishBlocked,
    globalIssues,
    stepReadiness,
  };
}

function generateBadges(
  step: FunnelStep,
  config: CheckoutConfig | OfferConfig | null,
  prices: Price[]
): StepReadiness["badges"] {
  const badges: StepReadiness["badges"] = {};

  if (step.type === "checkout" && config) {
    const checkoutConfig = config as CheckoutConfig;
    const allPriceIds = [
      ...checkoutConfig.items.map(i => i.catalogPriceId),
      ...checkoutConfig.orderBumps.map(b => b.catalogPriceId),
    ];

    const billingTypes = new Set<string>();
    let allSynced = true;

    for (const priceId of allPriceIds) {
      const price = prices.find(p => p._id === priceId);
      if (price) {
        billingTypes.add(price.billing.type);
        if (!price.stripePriceId) allSynced = false;
      }
    }

    if (billingTypes.size > 1) {
      badges.mode = "mixed";
    } else if (billingTypes.has("recurring")) {
      badges.mode = "subscription";
    } else if (billingTypes.has("one_time")) {
      badges.mode = "one-time";
    }

    badges.sync = allSynced ? "synced" : "needs_sync";
    badges.env = "test"; // Would come from workspace settings
    badges.charge = "immediate";
  }

  if (step.type === "offer" && config) {
    const offerConfig = config as OfferConfig;
    if (offerConfig.catalogPriceId) {
      const price = prices.find(p => p._id === offerConfig.catalogPriceId);
      badges.sync = price?.stripePriceId ? "synced" : "needs_sync";
    }
    badges.env = "test";
    badges.charge = "immediate";
  }

  return badges;
}

import type { ReadinessIssue, StepReadiness, FunnelReadiness, CheckoutConfig, OfferConfig, PriceWithStatus } from "../types/payments";
import { Id } from "@/convex/_generated/dataModel";

export interface FunnelStep {
  id: string;
  kind: "checkout" | "offer" | "thank_you" | "page";
  config?: CheckoutConfig | OfferConfig;
}

export interface Funnel {
  _id: string;
  steps: FunnelStep[];
  publishedAt?: number;
}

export class ReadinessEngine {
  private funnel: Funnel;
  private prices: Map<Id<"catalogPrices">, PriceWithStatus>;

  constructor(funnel: Funnel, prices: PriceWithStatus[]) {
    this.funnel = funnel;
    this.prices = new Map(prices.map(p => [p._id, p]));
  }

  checkFunnelReadiness(): FunnelReadiness {
    const globalIssues: ReadinessIssue[] = [];
    const stepReadinessMap = new Map<string, StepReadiness>();

    // Check each step
    for (const step of this.funnel.steps) {
      const stepIssues = this.checkStepReadiness(step);
      
      stepReadinessMap.set(step.id, {
        stepId: step.id,
        badges: this.generateBadges(step),
        checklist: this.generateChecklist(stepIssues),
        issues: stepIssues,
      });
    }

    // Check for global issues
    const workspaceIssues = this.checkWorkspaceSetup();
    globalIssues.push(...workspaceIssues);

    const allIssues = [
      ...globalIssues,
      ...Array.from(stepReadinessMap.values()).flatMap(s => s.issues),
    ];

    return {
      publishBlocked: allIssues.some(i => i.severity === "blocker"),
      globalIssues,
      steps: stepReadinessMap,
    };
  }

  private checkStepReadiness(step: FunnelStep): ReadinessIssue[] {
    const issues: ReadinessIssue[] = [];

    if (step.kind === "checkout" && step.config) {
      const checkoutConfig = step.config as CheckoutConfig;
      
      // Check for mixed billing types
      const billingTypes = new Set<string>();
      const allItems = [
        ...checkoutConfig.items,
        ...checkoutConfig.orderBumps.map(b => ({ catalogPriceId: b.catalogPriceId, quantity: 1 })),
      ];

      for (const item of allItems) {
        const price = this.prices.get(item.catalogPriceId);
        if (price) {
          billingTypes.add(price.billing.type);
        }
      }

      if (billingTypes.size > 1) {
        issues.push({
          id: `mixed-billing-${step.id}`,
          severity: "blocker",
          scope: "step",
          stepId: step.id,
          title: "Mixed Billing Types",
          description: "Cannot mix one-time and subscription items in the same checkout",
          fixAction: {
            type: "split_checkout_by_billing",
            stepId: step.id,
          },
        });
      }

      // Check for unsynced prices
      for (const item of allItems) {
        const price = this.prices.get(item.catalogPriceId);
        if (price && !price.stripePriceId) {
          issues.push({
            id: `unsync-${item.catalogPriceId}`,
            severity: "blocker",
            scope: "step",
            stepId: step.id,
            title: "Unsynced Price",
            description: `Price needs to be synced to Stripe before checkout can work`,
            fixAction: {
              type: "sync_options",
              priceIds: [item.catalogPriceId],
            },
          });
        }
      }

      // Check for empty checkout
      if (allItems.length === 0) {
        issues.push({
          id: `empty-checkout-${step.id}`,
          severity: "warning",
          scope: "step",
          stepId: step.id,
          title: "Empty Checkout",
          description: "No items selected for checkout",
        });
      }
    }

    if (step.kind === "offer" && step.config) {
      const offerConfig = step.config as OfferConfig;

      if (!offerConfig.catalogPriceId) {
        issues.push({
          id: `no-price-${step.id}`,
          severity: "blocker",
          scope: "step",
          stepId: step.id,
          title: "No Price Selected",
          description: "Offer needs a price to be selected",
        });
        return issues;
      }

      // Check if offer price is synced
      const price = this.prices.get(offerConfig.catalogPriceId);
      if (price && !price.stripePriceId) {
        issues.push({
          id: `unsync-offer-${step.id}`,
          severity: "blocker",
          scope: "step",
          stepId: step.id,
          title: "Unsynced Offer Price",
          description: "Offer price must be synced to Stripe",
          fixAction: {
            type: "sync_options",
            priceIds: [offerConfig.catalogPriceId],
          },
        });
      }

      // Check if offer is one-time (required for one-click)
      if (price && price.billing.type !== "one_time") {
        issues.push({
          id: `subscription-offer-${step.id}`,
          severity: "blocker",
          scope: "step",
          stepId: step.id,
          title: "Subscription Offer Not Supported",
          description: "One-click offers only support one-time payments",
        });
      }

      // Check routing
      if (!offerConfig.routing.onAcceptStepId || !offerConfig.routing.onDeclineStepId) {
        issues.push({
          id: `incomplete-routing-${step.id}`,
          severity: "warning",
          scope: "step",
          stepId: step.id,
          title: "Incomplete Routing",
          description: "Offer needs both accept and decline routes configured",
          fixAction: {
            type: "repair_offer_routing",
            stepId: step.id,
          },
        });
      }
    }

    return issues;
  }

  private checkWorkspaceSetup(): ReadinessIssue[] {
    const issues: ReadinessIssue[] = [];

    // Check if Stripe is configured
    // This would typically check environment variables or workspace settings
    // For now, we'll assume it's configured if we have prices with Stripe IDs

    const hasSyncedPrices = Array.from(this.prices.values()).some(p => p.stripePriceId);
    
    if (!hasSyncedPrices && this.funnel.steps.some(s => s.kind === "checkout" || s.kind === "offer")) {
      issues.push({
        id: "no-stripe-sync",
        severity: "blocker",
        scope: "global",
        title: "No Stripe Integration",
        description: "No products have been synced to Stripe yet",
        fixAction: {
          type: "open_payments_settings",
        },
      });
    }

    return issues;
  }

  private generateChecklist(issues: ReadinessIssue[]): Array<{ id: string; status: "ok" | "warn" | "fail"; label: string; fixAction?: any }> {
    return issues.map(issue => ({
      id: issue.id,
      status: issue.severity === "blocker" ? "fail" : issue.severity === "warning" ? "warn" : "ok",
      label: issue.title,
      fixAction: issue.fixAction,
    }));
  }

  private generateBadges(step: FunnelStep): { mode?: string; sync?: "synced" | "needs_sync"; env?: "test" | "live"; charge?: "immediate" | "deferred" } {
    const badges: { mode?: string; sync?: "synced" | "needs_sync"; env?: "test" | "live"; charge?: "immediate" | "deferred" } = {};

    if (step.kind === "checkout" && step.config) {
      const checkoutConfig = step.config as CheckoutConfig;
      const allItems = [
        ...checkoutConfig.items,
        ...checkoutConfig.orderBumps.map(b => ({ catalogPriceId: b.catalogPriceId, quantity: 1 })),
      ];

      // Billing type badge
      const billingTypes = new Set<string>();
      for (const item of allItems) {
        const price = this.prices.get(item.catalogPriceId);
        if (price) {
          billingTypes.add(price.billing.type);
        }
      }

      if (billingTypes.size === 1) {
        const type = Array.from(billingTypes)[0];
        badges.mode = type === "one_time" ? "one-time" : "subscription";
      }

      // Sync status
      const allSynced = allItems.every(item => {
        const price = this.prices.get(item.catalogPriceId);
        return price?.stripePriceId;
      });
      badges.sync = allSynced ? "synced" : "needs_sync";

      // Environment (would come from workspace settings)
      badges.env = "test";

      // Charge timing
      badges.charge = "immediate";
    }

    if (step.kind === "offer" && step.config) {
      const offerConfig = step.config as OfferConfig;
      
      if (offerConfig.catalogPriceId) {
        const price = this.prices.get(offerConfig.catalogPriceId);
        badges.sync = price?.stripePriceId ? "synced" : "needs_sync";
      } else {
        badges.sync = "needs_sync";
      }
      
      badges.mode = "one-click-offer";
      badges.env = "test";
      badges.charge = offerConfig.oneClickEnabled ? "immediate" : "deferred";
    }

    return badges;
  }
}

export function checkFunnelReadiness(funnel: Funnel, prices: PriceWithStatus[]): FunnelReadiness {
  const engine = new ReadinessEngine(funnel, prices);
  return engine.checkFunnelReadiness();
}

import type { FixAction } from "../types/payments";
import { Id } from "@/convex/_generated/dataModel";

export interface ExecuteFixActionParams {
  action: FixAction;
  onNavigate?: (path: string) => void;
  onSyncPrices?: (priceIds: Id<"catalogPrices">[]) => Promise<void>;
  onSplitCheckout?: (stepId: string) => Promise<void>;
  onEnableOneClick?: (stepId: string) => Promise<void>;
  onRepairRouting?: (stepId: string) => Promise<void>;
  onInsertButtons?: (stepId: string) => Promise<void>;
}

export async function executeFixAction(params: ExecuteFixActionParams): Promise<{ success: boolean; message: string }> {
  const { action } = params;

  try {
    switch (action.type) {
      case "open_payments_settings":
        params.onNavigate?.("/settings/payments");
        return {
          success: true,
          message: "Opening payments settings...",
        };

      case "open_catalog_product":
        if ("productId" in action) {
          params.onNavigate?.(`/catalog/products/${action.productId}`);
          return {
            success: true,
            message: "Opening product in catalog...",
          };
        }
        return {
          success: false,
          message: "Product ID not provided",
        };

      case "sync_options":
        if ("priceIds" in action && params.onSyncPrices) {
          await params.onSyncPrices(action.priceIds);
          return {
            success: true,
            message: `Syncing ${action.priceIds.length} price(s) to Stripe...`,
          };
        }
        return {
          success: false,
          message: "Cannot sync prices - handler not provided",
        };

      case "enable_one_click":
        if ("stepId" in action && params.onEnableOneClick) {
          await params.onEnableOneClick(action.stepId);
          return {
            success: true,
            message: "One-click offers enabled",
          };
        }
        return {
          success: false,
          message: "Cannot enable one-click - handler not provided",
        };

      case "repair_offer_routing":
        if ("stepId" in action && params.onRepairRouting) {
          await params.onRepairRouting(action.stepId);
          return {
            success: true,
            message: "Opening offer routing configuration...",
          };
        }
        return {
          success: false,
          message: "Cannot repair routing - handler not provided",
        };

      case "insert_offer_buttons":
        if ("stepId" in action && params.onInsertButtons) {
          await params.onInsertButtons(action.stepId);
          return {
            success: true,
            message: "Inserting offer buttons into page...",
          };
        }
        return {
          success: false,
          message: "Cannot insert buttons - handler not provided",
        };

      case "split_checkout_by_billing":
        if ("stepId" in action && params.onSplitCheckout) {
          await params.onSplitCheckout(action.stepId);
          return {
            success: true,
            message: "Splitting checkout by billing type...",
          };
        }
        return {
          success: false,
          message: "Cannot split checkout - handler not provided",
        };

      default:
        return {
          success: false,
          message: "Unknown fix action type",
        };
    }
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Fix action failed",
    };
  }
}

/**
 * Split checkout helper - separates one-time and subscription items
 * This is the "magic fix" that creates a new subscription checkout page
 */
export interface SplitCheckoutResult {
  oneTimeStepId: string;
  subscriptionStepId: string | null;
  movedItemsCount: number;
}

export async function splitCheckoutByBilling(
  stepId: string,
  getFunnelData: () => Promise<any>,
  updateFunnel: (updates: any) => Promise<void>
): Promise<SplitCheckoutResult> {
  const funnel = await getFunnelData();
  const step = funnel.steps.find((s: any) => s.id === stepId);
  
  if (!step || step.kind !== "checkout") {
    throw new Error("Step not found or not a checkout");
  }

  const checkoutConfig = step.config;
  const allItems = [
    ...checkoutConfig.items,
    ...checkoutConfig.orderBumps,
  ];

  // Separate items by billing type
  const oneTimeItems: any[] = [];
  const subscriptionItems: any[] = [];
  const oneTimeBumps: any[] = [];
  const subscriptionBumps: any[] = [];

  // This would need actual price data to determine billing type
  // For now, this is a placeholder showing the structure
  
  for (const item of checkoutConfig.items) {
    // TODO: Get price and check billing.type
    // For now, assume we have this info
    const isSubscription = false; // placeholder
    if (isSubscription) {
      subscriptionItems.push(item);
    } else {
      oneTimeItems.push(item);
    }
  }

  for (const bump of checkoutConfig.orderBumps) {
    const isSubscription = false; // placeholder
    if (isSubscription) {
      subscriptionBumps.push(bump);
    } else {
      oneTimeBumps.push(bump);
    }
  }

  // Update original checkout to be one-time only
  const updatedOriginalConfig = {
    ...checkoutConfig,
    items: oneTimeItems,
    orderBumps: oneTimeBumps,
    oneClickOffersEnabled: true,
  };

  // Create new subscription checkout if needed
  let subscriptionStepId: string | null = null;
  let movedItemsCount = 0;

  if (subscriptionItems.length > 0 || subscriptionBumps.length > 0) {
    subscriptionStepId = `step_${Date.now()}`;
    movedItemsCount = subscriptionItems.length + subscriptionBumps.length;

    const newSubscriptionStep = {
      id: subscriptionStepId,
      kind: "checkout",
      name: "Subscription Checkout",
      config: {
        items: subscriptionItems,
        orderBumps: subscriptionBumps,
        screensMode: 1,
        oneClickOffersEnabled: false,
        subscription: {
          experience: "embedded_checkout",
          collectShipping: false,
          returnPath: `/f/${funnel._id}/thank-you`,
        },
        onSuccessStepId: checkoutConfig.onSuccessStepId,
      },
    };

    // Insert new step after original
    const stepIndex = funnel.steps.findIndex((s: any) => s.id === stepId);
    const updatedSteps = [
      ...funnel.steps.slice(0, stepIndex + 1),
      newSubscriptionStep,
      ...funnel.steps.slice(stepIndex + 1),
    ];

    await updateFunnel({
      steps: updatedSteps.map((s: any) => 
        s.id === stepId ? { ...s, config: updatedOriginalConfig } : s
      ),
    });
  } else {
    // Just update the original step
    await updateFunnel({
      steps: funnel.steps.map((s: any) => 
        s.id === stepId ? { ...s, config: updatedOriginalConfig } : s
      ),
    });
  }

  return {
    oneTimeStepId: stepId,
    subscriptionStepId,
    movedItemsCount,
  };
}

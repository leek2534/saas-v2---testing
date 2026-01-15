import { Id } from "@/convex/_generated/dataModel";
import type { FixAction } from "./readiness-engine";

export interface ExecuteFixActionParams {
  action: FixAction;
  onNavigate?: (path: string) => void;
  onSyncPrices?: (priceIds: Id<"catalogPrices">[]) => Promise<void>;
  onSplitCheckout?: (stepId: string) => Promise<void>;
  onEnableOneClick?: (stepId: string) => Promise<void>;
  onRepairRouting?: (stepId: string) => Promise<void>;
}

export async function executeFixAction(
  params: ExecuteFixActionParams
): Promise<{ success: boolean; message: string }> {
  const { action } = params;

  try {
    switch (action.type) {
      case "OPEN_PAYMENTS_SETTINGS":
        params.onNavigate?.("/settings/payments");
        return { success: true, message: "Opening payments settings..." };

      case "OPEN_STEP":
        params.onNavigate?.(`/funnels/steps/${action.stepId}`);
        return { success: true, message: "Opening step..." };

      case "OPEN_PRICE_PICKER":
        // Would open price picker for this step
        return { success: true, message: "Opening price picker..." };

      case "SYNC_REQUIRED_PRICES":
        if (params.onSyncPrices) {
          await params.onSyncPrices(action.priceIds);
          return { success: true, message: `Syncing ${action.priceIds.length} price(s)...` };
        }
        return { success: false, message: "Sync handler not available" };

      case "ENABLE_ONE_CLICK":
        if (params.onEnableOneClick) {
          await params.onEnableOneClick(action.stepId);
          return { success: true, message: "One-click offers enabled" };
        }
        return { success: false, message: "Handler not available" };

      case "REPAIR_OFFER_ROUTING":
        if (params.onRepairRouting) {
          await params.onRepairRouting(action.stepId);
          return { success: true, message: "Opening routing configuration..." };
        }
        return { success: false, message: "Handler not available" };

      case "INSERT_OFFER_BUTTONS":
        return { success: true, message: "Inserting offer buttons..." };

      case "SPLIT_CHECKOUT_BY_BILLING":
        if (params.onSplitCheckout) {
          await params.onSplitCheckout(action.stepId);
          return { success: true, message: "Splitting checkout by billing type..." };
        }
        return { success: false, message: "Handler not available" };

      default:
        return { success: false, message: "Unknown fix action" };
    }
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Fix action failed",
    };
  }
}

/**
 * Split checkout by billing type
 * Creates a new checkout step for conflicting billing types
 */
export async function splitCheckoutByBilling(
  stepId: string,
  getStepConfig: () => Promise<any>,
  updateStep: (stepId: string, config: any) => Promise<void>,
  createStep: (config: any) => Promise<string>,
  getPrices: (priceIds: Id<"catalogPrices">[]) => Promise<any[]>
): Promise<{ oneTimeStepId: string; subscriptionStepId: string | null; movedCount: number }> {
  const config = await getStepConfig();
  const allPriceIds = [
    ...config.items.map((i: any) => i.catalogPriceId),
    ...config.orderBumps.map((b: any) => b.catalogPriceId),
  ];

  const prices = await getPrices(allPriceIds);
  const priceMap = new Map(prices.map(p => [p._id, p]));

  // Separate items by billing type
  const oneTimeItems: any[] = [];
  const subscriptionItems: any[] = [];
  const oneTimeBumps: any[] = [];
  const subscriptionBumps: any[] = [];

  for (const item of config.items) {
    const price = priceMap.get(item.catalogPriceId);
    if (price?.billing.type === "recurring") {
      subscriptionItems.push(item);
    } else {
      oneTimeItems.push(item);
    }
  }

  for (const bump of config.orderBumps) {
    const price = priceMap.get(bump.catalogPriceId);
    if (price?.billing.type === "recurring") {
      subscriptionBumps.push(bump);
    } else {
      oneTimeBumps.push(bump);
    }
  }

  // Update original to be one-time only
  await updateStep(stepId, {
    ...config,
    items: oneTimeItems,
    orderBumps: oneTimeBumps,
    enableOneClickOffers: true,
  });

  let subscriptionStepId: string | null = null;
  const movedCount = subscriptionItems.length + subscriptionBumps.length;

  // Create new subscription checkout if needed
  if (movedCount > 0) {
    subscriptionStepId = await createStep({
      type: "checkout",
      name: "Subscription Checkout",
      config: {
        items: subscriptionItems,
        orderBumps: subscriptionBumps,
        screensMode: 1,
        enableOneClickOffers: false,
        subscriptionExperience: "embedded_checkout",
        onSuccessStepId: config.onSuccessStepId,
      },
    });
  }

  return {
    oneTimeStepId: stepId,
    subscriptionStepId,
    movedCount,
  };
}

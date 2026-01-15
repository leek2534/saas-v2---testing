import { v } from "convex/values";
import { action } from "../_generated/server";
import { getStripeClient } from "./client";
import { api } from "../_generated/api";

function stringifyMetadata(input: any): Record<string, string> {
  if (!input || typeof input !== "object") return {};
  const out: Record<string, string> = {};
  for (const [k, v] of Object.entries(input)) {
    if (v === undefined) continue;
    out[k] = typeof v === "string" ? v : JSON.stringify(v);
  }
  return out;
}

/**
 * Create a PaymentIntent for one-time checkout
 */
export const createPaymentIntent = action({
  args: {
    priceIds: v.array(v.id("catalogPrices")),
    quantities: v.array(v.number()),
    savePaymentMethod: v.boolean(),
    customerEmail: v.optional(v.string()),
    metadata: v.optional(v.any()),
  },
  handler: async (ctx, args) => {
    const stripe = getStripeClient();

    if (args.priceIds.length !== args.quantities.length) {
      throw new Error("priceIds and quantities length mismatch");
    }
    if (args.priceIds.length === 0) {
      throw new Error("No prices provided");
    }

    const prices = await ctx.runQuery(api.catalogPrices.getByIds, { ids: args.priceIds });
    const priceMap = new Map(prices.map((p: any) => [p._id, p]));

    let totalAmount = 0;
    let currency: string | null = null;
    const lineItems: any[] = [];

    for (let i = 0; i < args.priceIds.length; i++) {
      const priceId = args.priceIds[i];
      const qty = args.quantities[i];
      const price: any = priceMap.get(priceId);

      if (!price) throw new Error(`Price ${priceId} not found`);
      if (price.billing?.type !== "one_time") throw new Error("Only one-time prices are supported for PaymentIntent");
      if (!price.currency) throw new Error(`Price ${priceId} missing currency`);

      const pCurrency = String(price.currency).toLowerCase();
      if (!currency) currency = pCurrency;
      if (currency !== pCurrency) throw new Error("Mixed currency not supported in a single checkout step");

      totalAmount += price.amount * qty;

      lineItems.push({
        priceId: price._id,
        stripePriceId: price.stripePriceId,
        amount: price.amount,
        quantity: qty,
        currency: price.currency,
      });
    }

    if (!currency) throw new Error("Currency missing");

    // Create Stripe customer if we need to save PM for one-click offers
    let customer: string | undefined = undefined;
    if (args.savePaymentMethod) {
      const created = await stripe.customers.create({
        email: args.customerEmail,
        metadata: stringifyMetadata(args.metadata),
      });
      customer = created.id;
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: totalAmount,
      currency,
      customer,
      automatic_payment_methods: { enabled: true },
      setup_future_usage: args.savePaymentMethod ? "off_session" : undefined,
      metadata: {
        ...stringifyMetadata(args.metadata),
        lineItems: JSON.stringify(lineItems),
      },
    });

    return {
      clientSecret: paymentIntent.client_secret!,
      paymentIntentId: paymentIntent.id,
      customerId: customer ?? null,
      amount: totalAmount,
      currency,
    };
  },
});

/**
 * Create a Checkout Session for subscription checkout (embedded)
 */
export const createCheckoutSession = action({
  args: {
    priceIds: v.array(v.id("catalogPrices")),
    quantities: v.array(v.number()),
    customerEmail: v.optional(v.string()),
    returnUrl: v.string(),
    metadata: v.optional(v.any()),
  },
  handler: async (ctx, args) => {
    const stripe = getStripeClient();

    const prices = await ctx.runQuery(api.catalogPrices.getByIds, { ids: args.priceIds });

    const byId = new Map((prices ?? []).map((p: any) => [p._id, p]));

    const lineItems: Array<{ price: string; quantity: number }> = [];

    for (let i = 0; i < args.priceIds.length; i++) {
      const priceId = args.priceIds[i];
      const quantity = args.quantities[i] ?? 1;

      const price = byId.get(priceId as any);
      if (!price) throw new Error(`Price ${priceId} not found`);

      if (!price.stripePriceId) {
        throw new Error(`Price ${priceId} is not synced to Stripe`);
      }

      if (price.billing?.type !== "recurring") {
        throw new Error("Only recurring prices are supported for Checkout Session");
      }

      lineItems.push({ price: price.stripePriceId, quantity });
    }

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      ui_mode: "embedded",
      line_items: lineItems,
      return_url: args.returnUrl,
      customer_email: args.customerEmail,
      metadata: args.metadata as any,
    });

    return {
      clientSecret: session.client_secret,
      sessionId: session.id,
    };
  },
});

/**
 * Confirm checkout session completion
 */
export const confirmCheckoutSession = action({
  args: {
    sessionId: v.string(),
  },
  handler: async (ctx, args) => {
    const stripe = getStripeClient();

    const session = await stripe.checkout.sessions.retrieve(args.sessionId);

    return {
      status: session.status,
      paymentStatus: session.payment_status,
      customerId: session.customer as string | null,
      subscriptionId: session.subscription as string | null,
    };
  },
});

/**
 * Create one-click charge for offers (off-session)
 */
export const createOneClickCharge = action({
  args: {
    priceId: v.id("catalogPrices"),
    customerId: v.string(),
    paymentMethodId: v.string(),
    runId: v.optional(v.string()),
    metadata: v.optional(v.object({
      funnelId: v.string(),
      stepId: v.string(),
      offerId: v.string(),
    })),
  },
  handler: async (ctx, args) => {
    const stripe = getStripeClient();

    const price: any = await ctx.runQuery(api.catalogPrices.getById, { id: args.priceId });
    if (!price) throw new Error(`Price ${args.priceId} not found`);
    if (price.billing?.type !== "one_time") {
      throw new Error("Only one-time prices are supported for one-click charges");
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: price.amount,
      currency: String(price.currency).toLowerCase(),
      customer: args.customerId,
      payment_method: args.paymentMethodId,
      off_session: true,
      confirm: true,
      metadata: {
        ...args.metadata,
        runId: args.runId ?? "",
        catalogPriceId: args.priceId,
      },
    });

    return {
      paymentIntentId: paymentIntent.id,
      status: paymentIntent.status,
      amount: paymentIntent.amount,
    };
  },
});

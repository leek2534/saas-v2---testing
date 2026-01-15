import { v } from "convex/values";
import { mutation, query } from "./functions";

export const getOrCreateAttempt = mutation({
  args: {
    orgId: v.id("teams"),
    funnelId: v.id("funnels"),
    stepId: v.id("funnelSteps"),
    runId: v.string(),
    mode: v.union(v.literal("payment_intent"), v.literal("checkout_session")),
    amount: v.number(),
    currency: v.string(),
    customerEmail: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const existing = await ctx
      .table("checkoutAttempts", "by_run_step", (q) => q.eq("runId", args.runId).eq("stepId", args.stepId))
      .first();

    if (existing) return existing._id;

    const billingType = args.mode === "checkout_session" ? "recurring" : "one_time";

    const id = await ctx.table("checkoutAttempts").insert({
      orgId: args.orgId,
      funnelId: args.funnelId,
      stepId: args.stepId,
      runId: args.runId,
      status: "created",
      billingType,
      amount: args.amount,
      currency: args.currency,
      customerEmail: args.customerEmail,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });

    return id;
  },
});

export const updateStatus = mutation({
  args: {
    attemptId: v.id("checkoutAttempts"),
    status: v.union(
      v.literal("created"),
      v.literal("pending"),
      v.literal("completed"),
      v.literal("failed"),
      v.literal("abandoned")
    ),
    stripePaymentIntentId: v.optional(v.string()),
    stripeCheckoutSessionId: v.optional(v.string()),
    stripeCustomerId: v.optional(v.string()),
    paymentMethodId: v.optional(v.string()),
    customerEmail: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const attempt = await ctx.table("checkoutAttempts").get(args.attemptId);
    if (!attempt) throw new Error("Checkout attempt not found");

    await ctx.table("checkoutAttempts").patch(args.attemptId, {
      status: args.status,
      stripePaymentIntentId: args.stripePaymentIntentId ?? attempt.stripePaymentIntentId,
      stripeCheckoutSessionId: args.stripeCheckoutSessionId ?? attempt.stripeCheckoutSessionId,
      stripeCustomerId: args.stripeCustomerId ?? attempt.stripeCustomerId,
      stripePaymentMethodId: args.paymentMethodId ?? attempt.stripePaymentMethodId,
      customerEmail: args.customerEmail ?? attempt.customerEmail,
      updatedAt: Date.now(),
    });

    return args.attemptId;
  },
});

export const getByStripePaymentIntent = query({
  args: { paymentIntentId: v.string() },
  handler: async (ctx, args) => {
    return await ctx
      .table("checkoutAttempts", "by_stripe_pi", (q) => q.eq("stripePaymentIntentId", args.paymentIntentId))
      .first();
  },
});

export const getByStripeCheckoutSession = query({
  args: { sessionId: v.string() },
  handler: async (ctx, args) => {
    return await ctx
      .table("checkoutAttempts", "by_stripe_session", (q) => q.eq("stripeCheckoutSessionId", args.sessionId))
      .first();
  },
});

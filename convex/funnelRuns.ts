import { v } from "convex/values";
import { mutation, query } from "./functions";

export const getOrCreateRun = mutation({
  args: {
    orgId: v.id("teams"),
    funnelId: v.id("funnels"),
    runId: v.string(),
    initialStepId: v.id("funnelSteps"),
  },
  handler: async (ctx, args) => {
    const existing = await ctx
      .table("funnelRuns", "by_funnel_run", (q) => q.eq("funnelId", args.funnelId).eq("runId", args.runId))
      .first();

    if (existing) return existing;

    const id = await ctx.table("funnelRuns").insert({
      orgId: args.orgId,
      funnelId: args.funnelId,
      runId: args.runId,
      currentStepId: args.initialStepId,
      status: "in_progress",
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });

    const run = await ctx.table("funnelRuns").get(id);
    return run;
  },
});

export const advanceStep = mutation({
  args: {
    funnelId: v.id("funnels"),
    runId: v.string(),
    nextStepId: v.id("funnelSteps"),
  },
  handler: async (ctx, args) => {
    const run = await ctx
      .table("funnelRuns", "by_funnel_run", (q) => q.eq("funnelId", args.funnelId).eq("runId", args.runId))
      .first();
    if (!run) throw new Error("Run not found");

    await ctx.table("funnelRuns").patch(run._id, {
      currentStepId: args.nextStepId,
      updatedAt: Date.now(),
    });

    return run._id;
  },
});

export const setCheckoutAttempt = mutation({
  args: {
    funnelId: v.id("funnels"),
    runId: v.string(),
    checkoutAttemptId: v.id("checkoutAttempts"),
  },
  handler: async (ctx, args) => {
    const run = await ctx
      .table("funnelRuns", "by_funnel_run", (q) => q.eq("funnelId", args.funnelId).eq("runId", args.runId))
      .first();
    if (!run) throw new Error("Run not found");

    await ctx.table("funnelRuns").patch(run._id, {
      checkoutAttemptId: args.checkoutAttemptId,
      updatedAt: Date.now(),
    });

    return run._id;
  },
});

export const updateStatus = mutation({
  args: {
    funnelId: v.id("funnels"),
    runId: v.string(),
    status: v.union(v.literal("in_progress"), v.literal("completed"), v.literal("abandoned")),
    customerEmail: v.optional(v.string()),
    stripeCustomerId: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const run = await ctx
      .table("funnelRuns", "by_funnel_run", (q) => q.eq("funnelId", args.funnelId).eq("runId", args.runId))
      .first();
    if (!run) throw new Error("Run not found");

    await ctx.table("funnelRuns").patch(run._id, {
      status: args.status,
      customerEmail: args.customerEmail ?? run.customerEmail,
      stripeCustomerId: args.stripeCustomerId ?? run.stripeCustomerId,
      updatedAt: Date.now(),
    });

    return run._id;
  },
});

export const storeCustomer = mutation({
  args: {
    funnelId: v.id("funnels"),
    runId: v.string(),
    stripeCustomerId: v.string(),
  },
  handler: async (ctx, args) => {
    const run = await ctx
      .table("funnelRuns", "by_funnel_run", (q) => q.eq("funnelId", args.funnelId).eq("runId", args.runId))
      .first();
    if (!run) throw new Error("Run not found");

    await ctx.table("funnelRuns").patch(run._id, {
      stripeCustomerId: args.stripeCustomerId,
      updatedAt: Date.now(),
    });

    return run._id;
  },
});

export const storePaymentMethod = mutation({
  args: {
    funnelId: v.id("funnels"),
    runId: v.string(),
    stripeCustomerId: v.string(),
    paymentMethodId: v.string(),
  },
  handler: async (ctx, args) => {
    const run = await ctx
      .table("funnelRuns", "by_funnel_run", (q) => q.eq("funnelId", args.funnelId).eq("runId", args.runId))
      .first();
    if (!run) throw new Error("Run not found");

    await ctx.table("funnelRuns").patch(run._id, {
      stripeCustomerId: args.stripeCustomerId,
      stripePaymentMethodId: args.paymentMethodId,
      updatedAt: Date.now(),
    });

    return run._id;
  },
});

export const assertRunReadyForOffers = query({
  args: {
    funnelId: v.id("funnels"),
    runId: v.string(),
  },
  handler: async (ctx, args) => {
    const run = await ctx
      .table("funnelRuns", "by_funnel_run", (q) => q.eq("funnelId", args.funnelId).eq("runId", args.runId))
      .first();

    if (!run) return null;

    if (!run.stripeCustomerId || !run.stripePaymentMethodId) return null;

    return {
      stripeCustomerId: run.stripeCustomerId,
      stripePaymentMethodId: run.stripePaymentMethodId,
    };
  },
});

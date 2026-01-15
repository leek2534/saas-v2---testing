import { v } from "convex/values";
import { query, mutation } from "../functions";

/**
 * Check if a webhook event has already been processed
 */
export const checkEvent = query({
  args: {
    eventId: v.string(),
  },
  handler: async (ctx, args) => {
    const allEvents = await ctx.table("stripeWebhookEvents");
    
    for await (const event of allEvents) {
      if ((event as any).eventId === args.eventId) {
        return event;
      }
    }
    
    return null;
  },
});

/**
 * Record a webhook event for idempotency
 */
export const recordEvent = mutation({
  args: {
    eventId: v.string(),
    type: v.string(),
  },
  handler: async (ctx, args) => {
    const eventId = await ctx.table("stripeWebhookEvents").insert({
      eventId: args.eventId,
      type: args.type,
      receivedAt: Date.now(),
    });

    return eventId;
  },
});

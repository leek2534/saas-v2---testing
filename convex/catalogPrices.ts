import { query } from "./_generated/server";
import { v } from "convex/values";

export const getByIds = query({
  args: { ids: v.array(v.id("catalogPrices")) },
  handler: async (ctx, args) => {
    const results = await Promise.all(args.ids.map((id) => ctx.db.get(id)));
    return results.filter(Boolean);
  },
});

export const getById = query({
  args: { id: v.id("catalogPrices") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

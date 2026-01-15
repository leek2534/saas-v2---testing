import { v } from "convex/values";
import { mutation, query } from "./functions";

export const createPage = mutation({
  args: {
    orgId: v.id("teams"),
    name: v.string(),
    handle: v.string(),
    kind: v.union(
      v.literal("standard"),
      v.literal("checkout"),
      v.literal("offer"),
      v.literal("thankyou"),
      v.literal("popup")
    ),
    tree: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const ensureTreePayload = (raw?: string) => {
      const empty = JSON.stringify({ version: 2, tree: { pageRootIds: [], nodes: {}, popups: {} } });
      if (!raw) return empty;
      try {
        const parsed = JSON.parse(raw);
        if (parsed && typeof parsed === "object") {
          if ((parsed as any).version === 2 && (parsed as any).tree) {
            return raw;
          }
          if (Array.isArray((parsed as any).pageRootIds) && typeof (parsed as any).nodes === "object") {
            return JSON.stringify({ version: 2, tree: parsed });
          }
        }
      } catch {
        // ignore
      }
      return raw;
    };

    const pageId = await ctx.table("pages").insert({
      orgId: args.orgId,
      name: args.name,
      handle: args.handle,
      kind: args.kind,
      status: "draft",
      tree: ensureTreePayload(args.tree),
      schemaVersion: 2,
    });

    return pageId;
  },
});

export const getPageById = query({
  args: {
    pageId: v.id("pages"),
  },
  handler: async (ctx, args) => {
    const page = await ctx.table("pages").get(args.pageId);
    return page;
  },
});

// Lightweight batch fetch for editor UI (warnings, step list, etc.)
export const getPagesByIds = query({
  args: {
    pageIds: v.array(v.id("pages")),
  },
  handler: async (ctx, args) => {
    const out: any[] = [];
    for (const id of args.pageIds) {
      const page = await ctx.table("pages").get(id);
      if (page) out.push(page);
    }
    return out;
  },
});

export const getPageByHandle = query({
  args: {
    handle: v.string(),
  },
  handler: async (ctx, args) => {
    const page = await ctx
      .table("pages", "by_org_handle")
      .filter((q: any) => q.eq(q.field("handle"), args.handle))
      .first();
    
    return page;
  },
});

export const updatePageTree = mutation({
  args: {
    pageId: v.id("pages"),
    tree: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.table("pages").getX(args.pageId).patch({
      tree: args.tree,
    });

    return { success: true };
  },
});

export const publishPage = mutation({
  args: {
    pageId: v.id("pages"),
  },
  handler: async (ctx, args) => {
    await ctx.table("pages").getX(args.pageId).patch({
      status: "published",
    });

    return { success: true };
  },
});

export const listPages = query({
  args: {
    orgId: v.id("teams"),
  },
  handler: async (ctx, args) => {
    const pages: any[] = [];
    const allPages = await ctx.table("pages", "by_org", (q: any) =>
      q.eq("orgId", args.orgId)
    );

    for await (const page of allPages) {
      pages.push(page);
    }

    return pages;
  },
});

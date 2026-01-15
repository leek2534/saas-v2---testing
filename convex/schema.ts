import { defineEnt, defineEntSchema, getEntDefinitions } from "convex-ents";
import { v } from "convex/values";
import { vPermission, vRole } from "./permissions";

// Catalog types
const vProductStatus = v.union(v.literal("draft"), v.literal("active"), v.literal("archived"));
const vProductType = v.union(v.literal("digital"), v.literal("physical"), v.literal("service"));
const vBillingType = v.union(
  v.object({ type: v.literal("one_time") }),
  v.object({ 
    type: v.literal("recurring"), 
    interval: v.union(v.literal("month"), v.literal("year")),
    intervalCount: v.number()
  })
);

// Example: 7 day soft deletion period for teams
const TEAM_DELETION_DELAY_MS = 7 * 24 * 60 * 60 * 1000;

const schema = defineEntSchema(
  {
    teams: defineEnt({
      name: v.string(),
      isPersonal: v.boolean(),
    })
      .field("slug", v.string(), { unique: true })
      .edges("messages", { ref: true })
      .edges("members", { ref: true })
      .edges("invites", { ref: true })
      .deletion("scheduled", { delayMs: TEAM_DELETION_DELAY_MS }),

    users: defineEnt({
      firstName: v.optional(v.string()),
      lastName: v.optional(v.string()),
      fullName: v.string(),
      pictureUrl: v.optional(v.string()),
    })
      .field("email", v.string(), { unique: true })
      .field("tokenIdentifier", v.string(), { unique: true })
      .edges("members", { ref: true, deletion: "soft" })
      .deletion("soft"),

    members: defineEnt({
      searchable: v.string(),
    })
      .edge("team")
      .edge("user")
      .edge("role")
      .index("teamUser", ["teamId", "userId"])
      .searchIndex("searchable", {
        searchField: "searchable",
        filterFields: ["teamId"],
      })
      .edges("messages", { ref: true })
      .deletion("soft"),

    invites: defineEnt({
      inviterEmail: v.string(),
    })
      .field("email", v.string(), { unique: true })
      .edge("team")
      .edge("role"),

    roles: defineEnt({
      isDefault: v.boolean(),
    })
      .field("name", vRole, { unique: true })
      .edges("permissions")
      .edges("members", { ref: true })
      .edges("invites", { ref: true }),

    permissions: defineEnt({})
      .field("name", vPermission, { unique: true })
      .edges("roles"),

    messages: defineEnt({
      text: v.string(),
    })
      .edge("team")
      .edge("member"),

    // Catalog tables
    catalogProducts: defineEnt({
      orgId: v.id("teams"),
      name: v.string(),
      status: vProductStatus,
      type: vProductType,
      sku: v.optional(v.string()),
      shortDescription: v.optional(v.string()),
      longDescription: v.optional(v.string()),
      imageIds: v.array(v.id("_storage")),
      defaultImageId: v.optional(v.id("_storage")),
      tags: v.array(v.string()),
      stripeProductId: v.optional(v.string()),
    })
      .field("handle", v.string(), { unique: true })
      .index("by_org_handle", ["orgId", "handle"])
      .index("by_org_updated", ["orgId"]),

    catalogPrices: defineEnt({
      orgId: v.id("teams"),
      productId: v.id("catalogProducts"),
      nickname: v.string(),
      currency: v.string(),
      amount: v.number(),
      billing: vBillingType,
      active: v.boolean(),
      isDefault: v.boolean(),
      stripePriceId: v.optional(v.string()),
    })
      .index("by_org_product", ["orgId", "productId"]),

    catalogImages: defineEnt({
      orgId: v.id("teams"),
      storageId: v.id("_storage"),
      fileName: v.string(),
      fileSize: v.number(),
      contentType: v.string(),
      tags: v.array(v.string()),
    })
      .index("by_org", ["orgId"]),

    catalogCollections: defineEnt({
      orgId: v.id("teams"),
      name: v.string(),
      handle: v.optional(v.string()),
    })
      .index("by_org", ["orgId"]),

    catalogCollectionItems: defineEnt({
      orgId: v.id("teams"),
      collectionId: v.id("catalogCollections"),
      productId: v.id("catalogProducts"),
      order: v.number(),
    })
      .index("by_collection", ["collectionId"]),

    stripeWebhookEvents: defineEnt({
      type: v.string(),
      receivedAt: v.number(),
    })
      .field("eventId", v.string(), { unique: true }),

    // Funnel system tables
    pages: defineEnt({
      orgId: v.id("teams"),
      name: v.string(),
      kind: v.union(
        v.literal("standard"),
        v.literal("checkout"),
        v.literal("offer"),
        v.literal("thankyou"),
        v.literal("popup")
      ),
      status: v.union(v.literal("draft"), v.literal("published")),
      tree: v.string(), // JSON stringified EditorTree
      schemaVersion: v.number(),
    })
      .field("handle", v.string(), { unique: true })
      .index("by_org_handle", ["orgId", "handle"])
      .index("by_org", ["orgId"]),

    funnels: defineEnt({
      orgId: v.id("teams"),
      name: v.string(),
      status: v.union(v.literal("draft"), v.literal("active"), v.literal("archived")),
      entryStepId: v.optional(v.string()),
    })
      .field("handle", v.string(), { unique: true })
      .index("by_org_handle", ["orgId", "handle"])
      .index("by_org_status", ["orgId", "status"]),

    funnelSteps: defineEnt({
      orgId: v.id("teams"),
      funnelId: v.id("funnels"),
      type: v.union(v.literal("page"), v.literal("checkout"), v.literal("offer"), v.literal("thankyou")),
      name: v.string(),
      pageId: v.id("pages"),
      nextStepId: v.optional(v.string()),
      position: v.optional(v.object({ x: v.number(), y: v.number() })),
      config: v.optional(v.string()), // JSON stringified step config
    })
      .index("by_funnel", ["funnelId"])
      .index("by_org_funnel", ["orgId", "funnelId"]),

    // Funnel runtime tables
    funnelRuns: defineEnt({
      orgId: v.id("teams"),
      funnelId: v.id("funnels"),
      runId: v.string(),
      currentStepId: v.id("funnelSteps"),
      customerEmail: v.optional(v.string()),
      checkoutAttemptId: v.optional(v.id("checkoutAttempts")),
      status: v.union(v.literal("in_progress"), v.literal("completed"), v.literal("abandoned")),
      stripeCustomerId: v.optional(v.string()),
      stripePaymentMethodId: v.optional(v.string()),
    })
      .index("by_funnel", ["funnelId"])
      .index("by_funnel_run", ["funnelId", "runId"])
      .index("by_customer", ["customerEmail"]),

    checkoutAttempts: defineEnt({
      orgId: v.id("teams"),
      funnelId: v.id("funnels"),
      stepId: v.id("funnelSteps"),
      runId: v.string(),
      customerEmail: v.optional(v.string()),
      stripePaymentIntentId: v.optional(v.string()),
      stripeCheckoutSessionId: v.optional(v.string()),
      stripeCustomerId: v.optional(v.string()),
      paymentMethodId: v.optional(v.string()),
      amount: v.number(),
      currency: v.string(),
      status: v.union(v.literal("pending"), v.literal("completed"), v.literal("failed")),
      billingType: v.union(v.literal("one_time"), v.literal("recurring")),
    })
      .index("by_run", ["runId"])
      .index("by_run_step", ["runId", "stepId"])
      .index("by_stripe_pi", ["stripePaymentIntentId"])
      .index("by_stripe_session", ["stripeCheckoutSessionId"]),
  },
  { schemaValidation: false },
);

export default schema;

export const entDefinitions = getEntDefinitions(schema);

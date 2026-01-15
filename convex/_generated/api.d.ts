/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as catalog from "../catalog.js";
import type * as catalog_collections from "../catalog/collections.js";
import type * as catalog_images from "../catalog/images.js";
import type * as catalog_index from "../catalog/index.js";
import type * as catalog_phase1_complete from "../catalog/phase1_complete.js";
import type * as catalog_prices from "../catalog/prices.js";
import type * as catalog_products from "../catalog/products.js";
import type * as catalog_test from "../catalog/test.js";
import type * as catalog_verify from "../catalog/verify.js";
import type * as catalogPrices from "../catalogPrices.js";
import type * as checkoutAttempts from "../checkoutAttempts.js";
import type * as functions from "../functions.js";
import type * as funnelRuns from "../funnelRuns.js";
import type * as funnelSteps from "../funnelSteps.js";
import type * as funnels from "../funnels.js";
import type * as init from "../init.js";
import type * as invites from "../invites.js";
import type * as pages from "../pages.js";
import type * as permissions from "../permissions.js";
import type * as stripe from "../stripe.js";
import type * as stripe_checkout from "../stripe/checkout.js";
import type * as stripe_client from "../stripe/client.js";
import type * as stripe_sync from "../stripe/sync.js";
import type * as stripe_webhooks from "../stripe/webhooks.js";
import type * as types from "../types.js";
import type * as users from "../users.js";
import type * as users_teams from "../users/teams.js";
import type * as users_teams_members from "../users/teams/members.js";
import type * as users_teams_members_invites from "../users/teams/members/invites.js";
import type * as users_teams_messages from "../users/teams/messages.js";
import type * as users_teams_roles from "../users/teams/roles.js";
import type * as utils from "../utils.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  catalog: typeof catalog;
  "catalog/collections": typeof catalog_collections;
  "catalog/images": typeof catalog_images;
  "catalog/index": typeof catalog_index;
  "catalog/phase1_complete": typeof catalog_phase1_complete;
  "catalog/prices": typeof catalog_prices;
  "catalog/products": typeof catalog_products;
  "catalog/test": typeof catalog_test;
  "catalog/verify": typeof catalog_verify;
  catalogPrices: typeof catalogPrices;
  checkoutAttempts: typeof checkoutAttempts;
  functions: typeof functions;
  funnelRuns: typeof funnelRuns;
  funnelSteps: typeof funnelSteps;
  funnels: typeof funnels;
  init: typeof init;
  invites: typeof invites;
  pages: typeof pages;
  permissions: typeof permissions;
  stripe: typeof stripe;
  "stripe/checkout": typeof stripe_checkout;
  "stripe/client": typeof stripe_client;
  "stripe/sync": typeof stripe_sync;
  "stripe/webhooks": typeof stripe_webhooks;
  types: typeof types;
  users: typeof users;
  "users/teams": typeof users_teams;
  "users/teams/members": typeof users_teams_members;
  "users/teams/members/invites": typeof users_teams_members_invites;
  "users/teams/messages": typeof users_teams_messages;
  "users/teams/roles": typeof users_teams_roles;
  utils: typeof utils;
}>;

/**
 * A utility for referencing Convex functions in your app's public API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;

/**
 * A utility for referencing Convex functions in your app's internal API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = internal.myModule.myFunction;
 * ```
 */
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;

export declare const components: {};

# Funnel Builder Payments + Catalog + Checkout/Offers — Implementation Guide (Windsurf)

**Timezone reference:** America/New_York  
**Scope:** Day‑1 implementation of Products/Catalog + Stripe payments + Checkout + Offers (OTO/Upsell/Downsell) + UX Safety System (readiness engine + fix actions) inside your funnel builder.

> **Important (character-limit friendly workflow):**
> - **Do not paste big code blocks** into Windsurf chat.
> - Instead, have Windsurf **create/modify files directly in your repo**.
> - Keep this document in your repo at `/docs/payments-spec.md` so every future prompt can be short: "Read `/docs/payments-spec.md` and implement Phase X."

---

## 1) Definitions (remove confusion)
### 1.1 Pages vs Screens (do NOT use "step" for both)
- **Page** = a node in the funnel flow (Checkout Page → Offer Page(s) → Thank You).
- **Screens** = the internal wizard screens *inside the Checkout Page* (Products → Details → Payment).

### 1.2 Special Elements
- Checkout is **not "just a normal element."** It is a **Page kind** with business logic.
- A **Checkout Block element** renders on the checkout page so users can position/style it.
- An **Offer Block element** renders on offer pages for styling/template control.

**Rule that keeps everything understandable:**
- **Page Inspector = business logic** (products/options, routing, screens, readiness).
- **Element Inspector = presentation** (layout, spacing, typography, styling).

---

## 2) Day‑1 Product + Payment Rules (locked in)
### 2.1 Source of truth
- **Catalog (Convex)** stores products + options.
- **Stripe** handles charging and subscription lifecycle.
- Funnel configuration references **`catalogPriceId`** (never raw Stripe IDs in step config).

### 2.2 Day‑1 constraints (to keep it smooth)
- ✅ **Subscriptions supported Day‑1**
- ✅ **No mixed billing carts Day‑1** (no subscription + one-time items in the same checkout)
- ✅ **Offers only after one‑time checkout Day‑1** (one-click relies on saved payment method)
- ✅ Selected options must be **synced to Stripe** before publish/charge
- ✅ Editing amount of a synced option uses **price versioning** (create new Stripe price, deactivate old)

### 2.3 Stripe payment method saving (one‑click offers)
- If offers exist on a one-time checkout, the initial one-time payment must save payment method for **off‑session** charges later.

---

## 3) Catalog Data Model (Convex)
### 3.1 Tables
#### `catalogProducts`
Marketing + organization:
- `orgId`
- `name`
- `handle` (unique per org)
- `status: "draft" | "active" | "archived"`
- `type: "digital" | "physical" | "service"`
- `sku?`
- `shortDescription?`
- `longDescription?` (TipTap doc or string)
- `imageIds: storageId[]`
- `defaultImageId?`
- `tags: string[]`
- `stripeProductId?`
- timestamps

Indexes:
- `by_org_handle(orgId, handle)`
- `by_org_updated(orgId, updatedAt)`
- (optional) name search index if you have one

#### `catalogPrices` (shown to users as "Options")
Chargeable "options" for a product:
- `orgId`
- `productId`
- `nickname` (e.g., "Standard", "VIP", "Annual")
- `currency`
- `amount` (cents)
- `billing`:
  - `{ type: "one_time" }`
  - `{ type: "recurring", interval: "month"|"year", intervalCount: number }`
- `active: boolean`
- `isDefault: boolean`
- `stripePriceId?`
- timestamps

Indexes:
- `by_org_product(orgId, productId)`

#### Collections (optional but recommended Day‑1)
- `catalogCollections`: `orgId`, `name`, `handle?`, timestamps
- `catalogCollectionItems`: `orgId`, `collectionId`, `productId`, `order`

#### Webhook idempotency
- `stripeWebhookEvents`: `eventId`, `receivedAt`, `payloadHash?`

### 3.2 Storage helpers (Convex `_storage`)
- `generateUploadUrl()`
- `attachImageToProduct(productId, storageId, setAsDefault?)`
- `reorderImages(productId, imageIds[])`
- `setDefaultImage(productId, storageId)`

---

## 4) Funnel Page Config (Schema)
### 4.1 Checkout Page config
```ts
type CheckoutConfig = {
  items: Array<{ catalogPriceId: string; quantity: number }>;
  orderBumps: Array<{
    bumpId: string;
    catalogPriceId: string;
    headline: string;
    description: string;
    imageId?: string;
  }>;

  // Checkout Screens (internal wizard)
  screensMode: 1 | 2 | 3; // 1=all-in-one, 2=details→payment, 3=products→details→payment

  // One-time only
  oneClickOffersEnabled: boolean;

  // Subscription only
  subscription: {
    experience: "embedded_checkout" | "custom_checkout" | "hosted_redirect"; // default day‑1: embedded_checkout
    collectShipping: boolean;
    allowedShippingCountries?: string[];
    returnPath: string; // e.g. /f/:funnelId/return
  };

  // Routing
  onSuccessStepId: string | null;
};
```
### 4.2 Offer Page config
```ts
type OfferConfig = {
  kind: "oto" | "upsell" | "downsell";
  catalogPriceId: string | null;
  oneClickEnabled: boolean;

  routing: {
    onAcceptStepId: string | null;
    onDeclineStepId: string | null;
  };

  template: {
    hasAcceptButton: boolean;
    hasDeclineButton: boolean;
  };
};
```

---

## 5) Payments Runtime (Stripe) — Day‑1 branching
### 5.1 Determine checkout billing type
- If any selected option has `billing.type === "recurring"` → **subscription checkout**
- Else → **one-time checkout**
- If both types present → **invalid (Day‑1)** → split checkout fix

### 5.2 One‑time checkout flow
- Create a **PaymentIntent** server-side using selected options.
- Render **Payment Element** in Checkout Block.
- If offers exist: set the intent to save payment method for off-session use.

### 5.3 Subscription checkout flow (Day‑1 default: Embedded Stripe Checkout)
- Create **Checkout Session** server-side:
  - `mode: "subscription"`
  - `ui_mode: "embedded"`
  - line_items use `stripePriceId`
  - return_url includes `{CHECKOUT_SESSION_ID}` placeholder
- Mount embedded checkout on your checkout page using session client secret.
- Create a **Return page** that checks session completion and routes to next page.
- Webhooks remain the source of truth for fulfillment.

### 5.4 Offers (one‑click) Day‑1
- Offers only supported after a paid **one-time** order.
- Accept triggers an **off-session** charge using saved payment method.
- Decline routes to next offer/downsell/thank-you.

---

## 6) Price Picker (Catalog → Funnel)
A single picker used in:
- Checkout items
- Order bumps
- Offer pages

UX rules:
- UI says **Product** and **Option** (not "price").
- Each option shows:
  - amount + billing type
  - sync status (Synced / Needs Sync)
  - compatibility (Incompatible if would mix billing)
- If user selects unsynced option:
  - button becomes **Sync & Select** (runs sync action first, then selects)

---

## 7) UX Safety System (Readiness Engine + Fix Actions)
This prevents the "last 20% confusion" by making constraints visible, predictable, and fixable.

### 7.1 Readiness engine outputs
- Global issues + per-step issues
- Step badges (mode, sync, env, charge timing)
- Step checklist (ok/warn/fail) with Fix buttons
- `publishBlocked` boolean

### 7.2 Where it appears
- Flow Builder nodes: badges + blocker/warn counters
- Inspector header: sticky "Safety Header" with pills + diagram + checklist
- Publish modal: grouped readiness report with Fix buttons
- Picker: compatibility and sync warnings

### 7.3 Fix actions (must be deterministic)
- Open payments settings
- Open catalog product/pricing tab
- Sync required options
- Enable one-click
- Repair offer routing
- Insert offer accept/decline buttons
- **Split checkout by billing** (magic fix)

---

## 8) Split Checkout by Billing (Magic Fix)
### 8.1 When triggered
- user tries to add a subscription option to a one-time checkout (or vice versa)
- readiness detects mixed billing

### 8.2 Day‑1 default behavior
- Keep original checkout as **one-time**
- Create new **Subscription Checkout** page
- Move subscription items/bumps there
- Update routing so funnel stays valid
- Show toast: "Created Subscription Checkout and moved 1 item."
- Optional Undo window (~10 seconds)

### 8.3 Routing rules (Day‑1 simple)
- Offers attach to one-time checkout only.
- Subscription checkout routes to Thank You (or a subscription thank-you) Day‑1.

---

## 9) UI Layout Specs (Shadcn "video panel" feel)
### 9.1 Inspector Safety Header (sticky)
Row 1: Title + pills (Mode, Env, Sync, Charge)  
Row 2: Diagram (Screens or Accept/Decline routing)  
Row 3: Collapsible checklist with Fix buttons  
Row 4: "Why this happens" (only when mode causes behavior difference)

### 9.2 Publish "Payments Readiness" modal
- Groups: Workspace Payments, Checkout Pages, Offer Pages, Warnings
- Each issue card has Fix button
- Publish disabled while blockers exist

### 9.3 Flow Builder nodes
- Node badges: mode + sync + env
- Indicator bubble with number of blockers/warnings
- Clicking indicator opens readiness modal or expands checklist

### 9.4 Price Picker
- Product cards with expandable Options list
- Each option shows sync + billing
- "Split checkout" fix surfaced when incompatible

---

## 10) Implementation Plan (Phased, character-limit friendly)
> Each phase prompt should say: **Read `/docs/payments-spec.md` and implement Phase X**, create/modify files directly, and **do not paste large code in chat**.

### Phase 1 — Convex schema + basic CRUD
- Add tables + indexes
- Product CRUD, Price CRUD, Collections CRUD
- Image helpers (upload url + attach + reorder + default)

**Verify:**
- Convex dev runs
- Can create product + option via dashboard or quick UI

### Phase 2 — Catalog UI
- Products list page
- Product editor (tabs: general, description, media, pricing, integrations)
- New product wizard (creates product + default option)

### Phase 3 — Stripe sync + webhook skeleton
- Server-side Stripe client
- Convex action: sync product and options → stores stripe IDs
- Webhook endpoint with signature verification + idempotency table
- Minimal event handling stubs

### Phase 4 — Price Picker + inspector integration
- Picker dialog
- Checkout inspector: items + bumps selection via picker
- Offer inspector: offer option selection via picker
- Compatibility + Sync & Select

### Phase 5 — One-time checkout runtime
- Create PaymentIntent from selected options
- Payment Element UI in checkout block
- Save PM when offers enabled
- Order snapshot storage (catalog IDs + stripe IDs + amount snapshot)

### Phase 6 — Subscription checkout runtime (embedded checkout)
- Checkout session creation (embedded)
- Return page for session completion → route to next page
- webhook fulfillment for checkout.session.completed

### Phase 7 — UX Safety System
- Readiness engine
- Sticky safety header
- Publish readiness modal
- Fix executor + split checkout

---

## 11) Windsurf Prompt Pack (copy/paste)
### Prompt A — Create docs in repo
```text
Create /docs/payments-spec.md and /docs/payments-tasks.md based on this guide.
Do not paste large code blocks in chat—write files in the repo.
Then stop and only output a file list + short summary.
```

### Prompt B — Implement next phase
```text
Read /docs/payments-spec.md and implement Phase <N> from /docs/payments-tasks.md.
Constraints: write changes in repo; do not paste large code in chat.
Output only: file list, summary, verification steps. Stop when done.
```

### Prompt C — Fix build only
```text
Fix only TypeScript/build/runtime errors introduced by the last changes. No refactors. Stop when the app builds.
```

---

## 12) Verification commands (after each phase)
```bash
npm run typecheck
npm run lint
npx convex dev
npm run dev
```

Commit after each phase:
```bash
git add .
git commit -m "Phase N: <short description>"
```

---

## Appendix: Readiness Engine (types outline)
Create these internal types (or similar) so the system is consistent:
- `ReadinessIssue` (severity + scope + fix action)
- `StepReadiness` (badges + checklist + issues)
- `FunnelReadiness` (global issues + steps map + publishBlocked)

Fix actions should be executed via a single `executeFixAction(action)` function.

---

### Done.
This doc is designed to live in your repo so Windsurf can read it and implement phases without you pasting large prompts.

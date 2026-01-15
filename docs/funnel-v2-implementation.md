# Funnel Builder v3 → Option 2 (Flow + Page Builder) — Full Implementation Playbook (Windsurf)

This file is meant to live in your repo so Windsurf can open it and execute the plan **without large prompts**.

**Recommended path:** put this file at `docs/funnel-v2-implementation.md` in your repo.

---

## 0) What we're building (Option 2, ClickFunnels-style)
You already have a **page/popup canvas editor** (sections/rows/columns/elements). Option 2 adds a **Funnels layer** on top:

- **Funnels** = flow/map of steps
- **Funnel Steps** = checkout/offer/thankyou/page nodes in the flow
- Each **Step references a Page document** (built with your existing editor)
- Checkout/Offer behavior is implemented via **special blocks** inside pages:
  - `CheckoutBlock` element
  - `OfferBlock` element
- Global **Catalog** (products/options) powers checkout/offer selections

**Key terminology (avoid confusion):**
- **Page** = the canvas document (your current editor)
- **Funnel Step** = node in the funnel flow (checkout/offer/thankyou)
- **Screens** = internal checkout screens (1/2/3) inside a checkout experience

---

## 1) Current tables you already added (KEEP)
✅ Keep these (they are foundational for both Option 1 and Option 2):
- `catalogProducts`
- `catalogPrices` (shown in UI as "Options")
- `catalogImages`
- `catalogCollections`
- `catalogCollectionItems`
- `stripeWebhookEvents` (idempotency)

---

## 2) Day-1 Rules (locked)
These reduce complexity and prevent broken payments:

- ✅ Subscriptions supported Day-1
- ✅ **No mixed billing** in a single checkout (subscription + one-time together is invalid Day-1)
- ✅ Offers only supported after **one-time** checkout Day-1
- ✅ Checkout selections reference **catalogPriceId** (never raw Stripe IDs in step config)
- ✅ Selected options must be **synced to Stripe** before publish
- ✅ Price amount changes require **versioning** (create a new Stripe price)

---

## 3) Repo constraints for Windsurf (IMPORTANT)
Always include these constraints in every execution prompt:
- **Do not paste large code in chat**
- **Write changes directly into repo files**
- Output only:
  1) Files created/modified
  2) Brief summary
  3) How to verify
- Stop when scope is complete

---

## 4) UI/UX consistency rules (apply everywhere)
- Use shadcn **Card** sections with clear headings + short helper text
- Use **Collapsible** for "Advanced" sections
- Vocabulary must be consistent:
  - Page, Funnel Step, Screen, Product, Option
- Reuse a shared badge system:
  - Mode (One-time / Subscription)
  - Sync (Synced / Needs Sync)
  - Env (Test / Live)
  - Issues (Blockers / Warnings)

---

# IMPLEMENTATION PROMPTS (Run in Windsurf, in order)

## Prompt 1/4 — Foundations: Pages in Convex + Funnels + Steps + builder save/load
```text
We are implementing Option 2: a multi-step Funnel Flow system ON TOP of the existing funnel-builder-v3 page/popup editor.

Hard constraints:
- Do not paste large code in chat.
- Modify/create files directly in the repo.
- Use Convex + defineEnt + v.string() JSON serialization where needed.
- Keep existing payments tables: catalogProducts, catalogPrices, catalogImages, catalogCollections, catalogCollectionItems, stripeWebhookEvents.
- Stop after completing this prompt scope and output only: file list + summary + how to verify.

Scope (FOUNDATIONS):
A) Convex schema changes:
1) Add `pages` table:
   - orgId, name, handle, kind (standard|checkout|offer|thankyou|popup), status (draft|published)
   - tree (JSON string), schemaVersion (number)
   - indexes by_org_handle, by_org
2) Add `funnels` table:
   - orgId, name, handle, status (draft|active|archived), entryStepId (optional string for now)
   - indexes by_org_handle, by_org_status
3) Add `funnelSteps` table (normalized):
   - orgId, funnelId, type (page|checkout|offer|thankyou), name
   - pageId (Id<"pages">)
   - nextStepId (optional string for now)
   - position (optional {x,y})
   - config (optional JSON string)
   - indexes by_funnel, by_org_funnel

B) Convex functions:
- pages: createPage, getPageById, getPageByHandle, updatePageTree, publishPage, listPages
- funnels: createFunnel, getFunnelByHandle, listFunnels
- funnelSteps: createStep (auto creates a Page if none provided), updateStep, setEntryStep, connectNextStep, listStepsByFunnel, deleteStep

C) Builder integration:
- Update funnel-builder-v3 editor to load/save documents from Convex when a `pageId` param is present.
- Migration behavior:
  - If pageId exists but no server tree yet AND localStorage has a doc, auto-upload it as initial tree.
  - After that, debounce-save to Convex.
  - Keep localStorage as a cache, but server is source of truth.

D) Routing for editing:
- Add a dashboard route for editing a page by id (or update existing builder route):
  - /dashboard/pages/[pageId]/edit (preferred)
  - or /dashboard/builder?pageId=...
- Ensure it loads the Convex page + writes back.

Acceptance checks:
- Can create a page row in Convex and edit it in builder; refresh does not lose it.
- Can create a funnel and add at least 3 steps (checkout, offer, thankyou) each with a linked pageId.
```

---

## Prompt 2/4 — Funnel Builder UI: Simple flow + Step Inspector shells + templates
```text
Read the repo changes from Prompt 1 and implement the Funnel Builder UI.

Constraints:
- Do not paste large code in chat; write files directly.
- Use shadcn components.
- Stop after scope is complete; output only file list + summary + verify steps.

Scope:
A) Dashboard pages:
1) /dashboard/funnels
   - list funnels (name, status, handle)
   - create new funnel (name + handle)
2) /dashboard/funnels/[funnelId]
   - "Simple View" step list (linear editor)
   - Add Step button: Checkout | Offer | Thank You | Page
   - Each step row shows: type badge, step name, linked Page name, buttons:
     - Edit Page (opens builder for that pageId)
     - Step Settings (opens inspector panel / sheet)

B) Step Settings panels (shells now; full settings later):
- Checkout Step Settings: products placeholder, screensMode selector, success next step selector
- Offer Step Settings: offer type selector, accept/decline next step selectors
- Thank You: just page linkage

C) Auto-template creation:
- When creating checkout/offer/thankyou step:
  - auto-create a Page with a starter document tree:
    - checkout page includes a placeholder "CheckoutBlock" element node
    - offer page includes "OfferBlock" + placeholder accept/decline buttons
- Don't implement payment logic yet; just create the page docs and show blocks in runtime renderer as placeholders.

Acceptance:
- A funnel can be built end-to-end in UI with linked pages and linear routing.
- Clicking "Edit Page" opens the existing page builder and saves back to Convex.
```

---

## Prompt 3/4 — Payments runtime: One-time + subscription + offers + webhooks
```text
Implement Stripe runtime for Option 2 funnels. Use existing catalog tables.

Constraints:
- Do not paste large code in chat; write files.
- Follow Day-1 rules:
  - no mixed billing in one checkout
  - offers allowed only after one-time checkout
  - subscription uses embedded Stripe Checkout Session
- Stop after scope; output file list + summary + verify steps.

Scope:
A) Step config models (stored in funnelSteps.config JSON string):
- Checkout config:
  - items[{catalogPriceId, qty}], orderBumps[], screensMode 1|2|3
  - enableOneClickOffers boolean
  - subscriptionExperience "embedded_checkout" (day-1 default)
- Offer config:
  - kind (oto|upsell|downsell), catalogPriceId, onAcceptStepId, onDeclineStepId

B) Runtime routes:
1) Public funnel runtime route: /f/[handle]
   - resolves funnel by handle
   - loads entryStepId + steps
   - renders current step's linked page (Convex pages tree)
   - injects runtime context (step type + config + runId + order state)

2) Checkout runtime:
- Determine billing type from selected catalog options:
  - recurring => subscription checkout session
  - one-time => PaymentIntent + Payment Element
  - mixed => show a clear error (later readiness will fix via split)
- One-time:
  - server action/route to create PaymentIntent
  - store checkoutAttempt/order record
  - if enableOneClickOffers: save payment method for off-session usage
- Subscription:
  - create Checkout Session (mode=subscription, ui_mode=embedded)
  - mount embedded checkout inside your CheckoutBlock
  - return handler route/page to finalize and route to next step

3) Offers runtime:
- Only accessible after completed one-time checkout
- Offer accept triggers off-session charge using saved payment method (PaymentIntent)
- Decline routes as configured

C) Webhooks:
- Verify signature using raw body
- Use stripeWebhookEvents for idempotency
- Handle:
  - payment_intent.succeeded (one-time/offer)
  - checkout.session.completed (subscription)
- Update order/attempt state in Convex

D) Renderers:
- Implement CheckoutBlock element renderer and OfferBlock element renderer:
  - CheckoutBlock displays order summary + mounts Stripe UI
  - OfferBlock shows offer details + Accept/Decline actions

Acceptance:
- End-to-end one-time purchase works in test mode and routes to next step.
- Offer accept/decline routing works (with saved PM).
- Subscription checkout session works (embedded) and return routes to thank-you.
```

---

## Prompt 4/4 — Full Safety System: readiness engine + publish gating + Fix actions + Split Checkout
```text
Implement the full UX Safety System for Option 2 funnels.

Constraints:
- Do not paste large code blocks in chat; modify files directly.
- Must be consistent across Flow UI, Inspector, Picker, Publish modal.
- Stop after scope; output file list + summary + verify steps.

Scope:
A) Readiness Engine:
- Compute FunnelReadiness:
  - global issues + per-step issues
  - badges (Mode/Sync/Env/Charge)
  - step checklist (ok/warn/fail) with Fix actions
  - publishBlocked boolean
- Rules Day-1:
  - Stripe connected
  - checkout has items
  - all selected catalog options exist, active, and synced (stripePriceId present)
  - no mixed billing in one checkout
  - offers require one-click enabled on one-time checkout
  - offers disallowed on subscription checkout Day-1
  - offer steps require product option, routing, and buttons

B) UI:
1) Funnel step list page:
- show badges and issue counts per step
- show "Readiness" button to open Publish modal

2) Inspector "Safety Header" (sticky) on Step Settings:
- pills + diagram + collapsible checklist
- Fix buttons execute actions

3) Publish "Payments Readiness" modal:
- grouped by workspace / checkout steps / offer steps / warnings
- publish button disabled when blockers exist

C) Fix actions executor:
- OPEN_PAYMENTS_SETTINGS
- OPEN_STEP
- OPEN_PRICE_PICKER
- SYNC_REQUIRED_PRICES
- ENABLE_ONE_CLICK
- REPAIR_OFFER_ROUTING
- INSERT_OFFER_BUTTONS
- SPLIT_CHECKOUT_BY_BILLING (critical)

D) Split checkout behavior (Option 2 version):
- When checkout is mixed, automatically:
  - create a new checkout step + page
  - move the conflicting items to the new step
  - update routing so funnel remains valid
  - keep offers attached to one-time checkout only
  - toast + optional undo window

Acceptance:
- Publish is blocked when any blocker exists.
- Clicking Fix resolves issues and re-computes readiness immediately.
- Mixed billing triggers Split fix and results in two valid checkout steps.
```

---

# STABILITY + "DON'T GET BURNED" EXTRAS (Run after Prompt 4)

## Prompt 4.5 — Stability pass: publishing/versioning + run session + idempotency + currency/shipping rules
```text
Add stability features needed for production-quality behavior (still Day-1 scope).

Constraints:
- Do not paste large code in chat; write files directly.
- No major refactors unless required.
- Stop after scope; output file list + summary + verify steps.

Scope:
A) Publishing/versioning:
- Ensure runtime uses only published funnels/pages.
- Add a minimal versioning model:
  - pages: publishedTree (or publishedVersion pointer) OR a separate pageVersions table.
  - funnelSteps: publishedConfig OR stepVersions table.
- Implement Publish action for funnel:
  - requires readiness has no blockers
  - snapshots configs + page trees used by published runtime
  - sets funnel.status = active

B) Funnel runs (visitor sessions):
- Add `funnelRuns` table:
  - funnelId, orgId, currentStepId, status
  - orderId? customerEmail?
  - createdAt/updatedAt
- Runtime route should create/maintain runId and advance currentStepId safely.

C) Idempotency beyond webhooks:
- Ensure createPaymentIntent/createCheckoutSession/acceptOffer are idempotent per attempt/run.
- Store stripe IDs on attempts so refresh/retry doesn't duplicate charges.

D) Currency + shipping readiness rules:
- Block mixed currency in a single checkout step.
- For physical products, require collectShipping enabled (or block until implemented).

E) Error UX:
- Add consistent error display, retry, and loading skeletons in CheckoutBlock/OfferBlock.

Acceptance:
- Publishing locks what visitors see (editing drafts doesn't change live).
- Refresh during payment does not create duplicate intents/sessions.
- Runtime can resume a run reliably.
```

---

## Verification commands (after each prompt)
```bash
npm run typecheck
npm run lint
npx convex dev
npm run dev
```

Commit after each prompt:
```bash
git add .
git commit -m "Funnels Option2: Prompt N"
```

---

## Troubleshooting "Windsurf drift" (use this if it goes off scope)
```text
Stop. Re-read docs/funnel-v2-implementation.md. Continue strictly with the next unfinished checklist item from the last prompt. Do not paste large code in chat.
```

---

## Glossary (copy for UI labels)
- **Funnel**: A flow of steps
- **Step**: A node in the funnel flow (Checkout, Offer, Thank You)
- **Page**: A canvas document edited in funnel-builder-v3
- **Screen**: Internal checkout wizard screen (1/2/3)
- **Product**: Catalog product
- **Option**: A catalog price option (one-time or recurring)

---

### End of file

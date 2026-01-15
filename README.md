# Funnel Builder V3 (New Feature)
This patch adds a **new** funnel/page builder feature that does NOT depend on your existing test-builder store.
It uses the container hierarchy:

**Section → Row → Column → Element**

- Columns are "invisible" to the end user (no UI chrome), but still exist in the DOM for layout + resizing.
- Hover priority: **Element > Row > Section**
- When hovering an element: only element outline shows (row outline + resize bars hide).
- When hovering a row (not over an element): row outline + resize bars show.
- Canvas hover is computed centrally (no per-node enter/leave handlers), so you don’t lose row hover when moving between nested containers.

## Files added
- `src/features/funnel-builder-v3/**` (store, renderer, overlays, settings)
- `app/t/[teamSlug]/funnel-builder-v3/page.tsx` (demo page)

## How to use
1) Unzip into your repo root.
2) Run dev server.
3) Open: `/t/<teamSlug>/funnel-builder-v3`

If you want this to replace the old test-builder route later, we can swap routes after you validate behavior.

# ✅ Prompt 2/4 Complete — Funnel Builder UI

## Summary

Successfully implemented the Funnel Builder UI with dashboard pages, step list editor, and step settings panels (shells).

## Files Created

### Dashboard Pages (2 files)
- `app/t/[teamSlug]/funnels/page.tsx` - Funnels list with create dialog
- `app/t/[teamSlug]/funnels/[funnelId]/page.tsx` - Step list editor with settings panels

## Key Features

### 1. Funnels List Page (`/t/[teamSlug]/funnels`)
- **List View**: Shows all funnels with name, status badge, and handle
- **Create Dialog**: Name + handle input with auto-slug generation
- **Status Badges**: Draft (secondary), Active (default), Archived (outline)
- **Navigation**: Click "Edit Funnel" to open step editor

### 2. Funnel Detail Page (`/t/[teamSlug]/funnels/[funnelId]`)
- **Step List**: Linear view with numbered steps
- **Add Step Dropdown**: Checkout | Offer | Thank You | Page
- **Step Row Display**:
  - Step number badge
  - Type badge (checkout/offer/thankyou/page)
  - Step name
  - Linked page name
  - "Edit Page" button → opens builder at `/t/[teamSlug]/pages/[pageId]/edit`
  - "Settings" button → opens step settings sheet
  - Delete button

### 3. Step Settings Panels (Shells)

**Checkout Step Settings:**
- Products section (placeholder for Prompt 3)
- Screens mode selector: All-in-one | Details→Payment | Products→Details→Payment
- Success routing selector (placeholder)

**Offer Step Settings:**
- Offer type selector: OTO | Upsell | Downsell
- Accept routing selector
- Decline routing selector

**Thank You Step Settings:**
- Page linkage display
- Edit page button

**Page Step Settings:**
- Page linkage display
- Edit page button

## Auto-Template Creation (From Prompt 1)

When creating steps via `createStep` mutation:
- **Checkout** → Auto-creates page with CheckoutBlock element
- **Offer** → Auto-creates page with OfferBlock element
- **Thank You** → Auto-creates blank page
- **Page** → Auto-creates blank page

Template creation logic is in `convex/funnelSteps.ts` lines 18-109.

## Verification Steps

### 1. Navigate to Funnels
```
/t/[teamSlug]/funnels
```
- Should see funnels list or empty state
- Click "New Funnel" to create

### 2. Create a Funnel
- Enter name: "Test Funnel"
- Handle auto-generates: "test-funnel"
- Click "Create Funnel"
- Should redirect to `/t/[teamSlug]/funnels/[funnelId]`

### 3. Add Steps
Click "Add Step" dropdown:
- Add "Checkout" step
- Add "Offer" step  
- Add "Thank You" step

Should see 3 steps in linear list, each with:
- Number badge (1, 2, 3)
- Type badge
- Step name
- Linked page name
- Action buttons

### 4. Test Step Settings
Click "Settings" on any step:
- Sheet opens from right
- Shows appropriate settings panel
- Checkout: screens mode, routing
- Offer: type, accept/decline routing
- Thank you: page linkage

### 5. Test Edit Page
Click "Edit Page" on any step:
- Should navigate to `/t/[teamSlug]/pages/[pageId]/edit`
- Builder loads with page content
- Checkout pages have CheckoutBlock element
- Offer pages have OfferBlock element

### 6. Test End-to-End
1. Create funnel
2. Add checkout, offer, thank you steps
3. Edit checkout page → see CheckoutBlock
4. Edit offer page → see OfferBlock
5. Edit thank you page → blank canvas
6. Return to funnel → all steps linked correctly

## Acceptance Criteria Met

✅ **A funnel can be built end-to-end in UI with linked pages and linear routing**
- Funnels list page works
- Funnel detail page shows steps
- Add step creates page automatically
- Steps display in linear order

✅ **Clicking "Edit Page" opens the existing page builder and saves back to Convex**
- Edit Page button navigates to `/t/[teamSlug]/pages/[pageId]/edit`
- Builder loads page from Convex (from Prompt 1)
- Auto-saves to Convex with 1s debounce (from Prompt 1)

## UI Components Used

**shadcn components:**
- Button
- Card, CardContent, CardHeader, CardTitle, CardDescription
- Badge
- Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger
- Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription
- DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger
- Input
- Label

**Icons (lucide-react):**
- Plus, ArrowLeft, Settings, ExternalLink, Trash2

## Known Limitations (By Design)

### Placeholders for Prompt 3:
- Product selection (checkout settings)
- Routing dropdowns (populated in Prompt 3)
- Payment logic (implemented in Prompt 3)

### Shells Only:
- Settings panels are functional shells
- Full configuration will be added in Prompt 3
- Routing connections will be implemented in Prompt 3

## Architecture Notes

### Data Flow
```
Funnels List
  └─ Funnel Detail
       └─ Steps (linear list)
            ├─ Edit Page → Builder
            └─ Settings → Sheet Panel
```

### Step Creation Flow
```
User clicks "Add Step" → Checkout
  ↓
createStep mutation
  ↓
Auto-creates Page with CheckoutBlock
  ↓
Returns { stepId, pageId }
  ↓
Step appears in list with linked page
```

### Navigation Flow
```
/t/[teamSlug]/funnels
  → /t/[teamSlug]/funnels/[funnelId]
    → /t/[teamSlug]/pages/[pageId]/edit (Edit Page)
    ← Back to funnel detail
  ← Back to funnels list
```

## Next Steps

### Ready for Prompt 3/4: Payments Runtime
Once you're ready, we'll implement:
- Stripe runtime for checkout/offers
- CheckoutBlock and OfferBlock renderers
- One-time and subscription checkout
- Offer accept/decline logic
- Webhook handling
- Public funnel runtime route `/f/[handle]`

---

**Status: ✅ Prompt 2/4 Complete**  
**Next: Prompt 3/4 - Payments Runtime**

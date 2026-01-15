# Phase 7 UX Safety System - Quick Start Guide

## 🚀 5-Minute Integration

This guide shows you exactly how to integrate the Phase 7 UX Safety System into your funnel builder.

---

## Step 1: Add Readiness Check to Your Funnel Store

```typescript
// src/features/funnel-builder-v3/store/funnel-store.ts
import { create } from 'zustand';
import { checkFunnelReadiness } from '../lib/readiness-engine';
import type { FunnelReadiness } from '../types/payments';

interface FunnelStore {
  // ... existing state
  readiness: FunnelReadiness | null;
  
  // Add this method
  checkReadiness: () => Promise<void>;
}

export const useFunnelStore = create<FunnelStore>((set, get) => ({
  // ... existing state
  readiness: null,
  
  checkReadiness: async () => {
    const funnel = get().funnel;
    if (!funnel) return;
    
    // Fetch all prices with sync status
    const prices = await fetchPricesWithStatus(); // Your implementation
    
    const readiness = checkFunnelReadiness(funnel, prices);
    set({ readiness });
  },
}));
```

---

## Step 2: Add Safety Header to Checkout Inspector

```typescript
// app/t/[teamSlug]/funnels/[funnelId]/steps/[stepId]/checkout/page.tsx
import { SafetyHeader } from "@/src/features/funnel-builder-v3/components/SafetyHeader";
import { useFunnelStore } from "@/src/features/funnel-builder-v3/store/funnel-store";

export default function CheckoutInspectorPage({ params }: { params: { stepId: string } }) {
  const readiness = useFunnelStore(s => s.readiness);
  const checkReadiness = useFunnelStore(s => s.checkReadiness);
  const stepReadiness = readiness?.steps.get(params.stepId) ?? null;

  return (
    <div className="h-full flex flex-col">
      {/* Add this at the top */}
      <SafetyHeader 
        stepReadiness={stepReadiness}
        onFixExecuted={checkReadiness}
      />
      
      {/* Your existing inspector content */}
      <div className="flex-1 overflow-auto p-6">
        {/* ... */}
      </div>
    </div>
  );
}
```

---

## Step 3: Add Publish Modal to Toolbar

```typescript
// src/features/funnel-builder-v3/components/FunnelToolbar.tsx
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { PublishReadinessModal } from "./PublishReadinessModal";
import { useFunnelStore } from "../store/funnel-store";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";

export function FunnelToolbar() {
  const [showPublishModal, setShowPublishModal] = useState(false);
  const readiness = useFunnelStore(s => s.readiness);
  const checkReadiness = useFunnelStore(s => s.checkReadiness);
  const publishFunnel = useMutation(api.funnels.publish);

  const handlePublishClick = async () => {
    // Check readiness first
    await checkReadiness();
    setShowPublishModal(true);
  };

  const handlePublish = async () => {
    const funnelId = useFunnelStore.getState().funnel?._id;
    if (!funnelId) return;
    
    await publishFunnel({ funnelId });
    // Show success toast
  };

  return (
    <div className="flex items-center gap-2">
      {/* Your existing toolbar buttons */}
      
      <Button onClick={handlePublishClick}>
        Publish
      </Button>

      <PublishReadinessModal
        open={showPublishModal}
        onOpenChange={setShowPublishModal}
        readiness={readiness}
        onPublish={handlePublish}
        onFixExecuted={checkReadiness}
      />
    </div>
  );
}
```

---

## Step 4: Add Step Badges to Flow Builder Nodes

```typescript
// src/features/funnel-builder-v3/components/FlowNode.tsx
import { StepBadgeIndicator, StepBadges } from "./StepBadgeIndicator";
import { useFunnelStore } from "../store/funnel-store";

export function FlowNode({ stepId, data }: FlowNodeProps) {
  const readiness = useFunnelStore(s => s.readiness);
  const stepReadiness = readiness?.steps.get(stepId) ?? null;

  return (
    <div className="flow-node border rounded-lg p-4 bg-white shadow-sm">
      {/* Header with badge indicator */}
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-semibold">{data.name}</h3>
        <StepBadgeIndicator stepReadiness={stepReadiness} />
      </div>
      
      {/* Step badges */}
      <StepBadges stepReadiness={stepReadiness} className="mb-2" />
      
      {/* Node content */}
      <div className="text-sm text-muted-foreground">
        {data.kind}
      </div>
    </div>
  );
}
```

---

## Step 5: Implement Fix Action Handlers

```typescript
// src/features/funnel-builder-v3/lib/fix-handlers.ts
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { executeFixAction } from "./fix-action-executor";
import { useRouter } from "next/navigation";
import type { FixAction } from "../types/payments";

export function useFixActionHandler() {
  const router = useRouter();
  const syncPrice = useMutation(api.stripe.sync.syncPrice);
  const updateFunnel = useMutation(api.funnels.update);

  return async (action: FixAction) => {
    return executeFixAction({
      action,
      
      onNavigate: (path) => {
        router.push(path);
      },
      
      onSyncPrices: async (priceIds) => {
        for (const priceId of priceIds) {
          await syncPrice({ priceId });
        }
      },
      
      onSplitCheckout: async (stepId) => {
        // Get current funnel
        const funnel = useFunnelStore.getState().funnel;
        if (!funnel) return;
        
        // Split checkout logic
        const step = funnel.steps.find(s => s.id === stepId);
        if (!step || step.kind !== "checkout") return;
        
        // TODO: Implement split logic based on your data structure
        // This would separate one-time and subscription items
        // and create a new checkout step
      },
      
      onEnableOneClick: async (stepId) => {
        const funnel = useFunnelStore.getState().funnel;
        if (!funnel) return;
        
        const updatedSteps = funnel.steps.map(s => {
          if (s.id === stepId && s.kind === "checkout") {
            return {
              ...s,
              config: {
                ...s.config,
                oneClickOffersEnabled: true,
              },
            };
          }
          return s;
        });
        
        await updateFunnel({ 
          funnelId: funnel._id, 
          steps: updatedSteps 
        });
      },
      
      onRepairRouting: async (stepId) => {
        // Open routing configuration panel
        router.push(`/funnels/${funnel._id}/steps/${stepId}/routing`);
      },
    });
  };
}
```

---

## Step 6: Auto-Check Readiness on Changes

```typescript
// src/features/funnel-builder-v3/store/funnel-store.ts
export const useFunnelStore = create<FunnelStore>((set, get) => ({
  // ... existing state
  
  updateStepConfig: async (stepId: string, config: any) => {
    // Update the config
    const funnel = get().funnel;
    if (!funnel) return;
    
    const updatedSteps = funnel.steps.map(s => 
      s.id === stepId ? { ...s, config } : s
    );
    
    set({ 
      funnel: { ...funnel, steps: updatedSteps } 
    });
    
    // Auto-recheck readiness after changes
    await get().checkReadiness();
  },
}));
```

---

## Step 7: Create Price Fetch Helper

```typescript
// src/features/funnel-builder-v3/lib/fetch-prices.ts
import { fetchQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import type { PriceWithStatus } from "../types/payments";

export async function fetchPricesWithStatus(): Promise<PriceWithStatus[]> {
  // Fetch all prices from your catalog
  const prices = await fetchQuery(api.catalog.prices.listAll);
  
  // Transform to include sync status
  return prices.map(price => ({
    ...price,
    syncStatus: price.stripePriceId ? "synced" : "needs_sync",
    compatible: true, // Add your compatibility logic
    incompatibilityReason: undefined,
  }));
}
```

---

## Step 8: Add to Your Main Funnel Builder Layout

```typescript
// app/t/[teamSlug]/funnels/[funnelId]/layout.tsx
"use client";

import { useEffect } from "react";
import { useFunnelStore } from "@/src/features/funnel-builder-v3/store/funnel-store";

export default function FunnelBuilderLayout({ children }: { children: React.ReactNode }) {
  const checkReadiness = useFunnelStore(s => s.checkReadiness);
  
  // Check readiness when funnel loads
  useEffect(() => {
    checkReadiness();
  }, [checkReadiness]);
  
  // Recheck every 30 seconds (optional)
  useEffect(() => {
    const interval = setInterval(() => {
      checkReadiness();
    }, 30000);
    
    return () => clearInterval(interval);
  }, [checkReadiness]);
  
  return <>{children}</>;
}
```

---

## 🎨 Styling Tips

The components use your existing UI components from `@/components/ui/*`. Make sure you have:

- ✅ `Badge`
- ✅ `Alert`, `AlertTitle`, `AlertDescription`
- ✅ `Button`
- ✅ `Card`, `CardHeader`, `CardTitle`, `CardContent`
- ✅ `Dialog`, `DialogContent`, `DialogHeader`, `DialogTitle`, `DialogFooter`
- ✅ `ScrollArea`
- ✅ `Separator`

If any are missing, install them from shadcn/ui:

```bash
npx shadcn-ui@latest add badge alert button card dialog scroll-area separator
```

---

## 🧪 Testing Your Integration

### Test 1: Mixed Billing Detection
1. Create a checkout step
2. Add a one-time price
3. Add a subscription price
4. You should see a **blocker** with "Mixed Billing Types"
5. Click "Fix" → Should split into two checkouts

### Test 2: Unsynced Price Detection
1. Create a new price in catalog
2. Don't sync to Stripe
3. Add it to a checkout
4. You should see a **blocker** with "Unsynced Price"
5. Click "Fix" → Should sync the price

### Test 3: Publish Flow
1. Click "Publish" button
2. Modal should show all issues
3. Fix all blockers
4. Publish button should enable
5. Click publish → Funnel goes live

---

## 🐛 Troubleshooting

### "readiness is null"
- Make sure you're calling `checkReadiness()` after funnel loads
- Verify `fetchPricesWithStatus()` is returning data

### "Fix action not working"
- Check that you've implemented all handlers in `useFixActionHandler`
- Look at browser console for errors
- Verify mutations are working

### "Badges not showing"
- Ensure step IDs match between funnel and readiness map
- Check that `stepReadiness` is not null
- Verify prices have `stripePriceId` field

---

## 📚 Next Steps

1. ✅ Follow steps 1-8 above
2. ✅ Test with real funnel data
3. ✅ Customize fix action handlers for your needs
4. ✅ Add custom validation rules if needed
5. ✅ Style components to match your design system

---

## 🎯 You're Done!

Your funnel builder now has:
- ✅ Real-time readiness checking
- ✅ Visual issue indicators
- ✅ One-click automated fixes
- ✅ Pre-publish validation
- ✅ Professional UX safety system

**Questions?** Check `/docs/phase-7-integration.md` for detailed API docs.

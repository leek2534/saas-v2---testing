# Phase 7: UX Safety System - Integration Guide

## 🎯 Overview

Phase 7 provides a **readiness engine** and **fix action executor** to ensure funnels are properly configured before publishing. This prevents common payment integration issues.

---

## 📦 What's Included

### **1. Readiness Engine**
Location: `/src/features/funnel-builder-v3/lib/readiness-engine.ts`

**Purpose:** Analyzes funnel configuration and identifies blockers/warnings

**Key Features:**
- ✅ Detects mixed billing types (one-time + subscription)
- ✅ Checks for unsynced prices
- ✅ Validates offer routing
- ✅ Ensures workspace Stripe integration
- ✅ Generates badges and checklists

**Usage:**
```typescript
import { checkFunnelReadiness } from "@/src/features/funnel-builder-v3/lib/readiness-engine";

const readiness = checkFunnelReadiness(funnel, prices);

if (readiness.publishBlocked) {
  console.log("Cannot publish - blockers exist");
  console.log(readiness.globalIssues);
}

// Check specific step
const stepReadiness = readiness.steps.get(stepId);
console.log(stepReadiness.badges); // { mode, sync, env, charge }
console.log(stepReadiness.issues); // Array of ReadinessIssue
```

### **2. Fix Action Executor**
Location: `/src/features/funnel-builder-v3/lib/fix-action-executor.ts`

**Purpose:** Executes automated fixes for common issues

**Key Features:**
- ✅ Sync prices to Stripe
- ✅ Split checkout by billing type (magic fix)
- ✅ Navigate to settings/catalog
- ✅ Enable one-click offers
- ✅ Repair offer routing

**Usage:**
```typescript
import { executeFixAction } from "@/src/features/funnel-builder-v3/lib/fix-action-executor";

const result = await executeFixAction({
  action: issue.fixAction,
  onNavigate: (path) => router.push(path),
  onSyncPrices: async (priceIds) => {
    for (const priceId of priceIds) {
      await syncPrice({ priceId });
    }
  },
  onSplitCheckout: async (stepId) => {
    await splitCheckoutByBilling(stepId, getFunnel, updateFunnel);
  },
});

if (result.success) {
  toast.success(result.message);
}
```

---

## 🔧 Integration Steps

### **Step 1: Add to Funnel Builder Store**

Update your funnel builder store to include readiness checking:

```typescript
// src/features/funnel-builder-v3/store/funnel-store.ts
import { checkFunnelReadiness } from "../lib/readiness-engine";
import type { FunnelReadiness } from "../types/payments";

export const useFunnelStore = create((set, get) => ({
  // ... existing state
  readiness: null as FunnelReadiness | null,
  
  checkReadiness: async () => {
    const funnel = get().funnel;
    const prices = await fetchPricesWithStatus();
    const readiness = checkFunnelReadiness(funnel, prices);
    set({ readiness });
    return readiness;
  },
}));
```

### **Step 2: Create Safety Header Component**

```typescript
// src/features/funnel-builder-v3/components/SafetyHeader.tsx
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";

export function SafetyHeader({ stepId }: { stepId: string }) {
  const readiness = useFunnelStore(s => s.readiness);
  const stepReadiness = readiness?.steps.get(stepId);
  
  if (!stepReadiness) return null;
  
  return (
    <div className="sticky top-0 z-50 bg-white border-b">
      {/* Row 1: Badges */}
      <div className="flex items-center gap-2 p-3">
        {stepReadiness.badges.mode && (
          <Badge variant="outline">{stepReadiness.badges.mode}</Badge>
        )}
        {stepReadiness.badges.sync && (
          <Badge variant={stepReadiness.badges.sync === "synced" ? "success" : "warning"}>
            {stepReadiness.badges.sync}
          </Badge>
        )}
        {stepReadiness.badges.env && (
          <Badge variant="outline">{stepReadiness.badges.env}</Badge>
        )}
      </div>
      
      {/* Row 2: Issues */}
      {stepReadiness.issues.length > 0 && (
        <div className="p-3 space-y-2">
          {stepReadiness.issues.map(issue => (
            <Alert key={issue.id} variant={issue.severity === "blocker" ? "destructive" : "default"}>
              <AlertDescription className="flex items-center justify-between">
                <div>
                  <strong>{issue.title}</strong>
                  <p className="text-sm">{issue.description}</p>
                </div>
                {issue.fixAction && (
                  <Button size="sm" onClick={() => handleFix(issue.fixAction)}>
                    Fix
                  </Button>
                )}
              </AlertDescription>
            </Alert>
          ))}
        </div>
      )}
    </div>
  );
}
```

### **Step 3: Create Publish Readiness Modal**

```typescript
// src/features/funnel-builder-v3/components/PublishReadinessModal.tsx
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export function PublishReadinessModal({ open, onOpenChange }: Props) {
  const readiness = useFunnelStore(s => s.readiness);
  
  const blockers = readiness?.globalIssues.filter(i => i.severity === "blocker") || [];
  const warnings = readiness?.globalIssues.filter(i => i.severity === "warning") || [];
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {readiness?.publishBlocked ? "Cannot Publish" : "Ready to Publish"}
          </DialogTitle>
        </DialogHeader>
        
        {blockers.length > 0 && (
          <div className="space-y-2">
            <h3 className="font-semibold text-red-600">Blockers</h3>
            {blockers.map(issue => (
              <IssueCard key={issue.id} issue={issue} />
            ))}
          </div>
        )}
        
        {warnings.length > 0 && (
          <div className="space-y-2">
            <h3 className="font-semibold text-yellow-600">Warnings</h3>
            {warnings.map(issue => (
              <IssueCard key={issue.id} issue={issue} />
            ))}
          </div>
        )}
        
        <Button
          disabled={readiness?.publishBlocked}
          onClick={handlePublish}
        >
          {readiness?.publishBlocked ? "Fix Issues First" : "Publish Funnel"}
        </Button>
      </DialogContent>
    </Dialog>
  );
}
```

### **Step 4: Integrate with Publish Button**

```typescript
// In your funnel builder toolbar
const handlePublishClick = async () => {
  const readiness = await checkReadiness();
  
  if (readiness.publishBlocked) {
    setShowReadinessModal(true);
  } else {
    await publishFunnel();
  }
};
```

---

## 🎨 UI Components Needed

### **1. Issue Card Component**
```typescript
function IssueCard({ issue }: { issue: ReadinessIssue }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm">{issue.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">{issue.description}</p>
        {issue.fixAction && (
          <Button size="sm" className="mt-2" onClick={() => executeFix(issue.fixAction)}>
            Fix Now
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
```

### **2. Step Badge Indicator**
```typescript
function StepBadgeIndicator({ stepId }: { stepId: string }) {
  const readiness = useFunnelStore(s => s.readiness);
  const stepReadiness = readiness?.steps.get(stepId);
  
  const blockerCount = stepReadiness?.issues.filter(i => i.severity === "blocker").length || 0;
  const warningCount = stepReadiness?.issues.filter(i => i.severity === "warning").length || 0;
  
  if (blockerCount === 0 && warningCount === 0) {
    return <CheckCircle className="h-4 w-4 text-green-500" />;
  }
  
  return (
    <div className="relative">
      {blockerCount > 0 ? (
        <XCircle className="h-4 w-4 text-red-500" />
      ) : (
        <AlertCircle className="h-4 w-4 text-yellow-500" />
      )}
      <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
        {blockerCount + warningCount}
      </span>
    </div>
  );
}
```

---

## 🔄 Split Checkout Magic Fix

The most powerful fix action is **split checkout by billing type**:

```typescript
import { splitCheckoutByBilling } from "@/src/features/funnel-builder-v3/lib/fix-action-executor";

const result = await splitCheckoutByBilling(
  stepId,
  async () => getFunnel(),
  async (updates) => updateFunnel(updates)
);

toast.success(`Created subscription checkout and moved ${result.movedItemsCount} items`);
```

**What it does:**
1. Analyzes checkout items and bumps
2. Separates one-time vs subscription items
3. Keeps original checkout as one-time
4. Creates new subscription checkout page
5. Updates funnel routing
6. Shows success message with undo option

---

## 📊 Readiness Check Flow

```
User clicks "Publish"
    ↓
Check funnel readiness
    ↓
Has blockers? → Yes → Show readiness modal
    ↓              ↓
    No         User clicks "Fix"
    ↓              ↓
Publish!      Execute fix action
                   ↓
              Re-check readiness
                   ↓
              Update UI
```

---

## 🧪 Testing

### **Test Mixed Billing Detection**
```typescript
const funnel = {
  steps: [{
    id: "checkout-1",
    kind: "checkout",
    config: {
      items: [
        { catalogPriceId: oneTimePriceId, quantity: 1 },
        { catalogPriceId: subscriptionPriceId, quantity: 1 },
      ],
      orderBumps: [],
    },
  }],
};

const readiness = checkFunnelReadiness(funnel, prices);
// Should have blocker: "Mixed Billing Types"
// Should have fixAction: { type: "split_checkout_by_billing" }
```

### **Test Unsynced Price Detection**
```typescript
const prices = [{
  _id: priceId,
  stripePriceId: undefined, // Not synced
  billing: { type: "one_time" },
}];

const readiness = checkFunnelReadiness(funnel, prices);
// Should have blocker: "Unsynced Price"
// Should have fixAction: { type: "sync_options", priceIds: [priceId] }
```

---

## 🎯 Next Steps

1. **Integrate readiness checking** into your funnel builder store
2. **Add SafetyHeader** to checkout/offer inspectors
3. **Create PublishReadinessModal** for publish flow
4. **Implement fix action handlers** for your specific use case
5. **Add step badges** to flow builder nodes
6. **Test all fix actions** with real funnel data

---

## 📚 Type Definitions

All types are defined in `/src/features/funnel-builder-v3/types/payments.ts`:

- `ReadinessIssue` - Individual issue with severity and fix action
- `StepReadiness` - Per-step readiness with badges and checklist
- `FunnelReadiness` - Overall funnel readiness
- `FixAction` - Union type of all possible fix actions

---

## ✅ Phase 7 Complete!

You now have:
- ✅ Readiness engine for detecting issues
- ✅ Fix action executor for automated fixes
- ✅ Split checkout magic fix
- ✅ Type-safe integration points
- ✅ UI component examples

**All 7 phases of the Funnel Builder Payments system are now complete!** 🎉

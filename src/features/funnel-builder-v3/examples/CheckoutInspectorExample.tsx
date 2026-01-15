"use client";

/**
 * Example: Checkout Inspector with Safety System Integration
 * 
 * This example shows how to integrate the Phase 7 UX Safety System
 * into your checkout inspector component.
 */

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SafetyHeader } from "../components/SafetyHeader";
import { PricePicker } from "../components/PricePicker";
import { useReadinessCheck } from "../hooks/useReadinessCheck";
import type { CheckoutConfig } from "../types/payments";
import { Id } from "@/convex/_generated/dataModel";

interface CheckoutInspectorProps {
  stepId: string;
  config: CheckoutConfig;
  onUpdateConfig: (config: CheckoutConfig) => void;
}

export function CheckoutInspectorExample({
  stepId,
  config,
  onUpdateConfig,
}: CheckoutInspectorProps) {
  const [isPickerOpen, setIsPickerOpen] = useState(false);

  // Get funnel data (you'd get this from your store)
  const funnel = {
    _id: "funnel_123",
    steps: [
      {
        id: stepId,
        kind: "checkout" as const,
        config,
      },
    ],
  };

  // Check readiness
  const { readiness, recheckReadiness } = useReadinessCheck({
    funnel,
    enabled: true,
  });

  const stepReadiness = readiness?.steps.get(stepId) ?? null;

  const handleAddItem = (priceId: Id<"catalogPrices">) => {
    const updatedConfig = {
      ...config,
      items: [
        ...config.items,
        { catalogPriceId: priceId, quantity: 1 },
      ],
    };
    onUpdateConfig(updatedConfig);
    recheckReadiness();
  };

  const handleRemoveItem = (index: number) => {
    const updatedConfig = {
      ...config,
      items: config.items.filter((_, i) => i !== index),
    };
    onUpdateConfig(updatedConfig);
    recheckReadiness();
  };

  // Determine current billing type for compatibility checking
  const currentBillingType = config.items.length > 0 ? "one_time" : undefined;

  return (
    <div className="flex flex-col h-full">
      {/* Safety Header - shows issues and badges */}
      <SafetyHeader
        stepReadiness={stepReadiness}
        onFixExecuted={recheckReadiness}
      />

      {/* Inspector Content */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {/* Checkout Items */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Checkout Items</span>
              <Button onClick={() => setIsPickerOpen(true)}>
                Add Product
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {config.items.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">
                No items added yet. Click "Add Product" to get started.
              </p>
            ) : (
              <div className="space-y-2">
                {config.items.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 border rounded-lg"
                  >
                    <div>
                      <p className="font-medium">Price ID: {item.catalogPriceId}</p>
                      <p className="text-sm text-muted-foreground">
                        Quantity: {item.quantity}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveItem(index)}
                    >
                      Remove
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Order Bumps */}
        <Card>
          <CardHeader>
            <CardTitle>Order Bumps</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              {config.orderBumps.length} bump(s) configured
            </p>
          </CardContent>
        </Card>

        {/* Checkout Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium">Screens Mode</label>
              <p className="text-sm text-muted-foreground">
                {config.screensMode === 1 && "All-in-one"}
                {config.screensMode === 2 && "Details → Payment"}
                {config.screensMode === 3 && "Products → Details → Payment"}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium">One-Click Offers</label>
              <p className="text-sm text-muted-foreground">
                {config.oneClickOffersEnabled ? "Enabled" : "Disabled"}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Price Picker Dialog */}
      <PricePicker
        open={isPickerOpen}
        onOpenChange={setIsPickerOpen}
        onSelect={handleAddItem}
        currentBillingType={currentBillingType}
        excludePriceIds={config.items.map(i => i.catalogPriceId)}
      />
    </div>
  );
}

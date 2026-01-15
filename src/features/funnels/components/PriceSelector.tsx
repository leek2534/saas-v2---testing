"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface PriceSelectorProps {
  selectedPriceIds: Id<"catalogPrices">[];
  onSelect: (priceIds: Id<"catalogPrices">[]) => void;
  multiple?: boolean;
  orgId: Id<"teams">;
}

export function PriceSelector({ selectedPriceIds, onSelect, multiple = true, orgId }: PriceSelectorProps) {
  const products = useQuery(api.catalog.products.listProducts, {});
  
  if (!products) {
    return <div className="text-sm text-muted-foreground">Loading prices...</div>;
  }

  const handleToggle = (priceId: Id<"catalogPrices">) => {
    if (multiple) {
      if (selectedPriceIds.includes(priceId)) {
        onSelect(selectedPriceIds.filter(id => id !== priceId));
      } else {
        onSelect([...selectedPriceIds, priceId]);
      }
    } else {
      onSelect([priceId]);
    }
  };

  return (
    <div className="space-y-2">
      {products.map((product: any) => (
        <div key={product._id} className="border rounded-lg p-3">
          <div className="font-medium mb-2">{product.name}</div>
          <div className="space-y-1">
            {product.prices?.map((price: any) => {
              const isSelected = selectedPriceIds.includes(price._id);
              const billingLabel = price.billing.type === "recurring" 
                ? `$${(price.amount / 100).toFixed(2)}/${price.billing.interval}`
                : `$${(price.amount / 100).toFixed(2)} one-time`;
              
              return (
                <button
                  key={price._id}
                  type="button"
                  onClick={() => handleToggle(price._id)}
                  className={cn(
                    "w-full flex items-center justify-between p-2 rounded border text-sm transition-colors",
                    isSelected 
                      ? "bg-primary text-primary-foreground border-primary" 
                      : "hover:bg-accent"
                  )}
                >
                  <span>{billingLabel}</span>
                  {isSelected && <Check className="h-4 w-4" />}
                </button>
              );
            })}
          </div>
        </div>
      ))}
      
      {products.length === 0 && (
        <div className="text-sm text-muted-foreground text-center py-4">
          No products found. Create products in the Catalog first.
        </div>
      )}
    </div>
  );
}

"use client";

import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Search, Package, DollarSign, Calendar, AlertCircle, CheckCircle2, Loader2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";
import type { ProductWithPrices, PriceWithStatus, BillingType } from "../types/payments";

type PricePickerProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelect: (priceId: Id<"catalogPrices">) => void;
  currentBillingType?: BillingType;
  excludePriceIds?: Id<"catalogPrices">[];
};

export function PricePicker({
  open,
  onOpenChange,
  onSelect,
  currentBillingType,
  excludePriceIds = [],
}: PricePickerProps) {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedProducts, setExpandedProducts] = useState<Set<string>>(new Set());
  const [syncingPrices, setSyncingPrices] = useState<Set<string>>(new Set());

  const products = useQuery(api.catalog.listProducts, {}) || [];
  const syncProduct = useMutation(api.stripe.syncProductToStripe);

  const toggleProduct = (productId: string) => {
    const newExpanded = new Set(expandedProducts);
    if (newExpanded.has(productId)) {
      newExpanded.delete(productId);
    } else {
      newExpanded.add(productId);
    }
    setExpandedProducts(newExpanded);
  };

  const handleSyncAndSelect = async (priceId: Id<"catalogPrices">, productId: Id<"catalogProducts">) => {
    setSyncingPrices(new Set(syncingPrices).add(priceId));
    
    try {
      await syncProduct({ productId });
      
      toast({
        title: "Synced to Stripe",
        description: "Price has been synced successfully",
      });
      
      onSelect(priceId);
      onOpenChange(false);
    } catch (error) {
      toast({
        title: "Sync Failed",
        description: error instanceof Error ? error.message : "Failed to sync to Stripe",
        variant: "destructive",
      });
    } finally {
      setSyncingPrices(new Set([...syncingPrices].filter(id => id !== priceId)));
    }
  };

  const handleSelectPrice = (priceId: Id<"catalogPrices">, needsSync: boolean, productId: Id<"catalogProducts">) => {
    if (needsSync) {
      handleSyncAndSelect(priceId, productId);
    } else {
      onSelect(priceId);
      onOpenChange(false);
    }
  };

  const checkCompatibility = (price: any): { compatible: boolean; reason?: string } => {
    if (!currentBillingType) return { compatible: true };

    const priceBillingType = price.billing.type === "one_time" ? "one_time" : "recurring";
    
    if (currentBillingType !== priceBillingType) {
      return {
        compatible: false,
        reason: `Cannot mix ${currentBillingType === "one_time" ? "one-time" : "subscription"} with ${priceBillingType === "one_time" ? "one-time" : "subscription"} items`,
      };
    }

    return { compatible: true };
  };

  const formatPrice = (amount: number, currency: string) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency,
    }).format(amount / 100);
  };

  const getBillingDisplay = (billing: any) => {
    if (billing.type === "one_time") {
      return "One-time";
    }
    const interval = billing.intervalCount === 1 
      ? billing.interval 
      : `${billing.intervalCount} ${billing.interval}s`;
    return `Every ${interval}`;
  };

  const filteredProducts = products.filter((product: any) => {
    if (product.status !== "active") return false;
    
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>Select Product & Option</DialogTitle>
          <DialogDescription>
            Choose a product and pricing option for your checkout or offer
          </DialogDescription>
        </DialogHeader>

        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        <div className="flex-1 overflow-y-auto space-y-3">
          {filteredProducts.length === 0 ? (
            <Card className="border-dashed">
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Package className="h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-muted-foreground">No active products found</p>
              </CardContent>
            </Card>
          ) : (
            filteredProducts.map((product: any) => {
              const isExpanded = expandedProducts.has(product._id);
              
              return (
                <Card key={product._id} className="overflow-hidden">
                  <CardHeader 
                    className="cursor-pointer hover:bg-muted/50 transition-colors"
                    onClick={() => toggleProduct(product._id)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="h-12 w-12 rounded-lg bg-muted flex items-center justify-center">
                          <Package className="h-6 w-6 text-muted-foreground" />
                        </div>
                        <div>
                          <CardTitle className="text-base">{product.name}</CardTitle>
                          {product.shortDescription && (
                            <CardDescription className="text-sm mt-1">
                              {product.shortDescription}
                            </CardDescription>
                          )}
                          <div className="flex gap-2 mt-2">
                            <Badge variant="outline" className="text-xs">
                              {product.type}
                            </Badge>
                            {product.stripeProductId ? (
                              <Badge variant="outline" className="text-xs text-green-600 border-green-600">
                                <CheckCircle2 className="h-3 w-3 mr-1" />
                                Synced
                              </Badge>
                            ) : (
                              <Badge variant="outline" className="text-xs text-amber-600 border-amber-600">
                                <AlertCircle className="h-3 w-3 mr-1" />
                                Needs Sync
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardHeader>

                  {isExpanded && (
                    <CardContent className="pt-0 space-y-2">
                      {/* Fetch prices for this product */}
                      <PricesList
                        productId={product._id}
                        onSelect={handleSelectPrice}
                        checkCompatibility={checkCompatibility}
                        formatPrice={formatPrice}
                        getBillingDisplay={getBillingDisplay}
                        syncingPrices={syncingPrices}
                        excludePriceIds={excludePriceIds}
                      />
                    </CardContent>
                  )}
                </Card>
              );
            })
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

function PricesList({
  productId,
  onSelect,
  checkCompatibility,
  formatPrice,
  getBillingDisplay,
  syncingPrices,
  excludePriceIds,
}: {
  productId: Id<"catalogProducts">;
  onSelect: (priceId: Id<"catalogPrices">, needsSync: boolean, productId: Id<"catalogProducts">) => void;
  checkCompatibility: (price: any) => { compatible: boolean; reason?: string };
  formatPrice: (amount: number, currency: string) => string;
  getBillingDisplay: (billing: any) => string;
  syncingPrices: Set<string>;
  excludePriceIds: Id<"catalogPrices">[];
}) {
  const prices = useQuery(api.catalog.listPrices, { productId }) || [];

  if (prices.length === 0) {
    return (
      <div className="text-sm text-muted-foreground py-4 text-center">
        No pricing options available
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {prices.map((price: any) => {
        const { compatible, reason } = checkCompatibility(price);
        const needsSync = !price.stripePriceId;
        const isSyncing = syncingPrices.has(price._id);
        const isExcluded = excludePriceIds.includes(price._id);

        return (
          <div
            key={price._id}
            className={cn(
              "flex items-center justify-between p-3 rounded-lg border",
              !compatible && "opacity-50 bg-muted/50",
              isExcluded && "opacity-50"
            )}
          >
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center">
                {price.billing.type === "one_time" ? (
                  <DollarSign className="h-5 w-5 text-muted-foreground" />
                ) : (
                  <Calendar className="h-5 w-5 text-muted-foreground" />
                )}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-medium">{price.nickname}</span>
                  {price.isDefault && (
                    <Badge variant="secondary" className="text-xs">Default</Badge>
                  )}
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span className="font-semibold text-foreground">
                    {formatPrice(price.amount, price.currency)}
                  </span>
                  <span>·</span>
                  <span>{getBillingDisplay(price.billing)}</span>
                </div>
                {!compatible && reason && (
                  <div className="flex items-center gap-1 text-xs text-amber-600 mt-1">
                    <AlertCircle className="h-3 w-3" />
                    {reason}
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2">
              {needsSync && (
                <Badge variant="outline" className="text-xs text-amber-600 border-amber-600">
                  Needs Sync
                </Badge>
              )}
              
              {isExcluded ? (
                <Badge variant="secondary">Already Selected</Badge>
              ) : (
                <Button
                  size="sm"
                  onClick={() => onSelect(price._id, needsSync, productId)}
                  disabled={!compatible || isSyncing}
                >
                  {isSyncing ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Syncing...
                    </>
                  ) : needsSync ? (
                    "Sync & Select"
                  ) : (
                    "Select"
                  )}
                </Button>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

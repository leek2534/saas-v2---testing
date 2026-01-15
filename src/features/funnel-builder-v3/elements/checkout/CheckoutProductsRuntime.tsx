import React, { useState } from "react";
import { CheckoutProductsProps } from "../../types/checkout-elements";
import { cn } from "@/lib/utils";
import { Package } from "lucide-react";

interface Product {
  id: string;
  name: string;
  description?: string;
  price: number;
  image?: string;
  currency?: string;
}

interface CheckoutProductsRuntimeProps {
  props: Partial<CheckoutProductsProps>;
  products?: Product[];
  onQuantityChange?: (productId: string, quantity: number) => void;
  initialQuantities?: Record<string, number>;
}

export function CheckoutProductsRuntime({ 
  props, 
  products = [],
  onQuantityChange,
  initialQuantities = {}
}: CheckoutProductsRuntimeProps) {
  const {
    showImages = true,
    showDescriptions = true,
    allowQuantityChange = true,
    layout = "list",
    showPricing = true,
  } = props;

  const [quantities, setQuantities] = useState<Record<string, number>>(initialQuantities);

  // Default products if none provided
  const displayProducts = products.length > 0 ? products : [
    {
      id: "default-1",
      name: "Premium Product",
      description: "High-quality product with amazing features",
      price: 9900, // in cents
      currency: "USD",
    },
  ];

  const handleQuantityChange = (productId: string, delta: number) => {
    const currentQty = quantities[productId] || 1;
    const newQty = Math.max(1, currentQty + delta);
    
    setQuantities({ ...quantities, [productId]: newQty });
    
    if (onQuantityChange) {
      onQuantityChange(productId, newQty);
    }
  };

  const formatPrice = (price: number, currency: string = "USD") => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
    }).format(price / 100);
  };

  const renderListLayout = () => (
    <div className="space-y-4">
      {displayProducts.map((product) => {
        const qty = quantities[product.id] || 1;
        
        return (
          <div key={product.id} className="flex items-start gap-4 rounded-lg border border-slate-200 p-4">
            {showImages && (
              <div className="flex h-20 w-20 flex-shrink-0 items-center justify-center rounded-lg bg-slate-100">
                {product.image ? (
                  <img src={product.image} alt={product.name} className="h-full w-full object-cover rounded-lg" />
                ) : (
                  <Package className="h-8 w-8 text-slate-400" />
                )}
              </div>
            )}
            <div className="flex-1">
              <h4 className="font-semibold text-slate-900">{product.name}</h4>
              {showDescriptions && product.description && (
                <p className="mt-1 text-sm text-slate-500">{product.description}</p>
              )}
              {allowQuantityChange && (
                <div className="mt-2 flex items-center gap-2">
                  <span className="text-sm text-slate-600">Qty:</span>
                  <div className="flex items-center rounded-md border border-slate-300">
                    <button 
                      onClick={() => handleQuantityChange(product.id, -1)}
                      className="px-2 py-1 text-slate-600 hover:bg-slate-50 transition-colors"
                    >
                      −
                    </button>
                    <span className="px-3 py-1 text-sm font-medium">{qty}</span>
                    <button 
                      onClick={() => handleQuantityChange(product.id, 1)}
                      className="px-2 py-1 text-slate-600 hover:bg-slate-50 transition-colors"
                    >
                      +
                    </button>
                  </div>
                </div>
              )}
            </div>
            {showPricing && (
              <div className="text-right">
                <div className="text-lg font-bold text-slate-900">
                  {formatPrice(product.price * qty, product.currency)}
                </div>
                {qty > 1 && (
                  <div className="text-xs text-slate-500">
                    {formatPrice(product.price, product.currency)} each
                  </div>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );

  const renderGridLayout = () => (
    <div className="grid grid-cols-2 gap-4">
      {displayProducts.map((product) => {
        const qty = quantities[product.id] || 1;
        
        return (
          <div key={product.id} className="rounded-lg border border-slate-200 p-4">
            {showImages && (
              <div className="mb-3 flex h-32 items-center justify-center rounded-lg bg-slate-100">
                {product.image ? (
                  <img src={product.image} alt={product.name} className="h-full w-full object-cover rounded-lg" />
                ) : (
                  <Package className="h-12 w-12 text-slate-400" />
                )}
              </div>
            )}
            <h4 className="font-semibold text-slate-900">{product.name}</h4>
            {showDescriptions && product.description && (
              <p className="mt-1 text-sm text-slate-500">{product.description}</p>
            )}
            {showPricing && (
              <div className="mt-2 text-lg font-bold text-slate-900">
                {formatPrice(product.price * qty, product.currency)}
              </div>
            )}
            {allowQuantityChange && (
              <div className="mt-3 flex items-center justify-center gap-2">
                <button 
                  onClick={() => handleQuantityChange(product.id, -1)}
                  className="rounded-md border border-slate-300 px-2 py-1 text-slate-600 hover:bg-slate-50 transition-colors"
                >
                  −
                </button>
                <span className="px-3 py-1 text-sm font-medium">{qty}</span>
                <button 
                  onClick={() => handleQuantityChange(product.id, 1)}
                  className="rounded-md border border-slate-300 px-2 py-1 text-slate-600 hover:bg-slate-50 transition-colors"
                >
                  +
                </button>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );

  const renderCompactLayout = () => (
    <div className="space-y-2">
      {displayProducts.map((product) => {
        const qty = quantities[product.id] || 1;
        
        return (
          <div key={product.id} className="flex items-center justify-between rounded-lg border border-slate-200 p-3">
            <div className="flex items-center gap-3">
              {showImages && (
                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded bg-slate-100">
                  {product.image ? (
                    <img src={product.image} alt={product.name} className="h-full w-full object-cover rounded" />
                  ) : (
                    <Package className="h-6 w-6 text-slate-400" />
                  )}
                </div>
              )}
              <div>
                <h4 className="text-sm font-semibold text-slate-900">{product.name}</h4>
                {allowQuantityChange && (
                  <div className="mt-1 flex items-center gap-1">
                    <button 
                      onClick={() => handleQuantityChange(product.id, -1)}
                      className="rounded px-1.5 py-0.5 text-xs text-slate-600 hover:bg-slate-50 transition-colors"
                    >
                      −
                    </button>
                    <span className="px-2 text-xs font-medium">{qty}</span>
                    <button 
                      onClick={() => handleQuantityChange(product.id, 1)}
                      className="rounded px-1.5 py-0.5 text-xs text-slate-600 hover:bg-slate-50 transition-colors"
                    >
                      +
                    </button>
                  </div>
                )}
              </div>
            </div>
            {showPricing && (
              <div className="font-bold text-slate-900">
                {formatPrice(product.price * qty, product.currency)}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );

  return (
    <div className="w-full rounded-lg border border-green-500 bg-white p-6">
      <div className="mb-2 flex items-center gap-2 text-xs text-green-600 bg-green-50 px-2 py-1 rounded">
        <span className="font-semibold">✓ LIVE RUNTIME</span>
        <span>Interactive product selection</span>
      </div>
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-slate-900">Select Products</h3>
        <p className="text-sm text-slate-500 mt-1">Choose your items</p>
      </div>
      
      {layout === "list" && renderListLayout()}
      {layout === "grid" && renderGridLayout()}
      {layout === "compact" && renderCompactLayout()}
    </div>
  );
}

import React from "react";
import { CheckoutProductsProps } from "../../types/checkout-elements";
import { cn } from "@/lib/utils";
import { Package } from "lucide-react";

interface CheckoutProductsMockupProps {
  props: Partial<CheckoutProductsProps>;
}

export function CheckoutProductsMockup({ props }: CheckoutProductsMockupProps) {
  const {
    showImages = true,
    showDescriptions = true,
    allowQuantityChange = true,
    layout = "list",
    showPricing = true,
  } = props;

  const mockProducts = [
    {
      name: "Premium Product",
      description: "High-quality product with amazing features",
      price: "$99.00",
      image: null,
    },
  ];

  const renderListLayout = () => (
    <div className="space-y-4">
      {mockProducts.map((product, idx) => (
        <div key={idx} className="flex items-start gap-4 rounded-lg border border-slate-200 p-4">
          {showImages && (
            <div className="flex h-20 w-20 flex-shrink-0 items-center justify-center rounded-lg bg-slate-100">
              <Package className="h-8 w-8 text-slate-400" />
            </div>
          )}
          <div className="flex-1">
            <h4 className="font-semibold text-slate-900">{product.name}</h4>
            {showDescriptions && (
              <p className="mt-1 text-sm text-slate-500">{product.description}</p>
            )}
            {allowQuantityChange && (
              <div className="mt-2 flex items-center gap-2">
                <span className="text-sm text-slate-600">Qty:</span>
                <div className="flex items-center rounded-md border border-slate-300">
                  <button className="px-2 py-1 text-slate-600 hover:bg-slate-50">−</button>
                  <span className="px-3 py-1 text-sm font-medium">1</span>
                  <button className="px-2 py-1 text-slate-600 hover:bg-slate-50">+</button>
                </div>
              </div>
            )}
          </div>
          {showPricing && (
            <div className="text-right">
              <div className="text-lg font-bold text-slate-900">{product.price}</div>
            </div>
          )}
        </div>
      ))}
    </div>
  );

  const renderGridLayout = () => (
    <div className="grid grid-cols-2 gap-4">
      {mockProducts.map((product, idx) => (
        <div key={idx} className="rounded-lg border border-slate-200 p-4">
          {showImages && (
            <div className="mb-3 flex h-32 items-center justify-center rounded-lg bg-slate-100">
              <Package className="h-12 w-12 text-slate-400" />
            </div>
          )}
          <h4 className="font-semibold text-slate-900">{product.name}</h4>
          {showDescriptions && (
            <p className="mt-1 text-sm text-slate-500">{product.description}</p>
          )}
          {showPricing && (
            <div className="mt-2 text-lg font-bold text-slate-900">{product.price}</div>
          )}
          {allowQuantityChange && (
            <div className="mt-3 flex items-center justify-center gap-2">
              <button className="rounded-md border border-slate-300 px-2 py-1 text-slate-600 hover:bg-slate-50">
                −
              </button>
              <span className="px-3 py-1 text-sm font-medium">1</span>
              <button className="rounded-md border border-slate-300 px-2 py-1 text-slate-600 hover:bg-slate-50">
                +
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  );

  const renderCompactLayout = () => (
    <div className="space-y-2">
      {mockProducts.map((product, idx) => (
        <div key={idx} className="flex items-center justify-between rounded-lg border border-slate-200 p-3">
          <div className="flex items-center gap-3">
            {showImages && (
              <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded bg-slate-100">
                <Package className="h-6 w-6 text-slate-400" />
              </div>
            )}
            <div>
              <h4 className="text-sm font-semibold text-slate-900">{product.name}</h4>
              {allowQuantityChange && (
                <div className="mt-1 flex items-center gap-1">
                  <button className="rounded px-1.5 py-0.5 text-xs text-slate-600 hover:bg-slate-50">−</button>
                  <span className="px-2 text-xs font-medium">1</span>
                  <button className="rounded px-1.5 py-0.5 text-xs text-slate-600 hover:bg-slate-50">+</button>
                </div>
              )}
            </div>
          </div>
          {showPricing && <div className="font-bold text-slate-900">{product.price}</div>}
        </div>
      ))}
    </div>
  );

  return (
    <div className="w-full rounded-lg border border-slate-200 bg-white p-6">
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

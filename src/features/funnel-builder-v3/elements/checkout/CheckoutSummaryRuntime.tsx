import React, { useState } from "react";
import { CheckoutSummaryProps } from "../../types/checkout-elements";
import { ChevronDown, ChevronUp } from "lucide-react";

interface LineItem {
  id: string;
  name: string;
  quantity: number;
  amount: number;
}

interface CheckoutSummaryRuntimeProps {
  props: Partial<CheckoutSummaryProps>;
  lineItems?: LineItem[];
  subtotal?: number;
  shipping?: number;
  tax?: number;
  discount?: number;
  currency?: string;
}

export function CheckoutSummaryRuntime({ 
  props, 
  lineItems = [],
  subtotal = 0,
  shipping = 0,
  tax = 0,
  discount = 0,
  currency = "USD"
}: CheckoutSummaryRuntimeProps) {
  const {
    showLineItems = true,
    showSubtotal = true,
    showShipping = true,
    showTax = true,
    showDiscount = false,
    showTotal = true,
    collapsible = false,
    defaultCollapsed = false,
    appearance = {},
  } = props;

  const [isCollapsed, setIsCollapsed] = useState(defaultCollapsed);

  const {
    variables = {
      colorPrimary: "#3b82f6",
      colorText: "#1f2937",
      borderColor: "#d1d5db",
    },
  } = appearance;

  const total = subtotal + shipping + tax - discount;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
    }).format(amount / 100); // Assuming amounts are in cents
  };

  return (
    <div className="w-full rounded-lg border border-green-500 bg-white p-6">
      <div className="mb-2 flex items-center gap-2 text-xs text-green-600 bg-green-50 px-2 py-1 rounded">
        <span className="font-semibold">✓ LIVE RUNTIME</span>
        <span>Real-time calculations</span>
      </div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold" style={{ color: variables.colorText }}>
          Order Summary
        </h3>
        {collapsible && (
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="text-slate-500 hover:text-slate-700"
          >
            {isCollapsed ? <ChevronDown className="h-5 w-5" /> : <ChevronUp className="h-5 w-5" />}
          </button>
        )}
      </div>

      {!isCollapsed && (
        <div className="space-y-4">
          {showLineItems && lineItems.length > 0 && (
            <div className="space-y-3 pb-4 border-b" style={{ borderColor: variables.borderColor }}>
              {lineItems.map((item) => (
                <div key={item.id} className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="font-medium text-sm" style={{ color: variables.colorText }}>
                      {item.name}
                    </div>
                    <div className="text-xs text-slate-500 mt-0.5">Quantity: {item.quantity}</div>
                  </div>
                  <div className="font-semibold" style={{ color: variables.colorText }}>
                    {formatCurrency(item.amount)}
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="space-y-2">
            {showSubtotal && (
              <div className="flex justify-between text-sm">
                <span className="text-slate-600">Subtotal</span>
                <span className="font-medium" style={{ color: variables.colorText }}>
                  {formatCurrency(subtotal)}
                </span>
              </div>
            )}

            {showShipping && shipping > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-slate-600">Shipping</span>
                <span className="font-medium" style={{ color: variables.colorText }}>
                  {formatCurrency(shipping)}
                </span>
              </div>
            )}

            {showTax && tax > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-slate-600">Tax</span>
                <span className="font-medium" style={{ color: variables.colorText }}>
                  {formatCurrency(tax)}
                </span>
              </div>
            )}

            {showDiscount && discount > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-slate-600">Discount</span>
                <span className="font-medium text-green-600">-{formatCurrency(discount)}</span>
              </div>
            )}
          </div>

          {showTotal && (
            <div
              className="flex justify-between pt-4 border-t"
              style={{ borderColor: variables.borderColor }}
            >
              <span className="text-lg font-semibold" style={{ color: variables.colorText }}>
                Total
              </span>
              <span className="text-xl font-bold" style={{ color: variables.colorPrimary }}>
                {formatCurrency(total)}
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

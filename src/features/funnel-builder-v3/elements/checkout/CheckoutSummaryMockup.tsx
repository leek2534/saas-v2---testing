import React from "react";
import { CheckoutSummaryProps } from "../../types/checkout-elements";
import { ChevronDown, ChevronUp } from "lucide-react";

interface CheckoutSummaryMockupProps {
  props: Partial<CheckoutSummaryProps>;
}

export function CheckoutSummaryMockup({ props }: CheckoutSummaryMockupProps) {
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

  const [isCollapsed, setIsCollapsed] = React.useState(defaultCollapsed);

  const {
    variables = {
      colorPrimary: "#3b82f6",
      colorText: "#1f2937",
      borderColor: "#d1d5db",
    },
  } = appearance;

  return (
    <div className="w-full rounded-lg border border-slate-200 bg-white p-6">
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
          {showLineItems && (
            <div className="space-y-3 pb-4 border-b" style={{ borderColor: variables.borderColor }}>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="font-medium text-sm" style={{ color: variables.colorText }}>
                    Premium Product
                  </div>
                  <div className="text-xs text-slate-500 mt-0.5">Quantity: 1</div>
                </div>
                <div className="font-semibold" style={{ color: variables.colorText }}>
                  $99.00
                </div>
              </div>
            </div>
          )}

          <div className="space-y-2">
            {showSubtotal && (
              <div className="flex justify-between text-sm">
                <span className="text-slate-600">Subtotal</span>
                <span className="font-medium" style={{ color: variables.colorText }}>
                  $99.00
                </span>
              </div>
            )}

            {showShipping && (
              <div className="flex justify-between text-sm">
                <span className="text-slate-600">Shipping</span>
                <span className="font-medium" style={{ color: variables.colorText }}>
                  $10.00
                </span>
              </div>
            )}

            {showTax && (
              <div className="flex justify-between text-sm">
                <span className="text-slate-600">Tax</span>
                <span className="font-medium" style={{ color: variables.colorText }}>
                  $9.90
                </span>
              </div>
            )}

            {showDiscount && (
              <div className="flex justify-between text-sm">
                <span className="text-slate-600">Discount</span>
                <span className="font-medium text-green-600">-$10.00</span>
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
                $118.90
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

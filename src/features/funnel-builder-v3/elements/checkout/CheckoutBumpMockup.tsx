import React from "react";
import { CheckoutBumpProps } from "../../types/checkout-elements";
import { Gift, Package } from "lucide-react";

interface CheckoutBumpMockupProps {
  props: Partial<CheckoutBumpProps>;
}

export function CheckoutBumpMockup({ props }: CheckoutBumpMockupProps) {
  const {
    headline = "Add this to your order!",
    description = "Limited time special offer - save 50%",
    defaultChecked = false,
    style = "card",
    appearance = {},
  } = props;

  const {
    variables = {
      colorPrimary: "#3b82f6",
      colorBackground: "#ffffff",
      colorText: "#1f2937",
      borderRadius: "8px",
      borderColor: "#d1d5db",
    },
  } = appearance;

  const [isChecked, setIsChecked] = React.useState(defaultChecked);

  const renderCheckbox = () => (
    <div
      className="flex items-start gap-4 rounded-lg border-2 p-4 cursor-pointer transition-all"
      style={{
        borderColor: isChecked ? variables.colorPrimary : variables.borderColor,
        backgroundColor: isChecked ? `${variables.colorPrimary}10` : variables.colorBackground,
      }}
      onClick={() => setIsChecked(!isChecked)}
    >
      <div className="flex-shrink-0 mt-1">
        <div
          className="h-5 w-5 rounded border-2 flex items-center justify-center"
          style={{
            borderColor: isChecked ? variables.colorPrimary : variables.borderColor,
            backgroundColor: isChecked ? variables.colorPrimary : "transparent",
          }}
        >
          {isChecked && <span className="text-white text-xs">✓</span>}
        </div>
      </div>
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-1">
          <Gift className="h-5 w-5" style={{ color: variables.colorPrimary }} />
          <h4 className="font-semibold" style={{ color: variables.colorText }}>
            {headline}
          </h4>
        </div>
        <p className="text-sm text-slate-600">{description}</p>
        <div className="mt-2 flex items-center gap-2">
          <span className="text-lg font-bold" style={{ color: variables.colorPrimary }}>
            $29.00
          </span>
          <span className="text-sm text-slate-500 line-through">$58.00</span>
        </div>
      </div>
      <div className="flex-shrink-0 flex h-16 w-16 items-center justify-center rounded-lg bg-slate-100">
        <Package className="h-8 w-8 text-slate-400" />
      </div>
    </div>
  );

  const renderToggle = () => (
    <div
      className="flex items-center justify-between rounded-lg border p-4"
      style={{
        borderColor: isChecked ? variables.colorPrimary : variables.borderColor,
        backgroundColor: isChecked ? `${variables.colorPrimary}10` : variables.colorBackground,
      }}
    >
      <div className="flex items-start gap-3">
        <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg bg-slate-100">
          <Package className="h-6 w-6 text-slate-400" />
        </div>
        <div>
          <h4 className="font-semibold" style={{ color: variables.colorText }}>
            {headline}
          </h4>
          <p className="text-sm text-slate-600 mt-1">{description}</p>
          <div className="mt-2 flex items-center gap-2">
            <span className="font-bold" style={{ color: variables.colorPrimary }}>
              $29.00
            </span>
            <span className="text-sm text-slate-500 line-through">$58.00</span>
          </div>
        </div>
      </div>
      <button
        onClick={() => setIsChecked(!isChecked)}
        className="relative inline-flex h-6 w-11 flex-shrink-0 rounded-full transition-colors"
        style={{
          backgroundColor: isChecked ? variables.colorPrimary : variables.borderColor,
        }}
      >
        <span
          className="inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform m-0.5"
          style={{
            transform: isChecked ? "translateX(20px)" : "translateX(0)",
          }}
        />
      </button>
    </div>
  );

  const renderButton = () => (
    <button
      onClick={() => setIsChecked(!isChecked)}
      className="w-full rounded-lg border-2 p-4 text-left transition-all"
      style={{
        borderColor: isChecked ? variables.colorPrimary : variables.borderColor,
        backgroundColor: isChecked ? variables.colorPrimary : variables.colorBackground,
        color: isChecked ? "#ffffff" : variables.colorText,
      }}
    >
      <div className="flex items-start gap-3">
        <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg bg-slate-100">
          <Package className="h-6 w-6 text-slate-400" />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <Gift className="h-5 w-5" />
            <h4 className="font-semibold">{headline}</h4>
          </div>
          <p className="text-sm opacity-90">{description}</p>
          <div className="mt-2 flex items-center gap-2">
            <span className="text-lg font-bold">$29.00</span>
            <span className="text-sm opacity-75 line-through">$58.00</span>
          </div>
        </div>
        <div className="flex items-center">
          <span className="text-sm font-medium">
            {isChecked ? "Added ✓" : "Add to Order"}
          </span>
        </div>
      </div>
    </button>
  );

  const renderCard = () => (
    <div
      className="rounded-lg border-2 overflow-hidden cursor-pointer transition-all"
      style={{
        borderColor: isChecked ? variables.colorPrimary : variables.borderColor,
      }}
      onClick={() => setIsChecked(!isChecked)}
    >
      <div
        className="p-4"
        style={{
          backgroundColor: isChecked ? `${variables.colorPrimary}10` : variables.colorBackground,
        }}
      >
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2">
            <Gift className="h-5 w-5" style={{ color: variables.colorPrimary }} />
            <span className="text-xs font-semibold uppercase tracking-wide" style={{ color: variables.colorPrimary }}>
              Special Offer
            </span>
          </div>
          <div
            className="h-6 w-6 rounded-full border-2 flex items-center justify-center"
            style={{
              borderColor: isChecked ? variables.colorPrimary : variables.borderColor,
              backgroundColor: isChecked ? variables.colorPrimary : "transparent",
            }}
          >
            {isChecked && <span className="text-white text-xs">✓</span>}
          </div>
        </div>
        <div className="flex gap-4">
          <div className="flex h-20 w-20 flex-shrink-0 items-center justify-center rounded-lg bg-slate-100">
            <Package className="h-10 w-10 text-slate-400" />
          </div>
          <div className="flex-1">
            <h4 className="font-bold text-lg mb-1" style={{ color: variables.colorText }}>
              {headline}
            </h4>
            <p className="text-sm text-slate-600 mb-2">{description}</p>
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold" style={{ color: variables.colorPrimary }}>
                $29.00
              </span>
              <span className="text-sm text-slate-500 line-through">$58.00</span>
              <span className="ml-auto text-xs font-semibold text-green-600 bg-green-100 px-2 py-1 rounded">
                Save 50%
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="w-full">
      {style === "checkbox" && renderCheckbox()}
      {style === "toggle" && renderToggle()}
      {style === "button" && renderButton()}
      {style === "card" && renderCard()}
    </div>
  );
}

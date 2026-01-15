import React from "react";
import { CheckoutPaymentProps } from "../../types/checkout-elements";
import { CreditCard, Smartphone, Wallet } from "lucide-react";

interface CheckoutPaymentMockupProps {
  props: Partial<CheckoutPaymentProps>;
}

export function CheckoutPaymentMockup({ props }: CheckoutPaymentMockupProps) {
  const {
    paymentMethods = ["card", "apple_pay", "google_pay"],
    layout = "tabs",
    savePaymentMethod = false,
    showSaveOption = true,
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

  const paymentMethodIcons: Record<string, React.ReactNode> = {
    card: <CreditCard className="h-5 w-5" />,
    apple_pay: <Smartphone className="h-5 w-5" />,
    google_pay: <Smartphone className="h-5 w-5" />,
    link: <Wallet className="h-5 w-5" />,
    affirm: <Wallet className="h-5 w-5" />,
    afterpay: <Wallet className="h-5 w-5" />,
  };

  const paymentMethodLabels: Record<string, string> = {
    card: "Card",
    apple_pay: "Apple Pay",
    google_pay: "Google Pay",
    link: "Link",
    affirm: "Affirm",
    afterpay: "Afterpay",
  };

  const renderTabsLayout = () => (
    <div className="space-y-4">
      <div className="flex gap-2 border-b" style={{ borderColor: variables.borderColor }}>
        {paymentMethods.map((method, idx) => (
          <button
            key={method}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium transition-colors"
            style={{
              color: idx === 0 ? variables.colorPrimary : variables.colorText,
              borderBottom: idx === 0 ? `2px solid ${variables.colorPrimary}` : "2px solid transparent",
            }}
          >
            {paymentMethodIcons[method]}
            {paymentMethodLabels[method]}
          </button>
        ))}
      </div>
      <div className="space-y-3">
        <div className="space-y-2">
          <label className="text-sm font-medium" style={{ color: variables.colorText }}>
            Card number
          </label>
          <div
            className="px-3 py-2 text-sm"
            style={{
              backgroundColor: variables.colorBackground,
              border: `1px solid ${variables.borderColor}`,
              borderRadius: variables.borderRadius,
            }}
          >
            <span className="text-slate-400">1234 5678 9012 3456</span>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-2">
            <label className="text-sm font-medium" style={{ color: variables.colorText }}>
              Expiry
            </label>
            <div
              className="px-3 py-2 text-sm"
              style={{
                backgroundColor: variables.colorBackground,
                border: `1px solid ${variables.borderColor}`,
                borderRadius: variables.borderRadius,
              }}
            >
              <span className="text-slate-400">MM / YY</span>
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium" style={{ color: variables.colorText }}>
              CVC
            </label>
            <div
              className="px-3 py-2 text-sm"
              style={{
                backgroundColor: variables.colorBackground,
                border: `1px solid ${variables.borderColor}`,
                borderRadius: variables.borderRadius,
              }}
            >
              <span className="text-slate-400">123</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderAccordionLayout = () => (
    <div className="space-y-2">
      {paymentMethods.map((method, idx) => (
        <div
          key={method}
          className="rounded-lg border"
          style={{
            borderColor: idx === 0 ? variables.colorPrimary : variables.borderColor,
            backgroundColor: idx === 0 ? `${variables.colorPrimary}10` : variables.colorBackground,
          }}
        >
          <button className="flex w-full items-center justify-between p-4">
            <div className="flex items-center gap-3">
              <div style={{ color: idx === 0 ? variables.colorPrimary : variables.colorText }}>
                {paymentMethodIcons[method]}
              </div>
              <span
                className="font-medium"
                style={{ color: idx === 0 ? variables.colorPrimary : variables.colorText }}
              >
                {paymentMethodLabels[method]}
              </span>
            </div>
            <div
              className="h-5 w-5 rounded-full border-2"
              style={{
                borderColor: idx === 0 ? variables.colorPrimary : variables.borderColor,
                backgroundColor: idx === 0 ? variables.colorPrimary : "transparent",
              }}
            />
          </button>
          {idx === 0 && (
            <div className="px-4 pb-4 space-y-3">
              <div className="space-y-2">
                <label className="text-sm font-medium" style={{ color: variables.colorText }}>
                  Card number
                </label>
                <div
                  className="px-3 py-2 text-sm"
                  style={{
                    backgroundColor: variables.colorBackground,
                    border: `1px solid ${variables.borderColor}`,
                    borderRadius: variables.borderRadius,
                  }}
                >
                  <span className="text-slate-400">1234 5678 9012 3456</span>
                </div>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );

  const renderRadioLayout = () => (
    <div className="space-y-3">
      {paymentMethods.map((method, idx) => (
        <label
          key={method}
          className="flex items-center gap-3 rounded-lg border p-4 cursor-pointer transition-colors hover:bg-slate-50"
          style={{
            borderColor: idx === 0 ? variables.colorPrimary : variables.borderColor,
          }}
        >
          <div
            className="h-5 w-5 rounded-full border-2 flex items-center justify-center"
            style={{
              borderColor: idx === 0 ? variables.colorPrimary : variables.borderColor,
            }}
          >
            {idx === 0 && (
              <div
                className="h-3 w-3 rounded-full"
                style={{ backgroundColor: variables.colorPrimary }}
              />
            )}
          </div>
          <div style={{ color: variables.colorText }}>{paymentMethodIcons[method]}</div>
          <span className="font-medium" style={{ color: variables.colorText }}>
            {paymentMethodLabels[method]}
          </span>
        </label>
      ))}
      <div className="mt-4 space-y-3">
        <div className="space-y-2">
          <label className="text-sm font-medium" style={{ color: variables.colorText }}>
            Card number
          </label>
          <div
            className="px-3 py-2 text-sm"
            style={{
              backgroundColor: variables.colorBackground,
              border: `1px solid ${variables.borderColor}`,
              borderRadius: variables.borderRadius,
            }}
          >
            <span className="text-slate-400">1234 5678 9012 3456</span>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="w-full rounded-lg border border-slate-200 bg-white p-6">
      <div className="mb-4">
        <h3 className="text-lg font-semibold" style={{ color: variables.colorText }}>
          Payment Method
        </h3>
        <p className="text-sm text-slate-500 mt-1">Select how you'd like to pay</p>
      </div>

      {layout === "tabs" && renderTabsLayout()}
      {layout === "accordion" && renderAccordionLayout()}
      {layout === "radio" && renderRadioLayout()}

      {showSaveOption && savePaymentMethod && (
        <div className="mt-4 flex items-center gap-2 pt-4 border-t" style={{ borderColor: variables.borderColor }}>
          <input
            type="checkbox"
            className="h-4 w-4 rounded"
            style={{ accentColor: variables.colorPrimary }}
          />
          <label className="text-sm" style={{ color: variables.colorText }}>
            Save payment method for future purchases
          </label>
        </div>
      )}
    </div>
  );
}

import React from "react";
import { CheckoutContactProps } from "../../types/checkout-elements";
import { cn } from "@/lib/utils";

interface CheckoutContactMockupProps {
  props: Partial<CheckoutContactProps>;
}

export function CheckoutContactMockup({ props }: CheckoutContactMockupProps) {
  const {
    fields = {
      email: { required: true, visible: true, label: "Email", placeholder: "you@example.com" },
      firstName: { required: true, visible: true, label: "First Name", placeholder: "John" },
      lastName: { required: true, visible: true, label: "Last Name", placeholder: "Doe" },
      phone: { required: false, visible: true, label: "Phone", placeholder: "(555) 123-4567" },
      company: { required: false, visible: false, label: "Company", placeholder: "Acme Inc." },
    },
    layout = "two-column",
    showLabels = true,
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

  const visibleFields = Object.entries(fields).filter(([_, config]) => config.visible);

  const renderField = (fieldName: string, config: any) => (
    <div key={fieldName} className={cn("space-y-1.5", layout === "single-column" ? "w-full" : "")}>
      {showLabels && (
        <label className="text-sm font-medium flex items-center gap-1" style={{ color: variables.colorText }}>
          {config.label || fieldName}
          {config.required && <span style={{ color: "#ef4444" }}>*</span>}
        </label>
      )}
      <input
        type={fieldName === "email" ? "email" : fieldName === "phone" ? "tel" : "text"}
        placeholder={config.placeholder || ""}
        disabled
        className="w-full px-3 py-2 text-sm transition-colors"
        style={{
          backgroundColor: variables.colorBackground,
          color: variables.colorText,
          border: `1px solid ${variables.borderColor}`,
          borderRadius: variables.borderRadius,
        }}
      />
    </div>
  );

  return (
    <div className="w-full rounded-lg border border-slate-200 bg-white p-6">
      <div className="mb-4">
        <h3 className="text-lg font-semibold" style={{ color: variables.colorText }}>
          Contact Information
        </h3>
        <p className="text-sm text-slate-500 mt-1">Please provide your contact details</p>
      </div>
      
      <div
        className={cn(
          "gap-4",
          layout === "two-column" ? "grid grid-cols-2" : "flex flex-col"
        )}
      >
        {visibleFields.map(([fieldName, config]) => renderField(fieldName, config))}
      </div>
    </div>
  );
}

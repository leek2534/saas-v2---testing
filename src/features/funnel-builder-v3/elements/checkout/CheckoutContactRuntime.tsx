import React, { useState } from "react";
import { CheckoutContactProps } from "../../types/checkout-elements";
import { cn } from "@/lib/utils";

interface CheckoutContactRuntimeProps {
  props: Partial<CheckoutContactProps>;
  onDataChange?: (data: Record<string, string>) => void;
  initialData?: Record<string, string>;
}

export function CheckoutContactRuntime({ props, onDataChange, initialData = {} }: CheckoutContactRuntimeProps) {
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

  const [formData, setFormData] = useState<Record<string, string>>(initialData);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const visibleFields = Object.entries(fields).filter(([_, config]) => config.visible);

  const handleChange = (fieldName: string, value: string) => {
    const newData = { ...formData, [fieldName]: value };
    setFormData(newData);
    
    // Clear error when user starts typing
    if (errors[fieldName]) {
      setErrors({ ...errors, [fieldName]: "" });
    }
    
    if (onDataChange) {
      onDataChange(newData);
    }
  };

  const validateField = (fieldName: string, config: any) => {
    const value = formData[fieldName] || "";
    
    if (config.required && !value.trim()) {
      return `${config.label || fieldName} is required`;
    }
    
    if (fieldName === "email" && value) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        return "Please enter a valid email address";
      }
    }
    
    return "";
  };

  const renderField = (fieldName: string, config: any) => {
    const error = errors[fieldName];
    
    return (
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
          value={formData[fieldName] || ""}
          onChange={(e) => handleChange(fieldName, e.target.value)}
          onBlur={() => {
            const errorMsg = validateField(fieldName, config);
            if (errorMsg) {
              setErrors({ ...errors, [fieldName]: errorMsg });
            }
          }}
          className={cn(
            "w-full px-3 py-2 text-sm transition-colors focus:outline-none focus:ring-2",
            error && "border-red-500"
          )}
          style={{
            backgroundColor: variables.colorBackground,
            color: variables.colorText,
            border: `1px solid ${error ? "#ef4444" : variables.borderColor}`,
            borderRadius: variables.borderRadius,
          }}
          required={config.required}
        />
        {error && (
          <p className="text-xs text-red-600">{error}</p>
        )}
      </div>
    );
  };

  return (
    <div className="w-full rounded-lg border border-green-500 bg-white p-6">
      <div className="mb-2 flex items-center gap-2 text-xs text-green-600 bg-green-50 px-2 py-1 rounded">
        <span className="font-semibold">✓ LIVE RUNTIME</span>
        <span>This is the actual functional form</span>
      </div>
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

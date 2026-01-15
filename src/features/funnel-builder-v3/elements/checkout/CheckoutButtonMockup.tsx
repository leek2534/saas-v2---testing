import React from "react";
import { CheckoutButtonProps } from "../../types/checkout-elements";
import { ArrowRight, ArrowLeft, Loader2 } from "lucide-react";

interface CheckoutButtonMockupProps {
  props: Partial<CheckoutButtonProps>;
}

export function CheckoutButtonMockup({ props }: CheckoutButtonMockupProps) {
  const {
    action = "next-step",
    label = "Continue",
    loadingLabel = "Processing...",
    showLoadingState = true,
    disabled = false,
    fullWidth = true,
    size = "md",
    appearance = {
      backgroundColor: "#3b82f6",
      textColor: "#ffffff",
      borderRadius: "8px",
      fontSize: "16px",
      fontWeight: "600",
      padding: "12px 24px",
      hoverBackgroundColor: "#2563eb",
    },
  } = props;

  const [isLoading, setIsLoading] = React.useState(false);

  const sizeClasses = {
    sm: "text-sm py-2 px-4",
    md: "text-base py-3 px-6",
    lg: "text-lg py-4 px-8",
  };

  const getIcon = () => {
    if (isLoading && showLoadingState) {
      return <Loader2 className="h-5 w-5 animate-spin" />;
    }
    if (action === "next-step") {
      return <ArrowRight className="h-5 w-5" />;
    }
    if (action === "previous-step") {
      return <ArrowLeft className="h-5 w-5" />;
    }
    return null;
  };

  const getLabel = () => {
    if (isLoading && showLoadingState) {
      return loadingLabel;
    }
    return label;
  };

  return (
    <button
      onClick={() => {
        if (!disabled) {
          setIsLoading(true);
          setTimeout(() => setIsLoading(false), 2000);
        }
      }}
      disabled={disabled || isLoading}
      className={`flex items-center justify-center gap-2 font-semibold transition-all ${
        fullWidth ? "w-full" : ""
      } ${sizeClasses[size]} ${disabled || isLoading ? "opacity-50 cursor-not-allowed" : "hover:shadow-lg"}`}
      style={{
        backgroundColor: appearance.backgroundColor,
        color: appearance.textColor,
        borderRadius: appearance.borderRadius,
        fontSize: appearance.fontSize,
        fontWeight: appearance.fontWeight,
        padding: appearance.padding,
      }}
    >
      {action === "previous-step" && getIcon()}
      {getLabel()}
      {action !== "previous-step" && getIcon()}
    </button>
  );
}

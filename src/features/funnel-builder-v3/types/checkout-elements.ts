import { Id } from "@/convex/_generated/dataModel";

/**
 * Checkout Steps Indicator Configuration
 */
export interface CheckoutStepsProps {
  totalSteps: number;
  currentStep: number;
  stepLabels: string[];
  style: "dots" | "numbers" | "progress-bar" | "text";
  showLabels: boolean;
  completedColor: string;
  activeColor: string;
  inactiveColor: string;
}

/**
 * Contact Form Configuration
 */
export interface CheckoutContactProps {
  fields: {
    email: { required: boolean; visible: boolean; label?: string; placeholder?: string };
    firstName: { required: boolean; visible: boolean; label?: string; placeholder?: string };
    lastName: { required: boolean; visible: boolean; label?: string; placeholder?: string };
    phone: { required: boolean; visible: boolean; label?: string; placeholder?: string };
    company: { required: boolean; visible: boolean; label?: string; placeholder?: string };
  };
  layout: "single-column" | "two-column";
  showLabels: boolean;
  appearance: CheckoutAppearance;
}

/**
 * Product Select Configuration
 */
export interface CheckoutProductsProps {
  priceIds: Id<"catalogPrices">[];
  quantities: number[];
  showImages: boolean;
  showDescriptions: boolean;
  allowQuantityChange: boolean;
  layout: "list" | "grid" | "compact";
  showPricing: boolean;
}

/**
 * Shipping Options Configuration
 */
export interface CheckoutShippingProps {
  collectAddress: boolean;
  shippingRates: Array<{
    id: string;
    label: string;
    price: number;
    estimatedDays: string;
    description?: string;
  }>;
  defaultSelection?: string;
  showEstimatedDelivery: boolean;
  addressFields: {
    address1: { required: boolean; visible: boolean };
    address2: { required: boolean; visible: boolean };
    city: { required: boolean; visible: boolean };
    state: { required: boolean; visible: boolean };
    zip: { required: boolean; visible: boolean };
    country: { required: boolean; visible: boolean };
  };
}

/**
 * Order Summary Configuration
 */
export interface CheckoutSummaryProps {
  showLineItems: boolean;
  showSubtotal: boolean;
  showShipping: boolean;
  showTax: boolean;
  showDiscount: boolean;
  showTotal: boolean;
  collapsible: boolean;
  defaultCollapsed: boolean;
  position: "sticky" | "inline";
  appearance: CheckoutAppearance;
}

/**
 * Payment Method Configuration
 */
export interface CheckoutPaymentProps {
  paymentMethods: Array<"card" | "apple_pay" | "google_pay" | "link" | "affirm" | "afterpay">;
  layout: "tabs" | "accordion" | "radio";
  savePaymentMethod: boolean;
  showSaveOption: boolean;
  appearance: CheckoutAppearance;
  billingAddressSameAsShipping: boolean;
  collectBillingAddress: boolean;
}

/**
 * Order Bump Configuration
 */
export interface CheckoutBumpProps {
  priceId: Id<"catalogPrices"> | null;
  headline: string;
  description: string;
  imageId?: Id<"_storage">;
  defaultChecked: boolean;
  style: "checkbox" | "toggle" | "button" | "card";
  position: "above-payment" | "below-payment" | "sidebar";
  appearance: CheckoutAppearance;
}

/**
 * Checkout Button Configuration
 */
export interface CheckoutButtonProps {
  action: "next-step" | "previous-step" | "submit-payment" | "custom";
  label: string;
  loadingLabel?: string;
  showLoadingState: boolean;
  disabled: boolean;
  fullWidth: boolean;
  size: "sm" | "md" | "lg";
  appearance: {
    backgroundColor: string;
    textColor: string;
    borderRadius: string;
    fontSize: string;
    fontWeight: string;
    padding: string;
    hoverBackgroundColor?: string;
  };
}

/**
 * Loading Overlay Configuration
 */
export interface CheckoutLoadingProps {
  message: string;
  spinner: "dots" | "circle" | "bars" | "pulse";
  overlay: boolean;
  overlayColor: string;
  overlayOpacity: number;
}

/**
 * Checkout Appearance (Stripe-compatible)
 */
export interface CheckoutAppearance {
  theme?: "stripe" | "night" | "flat" | "none";
  variables?: {
    colorPrimary?: string;
    colorBackground?: string;
    colorText?: string;
    colorDanger?: string;
    colorSuccess?: string;
    colorWarning?: string;
    fontFamily?: string;
    fontSizeBase?: string;
    fontSizeSm?: string;
    fontSizeLg?: string;
    fontWeightNormal?: string;
    fontWeightMedium?: string;
    fontWeightBold?: string;
    spacingUnit?: string;
    borderRadius?: string;
    borderWidth?: string;
    borderColor?: string;
    focusBoxShadow?: string;
    focusOutline?: string;
  };
  rules?: Record<string, React.CSSProperties>;
}

/**
 * Multi-Step Checkout Configuration
 */
export interface CheckoutStepConfiguration {
  mode: "1-step" | "2-step" | "3-step";
  steps: Array<{
    id: string;
    label: string;
    elements: string[]; // Element IDs that belong to this step
  }>;
  validation: {
    validateOnStepChange: boolean;
    showErrorSummary: boolean;
  };
  navigation: {
    showBackButton: boolean;
    allowSkipSteps: boolean;
    saveProgress: boolean;
  };
}

/**
 * Checkout Template Definitions
 */
export interface CheckoutTemplate {
  id: string;
  name: string;
  description: string;
  thumbnail?: string;
  mode: "1-step" | "2-step" | "3-step";
  appearance: CheckoutAppearance;
  elements: Array<{
    kind: string;
    props: any;
  }>;
}

/**
 * Pre-built Templates
 */
export const CHECKOUT_TEMPLATES: CheckoutTemplate[] = [
  {
    id: "modern-minimal",
    name: "Modern Minimal",
    description: "Clean, simple checkout with subtle styling",
    mode: "2-step",
    appearance: {
      theme: "stripe",
      variables: {
        colorPrimary: "#0570de",
        colorBackground: "#ffffff",
        colorText: "#30313d",
        fontFamily: "Inter, system-ui, sans-serif",
        borderRadius: "8px",
        spacingUnit: "4px",
      },
    },
    elements: [],
  },
  {
    id: "dark-mode",
    name: "Dark Mode",
    description: "Sleek dark theme with vibrant accents",
    mode: "2-step",
    appearance: {
      theme: "night",
      variables: {
        colorPrimary: "#8b5cf6",
        colorBackground: "#1a1a1a",
        colorText: "#ffffff",
        fontFamily: "Inter, system-ui, sans-serif",
        borderRadius: "12px",
        spacingUnit: "4px",
      },
    },
    elements: [],
  },
  {
    id: "bold-colorful",
    name: "Bold & Colorful",
    description: "Vibrant colors with strong visual hierarchy",
    mode: "1-step",
    appearance: {
      theme: "flat",
      variables: {
        colorPrimary: "#f59e0b",
        colorBackground: "#ffffff",
        colorText: "#1f2937",
        fontFamily: "Poppins, system-ui, sans-serif",
        borderRadius: "16px",
        spacingUnit: "6px",
      },
    },
    elements: [],
  },
  {
    id: "professional",
    name: "Professional",
    description: "Conservative, corporate-friendly design",
    mode: "3-step",
    appearance: {
      theme: "stripe",
      variables: {
        colorPrimary: "#1e40af",
        colorBackground: "#f9fafb",
        colorText: "#111827",
        fontFamily: "system-ui, sans-serif",
        borderRadius: "4px",
        spacingUnit: "4px",
      },
    },
    elements: [],
  },
  {
    id: "neumorphic",
    name: "Neumorphic",
    description: "Soft shadows and modern depth",
    mode: "2-step",
    appearance: {
      theme: "flat",
      variables: {
        colorPrimary: "#6366f1",
        colorBackground: "#e5e7eb",
        colorText: "#1f2937",
        fontFamily: "Inter, system-ui, sans-serif",
        borderRadius: "20px",
        spacingUnit: "6px",
      },
    },
    elements: [],
  },
];

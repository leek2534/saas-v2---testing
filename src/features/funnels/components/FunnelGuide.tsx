"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { X, ChevronRight, ChevronLeft, Check, Rocket, Package, CreditCard, Sparkles, FileText } from "lucide-react";

interface GuideStep {
  title: string;
  description: string;
  icon: React.ReactNode;
  action?: {
    label: string;
    href?: string;
  };
}

const GUIDE_STEPS: GuideStep[] = [
  {
    title: "Welcome to Funnel Builder!",
    description: "Let's walk through how to create a complete sales funnel with checkout and one-click upsells. This guide will show you the exact steps to get your first funnel running.",
    icon: <Rocket className="h-8 w-8 text-blue-600" />,
  },
  {
    title: "Step 1: Create Products First",
    description: "Before building funnels, you need products to sell. Go to Catalog → Products and create at least one product with a price. This is what customers will purchase.",
    icon: <Package className="h-8 w-8 text-green-600" />,
    action: {
      label: "Go to Catalog",
      href: "/catalog/products",
    },
  },
  {
    title: "Step 2: Create a Funnel",
    description: "Click 'Create Funnel' to start. Give it a name and handle (URL). The handle will be used in your public funnel URL like /f/your-handle",
    icon: <FileText className="h-8 w-8 text-purple-600" />,
  },
  {
    title: "Step 3: Add Funnel Steps",
    description: "Add steps to your funnel in this order:\n\n1. Checkout Step - Where customers pay\n2. Offer Step (optional) - One-click upsell\n3. Thank You Step - Confirmation page\n\nEach step gets its own page that you can customize.",
    icon: <ChevronRight className="h-8 w-8 text-orange-600" />,
  },
  {
    title: "Step 4: Configure Checkout Step",
    description: "Click 'Settings' on your Checkout step:\n\n1. Select which products to sell\n2. Enable 'One-Click Offers' if you want upsells\n3. Choose the next step (usually an Offer or Thank You)\n4. Click 'Save Settings'",
    icon: <CreditCard className="h-8 w-8 text-blue-600" />,
  },
  {
    title: "Step 5: Design the Checkout Page",
    description: "Click 'Edit Page' on your Checkout step:\n\n1. Add sections, rows, and columns for layout\n2. Add the 'Checkout' element from the Elements panel\n3. Add headlines, images, trust badges around it\n4. The Checkout element shows as a placeholder in the builder\n5. At runtime, it becomes a real Stripe payment form",
    icon: <CreditCard className="h-8 w-8 text-green-600" />,
  },
  {
    title: "Step 6: Configure Offer Step (Optional)",
    description: "Click 'Settings' on your Offer step:\n\n1. Select the product for the upsell\n2. Add headline and subheadline copy\n3. Set 'On Accept' route (usually Thank You)\n4. Set 'On Decline' route (usually Thank You)\n5. Click 'Save Settings'",
    icon: <Sparkles className="h-8 w-8 text-purple-600" />,
  },
  {
    title: "Step 7: Design the Offer Page",
    description: "Click 'Edit Page' on your Offer step:\n\n1. Add the 'Offer' element from the Elements panel\n2. Add compelling copy and images\n3. The Offer element shows as a placeholder in the builder\n4. At runtime, it becomes a one-click purchase button\n5. It uses the payment method saved from checkout",
    icon: <Sparkles className="h-8 w-8 text-orange-600" />,
  },
  {
    title: "How It Works at Runtime",
    description: "When a customer visits /f/your-handle:\n\n1. They see your Checkout page with real Stripe form\n2. They enter payment info and complete purchase\n3. Payment method is saved for one-click offers\n4. They're redirected to your Offer page\n5. They can accept (one-click charge) or decline\n6. Finally they see your Thank You page\n\nAll payment processing happens automatically!",
    icon: <Check className="h-8 w-8 text-green-600" />,
  },
  {
    title: "Key Concepts to Remember",
    description: "✅ Config lives on the STEP (not in the page)\n✅ Checkout/Offer elements are just 'mount points'\n✅ Edit step settings to configure products/routing\n✅ Edit page to design the layout\n✅ One-click offers require 'Enable One-Click' in checkout\n✅ Test with Stripe test card: 4242 4242 4242 4242",
    icon: <Check className="h-8 w-8 text-blue-600" />,
  },
];

export function FunnelGuide() {
  const [isOpen, setIsOpen] = useState(true);
  const [currentStep, setCurrentStep] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);

  if (!isOpen) {
    return (
      <Button
        onClick={() => setIsOpen(true)}
        variant="outline"
        size="sm"
        className="fixed bottom-4 right-4 z-50 shadow-lg"
      >
        <Rocket className="h-4 w-4 mr-2" />
        Show Guide
      </Button>
    );
  }

  const step = GUIDE_STEPS[currentStep];
  const isLastStep = currentStep === GUIDE_STEPS.length - 1;

  const handleNext = () => {
    if (isLastStep) {
      setIsCompleted(true);
    } else {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    setCurrentStep(Math.max(0, currentStep - 1));
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  if (isCompleted) {
    return (
      <Card className="fixed bottom-4 right-4 w-96 z-50 shadow-2xl border-2 border-green-500">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Check className="h-6 w-6 text-green-600" />
              <CardTitle className="text-lg">You're All Set! 🎉</CardTitle>
            </div>
            <Button variant="ghost" size="sm" onClick={handleClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            You now know how to build complete sales funnels with checkout and upsells!
          </p>
          <div className="flex gap-2">
            <Button onClick={() => { setIsCompleted(false); setCurrentStep(0); }} variant="outline" size="sm" className="flex-1">
              Restart Guide
            </Button>
            <Button onClick={handleClose} size="sm" className="flex-1">
              Got It!
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="fixed bottom-4 right-4 w-96 z-50 shadow-2xl">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {step.icon}
            <CardTitle className="text-lg">{step.title}</CardTitle>
          </div>
          <Button variant="ghost" size="sm" onClick={handleClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex items-center gap-1 mt-2">
          {GUIDE_STEPS.map((_, idx) => (
            <div
              key={idx}
              className={`h-1 flex-1 rounded-full transition-colors ${
                idx <= currentStep ? "bg-primary" : "bg-muted"
              }`}
            />
          ))}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground whitespace-pre-line">
          {step.description}
        </p>

        {step.action && (
          <Button
            variant="outline"
            size="sm"
            className="w-full"
            onClick={() => {
              if (step.action?.href) {
                window.location.href = step.action.href;
              }
            }}
          >
            {step.action.label}
          </Button>
        )}

        <div className="flex items-center justify-between pt-2">
          <div className="text-xs text-muted-foreground">
            Step {currentStep + 1} of {GUIDE_STEPS.length}
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handlePrevious}
              disabled={currentStep === 0}
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Back
            </Button>
            <Button size="sm" onClick={handleNext}>
              {isLastStep ? "Finish" : "Next"}
              {!isLastStep && <ChevronRight className="h-4 w-4 ml-1" />}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

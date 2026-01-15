import React from "react";
import { CheckoutStepsProps } from "../../types/checkout-elements";
import { cn } from "@/lib/utils";

interface CheckoutStepsMockupProps {
  props: Partial<CheckoutStepsProps>;
}

export function CheckoutStepsMockup({ props }: CheckoutStepsMockupProps) {
  const {
    totalSteps = 3,
    currentStep = 1,
    stepLabels = ["Products", "Details", "Payment"],
    style = "numbers",
    showLabels = true,
    completedColor = "#10b981",
    activeColor = "#3b82f6",
    inactiveColor = "#d1d5db",
  } = props;

  const renderDots = () => (
    <div className="flex items-center justify-center gap-2">
      {Array.from({ length: totalSteps }).map((_, idx) => {
        const stepNum = idx + 1;
        const isCompleted = stepNum < currentStep;
        const isActive = stepNum === currentStep;
        
        return (
          <div key={idx} className="flex items-center gap-2">
            <div
              className={cn(
                "h-3 w-3 rounded-full transition-colors",
                isCompleted && "ring-2 ring-offset-2"
              )}
              style={{
                backgroundColor: isCompleted ? completedColor : isActive ? activeColor : inactiveColor,
                ...(isCompleted && { '--tw-ring-color': completedColor } as any),
              }}
            />
            {idx < totalSteps - 1 && (
              <div className="h-0.5 w-8" style={{ backgroundColor: inactiveColor }} />
            )}
          </div>
        );
      })}
    </div>
  );

  const renderNumbers = () => (
    <div className="flex items-center justify-center gap-4">
      {Array.from({ length: totalSteps }).map((_, idx) => {
        const stepNum = idx + 1;
        const isCompleted = stepNum < currentStep;
        const isActive = stepNum === currentStep;
        
        return (
          <div key={idx} className="flex items-center gap-4">
            <div className="flex flex-col items-center gap-2">
              <div
                className={cn(
                  "flex h-10 w-10 items-center justify-center rounded-full text-sm font-semibold transition-colors",
                  isCompleted && "ring-2 ring-offset-2"
                )}
                style={{
                  backgroundColor: isCompleted ? completedColor : isActive ? activeColor : inactiveColor,
                  color: isCompleted || isActive ? "#ffffff" : "#6b7280",
                  ...(isCompleted && { '--tw-ring-color': completedColor } as any),
                }}
              >
                {isCompleted ? "✓" : stepNum}
              </div>
              {showLabels && (
                <span
                  className="text-xs font-medium"
                  style={{ color: isActive ? activeColor : "#6b7280" }}
                >
                  {stepLabels[idx] || `Step ${stepNum}`}
                </span>
              )}
            </div>
            {idx < totalSteps - 1 && (
              <div className="h-0.5 w-12 -mt-5" style={{ backgroundColor: inactiveColor }} />
            )}
          </div>
        );
      })}
    </div>
  );

  const renderProgressBar = () => {
    const progress = ((currentStep - 1) / (totalSteps - 1)) * 100;
    
    return (
      <div className="w-full space-y-2">
        <div className="flex justify-between text-xs font-medium">
          <span style={{ color: activeColor }}>
            Step {currentStep} of {totalSteps}
          </span>
          <span className="text-slate-500">{Math.round(progress)}%</span>
        </div>
        <div className="h-2 w-full rounded-full" style={{ backgroundColor: inactiveColor }}>
          <div
            className="h-full rounded-full transition-all duration-300"
            style={{
              width: `${progress}%`,
              backgroundColor: activeColor,
            }}
          />
        </div>
        {showLabels && (
          <div className="text-center text-sm font-medium" style={{ color: activeColor }}>
            {stepLabels[currentStep - 1] || `Step ${currentStep}`}
          </div>
        )}
      </div>
    );
  };

  const renderText = () => (
    <div className="text-center">
      <div className="text-sm font-medium text-slate-500">
        Step {currentStep} of {totalSteps}
      </div>
      {showLabels && (
        <div className="text-lg font-semibold mt-1" style={{ color: activeColor }}>
          {stepLabels[currentStep - 1] || `Step ${currentStep}`}
        </div>
      )}
    </div>
  );

  return (
    <div className="w-full rounded-lg border border-slate-200 bg-white p-6">
      {style === "dots" && renderDots()}
      {style === "numbers" && renderNumbers()}
      {style === "progress-bar" && renderProgressBar()}
      {style === "text" && renderText()}
    </div>
  );
}

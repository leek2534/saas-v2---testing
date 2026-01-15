"use client";

/**
 * Step indicator for multi-page checkout flow
 * Shows progress through checkout steps
 */

interface CheckoutStepIndicatorProps {
  currentStep?: number;
  totalSteps?: number;
  steps?: string[];
  variant?: 'dots' | 'numbers' | 'progress';
}

export function CheckoutStepIndicator({ 
  currentStep = 1, 
  totalSteps = 3,
  steps = ['Cart', 'Information', 'Payment'],
  variant = 'numbers'
}: CheckoutStepIndicatorProps) {
  
  if (variant === 'progress') {
    const progress = (currentStep / totalSteps) * 100;
    return (
      <div className="w-full max-w-2xl mx-auto mb-8">
        <div className="flex justify-between mb-2 text-sm text-gray-600">
          <span>Step {currentStep} of {totalSteps}</span>
          <span>{Math.round(progress)}% Complete</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    );
  }

  if (variant === 'dots') {
    return (
      <div className="flex justify-center items-center gap-2 mb-8">
        {Array.from({ length: totalSteps }).map((_, idx) => (
          <div
            key={idx}
            className={`w-3 h-3 rounded-full transition-all ${
              idx + 1 === currentStep
                ? 'bg-blue-600 scale-125'
                : idx + 1 < currentStep
                ? 'bg-blue-400'
                : 'bg-gray-300'
            }`}
          />
        ))}
      </div>
    );
  }

  // Default: numbers variant
  return (
    <div className="w-full max-w-4xl mx-auto mb-8">
      <div className="flex items-center justify-between">
        {steps.slice(0, totalSteps).map((step, idx) => {
          const stepNumber = idx + 1;
          const isActive = stepNumber === currentStep;
          const isCompleted = stepNumber < currentStep;
          
          return (
            <div key={idx} className="flex items-center flex-1">
              {/* Step Circle */}
              <div className="flex flex-col items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all ${
                    isActive
                      ? 'bg-blue-600 text-white scale-110 shadow-lg'
                      : isCompleted
                      ? 'bg-green-500 text-white'
                      : 'bg-gray-200 text-gray-500'
                  }`}
                >
                  {isCompleted ? (
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    stepNumber
                  )}
                </div>
                <span
                  className={`mt-2 text-sm font-medium ${
                    isActive ? 'text-blue-600' : isCompleted ? 'text-green-600' : 'text-gray-500'
                  }`}
                >
                  {step}
                </span>
              </div>
              
              {/* Connector Line */}
              {idx < totalSteps - 1 && (
                <div className="flex-1 h-1 mx-4 relative top-[-20px]">
                  <div
                    className={`h-full transition-all ${
                      isCompleted ? 'bg-green-500' : 'bg-gray-200'
                    }`}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

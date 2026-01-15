import React from "react";
import { CTASectionProps } from "../../types/website-elements";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface CTASectionMockupProps {
  props: Partial<CTASectionProps>;
}

export function CTASectionMockup({ props }: CTASectionMockupProps) {
  const {
    headline = "Ready to Get Started?",
    description = "Join thousands of satisfied customers and transform your business today.",
    buttons = [
      { text: "Start Free Trial", link: "#", style: "primary" as const },
      { text: "Contact Sales", link: "#", style: "secondary" as const },
    ],
    layout = "centered",
    backgroundImage,
    backgroundVideo,
    appearance = {},
  } = props;

  const {
    variables = {
      colorPrimary: "#3b82f6",
      colorBackground: "#ffffff",
      colorText: "#1f2937",
    },
  } = appearance;

  const hasBackground = backgroundImage || backgroundVideo;

  return (
    <div className={cn(
      "relative w-full py-20 px-6 overflow-hidden",
      hasBackground && "text-white"
    )}
    style={{ backgroundColor: hasBackground ? undefined : variables.colorBackground }}>
      {/* Background */}
      {hasBackground && (
        <>
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-purple-600" />
          <div className="absolute inset-0 bg-black/30" />
        </>
      )}

      {/* Content */}
      <div className={cn(
        "relative z-10 max-w-7xl mx-auto",
        layout === "centered" && "text-center",
        layout === "split" && "grid md:grid-cols-2 gap-12 items-center"
      )}>
        <div className={layout === "centered" ? "max-w-3xl mx-auto" : ""}>
          <h2 className={cn(
            "text-4xl md:text-5xl font-bold mb-6",
            hasBackground ? "text-white" : ""
          )}
          style={{ color: hasBackground ? undefined : variables.colorText }}>
            {headline}
          </h2>
          {description && (
            <p className={cn(
              "text-xl mb-8",
              hasBackground ? "text-white/90" : "text-slate-600"
            )}>
              {description}
            </p>
          )}
          <div className={cn(
            "flex flex-wrap gap-4",
            layout === "centered" && "justify-center"
          )}>
            {buttons.map((button, idx) => (
              <button
                key={idx}
                className={cn(
                  "px-6 py-3 rounded-lg font-semibold transition-all flex items-center gap-2",
                  hasBackground && button.style === "primary" && "bg-white text-blue-600 hover:bg-blue-50",
                  hasBackground && button.style === "secondary" && "bg-white/20 backdrop-blur-sm text-white border-2 border-white/50 hover:bg-white/30",
                  !hasBackground && button.style === "primary" && "text-white shadow-lg hover:shadow-xl",
                  !hasBackground && button.style === "secondary" && "bg-white border-2 hover:bg-slate-50"
                )}
                style={!hasBackground ? {
                  backgroundColor: button.style === "primary" ? variables.colorPrimary : undefined,
                  borderColor: button.style !== "primary" ? variables.colorPrimary : undefined,
                  color: button.style !== "primary" ? variables.colorPrimary : undefined,
                } : undefined}
              >
                {button.text}
                {button.style === "primary" && <ArrowRight className="h-5 w-5" />}
              </button>
            ))}
          </div>
        </div>

        {layout === "split" && (
          <div className="flex items-center justify-center">
            <div className="w-full aspect-square rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center">
              <div className="text-white/50 text-center">
                <div className="text-sm">Image or Graphic</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

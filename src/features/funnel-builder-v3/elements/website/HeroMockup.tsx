import React from "react";
import { HeroProps } from "../../types/website-elements";
import { ArrowRight, Play } from "lucide-react";
import { cn } from "@/lib/utils";

interface HeroMockupProps {
  props: Partial<HeroProps>;
}

export function HeroMockup({ props }: HeroMockupProps) {
  const {
    layout = "centered",
    headline = "Build Amazing Funnels That Convert",
    subheadline = "The Complete Solution",
    description = "Create high-converting sales funnels, landing pages, and checkout experiences in minutes. No coding required.",
    buttons = [
      { text: "Get Started", link: "#", style: "primary" as const },
      { text: "Watch Demo", link: "#", style: "secondary" as const },
    ],
    image,
    backgroundVideo,
    badge,
    appearance = {},
  } = props;

  const {
    variables = {
      colorPrimary: "#3b82f6",
      colorBackground: "#ffffff",
      colorText: "#1f2937",
    },
  } = appearance;

  const renderButtons = () => (
    <div className="flex flex-wrap items-center gap-4">
      {buttons.map((button, idx) => (
        <button
          key={idx}
          className={cn(
            "px-6 py-3 rounded-lg font-semibold transition-all flex items-center gap-2",
            button.style === "primary" && "text-white shadow-lg hover:shadow-xl",
            button.style === "secondary" && "bg-white border-2 hover:bg-slate-50",
            button.style === "outline" && "border-2 bg-transparent hover:bg-slate-50"
          )}
          style={{
            backgroundColor: button.style === "primary" ? variables.colorPrimary : undefined,
            borderColor: button.style !== "primary" ? variables.colorPrimary : undefined,
            color: button.style !== "primary" ? variables.colorPrimary : undefined,
          }}
        >
          {button.text}
          {button.style === "primary" && <ArrowRight className="h-5 w-5" />}
          {button.style === "secondary" && <Play className="h-5 w-5" />}
        </button>
      ))}
    </div>
  );

  const renderContent = () => (
    <div className={cn(
      "space-y-6",
      layout === "centered" && "text-center max-w-4xl mx-auto",
      layout === "left-aligned" && "text-left max-w-2xl",
      layout === "split" && "text-left max-w-xl"
    )}>
      {badge && (
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 text-blue-600 text-sm font-medium">
          {badge.text}
        </div>
      )}
      
      {subheadline && (
        <div className="text-sm font-semibold uppercase tracking-wider" style={{ color: variables.colorPrimary }}>
          {subheadline}
        </div>
      )}
      
      <h1 className="text-5xl md:text-6xl font-bold leading-tight" style={{ color: variables.colorText }}>
        {headline}
      </h1>
      
      {description && (
        <p className="text-xl text-slate-600 leading-relaxed">
          {description}
        </p>
      )}
      
      {layout === "centered" ? (
        <div className="flex justify-center">
          {renderButtons()}
        </div>
      ) : (
        renderButtons()
      )}
    </div>
  );

  const renderImage = () => {
    if (!image && !backgroundVideo) return null;
    
    return (
      <div className="relative">
        <div className="aspect-video rounded-2xl bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center overflow-hidden shadow-2xl">
          {image ? (
            <img src={image.src} alt={image.alt} className="w-full h-full object-cover" />
          ) : (
            <div className="text-slate-400 text-center p-8">
              <Play className="h-16 w-16 mx-auto mb-4" />
              <div className="text-sm">Video Background</div>
            </div>
          )}
        </div>
      </div>
    );
  };

  if (layout === "centered") {
    return (
      <div className="w-full py-20 px-6" style={{ backgroundColor: variables.colorBackground }}>
        <div className="max-w-7xl mx-auto">
          {renderContent()}
          {(image || backgroundVideo) && (
            <div className="mt-12">
              {renderImage()}
            </div>
          )}
        </div>
      </div>
    );
  }

  if (layout === "split") {
    return (
      <div className="w-full py-20 px-6" style={{ backgroundColor: variables.colorBackground }}>
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div>
            {renderContent()}
          </div>
          <div>
            {renderImage()}
          </div>
        </div>
      </div>
    );
  }

  if (layout === "left-aligned") {
    return (
      <div className="w-full py-20 px-6" style={{ backgroundColor: variables.colorBackground }}>
        <div className="max-w-7xl mx-auto">
          {renderContent()}
          {(image || backgroundVideo) && (
            <div className="mt-12">
              {renderImage()}
            </div>
          )}
        </div>
      </div>
    );
  }

  // full-width
  return (
    <div className="relative w-full min-h-screen flex items-center justify-center overflow-hidden">
      {backgroundVideo && (
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-purple-600 opacity-90" />
      )}
      <div className="relative z-10 px-6 py-20">
        <div className="max-w-4xl mx-auto text-center text-white">
          {badge && (
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 backdrop-blur-sm text-white text-sm font-medium mb-6">
              {badge.text}
            </div>
          )}
          <h1 className="text-6xl md:text-7xl font-bold leading-tight mb-6">
            {headline}
          </h1>
          {description && (
            <p className="text-xl text-white/90 leading-relaxed mb-8">
              {description}
            </p>
          )}
          <div className="flex justify-center">
            {renderButtons()}
          </div>
        </div>
      </div>
    </div>
  );
}

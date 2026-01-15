import React from "react";
import { FeatureGridProps } from "../../types/website-elements";
import { Zap, Shield, Rocket, Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface FeatureGridMockupProps {
  props: Partial<FeatureGridProps>;
}

export function FeatureGridMockup({ props }: FeatureGridMockupProps) {
  const {
    title = "Powerful Features",
    subtitle = "Everything you need to succeed",
    features = [
      { id: "1", icon: "zap", title: "Lightning Fast", description: "Optimized for speed and performance" },
      { id: "2", icon: "shield", title: "Secure", description: "Bank-level security for your data" },
      { id: "3", icon: "rocket", title: "Scalable", description: "Grows with your business" },
      { id: "4", icon: "star", title: "Premium Support", description: "24/7 expert assistance" },
    ],
    columns = 3,
    iconStyle = "solid",
    appearance = {},
  } = props;

  const {
    variables = {
      colorPrimary: "#3b82f6",
      colorBackground: "#ffffff",
      colorText: "#1f2937",
    },
  } = appearance;

  const iconMap: Record<string, any> = {
    zap: Zap,
    shield: Shield,
    rocket: Rocket,
    star: Star,
  };

  return (
    <div className="w-full py-20 px-6" style={{ backgroundColor: variables.colorBackground }}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          {subtitle && (
            <div className="text-sm font-semibold uppercase tracking-wider mb-4" style={{ color: variables.colorPrimary }}>
              {subtitle}
            </div>
          )}
          <h2 className="text-4xl font-bold" style={{ color: variables.colorText }}>
            {title}
          </h2>
        </div>

        {/* Features Grid */}
        <div className={cn(
          "grid gap-8",
          columns === 2 && "md:grid-cols-2",
          columns === 3 && "md:grid-cols-3",
          columns === 4 && "md:grid-cols-4"
        )}>
          {features.map((feature) => {
            const Icon = iconMap[feature.icon || "star"] || Star;
            
            return (
              <div key={feature.id} className="text-center">
                <div className={cn(
                  "inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-6",
                  iconStyle === "solid" && "text-white",
                  iconStyle === "outline" && "border-2",
                  iconStyle === "gradient" && "bg-gradient-to-br from-blue-500 to-purple-500 text-white"
                )}
                style={{
                  backgroundColor: iconStyle === "solid" ? variables.colorPrimary : iconStyle === "outline" ? "transparent" : undefined,
                  borderColor: iconStyle === "outline" ? variables.colorPrimary : undefined,
                  color: iconStyle === "outline" ? variables.colorPrimary : undefined,
                }}>
                  <Icon className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-semibold mb-3" style={{ color: variables.colorText }}>
                  {feature.title}
                </h3>
                <p className="text-slate-600">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

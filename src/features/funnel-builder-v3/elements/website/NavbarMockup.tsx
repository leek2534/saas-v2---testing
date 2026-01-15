import React from "react";
import { NavbarProps } from "../../types/website-elements";
import { Menu, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface NavbarMockupProps {
  props: Partial<NavbarProps>;
}

export function NavbarMockup({ props }: NavbarMockupProps) {
  const {
    logo = { type: "text", content: "Brand" },
    menuItems = [
      { label: "Home", link: "#", type: "link" },
      { label: "Features", link: "#", type: "link" },
      { label: "Pricing", link: "#", type: "link" },
      { label: "About", link: "#", type: "link" },
    ],
    ctaButton = { text: "Get Started", link: "#", style: "primary" },
    layout = "left-aligned",
    sticky = true,
    transparent = false,
    appearance = {},
  } = props;

  const {
    variables = {
      colorPrimary: "#3b82f6",
      colorBackground: "#ffffff",
      colorText: "#1f2937",
    },
  } = appearance;

  return (
    <nav
      className={cn(
        "w-full border-b",
        sticky && "sticky top-0 z-50",
        transparent ? "bg-transparent border-transparent" : "bg-white border-slate-200"
      )}
      style={{ backgroundColor: transparent ? "transparent" : variables.colorBackground }}
    >
      <div className="max-w-7xl mx-auto px-6">
        <div className={cn(
          "flex items-center h-16",
          layout === "centered" && "justify-center",
          layout === "left-aligned" && "justify-between",
          layout === "split" && "justify-between"
        )}>
          {/* Logo */}
          <div className="flex items-center">
            {logo.type === "text" ? (
              <div className="text-xl font-bold" style={{ color: variables.colorText }}>
                {logo.content}
              </div>
            ) : (
              <img src={logo.content} alt="Logo" className="h-8" />
            )}
          </div>

          {/* Menu Items */}
          <div className={cn(
            "hidden md:flex items-center gap-8",
            layout === "centered" && "absolute left-1/2 -translate-x-1/2"
          )}>
            {menuItems.map((item, idx) => (
              <div key={idx} className="relative group">
                <button
                  className="flex items-center gap-1 text-sm font-medium transition-colors hover:opacity-70"
                  style={{ color: variables.colorText }}
                >
                  {item.label}
                  {item.type === "dropdown" && <ChevronDown className="h-4 w-4" />}
                </button>
                {item.type === "dropdown" && item.children && (
                  <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-slate-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                    {item.children.map((child, childIdx) => (
                      <a
                        key={childIdx}
                        href={child.link}
                        className="block px-4 py-2 text-sm hover:bg-slate-50 first:rounded-t-lg last:rounded-b-lg"
                        style={{ color: variables.colorText }}
                      >
                        {child.label}
                      </a>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* CTA Button */}
          <div className="flex items-center gap-4">
            {ctaButton && (
              <button
                className={cn(
                  "px-4 py-2 rounded-lg text-sm font-semibold transition-all",
                  ctaButton.style === "primary" && "text-white shadow-md hover:shadow-lg",
                  ctaButton.style === "secondary" && "bg-white border-2",
                  ctaButton.style === "outline" && "border-2 bg-transparent"
                )}
                style={{
                  backgroundColor: ctaButton.style === "primary" ? variables.colorPrimary : undefined,
                  borderColor: ctaButton.style !== "primary" ? variables.colorPrimary : undefined,
                  color: ctaButton.style !== "primary" ? variables.colorPrimary : undefined,
                }}
              >
                {ctaButton.text}
              </button>
            )}
            <button className="md:hidden">
              <Menu className="h-6 w-6" style={{ color: variables.colorText }} />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}

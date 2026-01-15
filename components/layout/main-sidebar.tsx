"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import { 
  BarChart3, 
  Activity, 
  Settings,
  FolderKanban,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Wand2,
  CreditCard
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useEffect, useState } from "react";

const navigationItems = [
  {
    name: "Projects",
    href: "",
    icon: FolderKanban,
  },
  {
    name: "Kanva",
    href: "/kanva",
    icon: Sparkles,
  },
  {
    name: "Billing",
    href: "/billing",
    icon: CreditCard,
  },
  {
    name: "Test Builder",
    href: "/test-builder",
    icon: Wand2,
  },
  {
    name: "Analytics",
    href: "/analytics",
    icon: BarChart3,
  },
  {
    name: "Activity",
    href: "/activity",
    icon: Activity,
  },
  {
    name: "Settings",
    href: "/settings",
    icon: Settings,
  },
];

const SIDEBAR_EXPANDED_KEY = "sidebar-expanded";

export function MainSidebar() {
  const pathname = usePathname();
  const { teamSlug } = useParams();
  const [isExpanded, setIsExpanded] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem(SIDEBAR_EXPANDED_KEY);
    if (saved !== null) {
      setIsExpanded(saved === "true");
    }
  }, []);

  const toggleSidebar = () => {
    const newState = !isExpanded;
    setIsExpanded(newState);
    localStorage.setItem(SIDEBAR_EXPANDED_KEY, String(newState));
    window.dispatchEvent(new CustomEvent("sidebar-expanded-changed", { detail: newState }));
  };

  if (!mounted) {
    return null;
  }

  return (
    <aside
      className={cn(
        "hidden md:flex md:flex-col md:fixed md:inset-y-0 md:left-0 md:top-[calc(6rem+1px)] md:border-r md:bg-background md:z-40 transition-all duration-300 ease-in-out",
        isExpanded ? "md:w-64" : "md:w-16"
      )}
    >
      <div className="flex flex-col flex-1 min-h-0">
        {/* Navigation Items */}
        <nav className="flex-1 px-3 py-2 space-y-1 overflow-y-auto">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const linkPath = `/t/${teamSlug as string}${item.href}`;
            const isActive =
              item.href === ""
                ? pathname === linkPath
                : pathname.startsWith(linkPath);

            if (isExpanded) {
              return (
                <Link
                  key={item.name}
                  href={linkPath}
                  className={cn(
                    "group flex items-center rounded-lg text-sm font-medium transition-colors gap-3 px-3 py-2",
                    isActive
                      ? "bg-accent text-accent-foreground"
                      : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                  )}
                >
                  <Icon className="h-5 w-5 flex-shrink-0" />
                  <span className="truncate">{item.name}</span>
                </Link>
              );
            }

            return (
              <TooltipProvider key={item.name}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Link
                      href={linkPath}
                      className={cn(
                        "group flex items-center rounded-lg text-sm font-medium transition-colors justify-center px-2 py-2",
                        isActive
                          ? "bg-accent text-accent-foreground"
                          : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                      )}
                    >
                      <Icon className="h-5 w-5 flex-shrink-0" />
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent side="right">
                    <p>{item.name}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            );
          })}
        </nav>
        
        {/* Toggle Button - Compact at bottom */}
        <div className="px-3 py-2 border-t">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={toggleSidebar}
                  className={cn(
                    "w-full transition-all",
                    isExpanded ? "" : "justify-center"
                  )}
                >
                  {isExpanded ? (
                    <ChevronLeft className="h-4 w-4" />
                  ) : (
                    <ChevronRight className="h-4 w-4" />
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right">
                <p>{isExpanded ? "Collapse sidebar" : "Expand sidebar"}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
    </aside>
  );
}

// Hook to get sidebar expanded state
export function useSidebarExpanded(): boolean {
  const [isExpanded, setIsExpanded] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem(SIDEBAR_EXPANDED_KEY);
    if (saved !== null) {
      setIsExpanded(saved === "true");
    }

    const handleChange = (event: CustomEvent) => {
      setIsExpanded(event.detail);
    };
    window.addEventListener("sidebar-expanded-changed", handleChange as EventListener);
    return () => {
      window.removeEventListener("sidebar-expanded-changed", handleChange as EventListener);
    };
  }, []);

  return mounted ? isExpanded : true;
}






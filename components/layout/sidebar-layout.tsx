"use client";

import { MainSidebar, useSidebarExpanded } from "./main-sidebar";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { useParams, usePathname } from "next/navigation";
import Link from "next/link";
import { 
  BarChart3, 
  Activity, 
  Settings,
  FolderKanban,
  Sparkles
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { HamburgerMenuIcon } from "@radix-ui/react-icons";

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

export function SidebarLayout({ children }: { children: React.ReactNode }) {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const pathname = usePathname();
  const { teamSlug } = useParams();
  const isExpanded = useSidebarExpanded();

  return (
    <div className="flex h-full">
      {/* Desktop Sidebar */}
      <MainSidebar />

      {/* Mobile Sidebar Button */}
      <div className="md:hidden fixed top-4 left-4 z-50">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setMobileSidebarOpen(true)}
        >
          <HamburgerMenuIcon className="h-6 w-6" />
        </Button>
      </div>

      {/* Mobile Sidebar Sheet */}
      <Sheet open={mobileSidebarOpen} onOpenChange={setMobileSidebarOpen}>
        <SheetContent side="left" className="w-64 p-0">
          <SheetHeader className="p-4 border-b">
            <SheetTitle>Navigation</SheetTitle>
          </SheetHeader>
          <nav className="flex-1 px-3 py-4 space-y-1">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const linkPath = `/t/${teamSlug as string}${item.href}`;
              const isActive =
                item.href === ""
                  ? pathname === linkPath
                  : pathname.startsWith(linkPath);

              return (
                <Link
                  key={item.name}
                  href={linkPath}
                  onClick={() => setMobileSidebarOpen(false)}
                  className={cn(
                    "group flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-accent text-accent-foreground"
                      : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                  )}
                >
                  <Icon className="h-5 w-5 flex-shrink-0" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </SheetContent>
      </Sheet>

      {/* Main Content - Adjust margin based on sidebar state */}
      <div className={cn(
        "flex-1 transition-all duration-300 ease-in-out",
        isExpanded ? "md:ml-64" : "md:ml-16"
      )}>
        {children}
      </div>
    </div>
  );
}







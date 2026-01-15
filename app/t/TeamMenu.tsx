"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import { ReactNode } from "react";
import { 
  LayoutDashboard, 
  Palette, 
  FileText, 
  Settings, 
  BarChart3, 
  CreditCard,
  Users,
  FolderKanban,
  Zap,
  Layers,
  Package
} from "lucide-react";

export function TeamMenu() {
  return (
    <div className="flex flex-col gap-1">
      <NavLink relativeHref="" icon={<LayoutDashboard className="h-4 w-4" />}>
        Dashboard
      </NavLink>
      <NavLink relativeHref="/projects" icon={<FolderKanban className="h-4 w-4" />}>
        Projects
      </NavLink>
      <NavLink relativeHref="/catalog" icon={<Package className="h-4 w-4" />}>
        Catalog
      </NavLink>
      <NavLink relativeHref="/kanva" icon={<Palette className="h-4 w-4" />}>
        Kanva
      </NavLink>
      <NavLink relativeHref="/test-builder" icon={<FileText className="h-4 w-4" />}>
        Test Builder (V3)
      </NavLink>
      <NavLink relativeHref="/test-builder-legacy" icon={<FileText className="h-4 w-4" />}>
        Test Builder (Legacy)
      </NavLink>
      <NavLink relativeHref="/funnels" icon={<Layers className="h-4 w-4" />}>
        Funnel Builder
      </NavLink>
      <NavLink relativeHref="/analytics" icon={<BarChart3 className="h-4 w-4" />}>
        Analytics
      </NavLink>
      <NavLink relativeHref="/integrations" icon={<Zap className="h-4 w-4" />}>
        Integrations
      </NavLink>
      <NavLink relativeHref="/billing" icon={<CreditCard className="h-4 w-4" />}>
        Billing
      </NavLink>
      <NavLink relativeHref="/settings" icon={<Settings className="h-4 w-4" />}>
        Settings
      </NavLink>
    </div>
  );
}

function NavLink({
  relativeHref,
  children,
  icon,
}: {
  relativeHref: string;
  children: ReactNode;
  icon?: ReactNode;
}) {
  const currentPath = usePathname();
  const { teamSlug } = useParams();
  const linkPath = `/t/${teamSlug as string}${relativeHref}`;
  const active =
    relativeHref === ""
      ? currentPath === linkPath
      : currentPath.startsWith(linkPath);
  return (
    <Link
      href={linkPath}
      className={cn(
        "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
        active
          ? "bg-accent text-accent-foreground"
          : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
      )}
    >
      {icon}
      {children}
    </Link>
  );
}

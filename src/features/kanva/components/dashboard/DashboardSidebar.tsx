"use client";

import { useRouter, usePathname, useParams } from 'next/navigation';
import {
  Home,
  FolderOpen,
  LayoutTemplate,
  Palette,
  Upload,
  Users,
  CreditCard,
  HelpCircle,
  Sparkles,
  Star,
  Clock,
  Trash2,
  Image,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface NavItem {
  label: string;
  icon: any;
  path: string;
  badge?: string | number;
  isPro?: boolean;
}

export function DashboardSidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams();
  const teamSlug = params.teamSlug as string;

  const getNavItems = (): NavItem[] => [
    { label: 'Home', icon: Home, path: `/t/${teamSlug}/kanva` },
    { label: 'All Designs', icon: FolderOpen, path: `/t/${teamSlug}/kanva/designs` },
    { label: 'Brand Kit', icon: Palette, path: `/t/${teamSlug}/kanva/brand`, isPro: true },
    { label: 'Templates', icon: LayoutTemplate, path: `/t/${teamSlug}/kanva/templates` },
    { label: 'Stock Library', icon: Image, path: `/t/${teamSlug}/kanva/stock`, badge: 'NEW' },
    { label: 'Uploads', icon: Upload, path: `/t/${teamSlug}/kanva/uploads` },
    { label: 'Shared with Me', icon: Users, path: `/t/${teamSlug}/kanva/shared`, badge: '3' },
    { label: 'Trash', icon: Trash2, path: `/t/${teamSlug}/kanva/trash` },
  ];

  const getQuickAccessItems = (): NavItem[] => [
    { label: 'Starred', icon: Star, path: `/t/${teamSlug}/kanva/starred` },
    { label: 'Recent', icon: Clock, path: `/t/${teamSlug}/kanva/recent` },
  ];

  const getBottomItems = (): NavItem[] => [
    { label: 'Billing', icon: CreditCard, path: `/t/${teamSlug}/kanva/billing` },
    { label: 'Help & Tutorials', icon: HelpCircle, path: `/t/${teamSlug}/kanva/help` },
  ];

  const navItems = getNavItems();
  const quickAccessItems = getQuickAccessItems();
  const bottomItems = getBottomItems();

  const isActive = (path: string) => {
    return pathname === path;
  };

  return (
    <aside className="w-64 border-r border-border/40 bg-muted/20 flex flex-col h-full">
      {/* AI Assistant Banner */}
      <div className="p-4">
        <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl p-4 text-white">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="w-5 h-5" />
            <span className="font-bold text-sm">AI Designer</span>
          </div>
          <p className="text-xs opacity-90 mb-3">
            Describe what you want to create and let AI do the work
          </p>
          <Button size="sm" className="w-full bg-white text-indigo-600 hover:bg-white/90">
            Try AI Design
          </Button>
        </div>
      </div>

      {/* Main Navigation */}
      <nav className="flex-1 px-3 py-2 space-y-1 overflow-y-auto">
        <div className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            
            return (
              <button
                key={item.path}
                onClick={() => router.push(item.path)}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all",
                  active
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                <Icon className="w-4 h-4 flex-shrink-0" />
                <span className="flex-1 text-left">{item.label}</span>
                {item.badge && (
                  <span className="px-2 py-0.5 text-xs font-semibold bg-primary/20 text-primary rounded-full">
                    {item.badge}
                  </span>
                )}
                {item.isPro && (
                  <span className="px-2 py-0.5 text-xs font-semibold bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-full">
                    PRO
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Quick Access */}
        <div className="pt-6">
          <div className="text-xs font-semibold text-muted-foreground mb-2 px-3">
            QUICK ACCESS
          </div>
          <div className="space-y-1">
            {quickAccessItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);
              
              return (
                <button
                  key={item.path}
                  onClick={() => router.push(item.path)}
                  className={cn(
                    "w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all",
                    active
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                >
                  <Icon className="w-4 h-4 flex-shrink-0" />
                  <span className="flex-1 text-left">{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Bottom Items */}
      <div className="p-3 border-t border-border/40 space-y-1">
        {bottomItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.path);
          
          return (
            <button
              key={item.path}
              onClick={() => router.push(item.path)}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all",
                active
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <Icon className="w-4 h-4 flex-shrink-0" />
              <span className="flex-1 text-left">{item.label}</span>
            </button>
          );
        })}
      </div>
    </aside>
  );
}

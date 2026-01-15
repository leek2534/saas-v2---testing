'use client';

import { useState } from 'react';
import { useRouter, usePathname, useParams } from 'next/navigation';
import Link from 'next/link';
import { 
  Home,
  Sparkles,
  FolderOpen,
  Star,
  Clock,
  Trash2,
  Settings,
  HelpCircle,
  ChevronLeft,
  Menu,
  X,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface SidebarItem {
  id: string;
  label: string;
  icon: any;
  path: string;
  badge?: string;
}

// These will be generated dynamically with teamSlug
const getSidebarItems = (teamSlug: string): SidebarItem[] => [
  { id: 'home', label: 'Home', icon: Home, path: `/t/${teamSlug}/kanva` },
  { id: 'projects', label: 'Projects', icon: FolderOpen, path: `/t/${teamSlug}/kanva/projects` },
  { id: 'starred', label: 'Starred', icon: Star, path: `/t/${teamSlug}/kanva/starred` },
  { id: 'recent', label: 'Recent', icon: Clock, path: `/t/${teamSlug}/kanva/recent` },
  { id: 'trash', label: 'Trash', icon: Trash2, path: `/t/${teamSlug}/kanva/trash` },
];

const getBottomItems = (teamSlug: string): SidebarItem[] => [
  { id: 'help', label: 'Help & Support', icon: HelpCircle, path: `/t/${teamSlug}/kanva/help` },
  { id: 'settings', label: 'Settings', icon: Settings, path: `/t/${teamSlug}/kanva/settings` },
];

export function KanvaLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams();
  const teamSlug = params.teamSlug as string;
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Get active item from pathname
  const getActiveItem = () => {
    if (pathname?.includes('/kanva/editor')) return 'editor';
    if (pathname?.includes('/kanva/projects')) return 'projects';
    if (pathname?.includes('/kanva/starred')) return 'starred';
    if (pathname?.includes('/kanva/recent')) return 'recent';
    if (pathname?.includes('/kanva/trash')) return 'trash';
    if (pathname?.includes('/kanva/help')) return 'help';
    if (pathname?.includes('/kanva/settings')) return 'settings';
    return 'home';
  };

  const activeItem = getActiveItem();

  const handleNavigation = (item: SidebarItem) => {
    router.push(item.path);
    setIsMobileSidebarOpen(false);
  };

  const handleBackToDashboard = () => {
    router.push(`/t/${teamSlug}`);
  };

  const sidebarItems = getSidebarItems(teamSlug);
  const bottomItems = getBottomItems(teamSlug);

  const SidebarContent = () => (
    <div className="h-full flex flex-col bg-gradient-to-b from-background to-muted/20 border-r border-border/50">
      {/* Header */}
      <div className="p-6 border-b border-border/50">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            {isSidebarOpen && (
              <div>
                <h2 className="text-lg font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  Kanva
                </h2>
                <p className="text-xs text-muted-foreground">Design Studio</p>
              </div>
            )}
          </div>
          
          {/* Desktop Toggle */}
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="hidden lg:flex w-8 h-8 items-center justify-center rounded-lg hover:bg-muted transition-colors"
          >
            <ChevronLeft className={cn(
              "w-4 h-4 transition-transform",
              !isSidebarOpen && "rotate-180"
            )} />
          </button>

          {/* Mobile Close */}
          <button
            onClick={() => setIsMobileSidebarOpen(false)}
            className="lg:hidden w-8 h-8 flex items-center justify-center rounded-lg hover:bg-muted transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Back to Dashboard */}
        {isSidebarOpen && (
          <Button
            variant="outline"
            size="sm"
            onClick={handleBackToDashboard}
            className="w-full justify-start gap-2 text-xs"
          >
            <ChevronLeft className="w-3 h-3" />
            Back to Dashboard
          </Button>
        )}
      </div>

      {/* Navigation Items */}
      <div className="flex-1 overflow-y-auto py-4">
        <nav className="space-y-1 px-3">
          {SIDEBAR_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = activeItem === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => handleNavigation(item)}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200",
                  isActive
                    ? "bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg shadow-indigo-500/25"
                    : "text-foreground hover:bg-muted"
                )}
              >
                <Icon className={cn(
                  "w-5 h-5 flex-shrink-0",
                  isActive && "text-white"
                )} />
                {isSidebarOpen && (
                  <span className={cn(
                    "text-sm font-medium",
                    isActive && "text-white"
                  )}>
                    {item.label}
                  </span>
                )}
                {item.badge && isSidebarOpen && (
                  <span className="ml-auto text-xs px-2 py-0.5 rounded-full bg-white/20 text-white">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom Items */}
      <div className="border-t border-border/50 py-4">
        <nav className="space-y-1 px-3">
          {bottomItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeItem === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => handleNavigation(item)}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200",
                  isActive
                    ? "bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg shadow-indigo-500/25"
                    : "text-foreground hover:bg-muted"
                )}
              >
                <Icon className={cn(
                  "w-5 h-5 flex-shrink-0",
                  isActive && "text-white"
                )} />
                {isSidebarOpen && (
                  <span className={cn(
                    "text-sm font-medium",
                    isActive && "text-white"
                  )}>
                    {item.label}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* User Profile (if collapsed) */}
      {!isSidebarOpen && (
        <div className="p-3 border-t border-border/50">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-semibold text-sm shadow-lg">
            U
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="h-screen flex overflow-hidden bg-background">
      {/* Desktop Sidebar */}
      <aside className={cn(
        "hidden lg:block transition-all duration-300 ease-in-out",
        isSidebarOpen ? "w-64" : "w-20"
      )}>
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar */}
      {isMobileSidebarOpen && (
        <>
          {/* Backdrop */}
          <div
            className="lg:hidden fixed inset-0 bg-black/50 z-40"
            onClick={() => setIsMobileSidebarOpen(false)}
          />
          
          {/* Sidebar */}
          <aside className="lg:hidden fixed inset-y-0 left-0 w-64 z-50">
            <SidebarContent />
          </aside>
        </>
      )}

      {/* Main Content */}
      <main className="flex-1 overflow-hidden flex flex-col">
        {/* Mobile Header */}
        <header className="lg:hidden border-b border-border/50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="flex items-center justify-between p-4">
            <button
              onClick={() => setIsMobileSidebarOpen(true)}
              className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-muted transition-colors"
            >
              <Menu className="w-5 h-5" />
            </button>
            
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className="text-lg font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Kanva
              </span>
            </div>

            <div className="w-10" /> {/* Spacer */}
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-auto">
          {children}
        </div>
      </main>
    </div>
  );
}

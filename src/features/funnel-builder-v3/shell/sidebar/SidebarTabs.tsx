"use client";

import React from "react";
import { Package, Blocks, Layout } from "lucide-react";
import { cn } from "@/lib/utils";

export type SidebarTab = "blocks" | "elements" | "layout";

interface SidebarTabsProps {
  activeTab: SidebarTab;
  onTabChange: (tab: SidebarTab) => void;
}

export function SidebarTabs({ activeTab, onTabChange }: SidebarTabsProps) {
  const tabs = [
    { id: "blocks" as const, label: "Blocks", icon: Package },
    { id: "elements" as const, label: "Elements", icon: Blocks },
    { id: "layout" as const, label: "Layout", icon: Layout },
  ];

  return (
    <div className="flex border-b border-slate-200 bg-white">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;
        
        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={cn(
              "flex-1 flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium transition-colors relative",
              isActive
                ? "text-blue-600 bg-blue-50"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
            )}
          >
            <Icon className="h-4 w-4" />
            <span>{tab.label}</span>
            {isActive && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600" />
            )}
          </button>
        );
      })}
    </div>
  );
}

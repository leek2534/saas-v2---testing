'use client';

import React from 'react';
import {
  FolderOpen,
  LayoutGrid,
  Type,
  Image as ImageIcon,
  Shapes,
  PenTool,
  Play,
  Upload,
  Grid3x3,
  Mic,
  Sparkles,
  LucideIcon,
} from "lucide-react";
import { cn } from "../lib/utils";

interface SidebarItem {
  icon: LucideIcon;
  label: string;
  id: string;
}

const sidebarItems: SidebarItem[] = [
  { icon: FolderOpen, label: 'My Designs', id: 'designs' },
  { icon: LayoutGrid, label: 'Templates', id: 'templates' },
  { icon: Type, label: 'Text', id: 'text' },
  { icon: ImageIcon, label: 'Photos', id: 'photos' },
  { icon: Shapes, label: 'Icons', id: 'icons' },
  { icon: Sparkles, label: 'Elements', id: 'elements' },
  { icon: Shapes, label: 'Shapes', id: 'shapes' },
  { icon: PenTool, label: 'Draw', id: 'draw' },
  { icon: Play, label: 'Videos', id: 'videos' },
  { icon: Mic, label: 'Audio', id: 'audio' },
  { icon: Upload, label: 'Upload', id: 'upload' },
  { icon: Grid3x3, label: 'Background', id: 'background' },
];

interface SidebarProps {
  activeTab: string | null;
  pinnedTab: string | null;
  onTabHover: (tab: string | null) => void;
  onTabClick: (tab: string) => void;
}

export function Sidebar({ activeTab, pinnedTab, onTabHover, onTabClick }: SidebarProps) {
  return (
    <div className="w-20 bg-gradient-to-b from-background via-background to-muted/20 flex flex-col items-center py-6 gap-3 overflow-y-auto overflow-x-hidden flex-shrink-0 border-r border-border/30 backdrop-blur-sm">
      {sidebarItems.map((item) => {
        const Icon = item.icon;
        const isActive = activeTab === item.id;
        const isPinned = pinnedTab === item.id;
        return (
          <button
            key={item.id}
            onMouseEnter={() => onTabHover(item.id)}
            onMouseLeave={() => !isPinned && onTabHover(null)}
            onClick={() => onTabClick(item.id)}
            className={cn(
              "group relative w-14 h-14 flex flex-col items-center justify-center gap-1 rounded-xl transition-all duration-300 flex-shrink-0 text-[9px] leading-tight font-medium",
              isPinned
                ? "bg-gradient-to-br from-primary to-primary/80 text-primary-foreground shadow-lg shadow-primary/30 scale-105"
                : isActive
                ? "bg-accent text-accent-foreground shadow-md scale-105"
                : "text-muted-foreground hover:text-foreground hover:bg-accent/50 hover:scale-110"
            )}
            title={item.label}
          >
            {/* Glow effect */}
            {(isPinned || isActive) && (
              <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-primary/20 to-transparent blur-xl -z-10 opacity-75" />
            )}
            
            <Icon 
              size={22} 
              className={cn(
                "transition-all duration-300",
                isPinned || isActive ? "scale-110" : "group-hover:scale-110"
              )} 
            />
            <span className="truncate w-full px-1 text-center">{item.label}</span>
            
            {/* Pin indicator */}
            {isPinned && (
              <div className="absolute top-1.5 right-1.5 w-2 h-2 bg-primary-foreground rounded-full shadow-sm animate-pulse" />
            )}
            
            {/* Hover indicator */}
            {!isPinned && (
              <div className={cn(
                "absolute bottom-0 left-1/2 -translate-x-1/2 h-0.5 bg-primary rounded-full transition-all duration-300",
                isActive ? "w-8" : "w-0 group-hover:w-6"
              )} />
            )}
          </button>
        );
      })}
    </div>
  );
}
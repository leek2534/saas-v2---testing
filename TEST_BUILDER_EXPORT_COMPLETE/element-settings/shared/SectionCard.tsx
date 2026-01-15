"use client";



import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Copy, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { LucideIcon } from 'lucide-react';

interface SectionCardProps {
  id: string;
  title: string;
  icon: LucideIcon;
  children: React.ReactNode;
  defaultExpanded?: boolean;
  onCopy?: () => void;
  onReset?: () => void;
}

export function SectionCard({ 
  id, 
  title, 
  icon: Icon, 
  children, 
  defaultExpanded = true,
  onCopy,
  onReset
}: SectionCardProps) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  return (
    <div className="border border-border rounded-lg overflow-hidden">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between px-3 py-2 bg-black text-white hover:bg-black/80 transition-colors"
      >
        <div className="flex items-center gap-2">
          <Icon size={16} className="text-white" />
          <span className="text-sm font-semibold text-white uppercase tracking-wide">
            {title}
          </span>
        </div>
        
        <div className="flex items-center gap-2">
          {onCopy && (
            <Button
              size="sm"
              variant="ghost"
              className="h-7 w-7 p-0 text-white hover:bg-white/10"
              onClick={(e) => {
                e.stopPropagation();
                onCopy();
              }}
              title="Copy styles"
            >
              <Copy size={14} />
            </Button>
          )}
          {onReset && (
            <Button
              size="sm"
              variant="ghost"
              className="h-7 w-7 p-0 text-white hover:bg-white/10"
              onClick={(e) => {
                e.stopPropagation();
                onReset();
              }}
              title="Reset to default"
            >
              <RotateCcw size={14} />
            </Button>
          )}
          {isExpanded ? (
            <ChevronUp size={16} className="text-white" />
          ) : (
            <ChevronDown size={16} className="text-white" />
          )}
        </div>
      </button>
      
      {isExpanded && (
        <div className="p-2 space-y-4 bg-card">
          {children}
        </div>
      )}
    </div>
  );
}

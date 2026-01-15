"use client";



import React from 'react';
import { Save, Check, AlertCircle, Loader2, Cloud, CloudOff, Zap, ZapOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useTestBuilderPersistence } from '@/hooks/useTestBuilderPersistence';
import { useTestBuilderV2Store } from './store';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface EnhancedSaveIndicatorProps {
  className?: string;
}

/**
 * Enhanced Save Indicator Component
 * Uses the new useTestBuilderPersistence hook for better auto-save
 * Based on OpenFunnels persistence pattern
 */
export function EnhancedSaveIndicator({ 
  className,
}: EnhancedSaveIndicatorProps) {
  const { funnel } = useTestBuilderV2Store();
  const {
    saveFunnel,
    isSaving,
    lastSaved,
    autoSave,
    setAutoSave,
    hasUnsavedChanges,
  } = useTestBuilderPersistence(funnel.id);

  // Format last saved time
  const formatLastSaved = () => {
    if (!lastSaved) return 'Never saved';
    
    const now = new Date();
    const diff = now.getTime() - lastSaved.getTime();
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);

    if (seconds < 60) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return lastSaved.toLocaleDateString();
  };

  // Get status icon and color
  const getStatusDisplay = () => {
    if (isSaving) {
      return {
        icon: <Loader2 className="w-4 h-4 animate-spin" />,
        text: 'Saving...',
        color: 'text-blue-600',
        bgColor: 'bg-blue-50',
      };
    }
    
    if (hasUnsavedChanges) {
      return {
        icon: <Cloud className="w-4 h-4" />,
        text: 'Unsaved changes',
        color: 'text-orange-600',
        bgColor: 'bg-orange-50',
      };
    }
    
    return {
      icon: <Check className="w-4 h-4" />,
      text: 'All changes saved',
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    };
  };

  const status = getStatusDisplay();

  return (
    <TooltipProvider>
      <div className={cn("flex items-center gap-2", className)}>
        {/* Manual Save Button */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              size="sm"
              variant={hasUnsavedChanges ? "default" : "outline"}
              onClick={() => saveFunnel()}
              disabled={isSaving}
              className="gap-2"
            >
              {isSaving ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              Save
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>{lastSaved ? `Last saved ${formatLastSaved()}` : 'Never saved'}</p>
            <p className="text-xs text-gray-400">Ctrl+S / Cmd+S</p>
          </TooltipContent>
        </Tooltip>

        {/* Auto-save Toggle */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              size="sm"
              variant={autoSave ? "default" : "outline"}
              onClick={() => setAutoSave(!autoSave)}
              className="gap-2"
            >
              {autoSave ? (
                <Zap className="w-4 h-4" />
              ) : (
                <ZapOff className="w-4 h-4" />
              )}
              <span className="hidden sm:inline">Auto</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>{autoSave ? 'Auto-save enabled' : 'Auto-save disabled'}</p>
            <p className="text-xs text-gray-400">
              {autoSave ? 'Saves after 3s of inactivity' : 'Click to enable'}
            </p>
          </TooltipContent>
        </Tooltip>

        {/* Compact Status Indicator */}
        <Tooltip>
          <TooltipTrigger asChild>
            <div className={cn(
              "flex items-center gap-1.5 px-2 py-1 rounded-md text-xs",
              status.bgColor,
              status.color
            )}>
              {status.icon}
              <span className="hidden md:inline font-medium">{status.text}</span>
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <p className="font-medium">{status.text}</p>
            {lastSaved && (
              <p className="text-xs text-gray-400">Last saved {formatLastSaved()}</p>
            )}
          </TooltipContent>
        </Tooltip>
      </div>
    </TooltipProvider>
  );
}




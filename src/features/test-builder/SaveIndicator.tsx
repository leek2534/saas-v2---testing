"use client";



import React, { useEffect, useState } from 'react';
import { Save, Check, AlertCircle, Loader2, Cloud, CloudOff, Zap, ZapOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useTestBuilderV2Store } from './store';
import { funnelSaveService } from '@/src/lib/funnel-save-service';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface SaveIndicatorProps {
  className?: string;
  autoSaveInterval?: number; // milliseconds
}

export function SaveIndicator({ 
  className, 
  autoSaveInterval = 30000 // 30 seconds
}: SaveIndicatorProps) {
  const { 
    saveStatus, 
    lastSaved, 
    hasUnsavedChanges,
    saveFunnel,
    funnel,
  } = useTestBuilderV2Store();

  const [autoSaveEnabled, setAutoSaveEnabled] = useState(true);

  // Auto-save effect
  useEffect(() => {
    if (!autoSaveEnabled) return;

    const interval = setInterval(async () => {
      if (hasUnsavedChanges) {
        await saveFunnel();
      }
    }, autoSaveInterval);

    return () => clearInterval(interval);
  }, [autoSaveEnabled, autoSaveInterval, hasUnsavedChanges, saveFunnel]);

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
    switch (saveStatus) {
      case 'saving':
        return {
          icon: <Loader2 className="w-4 h-4 animate-spin" />,
          text: 'Saving...',
          color: 'text-blue-600',
          bgColor: 'bg-blue-50',
        };
      case 'saved':
        return {
          icon: <Check className="w-4 h-4" />,
          text: hasUnsavedChanges ? 'Unsaved changes' : 'All changes saved',
          color: hasUnsavedChanges ? 'text-orange-600' : 'text-green-600',
          bgColor: hasUnsavedChanges ? 'bg-orange-50' : 'bg-green-50',
        };
      case 'unsaved':
        return {
          icon: <Cloud className="w-4 h-4" />,
          text: 'Unsaved changes',
          color: 'text-orange-600',
          bgColor: 'bg-orange-50',
        };
      case 'error':
        return {
          icon: <AlertCircle className="w-4 h-4" />,
          text: 'Save failed',
          color: 'text-red-600',
          bgColor: 'bg-red-50',
        };
      default:
        return {
          icon: <CloudOff className="w-4 h-4" />,
          text: 'Not saved',
          color: 'text-gray-600',
          bgColor: 'bg-gray-50',
        };
    }
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
              disabled={saveStatus === 'saving'}
              className="gap-2"
            >
              {saveStatus === 'saving' ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              Save
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>{lastSaved ? `Last saved ${formatLastSaved()}` : 'Never saved'}</p>
            <p className="text-xs text-gray-400">Ctrl+S</p>
          </TooltipContent>
        </Tooltip>

        {/* Auto-save Toggle */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              size="sm"
              variant={autoSaveEnabled ? "default" : "outline"}
              onClick={() => setAutoSaveEnabled(!autoSaveEnabled)}
              className="gap-2"
            >
              {autoSaveEnabled ? (
                <Zap className="w-4 h-4" />
              ) : (
                <ZapOff className="w-4 h-4" />
              )}
              <span className="hidden sm:inline">Auto</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>{autoSaveEnabled ? 'Auto-save enabled' : 'Auto-save disabled'}</p>
            <p className="text-xs text-gray-400">
              {autoSaveEnabled ? `Saves every ${autoSaveInterval / 1000}s` : 'Click to enable'}
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

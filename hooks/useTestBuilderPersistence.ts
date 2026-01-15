"use client";

import { useCallback, useEffect, useRef } from 'react';
import { useTestBuilderV2Store } from '@/src/features/test-builder/store';

/**
 * Enhanced persistence hook for Test Builder
 * TODO: Integrate with Convex for actual persistence
 */
export const useTestBuilderPersistence = (funnelId?: string) => {
  const {
    funnel,
    sections,
    hasUnsavedChanges,
    saveStatus,
    saveFunnel,
  } = useTestBuilderV2Store();

  const isSavingRef = useRef(false);
  const lastSavedRef = useRef<Date | null>(null);
  const autoSaveRef = useRef(true);
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Auto-save with debouncing
  useEffect(() => {
    if (!autoSaveRef.current || !hasUnsavedChanges || isSavingRef.current) {
      return;
    }

    // Clear existing timeout
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    // Set new timeout (3 seconds of inactivity)
    saveTimeoutRef.current = setTimeout(async () => {
      if (hasUnsavedChanges && !isSavingRef.current) {
        isSavingRef.current = true;
        try {
          await saveFunnel();
          lastSavedRef.current = new Date();
        } catch (error) {
          console.error('Auto-save failed:', error);
        } finally {
          isSavingRef.current = false;
        }
      }
    }, 3000);

    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, [hasUnsavedChanges, saveFunnel]);

  // Manual save function
  const handleSave = useCallback(async () => {
    if (isSavingRef.current) return;
    
    isSavingRef.current = true;
    try {
      await saveFunnel();
      lastSavedRef.current = new Date();
    } catch (error) {
      console.error('Save failed:', error);
      throw error;
    } finally {
      isSavingRef.current = false;
    }
  }, [saveFunnel]);

  return {
    saveFunnel: handleSave,
    isSaving: isSavingRef.current || saveStatus === 'saving',
    lastSaved: lastSavedRef.current,
    autoSave: autoSaveRef.current,
    setAutoSave: (enabled: boolean) => {
      autoSaveRef.current = enabled;
    },
    hasUnsavedChanges,
  };
};





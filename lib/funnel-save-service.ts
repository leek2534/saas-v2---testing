import { toast } from 'sonner';
import { api } from '@/convex/_generated/api';
import type { Id } from '@/convex/_generated/dataModel';

// Save status types
export type SaveStatus = 'saved' | 'saving' | 'unsaved' | 'error';

// Save result
export interface SaveResult {
  success: boolean;
  message: string;
  timestamp?: Date;
  error?: string;
}

// Funnel data structure for test builder
export interface Funnel {
  id: string;
  name: string;
  steps: FunnelStep[];
  createdAt: Date;
  updatedAt: Date;
}

export interface FunnelStep {
  id: string;
  name: string;
  sections: any[]; // Section/Row/Column structure
  updatedAt: Date;
}

class FunnelSaveService {
  private autoSaveInterval: NodeJS.Timeout | null = null;
  private autoSaveDelay = 30000; // 30 seconds
  private lastSaveTime: Date | null = null;
  private saveInProgress = false;
  private convexMutationFn: ((mutation: any, args: any) => Promise<any>) | null = null;

  /**
   * Set the Convex mutation function
   */
  setConvexMutation(mutationFn: (mutation: any, args: any) => Promise<any>) {
    this.convexMutationFn = mutationFn;
  }

  /**
   * Save funnel to Convex
   */
  async saveFunnel(
    funnel: Funnel,
    isAutoSave = false,
    convexMutation?: (mutation: any, args: any) => Promise<any>
  ): Promise<SaveResult> {
    if (this.saveInProgress) {
      return {
        success: false,
        message: 'Save already in progress',
      };
    }

    // Use provided mutation or the stored one
    const mutationFn = convexMutation || this.convexMutationFn;
    
    if (!mutationFn) {
      // Fallback to localStorage if no mutation function provided
      return this.saveFunnelToLocalStorage(funnel, isAutoSave);
    }

    this.saveInProgress = true;

    try {
      // For now, we'll save the first step's sections to the page tree
      // In the future, this should be more sophisticated
      if (funnel.steps.length === 0) {
        throw new Error('Funnel has no steps');
      }

      const currentStep = funnel.steps[0];
      const stepId = currentStep.id as Id<'funnelSteps'>;

      // Convert sections to tree format
      const tree = {
        sections: currentStep.sections || [],
      };

      // Save to Convex using the savePage mutation
      await mutationFn(api.funnels.savePage, {
        stepId,
        viewport: 'desktop', // Default to desktop for now
        tree,
        published: false,
      });

      this.lastSaveTime = new Date();
      this.saveInProgress = false;

      if (!isAutoSave) {
        toast.success('Funnel saved successfully!', {
          description: `Saved at ${this.lastSaveTime.toLocaleTimeString()}`,
        });
      }

      return {
        success: true,
        message: 'Funnel saved successfully',
        timestamp: this.lastSaveTime,
      };
    } catch (error) {
      this.saveInProgress = false;
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      
      if (!isAutoSave) {
        toast.error('Failed to save funnel', {
          description: errorMessage,
        });
      }

      return {
        success: false,
        message: 'Failed to save funnel',
        error: errorMessage,
      };
    }
  }

  /**
   * Load funnel from Convex
   */
  async loadFunnel(funnelId: string, stepId?: string): Promise<Funnel | null> {
    try {
      // This would need to be implemented with a Convex query
      // For now, return null as this needs to be handled by the route
      toast.error('Load funnel not yet implemented');
      return null;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      toast.error('Failed to load funnel', {
        description: errorMessage,
      });
      return null;
    }
  }

  /**
   * Start autosave
   */
  startAutoSave(
    getFunnel: () => Funnel,
    interval = 30000,
    convexMutation?: (mutation: any, args: any) => Promise<any>
  ) {
    this.autoSaveDelay = interval;
    
    // Clear existing interval
    if (this.autoSaveInterval) {
      clearInterval(this.autoSaveInterval);
    }

    // Start new interval
    this.autoSaveInterval = setInterval(async () => {
      const funnel = getFunnel();
      const result = await this.saveFunnel(funnel, true, convexMutation);
      
      if (result.success) {
        console.log('Autosave completed:', result.timestamp);
      } else {
        console.error('Autosave failed:', result.error);
      }
    }, interval);

    console.log(`Autosave started (every ${interval / 1000}s)`);
  }

  /**
   * Stop autosave
   */
  stopAutoSave() {
    if (this.autoSaveInterval) {
      clearInterval(this.autoSaveInterval);
      this.autoSaveInterval = null;
      console.log('Autosave stopped');
    }
  }

  /**
   * Get last save time
   */
  getLastSaveTime(): Date | null {
    return this.lastSaveTime;
  }

  /**
   * Check if save is in progress
   */
  isSaving(): boolean {
    return this.saveInProgress;
  }

  /**
   * Save to localStorage (fallback)
   */
  private async saveFunnelToLocalStorage(funnel: Funnel, isAutoSave: boolean): Promise<SaveResult> {
    try {
      const saveData = {
        id: funnel.id,
        name: funnel.name,
        steps: funnel.steps,
        lastSaved: new Date(),
        version: 1,
      };

      if (typeof window !== 'undefined') {
        localStorage.setItem(`funnel_${funnel.id}`, JSON.stringify(saveData));
      }
      this.lastSaveTime = new Date();
      this.saveInProgress = false;

      if (!isAutoSave) {
        toast.success('Funnel saved to local storage!', {
          description: `Saved at ${this.lastSaveTime.toLocaleTimeString()}`,
        });
      }

      return {
        success: true,
        message: 'Funnel saved successfully',
        timestamp: this.lastSaveTime,
      };
    } catch (error) {
      this.saveInProgress = false;
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      
      if (!isAutoSave) {
        toast.error('Failed to save funnel', {
          description: errorMessage,
        });
      }

      return {
        success: false,
        message: 'Failed to save funnel',
        error: errorMessage,
      };
    }
  }

  /**
   * Delete funnel
   */
  async deleteFunnel(
    funnelId: string,
    convexMutation?: (mutation: any, args: any) => Promise<any>
  ): Promise<boolean> {
    try {
      if (!convexMutation) {
        // Fallback to localStorage
        if (typeof window !== 'undefined') {
          localStorage.removeItem(`funnel_${funnelId}`);
        }
        toast.success('Funnel deleted from local storage');
        return true;
      }

      await convexMutation(api.funnels.deleteFunnel, {
        funnelId: funnelId as Id<'funnels'>,
      });
      
      toast.success('Funnel deleted successfully');
      return true;
    } catch (error) {
      toast.error('Failed to delete funnel');
      return false;
    }
  }

  /**
   * Duplicate funnel
   */
  async duplicateFunnel(
    funnel: Funnel,
    newName?: string,
    convexMutation?: (mutation: any, args: any) => Promise<any>
  ): Promise<Funnel | null> {
    try {
      if (!convexMutation) {
        // Fallback: duplicate in localStorage
        const duplicated: Funnel = {
          ...funnel,
          id: `funnel-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          name: newName || `${funnel.name} (Copy)`,
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        await this.saveFunnelToLocalStorage(duplicated, false);
        toast.success('Funnel duplicated successfully!');
        return duplicated;
      }

      const newFunnelId = await convexMutation(api.funnels.duplicate, {
        funnelId: funnel.id as Id<'funnels'>,
      });

      // Update the name if provided
      if (newName) {
        await convexMutation(api.funnels.update, {
          funnelId: newFunnelId,
          name: newName,
        });
      }

      toast.success('Funnel duplicated successfully!');
      
      // Return a new funnel object (would need to fetch from Convex)
      return {
        ...funnel,
        id: newFunnelId,
        name: newName || `${funnel.name} (Copy)`,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
    } catch (error) {
      toast.error('Failed to duplicate funnel');
      return null;
    }
  }

  /**
   * Export funnel as JSON
   */
  exportFunnel(funnel: Funnel) {
    if (typeof window === 'undefined' || typeof document === 'undefined') {
      return;
    }

    try {
      const data = JSON.stringify(funnel, null, 2);
      const blob = new Blob([data], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      
      const a = document.createElement('a');
      a.href = url;
      a.download = `${funnel.name.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_${Date.now()}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast.success('Funnel exported successfully!');
    } catch (error) {
      toast.error('Failed to export funnel');
    }
  }

  /**
   * Import funnel from JSON
   */
  async importFunnel(file: File): Promise<Funnel | null> {
    try {
      const text = await file.text();
      const funnel: Funnel = JSON.parse(text);
      
      // Generate new ID to avoid conflicts
      funnel.id = `funnel-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      funnel.createdAt = new Date();
      funnel.updatedAt = new Date();

      await this.saveFunnel(funnel);
      toast.success('Funnel imported successfully!');
      return funnel;
    } catch (error) {
      toast.error('Failed to import funnel', {
        description: 'Invalid file format',
      });
      return null;
    }
  }

  /**
   * Check for unsaved changes
   */
  hasUnsavedChanges(funnel: Funnel): boolean {
    // This would need to compare with the last saved state
    // For now, always return false as we don't have a saved state to compare
    return false;
  }
}

// Export singleton instance
export const funnelSaveService = new FunnelSaveService();






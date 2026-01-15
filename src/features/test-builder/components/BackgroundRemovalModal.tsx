"use client";

import { Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

export interface BackgroundRemovalModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void | Promise<void>;
  onSkip: () => void;
  isProcessing?: boolean;
  error?: string | null;
}

export function BackgroundRemovalModal({
  open,
  onOpenChange,
  onConfirm,
  onSkip,
  isProcessing = false,
  error = null,
}: BackgroundRemovalModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="text-primary" size={20} />
            Remove Background?
          </DialogTitle>
          <DialogDescription>
            Would you like to automatically remove the background from this image? 
            This will make it transparent and look more professional.
          </DialogDescription>
        </DialogHeader>

        {error && (
          <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
            <p className="font-medium">Background removal failed</p>
            <p className="mt-1 text-xs">{error}</p>
          </div>
        )}

        <DialogFooter className="gap-2">
          <Button
            variant="outline"
            onClick={onSkip}
            disabled={isProcessing}
          >
            No, Keep Background
          </Button>
          <Button
            onClick={onConfirm}
            disabled={isProcessing}
            className="gap-2"
          >
            {isProcessing ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Removing...
              </>
            ) : (
              <>
                <Sparkles size={16} />
                Yes, Remove Background
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

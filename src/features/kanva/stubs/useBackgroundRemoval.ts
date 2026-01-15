// Stub for background removal hook - to be implemented later
import { useState, useCallback } from 'react';

export interface BackgroundRemovalOptions {
  onSuccess?: (processedImageSrc: string) => void;
  onError?: (error: Error) => void;
}

export function useBackgroundRemoval(options?: BackgroundRemovalOptions) {
  const [isOpen, setIsOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [pendingImageSrc, setPendingImageSrc] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const showModal = useCallback((imageSrc: string) => {
    setPendingImageSrc(imageSrc);
    setIsOpen(true);
    setError(null);
  }, []);

  const closeModal = useCallback(() => {
    setIsOpen(false);
    setPendingImageSrc(null);
    setError(null);
    setIsProcessing(false);
  }, []);

  const processImage = useCallback(async (): Promise<void> => {
    if (!pendingImageSrc) return;
    setIsProcessing(true);
    setError(null);
    // Stub implementation - just use original image
    if (options?.onSuccess) {
      options.onSuccess(pendingImageSrc);
    }
    closeModal();
  }, [pendingImageSrc, options, closeModal]);

  const skipRemoval = useCallback(() => {
    if (pendingImageSrc && options?.onSuccess) {
      options.onSuccess(pendingImageSrc);
    }
    closeModal();
  }, [pendingImageSrc, options, closeModal]);

  return {
    isOpen,
    isProcessing,
    error,
    pendingImageSrc,
    showModal,
    closeModal,
    processImage,
    skipRemoval,
  };
}






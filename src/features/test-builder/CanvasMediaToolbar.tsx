"use client";



import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Image as ImageIcon,
  FileVideo,
  Link as LinkIcon,
  Trash2,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Crop,
  Video,
} from 'lucide-react';
import { useTestBuilderV2Store } from './store';
import { ImageLibraryModal } from './ImageLibraryModal';
import { ImageCropModal } from './ImageCropModal';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import {
  normalizeAlignment,
  getToolbarActions,
  handleToolbarAction,
  type ToolbarAction,
} from '@/src/lib/utils/media-toolbar-utils';

interface CanvasMediaToolbarProps {
  elementId: string;
  elementType: 'image' | 'gif' | 'video';
  elementProps: Record<string, any>;
}

export function CanvasMediaToolbar({ elementId, elementType, elementProps: initialProps }: CanvasMediaToolbarProps) {
  const { updateElement, deleteElement, selectedElementId, sections } = useTestBuilderV2Store();
  const [coords, setCoords] = useState<{ top: number; left: number } | null>(null);
  const [showImageLibrary, setShowImageLibrary] = useState(false);
  const [showCropModal, setShowCropModal] = useState(false);
  const [showLinkInput, setShowLinkInput] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const linkInputRef = useRef<HTMLInputElement>(null);

  // Get current element props from store (always up-to-date)
  const currentElement = sections
    .flatMap(s => s.rows)
    .flatMap(r => r.columns)
    .flatMap(c => c.elements)
    .find(e => e.id === elementId);
  
  const elementProps = currentElement?.props || initialProps;
  const [linkUrl, setLinkUrl] = useState(elementProps.clickUrl || '');

  // Sync link URL with element props
  useEffect(() => {
    setLinkUrl(elementProps.clickUrl || '');
  }, [elementProps.clickUrl]);

  // Focus link input when shown
  useEffect(() => {
    if (showLinkInput && linkInputRef.current) {
      linkInputRef.current.focus();
    }
  }, [showLinkInput]);

  // Update toolbar position when element is selected
  useEffect(() => {
    if (selectedElementId !== elementId) {
      setCoords(null);
      return;
    }

    const updatePosition = () => {
      const element = document.querySelector(`[data-element-id="${elementId}"]`);
      if (element) {
        const rect = element.getBoundingClientRect();
        setCoords({
          top: rect.top + window.scrollY - 50,
          left: rect.left + rect.width / 2 + window.scrollX,
        });
      }
    };

    // Initial position
    updatePosition();

    // Update on scroll/resize
    window.addEventListener('scroll', updatePosition, true);
    window.addEventListener('resize', updatePosition);

    return () => {
      window.removeEventListener('scroll', updatePosition, true);
      window.removeEventListener('resize', updatePosition);
    };
  }, [elementId, selectedElementId]);

  // Hide when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        // Don't hide if clicking on the element itself
        const element = document.querySelector(`[data-element-id="${elementId}"]`);
        if (element && element.contains(e.target as Node)) {
          return;
        }
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [elementId]);

  // Get current alignment using unified utility
  const currentAlignment = normalizeAlignment(elementProps.alignment || elementProps.align || 'left');
  const isClickable = elementProps.clickable || false;

  // Debug logging
  useEffect(() => {
    console.log('🔧 Toolbar alignment sync:', {
      elementId,
      elementType,
      elementProps,
      currentAlignment,
      align: elementProps.align,
      alignment: elementProps.alignment,
    });
  }, [elementId, elementType, elementProps, currentAlignment]);

  if (!coords || selectedElementId !== elementId) return null;

  // Get toolbar actions using unified utility
  const toolbarActions = getToolbarActions(elementType, currentAlignment, isClickable);

  // Map actions to icons
  const actionIcons: Record<ToolbarAction, React.ComponentType<any>> = {
    replace: elementType === 'image' ? ImageIcon : elementType === 'gif' ? FileVideo : Video,
    link: LinkIcon,
    crop: Crop,
    'align-left': AlignLeft,
    'align-center': AlignCenter,
    'align-right': AlignRight,
    delete: Trash2,
  };

  const handleAction = (action: ToolbarAction) => {
    if (action === 'replace') {
      setShowImageLibrary(true);
      return;
    }
    handleToolbarAction(
      action,
      elementId,
      updateElement,
      deleteElement,
      {
        onReplace: () => setShowImageLibrary(true),
        onLink: () => {
          // Toggle link input
          if (isClickable && !showLinkInput) {
            setShowLinkInput(true);
          } else if (!isClickable) {
            // Enable clickable and show input
            updateElement(elementId, { clickable: true });
            setShowLinkInput(true);
          } else {
            setShowLinkInput(!showLinkInput);
          }
        },
        onCrop: () => {
          // Only show crop for images
          if (elementType === 'image') {
            setShowCropModal(true);
          }
        },
      }
    );
  };

  const handleImageSelect = (imageUrl: string) => {
    updateElement(elementId, { url: imageUrl });
    setShowImageLibrary(false);
  };

  const handleCropComplete = (croppedImageUrl: string) => {
    updateElement(elementId, { url: croppedImageUrl });
    setShowCropModal(false);
  };

  const handleLinkSave = () => {
    if (linkUrl.trim()) {
      updateElement(elementId, { 
        clickable: true, 
        clickUrl: linkUrl.trim() 
      });
    } else {
      // Remove link if URL is empty
      updateElement(elementId, { 
        clickable: false, 
        clickUrl: '' 
      });
    }
    setShowLinkInput(false);
  };

  const handleLinkRemove = () => {
    updateElement(elementId, { 
      clickable: false, 
      clickUrl: '' 
    });
    setLinkUrl('');
    setShowLinkInput(false);
  };

  return (
    <>
      <AnimatePresence>
        {coords && (
          <motion.div
            ref={ref}
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.15 }}
            className="fixed z-[99999] flex flex-col items-center gap-2"
            style={{
              top: `${coords.top}px`,
              left: `${coords.left}px`,
              transform: 'translateX(-50%)',
            }}
          >
            {/* Main Toolbar */}
            <div className="flex items-center gap-1 rounded-full bg-white dark:bg-gray-800 border-2 border-orange-500 shadow-xl px-2 py-1">
              {toolbarActions.map(({ action, label, active }: { action: ToolbarAction; label: string; active: boolean }) => {
                const Icon = actionIcons[action];
                return (
                  <button
                    key={action}
                    onClick={() => handleAction(action as ToolbarAction)}
                    title={label}
                    className={cn(
                      "p-1.5 rounded-full transition",
                      active
                        ? "bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400"
                        : "hover:bg-gray-100 dark:hover:bg-gray-700"
                    )}
                  >
                    <Icon size={16} />
                  </button>
                );
              })}
            </div>

            {/* Link Input Popup */}
            {showLinkInput && (
              <motion.div
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                className="bg-white dark:bg-gray-800 border-2 border-orange-500 rounded-lg shadow-xl p-3 min-w-[300px]"
              >
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                    Link URL
                  </label>
                  <Input
                    ref={linkInputRef}
                    value={linkUrl}
                    onChange={(e) => setLinkUrl(e.target.value)}
                    placeholder="https://example.com"
                    type="url"
                    className="text-sm"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        handleLinkSave();
                      } else if (e.key === 'Escape') {
                        setShowLinkInput(false);
                      }
                    }}
                  />
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      onClick={handleLinkSave}
                      className="flex-1 text-xs"
                    >
                      Save
                    </Button>
                    {isClickable && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={handleLinkRemove}
                        className="text-xs"
                      >
                        Remove
                      </Button>
                    )}
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setShowLinkInput(false)}
                      className="text-xs"
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Image Library Modal */}
      <ImageLibraryModal
        isOpen={showImageLibrary}
        onClose={() => setShowImageLibrary(false)}
        onSelectImage={handleImageSelect}
      />

      {/* Image Crop Modal - Only for images */}
      {elementType === 'image' && (
        <ImageCropModal
          isOpen={showCropModal}
          onClose={() => setShowCropModal(false)}
          imageUrl={elementProps.url || ''}
          onCropComplete={handleCropComplete}
        />
      )}
    </>
  );
}


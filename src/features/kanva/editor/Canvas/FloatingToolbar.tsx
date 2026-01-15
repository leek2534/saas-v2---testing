'use client';

import { useEditorStore } from '../../lib/editor/store';
import { 
  Trash2, 
  Copy, 
  Layers,
  FlipHorizontal,
  FlipVertical,
  Group,
  Ungroup,
  Sparkles,
  Lock,
  Unlock,
  MoreHorizontal,
  AlignCenterHorizontal,
  AlignCenterVertical,
  AlignStartHorizontal,
  AlignEndHorizontal,
  AlignStartVertical,
  AlignEndVertical,
  ChevronUp,
  ChevronDown,
  ChevronsUp,
  ChevronsDown,
  GalleryHorizontal,
  GalleryVertical,
} from 'lucide-react';
import { useEffect, useState, useRef } from 'react';
import { useBackgroundRemoval } from "../../stubs/useBackgroundRemoval";
import { BackgroundRemovalModal } from "../../stubs/BackgroundRemovalModal";

interface FloatingToolbarProps {
  zoom: number;
  pan: { x: number; y: number };
  containerRef: React.RefObject<HTMLDivElement>;
  canvasRef: React.RefObject<HTMLDivElement>;
}

export function FloatingToolbar({ zoom, pan, containerRef, canvasRef }: FloatingToolbarProps) {
  const selectedIds = useEditorStore((s) => s.selectedIds);
  const elements = useEditorStore((s) => s.elements);
  const canvas = useEditorStore((s) => s.canvas);
  const deleteElements = useEditorStore((s) => s.deleteElements);
  const duplicateElements = useEditorStore((s) => s.duplicateElements);
  const bringToFront = useEditorStore((s) => s.bringToFront);
  const sendToBack = useEditorStore((s) => s.sendToBack);
  const bringForward = useEditorStore((s) => s.bringForward);
  const sendBackward = useEditorStore((s) => s.sendBackward);
  const updateElement = useEditorStore((s) => s.updateElement);
  const pushHistory = useEditorStore((s) => s.pushHistory);
  const getStateSnapshot = useEditorStore((s) => s.getStateSnapshot);
  
  const [screenPosition, setScreenPosition] = useState<{ x: number; y: number; visible: boolean }>({ 
    x: 0, y: 0, visible: false 
  });
  const [showLayerMenu, setShowLayerMenu] = useState(false);
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const [showAlignMenu, setShowAlignMenu] = useState(false);
  const [activeTooltip, setActiveTooltip] = useState<string | null>(null);
  const toolbarRef = useRef<HTMLDivElement>(null);
  const tooltipTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  // Get selected elements info
  const selectedElements = elements.filter(el => selectedIds.includes(el.id));
  const hasImageSelected = selectedElements.some(el => el.type === 'image');
  const selectedImage = selectedElements.find(el => el.type === 'image');
  const isLocked = selectedElements.some(el => (el as any).metadata?.lock);
  
  // Check if elements are grouped
  const groupIds = [...new Set(selectedElements.map(el => (el as any).groupId).filter(Boolean))];
  const hasGroupedElements = groupIds.length > 0;
  const canGroup = selectedIds.length > 1;
  
  // Background removal
  const bgRemoval = useBackgroundRemoval({
    onSuccess: (processedSrc) => {
      if (selectedImage) {
        updateElement(selectedImage.id, { src: processedSrc });
        pushHistory(getStateSnapshot());
      }
    },
  });
  
  // Calculate toolbar position in screen space
  useEffect(() => {
    if (selectedIds.length === 0 || !containerRef.current || !canvasRef.current) {
      setScreenPosition({ x: 0, y: 0, visible: false });
      return;
    }
    
    const selectedEls = elements.filter(el => selectedIds.includes(el.id));
    if (selectedEls.length === 0) {
      setScreenPosition({ x: 0, y: 0, visible: false });
      return;
    }
    
    // Calculate bounding box of all selected elements (in canvas space)
    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
    
    selectedEls.forEach(el => {
      const width = el.width || 100;
      const height = el.height || 100;
      minX = Math.min(minX, el.x);
      minY = Math.min(minY, el.y);
      maxX = Math.max(maxX, el.x + width);
      maxY = Math.max(maxY, el.y + height);
    });
    
    // Get canvas element position
    const canvasRect = canvasRef.current.getBoundingClientRect();
    const containerRect = containerRef.current.getBoundingClientRect();
    
    // Convert canvas coordinates to screen coordinates
    // The canvas element is already transformed, so we use its bounding rect
    const canvasScreenLeft = canvasRect.left - containerRect.left;
    const canvasScreenTop = canvasRect.top - containerRect.top;
    
    // Calculate center X and top Y in screen space
    const centerX = canvasScreenLeft + ((minX + maxX) / 2) * zoom;
    const topY = canvasScreenTop + minY * zoom;
    
    // Position toolbar above selection with space for rotation handle (48px above)
    const toolbarY = topY - 56;
    
    // Clamp to container bounds
    const toolbarWidth = toolbarRef.current?.offsetWidth || 300;
    const clampedX = Math.max(toolbarWidth / 2 + 8, Math.min(containerRect.width - toolbarWidth / 2 - 8, centerX));
    const clampedY = Math.max(8, toolbarY);
    
    setScreenPosition({
      x: clampedX,
      y: clampedY,
      visible: true,
    });
  }, [selectedIds, elements, zoom, pan, containerRef, canvasRef]);
  
  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (toolbarRef.current && !toolbarRef.current.contains(e.target as Node)) {
        setShowLayerMenu(false);
        setShowMoreMenu(false);
        setShowAlignMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  
  if (!screenPosition.visible) return null;
  
  // Action handlers
  const handleDelete = () => deleteElements(selectedIds);
  const handleDuplicate = () => duplicateElements(selectedIds);
  const handleBringToFront = () => { selectedIds.forEach(id => bringToFront(id)); setShowLayerMenu(false); };
  const handleSendToBack = () => { selectedIds.forEach(id => sendToBack(id)); setShowLayerMenu(false); };
  const handleBringForward = () => { selectedIds.forEach(id => bringForward(id)); setShowLayerMenu(false); };
  const handleSendBackward = () => { selectedIds.forEach(id => sendBackward(id)); setShowLayerMenu(false); };
  
  const handleToggleLock = () => {
    selectedElements.forEach(el => {
      updateElement(el.id, {
        metadata: { ...(el as any).metadata, lock: !(el as any).metadata?.lock },
      });
    });
    pushHistory(getStateSnapshot());
    setShowMoreMenu(false);
  };
  
  const handleFlipHorizontal = () => {
    selectedElements.forEach(el => {
      const currentScaleX = (el as any).scaleX ?? 1;
      updateElement(el.id, { scaleX: currentScaleX * -1 } as any);
    });
    pushHistory(getStateSnapshot());
  };
  
  const handleFlipVertical = () => {
    selectedElements.forEach(el => {
      const currentScaleY = (el as any).scaleY ?? 1;
      updateElement(el.id, { scaleY: currentScaleY * -1 } as any);
    });
    pushHistory(getStateSnapshot());
  };
  
  const handleGroup = () => {
    if (selectedIds.length < 2) return;
    const groupId = `group-${Date.now()}`;
    selectedElements.forEach(el => updateElement(el.id, { groupId }));
    pushHistory(getStateSnapshot());
    setShowMoreMenu(false);
  };
  
  const handleUngroup = () => {
    selectedElements.forEach(el => updateElement(el.id, { groupId: undefined }));
    pushHistory(getStateSnapshot());
    setShowMoreMenu(false);
  };
  
  const handleAlignCenter = () => {
    const centerX = canvas.width / 2;
    selectedElements.forEach(el => {
      const width = el.width || 100;
      updateElement(el.id, { x: centerX - width / 2 });
    });
    pushHistory(getStateSnapshot());
  };
  
  const handleAlignMiddle = () => {
    const centerY = canvas.height / 2;
    selectedElements.forEach(el => {
      const height = el.height || 100;
      updateElement(el.id, { y: centerY - height / 2 });
    });
    pushHistory(getStateSnapshot());
  };
  
  const handleAlignLeft = () => {
    if (selectedElements.length <= 1) {
      // Align to canvas
      selectedElements.forEach(el => updateElement(el.id, { x: 0 }));
    } else {
      // Align to leftmost element
      const minX = Math.min(...selectedElements.map(el => el.x));
      selectedElements.forEach(el => updateElement(el.id, { x: minX }));
    }
    pushHistory(getStateSnapshot());
  };
  
  const handleAlignRight = () => {
    if (selectedElements.length <= 1) {
      // Align to canvas
      selectedElements.forEach(el => {
        const width = el.width || 100;
        updateElement(el.id, { x: canvas.width - width });
      });
    } else {
      // Align to rightmost element
      const maxX = Math.max(...selectedElements.map(el => el.x + (el.width || 100)));
      selectedElements.forEach(el => {
        const width = el.width || 100;
        updateElement(el.id, { x: maxX - width });
      });
    }
    pushHistory(getStateSnapshot());
  };
  
  const handleAlignTop = () => {
    if (selectedElements.length <= 1) {
      selectedElements.forEach(el => updateElement(el.id, { y: 0 }));
    } else {
      const minY = Math.min(...selectedElements.map(el => el.y));
      selectedElements.forEach(el => updateElement(el.id, { y: minY }));
    }
    pushHistory(getStateSnapshot());
  };
  
  const handleAlignBottom = () => {
    if (selectedElements.length <= 1) {
      selectedElements.forEach(el => {
        const height = el.height || 100;
        updateElement(el.id, { y: canvas.height - height });
      });
    } else {
      const maxY = Math.max(...selectedElements.map(el => el.y + (el.height || 100)));
      selectedElements.forEach(el => {
        const height = el.height || 100;
        updateElement(el.id, { y: maxY - height });
      });
    }
    pushHistory(getStateSnapshot());
  };
  
  // Distribution handlers (only work with 3+ elements)
  const handleDistributeHorizontal = () => {
    if (selectedElements.length < 3) return;
    
    // Sort by x position
    const sorted = [...selectedElements].sort((a, b) => a.x - b.x);
    const first = sorted[0];
    const last = sorted[sorted.length - 1];
    
    // Calculate total width and spacing
    const totalWidth = (last.x + (last.width || 100)) - first.x;
    const elementsWidth = sorted.reduce((sum, el) => sum + (el.width || 100), 0);
    const spacing = (totalWidth - elementsWidth) / (sorted.length - 1);
    
    // Distribute elements
    let currentX = first.x;
    sorted.forEach((el, i) => {
      if (i > 0) {
        updateElement(el.id, { x: currentX });
      }
      currentX += (el.width || 100) + spacing;
    });
    
    pushHistory(getStateSnapshot());
  };
  
  const handleDistributeVertical = () => {
    if (selectedElements.length < 3) return;
    
    // Sort by y position
    const sorted = [...selectedElements].sort((a, b) => a.y - b.y);
    const first = sorted[0];
    const last = sorted[sorted.length - 1];
    
    // Calculate total height and spacing
    const totalHeight = (last.y + (last.height || 100)) - first.y;
    const elementsHeight = sorted.reduce((sum, el) => sum + (el.height || 100), 0);
    const spacing = (totalHeight - elementsHeight) / (sorted.length - 1);
    
    // Distribute elements
    let currentY = first.y;
    sorted.forEach((el, i) => {
      if (i > 0) {
        updateElement(el.id, { y: currentY });
      }
      currentY += (el.height || 100) + spacing;
    });
    
    pushHistory(getStateSnapshot());
  };
  
  const handleRemoveBackground = () => {
    if (selectedImage && 'src' in selectedImage) {
      bgRemoval.showModal((selectedImage as any).src);
    }
  };
  
  // Tooltip helpers
  const showTooltip = (id: string) => {
    if (tooltipTimeoutRef.current) clearTimeout(tooltipTimeoutRef.current);
    tooltipTimeoutRef.current = setTimeout(() => setActiveTooltip(id), 400);
  };
  
  const hideTooltip = () => {
    if (tooltipTimeoutRef.current) clearTimeout(tooltipTimeoutRef.current);
    setActiveTooltip(null);
  };
  
  // Toolbar button component with tooltip
  const ToolbarButton = ({ 
    onClick, 
    id,
    label,
    shortcut,
    description,
    children, 
    variant = 'default',
    className = '',
    disabled = false,
  }: { 
    onClick: () => void; 
    id: string;
    label: string;
    shortcut?: string;
    description?: string;
    children: React.ReactNode;
    variant?: 'default' | 'danger' | 'primary';
    className?: string;
    disabled?: boolean;
  }) => {
    const variantClasses = {
      default: 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300',
      danger: 'hover:bg-red-50 dark:hover:bg-red-900/30 hover:text-red-600 text-gray-700 dark:text-gray-300',
      primary: 'hover:bg-blue-50 dark:hover:bg-blue-900/30 hover:text-blue-600 text-gray-700 dark:text-gray-300',
    };
    
    return (
      <div className="relative">
        <button
          onClick={onClick}
          disabled={disabled}
          onMouseEnter={() => showTooltip(id)}
          onMouseLeave={hideTooltip}
          className={`h-8 w-8 flex items-center justify-center rounded-md transition-colors ${variantClasses[variant]} ${className} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {children}
        </button>
        
        {/* Tooltip */}
        {activeTooltip === id && (
          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2.5 py-1.5 bg-gray-900 dark:bg-gray-700 text-white text-xs rounded-lg shadow-lg whitespace-nowrap z-[60] pointer-events-none">
            <div className="font-medium">{label}</div>
            {shortcut && (
              <div className="text-gray-400 text-[10px] mt-0.5">{shortcut}</div>
            )}
            {description && (
              <div className="text-gray-300 text-[10px] mt-0.5 max-w-[150px] whitespace-normal">{description}</div>
            )}
            {/* Arrow */}
            <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-900 dark:border-t-gray-700" />
          </div>
        )}
      </div>
    );
  };
  
  const Divider = () => <div className="w-px h-5 bg-gray-200 dark:bg-gray-600 mx-0.5" />;
  
  return (
    <>
      <div
        ref={toolbarRef}
        className="absolute z-50 flex items-center gap-0.5 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 px-1 py-1"
        style={{
          left: `${screenPosition.x}px`,
          top: `${screenPosition.y}px`,
          transform: 'translateX(-50%)',
          pointerEvents: 'auto',
        }}
        onMouseDown={(e) => e.stopPropagation()}
      >
        {/* Duplicate - Most common action */}
        <ToolbarButton 
          id="duplicate"
          onClick={handleDuplicate} 
          label="Duplicate"
          shortcut="Ctrl+D"
          description="Create a copy of the selected element"
        >
          <Copy size={16} />
        </ToolbarButton>
        
        {/* Delete */}
        <ToolbarButton 
          id="delete"
          onClick={handleDelete} 
          label="Delete"
          shortcut="Delete"
          description="Remove the selected element"
          variant="danger"
        >
          <Trash2 size={16} />
        </ToolbarButton>
        
        <Divider />
        
        {/* Layer dropdown */}
        <div className="relative">
          <ToolbarButton 
            id="layers"
            onClick={() => { setShowLayerMenu(!showLayerMenu); setShowMoreMenu(false); }} 
            label="Layer Order"
            description="Change stacking order of elements"
            className={showLayerMenu ? 'bg-gray-100 dark:bg-gray-700' : ''}
          >
            <Layers size={16} />
          </ToolbarButton>
          
          {showLayerMenu && (
            <div className="absolute top-full left-1/2 -translate-x-1/2 mt-1 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 py-1 min-w-[160px] z-50">
              <button 
                onClick={handleBringToFront}
                className="w-full px-3 py-1.5 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2"
              >
                <ChevronsUp size={14} /> 
                <span>Bring to front</span>
                <span className="ml-auto text-xs text-gray-400">⌘]</span>
              </button>
              <button 
                onClick={handleBringForward}
                className="w-full px-3 py-1.5 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2"
              >
                <ChevronUp size={14} /> 
                <span>Bring forward</span>
                <span className="ml-auto text-xs text-gray-400">]</span>
              </button>
              <button 
                onClick={handleSendBackward}
                className="w-full px-3 py-1.5 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2"
              >
                <ChevronDown size={14} /> 
                <span>Send backward</span>
                <span className="ml-auto text-xs text-gray-400">[</span>
              </button>
              <button 
                onClick={handleSendToBack}
                className="w-full px-3 py-1.5 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2"
              >
                <ChevronsDown size={14} /> 
                <span>Send to back</span>
                <span className="ml-auto text-xs text-gray-400">⌘[</span>
              </button>
            </div>
          )}
        </div>
        
        {/* Flip Horizontal */}
        <ToolbarButton 
          id="flip-h"
          onClick={handleFlipHorizontal} 
          label="Flip Horizontal"
          description="Mirror the element horizontally"
        >
          <FlipHorizontal size={16} />
        </ToolbarButton>
        
        {/* Flip Vertical */}
        <ToolbarButton 
          id="flip-v"
          onClick={handleFlipVertical} 
          label="Flip Vertical"
          description="Mirror the element vertically"
        >
          <FlipVertical size={16} />
        </ToolbarButton>
        
        <Divider />
        
        {/* Alignment dropdown */}
        <div className="relative">
          <ToolbarButton 
            id="align"
            onClick={() => { setShowAlignMenu(!showAlignMenu); setShowLayerMenu(false); setShowMoreMenu(false); }} 
            label="Align & Distribute"
            description="Alignment and distribution options"
            className={showAlignMenu ? 'bg-gray-100 dark:bg-gray-700' : ''}
          >
            <AlignCenterHorizontal size={16} />
          </ToolbarButton>
          
          {showAlignMenu && (
            <div className="absolute top-full left-1/2 -translate-x-1/2 mt-1 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 py-1 min-w-[180px] z-50">
              {/* Alignment section */}
              <div className="px-3 py-1 text-[10px] font-medium text-gray-400 uppercase tracking-wider">Align</div>
              <div className="grid grid-cols-3 gap-0.5 px-2 pb-2">
                <button 
                  onClick={() => { handleAlignLeft(); setShowAlignMenu(false); }}
                  className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded flex items-center justify-center"
                  title="Align Left"
                >
                  <AlignStartHorizontal size={16} />
                </button>
                <button 
                  onClick={() => { handleAlignCenter(); setShowAlignMenu(false); }}
                  className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded flex items-center justify-center"
                  title="Align Center"
                >
                  <AlignCenterHorizontal size={16} />
                </button>
                <button 
                  onClick={() => { handleAlignRight(); setShowAlignMenu(false); }}
                  className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded flex items-center justify-center"
                  title="Align Right"
                >
                  <AlignEndHorizontal size={16} />
                </button>
                <button 
                  onClick={() => { handleAlignTop(); setShowAlignMenu(false); }}
                  className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded flex items-center justify-center"
                  title="Align Top"
                >
                  <AlignStartVertical size={16} />
                </button>
                <button 
                  onClick={() => { handleAlignMiddle(); setShowAlignMenu(false); }}
                  className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded flex items-center justify-center"
                  title="Align Middle"
                >
                  <AlignCenterVertical size={16} />
                </button>
                <button 
                  onClick={() => { handleAlignBottom(); setShowAlignMenu(false); }}
                  className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded flex items-center justify-center"
                  title="Align Bottom"
                >
                  <AlignEndVertical size={16} />
                </button>
              </div>
              
              {/* Distribution section - only show for 3+ elements */}
              {selectedIds.length >= 3 && (
                <>
                  <div className="h-px bg-gray-200 dark:bg-gray-600 my-1" />
                  <div className="px-3 py-1 text-[10px] font-medium text-gray-400 uppercase tracking-wider">Distribute</div>
                  <div className="grid grid-cols-2 gap-0.5 px-2 pb-2">
                    <button 
                      onClick={() => { handleDistributeHorizontal(); setShowAlignMenu(false); }}
                      className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded flex items-center justify-center gap-1.5 text-xs"
                      title="Distribute Horizontal Spacing"
                    >
                      <GalleryHorizontal size={16} />
                      <span>Horizontal</span>
                    </button>
                    <button 
                      onClick={() => { handleDistributeVertical(); setShowAlignMenu(false); }}
                      className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded flex items-center justify-center gap-1.5 text-xs"
                      title="Distribute Vertical Spacing"
                    >
                      <GalleryVertical size={16} />
                      <span>Vertical</span>
                    </button>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
        
        {/* Lock/Unlock */}
        <ToolbarButton 
          id="lock"
          onClick={handleToggleLock} 
          label={isLocked ? "Unlock" : "Lock"}
          description={isLocked ? "Allow editing this element" : "Prevent accidental changes"}
          variant={isLocked ? 'primary' : 'default'}
        >
          {isLocked ? <Unlock size={16} /> : <Lock size={16} />}
        </ToolbarButton>
        
        {/* Group/Ungroup - show when multiple selected */}
        {canGroup && (
          <>
            <Divider />
            <ToolbarButton 
              id="group"
              onClick={hasGroupedElements ? handleUngroup : handleGroup} 
              label={hasGroupedElements ? "Ungroup" : "Group"}
              shortcut={hasGroupedElements ? "Ctrl+Shift+G" : "Ctrl+G"}
              description={hasGroupedElements ? "Separate grouped elements" : "Combine elements into a group"}
              variant="primary"
            >
              {hasGroupedElements ? <Ungroup size={16} /> : <Group size={16} />}
            </ToolbarButton>
          </>
        )}
        
        {/* Remove Background - only for images */}
        {hasImageSelected && (
          <>
            <Divider />
            <div 
              className="relative"
              onMouseEnter={() => showTooltip('remove-bg')}
              onMouseLeave={hideTooltip}
            >
              <button
                onClick={handleRemoveBackground}
                className="h-8 px-2 flex items-center gap-1.5 rounded-md transition-colors hover:bg-purple-50 dark:hover:bg-purple-900/30 text-purple-600"
              >
                <Sparkles size={14} />
                <span className="text-xs font-medium">Remove BG</span>
              </button>
              {activeTooltip === 'remove-bg' && (
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2.5 py-1.5 bg-gray-900 dark:bg-gray-700 text-white text-xs rounded-lg shadow-lg whitespace-nowrap z-[60] pointer-events-none">
                  <div className="font-medium">Remove Background</div>
                  <div className="text-gray-300 text-[10px] mt-0.5">AI-powered background removal</div>
                  <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-900 dark:border-t-gray-700" />
                </div>
              )}
            </div>
          </>
        )}
        
        {/* More options dropdown */}
        <Divider />
        <div className="relative">
          <ToolbarButton 
            id="more"
            onClick={() => { setShowMoreMenu(!showMoreMenu); setShowLayerMenu(false); }} 
            label="More Options"
            description="Additional actions"
            className={showMoreMenu ? 'bg-gray-100 dark:bg-gray-700' : ''}
          >
            <MoreHorizontal size={16} />
          </ToolbarButton>
          
          {showMoreMenu && (
            <div className="absolute top-full right-0 mt-1 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 py-1 min-w-[180px] z-50">
              {/* Keyboard shortcuts reference */}
              <div className="px-3 py-1.5 text-[10px] font-medium text-gray-400 uppercase tracking-wider">Shortcuts</div>
              <div className="px-3 py-1 text-xs text-gray-600 dark:text-gray-300 flex items-center justify-between">
                <span>Duplicate</span>
                <kbd className="text-[10px] text-gray-400 bg-gray-100 dark:bg-gray-700 px-1.5 py-0.5 rounded">⌘D</kbd>
              </div>
              <div className="px-3 py-1 text-xs text-gray-600 dark:text-gray-300 flex items-center justify-between">
                <span>Delete</span>
                <kbd className="text-[10px] text-gray-400 bg-gray-100 dark:bg-gray-700 px-1.5 py-0.5 rounded">Del</kbd>
              </div>
              <div className="px-3 py-1 text-xs text-gray-600 dark:text-gray-300 flex items-center justify-between">
                <span>Lock/Unlock</span>
                <kbd className="text-[10px] text-gray-400 bg-gray-100 dark:bg-gray-700 px-1.5 py-0.5 rounded">⌘L</kbd>
              </div>
              {canGroup && (
                <div className="px-3 py-1 text-xs text-gray-600 dark:text-gray-300 flex items-center justify-between">
                  <span>Group</span>
                  <kbd className="text-[10px] text-gray-400 bg-gray-100 dark:bg-gray-700 px-1.5 py-0.5 rounded">⌘G</kbd>
                </div>
              )}
              <div className="h-px bg-gray-200 dark:bg-gray-600 my-1" />
              <div className="px-3 py-1.5 text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                <span className="font-medium text-gray-700 dark:text-gray-300">{selectedIds.length}</span>
                <span>element{selectedIds.length > 1 ? 's' : ''} selected</span>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Background Removal Modal */}
      <BackgroundRemovalModal
        open={bgRemoval.isOpen}
        onOpenChange={bgRemoval.closeModal}
        onConfirm={bgRemoval.processImage}
        onSkip={bgRemoval.skipRemoval}
        isProcessing={bgRemoval.isProcessing}
        error={bgRemoval.error}
      />
    </>
  );
}

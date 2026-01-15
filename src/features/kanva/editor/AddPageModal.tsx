'use client';

import { useState } from 'react';
import { createPortal } from 'react-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { X, Plus, Check, Copy, Monitor, Printer, Image, Film, FileText, Ruler, Instagram, Youtube, Twitter, Facebook, Linkedin } from 'lucide-react';
import { useEditorStore } from '../lib/editor/store';
import { CANVA_PRESETS } from '../lib/editor/canvasPresets';
import { cn } from '../lib/utils';

interface AddPageModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// Social media brand colors and icons
const socialBrands: Record<string, { icon: React.ReactNode; color: string; bg: string }> = {
  'Instagram Post': { icon: <Instagram size={20} />, color: '#E4405F', bg: 'bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400' },
  'Instagram Story': { icon: <Instagram size={20} />, color: '#E4405F', bg: 'bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400' },
  'Instagram Reel': { icon: <Instagram size={20} />, color: '#E4405F', bg: 'bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400' },
  'Facebook Post': { icon: <Facebook size={20} />, color: '#1877F2', bg: 'bg-[#1877F2]' },
  'Facebook Cover': { icon: <Facebook size={20} />, color: '#1877F2', bg: 'bg-[#1877F2]' },
  'Facebook Story': { icon: <Facebook size={20} />, color: '#1877F2', bg: 'bg-[#1877F2]' },
  'Twitter Post': { icon: <Twitter size={20} />, color: '#1DA1F2', bg: 'bg-[#1DA1F2]' },
  'Twitter Header': { icon: <Twitter size={20} />, color: '#1DA1F2', bg: 'bg-[#1DA1F2]' },
  'LinkedIn Post': { icon: <Linkedin size={20} />, color: '#0A66C2', bg: 'bg-[#0A66C2]' },
  'LinkedIn Cover': { icon: <Linkedin size={20} />, color: '#0A66C2', bg: 'bg-[#0A66C2]' },
  'YouTube Thumbnail': { icon: <Youtube size={20} />, color: '#FF0000', bg: 'bg-[#FF0000]' },
  'YouTube Banner': { icon: <Youtube size={20} />, color: '#FF0000', bg: 'bg-[#FF0000]' },
  'TikTok Video': { icon: <Film size={20} />, color: '#000000', bg: 'bg-gradient-to-br from-[#00f2ea] via-black to-[#ff0050]' },
  'Pinterest Pin': { icon: <Image size={20} />, color: '#E60023', bg: 'bg-[#E60023]' },
};

// Category icons mapping
const categoryIcons: Record<string, React.ReactNode> = {
  social: <Instagram size={18} />,
  presentation: <Monitor size={18} />,
  print: <Printer size={18} />,
  marketing: <Image size={18} />,
  video: <Youtube size={18} />,
  custom: <Ruler size={18} />,
};

// Category labels
const categoryLabels: Record<string, string> = {
  social: 'Social Media',
  presentation: 'Presentation',
  print: 'Print',
  marketing: 'Marketing',
  video: 'Video',
  custom: 'Custom Size',
};

/**
 * AddPageModal - Multi-canvas modal with side menu categories and preset grid
 */
export function AddPageModal({ isOpen, onClose }: AddPageModalProps) {
  const canvas = useEditorStore((state) => state.canvas);
  const addPage = useEditorStore((state) => state.addPage);
  const setActivePage = useEditorStore((state) => state.setActivePage);
  const setCanvas = useEditorStore((state) => state.setCanvas);
  const pages = useEditorStore((state) => state.pages);
  
  const [selectedCategory, setSelectedCategory] = useState<string>('social');
  const [selectedPreset, setSelectedPreset] = useState<string | null>(null);
  const [customWidth, setCustomWidth] = useState('1080');
  const [customHeight, setCustomHeight] = useState('1080');

  if (!isOpen) return null;

  // Get unique categories from presets
  const categories = [...new Set(CANVA_PRESETS.map(p => p.category))];
  
  // Filter presets by selected category
  const filteredPresets = CANVA_PRESETS.filter(p => p.category === selectedCategory);

  const handleCreateFromPreset = (presetId: string) => {
    const preset = CANVA_PRESETS.find(p => p.id === presetId);
    if (!preset) return;
    
    const newPageId = addPage(preset.name);
    setActivePage(newPageId);
    setCanvas({ 
      width: preset.width, 
      height: preset.height, 
      background: canvas.background 
    });
    onClose();
  };

  const handleCreateCustomPage = () => {
    const width = parseInt(customWidth) || 1080;
    const height = parseInt(customHeight) || 1080;
    
    const newPageId = addPage(`Page ${(pages?.length || 0) + 1}`);
    setActivePage(newPageId);
    setCanvas({ width, height, background: canvas.background });
    onClose();
  };

  const handleClose = () => {
    onClose();
    setSelectedPreset(null);
    setSelectedCategory('social');
  };

  if (typeof document === 'undefined') return null;

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-card border border-border rounded-2xl shadow-2xl w-full max-w-4xl h-[650px] overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-200 mx-4">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-border bg-gradient-to-r from-muted/50 to-transparent">
          <div>
            <h2 className="text-xl font-bold text-foreground">Create New Page</h2>
            <p className="text-sm text-muted-foreground mt-0.5">
              Choose a canvas size for your design
            </p>
          </div>
          <Button variant="ghost" size="icon" onClick={handleClose} className="rounded-full hover:bg-destructive/10 hover:text-destructive">
            <X size={20} />
          </Button>
        </div>

        {/* Main Content - Side menu + Preset grid */}
        <div className="flex-1 flex overflow-hidden">
          {/* Left Sidebar - Categories */}
          <div className="w-60 border-r border-border bg-muted/20 flex flex-col">
            <div className="p-4 flex-1 overflow-y-auto">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 px-2">Categories</p>
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => {
                    setSelectedCategory(cat);
                    setSelectedPreset(null);
                  }}
                  className={cn(
                    "w-full flex items-center gap-3 px-3 py-3 rounded-xl text-left transition-all mb-1.5",
                    selectedCategory === cat
                      ? "bg-primary text-primary-foreground shadow-md"
                      : "hover:bg-accent/80 text-muted-foreground hover:text-foreground"
                  )}
                >
                  <div className={cn(
                    "w-8 h-8 rounded-lg flex items-center justify-center",
                    selectedCategory === cat ? "bg-primary-foreground/20" : "bg-muted"
                  )}>
                    {categoryIcons[cat] || <FileText size={16} />}
                  </div>
                  <span className="font-medium text-sm">
                    {categoryLabels[cat] || cat.charAt(0).toUpperCase() + cat.slice(1)}
                  </span>
                </button>
              ))}
              
              {/* Custom Size option */}
              <div className="border-t border-border mt-4 pt-4">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 px-2">Other</p>
                <button
                  onClick={() => {
                    setSelectedCategory('custom');
                    setSelectedPreset(null);
                  }}
                  className={cn(
                    "w-full flex items-center gap-3 px-3 py-3 rounded-xl text-left transition-all",
                    selectedCategory === 'custom'
                      ? "bg-primary text-primary-foreground shadow-md"
                      : "hover:bg-accent/80 text-muted-foreground hover:text-foreground"
                  )}
                >
                  <div className={cn(
                    "w-8 h-8 rounded-lg flex items-center justify-center",
                    selectedCategory === 'custom' ? "bg-primary-foreground/20" : "bg-muted"
                  )}>
                    {categoryIcons.custom}
                  </div>
                  <span className="font-medium text-sm">Custom Size</span>
                </button>
              </div>
            </div>
          </div>

          {/* Right Content - Preset Grid or Custom Size */}
          <div className="flex-1 flex flex-col overflow-hidden">
            {selectedCategory === 'custom' ? (
              /* Custom Size Form */
              <div className="p-6 flex-1">
                <h3 className="text-lg font-semibold text-foreground mb-4">Custom Dimensions</h3>
                
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Width (px)</label>
                    <Input
                      type="number"
                      value={customWidth}
                      onChange={(e) => setCustomWidth(e.target.value)}
                      min={1}
                      max={10000}
                      className="bg-muted"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Height (px)</label>
                    <Input
                      type="number"
                      value={customHeight}
                      onChange={(e) => setCustomHeight(e.target.value)}
                      min={1}
                      max={10000}
                      className="bg-muted"
                    />
                  </div>
                </div>

                {/* Quick aspect ratios */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-foreground mb-3">Quick Sizes</label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { w: 1080, h: 1080, label: 'Square (1:1)' },
                      { w: 1920, h: 1080, label: 'Landscape (16:9)' },
                      { w: 1080, h: 1920, label: 'Portrait (9:16)' },
                      { w: 1200, h: 628, label: 'Facebook Post' },
                      { w: 1080, h: 1350, label: 'Instagram Portrait' },
                      { w: 2560, h: 1440, label: '2K Resolution' },
                    ].map((size) => (
                      <button
                        key={`${size.w}x${size.h}`}
                        onClick={() => {
                          setCustomWidth(size.w.toString());
                          setCustomHeight(size.h.toString());
                        }}
                        className="p-3 text-left rounded-lg border border-border hover:border-primary hover:bg-primary/5 transition-all"
                      >
                        <div className="text-sm font-medium text-foreground">{size.label}</div>
                        <div className="text-xs text-muted-foreground">{size.w} × {size.h}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Preview */}
                <div className="flex items-center gap-4 p-4 bg-muted/50 rounded-lg">
                  <div 
                    className="bg-white border border-border rounded shadow-sm"
                    style={{
                      width: Math.min(80, 80 * (parseInt(customWidth) / parseInt(customHeight) || 1)),
                      height: Math.min(80, 80 / (parseInt(customWidth) / parseInt(customHeight) || 1)),
                    }}
                  />
                  <div>
                    <div className="text-sm font-medium text-foreground">Preview</div>
                    <div className="text-xs text-muted-foreground">
                      {customWidth} × {customHeight} px
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              /* Preset Grid */
              <div className="p-6 flex-1 overflow-y-auto">
                <h3 className="text-lg font-semibold text-foreground mb-1">
                  {categoryLabels[selectedCategory] || selectedCategory}
                </h3>
                <p className="text-sm text-muted-foreground mb-6">
                  {selectedCategory === 'social' && 'Create content optimized for social platforms'}
                  {selectedCategory === 'presentation' && 'Professional slides and presentations'}
                  {selectedCategory === 'print' && 'High-quality print materials'}
                  {selectedCategory === 'marketing' && 'Marketing and promotional materials'}
                  {selectedCategory === 'video' && 'Video thumbnails and covers'}
                </p>
                
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
                  {filteredPresets.map((preset) => {
                    const aspectRatio = preset.width / preset.height;
                    const maxDimension = 70;
                    // Calculate preview dimensions maintaining aspect ratio
                    let previewWidth, previewHeight;
                    if (aspectRatio >= 1) {
                      // Landscape or square
                      previewWidth = maxDimension;
                      previewHeight = maxDimension / aspectRatio;
                    } else {
                      // Portrait (like Instagram Story 9:16)
                      previewHeight = maxDimension;
                      previewWidth = maxDimension * aspectRatio;
                    }
                    const brand = socialBrands[preset.name];
                    
                    return (
                      <button
                        key={preset.id}
                        onClick={() => setSelectedPreset(preset.id)}
                        className={cn(
                          "group relative p-4 rounded-xl border-2 transition-all text-left",
                          "hover:shadow-lg hover:-translate-y-0.5",
                          selectedPreset === preset.id
                            ? "border-primary bg-primary/5 shadow-lg ring-2 ring-primary/20"
                            : "border-border/50 hover:border-primary/50 bg-card"
                        )}
                      >
                        {/* Selection indicator */}
                        {selectedPreset === preset.id && (
                          <div className="absolute -top-2 -right-2 w-6 h-6 bg-primary rounded-full flex items-center justify-center shadow-md z-10">
                            <Check size={14} className="text-primary-foreground" />
                          </div>
                        )}
                        
                        <div className="flex flex-col items-center text-center">
                          {/* Preview with brand icon */}
                          <div className="relative mb-3 h-[70px] flex items-center justify-center">
                            <div 
                              className={cn(
                                "rounded-lg shadow-sm flex items-center justify-center overflow-hidden",
                                brand?.bg || "bg-gradient-to-br from-gray-100 to-gray-200"
                              )}
                              style={{ 
                                width: previewWidth, 
                                height: previewHeight,
                              }}
                            >
                              {brand ? (
                                <div className="text-white opacity-90">
                                  {brand.icon}
                                </div>
                              ) : (
                                <FileText size={24} className="text-gray-400" />
                              )}
                            </div>
                          </div>
                          
                          {/* Name and dimensions */}
                          <div className="font-medium text-sm text-foreground mb-0.5 truncate w-full">
                            {preset.name}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {preset.width} × {preset.height}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Footer */}
            <div className="px-6 py-4 border-t border-border bg-gradient-to-r from-muted/30 to-transparent flex items-center justify-between">
              <div className="flex items-center gap-3">
                {selectedPreset && selectedCategory !== 'custom' && (
                  <>
                    <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                      {(() => {
                        const preset = CANVA_PRESETS.find(p => p.id === selectedPreset);
                        const brand = preset ? socialBrands[preset.name] : null;
                        return brand ? (
                          <div className={cn("w-full h-full rounded-lg flex items-center justify-center", brand.bg)}>
                            <div className="text-white scale-75">{brand.icon}</div>
                          </div>
                        ) : <FileText size={18} className="text-muted-foreground" />;
                      })()}
                    </div>
                    <div>
                      <div className="text-sm font-medium text-foreground">
                        {CANVA_PRESETS.find(p => p.id === selectedPreset)?.name}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {CANVA_PRESETS.find(p => p.id === selectedPreset)?.width} × {CANVA_PRESETS.find(p => p.id === selectedPreset)?.height} px
                      </div>
                    </div>
                  </>
                )}
                {selectedCategory === 'custom' && (
                  <div className="text-sm text-muted-foreground">
                    Custom: {customWidth} × {customHeight} px
                  </div>
                )}
                {!selectedPreset && selectedCategory !== 'custom' && (
                  <div className="text-sm text-muted-foreground">
                    Select a size to continue
                  </div>
                )}
              </div>
              <div className="flex gap-3">
                <Button variant="outline" onClick={handleClose} className="px-6">
                  Cancel
                </Button>
                <Button 
                  onClick={() => {
                    if (selectedCategory === 'custom') {
                      handleCreateCustomPage();
                    } else if (selectedPreset) {
                      handleCreateFromPreset(selectedPreset);
                    }
                  }}
                  disabled={selectedCategory !== 'custom' && !selectedPreset}
                  className="gap-2 px-6 shadow-md"
                >
                  <Plus size={16} />
                  Create Page
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}

/**
 * AddPagePopup - Right-click style popup menu for quick page creation
 */
interface AddPagePopupProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenModal: () => void;
  anchorPosition?: { x: number; y: number };
}

export function AddPagePopup({ isOpen, onClose, onOpenModal, anchorPosition }: AddPagePopupProps) {
  const canvas = useEditorStore((state) => state.canvas);
  const addPage = useEditorStore((state) => state.addPage);
  const setActivePage = useEditorStore((state) => state.setActivePage);
  const pages = useEditorStore((state) => state.pages);

  if (!isOpen) return null;
  if (typeof document === 'undefined') return null;

  const handleCreateSameSizePage = () => {
    const newPageId = addPage(`Page ${(pages?.length || 0) + 1}`);
    setActivePage(newPageId);
    onClose();
  };

  const handleOpenPresetModal = () => {
    onClose();
    onOpenModal();
  };

  return createPortal(
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 z-[9998]" 
        onClick={onClose}
      />
      
      {/* Popup Menu */}
      <div 
        className="fixed z-[9999] bg-card border border-border rounded-xl shadow-2xl py-2 min-w-[240px] animate-in fade-in slide-in-from-bottom-2 duration-200"
        style={{
          bottom: anchorPosition ? undefined : '100px',
          left: anchorPosition?.x ?? '50%',
          top: anchorPosition?.y,
          transform: anchorPosition ? undefined : 'translateX(-50%)',
        }}
      >
        <div className="px-3 py-1.5 mb-1">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Add New Page</p>
        </div>
        
        <button
          onClick={handleCreateSameSizePage}
          className="w-full flex items-center gap-3 px-3 py-3 hover:bg-accent/80 transition-colors text-left group"
        >
          <div className="w-10 h-10 rounded-lg bg-muted group-hover:bg-primary/10 flex items-center justify-center transition-colors">
            <Copy size={18} className="text-muted-foreground group-hover:text-primary" />
          </div>
          <div className="flex-1">
            <div className="text-sm font-medium text-foreground">Same Size</div>
            <div className="text-xs text-muted-foreground">{canvas.width} × {canvas.height} px</div>
          </div>
        </button>
        
        <div className="border-t border-border mx-3 my-1" />
        
        <button
          onClick={handleOpenPresetModal}
          className="w-full flex items-center gap-3 px-3 py-3 hover:bg-accent/80 transition-colors text-left group"
        >
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary/20 to-primary/5 group-hover:from-primary/30 group-hover:to-primary/10 flex items-center justify-center transition-colors">
            <Instagram size={18} className="text-primary" />
          </div>
          <div className="flex-1">
            <div className="text-sm font-medium text-foreground">Different Size</div>
            <div className="text-xs text-muted-foreground">Social media, print & more</div>
          </div>
          <div className="text-muted-foreground">
            <Plus size={16} />
          </div>
        </button>
      </div>
    </>,
    document.body
  );
}

'use client';

import React, { useState, useEffect } from 'react';
import { useEditorStore } from '../lib/editor/store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Image as ImageIcon, Upload as UploadIcon, Type, Save, Trash2, Image as ImageIcon2, FolderOpen, Play, PenTool, Sparkles, Shapes, Grid3x3, Mic } from 'lucide-react';
import { cn } from '../lib/utils';
import { generateId, getNextZIndex, exportToDataURL } from '../lib/editor/utils';
import type { Template } from '../lib/editor/types';
import { FontSelector } from './FontSelector';
import { GoogleFontSelector } from './GoogleFontSelector';
import { PHOTO_CATEGORIES, getAllPhotos, getCategoryById } from '../lib/photos/categories';
import { ICON_CATEGORIES, getIconsByCategory, searchIcons, getIconSVGDataURL, type Icon } from '../lib/icons/iconLibrary';
import { ELEMENT_CATEGORIES, getElementsByCategory, searchElements, getElementSVGDataURL, FREE_ELEMENTS } from '../lib/elements/elementLibrary';
import { TEMPLATE_LIBRARY, getTemplatesByPreset, getPresetIdsWithTemplates, searchTemplates } from '@/src/lib/templates/templateLibrary';
import { TEXT_COMBINATIONS, TEMPLATE_CATEGORIES, getTemplatesByCategory, searchTemplates as searchTextTemplates, type TextCombinationTemplate } from '../lib/text/textCombinations';
import { CANVA_PRESETS } from '../lib/editor/canvasPresets';
import { TextLogoTemplates } from './TextLogoTemplates';
import { TextPresetsGallery } from './TextPresetsGallery';
import { TextStylePreset } from '../lib/text/textStyleTypes';
import { BackgroundPanel } from './BackgroundPanel';
import {
  getResponsiveImageSize,
  getResponsiveFontSize,
  getResponsiveShapeSize,
  getResponsiveIconSize,
  getResponsiveVideoSize,
  getCenterPosition,
  getResponsiveTextSize,
} from '../lib/editor/elementSizing';

interface ContentPanelProps {
  activeTab: string;
}

export function ContentPanel({ activeTab }: ContentPanelProps) {
  const addElement = useEditorStore((state) => state.addElement);
  const addAsset = useEditorStore((state) => state.addAsset);
  const assets = useEditorStore((state) => state.assets);
  const canvas = useEditorStore((state) => state.canvas);
  const elementsRaw = useEditorStore((state) => state.elements);
  // Ensure elements is always an array
  const elements = Array.isArray(elementsRaw) ? elementsRaw : [];
  
  // Font selector state (for text tab)
  const [selectedFont, setSelectedFont] = useState('Inter');
  
  // Removed text sub-tabs - simplified to Quick Add only
  
  // Photo category state (for photos tab)
  const [selectedPhotoCategory, setSelectedPhotoCategory] = useState<string>('all');
  const [photoSearchQuery, setPhotoSearchQuery] = useState('');
  
  // My Designs state
  const [designs, setDesigns] = useState<Template[]>([]);
  const getTemplatesForDesigns = useEditorStore((state) => state.getTemplates);
  
  // Icons state
  const [iconSearchQuery, setIconSearchQuery] = useState('');
  const [selectedIconCategory, setSelectedIconCategory] = useState<string>('ui');
  
  // Elements state
  const [elementSearchQuery, setElementSearchQuery] = useState('');
  const [selectedElementCategory, setSelectedElementCategory] = useState<string>('all');
  
  // Draw state
  const [brushSize, setBrushSize] = useState(5);
  const [brushColor, setBrushColor] = useState('#000000');
  const setDrawingMode = useEditorStore((state) => state.setDrawingMode);
  const setDrawingConfig = useEditorStore((state) => state.setDrawingConfig);
  const isDrawingMode = useEditorStore((state) => state.isDrawingMode);
  
  // Videos state
  const [videoSearchQuery, setVideoSearchQuery] = useState('');
  const [selectedVideoCategory, setSelectedVideoCategory] = useState<string>('all');
  
  // Removed text combinations state
  
  // Template state (for templates tab)
  const saveTemplate = useEditorStore((state) => state.saveTemplate);
  const loadTemplate = useEditorStore((state) => state.loadTemplate);
  const getTemplates = useEditorStore((state) => state.getTemplates);
  const deleteTemplate = useEditorStore((state) => state.deleteTemplate);
  const getStateSnapshot = useEditorStore((state) => state.getStateSnapshot);
  const setCanvas = useEditorStore((state) => state.setCanvas);
  const [templates, setTemplates] = useState<Template[]>([]);
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [templateName, setTemplateName] = useState('');
  const [templateTags, setTemplateTags] = useState('');
  const [templateSearchQuery, setTemplateSearchQuery] = useState('');
  const [selectedTemplatePreset, setSelectedTemplatePreset] = useState<string>('all');
  const [showLibraryTemplates, setShowLibraryTemplates] = useState(true);

  useEffect(() => {
    if (activeTab === 'templates') {
      setTemplates(getTemplates());
    }
  }, [activeTab, getTemplates]);

  useEffect(() => {
    if (activeTab === 'designs') {
      setDesigns(getTemplatesForDesigns());
    }
  }, [activeTab, getTemplatesForDesigns]);

  // Update drawing config when brush settings change
  useEffect(() => {
    if (activeTab === 'draw') {
      setDrawingConfig({ color: brushColor, strokeWidth: brushSize });
    }
  }, [activeTab, brushColor, brushSize, setDrawingConfig]);

  const handleAddImage = (imageUrl: string) => {
    const img = new Image();
    img.onload = () => {
      const maxWidth = 400;
      const maxHeight = 400;
      let width = img.width;
      let height = img.height;

      if (width > maxWidth || height > maxHeight) {
        const ratio = Math.min(maxWidth / width, maxHeight / height);
        width = width * ratio;
        height = height * ratio;
      }

      // Position element relative to artboard (0,0 = top-left of artboard)
      const newElement = {
        id: generateId('image'),
        type: 'image' as const,
        x: Math.max(0, canvas.width / 2 - width / 2), // Center in artboard
        y: Math.max(0, canvas.height / 2 - height / 2), // Center in artboard
        width,
        height,
        rotation: 0,
        zIndex: getNextZIndex(elements),
        visible: true,
        src: imageUrl,
        originalMeta: {
          width: img.width,
          height: img.height,
        },
      };
      
      console.log('[ContentPanel] Adding image element:', newElement);
      addElement(newElement);
    };
    img.src = imageUrl;
  };

  const handleFileUpload = () => {
    const input = document.createElement('input');
    input.type = 'file';
    // Accept all major file types that Canva supports
    input.accept = 'image/*,video/*,.pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.txt,.svg';
    input.multiple = true; // Allow multiple file selection
    input.onchange = async (e: any) => {
      const files = Array.from(e.target.files || []) as File[];
      if (files.length === 0) return;

      for (const file of files) {
        await handleFileUploadSingle(file);
      }
    };
    input.click();
  };

  const handleFileUploadSingle = async (file: File) => {
    // Validate file size (50MB limit)
    if (file.size > 50 * 1024 * 1024) {
      alert(`File "${file.name}" is too large (max 50MB)`);
      return;
    }

    try {
      const reader = new FileReader();
      reader.onload = async (event: any) => {
        const dataURL = event.target.result;
        
        // Determine file type
        let assetType: 'image' | 'video' | 'gif' | 'sticker' | 'svg' | 'pdf' | 'document' = 'image';
        if (file.type.startsWith('video/')) {
          assetType = 'video';
        } else if (file.type === 'image/gif') {
          assetType = 'gif';
        } else if (file.type === 'image/svg+xml' || file.name.endsWith('.svg')) {
          assetType = 'svg';
        } else if (file.type === 'application/pdf' || file.name.endsWith('.pdf')) {
          assetType = 'pdf';
        } else if (file.type.includes('document') || 
                   file.name.endsWith('.doc') || file.name.endsWith('.docx') ||
                   file.name.endsWith('.ppt') || file.name.endsWith('.pptx') ||
                   file.name.endsWith('.xls') || file.name.endsWith('.xlsx') ||
                   file.name.endsWith('.txt')) {
          assetType = 'document';
        } else if (file.type.startsWith('image/')) {
          assetType = 'image';
        }

        // Create asset
        const asset = {
          id: `asset-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          src: dataURL,
          thumbnail: assetType === 'image' || assetType === 'gif' || assetType === 'svg' ? dataURL : undefined,
          type: assetType,
          uploadedAt: new Date().toISOString(),
          tags: [],
          metadata: {
            name: file.name,
            size: file.size,
            mimeType: file.type,
          },
        };

        // Save asset to store
        addAsset(asset);

        // If it's an image, also add it to canvas
        if (assetType === 'image' || assetType === 'gif' || assetType === 'svg') {
          handleAddImage(dataURL);
        }
      };
      reader.onerror = () => {
        alert(`Failed to read file: ${file.name}`);
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error('Upload error:', error);
      alert(`Failed to upload file: ${file.name}`);
    }
  };

  // Handle adding text combination template
  const handleAddTextCombination = (template: TextCombinationTemplate) => {
    // Calculate center position for the group
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    
    // Calculate offset to center the template
    const offsetX = centerX - (template.width / 2);
    const offsetY = centerY - (template.height / 2);
    
    // Generate a unique group ID
    const groupId = generateId('text-group');
    const baseZIndex = getNextZIndex(elements);
    
    // Create all text elements from the template
    const newElements = template.elements.map((templateEl, index) => ({
      id: generateId('text'),
      type: 'text' as const,
      x: offsetX + templateEl.position.x,
      y: offsetY + templateEl.position.y,
      width: 200, // Will auto-adjust based on text
      height: templateEl.fontSize * 1.2,
      rotation: templateEl.rotation || 0,
      zIndex: baseZIndex + index,
      visible: true,
      text: templateEl.content,
      fontSize: templateEl.fontSize,
      fontFamily: templateEl.fontFamily,
      fontWeight: templateEl.fontWeight || 'normal',
      fontStyle: 'normal',
      fill: templateEl.color,
      align: templateEl.textAlign,
      verticalAlign: 'middle' as const,
      groupId: template.grouping ? groupId : undefined,
      letterSpacing: templateEl.letterSpacing,
      lineHeight: templateEl.lineHeight,
    }));
    
    // Add all elements to canvas
    newElements.forEach(element => addElement(element));
  };

  // Get photos based on selected category
  const getPhotosForCategory = () => {
    if (selectedPhotoCategory === 'all') {
      return getAllPhotos();
    }
    const category = getCategoryById(selectedPhotoCategory);
    return category?.images || [];
  };

  // Filter photos by search query
  const filteredPhotos = getPhotosForCategory().filter((url) => {
    if (!photoSearchQuery.trim()) return true;
    // Simple filter - in a real app, you'd search by tags/metadata
    return true; // For now, show all photos
  });

  if (activeTab === 'photos') {
    return (
      <div className="w-96 bg-gradient-to-b from-background via-background to-muted/20 border-r border-border/30 flex flex-col h-full overflow-hidden flex-shrink-0 backdrop-blur-sm">
        {/* Header */}
        <div className="p-6 border-b border-border/50 bg-gradient-to-br from-background to-muted/30">
          <div className="flex items-center gap-2 mb-2">
            <ImageIcon className="w-5 h-5 text-primary" />
            <h3 className="text-foreground font-bold text-lg tracking-tight">Photos</h3>
          </div>
          <p className="text-xs text-muted-foreground mb-4">Stock photos • Click to add</p>
          
          {/* Search */}
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={16} />
            <Input
              placeholder="Search photos..."
              value={photoSearchQuery}
              onChange={(e) => setPhotoSearchQuery(e.target.value)}
              className="pl-10 bg-gradient-to-r from-accent/30 via-accent/50 to-accent/30 backdrop-blur-sm border-border/50 text-foreground text-sm h-10 rounded-xl focus-visible:ring-2 focus-visible:ring-primary/20"
            />
          </div>

          {/* Category Tabs */}
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {PHOTO_CATEGORIES.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedPhotoCategory(category.id)}
                className={cn(
                  "relative px-4 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition-all duration-300 flex-shrink-0",
                  selectedPhotoCategory === category.id
                    ? "bg-gradient-to-br from-primary to-primary/80 text-primary-foreground shadow-lg shadow-primary/30 scale-105"
                    : "bg-muted/50 text-muted-foreground hover:bg-accent/50 hover:text-foreground hover:scale-110"
                )}
              >
                {selectedPhotoCategory === category.id && (
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-primary/20 to-transparent blur-xl -z-10 opacity-75" />
                )}
                {category.name}
              </button>
            ))}
          </div>
        </div>

        {/* Photo Grid */}
        <div className="flex-1 overflow-y-auto p-6">
          {filteredPhotos.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-center">
              <div className="relative">
                <div className="absolute inset-0 bg-primary/10 blur-3xl rounded-full" />
                <ImageIcon className="w-16 h-16 text-muted-foreground/50 mb-4 relative" />
              </div>
              <h4 className="text-sm font-semibold text-foreground mb-2">No photos found</h4>
              <p className="text-xs text-muted-foreground">Try a different search or category</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4">
              {filteredPhotos.map((url, idx) => (
                <div
                  key={`${selectedPhotoCategory}-${idx}-${url}`}
                  className="group relative aspect-square rounded-xl overflow-hidden cursor-pointer bg-muted/50 border border-border/20 hover:border-primary/30 transition-all duration-200 hover:scale-105 hover:shadow-lg"
                  onClick={() => handleAddImage(url)}
                >
                  <img
                    src={url}
                    alt={`Photo ${idx + 1}`}
                    className="w-full h-full object-cover"
                    loading="lazy"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                    }}
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-200" />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  if (activeTab === 'upload') {
    const assetsArray = Array.isArray(assets) ? assets : [];
    const imageAssets = assetsArray.filter(a => a.type === 'image' || a.type === 'gif' || a.type === 'svg');
    const videoAssets = assetsArray.filter(a => a.type === 'video');
    const otherAssets = assetsArray.filter(a => !['image', 'gif', 'svg', 'video'].includes(a.type));

    return (
      <div className="w-96 bg-gradient-to-b from-background via-background to-muted/20 border-r border-border/30 flex flex-col h-full overflow-hidden flex-shrink-0 backdrop-blur-sm">
        <div className="p-6 border-b border-border/50 bg-gradient-to-br from-background to-muted/30">
          <div className="flex items-center gap-2 mb-2">
            <UploadIcon className="w-5 h-5 text-primary" />
            <h3 className="text-foreground font-bold text-lg tracking-tight">Upload</h3>
          </div>
          <p className="text-xs text-muted-foreground mb-4">Add your own images & files</p>
          
          <Button
            onClick={handleFileUpload}
            className="w-full rounded-xl bg-gradient-to-br from-primary to-primary/80 hover:scale-105 shadow-lg shadow-primary/30 transition-all duration-300 relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent blur-xl -z-10 opacity-75" />
            <UploadIcon className="mr-2" size={20} />
            Upload Files
          </Button>
          <p className="text-muted-foreground text-xs mt-3 text-center">
            Images, Videos, PDFs • Max 50MB
          </p>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4">
          {assetsArray.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
              <UploadIcon size={48} className="mb-4 opacity-50" />
              <p className="text-sm">No files uploaded yet</p>
              <p className="text-xs mt-2">Click "Upload Files" to get started</p>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Images */}
              {imageAssets.length > 0 && (
                <div>
                  <h4 className="text-foreground text-sm font-medium mb-2">Images ({imageAssets.length})</h4>
                  <div className="grid grid-cols-2 gap-3">
                    {imageAssets.map((asset) => (
                      <div
                        key={asset.id}
                        onClick={() => handleAddImage(asset.src)}
                        className="relative aspect-square rounded-xl overflow-hidden bg-muted/50 border border-border/20 cursor-pointer hover:border-primary/30 hover:scale-105 transition-all duration-300 hover:shadow-lg group"
                      >
                        <img
                          src={asset.thumbnail || asset.src}
                          alt={asset.metadata?.name || 'Uploaded image'}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-300 flex items-center justify-center">
                          <ImageIcon className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" size={24} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Videos */}
              {videoAssets.length > 0 && (
                <div>
                  <h4 className="text-foreground text-sm font-medium mb-2">Videos ({videoAssets.length})</h4>
                  <div className="grid grid-cols-2 gap-2">
                    {videoAssets.map((asset) => (
                      <div
                        key={asset.id}
                        onClick={() => {
                          // Add video element to canvas
                          const newVideo = {
                            id: generateId('video'),
                            type: 'video' as const,
                            x: canvas.width / 2 - 200,
                            y: canvas.height / 2 - 150,
                            width: 400,
                            height: 300,
                            rotation: 0,
                            zIndex: getNextZIndex(elements),
                            visible: true,
                            src: asset.src,
                          };
                          addElement(newVideo);
                        }}
                        className="relative aspect-video rounded-lg overflow-hidden bg-muted cursor-pointer hover:opacity-80 transition-opacity group"
                      >
                        <div className="w-full h-full flex items-center justify-center">
                          <Play className="text-muted-foreground" size={32} />
                        </div>
                        <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-60 p-2">
                          <p className="text-foreground text-xs truncate">{asset.metadata?.name || 'Video'}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Other Files */}
              {otherAssets.length > 0 && (
                <div>
                  <h4 className="text-foreground text-sm font-medium mb-2">Other Files ({otherAssets.length})</h4>
                  <div className="space-y-2">
                    {otherAssets.map((asset) => (
                      <div
                        key={asset.id}
                        className="flex items-center gap-3 p-2 rounded-lg bg-muted hover:bg-muted/80 cursor-pointer"
                      >
                        <FolderOpen className="text-muted-foreground" size={20} />
                        <div className="flex-1 min-w-0">
                          <p className="text-foreground text-sm truncate">{asset.metadata?.name || 'File'}</p>
                          <p className="text-muted-foreground text-xs">
                            {asset.metadata?.size ? `${(asset.metadata.size / 1024).toFixed(1)} KB` : ''}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    );
  }

  if (activeTab === 'text') {
    return (
      <div className="w-96 bg-gradient-to-b from-background via-background to-muted/20 border-r border-border/30 flex flex-col h-full overflow-hidden flex-shrink-0 backdrop-blur-sm">
        <div className="p-6 border-b border-border/50 bg-gradient-to-br from-background to-muted/30">
          <div className="flex items-center gap-2 mb-2">
            <Type className="w-5 h-5 text-primary" />
            <h3 className="text-foreground font-bold text-lg tracking-tight">Text</h3>
          </div>
          <p className="text-xs text-muted-foreground mb-4">Add headings, body text & more</p>
        </div>
        <div className="flex-1 overflow-y-auto p-6">
          <div className="space-y-6">
            {/* Quick Add Section */}
            <div>
              <h4 className="text-xs font-semibold text-muted-foreground mb-3 uppercase tracking-wide">Quick Add</h4>
              <div className="grid grid-cols-3 gap-3">
                <button
                  onClick={() => {
                    const fontSize = getResponsiveFontSize(canvas, 'heading');
                    const textSize = getResponsiveTextSize(canvas, 'heading');
                    const centerPos = getCenterPosition(canvas, textSize.width, textSize.height);
                    addElement({
                      id: generateId('text'),
                      type: 'text',
                      x: centerPos.x,
                      y: centerPos.y,
                      width: textSize.width,
                      height: textSize.height,
                      rotation: 0,
                      zIndex: getNextZIndex(elements),
                      visible: true,
                      text: 'Add a heading',
                      textJSON: textToJSON('Add a heading'), // Initialize TipTap JSON
                      fontSize,
                      fontFamily: selectedFont,
                      fontWeight: 'bold',
                      fontStyle: 'normal',
                      fill: '#000000',
                      align: 'center',
                      verticalAlign: 'middle',
                    });
                  }}
                  className="group p-4 rounded-xl bg-muted/50 border border-border/20 hover:bg-accent hover:border-primary/30 transition-all duration-200 hover:scale-105 hover:shadow-lg text-left"
                >
                  <div className="text-2xl font-bold mb-1 group-hover:text-primary transition-colors">Aa</div>
                  <div className="text-xs text-muted-foreground">Heading</div>
                </button>
                <button
                  onClick={() => {
                    const fontSize = getResponsiveFontSize(canvas, 'subheading');
                    const textSize = getResponsiveTextSize(canvas, 'subheading');
                    const centerPos = getCenterPosition(canvas, textSize.width, textSize.height);
                    addElement({
                      id: generateId('text'),
                      type: 'text',
                      x: centerPos.x,
                      y: centerPos.y,
                      width: textSize.width,
                      height: textSize.height,
                      rotation: 0,
                      zIndex: getNextZIndex(elements),
                      visible: true,
                      text: 'Add subheading',
                      textJSON: textToJSON('Add subheading'), // Initialize TipTap JSON
                      fontSize,
                      fontFamily: selectedFont,
                      fontWeight: '600',
                      fontStyle: 'normal',
                      fill: '#000000',
                      align: 'center',
                      verticalAlign: 'middle',
                    });
                  }}
                  className="group p-4 rounded-xl bg-muted/50 border border-border/20 hover:bg-accent hover:border-primary/30 transition-all duration-200 hover:scale-105 hover:shadow-lg text-left"
                >
                  <div className="text-lg font-semibold mb-1 group-hover:text-primary transition-colors">Aa</div>
                  <div className="text-xs text-muted-foreground">Subheading</div>
                </button>
                <button
                  onClick={() => {
                    const fontSize = getResponsiveFontSize(canvas, 'body');
                    const textSize = getResponsiveTextSize(canvas, 'body');
                    const centerPos = getCenterPosition(canvas, textSize.width, textSize.height);
                    addElement({
                      id: generateId('text'),
                      type: 'text',
                      x: centerPos.x,
                      y: centerPos.y,
                      width: textSize.width,
                      height: textSize.height,
                      rotation: 0,
                      zIndex: getNextZIndex(elements),
                      visible: true,
                      text: 'Add body text',
                      textJSON: textToJSON('Add body text'), // Initialize TipTap JSON
                      fontSize,
                      fontFamily: selectedFont,
                      fontWeight: 'normal',
                      fontStyle: 'normal',
                      fill: '#000000',
                      align: 'left',
                      verticalAlign: 'top',
                    });
                  }}
                  className="group p-4 rounded-xl bg-muted/50 border border-border/20 hover:bg-accent hover:border-primary/30 transition-all duration-200 hover:scale-105 hover:shadow-lg text-left"
                >
                  <div className="text-sm mb-1 group-hover:text-primary transition-colors">Aa</div>
                  <div className="text-xs text-muted-foreground">Body</div>
                </button>
              </div>
            </div>

            {/* Text combinations removed - keeping it simple */}
          </div>
        </div>
      </div>
    );
  }

  if (activeTab === 'shapes') {
    return (
      <div className="w-96 bg-gradient-to-b from-background via-background to-muted/20 border-r border-border/30 flex flex-col h-full overflow-hidden flex-shrink-0 backdrop-blur-sm">
        <div className="p-6 border-b border-border/50 bg-gradient-to-br from-background to-muted/30">
          <div className="flex items-center gap-2 mb-2">
            <Shapes className="w-5 h-5 text-primary" />
            <h3 className="text-foreground font-bold text-lg tracking-tight">Shapes</h3>
          </div>
          <p className="text-xs text-muted-foreground">Basic shapes • Click to add</p>
        </div>
        <div className="flex-1 overflow-y-auto p-6">
          <div className="grid grid-cols-2 gap-4">
            <button
              className="group relative h-24 rounded-xl bg-gradient-to-br from-muted/50 to-muted/30 border border-border/20 hover:border-primary/30 hover:scale-105 transition-all duration-300 hover:shadow-lg flex items-center justify-center cursor-pointer"
              onClick={() => {
                addElement({
                  id: generateId('shape'),
                  type: 'shape',
                  shapeType: 'rect',
                  x: canvas.width / 2 - 50,
                  y: canvas.height / 2 - 50,
                  width: 100,
                  height: 100,
                  rotation: 0,
                  zIndex: getNextZIndex(elements),
                  visible: true,
                  fill: '#3b82f6',
                  stroke: '#1e40af',
                  strokeWidth: 2,
                });
              }}
            >
              <div className="w-14 h-14 bg-blue-500 rounded-lg group-hover:scale-110 transition-transform duration-300 shadow-md"></div>
            </button>
            <button
              className="group relative h-24 rounded-xl bg-gradient-to-br from-muted/50 to-muted/30 border border-border/20 hover:border-primary/30 hover:scale-105 transition-all duration-300 hover:shadow-lg flex items-center justify-center cursor-pointer"
              onClick={() => {
                addElement({
                  id: generateId('shape'),
                  type: 'shape',
                  shapeType: 'circle',
                  x: canvas.width / 2 - 50,
                  y: canvas.height / 2 - 50,
                  width: 100,
                  height: 100,
                  radius: 50,
                  rotation: 0,
                  zIndex: getNextZIndex(elements),
                  visible: true,
                  fill: '#10b981',
                  stroke: '#059669',
                  strokeWidth: 2,
                });
              }}
            >
              <div className="w-14 h-14 bg-green-500 rounded-full group-hover:scale-110 transition-transform duration-300 shadow-md"></div>
            </button>
            <button
              className="group relative h-24 rounded-xl bg-gradient-to-br from-muted/50 to-muted/30 border border-border/20 hover:border-primary/30 hover:scale-105 transition-all duration-300 hover:shadow-lg flex items-center justify-center cursor-pointer"
              onClick={() => {
                addElement({
                  id: generateId('shape'),
                  type: 'shape',
                  shapeType: 'triangle',
                  x: canvas.width / 2 - 50,
                  y: canvas.height / 2 - 50,
                  width: 100,
                  height: 100,
                  rotation: 0,
                  zIndex: getNextZIndex(elements),
                  visible: true,
                  fill: '#f59e0b',
                  stroke: '#d97706',
                  strokeWidth: 2,
                });
              }}
            >
              <div className="w-14 h-14 bg-orange-500 group-hover:scale-110 transition-transform duration-300 shadow-md" style={{ clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)' }}></div>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Elements Tab - Gallery Style with All Categories Visible
  if (activeTab === 'elements') {
    // Debug: Log total elements
    console.log('[Elements Tab] Total elements in library:', FREE_ELEMENTS.length);
    console.log('[Elements Tab] Categories:', ELEMENT_CATEGORIES.map(c => `${c.label}: ${getElementsByCategory(c.id).length}`));
    
    return (
      <>
        <div className="w-96 bg-gradient-to-b from-background via-background to-muted/20 border-r border-border/30 flex flex-col h-full overflow-hidden flex-shrink-0 backdrop-blur-sm">
          {/* Header */}
          <div className="p-6 border-b border-border/50 bg-gradient-to-br from-background to-muted/30">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-5 h-5 text-primary" />
              <h3 className="text-foreground font-bold text-lg tracking-tight">
                Elements
              </h3>
            </div>
            <p className="text-xs text-muted-foreground mb-4">
              {FREE_ELEMENTS.length} free graphics • No API needed • Click to add
            </p>
            
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search elements..."
                value={elementSearchQuery}
                onChange={(e) => setElementSearchQuery(e.target.value)}
                className="pl-10 bg-background/50 border-border/50 h-10 rounded-lg"
              />
            </div>
          </div>

          {/* Elements by Category - All Visible */}
          <div className="flex-1 overflow-y-auto p-6 space-y-8">
            {elementSearchQuery ? (
              // Search Results
              searchElements(elementSearchQuery).length === 0 ? (
                <div className="flex flex-col items-center justify-center h-64 text-center">
                  <Sparkles className="w-16 h-16 text-muted-foreground/30 mb-4" />
                  <h4 className="text-sm font-semibold text-foreground mb-2">
                    No elements found
                  </h4>
                  <p className="text-xs text-muted-foreground">
                    Try a different search term
                  </p>
                </div>
              ) : (
                <div>
                  <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
                    <Search className="w-4 h-4" />
                    Search Results ({searchElements(elementSearchQuery).length})
                  </h3>
                  <div className="grid grid-cols-3 gap-4">
                    {searchElements(elementSearchQuery).map((element) => (
                      <button
                        key={element.id}
                        onClick={() => {
                          const dataURL = getElementSVGDataURL(element.svg);
                          const size = getResponsiveShapeSize(
                            { width: canvas.width, height: canvas.height },
                            'medium'
                          );
                          const { x, y } = getCenterPosition(
                            { width: canvas.width, height: canvas.height },
                            size,
                            size
                          );
                          addElement({
                            id: generateId('element'),
                            type: 'image',
                            x,
                            y,
                            width: size,
                            height: size,
                            rotation: 0,
                            zIndex: getNextZIndex(elements),
                            visible: true,
                            src: dataURL,
                          });
                        }}
                        className={cn(
                          "group relative aspect-square rounded-lg border border-border/20",
                          "hover:bg-accent/50 hover:border-primary/30 transition-all duration-200",
                          "flex flex-col items-center justify-center p-2",
                          "hover:scale-105 cursor-pointer"
                        )}
                        title={element.name}
                      >
                        <div 
                          className="w-16 h-16 flex items-center justify-center mb-1"
                          dangerouslySetInnerHTML={{ 
                            __html: element.svg.replace(
                              '<svg',
                              '<svg style="width: 100%; height: 100%; max-width: 64px; max-height: 64px;"'
                            )
                          }}
                        />
                        <p className="text-[9px] text-muted-foreground text-center leading-tight">
                          {element.name}
                        </p>
                      </button>
                    ))}
                  </div>
                </div>
              )
            ) : (
              // All Categories Displayed
              <>
                {ELEMENT_CATEGORIES.filter(cat => cat.id !== 'all').map((category) => {
                  const categoryElements = getElementsByCategory(category.id);
                  if (categoryElements.length === 0) return null;
                  
                  return (
                    <div key={category.id} className="space-y-3">
                      {/* Category Header */}
                      <div className="flex items-center gap-2 pb-2 border-b border-border/30">
                        <span className="text-lg">{category.icon}</span>
                        <h3 className="text-sm font-semibold text-foreground">
                          {category.label}
                        </h3>
                        <span className="text-xs text-muted-foreground ml-auto">
                          {categoryElements.length}
                        </span>
                      </div>
                      
                      {/* Category Elements Grid */}
                      <div className="grid grid-cols-3 gap-4">
                        {categoryElements.map((element) => (
                          <button
                            key={element.id}
                            onClick={() => {
                              const dataURL = getElementSVGDataURL(element.svg);
                              const size = getResponsiveShapeSize(
                                { width: canvas.width, height: canvas.height },
                                'medium'
                              );
                              const { x, y } = getCenterPosition(
                                { width: canvas.width, height: canvas.height },
                                size,
                                size
                              );
                              addElement({
                                id: generateId('element'),
                                type: 'image',
                                x,
                                y,
                                width: size,
                                height: size,
                                rotation: 0,
                                zIndex: getNextZIndex(elements),
                                visible: true,
                                src: dataURL,
                              });
                            }}
                            className={cn(
                              "group relative aspect-square rounded-lg border border-border/20",
                              "hover:bg-accent/50 hover:border-primary/30 transition-all duration-200",
                              "flex flex-col items-center justify-center p-2",
                              "hover:scale-105 cursor-pointer"
                            )}
                            title={element.name}
                          >
                            <div 
                              className="w-16 h-16 flex items-center justify-center mb-1"
                              dangerouslySetInnerHTML={{ 
                                __html: element.svg.replace(
                                  '<svg',
                                  '<svg style="width: 100%; height: 100%; max-width: 64px; max-height: 64px;"'
                                )
                              }}
                            />
                            <p className="text-[9px] text-muted-foreground text-center leading-tight">
                              {element.name}
                            </p>
                          </button>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </>
            )}
          </div>

          {/* Footer Info */}
          <div className="p-3 border-t border-border/30 bg-muted/20">
            <p className="text-[10px] text-muted-foreground text-center">
              30+ free elements • No attribution required
            </p>
          </div>
        </div>
      </>
    );
  }

  if (activeTab === 'background') {
    return <BackgroundPanel canvas={canvas} setCanvas={setCanvas} />;
  }

  if (activeTab === 'templates') {
    return (
      <div className="w-96 bg-gradient-to-b from-background via-background to-muted/20 border-r border-border/30 flex flex-col h-full overflow-hidden flex-shrink-0 backdrop-blur-sm">
        <div className="p-6 border-b border-border/50 bg-gradient-to-br from-background to-muted/30">
          <div className="flex items-center gap-2 mb-2">
            <FolderOpen className="w-5 h-5 text-primary" />
            <h3 className="text-foreground font-bold text-lg tracking-tight">Templates</h3>
          </div>
          <p className="text-xs text-muted-foreground">Pre-designed layouts</p>
        </div>
        
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="text-center max-w-sm">
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-muted/50 flex items-center justify-center">
              <Sparkles className="w-10 h-10 text-muted-foreground/50" />
            </div>
            <h4 className="text-lg font-semibold text-foreground mb-2">Templates Coming Soon</h4>
            <p className="text-sm text-muted-foreground mb-4">
              We're working on beautiful pre-designed templates to help you get started faster.
            </p>
            <p className="text-xs text-muted-foreground/70">
              In the meantime, create your own designs from scratch!
            </p>
          </div>
        </div>
      </div>
    );
  }

  // My Designs
  if (activeTab === 'designs') {
    return (
      <div className="w-96 bg-gradient-to-b from-background via-background to-muted/20 border-r border-border/30 flex flex-col h-full overflow-hidden flex-shrink-0 backdrop-blur-sm">
        <div className="p-4 border-b border-border">
          <h3 className="text-foreground font-semibold mb-2">My Designs</h3>
        </div>
        <div className="flex-1 overflow-y-auto p-4">
          {designs.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <FolderOpen className="text-gray-600 mb-2" size={48} />
              <p className="text-muted-foreground text-sm mb-4">No designs yet</p>
              <p className="text-gray-500 text-xs">Create a design and save it as a template</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              {designs.map((design) => (
                <div
                  key={design.id}
                  className="group relative cursor-pointer rounded-lg overflow-hidden border border-gray-700 hover:border-gray-600 transition-colors"
                  onClick={() => loadTemplate(design.id)}
                >
                  {design.thumbnail ? (
                    <img
                      src={design.thumbnail}
                      alt={design.name}
                      className="w-full aspect-[4/3] object-cover"
                    />
                  ) : (
                    <div className="w-full aspect-[4/3] bg-muted flex items-center justify-center">
                      <ImageIcon2 className="text-gray-600" size={32} />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-opacity flex items-center justify-center">
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity text-foreground text-xs font-semibold text-center px-2">
                      {design.name}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  // Icons
  if (activeTab === 'icons') {
    const filteredIcons = iconSearchQuery.trim()
      ? searchIcons(iconSearchQuery, selectedIconCategory)
      : getIconsByCategory(selectedIconCategory);

    const handleAddIcon = (icon: Icon) => {
      addElement({
        id: generateId('icon'),
        type: 'icon',
        x: canvas.width / 2 - 50,
        y: canvas.height / 2 - 50,
        width: 100,
        height: 100,
        rotation: 0,
        zIndex: getNextZIndex(elements),
        visible: true,
        iconId: icon.id,
        iconName: icon.name,
        iconPath: icon.svgPath || '',
        fill: '#000000', // Default black, can be edited
        stroke: undefined,
        strokeWidth: 0,
      });
    };

    return (
      <div className="w-96 bg-gradient-to-b from-background via-background to-muted/20 border-r border-border/30 flex flex-col h-full overflow-hidden flex-shrink-0 backdrop-blur-sm">
        <div className="p-6 border-b border-border/50 bg-gradient-to-br from-background to-muted/30">
          <div className="flex items-center gap-2 mb-2">
            <Shapes className="w-5 h-5 text-primary" />
            <h3 className="text-foreground font-bold text-lg tracking-tight">Icons</h3>
          </div>
          <p className="text-xs text-muted-foreground mb-4">Professional icons • Click to add</p>
          
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={16} />
            <Input
              placeholder="Search icons..."
              value={iconSearchQuery}
              onChange={(e) => setIconSearchQuery(e.target.value)}
              className="pl-10 bg-gradient-to-r from-accent/30 via-accent/50 to-accent/30 backdrop-blur-sm border-border/50 text-foreground text-sm h-10 rounded-xl focus-visible:ring-2 focus-visible:ring-primary/20"
            />
          </div>

          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {Object.entries(ICON_CATEGORIES).map(([id, label]) => (
              <button
                key={id}
                onClick={() => setSelectedIconCategory(id)}
                className={cn(
                  "relative px-4 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition-all duration-300 flex-shrink-0",
                  selectedIconCategory === id
                    ? "bg-gradient-to-br from-primary to-primary/80 text-primary-foreground shadow-lg shadow-primary/30 scale-105"
                    : "bg-muted/50 text-muted-foreground hover:bg-accent/50 hover:text-foreground hover:scale-110"
                )}
              >
                {selectedIconCategory === id && (
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-primary/20 to-transparent blur-xl -z-10 opacity-75" />
                )}
                {label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {filteredIcons.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-center">
              <div className="relative">
                <div className="absolute inset-0 bg-primary/10 blur-3xl rounded-full" />
                <Shapes className="w-16 h-16 text-muted-foreground/50 mb-4 relative" />
              </div>
              <h4 className="text-sm font-semibold text-foreground mb-2">No icons found</h4>
              <p className="text-xs text-muted-foreground">Try a different search term</p>
            </div>
          ) : (
            <div className="grid grid-cols-6 gap-3">
              {filteredIcons.map((icon) => {
                const svgDataURL = getIconSVGDataURL(icon, 24, '#000000');
                
                return (
                  <button
                    key={icon.id}
                    onClick={() => handleAddIcon(icon)}
                    className="group relative aspect-square rounded-xl bg-muted/50 border border-border/20 hover:bg-accent hover:border-primary/30 transition-all duration-200 flex items-center justify-center hover:scale-110 hover:shadow-lg"
                    title={icon.name}
                  >
                    <img 
                      src={svgDataURL} 
                      alt={icon.name}
                      className="w-6 h-6 opacity-70 group-hover:opacity-100 transition-all duration-200 group-hover:scale-110"
                    />
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>
    );
  }

  // Draw
  if (activeTab === 'draw') {
    return (
      <div className="w-96 bg-gradient-to-b from-background via-background to-muted/20 border-r border-border/30 flex flex-col h-full overflow-hidden flex-shrink-0 backdrop-blur-sm">
        <div className="p-6 border-b border-border/50 bg-gradient-to-br from-background to-muted/30">
          <div className="flex items-center gap-2 mb-2">
            <PenTool className="w-5 h-5 text-primary" />
            <h3 className="text-foreground font-bold text-lg tracking-tight">Draw</h3>
          </div>
          <p className="text-xs text-muted-foreground">Create custom drawings</p>
        </div>
        <div className="flex-1 overflow-y-auto p-6">
          <div className="space-y-6">
            <div>
              <label className="text-sm font-medium mb-3 block text-foreground">Brush Size</label>
              <input
                type="range"
                min={1}
                max={50}
                value={brushSize}
                onChange={(e) => setBrushSize(parseInt(e.target.value))}
                className="w-full accent-primary"
              />
              <div className="text-xs text-muted-foreground mt-2 text-center font-mono">{brushSize}px</div>
            </div>
            
            <div>
              <label className="text-sm font-medium mb-3 block text-foreground">Brush Color</label>
              <input
                type="color"
                value={brushColor}
                onChange={(e) => setBrushColor(e.target.value)}
                className="w-full h-12 border-2 border-border/50 rounded-xl cursor-pointer hover:border-primary/50 transition-colors"
              />
            </div>

            <div className="pt-4 border-t border-border/50">
              <p className="text-sm font-medium mb-3 text-foreground">Drawing Tools</p>
              <div className="grid grid-cols-1 gap-3">
                <button
                  className={cn(
                    "group relative h-20 rounded-xl border-2 transition-all duration-300 hover:shadow-lg flex flex-col items-center justify-center cursor-pointer",
                    isDrawingMode
                      ? "bg-gradient-to-br from-primary to-primary/80 border-primary text-primary-foreground shadow-lg shadow-primary/30 scale-105"
                      : "bg-gradient-to-br from-muted/50 to-muted/30 border-border/20 hover:border-primary/30 hover:scale-105"
                  )}
                  onClick={() => {
                    setDrawingMode(!isDrawingMode);
                  }}
                >
                  {isDrawingMode && (
                    <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-primary/20 to-transparent blur-xl -z-10 opacity-75" />
                  )}
                  <PenTool size={24} className="mb-1 group-hover:scale-110 transition-transform" />
                  <span className="text-sm font-medium">{isDrawingMode ? 'Drawing Mode Active' : 'Start Free Drawing'}</span>
                  {isDrawingMode && (
                    <span className="text-xs opacity-80 mt-1">Click to exit</span>
                  )}
                </button>
                <button
                  className="group relative h-20 rounded-xl bg-gradient-to-br from-muted/50 to-muted/30 border border-border/20 hover:border-primary/30 hover:scale-105 transition-all duration-300 hover:shadow-lg flex flex-col items-center justify-center cursor-pointer"
                  onClick={() => {
                    // Add line element
                    addElement({
                      id: generateId('shape'),
                      type: 'shape',
                      shapeType: 'line',
                      x: canvas.width / 2 - 50,
                      y: canvas.height / 2,
                      width: 100,
                      height: 0,
                      rotation: 0,
                      zIndex: getNextZIndex(elements),
                      visible: true,
                      fill: 'transparent', // Lines don't use fill, but required by type
                      stroke: brushColor,
                      strokeWidth: brushSize,
                    });
                  }}
                >
                  <Sparkles size={20} className="mb-1 group-hover:scale-110 transition-transform" />
                  <span className="text-xs font-medium">Line</span>
                </button>
              </div>
              <p className="text-xs text-muted-foreground mt-4 text-center">Click a tool to add it to the canvas</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Videos
  if (activeTab === 'videos') {

    const sampleVideos = [
      {
        id: 'sample1',
        thumbnail: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjNDI4NWY0Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIyNCIgZmlsbD0iI2ZmZiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkJsdWUgU2FtcGxlPC90ZXh0Pjwvc3ZnPg==',
        url: 'https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/360/Big_Buck_Bunny_360_10s_1MB.mp4',
        title: 'Blue Sample',
        duration: '0:10'
      },
      {
        id: 'sample2',
        thumbnail: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZWE0MzM1Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIyNCIgZmlsbD0iI2ZmZiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPlJlZCBTYW1wbGU8L3RleHQ+PC9zdmc+',
        url: 'https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/360/Big_Buck_Bunny_360_10s_2MB.mp4',
        title: 'Red Sample',
        duration: '0:10'
      },
      {
        id: 'sample3',
        thumbnail: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjMzRhODUzIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIyNCIgZmlsbD0iI2ZmZiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkdyZWVuIFNhbXBsZTwvdGV4dD48L3N2Zz4=',
        url: 'https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/360/Big_Buck_Bunny_360_10s_5MB.mp4',
        title: 'Green Sample',
        duration: '0:10'
      },
      {
        id: 'sample4',
        thumbnail: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZmJiYzA1Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIyNCIgZmlsbD0iIzAwMCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPlllbGxvdyBTYW1wbGU8L3RleHQ+PC9zdmc+',
        url: 'https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/720/Big_Buck_Bunny_720_10s_1MB.mp4',
        title: 'Yellow Sample',
        duration: '0:10'
      },
      {
        id: 'sample5',
        thumbnail: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjOWMyN2IwIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIyNCIgZmlsbD0iI2ZmZiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPlB1cnBsZSBTYW1wbGU8L3RleHQ+PC9zdmc+',
        url: 'https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/720/Big_Buck_Bunny_720_10s_2MB.mp4',
        title: 'Purple Sample',
        duration: '0:10'
      },
      {
        id: 'sample6',
        thumbnail: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZmY2ZDAwIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIyNCIgZmlsbD0iI2ZmZiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPk9yYW5nZSBTYW1wbGU8L3RleHQ+PC9zdmc+',
        url: 'https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/720/Big_Buck_Bunny_720_10s_5MB.mp4',
        title: 'Orange Sample',
        duration: '0:10'
      },
    ];

    const filteredVideos = sampleVideos.filter(video =>
      !videoSearchQuery.trim() || video.title.toLowerCase().includes(videoSearchQuery.toLowerCase())
    );

    const handleAddVideo = (videoUrl: string, videoTitle?: string) => {
      console.log('🎬 [ContentPanel] Adding video:', videoUrl);
      const videoElement = {
        id: generateId('video'),
        type: 'video' as const,
        x: canvas.width / 2 - 200,
        y: canvas.height / 2 - 150,
        width: 400,
        height: 300,
        rotation: 0,
        zIndex: getNextZIndex(elements),
        visible: true,
        src: videoUrl,
        poster: undefined,
        autoplay: false,
        loop: false,
        muted: true,
        controls: true,
        provider: (videoUrl.includes('youtube.com') || videoUrl.includes('youtu.be') ? 'youtube' :
                 videoUrl.includes('vimeo.com') ? 'vimeo' : 'file') as 'file' | 'youtube' | 'vimeo',
      };
      console.log('🎬 [ContentPanel] Video element created:', videoElement);
      addElement(videoElement);
      console.log('🎬 [ContentPanel] addElement called, elements count:', elements.length + 1);
    };

    return (
      <div className="w-96 bg-gradient-to-b from-background via-background to-muted/20 border-r border-border/30 flex flex-col h-full overflow-hidden flex-shrink-0 backdrop-blur-sm">
        <div className="p-6 border-b border-border/50 bg-gradient-to-br from-background to-muted/30">
          <div className="flex items-center gap-2 mb-2">
            <Play className="w-5 h-5 text-primary" />
            <h3 className="text-foreground font-bold text-lg tracking-tight">Videos</h3>
          </div>
          <p className="text-xs text-muted-foreground mb-4">Stock videos • Click to add</p>
          
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={16} />
            <Input
              placeholder="Search videos..."
              value={videoSearchQuery}
              onChange={(e) => setVideoSearchQuery(e.target.value)}
              className="pl-10 bg-gradient-to-r from-accent/30 via-accent/50 to-accent/30 backdrop-blur-sm border-border/50 text-foreground text-sm h-10 rounded-xl focus-visible:ring-2 focus-visible:ring-primary/20"
            />
          </div>

          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {['all', 'business', 'nature', 'technology'].map((category) => (
              <button
                key={category}
                onClick={() => setSelectedVideoCategory(category)}
                className={cn(
                  "relative px-4 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition-all duration-300 flex-shrink-0",
                  selectedVideoCategory === category
                    ? "bg-gradient-to-br from-primary to-primary/80 text-primary-foreground shadow-lg shadow-primary/30 scale-105"
                    : "bg-muted/50 text-muted-foreground hover:bg-accent/50 hover:text-foreground hover:scale-110"
                )}
              >
                {selectedVideoCategory === category && (
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-primary/20 to-transparent blur-xl -z-10 opacity-75" />
                )}
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {filteredVideos.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-center">
              <div className="relative">
                <div className="absolute inset-0 bg-primary/10 blur-3xl rounded-full" />
                <Play className="w-16 h-16 text-muted-foreground/50 mb-4 relative" />
              </div>
              <h4 className="text-sm font-semibold text-foreground mb-2">No videos found</h4>
              <p className="text-xs text-muted-foreground">Try a different search or category</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4">
              {filteredVideos.map((video) => (
                <div
                  key={video.id}
                  className="group relative aspect-video rounded-xl overflow-hidden cursor-pointer bg-muted/50 border border-border/20 hover:border-primary/30 hover:scale-105 transition-all duration-300 hover:shadow-lg"
                  onClick={() => handleAddVideo(video.url, video.title)}
                >
                  <img
                    src={video.thumbnail}
                    alt={video.title}
                    className="w-full h-full object-cover"
                    loading="lazy"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300"%3E%3Crect fill="%23333" width="400" height="300"/%3E%3Ctext fill="%23666" x="50%25" y="50%25" text-anchor="middle" dominant-baseline="middle"%3EVideo%3C/text%3E%3C/svg%3E';
                    }}
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-300 flex items-center justify-center">
                    <Play className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" size={36} />
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-2">
                    <p className="text-white text-xs font-medium truncate">{video.title}</p>
                    {video.duration && (
                      <p className="text-white/70 text-xs">{video.duration}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  // Fonts tab - Now with 1000+ Google Fonts!
  if (activeTab === 'fonts') {
    return (
      <div className="w-96 bg-background border-r border-border flex flex-col h-full overflow-hidden flex-shrink-0">
        <GoogleFontSelector
          selectedFont={selectedFont}
          selectedWeight="400"
          onFontSelect={(font, weight) => {
            setSelectedFont(font);
            // Update selected text element if any
            const elementsArray = Array.isArray(elements) ? elements : [];
            const selectedTextElement = elementsArray.find((el: any) => 
              el.type === 'text'
            );
            if (selectedTextElement) {
              const updateElement = useEditorStore.getState().updateElement;
              updateElement(selectedTextElement.id, {
                fontFamily: font,
                fontWeight: weight ? parseInt(weight) : 400
              });
            }
          }}
        />
      </div>
    );
  }

  // Audio tab
  if (activeTab === 'audio') {
    return (
      <div className="w-96 bg-gradient-to-b from-background via-background to-muted/20 border-r border-border/30 flex flex-col h-full overflow-hidden flex-shrink-0 backdrop-blur-sm">
        <div className="p-6 border-b border-border/50 bg-gradient-to-br from-background to-muted/30">
          <div className="flex items-center gap-2 mb-2">
            <Mic className="w-5 h-5 text-primary" />
            <h3 className="text-foreground font-bold text-lg tracking-tight">Audio</h3>
          </div>
          <p className="text-xs text-muted-foreground">Music & sound effects</p>
        </div>
        <div className="flex-1 flex items-center justify-center p-6">
          <div className="text-center">
            <div className="relative mb-4">
              <div className="absolute inset-0 bg-primary/10 blur-3xl rounded-full" />
              <Mic className="w-16 h-16 text-muted-foreground/50 mx-auto relative" />
            </div>
            <h4 className="text-sm font-semibold text-foreground mb-2">Audio Library</h4>
            <p className="text-xs text-muted-foreground">Coming soon</p>
          </div>
        </div>
      </div>
    );
  }

  // Default empty state
  return (
    <div className="w-96 bg-gradient-to-b from-background via-background to-muted/20 border-r border-border/30 flex flex-col h-full backdrop-blur-sm">
      <div className="p-6 border-b border-border/50 bg-gradient-to-br from-background to-muted/30">
        <h3 className="text-foreground font-bold text-lg tracking-tight">{activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}</h3>
      </div>
      <div className="flex-1 flex items-center justify-center">
        <p className="text-muted-foreground text-sm">Coming soon</p>
      </div>
    </div>
  );
}


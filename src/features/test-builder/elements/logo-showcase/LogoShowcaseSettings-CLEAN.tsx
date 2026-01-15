"use client";

import { useState, useEffect, useRef } from 'react';
import { LogoItem, LogoShowcaseSettings, defaultLogoShowcaseSettings } from './types';
import { uid, fileToDataUrl, createProfessionalLogo } from './utils';
import { 
  Trash2, Plus, Upload, Link as LinkIcon, Palette, Play, Edit2, 
  Image as ImageIcon, Sparkles, Grid3x3, Zap
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { SectionCard } from '../../element-settings/shared/SectionCard';
import { EnhancedSlider } from '../../element-settings/shared/EnhancedSlider';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

type Props = {
  node: { id: string; props: Record<string, any> };
  updateProps: (updates: any) => void;
};

export default function LogoShowcaseSettingsPanel({ node, updateProps }: Props) {
  const [logos, setLogos] = useState<LogoItem[]>(node.props.logos || []);
  const [settings, setSettings] = useState<LogoShowcaseSettings>(
    node.props.settings || defaultLogoShowcaseSettings
  );
  const [editingLogoIndex, setEditingLogoIndex] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState('content');
  const [showBgRemovalModal, setShowBgRemovalModal] = useState(false);
  const [pendingLogoForBgRemoval, setPendingLogoForBgRemoval] = useState<{index: number, src: string} | null>(null);
  const [isRemovingBg, setIsRemovingBg] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const replaceInputRefs = useRef<{[key: number]: HTMLInputElement}>({});

  useEffect(() => {
    setLogos(node.props.logos || []);
  }, [node.props.logos]);

  useEffect(() => {
    setSettings(node.props.settings || defaultLogoShowcaseSettings);
  }, [node.props.settings]);

  function updateLogos(next: LogoItem[]) {
    setLogos(next);
    updateProps({ logos: next });
  }

  function updateSettings(patch: Partial<LogoShowcaseSettings>) {
    const next = { ...settings, ...patch };
    setSettings(next);
    updateProps({ settings: next });
  }

  // Remove background using @imgly/background-removal
  const removeBackground = async (imageSrc: string): Promise<string> => {
    try {
      console.log('Starting background removal...');
      
      // Dynamically import the library (code splitting)
      console.log('Importing background removal library...');
      const bgRemoval = await import('@imgly/background-removal');
      console.log('Library imported successfully');
      
      // Convert data URL to blob
      console.log('Converting image to blob...');
      const response = await fetch(imageSrc);
      const blob = await response.blob();
      console.log('Blob created, size:', blob.size, 'type:', blob.type);
      
      // Remove background (runs in browser with WebAssembly)
      console.log('Processing image with AI model...');
      const resultBlob = await bgRemoval.removeBackground(blob);
      console.log('Background removed successfully, result size:', resultBlob.size);
      
      // Convert blob to data URL
      console.log('Converting result to data URL...');
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          console.log('Conversion complete');
          resolve(reader.result as string);
        };
        reader.onerror = (error) => {
          console.error('FileReader error:', error);
          reject(error);
        };
        reader.readAsDataURL(resultBlob);
      });
    } catch (error) {
      console.error('Background removal failed with error:', error);
      console.error('Error details:', {
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined,
        error
      });
      throw error;
    }
  };

  const handleBgRemovalConfirm = async () => {
    if (!pendingLogoForBgRemoval) return;
    
    setIsRemovingBg(true);
    try {
      const processedSrc = await removeBackground(pendingLogoForBgRemoval.src);
      const next = [...logos];
      next[pendingLogoForBgRemoval.index] = { 
        ...next[pendingLogoForBgRemoval.index], 
        src: processedSrc 
      };
      updateLogos(next);
    } catch (error) {
      console.error('Background removal failed:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      alert(`Background removal failed: ${errorMessage}\n\nPlease check the browser console for more details.`);
      
      // Don't close modal on error, let user try again or cancel
      setIsRemovingBg(false);
      return;
    }
    
    // Only close modal and reset on success
    setIsRemovingBg(false);
    setShowBgRemovalModal(false);
    setPendingLogoForBgRemoval(null);
  };

  // Handle file upload for new logo
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const dataUrl = await fileToDataUrl(file);
      const logoNumber = logos.length + 1;
      const newItem: LogoItem = {
        id: uid('logo-'),
        src: dataUrl,
        alt: `Logo ${logoNumber}`,
        visible: true,
        opacity: 1
      };
      
      const newLogos = [...logos, newItem];
      updateLogos(newLogos);
      setEditingLogoIndex(logos.length);
      
      // Ask if user wants to remove background
      setPendingLogoForBgRemoval({ index: logos.length, src: dataUrl });
      setShowBgRemovalModal(true);
    } catch (e) {
      console.error(e);
      alert('Upload failed');
    }
  };

  // Handle replacing an existing logo's image
  const handleReplaceImage = async (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const dataUrl = await fileToDataUrl(file);
      
      // Ask if user wants to remove background
      setPendingLogoForBgRemoval({ index, src: dataUrl });
      setShowBgRemovalModal(true);
    } catch (e) {
      console.error(e);
      alert('Upload failed');
    }
  };

  const addPlaceholder = () => {
    const logoNumber = logos.length + 1;
    const logoId = logos.length % 6;
    const newItem: LogoItem = {
      id: uid('logo-'),
      src: createProfessionalLogo(logoId),
      alt: `Logo ${logoNumber}`,
      visible: true,
      opacity: 1
    };
    updateLogos([...logos, newItem]);
    setEditingLogoIndex(logos.length);
  };

  const removeAt = (i: number) => {
    const next = logos.slice();
    next.splice(i, 1);
    updateLogos(next);
    if (editingLogoIndex === i) setEditingLogoIndex(null);
  };

  const setLogoField = (i: number, patch: Partial<LogoItem>) => {
    const next = logos.slice();
    next[i] = { ...next[i], ...patch };
    updateLogos(next);
  };

  return (
    <div className="h-full flex flex-col bg-gray-50 dark:bg-gray-900">
      {/* Background Removal Modal */}
      <Dialog open={showBgRemovalModal} onOpenChange={setShowBgRemovalModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Sparkles className="text-primary" size={20} />
              Remove Background?
            </DialogTitle>
            <DialogDescription>
              Would you like to automatically remove the white background from this logo? 
              This will make it transparent and look more professional.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={() => {
                // Just upload without bg removal
                if (pendingLogoForBgRemoval) {
                  const next = [...logos];
                  next[pendingLogoForBgRemoval.index] = {
                    ...next[pendingLogoForBgRemoval.index],
                    src: pendingLogoForBgRemoval.src
                  };
                  updateLogos(next);
                }
                setShowBgRemovalModal(false);
                setPendingLogoForBgRemoval(null);
              }}
              disabled={isRemovingBg}
            >
              No, Keep Background
            </Button>
            <Button
              onClick={handleBgRemovalConfirm}
              disabled={isRemovingBg}
              className="gap-2"
            >
              {isRemovingBg ? (
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

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col overflow-hidden">
        <TabsList className="w-full grid grid-cols-3 rounded-none border-b">
          <TabsTrigger value="content" className="rounded-none">
            <Grid3x3 size={14} className="mr-2" />
            Content
          </TabsTrigger>
          <TabsTrigger value="design" className="rounded-none">
            <Palette size={14} className="mr-2" />
            Design
          </TabsTrigger>
          <TabsTrigger value="behavior" className="rounded-none">
            <Zap size={14} className="mr-2" />
            Behavior
          </TabsTrigger>
        </TabsList>

        <div className="flex-1 overflow-y-auto">
          {/* Content Tab */}
          <TabsContent value="content" className="p-4 space-y-4 m-0">
            <SectionCard id="carousel-mode" title="Carousel Mode" icon={Play}>
              <div className="space-y-3">
                <div>
                  <Label className="text-xs">Display Mode</Label>
                  <Select
                    value={settings.mode}
                    onValueChange={(v: any) => updateSettings({ mode: v })}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ticker">
                        <div className="flex flex-col items-start">
                          <span className="font-medium">Ticker (Continuous Scroll)</span>
                          <span className="text-xs text-muted-foreground">Logos scroll continuously</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="manual">
                        <div className="flex flex-col items-start">
                          <span className="font-medium">Manual Carousel</span>
                          <span className="text-xs text-muted-foreground">Click arrows to navigate</span>
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Manual Mode Settings */}
                {settings.mode === 'manual' && (
                  <>
                    <Separator />
                    <div>
                      <Label className="text-xs mb-2 block">Logos Per Slide</Label>
                      <EnhancedSlider
                        label="Logos"
                        value={settings.manual.logosPerSlide}
                        onChange={(v) => updateSettings({ manual: { ...settings.manual, logosPerSlide: v } })}
                        min={1}
                        max={8}
                        step={1}
                        tooltip="How many logos to show at once"
                      />
                    </div>

                    <Separator />

                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-xs">Show Navigation Arrows</Label>
                        <p className="text-xs text-muted-foreground">Left/right arrows</p>
                      </div>
                      <Switch
                        checked={settings.manual.showArrows}
                        onCheckedChange={(v) => updateSettings({ manual: { ...settings.manual, showArrows: v } })}
                      />
                    </div>

                    <Separator />

                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-xs">Show Pagination Dots</Label>
                        <p className="text-xs text-muted-foreground">Dots below carousel</p>
                      </div>
                      <Switch
                        checked={settings.manual.showDots}
                        onCheckedChange={(v) => updateSettings({ manual: { ...settings.manual, showDots: v } })}
                      />
                    </div>
                  </>
                )}
              </div>
            </SectionCard>

            <SectionCard id="logos" title="Logo Management" icon={ImageIcon}>
              <div className="space-y-3">
                {/* Add Logo Buttons */}
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    onClick={() => fileInputRef.current?.click()}
                    variant="outline"
                    size="sm"
                    className="flex flex-col items-center gap-1 h-auto py-3"
                  >
                    <Upload size={18} />
                    <span className="text-xs">Upload Logo</span>
                  </Button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleFileUpload}
                  />
                  <Button 
                    onClick={addPlaceholder} 
                    variant="outline" 
                    size="sm"
                    className="flex flex-col items-center gap-1 h-auto py-3"
                  >
                    <Plus size={18} />
                    <span className="text-xs">Add Placeholder</span>
                  </Button>
                </div>

                <Separator />

                {/* Logo List */}
                <div className="space-y-2 max-h-96 overflow-auto">
                  {logos.map((logo, i) => {
                    const isEditing = editingLogoIndex === i;
                    return (
                      <div
                        key={logo.id}
                        onClick={() => setEditingLogoIndex(i)}
                        className={cn(
                          "flex items-start gap-2 p-2 border rounded-lg transition-all cursor-pointer",
                          isEditing
                            ? "border-primary bg-primary/5 ring-2 ring-primary/20"
                            : "border-border bg-card hover:bg-accent/50 hover:border-primary/50"
                        )}
                      >
                        {/* Logo Preview */}
                        <div
                          className={cn(
                            "w-20 h-14 bg-muted flex items-center justify-center overflow-hidden rounded border transition-all flex-shrink-0",
                            isEditing ? "border-primary ring-1 ring-primary/30" : "border-border"
                          )}
                        >
                          <img
                            src={logo.src}
                            alt={logo.alt}
                            className="max-h-full max-w-full object-contain"
                          />
                        </div>

                        {/* Logo Fields */}
                        <div className="flex-1 space-y-2 min-w-0">
                          {isEditing && (
                            <div className="flex items-center gap-1 text-xs font-medium text-primary">
                              <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                              Editing
                            </div>
                          )}
                          
                          {/* Alt Text */}
                          <Input
                            value={logo.alt || ''}
                            onChange={e => setLogoField(i, { alt: e.target.value })}
                            onFocus={() => setEditingLogoIndex(i)}
                            placeholder="Logo name / alt text"
                            className={cn("h-8 text-sm", isEditing && "border-primary")}
                          />

                          {/* Link URL */}
                          <div className="flex gap-1">
                            <LinkIcon size={14} className="text-muted-foreground mt-2 flex-shrink-0" />
                            <Input
                              value={logo.url || ''}
                              onChange={e => setLogoField(i, { url: e.target.value })}
                              onFocus={() => setEditingLogoIndex(i)}
                              placeholder="Link URL (optional)"
                              className={cn("h-8 text-sm", isEditing && "border-primary")}
                            />
                          </div>

                          {/* Action Buttons */}
                          <div className="flex gap-1">
                            <label className="flex-1 cursor-pointer">
                              <input
                                ref={(el) => {
                                  if (el) replaceInputRefs.current[i] = el;
                                }}
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={(e) => handleReplaceImage(i, e)}
                              />
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className="h-7 text-xs w-full"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  replaceInputRefs.current[i]?.click();
                                }}
                              >
                                <Edit2 size={12} className="mr-1" /> Replace
                              </Button>
                            </label>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="h-7 text-xs gap-1"
                              onClick={(e) => {
                                e.stopPropagation();
                                setPendingLogoForBgRemoval({ index: i, src: logo.src });
                                setShowBgRemovalModal(true);
                              }}
                            >
                              <Sparkles size={12} /> Remove BG
                            </Button>
                          </div>
                        </div>

                        {/* Delete Button */}
                        <Button
                          onClick={(e) => {
                            e.stopPropagation();
                            removeAt(i);
                          }}
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 text-destructive hover:text-destructive hover:bg-destructive/10 flex-shrink-0"
                        >
                          <Trash2 size={14} />
                        </Button>
                      </div>
                    );
                  })}
                  {logos.length === 0 && (
                    <div className="text-center py-8 text-sm text-muted-foreground">
                      No logos added yet. Click "Upload Logo" or "Add Placeholder" to get started.
                    </div>
                  )}
                </div>
              </div>
            </SectionCard>
          </TabsContent>

          {/* Design Tab */}
          <TabsContent value="design" className="p-4 space-y-4 m-0">
            <SectionCard id="appearance" title="Appearance" icon={Palette}>
              <div className="space-y-4">
                {/* Logo Height */}
                <div>
                  <Label className="text-xs mb-2 block">Logo Height</Label>
                  <EnhancedSlider
                    label="Height"
                    value={settings.style.logoHeight}
                    onChange={(v) => updateSettings({ style: { ...settings.style, logoHeight: v } })}
                    min={30}
                    max={150}
                    step={5}
                    unit="px"
                    tooltip="Maximum height for logos"
                  />
                </div>

                <Separator />

                {/* Logo Spacing */}
                <div>
                  <Label className="text-xs mb-2 block">Logo Spacing</Label>
                  <EnhancedSlider
                    label="Spacing"
                    value={settings.style.logoSpacing}
                    onChange={(v) => updateSettings({ style: { ...settings.style, logoSpacing: v } })}
                    min={16}
                    max={100}
                    step={4}
                    unit="px"
                    tooltip="Gap between logos"
                  />
                </div>

                <Separator />

                {/* Padding */}
                <div>
                  <Label className="text-xs mb-2 block">Container Padding</Label>
                  <EnhancedSlider
                    label="Padding"
                    value={settings.style.padding}
                    onChange={(v) => updateSettings({ style: { ...settings.style, padding: v } })}
                    min={0}
                    max={80}
                    step={4}
                    unit="px"
                    tooltip="Padding around the logo showcase"
                  />
                </div>

                <Separator />

                {/* Grayscale */}
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-xs">Grayscale Filter</Label>
                    <p className="text-xs text-muted-foreground">Convert logos to grayscale</p>
                  </div>
                  <Switch
                    checked={settings.style.grayscale}
                    onCheckedChange={(v) => updateSettings({ style: { ...settings.style, grayscale: v } })}
                  />
                </div>

                <Separator />

                {/* Background Color */}
                <div>
                  <Label className="text-xs mb-2 block">Background Color</Label>
                  <div className="flex gap-2">
                    <Input
                      type="color"
                      value={settings.style.background || '#ffffff'}
                      onChange={(e) => updateSettings({ style: { ...settings.style, background: e.target.value } })}
                      className="h-10 w-20"
                    />
                    <Input
                      type="text"
                      value={settings.style.background || '#ffffff'}
                      onChange={(e) => updateSettings({ style: { ...settings.style, background: e.target.value } })}
                      placeholder="#ffffff"
                      className="flex-1"
                    />
                  </div>
                </div>
              </div>
            </SectionCard>
          </TabsContent>

          {/* Behavior Tab */}
          <TabsContent value="behavior" className="p-4 space-y-4 m-0">
            <SectionCard id="animation" title="Animation Settings" icon={Zap}>
              <div className="space-y-4">
                {/* Speed */}
                <div>
                  <Label className="text-xs mb-2 block">
                    {settings.mode === 'ticker' ? 'Scroll Speed' : 'Transition Speed'}
                  </Label>
                  <EnhancedSlider
                    label="Speed"
                    value={settings.animation.speed}
                    onChange={(v) => updateSettings({ animation: { ...settings.animation, speed: v } })}
                    min={1}
                    max={10}
                    step={1}
                    tooltip={settings.mode === 'ticker' ? 'How fast logos scroll' : 'Transition duration'}
                  />
                  <p className="text-xs text-muted-foreground mt-2">
                    {settings.mode === 'ticker' 
                      ? '1 = Slow, 10 = Fast' 
                      : '1 = Slow transition, 10 = Fast transition'}
                  </p>
                </div>

                <Separator />

                {/* Direction */}
                <div>
                  <Label className="text-xs">Scroll Direction</Label>
                  <Select
                    value={settings.animation.direction}
                    onValueChange={(v: any) => updateSettings({ animation: { ...settings.animation, direction: v } })}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="left">← Left to Right</SelectItem>
                      <SelectItem value="right">→ Right to Left</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Separator />

                {/* Pause on Hover */}
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-xs">Pause on Hover</Label>
                    <p className="text-xs text-muted-foreground">Stop animation when hovering</p>
                  </div>
                  <Switch
                    checked={settings.animation.pauseOnHover}
                    onCheckedChange={(v) => updateSettings({ animation: { ...settings.animation, pauseOnHover: v } })}
                  />
                </div>
              </div>
            </SectionCard>

            <SectionCard id="hover-effects" title="Hover Effects" icon={Sparkles}>
              <div className="space-y-4">
                <div>
                  <Label className="text-xs">Effect Type</Label>
                  <Select
                    value={settings.hover.effect}
                    onValueChange={(v: any) => updateSettings({ hover: { ...settings.hover, effect: v } })}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">None</SelectItem>
                      <SelectItem value="grow">Grow (Scale Up)</SelectItem>
                      <SelectItem value="lift">Lift (Move Up)</SelectItem>
                      <SelectItem value="brighten">Brighten</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground mt-2">
                    Visual effect when hovering over logos
                  </p>
                </div>
              </div>
            </SectionCard>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}

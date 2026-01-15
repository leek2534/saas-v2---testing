"use client";



import React, { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { Video, Palette, Zap, Search, Wand2, Play, Youtube, Film, Upload, Image as ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { EnhancedColorPicker } from './shared/EnhancedColorPicker';
import { EnhancedSlider } from './shared/EnhancedSlider';
import { SectionCard } from './shared/SectionCard';
import { VideoGallery } from './VideoGallery';
import { AlignmentControls } from '../components/AlignmentControls';
import { ImageLibraryModal } from '../ImageLibraryModal';
import '../styles/animated-borders.css';

interface VideoSettingsProps {
  node: { id: string; type: string; props: Record<string, any> };
  updateProps: (updates: Record<string, any>) => void;
}

// Video Presets
const VIDEO_PRESETS = [
  {
    id: 'hero-background',
    name: 'Hero Background Video',
    description: 'Fills section, muted autoplay, dark overlay, centered',
    icon: Film,
    props: {
      source: 'youtube',
      aspectRatio: '16:9',
      autoplay: true,
      muted: true,
      loop: true,
      controls: false,
      alignment: 'center',
      overlay: true,
      overlayColor: '#000000',
      overlayOpacity: 40,
      borderRadius: 0,
      boxShadow: false,
      responsiveMode: 'fill',
    }
  },
  {
    id: 'floating-promo',
    name: 'Floating Promo Clip',
    description: 'Smaller size, shadowed, bottom-right corner, rounded',
    icon: Play,
    props: {
      source: 'youtube',
      aspectRatio: '16:9',
      autoplay: false,
      muted: false,
      loop: false,
      controls: true,
      alignment: 'right',
      borderRadius: 16,
      boxShadow: true,
      padding: 20,
      hoverEffect: 'scale',
      responsiveMode: 'fit',
    }
  },
  {
    id: 'tutorial-player',
    name: 'Tutorial Player',
    description: 'Fixed ratio, bordered, with visible controls and title text',
    icon: Video,
    props: {
      source: 'youtube',
      aspectRatio: '16:9',
      autoplay: false,
      muted: false,
      loop: false,
      controls: true,
      alignment: 'center',
      borderRadius: 12,
      boxShadow: true,
      title: 'Tutorial Video',
      responsiveMode: 'fit',
    }
  },
];

export function VideoSettings({ node, updateProps }: VideoSettingsProps) {
  const props = node.props;
  const [showImageLibrary, setShowImageLibrary] = useState(false);
  const [activeTab, setActiveTab] = useState('content');
  const [showPresets, setShowPresets] = useState(false);
  const [showGallery, setShowGallery] = useState(false);

  const applyPreset = (preset: typeof VIDEO_PRESETS[0]) => {
    updateProps({ ...preset.props, presetId: preset.id });
    setShowPresets(false);
  };

  return (
    <div className="h-full flex flex-col bg-gray-50 dark:bg-gray-900">
      {/* Presets Bar */}
      <div className="p-3 bg-card border-b border-border">
        <button
          onClick={() => setShowPresets(!showPresets)}
          className="w-full flex items-center justify-between p-2 hover:bg-accent rounded-lg transition-colors"
        >
          <div className="flex items-center gap-2">
            <Wand2 size={14} className="text-primary" />
            <span className="text-xs font-semibold text-foreground">Video Presets</span>
          </div>
          <span className="text-xs text-foreground">{showPresets ? 'Hide' : 'Show'}</span>
        </button>

        {showPresets && (
          <div className="grid grid-cols-1 gap-2 mt-3">
            {VIDEO_PRESETS.map((preset) => {
              const Icon = preset.icon;
              return (
                <button
                  key={preset.id}
                  onClick={() => applyPreset(preset)}
                  className={cn(
                    "p-3 border-2 rounded-lg text-left transition-all hover:border-primary hover:shadow-md",
                    props.presetId === preset.id ? "border-primary bg-primary/10" : "border-border"
                  )}
                >
                  <div className="flex items-start gap-2">
                    <Icon size={16} className="text-primary mt-0.5" />
                    <div className="flex-1">
                      <div className="text-xs font-semibold text-foreground">{preset.name}</div>
                      <div className="text-[10px] text-muted-foreground mt-0.5">{preset.description}</div>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col overflow-hidden">
        <TabsList className="w-full grid grid-cols-3 rounded-none border-b">
          <TabsTrigger value="content" className="rounded-none">
            <Video size={14} className="mr-2" />
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
            <SectionCard id="video-source" title="Video Source" icon={Video}>
              <div className="space-y-3">
                <div>
                  <Label className="text-xs">Platform</Label>
                  <Select 
                    value={props.source || 'youtube'} 
                    onValueChange={(value) => updateProps({ source: value })}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="youtube">
                        <div className="flex items-center gap-2">
                          <Youtube size={14} />
                          <span>YouTube</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="vimeo">Vimeo</SelectItem>
                      <SelectItem value="loom">Loom</SelectItem>
                      <SelectItem value="upload">Upload (MP4, WebM)</SelectItem>
                      <SelectItem value="custom">Custom URL</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-xs mb-2 block">Video Selection</Label>
                  
                  {/* Video Gallery */}
                  {showGallery ? (
                    <VideoGallery
                      selectedVideoId={props.videoId}
                      onSelectVideo={(video) => {
                        updateProps({
                          url: video.url,
                          thumbnail: video.thumbnail,
                          source: video.source || props.source || 'youtube',
                          videoId: video.id,
                        });
                        setShowGallery(false);
                      }}
                      onAddVideo={() => {
                        // Open URL input or modal for adding new video
                        setShowGallery(false);
                      }}
                      onUploadVideo={() => {
                        // Handle video upload
                        const input = document.createElement('input');
                        input.type = 'file';
                        input.accept = 'video/*';
                        input.onchange = (e: any) => {
                          const file = e.target?.files?.[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onload = (event) => {
                              updateProps({
                                url: event.target?.result as string,
                                source: 'upload',
                              });
                            };
                            reader.readAsDataURL(file);
                          }
                        };
                        input.click();
                      }}
                    />
                  ) : (
                    <div className="space-y-2">
                      <Button
                        type="button"
                        variant="outline"
                        className="w-full"
                        onClick={() => setShowGallery(true)}
                      >
                        <Video className="w-4 h-4 mr-2" />
                        Browse Video Library
                      </Button>
                      
                      <div className="text-xs text-foreground text-center">or</div>
                      
                      <Input
                        value={props.url || ''}
                        onChange={(e) => updateProps({ url: e.target.value })}
                        placeholder={
                          props.source === 'youtube' ? 'https://www.youtube.com/watch?v=...' :
                          props.source === 'vimeo' ? 'https://vimeo.com/...' :
                          props.source === 'loom' ? 'https://www.loom.com/share/...' :
                          'https://your-domain.com/video.mp4'
                        }
                        className="mt-1"
                      />
                      <p className="text-xs text-foreground mt-1">
                        Paste any {props.source || 'YouTube'} URL format
                      </p>
                    </div>
                  )}
                </div>

                <div>
                  <Label className="text-xs">Thumbnail/Poster Image (Optional)</Label>
                  <Input
                    value={props.thumbnail || ''}
                    onChange={(e) => updateProps({ thumbnail: e.target.value })}
                    placeholder="https://example.com/thumbnail.jpg"
                    className="mt-1"
                  />
                  <p className="text-xs text-foreground mt-1">
                    Custom thumbnail with play button overlay
                  </p>
                </div>
              </div>
            </SectionCard>

            <SectionCard id="playback" title="Playback Settings" icon={Play}>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-xs">Autoplay</Label>
                    <p className="text-xs text-foreground">Start automatically (muted)</p>
                  </div>
                  <Switch
                    checked={props.autoplay || false}
                    onCheckedChange={(checked) => updateProps({ autoplay: checked, muted: checked ? true : props.muted })}
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-xs">Loop Video</Label>
                    <p className="text-xs text-foreground">Restart automatically</p>
                  </div>
                  <Switch
                    checked={props.loop || false}
                    onCheckedChange={(checked) => updateProps({ loop: checked })}
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-xs">Mute Audio</Label>
                    <p className="text-xs text-foreground">Start muted</p>
                  </div>
                  <Switch
                    checked={props.muted || false}
                    onCheckedChange={(checked) => updateProps({ muted: checked })}
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-xs">Show Controls</Label>
                    <p className="text-xs text-foreground">Display player controls</p>
                  </div>
                  <Switch
                    checked={props.controls !== false}
                    onCheckedChange={(checked) => updateProps({ controls: checked })}
                  />
                </div>

                <Separator />

                <div>
                  <Label className="text-xs">Start Time (seconds)</Label>
                  <Input
                    type="number"
                    value={props.startTime || ''}
                    onChange={(e) => updateProps({ startTime: e.target.value ? parseInt(e.target.value) : undefined })}
                    placeholder="0"
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label className="text-xs">End Time (seconds)</Label>
                  <Input
                    type="number"
                    value={props.endTime || ''}
                    onChange={(e) => updateProps({ endTime: e.target.value ? parseInt(e.target.value) : undefined })}
                    placeholder="Auto"
                    className="mt-1"
                  />
                </div>
              </div>
            </SectionCard>

            <SectionCard id="video-sizing" title="Video Sizing" icon={Film}>
              <div className="space-y-4">
                <div>
                  <Label className="text-xs mb-2 block">Video Width</Label>
                  <EnhancedSlider
                    label="Width"
                    value={props.videoWidthPercent || 100}
                    onChange={(value) => updateProps({ videoWidthPercent: value, videoWidth: `${value}%` })}
                    min={20}
                    max={100}
                    step={5}
                    unit="%"
                    tooltip="Adjust video width while maintaining 16:9 aspect ratio"
                  />
                  <p className="text-xs text-foreground mt-2">
                    Video maintains YouTube's 16:9 aspect ratio. Height adjusts automatically.
                  </p>
                </div>

                <Separator />

                <AlignmentControls
                  value={props.alignment || 'center'}
                  onChange={(value) => updateProps({ alignment: value })}
                  label="Video Alignment"
                  includeJustify={false}
                />
              </div>
            </SectionCard>

            <SectionCard id="thumbnail" title="Thumbnail / Poster" icon={Film}>
              <div className="space-y-3">
                <div>
                  <Label className="text-xs mb-2 block">Thumbnail Source</Label>
                  <div className="grid grid-cols-3 gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowImageLibrary(true)}
                      className="flex flex-col items-center gap-1 h-auto py-3"
                    >
                      <Search size={18} />
                      <span className="text-xs">Stock Photos</span>
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        // TODO: Open media library for user uploads
                        const input = document.createElement('input');
                        input.type = 'file';
                        input.accept = 'image/*';
                        input.onchange = (e) => {
                          const file = (e.target as HTMLInputElement).files?.[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onload = (event) => {
                              const url = event.target?.result as string;
                              updateProps({ thumbnail: url, poster: url });
                            };
                            reader.readAsDataURL(file);
                          }
                        };
                        input.click();
                      }}
                      className="flex flex-col items-center gap-1 h-auto py-3"
                    >
                      <Upload size={18} />
                      <span className="text-xs">Upload</span>
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        // TODO: Open in-house media library
                        console.log('Open media library');
                      }}
                      className="flex flex-col items-center gap-1 h-auto py-3"
                    >
                      <ImageIcon size={18} />
                      <span className="text-xs">My Library</span>
                    </Button>
                  </div>
                </div>

                <div>
                  <Label className="text-xs">Or Enter URL</Label>
                  <Input
                    value={props.thumbnail || props.poster || ''}
                    onChange={(e) => updateProps({ thumbnail: e.target.value, poster: e.target.value })}
                    placeholder="https://example.com/poster.jpg"
                    className="mt-1"
                  />
                </div>

                {props.thumbnail && (
                  <div className="relative w-full rounded-lg overflow-hidden border border-border">
                    <img
                      src={props.thumbnail}
                      alt="Video thumbnail"
                      className="w-full h-auto"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                      }}
                    />
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-xs">Use First Frame as Poster</Label>
                    <p className="text-xs text-foreground">Auto-generate from video</p>
                  </div>
                  <Switch
                    checked={props.useFirstFrameAsPoster || false}
                    onCheckedChange={(checked) => updateProps({ useFirstFrameAsPoster: checked })}
                  />
                </div>
              </div>
            </SectionCard>

            {/* Image Library Modal */}
            <ImageLibraryModal
              isOpen={showImageLibrary}
              onClose={() => setShowImageLibrary(false)}
              onSelectImage={(url) => {
                updateProps({ thumbnail: url, poster: url });
                setShowImageLibrary(false);
              }}
            />

            <SectionCard id="play-button" title="Play Button (Edit Mode)" icon={Play}>
              <div className="space-y-4">
                <div>
                  <Label className="text-xs mb-2 block">Play Button Style</Label>
                  <Select 
                    value={props.playButtonStyle || 'default'} 
                    onValueChange={(value) => updateProps({ playButtonStyle: value })}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="default">Default (White Circle)</SelectItem>
                      <SelectItem value="minimal">Minimal (Outline)</SelectItem>
                      <SelectItem value="circle">Circle (Solid)</SelectItem>
                      <SelectItem value="rounded">Rounded Square</SelectItem>
                      <SelectItem value="square">Square</SelectItem>
                      <SelectItem value="pulse">Pulse Animation</SelectItem>
                      <SelectItem value="glow">Glow Effect</SelectItem>
                      <SelectItem value="gradient">Gradient</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-xs mb-2 block">Play Button Size</Label>
                  <Select 
                    value={props.playButtonSize || 'medium'} 
                    onValueChange={(value) => updateProps({ playButtonSize: value })}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="small">Small</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="large">Large</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Separator />

                <div>
                  <Label className="text-xs mb-2 block">Background Color</Label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={props.playButtonBackgroundColor || '#ffffff'}
                      onChange={(e) => updateProps({ playButtonBackgroundColor: e.target.value })}
                      className="w-10 h-10 rounded border border-border cursor-pointer"
                    />
                    <Input
                      value={props.playButtonBackgroundColor || '#ffffff'}
                      onChange={(e) => updateProps({ playButtonBackgroundColor: e.target.value })}
                      placeholder="#ffffff"
                      className="flex-1"
                    />
                  </div>
                  <p className="text-xs text-foreground mt-1">
                    Background color of the play button
                  </p>
                </div>

                <div>
                  <Label className="text-xs mb-2 block">Icon Color</Label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={props.playButtonIconColor || '#000000'}
                      onChange={(e) => updateProps({ playButtonIconColor: e.target.value })}
                      className="w-10 h-10 rounded border border-border cursor-pointer"
                    />
                    <Input
                      value={props.playButtonIconColor || '#000000'}
                      onChange={(e) => updateProps({ playButtonIconColor: e.target.value })}
                      placeholder="#000000"
                      className="flex-1"
                    />
                  </div>
                  <p className="text-xs text-foreground mt-1">
                    Color of the play icon symbol
                  </p>
                </div>
              </div>
            </SectionCard>

            <SectionCard id="preload" title="Preload Settings" icon={Zap}>
              <div className="space-y-3">
                <div>
                  <Label className="text-xs">Preload</Label>
                  <Select 
                    value={props.preload || 'metadata'} 
                    onValueChange={(value) => updateProps({ preload: value })}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">None (Faster page load)</SelectItem>
                      <SelectItem value="metadata">Metadata (Recommended)</SelectItem>
                      <SelectItem value="auto">Auto (Load full video)</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-foreground mt-1">
                    Metadata loads video info only. Auto loads entire video.
                  </p>
                </div>
              </div>
            </SectionCard>

            <SectionCard id="video-info" title="Video Information" icon={Film}>
              <div className="space-y-3">
                <div>
                  <Label className="text-xs">Title (Optional)</Label>
                  <Input
                    value={props.title || ''}
                    onChange={(e) => updateProps({ title: e.target.value })}
                    placeholder="Video title"
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label className="text-xs">Description (Optional)</Label>
                  <Textarea
                    value={props.description || ''}
                    onChange={(e) => updateProps({ description: e.target.value })}
                    placeholder="Video description for SEO..."
                    className="mt-1 min-h-[60px]"
                  />
                </div>
              </div>
            </SectionCard>
          </TabsContent>

          {/* Design Tab */}
          <TabsContent value="design" className="p-4 space-y-4 m-0">
            <SectionCard id="aspect-ratio" title="Aspect Ratio" icon={Film}>
              <div className="space-y-3">
                <div>
                  <Label className="text-xs">Aspect Ratio</Label>
                  <Select 
                    value={props.aspectRatio || '16:9'} 
                    onValueChange={(value) => updateProps({ aspectRatio: value })}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="auto">Auto (Detect from video)</SelectItem>
                      <SelectItem value="16:9">16:9 (Widescreen - YouTube)</SelectItem>
                      <SelectItem value="4:3">4:3 (Standard - Classic TV)</SelectItem>
                      <SelectItem value="1:1">1:1 (Square - Instagram)</SelectItem>
                      <SelectItem value="9:16">9:16 (Vertical - TikTok)</SelectItem>
                      <SelectItem value="21:9">21:9 (Ultrawide - Cinematic)</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-foreground mt-1">
                    {props.aspectRatio === 'auto' 
                      ? 'Aspect ratio will be automatically detected from uploaded video files'
                      : 'Manually set the aspect ratio for the video container'}
                  </p>
                </div>

                <div>
                  <Label className="text-xs">Alignment</Label>
                  <Select 
                    value={props.alignment || 'center'} 
                    onValueChange={(value) => updateProps({ alignment: value })}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="left">Left</SelectItem>
                      <SelectItem value="center">Center</SelectItem>
                      <SelectItem value="right">Right</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </SectionCard>

            <SectionCard id="styling" title="Styling" icon={Palette}>
              <div className="space-y-4">
                <div>
                  <Label className="text-xs">Frame Style</Label>
                  <Select
                    value={props.frameStyle || 'none'}
                    onValueChange={(value) => updateProps({ frameStyle: value, frameBorderEnabled: value === 'none' ? props.frameBorderEnabled : false })}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">None</SelectItem>
                      <SelectItem value="card">Card</SelectItem>
                      <SelectItem value="glass">Glass Panel</SelectItem>
                      <SelectItem value="device">Device Frame</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground mt-1">Wrap the video in a styled frame for extra polish.</p>
                </div>

                {props.frameStyle !== 'none' && (
                  <>
                    <EnhancedSlider
                      label="Frame Padding"
                      value={props.framePadding ?? 16}
                      onChange={(value) => updateProps({ framePadding: value })}
                      min={0}
                      max={60}
                      unit="px"
                    />
                    <div>
                      <Label className="text-xs">Frame Background</Label>
                      <EnhancedColorPicker
                        label=""
                        value={props.frameBackgroundColor || (props.frameStyle === 'glass' ? 'rgba(15,15,15,0.35)' : '#050505')}
                        onChange={(color) => updateProps({ frameBackgroundColor: color })}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-xs">Frame Border</Label>
                        <p className="text-xs text-muted-foreground">Add a subtle border to the frame</p>
                      </div>
                      <Switch
                        checked={props.frameBorderEnabled || false}
                        onCheckedChange={(checked) => updateProps({ frameBorderEnabled: checked })}
                      />
                    </div>
                    {props.frameBorderEnabled && (
                      <>
                        <EnhancedSlider
                          label="Border Width"
                          value={props.frameBorderWidth ?? 1}
                          onChange={(value) => updateProps({ frameBorderWidth: value })}
                          min={1}
                          max={12}
                          unit="px"
                        />
                        <EnhancedColorPicker
                          label="Border Color"
                          value={props.frameBorderColor || 'rgba(255,255,255,0.15)'}
                          onChange={(color) => updateProps({ frameBorderColor: color })}
                        />
                      </>
                    )}
                  </>
                )}

                <EnhancedSlider
                  label="Border Radius"
                  value={props.borderRadius || 0}
                  onChange={(value) => updateProps({ borderRadius: value })}
                  min={0}
                  max={50}
                  unit="px"
                />

                <div>
                  <Label className="text-xs">Shadow Preset</Label>
                  <Select
                    value={props.shadowPreset || 'none'}
                    onValueChange={(value) => updateProps({ shadowPreset: value })}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">None</SelectItem>
                      <SelectItem value="soft">Soft Drop Shadow</SelectItem>
                      <SelectItem value="deep">Deep Focus</SelectItem>
                      <SelectItem value="glow">Ambient Glow</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-xs">Ambient Glow</Label>
                    <p className="text-xs text-muted-foreground">Add a subtle glow behind the frame</p>
                  </div>
                  <Switch
                    checked={props.ambientGlow || false}
                    onCheckedChange={(checked) => updateProps({ ambientGlow: checked })}
                  />
                </div>
                {props.ambientGlow && (
                  <EnhancedColorPicker
                    label="Glow Color"
                    value={props.ambientGlowColor || 'rgba(59,130,246,0.45)'}
                    onChange={(color) => updateProps({ ambientGlowColor: color })}
                  />
                )}

                <div>
                  <Label className="text-xs">Background Color</Label>
                  <EnhancedColorPicker
                    label=""
                    value={props.backgroundColor || 'transparent'}
                    onChange={(color) => updateProps({ backgroundColor: color })}
                  />
                </div>

                <Separator />

                <EnhancedSlider
                  label="Padding"
                  value={props.padding !== undefined ? props.padding : 0}
                  onChange={(value) => updateProps({ padding: value })}
                  min={0}
                  max={100}
                  unit="px"
                />

                <EnhancedSlider
                  label="Margin"
                  value={props.margin || 0}
                  onChange={(value) => updateProps({ margin: value })}
                  min={0}
                  max={100}
                  unit="px"
                />
              </div>
            </SectionCard>

            <SectionCard id="effects" title="Hover Effects" icon={Zap}>
              <div className="space-y-3">
                <div>
                  <Label className="text-xs">Hover Effect</Label>
                  <Select 
                    value={props.hoverEffect || 'none'} 
                    onValueChange={(value) => updateProps({ hoverEffect: value })}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">None</SelectItem>
                      <SelectItem value="scale">Zoom on Hover</SelectItem>
                      <SelectItem value="darken">Darken on Hover</SelectItem>
                      <SelectItem value="glow">Glow on Hover</SelectItem>
                      <SelectItem value="play-button">Play Button Animation</SelectItem>
                      <SelectItem value="fade">Fade</SelectItem>
                      <SelectItem value="pulse">Pulse</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </SectionCard>

            <SectionCard id="masking" title="Video Masking" icon={Wand2}>
              <div className="space-y-3">
                <div>
                  <Label className="text-xs">Mask Shape</Label>
                  <Select 
                    value={props.videoMask || 'none'} 
                    onValueChange={(value) => updateProps({ videoMask: value })}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">None (Rectangle)</SelectItem>
                      <SelectItem value="circle">Circle</SelectItem>
                      <SelectItem value="rounded">Rounded Rectangle</SelectItem>
                      <SelectItem value="custom">Custom Radius</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {props.videoMask === 'custom' && (
                  <EnhancedSlider
                    label="Corner Radius"
                    value={props.customMaskRadius || 16}
                    onChange={(value) => updateProps({ customMaskRadius: value })}
                    min={0}
                    max={100}
                    unit="px"
                  />
                )}
              </div>
            </SectionCard>

            <SectionCard id="overlay" title="Background Overlay" icon={Palette}>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-xs">Overlay</Label>
                    <p className="text-xs text-foreground">Add overlay layer</p>
                  </div>
                  <Switch
                    checked={props.overlay || false}
                    onCheckedChange={(checked) => updateProps({ overlay: checked })}
                  />
                </div>

                {props.overlay && (
                  <>
                    <div>
                      <Label className="text-xs">Overlay Color</Label>
                      <EnhancedColorPicker
                        label=""
                        value={props.overlayColor || '#000000'}
                        onChange={(color) => updateProps({ overlayColor: color })}
                      />
                    </div>

                    <EnhancedSlider
                      label="Overlay Opacity"
                      value={props.overlayOpacity || 40}
                      onChange={(value) => updateProps({ overlayOpacity: value })}
                      min={0}
                      max={100}
                      unit="%"
                    />

                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-xs">Blur Background</Label>
                        <p className="text-xs text-foreground">Frosted glass effect</p>
                      </div>
                      <Switch
                        checked={props.blurBackground || false}
                        onCheckedChange={(checked) => updateProps({ blurBackground: checked })}
                      />
                    </div>
                  </>
                )}
              </div>
            </SectionCard>

            <SectionCard id="advanced-css" title="Advanced" icon={Zap}>
              <div className="space-y-3">
                <div>
                  <Label className="text-xs">Custom CSS Class</Label>
                  <Input
                    value={props.customCSS || ''}
                    onChange={(e) => updateProps({ customCSS: e.target.value })}
                    placeholder="my-custom-class"
                    className="mt-1"
                  />
                  <p className="text-xs text-foreground mt-1">For advanced users</p>
                </div>
              </div>
            </SectionCard>
          </TabsContent>

          {/* Behavior Tab */}
          <TabsContent value="behavior" className="p-4 space-y-4 m-0">
            <SectionCard id="click-actions" title="Click Actions" icon={Zap}>
              <div className="space-y-3">
                <div>
                  <Label className="text-xs">On Click</Label>
                  <Select 
                    value={props.clickAction || 'play-pause'} 
                    onValueChange={(value) => updateProps({ clickAction: value })}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="play-pause">Play/Pause Video</SelectItem>
                      <SelectItem value="popup">Open Popup Video Player</SelectItem>
                      <SelectItem value="url">Open URL</SelectItem>
                      <SelectItem value="event">Trigger Custom Event</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {props.clickAction === 'url' && (
                  <div>
                    <Label className="text-xs">URL</Label>
                    <Input
                      value={props.clickUrl || ''}
                      onChange={(e) => updateProps({ clickUrl: e.target.value })}
                      placeholder="https://example.com"
                      className="mt-1"
                    />
                    <div className="flex items-center gap-2 mt-2">
                      <Switch
                        checked={props.openInNewTab || false}
                        onCheckedChange={(checked) => updateProps({ openInNewTab: checked })}
                      />
                      <Label className="text-xs">Open in new tab</Label>
                    </div>
                  </div>
                )}

                {props.clickAction === 'event' && (
                  <div>
                    <Label className="text-xs">Event Name</Label>
                    <Input
                      value={props.customEventName || ''}
                      onChange={(e) => updateProps({ customEventName: e.target.value })}
                      placeholder="video_clicked"
                      className="mt-1"
                    />
                    <p className="text-xs text-foreground mt-1">Custom event name for analytics</p>
                  </div>
                )}
              </div>
            </SectionCard>

            {props.clickAction === 'popup' && (
              <SectionCard id="popup-settings" title="Popup Video Player" icon={Video}>
                <div className="space-y-3">
                  <div>
                    <Label className="text-xs">Popup Width</Label>
                    <div className="flex items-center gap-2 mt-1">
                      <Input
                        type="number"
                        value={props.popupWidth || 80}
                        onChange={(e) => updateProps({ popupWidth: parseInt(e.target.value) || 80 })}
                        className="flex-1"
                        min={30}
                        max={100}
                      />
                      <Select 
                        value={props.popupWidthUnit || '%'} 
                        onValueChange={(value) => updateProps({ popupWidthUnit: value })}
                      >
                        <SelectTrigger className="w-20">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="%">%</SelectItem>
                          <SelectItem value="px">px</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <Label className="text-xs">Dim Background Color</Label>
                    <EnhancedColorPicker
                      label=""
                      value={props.popupDimColor || '#000000'}
                      onChange={(color) => updateProps({ popupDimColor: color })}
                    />
                  </div>

                  <EnhancedSlider
                    label="Dim Opacity"
                    value={props.popupDimOpacity || 70}
                    onChange={(value) => updateProps({ popupDimOpacity: value })}
                    min={0}
                    max={100}
                    unit="%"
                  />

                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-xs">Close on Click Outside</Label>
                      <p className="text-xs text-foreground">Close popup when clicking backdrop</p>
                    </div>
                    <Switch
                      checked={props.popupCloseOnOutside !== false}
                      onCheckedChange={(checked) => updateProps({ popupCloseOnOutside: checked })}
                    />
                  </div>

                  <div>
                    <Label className="text-xs">Popup Animation</Label>
                    <Select 
                      value={props.popupAnimation || 'fade'} 
                      onValueChange={(value) => updateProps({ popupAnimation: value })}
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="fade">Fade</SelectItem>
                        <SelectItem value="slide-up">Slide Up</SelectItem>
                        <SelectItem value="zoom">Zoom</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </SectionCard>
            )}

            <SectionCard id="autoplay-conditions" title="Autoplay Conditions" icon={Zap}>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-xs">Autoplay When Visible</Label>
                    <p className="text-xs text-foreground">Start when video enters viewport</p>
                  </div>
                  <Switch
                    checked={props.autoplayOnVisible || false}
                    onCheckedChange={(checked) => updateProps({ autoplayOnVisible: checked })}
                  />
                </div>

                {props.autoplayOnVisible && (
                  <EnhancedSlider
                    label="Scroll Into View %"
                    value={props.autoplayScrollPercent || 50}
                    onChange={(value) => updateProps({ autoplayScrollPercent: value })}
                    min={0}
                    max={100}
                    unit="%"
                  />
                )}

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-xs">Autoplay with Sound</Label>
                    <p className="text-xs text-foreground">May show browser warning</p>
                  </div>
                  <Switch
                    checked={props.autoplayWithSound || false}
                    onCheckedChange={(checked) => updateProps({ autoplayWithSound: checked, muted: !checked })}
                  />
                </div>

                {props.autoplayWithSound && (
                  <div className="p-2 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded text-xs text-yellow-800 dark:text-yellow-200">
                    ⚠️ Browsers may block autoplay with sound. Users may need to interact first.
                  </div>
                )}
              </div>
            </SectionCard>

            <SectionCard id="tracking" title="Tracking & Analytics" icon={Zap}>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-xs">Track Play Event</Label>
                    <p className="text-xs text-foreground">Fire event when video plays</p>
                  </div>
                  <Switch
                    checked={props.trackPlay || false}
                    onCheckedChange={(checked) => updateProps({ trackPlay: checked })}
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-xs">Track Pause Event</Label>
                    <p className="text-xs text-foreground">Fire event when video pauses</p>
                  </div>
                  <Switch
                    checked={props.trackPause || false}
                    onCheckedChange={(checked) => updateProps({ trackPause: checked })}
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-xs">Track Watch Progress</Label>
                    <p className="text-xs text-foreground">Track percentage watched</p>
                  </div>
                  <Switch
                    checked={props.trackProgress || false}
                    onCheckedChange={(checked) => updateProps({ trackProgress: checked })}
                  />
                </div>

                {props.trackProgress && (
                  <div className="space-y-2">
                    <Label className="text-xs">Track at Milestones</Label>
                    <div className="flex flex-wrap gap-2">
                      {[25, 50, 75, 100].map((percent) => (
                        <Button
                          key={percent}
                          size="sm"
                          variant={props.trackMilestones?.includes(percent) ? 'default' : 'outline'}
                          className="h-7 text-xs"
                          onClick={() => {
                            const milestones = props.trackMilestones || [];
                            const newMilestones = milestones.includes(percent)
                              ? milestones.filter((m) => m !== percent)
                              : [...milestones, percent].sort((a, b) => a - b);
                            updateProps({ trackMilestones: newMilestones });
                          }}
                        >
                          {percent}%
                        </Button>
                      ))}
                    </div>
                  </div>
                )}

                <Separator />

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-xs">Track CTA Click</Label>
                    <p className="text-xs text-foreground">Track clicks inside video</p>
                  </div>
                  <Switch
                    checked={props.trackCTAClick || false}
                    onCheckedChange={(checked) => updateProps({ trackCTAClick: checked })}
                  />
                </div>
              </div>
            </SectionCard>

            <SectionCard id="performance" title="Performance" icon={Zap}>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-xs">Lazy Load</Label>
                    <p className="text-xs text-foreground">Load only when visible</p>
                  </div>
                  <Switch
                    checked={props.lazyLoad || false}
                    onCheckedChange={(checked) => updateProps({ lazyLoad: checked })}
                  />
                </div>
              </div>
            </SectionCard>

            <SectionCard id="triggers" title="Trigger Actions" icon={Zap}>
              <div className="space-y-3">
                <div>
                  <Label className="text-xs">On Play</Label>
                  <Select 
                    value={props.onPlayAction || 'none'} 
                    onValueChange={(value) => updateProps({ onPlayAction: value })}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">None</SelectItem>
                      <SelectItem value="analytics">Track Analytics</SelectItem>
                      <SelectItem value="event">Trigger Event</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-xs">On End</Label>
                  <Select 
                    value={props.onEndAction || 'none'} 
                    onValueChange={(value) => updateProps({ onEndAction: value })}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">None</SelectItem>
                      <SelectItem value="redirect">Redirect</SelectItem>
                      <SelectItem value="show-cta">Show CTA</SelectItem>
                      <SelectItem value="event">Trigger Event</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </SectionCard>

            <SectionCard id="advanced-js" title="Advanced Scripting" icon={Zap}>
              <div className="space-y-3">
                <div>
                  <Label className="text-xs">Custom JS Hook</Label>
                  <Textarea
                    value={props.customJS || ''}
                    onChange={(e) => updateProps({ customJS: e.target.value })}
                    placeholder="// Custom JavaScript code..."
                    className="mt-1 min-h-[100px] font-mono text-xs"
                  />
                  <p className="text-xs text-foreground mt-1">Advanced: Custom scripting for power users</p>
                </div>
              </div>
            </SectionCard>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}


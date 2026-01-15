"use client";



import React, { useState } from 'react';
import { ElementNode } from '@/lib/store/test-builder';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Quote, User, Star, Video, Award, Search, Wand2, Palette, Zap, AlignLeft, AlignCenter, AlignRight, Sparkles, Image as ImageIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { EnhancedColorPicker } from './shared/EnhancedColorPicker';
import { EnhancedSlider } from './shared/EnhancedSlider';
import { SectionCard } from './shared/SectionCard';

interface TestimonialSettingsProps {
  node: ElementNode;
  updateProps: (updates: any) => void;
}

// Testimonial Presets
const TESTIMONIAL_PRESETS = [
  {
    id: 'classic-card',
    name: 'Classic Card',
    description: 'Traditional testimonial with photo and quote',
    category: 'standard',
    props: {
      testimonialType: 'text',
      quote: 'This product completely transformed my business. The results were beyond my expectations!',
      authorName: 'Sarah Johnson',
      authorTitle: 'CEO, TechCorp',
      authorImage: 'https://via.placeholder.com/80',
      showImage: true,
      showRating: true,
      rating: 5,
      backgroundColor: '#ffffff',
      textColor: '#1f2937',
      authorColor: '#6b7280',
      quoteSize: 18,
      authorSize: 14,
      paddingTop: 32,
      paddingBottom: 32,
      paddingLeft: 32,
      paddingRight: 32,
      borderRadius: 12,
      showQuoteIcon: true,
      layout: 'card'
    }
  },
  {
    id: 'minimal-quote',
    name: 'Minimal Quote',
    description: 'Clean, text-focused testimonial',
    category: 'minimal',
    props: {
      testimonialType: 'text',
      quote: 'Simple, effective, and exactly what I needed. Highly recommended!',
      authorName: 'Michael Chen',
      authorTitle: 'Marketing Director',
      showImage: false,
      showRating: false,
      backgroundColor: 'transparent',
      textColor: '#111827',
      authorColor: '#6b7280',
      quoteSize: 20,
      authorSize: 14,
      paddingTop: 24,
      paddingBottom: 24,
      paddingLeft: 0,
      paddingRight: 0,
      borderRadius: 0,
      showQuoteIcon: true,
      layout: 'simple'
    }
  },
  {
    id: 'video-testimonial',
    name: 'Video Testimonial',
    description: 'Engaging video with thumbnail',
    category: 'video',
    props: {
      testimonialType: 'video',
      videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      videoThumbnail: 'https://via.placeholder.com/640x360',
      authorName: 'Jennifer Martinez',
      authorTitle: 'Founder, StartupCo',
      authorImage: 'https://via.placeholder.com/60',
      showImage: true,
      backgroundColor: '#f9fafb',
      textColor: '#1f2937',
      authorColor: '#6b7280',
      paddingTop: 24,
      paddingBottom: 24,
      paddingLeft: 24,
      paddingRight: 24,
      borderRadius: 16,
      layout: 'video'
    }
  },
  {
    id: 'featured-large',
    name: 'Featured Large',
    description: 'Prominent testimonial with large photo',
    category: 'featured',
    props: {
      testimonialType: 'text',
      quote: 'Working with this team has been an absolute game-changer. Their expertise and dedication to our success is unmatched.',
      authorName: 'David Thompson',
      authorTitle: 'VP of Operations, Enterprise Inc',
      authorImage: 'https://via.placeholder.com/120',
      showImage: true,
      showRating: true,
      rating: 5,
      showVerified: true,
      backgroundColor: '#1f2937',
      textColor: '#ffffff',
      authorColor: '#d1d5db',
      quoteSize: 24,
      authorSize: 16,
      paddingTop: 48,
      paddingBottom: 48,
      paddingLeft: 48,
      paddingRight: 48,
      borderRadius: 20,
      showQuoteIcon: true,
      layout: 'featured'
    }
  },
  {
    id: 'compact-inline',
    name: 'Compact Inline',
    description: 'Space-saving horizontal layout',
    category: 'compact',
    props: {
      testimonialType: 'text',
      quote: 'Excellent service and support. Would definitely recommend!',
      authorName: 'Lisa Anderson',
      authorTitle: 'Product Manager',
      authorImage: 'https://via.placeholder.com/50',
      showImage: true,
      showRating: true,
      rating: 5,
      backgroundColor: '#f3f4f6',
      textColor: '#374151',
      authorColor: '#6b7280',
      quoteSize: 16,
      authorSize: 13,
      paddingTop: 20,
      paddingBottom: 20,
      paddingLeft: 24,
      paddingRight: 24,
      borderRadius: 8,
      showQuoteIcon: false,
      layout: 'horizontal'
    }
  }
];

export function TestimonialSettings({ node, updateProps }: TestimonialSettingsProps) {
  const props = node.props;
  const [activeTab, setActiveTab] = useState('content');
  const [searchQuery, setSearchQuery] = useState('');
  const [showPresetPicker, setShowPresetPicker] = useState(false);

  // Set default values on mount
  React.useEffect(() => {
    const defaults: any = {};
    if (!props.testimonialType) defaults.testimonialType = 'text';
    if (!props.quote) defaults.quote = 'This product exceeded my expectations!';
    if (!props.authorName) defaults.authorName = 'John Doe';
    if (!props.authorTitle) defaults.authorTitle = 'CEO, Company';
    if (!props.backgroundColor) defaults.backgroundColor = '#ffffff';
    if (!props.textColor) defaults.textColor = '#1f2937';
    if (!props.authorColor) defaults.authorColor = '#6b7280';
    if (!props.quoteSize) defaults.quoteSize = 18;
    if (!props.authorSize) defaults.authorSize = 14;
    if (props.paddingTop === undefined) defaults.paddingTop = 32;
    if (props.paddingBottom === undefined) defaults.paddingBottom = 32;
    if (props.paddingLeft === undefined) defaults.paddingLeft = 32;
    if (props.paddingRight === undefined) defaults.paddingRight = 32;
    if (!props.borderRadius) defaults.borderRadius = 12;
    if (props.showRating === undefined) defaults.showRating = true;
    if (!props.rating) defaults.rating = 5;
    if (!props.layout) defaults.layout = 'card';
    
    if (Object.keys(defaults).length > 0) {
      updateProps(defaults);
    }
  }, []);

  return (
    <div className="flex flex-col bg-card">
      {/* Top Bar with Search */}
      <div className="p-3 bg-card border-b border-border">
        <div className="relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search settings..." className="pl-9 h-9 text-sm" />
        </div>
      </div>

      {/* Presets Section */}
      <div className="p-3 bg-card border-b border-border">
        <div className="mb-2">
          <button
            onClick={() => setShowPresetPicker(!showPresetPicker)}
            className="w-full flex items-center justify-between p-2 hover:bg-accent rounded-lg transition-colors"
          >
            <div className="flex items-center gap-2">
              <Wand2 size={14} className="text-primary" />
              <span className="text-xs font-semibold text-foreground">Style Presets</span>
            </div>
            <span className="text-xs text-foreground">{showPresetPicker ? 'Hide' : 'Show'}</span>
          </button>
        </div>

        {showPresetPicker && (
          <div className="grid grid-cols-2 gap-2 mt-3">
            {TESTIMONIAL_PRESETS.map((preset) => (
              <button
                key={preset.id}
                onClick={() => {
                  updateProps({ ...preset.props, presetId: preset.id });
                  setShowPresetPicker(false);
                }}
                className={cn(
                  "p-3 border-2 rounded-lg text-left transition-all hover:border-primary hover:shadow-md",
                  props.presetId === preset.id
                    ? "border-primary bg-blue-50 dark:bg-blue-950/30"
                    : "border-border bg-card"
                )}
              >
                <div className="flex items-start justify-between mb-1">
                  <span className="text-xs font-semibold text-foreground">
                    {preset.name}
                  </span>
                  {props.presetId === preset.id && (
                    <div className="w-2 h-2 bg-blue-500 rounded-full" />
                  )}
                </div>
                <p className="text-[10px] text-muted-foreground leading-tight">
                  {preset.description}
                </p>
                <div className="mt-2 flex items-center gap-1">
                  <div
                    className="w-6 h-6 rounded border border-border"
                    style={{ backgroundColor: preset.props.backgroundColor }}
                  />
                  <Quote size={12} className="text-foreground" />
                </div>
              </button>
            ))}
          </div>
        )}

        {props.presetId && (
          <div className="mt-3 p-2 bg-primary/10 rounded-lg border border-blue-200 dark:border-blue-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-blue-900 dark:text-blue-100">
                  Current: {TESTIMONIAL_PRESETS.find(p => p.id === props.presetId)?.name || 'Custom'}
                </p>
              </div>
              <button
                onClick={() => updateProps({ presetId: null })}
                className="text-xs text-primary hover:underline"
              >
                Clear
              </button>
            </div>
          </div>
        )}
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex flex-col">
        <TabsList className="w-full grid grid-cols-3 rounded-none border-b border-border bg-card h-12 flex-shrink-0">
          <TabsTrigger value="content" className="data-[state=active]:bg-blue-50 dark:data-[state=active]:bg-blue-950/30 data-[state=active]:border-b-2 data-[state=active]:border-blue-600 rounded-none">
            <Quote size={14} className="mr-2" />Content
          </TabsTrigger>
          <TabsTrigger value="design" className="data-[state=active]:bg-blue-50 dark:data-[state=active]:bg-blue-950/30 data-[state=active]:border-b-2 data-[state=active]:border-blue-600 rounded-none">
            <Palette size={14} className="mr-2" />Design
          </TabsTrigger>
          <TabsTrigger value="behavior" className="data-[state=active]:bg-blue-50 dark:data-[state=active]:bg-blue-950/30 data-[state=active]:border-b-2 data-[state=active]:border-blue-600 rounded-none">
            <Zap size={14} className="mr-2" />Behavior
          </TabsTrigger>
        </TabsList>

        {/* CONTENT TAB */}
        <TabsContent value="content" className="p-4 space-y-3 mt-0">
          <SectionCard id="type" title="Testimonial Type" icon={Quote} onReset={() => updateProps({ testimonialType: 'text' })}>
            <div>
              <Label className="text-xs font-medium text-foreground mb-2 block">Type</Label>
              <Select value={props.testimonialType || 'text'} onValueChange={(value) => updateProps({ testimonialType: value })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="text">Text Testimonial</SelectItem>
                  <SelectItem value="video">Video Testimonial</SelectItem>
                  <SelectItem value="case-study">Case Study</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </SectionCard>

          {props.testimonialType === 'text' && (
            <SectionCard id="quote" title="Quote" icon={Quote} onReset={() => updateProps({ quote: 'This product exceeded my expectations!' })}>
              <div>
                <Label className="text-xs font-medium text-foreground mb-2 block">Testimonial Quote</Label>
                <Textarea
                  value={props.quote || ''}
                  onChange={(e) => updateProps({ quote: e.target.value })}
                  placeholder="Enter testimonial quote..."
                  rows={4}
                />
              </div>
            </SectionCard>
          )}

          {props.testimonialType === 'video' && (
            <SectionCard id="video" title="Video" icon={Video} onReset={() => updateProps({ videoUrl: '', videoThumbnail: '' })}>
              <div className="space-y-3">
                <div>
                  <Label className="text-xs font-medium text-foreground mb-2 block">Video URL</Label>
                  <Input
                    value={props.videoUrl || ''}
                    onChange={(e) => updateProps({ videoUrl: e.target.value })}
                    placeholder="https://youtube.com/watch?v=..."
                  />
                </div>
                <div>
                  <Label className="text-xs font-medium text-foreground mb-2 block">Thumbnail URL</Label>
                  <Input
                    value={props.videoThumbnail || ''}
                    onChange={(e) => updateProps({ videoThumbnail: e.target.value })}
                    placeholder="https://example.com/thumbnail.jpg"
                  />
                </div>
              </div>
            </SectionCard>
          )}

          <SectionCard id="author" title="Author" icon={User} onReset={() => updateProps({ authorName: 'John Doe', authorTitle: 'CEO, Company', authorImage: '' })}>
            <div className="space-y-3">
              <div>
                <Label className="text-xs font-medium text-foreground mb-2 block">Author Name</Label>
                <Input
                  value={props.authorName || ''}
                  onChange={(e) => updateProps({ authorName: e.target.value })}
                  placeholder="John Doe"
                />
              </div>
              <div>
                <Label className="text-xs font-medium text-foreground mb-2 block">Author Title/Company</Label>
                <Input
                  value={props.authorTitle || ''}
                  onChange={(e) => updateProps({ authorTitle: e.target.value })}
                  placeholder="CEO, Company"
                />
              </div>
              <div>
                <Label className="text-xs font-medium text-foreground mb-2 block">Author Image URL</Label>
                <Input
                  value={props.authorImage || ''}
                  onChange={(e) => updateProps({ authorImage: e.target.value })}
                  placeholder="https://example.com/photo.jpg"
                />
              </div>
            </div>
          </SectionCard>

          <SectionCard id="rating" title="Rating" icon={Star} onReset={() => updateProps({ showRating: true, rating: 5 })}>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div>
                  <Label className="text-xs text-foreground">Show Rating</Label>
                  <p className="text-xs text-foreground">Display star rating</p>
                </div>
                <Switch checked={props.showRating !== false} onCheckedChange={(checked) => updateProps({ showRating: checked })} />
              </div>

              {props.showRating !== false && (
                <div>
                  <Label className="text-xs font-medium text-foreground mb-2 block">Rating (1-5)</Label>
                  <Select value={String(props.rating || 5)} onValueChange={(value) => updateProps({ rating: parseInt(value) })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1 Star</SelectItem>
                      <SelectItem value="2">2 Stars</SelectItem>
                      <SelectItem value="3">3 Stars</SelectItem>
                      <SelectItem value="4">4 Stars</SelectItem>
                      <SelectItem value="5">5 Stars</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>
          </SectionCard>
        </TabsContent>

        {/* DESIGN TAB */}
        <TabsContent value="design" className="p-4 space-y-3 mt-0">
          <SectionCard id="colors" title="Colors" icon={Palette} onReset={() => updateProps({ backgroundColor: '#ffffff', textColor: '#1f2937', authorColor: '#6b7280' })}>
            <div className="space-y-3">
              <EnhancedColorPicker label="Background Color" value={props.backgroundColor || '#ffffff'} onChange={(color) => updateProps({ backgroundColor: color })} />
              <EnhancedColorPicker label="Text Color" value={props.textColor || '#1f2937'} onChange={(color) => updateProps({ textColor: color })} />
              <EnhancedColorPicker label="Author Color" value={props.authorColor || '#6b7280'} onChange={(color) => updateProps({ authorColor: color })} />
            </div>
          </SectionCard>

          <SectionCard id="typography" title="Typography" icon={Quote} onReset={() => updateProps({ quoteSize: 18, authorSize: 14 })}>
            <div className="space-y-3">
              <EnhancedSlider label="Quote Size" value={props.quoteSize || 18} onChange={(val) => updateProps({ quoteSize: val })} min={14} max={32} />
              <EnhancedSlider label="Author Size" value={props.authorSize || 14} onChange={(val) => updateProps({ authorSize: val })} min={12} max={20} />
            </div>
          </SectionCard>

          <SectionCard id="spacing" title="Spacing" icon={Sparkles} onReset={() => updateProps({ paddingTop: 32, paddingBottom: 32, paddingLeft: 32, paddingRight: 32 })}>
            <div className="space-y-3">
              <EnhancedSlider label="Top Padding" value={props.paddingTop || 32} onChange={(val) => updateProps({ paddingTop: val })} min={0} max={100} />
              <EnhancedSlider label="Bottom Padding" value={props.paddingBottom || 32} onChange={(val) => updateProps({ paddingBottom: val })} min={0} max={100} />
              <EnhancedSlider label="Left Padding" value={props.paddingLeft || 32} onChange={(val) => updateProps({ paddingLeft: val })} min={0} max={100} />
              <EnhancedSlider label="Right Padding" value={props.paddingRight || 32} onChange={(val) => updateProps({ paddingRight: val })} min={0} max={100} />
            </div>
          </SectionCard>

          <SectionCard id="effects" title="Border & Effects" icon={Sparkles} onReset={() => updateProps({ borderRadius: 12 })}>
            <div>
              <EnhancedSlider label="Border Radius" value={props.borderRadius || 12} onChange={(val) => updateProps({ borderRadius: val })} min={0} max={32} />
            </div>
          </SectionCard>

          <SectionCard id="layout" title="Layout" icon={AlignCenter} onReset={() => updateProps({ layout: 'card' })}>
            <div>
              <Label className="text-xs font-medium text-foreground mb-2 block">Layout Style</Label>
              <Select value={props.layout || 'card'} onValueChange={(value) => updateProps({ layout: value })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="card">Card</SelectItem>
                  <SelectItem value="simple">Simple</SelectItem>
                  <SelectItem value="horizontal">Horizontal</SelectItem>
                  <SelectItem value="featured">Featured</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </SectionCard>
        </TabsContent>

        {/* BEHAVIOR TAB */}
        <TabsContent value="behavior" className="p-4 space-y-3 mt-0">
          <SectionCard id="display" title="Display Options" icon={ImageIcon} onReset={() => updateProps({ showImage: true, showQuoteIcon: true, showVerified: false })}>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div>
                  <Label className="text-xs text-foreground">Show Author Image</Label>
                  <p className="text-xs text-foreground">Display author photo</p>
                </div>
                <Switch checked={props.showImage !== false} onCheckedChange={(checked) => updateProps({ showImage: checked })} />
              </div>

              <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div>
                  <Label className="text-xs text-foreground">Show Quote Icon</Label>
                  <p className="text-xs text-foreground">Display quotation mark</p>
                </div>
                <Switch checked={props.showQuoteIcon !== false} onCheckedChange={(checked) => updateProps({ showQuoteIcon: checked })} />
              </div>

              <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div>
                  <Label className="text-xs text-foreground">Show Verified Badge</Label>
                  <p className="text-xs text-foreground">Display verification badge</p>
                </div>
                <Switch checked={props.showVerified || false} onCheckedChange={(checked) => updateProps({ showVerified: checked })} />
              </div>
            </div>
          </SectionCard>

          <SectionCard id="animation" title="Animation" icon={Zap} onReset={() => updateProps({ animateOnScroll: false })}>
            <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div>
                <Label className="text-xs text-foreground">Animate on Scroll</Label>
                <p className="text-xs text-foreground">Fade in when visible</p>
              </div>
              <Switch checked={props.animateOnScroll || false} onCheckedChange={(checked) => updateProps({ animateOnScroll: checked })} />
            </div>
          </SectionCard>
        </TabsContent>
      </Tabs>
    </div>
  );
}

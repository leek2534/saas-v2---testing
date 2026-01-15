'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { 
  FileText, 
  Video, 
  Presentation, 
  Search,
  Plus,
  Edit2,
  Clock,
  Smartphone,
  Instagram,
  Facebook,
  Twitter,
  Linkedin,
  Youtube,
  Heart,
  MessageCircle,
  Send,
  Bookmark,
  Play,
  ThumbsUp,
  Share2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { cn } from '@/lib/utils';
import { CANVA_PRESETS, type CanvasPreset } from '../lib/editor/canvasPresets';
import { useEditorStore } from '../lib/editor/store';

interface TemplateCategory {
  id: string;
  name: string;
  icon: any;
  color: string;
  presets: CanvasPreset[];
}

const TEMPLATE_CATEGORIES: TemplateCategory[] = [
  { 
    id: 'social', 
    name: 'Social Media', 
    icon: Smartphone, 
    color: 'from-pink-500 to-purple-600',
    presets: CANVA_PRESETS.filter(p => p.category === 'social')
  },
  { 
    id: 'presentation', 
    name: 'Presentation', 
    icon: Presentation, 
    color: 'from-orange-500 to-orange-600',
    presets: CANVA_PRESETS.filter(p => p.category === 'presentation')
  },
  { 
    id: 'video', 
    name: 'Video', 
    icon: Video, 
    color: 'from-purple-500 to-purple-600',
    presets: CANVA_PRESETS.filter(p => p.category === 'video')
  },
  { 
    id: 'print', 
    name: 'Print', 
    icon: FileText, 
    color: 'from-blue-500 to-blue-600',
    presets: CANVA_PRESETS.filter(p => p.category === 'print')
  },
];

interface RecentDesign {
  id: string;
  title: string;
  width: number;
  height: number;
  thumbnail?: string;
  lastEdited: Date;
  presetId?: string;
}

function getRecentDesigns(): RecentDesign[] {
  if (typeof window === 'undefined') return [];
  const stored = localStorage.getItem('kanva-recent-designs');
  if (!stored) return [];
  try {
    const designs = JSON.parse(stored);
    return designs.map((d: any) => ({
      ...d,
      lastEdited: new Date(d.lastEdited)
    }));
  } catch {
    return [];
  }
}

function saveRecentDesign(design: RecentDesign) {
  if (typeof window === 'undefined') return;
  const recents = getRecentDesigns();
  const filtered = recents.filter(d => d.id !== design.id);
  const updated = [design, ...filtered].slice(0, 12); // Keep last 12
  localStorage.setItem('kanva-recent-designs', JSON.stringify(updated));
}

function formatTimeAgo(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);
  
  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString();
}

// Social Media Mockup Components
function InstagramPostMockup() {
  return (
    <div className="w-full h-full bg-white rounded-lg overflow-hidden flex flex-col">
      {/* Header */}
      <div className="flex items-center gap-2 p-2 border-b">
        <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-purple-600 via-pink-600 to-orange-500" />
        <span className="text-[10px] font-semibold">username</span>
      </div>
      {/* Image Area */}
      <div className="flex-1 bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center">
        <Instagram className="w-8 h-8 text-purple-600/30" />
      </div>
      {/* Actions */}
      <div className="flex items-center gap-3 p-2 border-t">
        <Heart className="w-4 h-4" />
        <MessageCircle className="w-4 h-4" />
        <Send className="w-4 h-4" />
        <Bookmark className="w-4 h-4 ml-auto" />
      </div>
    </div>
  );
}

function InstagramStoryMockup() {
  return (
    <div className="w-full h-full bg-gradient-to-br from-purple-600 via-pink-600 to-orange-500 rounded-2xl overflow-hidden flex flex-col p-3">
      {/* Header */}
      <div className="flex items-center gap-2 mb-2">
        <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur" />
        <span className="text-white text-xs font-semibold">username</span>
      </div>
      {/* Content Area */}
      <div className="flex-1 flex items-center justify-center">
        <Instagram className="w-12 h-12 text-white/30" />
      </div>
      {/* Reply Bar */}
      <div className="bg-white/20 backdrop-blur rounded-full px-3 py-2">
        <span className="text-white/60 text-[10px]">Send message</span>
      </div>
    </div>
  );
}

function FacebookPostMockup() {
  return (
    <div className="w-full h-full bg-white rounded-lg overflow-hidden flex flex-col">
      {/* Header */}
      <div className="flex items-center gap-2 p-2 border-b">
        <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center">
          <Facebook className="w-4 h-4 text-white" />
        </div>
        <div>
          <div className="text-[10px] font-semibold">Page Name</div>
          <div className="text-[8px] text-gray-500">Just now</div>
        </div>
      </div>
      {/* Image Area */}
      <div className="flex-1 bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center">
        <Facebook className="w-8 h-8 text-blue-600/30" />
      </div>
      {/* Actions */}
      <div className="flex items-center justify-around p-2 border-t">
        <div className="flex items-center gap-1">
          <ThumbsUp className="w-3 h-3" />
          <span className="text-[9px]">Like</span>
        </div>
        <div className="flex items-center gap-1">
          <MessageCircle className="w-3 h-3" />
          <span className="text-[9px]">Comment</span>
        </div>
        <div className="flex items-center gap-1">
          <Share2 className="w-3 h-3" />
          <span className="text-[9px]">Share</span>
        </div>
      </div>
    </div>
  );
}

function TwitterPostMockup() {
  return (
    <div className="w-full h-full bg-white rounded-2xl overflow-hidden flex flex-col p-3">
      {/* Header */}
      <div className="flex items-center gap-2 mb-2">
        <div className="w-8 h-8 rounded-full bg-sky-500 flex items-center justify-center">
          <Twitter className="w-5 h-5 text-white" />
        </div>
        <div className="flex-1">
          <div className="text-[10px] font-bold">Display Name</div>
          <div className="text-[9px] text-gray-500">@username</div>
        </div>
      </div>
      {/* Content */}
      <div className="flex-1 bg-gradient-to-br from-sky-50 to-sky-100 rounded-xl flex items-center justify-center mb-2">
        <Twitter className="w-8 h-8 text-sky-500/30" />
      </div>
      {/* Actions */}
      <div className="flex items-center justify-around text-gray-500">
        <MessageCircle className="w-3 h-3" />
        <Share2 className="w-3 h-3" />
        <Heart className="w-3 h-3" />
        <Bookmark className="w-3 h-3" />
      </div>
    </div>
  );
}

function LinkedInPostMockup() {
  return (
    <div className="w-full h-full bg-white rounded-lg overflow-hidden flex flex-col">
      {/* Header */}
      <div className="flex items-center gap-2 p-2 border-b">
        <div className="w-6 h-6 rounded bg-blue-700 flex items-center justify-center">
          <Linkedin className="w-4 h-4 text-white" />
        </div>
        <div>
          <div className="text-[10px] font-semibold">Company Name</div>
          <div className="text-[8px] text-gray-500">1,234 followers</div>
        </div>
      </div>
      {/* Image Area */}
      <div className="flex-1 bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center">
        <Linkedin className="w-8 h-8 text-blue-700/30" />
      </div>
      {/* Actions */}
      <div className="flex items-center justify-around p-2 border-t">
        <div className="flex items-center gap-1">
          <ThumbsUp className="w-3 h-3" />
          <span className="text-[9px]">Like</span>
        </div>
        <div className="flex items-center gap-1">
          <MessageCircle className="w-3 h-3" />
          <span className="text-[9px]">Comment</span>
        </div>
        <div className="flex items-center gap-1">
          <Share2 className="w-3 h-3" />
          <span className="text-[9px]">Share</span>
        </div>
      </div>
    </div>
  );
}

function YouTubeThumbnailMockup() {
  return (
    <div className="w-full h-full bg-black rounded-lg overflow-hidden relative">
      {/* Video Area */}
      <div className="absolute inset-0 bg-gradient-to-br from-red-900/20 to-black flex items-center justify-center">
        <div className="w-12 h-12 rounded-full bg-red-600 flex items-center justify-center">
          <Play className="w-6 h-6 text-white ml-1" fill="white" />
        </div>
      </div>
      {/* Duration */}
      <div className="absolute bottom-2 right-2 bg-black/80 px-1.5 py-0.5 rounded text-white text-[9px] font-semibold">
        10:24
      </div>
      {/* YouTube Logo */}
      <div className="absolute top-2 left-2">
        <Youtube className="w-5 h-5 text-red-600" fill="currentColor" />
      </div>
    </div>
  );
}

function TikTokMockup() {
  return (
    <div className="w-full h-full bg-black rounded-3xl overflow-hidden relative">
      {/* Content Area */}
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/20 via-pink-500/20 to-black flex items-center justify-center">
        <div className="text-white text-2xl font-bold">TikTok</div>
      </div>
      {/* Side Actions */}
      <div className="absolute right-2 bottom-20 flex flex-col gap-3">
        <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur flex items-center justify-center">
          <Heart className="w-4 h-4 text-white" />
        </div>
        <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur flex items-center justify-center">
          <MessageCircle className="w-4 h-4 text-white" />
        </div>
        <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur flex items-center justify-center">
          <Share2 className="w-4 h-4 text-white" />
        </div>
      </div>
      {/* Bottom Info */}
      <div className="absolute bottom-4 left-3 right-12">
        <div className="text-white text-[10px] font-semibold">@username</div>
        <div className="text-white/80 text-[9px]">Caption text here...</div>
      </div>
    </div>
  );
}

function PinterestPinMockup() {
  return (
    <div className="w-full h-full bg-white rounded-2xl overflow-hidden flex flex-col shadow-lg">
      {/* Image Area */}
      <div className="flex-1 bg-gradient-to-br from-red-50 to-red-100 flex items-center justify-center relative">
        <div className="absolute top-2 right-2 w-8 h-8 rounded-full bg-red-600 flex items-center justify-center">
          <span className="text-white text-xs font-bold">P</span>
        </div>
        <div className="text-red-600/30 text-3xl font-bold">Pin</div>
      </div>
      {/* Info */}
      <div className="p-2">
        <div className="text-[10px] font-semibold mb-1">Pin Title</div>
        <div className="flex items-center gap-1">
          <div className="w-4 h-4 rounded-full bg-gray-300" />
          <span className="text-[9px] text-gray-600">Username</span>
        </div>
      </div>
    </div>
  );
}

// Mockup selector function
function getSocialMediaMockup(presetId: string) {
  const mockups: Record<string, () => JSX.Element> = {
    'instagram-post': InstagramPostMockup,
    'instagram-story': InstagramStoryMockup,
    'instagram-reel': InstagramStoryMockup,
    'facebook-post': FacebookPostMockup,
    'facebook-cover': FacebookPostMockup,
    'twitter-post': TwitterPostMockup,
    'linkedin-post': LinkedInPostMockup,
    'youtube-thumbnail': YouTubeThumbnailMockup,
    'tiktok-video': TikTokMockup,
    'pinterest-pin': PinterestPinMockup,
  };
  
  return mockups[presetId] || null;
}

export function KanvaDashboard() {
  const router = useRouter();
  const params = useParams();
  const teamSlug = params.teamSlug as string;
  const [searchQuery, setSearchQuery] = useState('');
  const [recentDesigns, setRecentDesigns] = useState<RecentDesign[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<TemplateCategory | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const setCanvas = useEditorStore((state) => state.setCanvas);

  useEffect(() => {
    setMounted(true);
    setRecentDesigns(getRecentDesigns());
  }, []);

  const handleCategoryClick = (category: TemplateCategory) => {
    setSelectedCategory(category);
    setIsModalOpen(true);
  };

  const handleCreateWithPreset = (preset: CanvasPreset) => {
    // Set canvas size in store
    setCanvas({
      width: preset.width,
      height: preset.height,
      background: { color: '#ffffff' },
    });
    
    // Save to recents
    const newDesign: RecentDesign = {
      id: `design-${Date.now()}`,
      title: preset.name,
      width: preset.width,
      height: preset.height,
      lastEdited: new Date(),
      presetId: preset.id,
    };
    saveRecentDesign(newDesign);
    
    // Close modal and navigate
    setIsModalOpen(false);
    setSelectedCategory(null);
    
    // Navigate to editor
    const searchParams = new URLSearchParams({
      template: preset.id,
      width: String(preset.width),
      height: String(preset.height),
    });
    router.push(`/t/${teamSlug}/kanva/editor?${searchParams.toString()}`);
  };

  const handleCreateCustom = () => {
    // Navigate to editor with default size
    setCanvas({
      width: 1080,
      height: 1080,
      background: { color: '#ffffff' },
    });
    router.push(`/t/${teamSlug}/kanva/editor`);
  };

  const handleOpenDesign = (design: RecentDesign) => {
    // Set canvas size
    setCanvas({
      width: design.width,
      height: design.height,
      background: { color: '#ffffff' },
    });
    
    // Update last edited time
    saveRecentDesign({ ...design, lastEdited: new Date() });
    
    // Navigate to editor
    router.push(`/t/${teamSlug}/kanva/editor?design=${design.id}`);
  };

  const filteredRecents = searchQuery
    ? recentDesigns.filter(d => d.title.toLowerCase().includes(searchQuery.toLowerCase()))
    : recentDesigns;

  if (!mounted) {
    return (
      <div className="h-full overflow-auto bg-background flex items-center justify-center">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    );
  }

  return (
    <div className="h-full overflow-auto bg-background">
      {/* Search Bar */}
      <div className="border-b border-border/50 bg-card/50">
        <div className="container mx-auto px-6 py-4">
          <div className="relative max-w-2xl mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search templates and designs..."
              value={searchQuery}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
              className="pl-12 h-12 bg-background border-border/50 focus:border-primary transition-colors text-base"
            />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8 max-w-7xl">
        {/* Template Categories */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Start designing</h2>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {TEMPLATE_CATEGORIES.map((category) => {
              const Icon = category.icon;
              return (
                <button
                  key={category.id}
                  onClick={() => handleCategoryClick(category)}
                  className="group relative rounded-xl border-2 border-border/50 bg-card p-6 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:border-primary/50"
                >
                  <div className="flex flex-col items-center gap-3">
                    <div className={cn(
                      "w-16 h-16 rounded-2xl bg-gradient-to-br flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform",
                      category.color
                    )}>
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                    <span className="text-sm font-semibold text-center">
                      {category.name}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {category.presets.length} templates
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Custom Size Button */}
          <div className="mt-6">
            <button
              onClick={handleCreateCustom}
              className="w-full rounded-xl border-2 border-dashed border-border/50 bg-card hover:border-primary/50 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg p-8"
            >
              <div className="flex flex-col items-center gap-3">
                <div className="w-16 h-16 rounded-2xl border-2 border-dashed border-border flex items-center justify-center hover:border-primary transition-colors">
                  <Plus className="w-8 h-8 text-muted-foreground" />
                </div>
                <div>
                  <div className="text-sm font-semibold">Custom Size</div>
                  <div className="text-xs text-muted-foreground">Create with any dimensions</div>
                </div>
              </div>
            </button>
          </div>
        </section>

        {/* Recent Designs Section */}
        {filteredRecents.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold">Recent designs</h2>
                <p className="text-sm text-muted-foreground mt-1">Pick up where you left off</p>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {filteredRecents.map((design) => (
                <button
                  key={design.id}
                  onClick={() => handleOpenDesign(design)}
                  className="group relative rounded-xl border-2 border-border/50 bg-card hover:border-primary transition-all duration-300 hover:scale-105 hover:shadow-xl overflow-hidden"
                >
                  {/* Canvas Preview */}
                  <div className="aspect-[3/4] bg-gradient-to-br from-muted to-muted/50 flex items-center justify-center relative">
                    <div className="text-center p-4">
                      <div className="text-xs font-mono text-muted-foreground mb-2">
                        {design.width} × {design.height}
                      </div>
                      <div className="w-full h-20 bg-background/50 rounded border border-border/50" />
                    </div>
                    
                    {/* Hover Overlay */}
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <div className="flex items-center gap-2 text-white text-sm font-medium">
                        <Edit2 className="w-4 h-4" />
                        Edit
                      </div>
                    </div>
                  </div>
                  
                  {/* Info */}
                  <div className="p-3 border-t border-border/50">
                    <p className="text-sm font-medium truncate">
                      {design.title}
                    </p>
                    <div className="flex items-center gap-1 mt-1 text-xs text-muted-foreground">
                      <Clock className="w-3 h-3" />
                      {formatTimeAgo(design.lastEdited)}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </section>
        )}

        {/* Template Selection Modal */}
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogContent className="max-w-4xl max-h-[85vh] overflow-hidden flex flex-col p-0 gap-0">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-border/50">
              <div className="flex items-center gap-3">
                {selectedCategory && (
                  <>
                    <div className={cn(
                      "w-12 h-12 rounded-xl bg-gradient-to-br flex items-center justify-center shadow-lg",
                      selectedCategory.color
                    )}>
                      <selectedCategory.icon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <DialogTitle className="text-xl font-bold">
                        {selectedCategory.name}
                      </DialogTitle>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {selectedCategory.presets.length} professional templates • Choose one to get started
                      </p>
                    </div>
                  </>
                )}
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => {
                  setIsModalOpen(false);
                  setSelectedCategory(null);
                }}
                className="rounded-full hover:bg-muted h-8 w-8"
              >
                <Plus className="w-4 h-4 rotate-45" />
              </Button>
            </div>
            
            {/* Content Area */}
            <div className="flex-1 overflow-y-auto px-6 py-5">
              <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {selectedCategory?.presets.map((preset) => {
                  const MockupComponent = getSocialMediaMockup(preset.id);
                  
                  return (
                    <button
                      key={preset.id}
                      onClick={() => handleCreateWithPreset(preset)}
                      className="group relative rounded-2xl border-2 border-border/40 bg-card hover:border-primary/60 transition-all duration-300 hover:scale-[1.03] hover:shadow-2xl overflow-hidden"
                    >
                      {/* Canvas Preview with Mockup */}
                      <div className="aspect-[3/4] bg-gradient-to-br from-muted/20 to-background flex items-center justify-center relative p-4">
                        {MockupComponent ? (
                          <div className="w-full h-full">
                            <MockupComponent />
                          </div>
                        ) : (
                          <div className="relative text-center space-y-2">
                            <div className="text-xs font-mono text-muted-foreground/80 bg-background/80 px-2 py-1 rounded">
                              {preset.width} × {preset.height}
                            </div>
                            <div className="w-full h-16 bg-background/60 rounded-lg border border-border/30 shadow-sm" />
                          </div>
                        )}
                        
                        {/* Hover Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col items-center justify-end pb-8 gap-3">
                          <div className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-8 py-3 rounded-xl text-sm font-bold shadow-2xl transform group-hover:scale-110 transition-transform">
                            Create Design
                          </div>
                          <div className="text-white/90 text-xs font-medium">
                            {preset.width} × {preset.height}
                          </div>
                        </div>
                      </div>
                      
                      {/* Info */}
                      <div className="p-4 bg-gradient-to-b from-card to-muted/20">
                        <p className="text-sm font-bold truncate mb-1">
                          {preset.name}
                        </p>
                        {preset.description && (
                          <p className="text-xs text-muted-foreground truncate">
                            {preset.description}
                          </p>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
            
            {/* Footer with Quick Actions */}
            <div className="border-t border-border/50 px-6 py-4 flex items-center justify-between bg-muted/30">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span className="font-medium text-foreground">
                  {selectedCategory?.presets.length} templates
                </span>
                <span>•</span>
                <span>Click any template to start designing</span>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setIsModalOpen(false);
                    setSelectedCategory(null);
                  }}
                  className="rounded-lg"
                >
                  Cancel
                </Button>
                <Button
                  size="sm"
                  onClick={handleCreateCustom}
                  className="rounded-lg bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white shadow-md hover:shadow-lg transition-all"
                >
                  <Plus className="w-4 h-4 mr-1.5" />
                  Custom Size
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </main>
    </div>
  );
}

import { useState } from 'react';
import {
  Smartphone,
  FileText,
  Video,
  Presentation,
  Image as ImageIcon,
  Megaphone,
  Sparkles,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface TemplateCategory {
  id: string;
  name: string;
  icon: any;
  count: number;
  color: string;
}

interface Template {
  id: string;
  name: string;
  category: string;
  thumbnail: string;
  width: number;
  height: number;
  isPro?: boolean;
}

interface TemplateGalleryProps {
  onSelectTemplate: (templateId: string) => void;
}

const categories: TemplateCategory[] = [
  { id: 'all', name: 'All Templates', icon: Sparkles, count: 1000, color: 'from-indigo-500 to-purple-600' },
  { id: 'social', name: 'Social Media', icon: Smartphone, count: 250, color: 'from-pink-500 to-rose-600' },
  { id: 'flyers', name: 'Flyers', icon: FileText, count: 150, color: 'from-blue-500 to-cyan-600' },
  { id: 'videos', name: 'Videos', icon: Video, count: 100, color: 'from-red-500 to-orange-600' },
  { id: 'presentations', name: 'Presentations', icon: Presentation, count: 120, color: 'from-green-500 to-emerald-600' },
  { id: 'thumbnails', name: 'Thumbnails', icon: ImageIcon, count: 80, color: 'from-amber-500 to-yellow-600' },
  { id: 'ads', name: 'Ads', icon: Megaphone, count: 90, color: 'from-violet-500 to-purple-600' },
];

// Mock templates - in real app, fetch from API
const mockTemplates: Template[] = [
  { id: '1', name: 'Instagram Post', category: 'social', thumbnail: '', width: 1080, height: 1080 },
  { id: '2', name: 'Facebook Cover', category: 'social', thumbnail: '', width: 1200, height: 630, isPro: true },
  { id: '3', name: 'Event Flyer', category: 'flyers', thumbnail: '', width: 2480, height: 3508 },
  { id: '4', name: 'YouTube Thumbnail', category: 'thumbnails', thumbnail: '', width: 1280, height: 720 },
  { id: '5', name: 'Business Presentation', category: 'presentations', thumbnail: '', width: 1920, height: 1080, isPro: true },
  { id: '6', name: 'Instagram Story', category: 'social', thumbnail: '', width: 1080, height: 1920 },
  { id: '7', name: 'Facebook Ad', category: 'ads', thumbnail: '', width: 1200, height: 628 },
  { id: '8', name: 'TikTok Video', category: 'videos', thumbnail: '', width: 1080, height: 1920 },
];

export function TemplateGallery({ onSelectTemplate }: TemplateGalleryProps) {
  const [selectedCategory, setSelectedCategory] = useState('all');

  const filteredTemplates = selectedCategory === 'all'
    ? mockTemplates
    : mockTemplates.filter(t => t.category === selectedCategory);

  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Templates</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Start with a professionally designed template
          </p>
        </div>
        <Button variant="outline" className="text-sm">
          See all templates
        </Button>
      </div>

      {/* Category Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {categories.map((category) => {
          const Icon = category.icon;
          const isActive = selectedCategory === category.id;
          
          return (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={cn(
                "flex items-center gap-2 px-4 py-2.5 rounded-xl border-2 transition-all whitespace-nowrap",
                isActive
                  ? "border-primary bg-primary text-primary-foreground shadow-lg"
                  : "border-border/50 bg-card hover:border-primary/50 hover:shadow-md"
              )}
            >
              <Icon className="w-4 h-4" />
              <span className="font-medium text-sm">{category.name}</span>
              <span className={cn(
                "px-2 py-0.5 text-xs font-semibold rounded-full",
                isActive
                  ? "bg-primary-foreground/20 text-primary-foreground"
                  : "bg-muted text-muted-foreground"
              )}>
                {category.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Templates Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {filteredTemplates.map((template) => (
          <button
            key={template.id}
            onClick={() => onSelectTemplate(template.id)}
            className="group relative rounded-xl border-2 border-border/50 bg-card hover:border-primary/50 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl overflow-hidden"
          >
            {/* Thumbnail */}
            <div className="aspect-[3/4] bg-gradient-to-br from-muted/50 to-muted/20 flex items-center justify-center relative">
              {template.thumbnail ? (
                <img
                  src={template.thumbnail}
                  alt={template.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="text-center p-4">
                  <div className="text-xs font-mono text-muted-foreground/80 bg-background/80 px-2 py-1 rounded mb-2">
                    {template.width} × {template.height}
                  </div>
                  <div className="w-full h-20 bg-background/60 rounded-lg border border-border/30" />
                </div>
              )}

              {/* Hover Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-end pb-6">
                <Button
                  size="sm"
                  className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white shadow-xl"
                >
                  Use Template
                </Button>
              </div>

              {/* Pro Badge */}
              {template.isPro && (
                <div className="absolute top-2 right-2">
                  <span className="px-2 py-1 text-xs font-semibold bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-md shadow-lg">
                    PRO
                  </span>
                </div>
              )}
            </div>

            {/* Info */}
            <div className="p-3 bg-card">
              <p className="text-sm font-semibold truncate">
                {template.name}
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">
                {template.width} × {template.height}
              </p>
            </div>
          </button>
        ))}
      </div>

      {/* Load More */}
      <div className="flex justify-center pt-4">
        <Button variant="outline" size="lg" className="gap-2">
          Load more templates
        </Button>
      </div>
    </section>
  );
}

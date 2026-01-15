"use client";



import React, { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Search, X } from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import { cn } from '@/lib/utils';

interface IconPickerProps {
  value: string;
  onChange: (iconName: string) => void;
  label?: string;
}

// Icon categories
const ICON_CATEGORIES = {
  arrows: [
    'ArrowRight', 'ArrowLeft', 'ArrowUp', 'ArrowDown',
    'ChevronRight', 'ChevronLeft', 'ChevronUp', 'ChevronDown',
    'ChevronsRight', 'ChevronsLeft', 'ChevronsUp', 'ChevronsDown',
    'ArrowUpRight', 'ArrowUpLeft', 'ArrowDownRight', 'ArrowDownLeft',
    'MoveRight', 'MoveLeft', 'MoveUp', 'MoveDown',
  ],
  ui: [
    'Check', 'X', 'Plus', 'Minus', 'Equal',
    'Menu', 'MoreVertical', 'MoreHorizontal',
    'Settings', 'Sliders', 'Filter', 'Search',
    'Home', 'Grid', 'List', 'Layers',
    'Eye', 'EyeOff', 'Lock', 'Unlock',
    'Bell', 'BellOff', 'Star', 'Heart',
  ],
  social: [
    'Facebook', 'Twitter', 'Instagram', 'Linkedin',
    'Youtube', 'Github', 'Mail', 'MessageCircle',
    'MessageSquare', 'Phone', 'Video', 'Share2',
  ],
  business: [
    'Briefcase', 'Building', 'Building2', 'Users',
    'User', 'UserPlus', 'UserMinus', 'UserCheck',
    'Calendar', 'Clock', 'DollarSign', 'CreditCard',
    'ShoppingCart', 'ShoppingBag', 'Package', 'Truck',
    'TrendingUp', 'TrendingDown', 'BarChart', 'PieChart',
  ],
  media: [
    'Image', 'Film', 'Music', 'Mic',
    'Camera', 'Video', 'Play', 'Pause',
    'Square', 'Circle', 'Triangle', 'Hexagon',
    'Volume2', 'VolumeX', 'Download', 'Upload',
  ],
  files: [
    'File', 'FileText', 'Folder', 'FolderOpen',
    'Save', 'Copy', 'Clipboard', 'Trash2',
    'Edit', 'Edit2', 'Edit3', 'Pen',
  ],
  communication: [
    'Send', 'Inbox', 'Mail', 'MessageCircle',
    'MessageSquare', 'Phone', 'PhoneCall', 'PhoneIncoming',
    'PhoneOutgoing', 'Video', 'Voicemail', 'AtSign',
  ],
  ecommerce: [
    'ShoppingCart', 'ShoppingBag', 'CreditCard', 'DollarSign',
    'Tag', 'Gift', 'Package', 'Truck',
    'Store', 'Percent', 'Receipt', 'Wallet',
  ],
  weather: [
    'Sun', 'Moon', 'Cloud', 'CloudRain',
    'CloudSnow', 'CloudLightning', 'Wind', 'Droplet',
    'Thermometer', 'Umbrella', 'Zap', 'Sunrise',
  ],
  misc: [
    'Award', 'Target', 'Flag', 'Bookmark',
    'Lightbulb', 'Zap', 'Sparkles', 'Crown',
    'Shield', 'Key', 'Map', 'MapPin',
    'Globe', 'Compass', 'Navigation', 'Anchor',
  ],
};

export function IconPicker({ value, onChange, label = 'Icon' }: IconPickerProps) {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<keyof typeof ICON_CATEGORIES>('ui');

  // Get the icon component
  const IconComponent = value ? (LucideIcons as any)[value] : null;

  // Filter icons based on search
  const filteredIcons = useMemo(() => {
    if (!searchQuery) {
      return ICON_CATEGORIES[activeCategory];
    }

    const query = searchQuery.toLowerCase();
    return Object.values(ICON_CATEGORIES)
      .flat()
      .filter((iconName) => iconName.toLowerCase().includes(query));
  }, [searchQuery, activeCategory]);

  const handleSelectIcon = (iconName: string) => {
    onChange(iconName);
    setOpen(false);
    setSearchQuery('');
  };

  const clearIcon = () => {
    onChange('');
    setOpen(false);
  };

  return (
    <div>
      <Label className="text-xs text-gray-600 dark:text-gray-400 mb-2 block">{label}</Label>
      
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button
            variant="outline"
            className="w-full justify-start h-auto py-2"
          >
            {IconComponent ? (
              <div className="flex items-center gap-2">
                <IconComponent className="w-5 h-5" />
                <span className="text-sm">{value}</span>
              </div>
            ) : (
              <span className="text-sm text-gray-500">Select an icon...</span>
            )}
          </Button>
        </DialogTrigger>

        <DialogContent className="max-w-3xl max-h-[80vh]">
          <DialogHeader>
            <DialogTitle>Choose an Icon</DialogTitle>
          </DialogHeader>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Search icons..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Categories */}
          {!searchQuery && (
            <Tabs value={activeCategory} onValueChange={(v) => setActiveCategory(v as any)}>
              <TabsList className="w-full justify-start overflow-x-auto flex-wrap h-auto">
                {Object.keys(ICON_CATEGORIES).map((category) => (
                  <TabsTrigger key={category} value={category} className="capitalize">
                    {category}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          )}

          {/* Icon Grid */}
          <ScrollArea className="h-[400px]">
            <div className="grid grid-cols-8 gap-2 p-2">
              {filteredIcons.map((iconName) => {
                const Icon = (LucideIcons as any)[iconName];
                if (!Icon) return null;

                return (
                  <button
                    key={iconName}
                    onClick={() => handleSelectIcon(iconName)}
                    className={cn(
                      'flex flex-col items-center justify-center p-3 rounded-lg border-2 transition-all hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20',
                      value === iconName
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                        : 'border-gray-200 dark:border-gray-700'
                    )}
                    title={iconName}
                  >
                    <Icon className="w-6 h-6" />
                    <span className="text-[10px] mt-1 text-gray-600 dark:text-gray-400 truncate w-full text-center">
                      {iconName}
                    </span>
                  </button>
                );
              })}
            </div>
          </ScrollArea>

          {/* Actions */}
          <div className="flex items-center justify-between pt-4 border-t">
            <Button
              variant="ghost"
              size="sm"
              onClick={clearIcon}
              disabled={!value}
            >
              <X className="w-4 h-4 mr-2" />
              Clear Icon
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Preview */}
      {IconComponent && (
        <div className="mt-2 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <IconComponent className="w-8 h-8" />
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900 dark:text-white">{value}</p>
              <p className="text-xs text-gray-500">Lucide React Icon</p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={clearIcon}
              className="h-8 w-8 p-0"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

// Helper function to get icon component by name
export function getIconComponent(iconName: string) {
  return (LucideIcons as any)[iconName] || null;
}

// Helper function to render icon by name
export function renderIcon(iconName: string, className?: string, style?: React.CSSProperties) {
  const Icon = getIconComponent(iconName);
  if (!Icon) return null;
  return <Icon className={className} style={style} />;
}

import { useState } from 'react';
import {
  Search,
  Bell,
  ChevronDown,
  Plus,
  Sparkles,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface DashboardHeaderProps {
  onCreateDesign: (type?: string) => void;
  onSearch: (query: string) => void;
}

export function DashboardHeader({ onCreateDesign, onSearch }: DashboardHeaderProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (value: string) => {
    setSearchQuery(value);
    onSearch(value);
  };

  const quickCreateOptions = [
    { label: 'Instagram Post', size: '1080 × 1080', type: 'instagram-post' },
    { label: 'Instagram Story', size: '1080 × 1920', type: 'instagram-story' },
    { label: 'Facebook Post', size: '1200 × 630', type: 'facebook-post' },
    { label: 'YouTube Thumbnail', size: '1280 × 720', type: 'youtube-thumbnail' },
    { label: 'Presentation', size: '1920 × 1080', type: 'presentation' },
    { label: 'Flyer', size: '2480 × 3508', type: 'flyer' },
    { label: 'Logo', size: '500 × 500', type: 'logo' },
    { label: 'Custom Size', size: 'Any dimensions', type: 'custom' },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-16 items-center justify-between px-6">
        {/* Left: Workspace Selector */}
        <div className="flex items-center gap-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="gap-2 font-semibold">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-sm font-bold">
                  K
                </div>
                <span>My Workspace</span>
                <ChevronDown className="w-4 h-4 opacity-50" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-64">
              <DropdownMenuItem>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold">
                    K
                  </div>
                  <div>
                    <div className="font-medium">My Workspace</div>
                    <div className="text-xs text-muted-foreground">Personal</div>
                  </div>
                </div>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Plus className="w-4 h-4 mr-2" />
                Create new workspace
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Center: Search */}
        <div className="flex-1 max-w-2xl mx-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search templates, projects, and more..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              className="pl-10 pr-4 h-10 bg-muted/50 border-border/50 focus:bg-background"
            />
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2">
          {/* Create Design Button */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button className="gap-2 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white shadow-lg">
                <Plus className="w-4 h-4" />
                Create Design
                <ChevronDown className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-72">
              <div className="p-2">
                <div className="text-xs font-semibold text-muted-foreground mb-2 px-2">
                  QUICK CREATE
                </div>
                {quickCreateOptions.map((option) => (
                  <DropdownMenuItem
                    key={option.type}
                    onClick={() => onCreateDesign(option.type)}
                    className="flex items-center justify-between py-2.5 cursor-pointer"
                  >
                    <span className="font-medium">{option.label}</span>
                    <span className="text-xs text-muted-foreground">{option.size}</span>
                  </DropdownMenuItem>
                ))}
              </div>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* AI Assistant */}
          <Button variant="outline" size="icon" className="relative">
            <Sparkles className="w-4 h-4" />
            <span className="absolute -top-1 -right-1 w-2 h-2 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full" />
          </Button>

          {/* Notifications */}
          <Button variant="outline" size="icon" className="relative">
            <Bell className="w-4 h-4" />
            <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full" />
          </Button>

          {/* Profile */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-pink-500 to-orange-500 flex items-center justify-center text-white text-sm font-bold">
                  M
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuItem>Profile</DropdownMenuItem>
              <DropdownMenuItem>Settings</DropdownMenuItem>
              <DropdownMenuItem>Billing</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Log out</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}

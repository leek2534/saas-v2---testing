"use client";

import { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import {
  Grid3x3,
  List,
  Search,
  Filter,
  Plus,
  MoreVertical,
  Edit,
  Copy,
  FolderOpen,
  Share2,
  Trash2,
  Star,
  Clock,
  FileText,
  Video,
  Image as ImageIcon,
  CheckSquare,
  SortAsc,
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
import { cn } from '@/lib/utils';

type ViewMode = 'grid' | 'list';
type SortBy = 'latest' | 'name' | 'size';
type FileType = 'all' | 'video' | 'flyer' | 'story' | 'post' | 'funnel';

interface Design {
  id: string;
  title: string;
  type: 'video' | 'flyer' | 'story' | 'post' | 'funnel';
  thumbnail?: string;
  width: number;
  height: number;
  lastEdited: Date;
  size: string;
  isStarred: boolean;
  folder?: string;
}

const mockDesigns: Design[] = [
  {
    id: '1',
    title: 'Instagram Post - Summer Sale',
    type: 'post',
    width: 1080,
    height: 1080,
    lastEdited: new Date(Date.now() - 1000 * 60 * 30),
    size: '2.4 MB',
    isStarred: true,
    folder: 'Marketing',
  },
  {
    id: '2',
    title: 'YouTube Thumbnail - Tutorial',
    type: 'video',
    width: 1280,
    height: 720,
    lastEdited: new Date(Date.now() - 1000 * 60 * 60 * 2),
    size: '1.8 MB',
    isStarred: false,
  },
  {
    id: '3',
    title: 'Instagram Story - Product Launch',
    type: 'story',
    width: 1080,
    height: 1920,
    lastEdited: new Date(Date.now() - 1000 * 60 * 60 * 5),
    size: '3.2 MB',
    isStarred: true,
  },
  {
    id: '4',
    title: 'Event Flyer - Conference 2024',
    type: 'flyer',
    width: 2480,
    height: 3508,
    lastEdited: new Date(Date.now() - 1000 * 60 * 60 * 24),
    size: '4.1 MB',
    isStarred: false,
  },
  {
    id: '5',
    title: 'Sales Funnel - Landing Page',
    type: 'funnel',
    width: 1920,
    height: 1080,
    lastEdited: new Date(Date.now() - 1000 * 60 * 60 * 48),
    size: '5.6 MB',
    isStarred: true,
  },
];

const getFileTypeIcon = (type: string) => {
  switch (type) {
    case 'video':
      return Video;
    case 'flyer':
      return FileText;
    case 'story':
    case 'post':
      return ImageIcon;
    case 'funnel':
      return FolderOpen;
    default:
      return FileText;
  }
};

const getFileTypeBadge = (type: string) => {
  const badges = {
    video: { label: 'Video', color: 'bg-red-500' },
    flyer: { label: 'Flyer', color: 'bg-blue-500' },
    story: { label: 'Story', color: 'bg-purple-500' },
    post: { label: 'Post', color: 'bg-pink-500' },
    funnel: { label: 'Funnel', color: 'bg-green-500' },
  };
  return badges[type as keyof typeof badges] || { label: 'Design', color: 'bg-gray-500' };
};

export function AllDesignsTab() {
  const router = useRouter();
  const params = useParams();
  const teamSlug = params.teamSlug as string;
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [sortBy, setSortBy] = useState<SortBy>('latest');
  const [filterType, setFilterType] = useState<FileType>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDesigns, setSelectedDesigns] = useState<string[]>([]);

  const formatTimeAgo = (date: Date): string => {
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
  };

  const handleEditDesign = (id: string) => {
    router.push(`/t/${teamSlug}/kanva/editor?project=${id}`);
  };

  const handleRename = (id: string) => {
    const design = mockDesigns.find(d => d.id === id);
    const newName = prompt('Enter new name:', design?.title);
    if (newName) {
      console.log('Rename:', id, newName);
      alert(`Renamed to: ${newName}`);
    }
  };

  const handleDuplicate = (id: string) => {
    const design = mockDesigns.find(d => d.id === id);
    console.log('Duplicate:', id);
    alert(`Duplicated: ${design?.title}`);
  };

  const handleMoveToFolder = (id: string) => {
    const folder = prompt('Enter folder name:');
    if (folder) {
      console.log('Move to folder:', id, folder);
      alert(`Moved to: ${folder}`);
    }
  };

  const handleShare = (id: string) => {
    const design = mockDesigns.find(d => d.id === id);
    const shareUrl = `${window.location.origin}/share/${id}`;
    navigator.clipboard.writeText(shareUrl);
    alert(`Share link copied!\n${shareUrl}`);
  };

  const handleDelete = (id: string) => {
    const design = mockDesigns.find(d => d.id === id);
    if (confirm(`Delete "${design?.title}"?`)) {
      console.log('Delete:', id);
      alert('Moved to trash');
    }
  };

  const handleToggleStar = (id: string) => {
    const design = mockDesigns.find(d => d.id === id);
    if (design) {
      design.isStarred = !design.isStarred;
      alert(design.isStarred ? 'Added to starred!' : 'Removed from starred!');
    }
  };

  const handleSelectDesign = (id: string) => {
    setSelectedDesigns(prev =>
      prev.includes(id) ? prev.filter(d => d !== id) : [...prev, id]
    );
  };

  const handleBulkDelete = () => {
    if (selectedDesigns.length > 0 && confirm(`Delete ${selectedDesigns.length} designs?`)) {
      console.log('Bulk delete:', selectedDesigns);
      alert(`${selectedDesigns.length} designs moved to trash`);
      setSelectedDesigns([]);
    }
  };

  const handleCreateNew = () => {
    router.push(`/t/${teamSlug}/kanva`);
  };

  // Filter designs
  const filteredDesigns = mockDesigns.filter(design => {
    if (filterType !== 'all' && design.type !== filterType) return false;
    if (searchQuery && !design.title.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  // Sort designs
  const sortedDesigns = [...filteredDesigns].sort((a, b) => {
    switch (sortBy) {
      case 'latest':
        return b.lastEdited.getTime() - a.lastEdited.getTime();
      case 'name':
        return a.title.localeCompare(b.title);
      case 'size':
        return parseFloat(b.size) - parseFloat(a.size);
      default:
        return 0;
    }
  });

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="border-b border-border/40 p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold">Your Designs</h1>
            <p className="text-muted-foreground mt-1">
              {sortedDesigns.length} designs • Fast access to all your work
            </p>
          </div>
          <Button onClick={handleCreateNew} className="gap-2">
            <Plus className="w-4 h-4" />
            Create New
          </Button>
        </div>

        {/* Toolbar */}
        <div className="flex items-center gap-3">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search designs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* View Toggle */}
          <div className="flex border border-border/40 rounded-lg">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('grid')}
              className="rounded-r-none"
            >
              <Grid3x3 className="w-4 h-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('list')}
              className="rounded-l-none border-l"
            >
              <List className="w-4 h-4" />
            </Button>
          </div>

          {/* Sort */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="gap-2">
                <SortAsc className="w-4 h-4" />
                Sort: {sortBy === 'latest' ? 'Latest' : sortBy === 'name' ? 'Name' : 'Size'}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => setSortBy('latest')}>
                Latest First
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSortBy('name')}>
                Name (A-Z)
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSortBy('size')}>
                Size (Largest)
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Filter */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="gap-2">
                <Filter className="w-4 h-4" />
                Filter
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => setFilterType('all')}>
                All Types
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setFilterType('post')}>
                Posts
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilterType('story')}>
                Stories
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilterType('video')}>
                Videos
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilterType('flyer')}>
                Flyers
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilterType('funnel')}>
                Funnels
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Bulk Actions */}
          {selectedDesigns.length > 0 && (
            <Button variant="destructive" size="sm" onClick={handleBulkDelete}>
              <Trash2 className="w-4 h-4 mr-2" />
              Delete ({selectedDesigns.length})
            </Button>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6">
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {sortedDesigns.map((design) => {
              const badge = getFileTypeBadge(design.type);
              const TypeIcon = getFileTypeIcon(design.type);
              
              return (
                <div
                  key={design.id}
                  className="group relative rounded-xl border-2 border-border/50 bg-card hover:border-primary/50 transition-all overflow-hidden"
                >
                  {/* Selection Checkbox */}
                  <div className="absolute top-2 left-2 z-10">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSelectDesign(design.id);
                      }}
                      className={cn(
                        "w-6 h-6 rounded border-2 flex items-center justify-center transition-all",
                        selectedDesigns.includes(design.id)
                          ? "bg-primary border-primary"
                          : "bg-background/80 border-border hover:border-primary opacity-0 group-hover:opacity-100"
                      )}
                    >
                      {selectedDesigns.includes(design.id) && (
                        <CheckSquare className="w-4 h-4 text-primary-foreground" />
                      )}
                    </button>
                  </div>

                  {/* Thumbnail */}
                  <button
                    onClick={() => handleEditDesign(design.id)}
                    className="w-full"
                  >
                    <div className="aspect-[3/4] bg-gradient-to-br from-muted/50 to-muted/20 flex items-center justify-center relative">
                      <TypeIcon className="w-12 h-12 text-muted-foreground/30" />

                      {/* File Type Badge */}
                      <div className="absolute top-2 right-2">
                        <span className={cn("px-2 py-1 text-xs font-semibold rounded-md text-white", badge.color)}>
                          {badge.label}
                        </span>
                      </div>

                      {/* Star */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleToggleStar(design.id);
                        }}
                        className="absolute bottom-2 right-2 p-1.5 rounded-full bg-black/40 backdrop-blur hover:bg-black/60 transition-colors"
                      >
                        <Star
                          className={cn(
                            "w-4 h-4",
                            design.isStarred
                              ? "fill-yellow-400 text-yellow-400"
                              : "text-white"
                          )}
                        />
                      </button>

                      {/* Hover Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <Button size="sm" className="bg-white text-black hover:bg-white/90">
                          <Edit className="w-3 h-3 mr-1.5" />
                          Edit
                        </Button>
                      </div>
                    </div>

                    {/* Info */}
                    <div className="p-3">
                      <p className="text-sm font-semibold truncate">{design.title}</p>
                      <div className="flex items-center justify-between mt-1 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {formatTimeAgo(design.lastEdited)}
                        </span>
                        <span>{design.size}</span>
                      </div>
                    </div>
                  </button>

                  {/* Context Menu */}
                  <div className="absolute bottom-3 right-3">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity bg-background/80"
                        >
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleEditDesign(design.id)}>
                          <Edit className="w-4 h-4 mr-2" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleRename(design.id)}>
                          <FileText className="w-4 h-4 mr-2" />
                          Rename
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleDuplicate(design.id)}>
                          <Copy className="w-4 h-4 mr-2" />
                          Duplicate
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleMoveToFolder(design.id)}>
                          <FolderOpen className="w-4 h-4 mr-2" />
                          Move to Folder
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleShare(design.id)}>
                          <Share2 className="w-4 h-4 mr-2" />
                          Share
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => handleDelete(design.id)} className="text-red-600">
                          <Trash2 className="w-4 h-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="space-y-2">
            {sortedDesigns.map((design) => {
              const badge = getFileTypeBadge(design.type);
              const TypeIcon = getFileTypeIcon(design.type);
              
              return (
                <div
                  key={design.id}
                  className="flex items-center gap-4 p-4 rounded-lg border border-border/50 hover:border-primary/50 transition-all group"
                >
                  <input
                    type="checkbox"
                    checked={selectedDesigns.includes(design.id)}
                    onChange={() => handleSelectDesign(design.id)}
                    className="w-4 h-4"
                  />
                  <div className="w-16 h-16 rounded bg-muted flex items-center justify-center">
                    <TypeIcon className="w-8 h-8 text-muted-foreground/50" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="font-semibold">{design.title}</p>
                      <span className={cn("px-2 py-0.5 text-xs font-semibold rounded text-white", badge.color)}>
                        {badge.label}
                      </span>
                      {design.isStarred && (
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      {formatTimeAgo(design.lastEdited)} • {design.size} • {design.width}×{design.height}
                      {design.folder && ` • ${design.folder}`}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEditDesign(design.id)}
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    Edit
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleRename(design.id)}>
                        <FileText className="w-4 h-4 mr-2" />
                        Rename
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleDuplicate(design.id)}>
                        <Copy className="w-4 h-4 mr-2" />
                        Duplicate
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleMoveToFolder(design.id)}>
                        <FolderOpen className="w-4 h-4 mr-2" />
                        Move to Folder
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleShare(design.id)}>
                        <Share2 className="w-4 h-4 mr-2" />
                        Share
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => handleDelete(design.id)} className="text-red-600">
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              );
            })}
          </div>
        )}

        {sortedDesigns.length === 0 && (
          <div className="flex flex-col items-center justify-center h-64 text-center">
            <FolderOpen className="w-16 h-16 text-muted-foreground/50 mb-4" />
            <h3 className="text-lg font-semibold mb-2">No designs found</h3>
            <p className="text-muted-foreground mb-4">
              {searchQuery ? 'Try a different search term' : 'Create your first design to get started'}
            </p>
            <Button onClick={handleCreateNew}>
              <Plus className="w-4 h-4 mr-2" />
              Create New Design
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

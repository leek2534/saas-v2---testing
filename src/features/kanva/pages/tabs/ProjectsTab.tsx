"use client";

import { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import {
  Grid3x3,
  List,
  Columns,
  Star,
  Trash2,
  FolderOpen,
  Search,
  Filter,
  MoreVertical,
  Edit,
  Copy,
  Share2,
  Download,
  Clock,
  CheckSquare,
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

type ViewMode = 'grid' | 'list' | 'split';
type SortBy = 'recent' | 'name' | 'size' | 'status';
type FilterBy = 'all' | 'draft' | 'published' | 'starred';

interface Project {
  id: string;
  title: string;
  thumbnail?: string;
  width: number;
  height: number;
  lastEdited: Date;
  status: 'draft' | 'published';
  isStarred: boolean;
  folder?: string;
  size?: string;
  version?: number;
}

const mockProjects: Project[] = [
  {
    id: '1',
    title: 'Instagram Post - Summer Sale',
    width: 1080,
    height: 1080,
    lastEdited: new Date(Date.now() - 1000 * 60 * 30),
    status: 'draft',
    isStarred: true,
    folder: 'Marketing',
    size: '2.4 MB',
    version: 3,
  },
  {
    id: '2',
    title: 'Facebook Cover - Brand Launch',
    width: 1200,
    height: 630,
    lastEdited: new Date(Date.now() - 1000 * 60 * 60 * 2),
    status: 'published',
    isStarred: false,
    folder: 'Social Media',
    size: '1.8 MB',
    version: 1,
  },
  // Add more mock projects...
];

const folders = [
  { id: 'all', name: 'All Projects', icon: FolderOpen, count: 24 },
  { id: 'starred', name: 'Starred', icon: Star, count: 8 },
  { id: 'marketing', name: 'Marketing', icon: FolderOpen, count: 12 },
  { id: 'social', name: 'Social Media', icon: FolderOpen, count: 15 },
  { id: 'trash', name: 'Trash', icon: Trash2, count: 3 },
];

export function ProjectsTab() {
  const router = useRouter();
  const params = useParams();
  const teamSlug = params.teamSlug as string;
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [sortBy, setSortBy] = useState<SortBy>('recent');
  const [filterBy, setFilterBy] = useState<FilterBy>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFolder, setSelectedFolder] = useState('all');
  const [selectedProjects, setSelectedProjects] = useState<string[]>([]);

  const handleEditProject = (id: string) => {
    router.push(`/t/${teamSlug}/kanva/editor?project=${id}`);
  };

  const handleSelectProject = (id: string) => {
    setSelectedProjects(prev =>
      prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]
    );
  };

  const handleBulkDelete = () => {
    if (selectedProjects.length > 0 && confirm(`Delete ${selectedProjects.length} projects?`)) {
      console.log('Bulk delete:', selectedProjects);
      setSelectedProjects([]);
    }
  };

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

  return (
    <div className="flex h-full">
      {/* Left Sidebar - Folders */}
      <aside className="w-64 border-r border-border/40 bg-muted/20 p-4">
        <div className="space-y-1">
          {folders.map((folder) => {
            const Icon = folder.icon;
            return (
              <button
                key={folder.id}
                onClick={() => setSelectedFolder(folder.id)}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all",
                  selectedFolder === folder.id
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                <Icon className="w-4 h-4" />
                <span className="flex-1 text-left">{folder.name}</span>
                <span className="text-xs opacity-70">{folder.count}</span>
              </button>
            );
          })}
        </div>

        <div className="mt-6">
          <Button variant="outline" size="sm" className="w-full">
            <FolderOpen className="w-4 h-4 mr-2" />
            New Folder
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Toolbar */}
        <div className="border-b border-border/40 p-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Input
                placeholder="Search projects..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-64"
              />
              <Button variant="outline" size="icon">
                <Search className="w-4 h-4" />
              </Button>
            </div>

            <div className="flex items-center gap-2">
              {/* View Mode Toggle */}
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
                  className="rounded-none border-x"
                >
                  <List className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === 'split' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('split')}
                  className="rounded-l-none"
                >
                  <Columns className="w-4 h-4" />
                </Button>
              </div>

              {/* Sort & Filter */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Filter className="w-4 h-4 mr-2" />
                    Filter
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={() => setFilterBy('all')}>
                    All Projects
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setFilterBy('draft')}>
                    Drafts Only
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setFilterBy('published')}>
                    Published Only
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setFilterBy('starred')}>
                    Starred Only
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {selectedProjects.length > 0 && (
                <Button variant="destructive" size="sm" onClick={handleBulkDelete}>
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete ({selectedProjects.length})
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Projects Grid/List */}
        <div className="flex-1 overflow-y-auto p-6">
          {viewMode === 'grid' && (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {mockProjects.map((project) => (
                <div
                  key={project.id}
                  className="group relative rounded-xl border-2 border-border/50 bg-card hover:border-primary/50 transition-all overflow-hidden"
                >
                  {/* Selection Checkbox */}
                  <div className="absolute top-2 left-2 z-10">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSelectProject(project.id);
                      }}
                      className={cn(
                        "w-6 h-6 rounded border-2 flex items-center justify-center transition-all",
                        selectedProjects.includes(project.id)
                          ? "bg-primary border-primary"
                          : "bg-background/80 border-border hover:border-primary"
                      )}
                    >
                      {selectedProjects.includes(project.id) && (
                        <CheckSquare className="w-4 h-4 text-primary-foreground" />
                      )}
                    </button>
                  </div>

                  {/* Thumbnail */}
                  <button
                    onClick={() => handleEditProject(project.id)}
                    className="w-full"
                  >
                    <div className="aspect-[3/4] bg-gradient-to-br from-muted/50 to-muted/20 flex items-center justify-center relative">
                      <div className="text-xs font-mono text-muted-foreground">
                        {project.width} × {project.height}
                      </div>

                      {/* Status Badge */}
                      <div className="absolute top-2 right-2">
                        <span
                          className={cn(
                            "px-2 py-1 text-xs font-semibold rounded-md",
                            project.status === 'published'
                              ? "bg-green-500/90 text-white"
                              : "bg-amber-500/90 text-white"
                          )}
                        >
                          {project.status}
                        </span>
                      </div>

                      {/* Star */}
                      {project.isStarred && (
                        <div className="absolute bottom-2 right-2">
                          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        </div>
                      )}
                    </div>

                    {/* Info */}
                    <div className="p-3">
                      <p className="text-sm font-semibold truncate">{project.title}</p>
                      <div className="flex items-center justify-between mt-1 text-xs text-muted-foreground">
                        <span>{formatTimeAgo(project.lastEdited)}</span>
                        <span>{project.size}</span>
                      </div>
                    </div>
                  </button>

                  {/* Actions Menu */}
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
                        <DropdownMenuItem>
                          <Edit className="w-4 h-4 mr-2" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Copy className="w-4 h-4 mr-2" />
                          Duplicate
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Share2 className="w-4 h-4 mr-2" />
                          Share
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Download className="w-4 h-4 mr-2" />
                          Download
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Clock className="w-4 h-4 mr-2" />
                          Version History
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-red-600">
                          <Trash2 className="w-4 h-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              ))}
            </div>
          )}

          {viewMode === 'list' && (
            <div className="space-y-2">
              {mockProjects.map((project) => (
                <div
                  key={project.id}
                  className="flex items-center gap-4 p-4 rounded-lg border border-border/50 hover:border-primary/50 transition-all"
                >
                  <input
                    type="checkbox"
                    checked={selectedProjects.includes(project.id)}
                    onChange={() => handleSelectProject(project.id)}
                    className="w-4 h-4"
                  />
                  <div className="w-16 h-16 rounded bg-muted flex items-center justify-center text-xs">
                    {project.width}×{project.height}
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold">{project.title}</p>
                    <p className="text-sm text-muted-foreground">
                      {formatTimeAgo(project.lastEdited)} • {project.size} • v{project.version}
                    </p>
                  </div>
                  <span
                    className={cn(
                      "px-3 py-1 text-xs font-semibold rounded-full",
                      project.status === 'published'
                        ? "bg-green-500/20 text-green-700"
                        : "bg-amber-500/20 text-amber-700"
                    )}
                  >
                    {project.status}
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEditProject(project.id)}
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    Edit
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

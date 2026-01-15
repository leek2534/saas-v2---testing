import { useState } from 'react';
import {
  MoreVertical,
  Edit,
  Copy,
  Trash2,
  Share2,
  Download,
  Star,
  Clock,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';

interface Project {
  id: string;
  title: string;
  thumbnail?: string;
  width: number;
  height: number;
  lastEdited: Date;
  status: 'draft' | 'published';
  isStarred?: boolean;
}

interface RecentProjectsProps {
  projects: Project[];
  onEdit: (id: string) => void;
  onDuplicate: (id: string) => void;
  onDelete: (id: string) => void;
  onShare: (id: string) => void;
  onToggleStar: (id: string) => void;
}

export function RecentProjects({
  projects,
  onEdit,
  onDuplicate,
  onDelete,
  onShare,
  onToggleStar,
}: RecentProjectsProps) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

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
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Recent Projects</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Pick up where you left off
          </p>
        </div>
        <Button variant="ghost" className="text-sm">
          View all
        </Button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {projects.map((project) => (
          <div
            key={project.id}
            className="group relative"
            onMouseEnter={() => setHoveredId(project.id)}
            onMouseLeave={() => setHoveredId(null)}
          >
            <button
              onClick={() => onEdit(project.id)}
              className="w-full rounded-xl border-2 border-border/50 bg-card hover:border-primary/50 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl overflow-hidden"
            >
              {/* Thumbnail */}
              <div className="aspect-[3/4] bg-gradient-to-br from-muted/50 to-muted/20 flex items-center justify-center relative">
                {project.thumbnail ? (
                  <img
                    src={project.thumbnail}
                    alt={project.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="text-center p-4">
                    <div className="text-xs font-mono text-muted-foreground/80 bg-background/80 px-2 py-1 rounded mb-2">
                      {project.width} × {project.height}
                    </div>
                    <div className="w-full h-20 bg-background/60 rounded-lg border border-border/30" />
                  </div>
                )}

                {/* Hover Overlay */}
                {hoveredId === project.id && (
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex flex-col items-center justify-end pb-6 gap-2">
                    <Button
                      size="sm"
                      className="bg-white text-black hover:bg-white/90 shadow-xl"
                      onClick={(e) => {
                        e.stopPropagation();
                        onEdit(project.id);
                      }}
                    >
                      <Edit className="w-3 h-3 mr-1.5" />
                      Edit Design
                    </Button>
                  </div>
                )}

                {/* Status Badge */}
                <div className="absolute top-2 left-2">
                  <span
                    className={cn(
                      "px-2 py-1 text-xs font-semibold rounded-md",
                      project.status === 'published'
                        ? "bg-green-500/90 text-white"
                        : "bg-amber-500/90 text-white"
                    )}
                  >
                    {project.status === 'published' ? 'Published' : 'Draft'}
                  </span>
                </div>

                {/* Star Button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleStar(project.id);
                  }}
                  className="absolute top-2 right-2 p-1.5 rounded-full bg-black/40 backdrop-blur hover:bg-black/60 transition-colors"
                >
                  <Star
                    className={cn(
                      "w-4 h-4",
                      project.isStarred
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-white"
                    )}
                  />
                </button>
              </div>

              {/* Info */}
              <div className="p-3 bg-card">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold truncate">
                      {project.title}
                    </p>
                    <div className="flex items-center gap-1 mt-1 text-xs text-muted-foreground">
                      <Clock className="w-3 h-3" />
                      {formatTimeAgo(project.lastEdited)}
                    </div>
                  </div>

                  {/* Actions Menu */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => onEdit(project.id)}>
                        <Edit className="w-4 h-4 mr-2" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onDuplicate(project.id)}>
                        <Copy className="w-4 h-4 mr-2" />
                        Duplicate
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onShare(project.id)}>
                        <Share2 className="w-4 h-4 mr-2" />
                        Share
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Download className="w-4 h-4 mr-2" />
                        Download
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => onDelete(project.id)}
                        className="text-red-600"
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}

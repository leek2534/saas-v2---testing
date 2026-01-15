import { useState } from 'react';
import {
  Upload,
  Image as ImageIcon,
  Video,
  Music,
  FileText,
  Folder,
  Search,
  Grid3x3,
  List,
  MoreVertical,
  Download,
  Trash2,
  Edit,
  Tag,
  Filter,
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

type FileCategory = 'all' | 'images' | 'videos' | 'audio' | 'documents' | 'icons';
type ViewMode = 'grid' | 'list';

interface UploadedFile {
  id: string;
  name: string;
  type: FileCategory;
  size: string;
  uploadedAt: Date;
  url?: string;
  tags?: string[];
}

const mockFiles: UploadedFile[] = [
  {
    id: '1',
    name: 'product-photo.jpg',
    type: 'images',
    size: '2.4 MB',
    uploadedAt: new Date(Date.now() - 1000 * 60 * 30),
    tags: ['product', 'photography'],
  },
  {
    id: '2',
    name: 'promo-video.mp4',
    type: 'videos',
    size: '15.8 MB',
    uploadedAt: new Date(Date.now() - 1000 * 60 * 60 * 2),
    tags: ['promo', 'video'],
  },
  {
    id: '3',
    name: 'background-music.mp3',
    type: 'audio',
    size: '4.2 MB',
    uploadedAt: new Date(Date.now() - 1000 * 60 * 60 * 5),
  },
  {
    id: '4',
    name: 'brand-guidelines.pdf',
    type: 'documents',
    size: '1.1 MB',
    uploadedAt: new Date(Date.now() - 1000 * 60 * 60 * 24),
    tags: ['brand', 'guidelines'],
  },
];

const categories = [
  { id: 'all', label: 'All Files', icon: Folder, count: 24 },
  { id: 'images', label: 'Images', icon: ImageIcon, count: 12 },
  { id: 'videos', label: 'Videos', icon: Video, count: 5 },
  { id: 'audio', label: 'Audio', icon: Music, count: 3 },
  { id: 'documents', label: 'Documents', icon: FileText, count: 4 },
  { id: 'icons', label: 'Icons', icon: ImageIcon, count: 0 },
];

const getFileIcon = (type: FileCategory) => {
  switch (type) {
    case 'images':
      return ImageIcon;
    case 'videos':
      return Video;
    case 'audio':
      return Music;
    case 'documents':
      return FileText;
    case 'icons':
      return ImageIcon;
    default:
      return FileText;
  }
};

export function UploadsTab() {
  const [selectedCategory, setSelectedCategory] = useState<FileCategory>('all');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files);
    handleFileUpload(files);
  };

  const handleFileUpload = (files: File[]) => {
    console.log('Uploading files:', files);
    alert(`Uploading ${files.length} file(s)...`);
  };

  const handleBrowseFiles = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.multiple = true;
    input.onchange = (e) => {
      const files = Array.from((e.target as HTMLInputElement).files || []);
      handleFileUpload(files);
    };
    input.click();
  };

  const handleRename = (id: string) => {
    const file = mockFiles.find(f => f.id === id);
    const newName = prompt('Enter new name:', file?.name);
    if (newName) {
      alert(`Renamed to: ${newName}`);
    }
  };

  const handleDelete = (id: string) => {
    const file = mockFiles.find(f => f.id === id);
    if (confirm(`Delete "${file?.name}"?`)) {
      alert('File deleted');
    }
  };

  const handleDownload = (id: string) => {
    const file = mockFiles.find(f => f.id === id);
    alert(`Downloading: ${file?.name}`);
  };

  const handleAddTag = (id: string) => {
    const tag = prompt('Enter tag:');
    if (tag) {
      alert(`Added tag: ${tag}`);
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

  const filteredFiles = mockFiles.filter(file => {
    if (selectedCategory !== 'all' && file.type !== selectedCategory) return false;
    if (searchQuery && !file.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="flex h-full">
      {/* Sidebar - Categories */}
      <aside className="w-64 border-r border-border/40 bg-muted/20 p-4">
        <div className="space-y-1">
          {categories.map((category) => {
            const Icon = category.icon;
            return (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id as FileCategory)}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all",
                  selectedCategory === category.id
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                <Icon className="w-4 h-4" />
                <span className="flex-1 text-left">{category.label}</span>
                <span className="text-xs opacity-70">{category.count}</span>
              </button>
            );
          })}
        </div>

        <div className="mt-6 pt-6 border-t border-border/40">
          <p className="text-xs font-semibold text-muted-foreground mb-3 px-3">STORAGE</p>
          <div className="px-3">
            <div className="flex items-center justify-between text-sm mb-2">
              <span className="text-muted-foreground">Used</span>
              <span className="font-semibold">2.4 GB / 10 GB</span>
            </div>
            <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-indigo-500 to-purple-600" style={{ width: '24%' }} />
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Toolbar */}
        <div className="border-b border-border/40 p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold">Uploads</h1>
              <p className="text-muted-foreground mt-1">
                {filteredFiles.length} files • Manage your assets
              </p>
            </div>
            <Button onClick={handleBrowseFiles} className="gap-2">
              <Upload className="w-4 h-4" />
              Upload Files
            </Button>
          </div>

          <div className="flex items-center gap-3">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search files..."
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

            {/* Filter */}
            <Button variant="outline" size="sm">
              <Filter className="w-4 h-4 mr-2" />
              Filter
            </Button>
          </div>
        </div>

        {/* Upload Area */}
        <div className="p-6">
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={cn(
              "border-2 border-dashed rounded-xl p-12 text-center transition-all mb-6",
              isDragging
                ? "border-primary bg-primary/5"
                : "border-border/50 hover:border-primary/50"
            )}
          >
            <Upload className="w-16 h-16 text-muted-foreground/50 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">
              {isDragging ? 'Drop files here' : 'Drag & drop files'}
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              or click to browse from your computer
            </p>
            <Button onClick={handleBrowseFiles}>
              Browse Files
            </Button>
          </div>

          {/* Files Grid/List */}
          {viewMode === 'grid' ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {filteredFiles.map((file) => {
                const Icon = getFileIcon(file.type);
                
                return (
                  <div
                    key={file.id}
                    className="group relative rounded-xl border-2 border-border/50 bg-card hover:border-primary/50 transition-all overflow-hidden"
                  >
                    {/* Preview */}
                    <div className="aspect-square bg-gradient-to-br from-muted/50 to-muted/20 flex items-center justify-center">
                      <Icon className="w-12 h-12 text-muted-foreground/50" />
                    </div>

                    {/* Info */}
                    <div className="p-3">
                      <p className="text-sm font-semibold truncate">{file.name}</p>
                      <div className="flex items-center justify-between mt-1 text-xs text-muted-foreground">
                        <span>{formatTimeAgo(file.uploadedAt)}</span>
                        <span>{file.size}</span>
                      </div>
                      {file.tags && file.tags.length > 0 && (
                        <div className="flex gap-1 mt-2">
                          {file.tags.map((tag, i) => (
                            <span
                              key={i}
                              className="px-2 py-0.5 text-xs bg-primary/10 text-primary rounded"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Context Menu */}
                    <div className="absolute top-2 right-2">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity bg-background/80"
                          >
                            <MoreVertical className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleDownload(file.id)}>
                            <Download className="w-4 h-4 mr-2" />
                            Download
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleRename(file.id)}>
                            <Edit className="w-4 h-4 mr-2" />
                            Rename
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleAddTag(file.id)}>
                            <Tag className="w-4 h-4 mr-2" />
                            Add Tag
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => handleDelete(file.id)} className="text-red-600">
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
              {filteredFiles.map((file) => {
                const Icon = getFileIcon(file.type);
                
                return (
                  <div
                    key={file.id}
                    className="flex items-center gap-4 p-4 rounded-lg border border-border/50 hover:border-primary/50 transition-all"
                  >
                    <div className="w-12 h-12 rounded bg-muted flex items-center justify-center">
                      <Icon className="w-6 h-6 text-muted-foreground/50" />
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold">{file.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {formatTimeAgo(file.uploadedAt)} • {file.size} • {file.type}
                      </p>
                      {file.tags && file.tags.length > 0 && (
                        <div className="flex gap-1 mt-1">
                          {file.tags.map((tag, i) => (
                            <span
                              key={i}
                              className="px-2 py-0.5 text-xs bg-primary/10 text-primary rounded"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleDownload(file.id)}>
                          <Download className="w-4 h-4 mr-2" />
                          Download
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleRename(file.id)}>
                          <Edit className="w-4 h-4 mr-2" />
                          Rename
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleAddTag(file.id)}>
                          <Tag className="w-4 h-4 mr-2" />
                          Add Tag
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => handleDelete(file.id)} className="text-red-600">
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

          {filteredFiles.length === 0 && (
            <div className="flex items-center justify-center h-64 border-2 border-dashed border-border rounded-xl">
              <div className="text-center">
                <Folder className="w-16 h-16 text-muted-foreground/50 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No files found</h3>
                <p className="text-muted-foreground mb-4">
                  {searchQuery ? 'Try a different search term' : 'Upload your first file to get started'}
                </p>
                <Button onClick={handleBrowseFiles}>
                  <Upload className="w-4 h-4 mr-2" />
                  Upload Files
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

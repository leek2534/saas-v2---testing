"use client";

import { useCurrentTeam } from "@/app/t/[teamSlug]/hooks";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { 
  ArrowLeft, 
  Upload, 
  Image as ImageIcon, 
  Search, 
  Filter,
  MoreHorizontal,
  Download,
  Trash2,
  Eye,
  Copy,
  Grid3X3,
  List,
  Plus
} from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useState, useRef } from "react";
import { useToast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";
import { api } from "@/convex/_generated/api";
import { useQuery, useMutation } from "convex/react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Mock data - will replace with real Convex calls
const mockImages = [
  {
    _id: "img_1",
    fileName: "product-hero.jpg",
    fileSize: 245760, // 240KB
    url: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&h=600&fit=crop",
    uploadedAt: Date.now() - 86400000,
    tags: ["hero", "product", "featured"],
    usedInProducts: ["Premium Design Template", "Website Starter Kit"],
  },
  {
    _id: "img_2",
    fileName: "logo-design.png",
    fileSize: 126976, // 124KB
    url: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=800&h=600&fit=crop",
    uploadedAt: Date.now() - 172800000,
    tags: ["logo", "branding", "design"],
    usedInProducts: ["Logo Design Service"],
  },
  {
    _id: "img_3",
    fileName: "template-preview.jpg",
    fileSize: 384512, // 376KB
    url: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop",
    uploadedAt: Date.now() - 259200000,
    tags: ["template", "preview", "design"],
    usedInProducts: [],
  },
  {
    _id: "img_4",
    fileName: "service-icon.svg",
    fileSize: 8192, // 8KB
    url: "https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=800&h=600&fit=crop",
    uploadedAt: Date.now() - 604800000,
    tags: ["icon", "service", "vector"],
    usedInProducts: ["Logo Design Service"],
  }
];

export default function ImagesPage() {
  const team = useCurrentTeam();
  const { teamSlug } = useParams();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Convex hooks for real data
  const images = useQuery(api.catalog.listImages) || [];
  const generateUploadUrl = useMutation(api.catalog.generateUploadUrl);
  const saveImageMetadata = useMutation(api.catalog.saveImageMetadata);
  const deleteImage = useMutation(api.catalog.deleteImage);

  if (team == null) {
    return null;
  }

  const filteredImages = images.filter((image: any) => 
    image.fileName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    image.tags.some((tag: any) => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString();
  };

  const handleFileUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        
        // Generate upload URL
        const uploadUrl = await generateUploadUrl();
        
        // Upload file to Convex storage
        const response = await fetch(uploadUrl, {
          method: "POST",
          headers: { "Content-Type": file.type },
          body: file,
        });
        
        if (!response.ok) {
          throw new Error("Upload failed");
        }
        
        const { storageId } = await response.json();
        
        // Save image metadata to database
        await saveImageMetadata({
          storageId,
          fileName: file.name,
          fileSize: file.size,
          contentType: file.type,
        });
      }
      
      toast({
        title: "Upload Complete",
        description: `${files.length} image(s) uploaded successfully`,
      });
      
      setIsUploadDialogOpen(false);
    } catch (error) {
      toast({
        title: "Upload Failed",
        description: "Failed to upload images",
        variant: "destructive",
      });
      console.error(error);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFileUpload(e.dataTransfer.files);
  };

  const handleDeleteImage = async (imageId: string) => {
    if (!confirm("Are you sure you want to delete this image?")) return;
    
    try {
      await deleteImage({ imageId });
      
      toast({
        title: "Deleted",
        description: "Image deleted successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete image",
        variant: "destructive",
      });
    }
  };

  const handlePreviewImage = (imageId: string) => {
    // TODO: Implement image preview modal
    toast({
      title: "Preview",
      description: "Image preview coming soon",
    });
  };

  const handleCopyImageUrl = async (imageId: string) => {
    try {
      const image = images.find((img: any) => img._id === imageId);
      if (image) {
        await navigator.clipboard.writeText(image.url);
        toast({
          title: "Copied",
          description: "Image URL copied to clipboard",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to copy URL",
        variant: "destructive",
      });
    }
  };

  const handleDownloadImage = async (imageId: string) => {
    try {
      const image = images.find((img: any) => img._id === imageId);
      if (image) {
        // TODO: Implement actual download
        toast({
          title: "Download",
          description: "Download starting...",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to download image",
        variant: "destructive",
      });
    }
  };

  const handleSelectImage = (imageId: string) => {
    setSelectedImages(prev => 
      prev.includes(imageId) 
        ? prev.filter((id: any) => id !== imageId)
        : [...prev, imageId]
    );
  };

  const handleSelectAll = () => {
    if (selectedImages.length === filteredImages.length) {
      setSelectedImages([]);
    } else {
      setSelectedImages(filteredImages.map((img: any) => img._id));
    }
  };

  const handleBulkActions = () => {
    // TODO: Implement bulk actions dialog
    toast({
      title: "Bulk Actions",
      description: "Bulk actions coming soon (delete, tag, move)",
    });
  };

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" asChild>
            <Link href={`/t/${teamSlug}/catalog`}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Catalog
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Images</h1>
            <p className="text-muted-foreground">
              Upload and manage your product images
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Dialog open={isUploadDialogOpen} onOpenChange={setIsUploadDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Upload Images
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Upload Images</DialogTitle>
                <DialogDescription>
                  Upload images to use in your product catalog
                </DialogDescription>
              </DialogHeader>
              <div
                className={cn(
                  "border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors",
                  isDragging ? "border-primary bg-primary/5" : "border-muted-foreground/25 hover:border-primary/50"
                )}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">
                  {isDragging ? "Drop images here" : "Upload images"}
                </h3>
                <p className="text-muted-foreground mb-4">
                  Drag and drop images here, or click to browse
                </p>
                <p className="text-xs text-muted-foreground">
                  Supports: JPG, PNG, GIF, SVG (Max 10MB)
                </p>
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => handleFileUpload(e.target.files)}
                />
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-lg bg-blue-100 flex items-center justify-center">
                <ImageIcon className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <div className="text-2xl font-bold">{images.length}</div>
                <p className="text-sm text-muted-foreground">Total Images</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-lg bg-green-100 flex items-center justify-center">
                <Upload className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <div className="text-2xl font-bold">
                  {images.reduce((total: any, img: any) => total + img.fileSize, 0) > 1024 * 1024 
                    ? `${(images.reduce((total: any, img: any) => total + img.fileSize, 0) / (1024 * 1024)).toFixed(1)}MB`
                    : `${Math.round(images.reduce((total: any, img: any) => total + img.fileSize, 0) / 1024)}KB`
                  }
                </div>
                <p className="text-sm text-muted-foreground">Total Storage</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-lg bg-purple-100 flex items-center justify-center">
                <Grid3X3 className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <div className="text-2xl font-bold">{images.filter((img: any) => img.usedInProducts.length > 0).length}</div>
                <p className="text-sm text-muted-foreground">In Use</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-lg bg-orange-100 flex items-center justify-center">
                <Eye className="h-6 w-6 text-orange-600" />
              </div>
              <div>
                <div className="text-2xl font-bold">{images.filter((img: any) => img.usedInProducts.length === 0).length}</div>
                <p className="text-sm text-muted-foreground">Unused</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Controls */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex flex-1 items-center gap-4">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search images..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              {selectedImages.length > 0 && (
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">
                    {selectedImages.length} selected
                  </span>
                  <Button variant="outline" size="sm" onClick={handleBulkActions}>
                    Bulk Actions
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setSelectedImages([])}
                  >
                    Clear
                  </Button>
                </div>
              )}
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant={selectedImages.length === filteredImages.length ? "default" : "outline"}
                size="sm"
                onClick={handleSelectAll}
              >
                {selectedImages.length === filteredImages.length ? "Deselect All" : "Select All"}
              </Button>
              <div className="flex gap-1 border rounded-md">
                <Button
                  variant={viewMode === "grid" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("grid")}
                >
                  <Grid3X3 className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("list")}
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Images Grid/List */}
      {filteredImages.length > 0 ? (
        <div className={cn(
          viewMode === "grid" 
            ? "grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" 
            : "space-y-4"
        )}>
          {filteredImages.map((image: any) => (
            <Card 
              key={image._id} 
              className={cn(
                "group relative overflow-hidden transition-all hover:shadow-lg",
                selectedImages.includes(image._id) && "ring-2 ring-primary"
              )}
            >
              {viewMode === "grid" ? (
                <>
                  <div className="aspect-square bg-muted relative">
                    <img
                      src={image.url}
                      alt={image.fileName}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                      <div className="flex gap-2">
                        <Button size="sm" variant="secondary" onClick={() => handlePreviewImage(image._id)}>
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="secondary" onClick={() => handleCopyImageUrl(image._id)}>
                          <Copy className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="secondary" onClick={() => handleDownloadImage(image._id)}>
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <div className="absolute top-2 left-2">
                      <input
                        type="checkbox"
                        checked={selectedImages.includes(image._id)}
                        onChange={() => handleSelectImage(image._id)}
                        className="h-4 w-4 rounded border-white bg-white/80"
                      />
                    </div>
                    {image.usedInProducts.length > 0 && (
                      <div className="absolute top-2 right-2">
                        <Badge variant="secondary" className="text-xs">
                          {image.usedInProducts.length} products
                        </Badge>
                      </div>
                    )}
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-medium truncate mb-1">{image.fileName}</h3>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>{formatFileSize(image.fileSize)}</span>
                      <span>{formatDate(image.uploadedAt)}</span>
                    </div>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {image.tags.slice(0, 2).map((tag: any) => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                      {image.tags.length > 2 && (
                        <Badge variant="outline" className="text-xs">
                          +{image.tags.length - 2}
                        </Badge>
                      )}
                    </div>
                  </CardContent>
                </>
              ) : (
                <CardContent className="p-4">
                  <div className="flex items-center gap-4">
                    <div className="h-16 w-16 rounded-lg bg-muted overflow-hidden flex-shrink-0">
                      <img
                        src={image.url}
                        alt={image.fileName}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-medium truncate">{image.fileName}</h3>
                        {image.usedInProducts.length > 0 && (
                          <Badge variant="secondary" className="text-xs">
                            {image.usedInProducts.length} products
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span>{formatFileSize(image.fileSize)}</span>
                        <span>{formatDate(image.uploadedAt)}</span>
                      </div>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {image.tags.map((tag: any) => (
                          <Badge key={tag} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={selectedImages.includes(image._id)}
                        onChange={() => handleSelectImage(image._id)}
                        className="h-4 w-4 rounded"
                      />
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handlePreviewImage(image._id)}>
                            <Eye className="mr-2 h-4 w-4" />
                            Preview
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleCopyImageUrl(image._id)}>
                            <Copy className="mr-2 h-4 w-4" />
                            Copy URL
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleDownloadImage(image._id)}>
                            <Download className="mr-2 h-4 w-4" />
                            Download
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem 
                            className="text-destructive"
                            onClick={() => handleDeleteImage(image._id)}
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </CardContent>
              )}
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="py-16">
            <div className="text-center">
              <ImageIcon className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No images found</h3>
              <p className="text-muted-foreground mb-6">
                {searchQuery ? "Try adjusting your search" : "Upload your first images to get started"}
              </p>
              {!searchQuery && (
                <Button onClick={() => setIsUploadDialogOpen(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Upload Images
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

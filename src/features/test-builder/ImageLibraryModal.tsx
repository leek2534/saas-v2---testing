"use client";



import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, Loader2, Image as ImageIcon, Download } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ImageLibraryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectImage: (url: string) => void;
}

interface UnsplashImage {
  id: string;
  urls: {
    regular: string;
    small: string;
    thumb: string;
  };
  alt_description: string;
  user: {
    name: string;
    username: string;
  };
  links: {
    download_location: string;
  };
}

export function ImageLibraryModal({ isOpen, onClose, onSelectImage }: ImageLibraryModalProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [images, setImages] = useState<UnsplashImage[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('popular');

  // Curated categories with pre-selected images
  const categories = [
    { id: 'popular', label: 'Popular', query: 'business' },
    { id: 'business', label: 'Business', query: 'business professional' },
    { id: 'technology', label: 'Technology', query: 'technology computer' },
    { id: 'people', label: 'People', query: 'people portrait' },
    { id: 'nature', label: 'Nature', query: 'nature landscape' },
    { id: 'abstract', label: 'Abstract', query: 'abstract pattern' },
  ];

  // Fallback curated images (in case API fails or for demo)
  const curatedImages = [
    {
      id: '1',
      urls: {
        regular: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=800',
        small: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=400',
        thumb: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=200',
      },
      alt_description: 'Business team meeting',
      user: { name: 'Unsplash', username: 'unsplash' },
      links: { download_location: '' }
    },
    {
      id: '2',
      urls: {
        regular: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800',
        small: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=400',
        thumb: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=200',
      },
      alt_description: 'Team collaboration',
      user: { name: 'Unsplash', username: 'unsplash' },
      links: { download_location: '' }
    },
    {
      id: '3',
      urls: {
        regular: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800',
        small: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400',
        thumb: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=200',
      },
      alt_description: 'Business analytics',
      user: { name: 'Unsplash', username: 'unsplash' },
      links: { download_location: '' }
    },
    {
      id: '4',
      urls: {
        regular: 'https://images.unsplash.com/photo-1551434678-e076c223a692?w=800',
        small: 'https://images.unsplash.com/photo-1551434678-e076c223a692?w=400',
        thumb: 'https://images.unsplash.com/photo-1551434678-e076c223a692?w=200',
      },
      alt_description: 'Office workspace',
      user: { name: 'Unsplash', username: 'unsplash' },
      links: { download_location: '' }
    },
    {
      id: '5',
      urls: {
        regular: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800',
        small: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=400',
        thumb: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=200',
      },
      alt_description: 'Technology and coding',
      user: { name: 'Unsplash', username: 'unsplash' },
      links: { download_location: '' }
    },
    {
      id: '6',
      urls: {
        regular: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=800',
        small: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=400',
        thumb: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=200',
      },
      alt_description: 'Professional woman',
      user: { name: 'Unsplash', username: 'unsplash' },
      links: { download_location: '' }
    },
  ];

  // Load images when modal opens or category changes
  useEffect(() => {
    if (isOpen) {
      loadImages();
    }
  }, [isOpen, selectedCategory]);

  const loadImages = async (query?: string) => {
    setIsLoading(true);
    try {
      // For now, use curated images
      // In production, you would call Unsplash API here
      // const response = await fetch(`/api/unsplash/search?query=${query || selectedCategory}`);
      // const data = await response.json();
      // setImages(data.results);
      
      // Using curated images as fallback
      await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API call
      setImages(curatedImages);
    } catch (error) {
      console.error('Error loading images:', error);
      setImages(curatedImages);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      loadImages(searchQuery);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl max-h-[80vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>Image Library</DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="stock" className="flex-1 flex flex-col overflow-hidden">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="stock">Stock Photos</TabsTrigger>
            <TabsTrigger value="uploads">My Uploads</TabsTrigger>
          </TabsList>

          <TabsContent value="stock" className="flex-1 flex flex-col overflow-hidden mt-4">
            {/* Search Bar */}
            <form onSubmit={handleSearch} className="flex gap-2 mb-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search for images..."
                  className="pl-10"
                />
              </div>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? <Loader2 className="animate-spin" size={18} /> : 'Search'}
              </Button>
            </form>

            {/* Categories */}
            <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
              {categories.map((category) => (
                <Button
                  key={category.id}
                  variant={selectedCategory === category.id ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedCategory(category.id)}
                  className="whitespace-nowrap"
                >
                  {category.label}
                </Button>
              ))}
            </div>

            {/* Image Grid */}
            <div className="flex-1 overflow-y-auto">
              {isLoading ? (
                <div className="flex items-center justify-center h-64">
                  <Loader2 className="animate-spin text-gray-400" size={32} />
                </div>
              ) : (
                <div className="grid grid-cols-3 gap-4">
                  {images.map((image) => (
                    <button
                      key={image.id}
                      onClick={() => onSelectImage(image.urls.regular)}
                      className="group relative aspect-video overflow-hidden rounded-lg border-2 border-transparent hover:border-blue-500 transition-all"
                    >
                      <img
                        src={image.urls.small}
                        alt={image.alt_description || 'Stock photo'}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-opacity flex items-center justify-center">
                        <Download className="text-white opacity-0 group-hover:opacity-100 transition-opacity" size={24} />
                      </div>
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <p className="text-white text-xs truncate">by {image.user.name}</p>
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {!isLoading && images.length === 0 && (
                <div className="flex flex-col items-center justify-center h-64 text-gray-400">
                  <ImageIcon size={48} className="mb-2" />
                  <p>No images found</p>
                  <p className="text-sm">Try a different search term</p>
                </div>
              )}
            </div>

            {/* Attribution */}
            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
              <p className="text-xs text-gray-500 text-center">
                Photos provided by{' '}
                <a
                  href="https://unsplash.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  Unsplash
                </a>
              </p>
            </div>
          </TabsContent>

          <TabsContent value="uploads" className="flex-1 flex flex-col overflow-hidden mt-4">
            <div className="flex-1 flex flex-col items-center justify-center text-gray-400">
              <ImageIcon size={48} className="mb-2" />
              <p className="mb-4">No uploaded images yet</p>
              <Button
                onClick={() => {
                  const input = document.createElement('input');
                  input.type = 'file';
                  input.accept = 'image/*';
                  input.multiple = true;
                  input.onchange = (e: any) => {
                    const files = Array.from(e.target?.files || []);
                    console.log('Files to upload:', files);
                    // TODO: Implement upload to media library
                  };
                  input.click();
                }}
              >
                Upload Images
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}

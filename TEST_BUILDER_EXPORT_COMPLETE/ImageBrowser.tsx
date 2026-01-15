"use client";



import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, Upload, Image as ImageIcon, Loader2, ExternalLink } from 'lucide-react';
import { cn } from '@/lib/utils';
import { LoadingScreen, ImageGridSkeleton } from './LoadingScreen';

interface ImageBrowserProps {
  onSelect: (imageUrl: string) => void;
  currentValue?: string;
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
    links: {
      html: string;
    };
  };
}

interface PexelsImage {
  id: number;
  src: {
    original: string;
    large: string;
    medium: string;
    small: string;
  };
  alt: string;
  photographer: string;
  photographer_url: string;
}

export function ImageBrowser({ onSelect, currentValue }: ImageBrowserProps) {
  const [activeTab, setActiveTab] = useState<string>('url');
  const [urlInput, setUrlInput] = useState(currentValue || '');
  const [searchQuery, setSearchQuery] = useState('');
  const [imageSource, setImageSource] = useState<'unsplash' | 'pexels'>('unsplash');
  const [unsplashImages, setUnsplashImages] = useState<UnsplashImage[]>([]);
  const [pexelsImages, setPexelsImages] = useState<PexelsImage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [uploadPreview, setUploadPreview] = useState<string | null>(null);

  // Popular search terms for quick access
  const popularSearches = [
    'abstract', 'nature', 'business', 'technology', 'minimal',
    'gradient', 'texture', 'pattern', 'city', 'ocean'
  ];

  const searchUnsplash = async (query: string) => {
    if (!query.trim()) return;
    
    setIsLoading(true);
    setError(null);

    try {
      // Using Unsplash API (you'll need to add NEXT_PUBLIC_UNSPLASH_ACCESS_KEY to .env)
      const response = await fetch(
        `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&per_page=12&orientation=landscape`,
        {
          headers: {
            Authorization: `Client-ID ${process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY || 'demo'}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch images');
      }

      const data = await response.json();
      setUnsplashImages(data.results || []);
    } catch (err) {
      console.error('Error fetching images:', err);
      setError('Failed to load images. Please try again.');
      // Fallback to demo images if API fails
      setUnsplashImages([]);
    } finally {
      setIsLoading(false);
    }
  };

  const searchPexels = async (query: string) => {
    if (!query.trim()) return;
    
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=12&orientation=landscape`,
        {
          headers: {
            Authorization: process.env.NEXT_PUBLIC_PEXELS_API_KEY || 'demo',
          },
        }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch images from Pexels');
      }

      const data = await response.json();
      setPexelsImages(data.photos || []);
    } catch (err) {
      console.error('Error fetching Pexels images:', err);
      setError('Failed to load images from Pexels. Please try again.');
      setPexelsImages([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please select a valid image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('Image size must be less than 5MB');
      return;
    }

    setUploadedFile(file);
    
    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      setUploadPreview(result);
      onSelect(result); // Use base64 for now, will integrate with media library later
    };
    reader.readAsDataURL(file);
  };

  useEffect(() => {
    // Load default images on mount
    if (imageSource === 'unsplash') {
      searchUnsplash('abstract background');
    } else {
      searchPexels('abstract background');
    }
  }, [imageSource]);

  const handleUrlSubmit = () => {
    if (urlInput.trim()) {
      onSelect(urlInput.trim());
    }
  };

  const handleImageSelect = (imageUrl: string) => {
    onSelect(imageUrl);
  };

  return (
    <div className="space-y-4">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="url">URL</TabsTrigger>
          <TabsTrigger value="unsplash">Free Images</TabsTrigger>
          <TabsTrigger value="upload">Upload</TabsTrigger>
        </TabsList>

        {/* URL Tab */}
        <TabsContent value="url" className="space-y-3 mt-4">
          <div>
            <Label className="text-xs text-gray-600 dark:text-gray-400 mb-2 block">
              Image URL
            </Label>
            <div className="flex gap-2">
              <Input
                type="text"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleUrlSubmit()}
                placeholder="https://example.com/image.jpg"
                className="text-sm flex-1"
              />
              <Button 
                onClick={handleUrlSubmit}
                size="sm"
                disabled={!urlInput.trim()}
              >
                Apply
              </Button>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Enter a direct link to an image (JPG, PNG, WebP, etc.)
            </p>
          </div>

          {currentValue && (
            <div className="border rounded-lg p-2 bg-gray-50 dark:bg-gray-800">
              <Label className="text-xs text-gray-600 dark:text-gray-400 mb-2 block">
                Current Image
              </Label>
              <img 
                src={currentValue} 
                alt="Current background" 
                className="w-full h-32 object-cover rounded"
                onError={(e) => {
                  e.currentTarget.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="100" height="100"%3E%3Crect fill="%23ddd" width="100" height="100"/%3E%3Ctext fill="%23999" x="50%25" y="50%25" text-anchor="middle" dy=".3em"%3ENo Image%3C/text%3E%3C/svg%3E';
                }}
              />
            </div>
          )}
        </TabsContent>

        {/* Free Images Tab */}
        <TabsContent value="unsplash" className="space-y-3 mt-4">
          {/* Source Toggle */}
          <div className="flex gap-2 p-1 bg-gray-100 dark:bg-gray-800 rounded-lg">
            <button
              onClick={() => setImageSource('unsplash')}
              className={cn(
                'flex-1 px-3 py-2 rounded-md text-sm font-medium transition-colors',
                imageSource === 'unsplash'
                  ? 'bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
              )}
            >
              Unsplash
            </button>
            <button
              onClick={() => setImageSource('pexels')}
              className={cn(
                'flex-1 px-3 py-2 rounded-md text-sm font-medium transition-colors',
                imageSource === 'pexels'
                  ? 'bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
              )}
            >
              Pexels
            </button>
          </div>

          <div>
            <Label className="text-xs text-gray-600 dark:text-gray-400 mb-2 block">
              Search Free Images
            </Label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      imageSource === 'unsplash' ? searchUnsplash(searchQuery) : searchPexels(searchQuery);
                    }
                  }}
                  placeholder="Search for images..."
                  className="text-sm pl-10"
                />
              </div>
              <Button 
                onClick={() => imageSource === 'unsplash' ? searchUnsplash(searchQuery) : searchPexels(searchQuery)}
                size="sm"
                disabled={isLoading || !searchQuery.trim()}
              >
                {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Search'}
              </Button>
            </div>
          </div>

          {/* Popular Searches */}
          <div>
            <Label className="text-xs text-gray-500 mb-2 block">Popular:</Label>
            <div className="flex flex-wrap gap-1">
              {popularSearches.map((term) => (
                <button
                  key={term}
                  onClick={() => {
                    setSearchQuery(term);
                    imageSource === 'unsplash' ? searchUnsplash(term) : searchPexels(term);
                  }}
                  className="px-2 py-1 text-xs bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 rounded transition-colors"
                >
                  {term}
                </button>
              ))}
            </div>
          </div>

          {/* Image Grid */}
          {error && (
            <div className="text-sm text-red-600 dark:text-red-400 p-3 bg-red-50 dark:bg-red-900/20 rounded">
              {error}
            </div>
          )}

          {isLoading ? (
            <ImageGridSkeleton count={8} />
          ) : (
            <div className="grid grid-cols-2 gap-2 max-h-[400px] overflow-y-auto">
              {imageSource === 'unsplash' ? (
                unsplashImages.map((image) => (
                  <button
                    key={image.id}
                    onClick={() => handleImageSelect(image.urls.regular)}
                    className={cn(
                      'relative group overflow-hidden rounded-lg border-2 transition-all',
                      currentValue === image.urls.regular
                        ? 'border-blue-500 ring-2 ring-blue-200'
                        : 'border-transparent hover:border-blue-300'
                    )}
                  >
                    <img
                      src={image.urls.small}
                      alt={image.alt_description || 'Unsplash image'}
                      className="w-full h-24 object-cover"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                      <ImageIcon className="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <p className="text-[10px] text-white truncate">
                        by {image.user.name}
                      </p>
                    </div>
                  </button>
                ))
              ) : (
                pexelsImages.map((image) => (
                  <button
                    key={image.id}
                    onClick={() => handleImageSelect(image.src.large)}
                    className={cn(
                      'relative group overflow-hidden rounded-lg border-2 transition-all',
                      currentValue === image.src.large
                        ? 'border-blue-500 ring-2 ring-blue-200'
                        : 'border-transparent hover:border-blue-300'
                    )}
                  >
                    <img
                      src={image.src.medium}
                      alt={image.alt || 'Pexels image'}
                      className="w-full h-24 object-cover"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                      <ImageIcon className="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <p className="text-[10px] text-white truncate">
                        by {image.photographer}
                      </p>
                    </div>
                  </button>
                ))
              )}
            </div>
          )}

          <p className="text-xs text-gray-500 text-center">
            Images from{' '}
            <a 
              href={imageSource === 'unsplash' ? 'https://unsplash.com' : 'https://pexels.com'} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline inline-flex items-center gap-1"
            >
              {imageSource === 'unsplash' ? 'Unsplash' : 'Pexels'} <ExternalLink className="w-3 h-3" />
            </a>
          </p>
        </TabsContent>

        {/* Upload Tab */}
        <TabsContent value="upload" className="space-y-3 mt-4">
          <div 
            className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg p-8 text-center hover:border-blue-400 transition-colors cursor-pointer"
            onClick={() => document.getElementById('file-upload-input')?.click()}
          >
            <Upload className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Upload Image
            </p>
            <p className="text-xs text-gray-500 mb-4">
              Drag and drop or click to browse (Max 5MB)
            </p>
            <input
              id="file-upload-input"
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              className="hidden"
            />
            <Button variant="outline" size="sm" type="button">
              <Upload className="w-4 h-4 mr-2" />
              Choose File
            </Button>
          </div>

          {error && (
            <div className="text-sm text-red-600 dark:text-red-400 p-3 bg-red-50 dark:bg-red-900/20 rounded">
              {error}
            </div>
          )}

          {uploadPreview && (
            <div className="border rounded-lg p-2 bg-gray-50 dark:bg-gray-800">
              <Label className="text-xs text-gray-600 dark:text-gray-400 mb-2 block">
                Uploaded Image Preview
              </Label>
              <img 
                src={uploadPreview} 
                alt="Uploaded preview" 
                className="w-full h-48 object-cover rounded"
              />
              <p className="text-xs text-gray-500 mt-2">
                {uploadedFile?.name} ({(uploadedFile?.size || 0 / 1024).toFixed(2)} KB)
              </p>
            </div>
          )}

          <p className="text-xs text-gray-500 text-center">
            Supported formats: JPG, PNG, WebP, GIF, SVG
          </p>
        </TabsContent>
      </Tabs>
    </div>
  );
}

import { useState } from 'react';
import {
  Search,
  Image as ImageIcon,
  Video,
  Download,
  Plus,
  Loader2,
  ExternalLink,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

type StockSource = 'unsplash' | 'pexels' | 'pixabay';
type MediaType = 'photos' | 'videos';

interface StockImage {
  id: string;
  url: string;
  thumbnail: string;
  photographer: string;
  source: StockSource;
  downloadUrl: string;
  width: number;
  height: number;
}

// Mock data - Replace with real API calls
const mockImages: StockImage[] = [
  {
    id: '1',
    url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe',
    thumbnail: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400',
    photographer: 'Abstract AI',
    source: 'unsplash',
    downloadUrl: 'https://unsplash.com/photos/abstract',
    width: 1920,
    height: 1080,
  },
  {
    id: '2',
    url: 'https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4',
    thumbnail: 'https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?w=400',
    photographer: 'Digital Art',
    source: 'unsplash',
    downloadUrl: 'https://unsplash.com/photos/digital',
    width: 1920,
    height: 1080,
  },
];

const categories = [
  'All',
  'Business',
  'Nature',
  'Technology',
  'People',
  'Abstract',
  'Food',
  'Travel',
  'Fashion',
  'Architecture',
];

const sources = [
  { id: 'unsplash', name: 'Unsplash', color: 'bg-black' },
  { id: 'pexels', name: 'Pexels', color: 'bg-teal-600' },
  { id: 'pixabay', name: 'Pixabay', color: 'bg-green-600' },
];

export function StockLibraryTab() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedSource, setSelectedSource] = useState<StockSource | 'all'>('all');
  const [mediaType, setMediaType] = useState<MediaType>('photos');
  const [isLoading, setIsLoading] = useState(false);
  const [images, setImages] = useState<StockImage[]>(mockImages);

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    
    setIsLoading(true);
    
    // TODO: Replace with real API calls
    // Example Unsplash API call:
    // const response = await fetch(
    //   `https://api.unsplash.com/search/photos?query=${searchQuery}&per_page=30`,
    //   {
    //     headers: {
    //       'Authorization': `Client-ID ${process.env?.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY || ''}`
    //     }
    //   }
    // );
    // const data = await response.json();
    
    setTimeout(() => {
      console.log('Searching for:', searchQuery, 'in', selectedSource);
      setIsLoading(false);
    }, 1000);
  };

  const handleInsertImage = (image: StockImage) => {
    console.log('Insert image:', image);
    alert(`Image inserted!\n\nFrom: ${image.source}\nBy: ${image.photographer}\n\nThis will add the image to your canvas.`);
  };

  const handleDownloadImage = (image: StockImage) => {
    window.open(image.downloadUrl, '_blank');
  };

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="border-b border-border/40 p-6">
        <div className="mb-4">
          <h1 className="text-3xl font-bold">Stock Library</h1>
          <p className="text-muted-foreground mt-1">
            Millions of free photos & videos from Unsplash, Pexels & Pixabay
          </p>
        </div>

        {/* Search Bar */}
        <div className="flex gap-3 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search millions of free images..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              className="pl-10"
            />
          </div>
          <Button onClick={handleSearch} disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Searching...
              </>
            ) : (
              <>
                <Search className="w-4 h-4 mr-2" />
                Search
              </>
            )}
          </Button>
        </div>

        {/* Media Type Toggle */}
        <div className="flex items-center gap-3 mb-4">
          <div className="flex border border-border/40 rounded-lg">
            <Button
              variant={mediaType === 'photos' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setMediaType('photos')}
              className="rounded-r-none"
            >
              <ImageIcon className="w-4 h-4 mr-2" />
              Photos
            </Button>
            <Button
              variant={mediaType === 'videos' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setMediaType('videos')}
              className="rounded-l-none border-l"
            >
              <Video className="w-4 h-4 mr-2" />
              Videos
            </Button>
          </div>

          {/* Source Filter */}
          <div className="flex gap-2">
            <Button
              variant={selectedSource === 'all' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedSource('all')}
            >
              All Sources
            </Button>
            {sources.map((source) => (
              <Button
                key={source.id}
                variant={selectedSource === source.id ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedSource(source.id as StockSource)}
              >
                {source.name}
              </Button>
            ))}
          </div>
        </div>

        {/* Categories */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedCategory(category)}
              className="whitespace-nowrap"
            >
              {category}
            </Button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6">
        {/* API Setup Notice */}
        <div className="mb-6 p-4 border-2 border-primary/50 rounded-xl bg-gradient-to-br from-primary/5 to-primary/10">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center flex-shrink-0">
              <ExternalLink className="w-5 h-5 text-primary" />
            </div>
            <div className="flex-1">
              <h3 className="font-bold mb-1">🔑 API Setup Required</h3>
              <p className="text-sm text-muted-foreground mb-3">
                To enable stock photos, add your free API keys to <code className="px-1.5 py-0.5 bg-muted rounded text-xs">.env</code>:
              </p>
              <div className="bg-muted/50 rounded-lg p-3 font-mono text-xs space-y-1">
                <div>VITE_UNSPLASH_ACCESS_KEY=your_key_here</div>
                <div>VITE_PEXELS_API_KEY=your_key_here</div>
                <div>VITE_PIXABAY_API_KEY=your_key_here</div>
              </div>
              <div className="mt-3 flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => window.open('https://unsplash.com/developers', '_blank')}
                >
                  Get Unsplash Key
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => window.open('https://www.pexels.com/api/', '_blank')}
                >
                  Get Pexels Key
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => window.open('https://pixabay.com/api/docs/', '_blank')}
                >
                  Get Pixabay Key
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Images Grid */}
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <Loader2 className="w-12 h-12 text-primary mx-auto mb-4 animate-spin" />
              <p className="text-muted-foreground">Searching millions of images...</p>
            </div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {images.map((image) => (
                <div
                  key={image.id}
                  className="group relative rounded-xl overflow-hidden border-2 border-border/50 hover:border-primary/50 transition-all bg-card"
                >
                  {/* Image */}
                  <div className="aspect-square bg-muted relative overflow-hidden">
                    <img
                      src={image.thumbnail}
                      alt={`Photo by ${image.photographer}`}
                      className="w-full h-full object-cover"
                    />
                    
                    {/* Source Badge */}
                    <div className="absolute top-2 left-2">
                      <span
                        className={cn(
                          "px-2 py-1 text-xs font-bold text-white rounded",
                          image.source === 'unsplash' && 'bg-black',
                          image.source === 'pexels' && 'bg-teal-600',
                          image.source === 'pixabay' && 'bg-green-600'
                        )}
                      >
                        {image.source}
                      </span>
                    </div>

                    {/* Hover Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2">
                      <Button
                        size="sm"
                        onClick={() => handleInsertImage(image)}
                        className="bg-white text-black hover:bg-white/90"
                      >
                        <Plus className="w-3 h-3 mr-1.5" />
                        Insert
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDownloadImage(image)}
                        className="text-white hover:bg-white/20"
                      >
                        <Download className="w-3 h-3 mr-1.5" />
                        Download
                      </Button>
                    </div>
                  </div>

                  {/* Info */}
                  <div className="p-2">
                    <p className="text-xs text-muted-foreground truncate">
                      by {image.photographer}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {image.width} × {image.height}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Load More */}
            {images.length > 0 && (
              <div className="mt-8 text-center">
                <Button variant="outline" onClick={() => alert('Load more images...')}>
                  Load More
                </Button>
              </div>
            )}
          </>
        )}

        {/* Empty State */}
        {!isLoading && images.length === 0 && (
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <ImageIcon className="w-16 h-16 text-muted-foreground/50 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Search for images</h3>
              <p className="text-muted-foreground mb-4">
                Try searching for "business", "nature", or "technology"
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Footer Info */}
      <div className="border-t border-border/40 p-4 bg-muted/20">
        <p className="text-xs text-muted-foreground text-center">
          All images are free to use with no attribution required. Photos from{' '}
          <a href="https://unsplash.com" target="_blank" rel="noopener noreferrer" className="underline hover:text-foreground">
            Unsplash
          </a>
          ,{' '}
          <a href="https://pexels.com" target="_blank" rel="noopener noreferrer" className="underline hover:text-foreground">
            Pexels
          </a>
          , and{' '}
          <a href="https://pixabay.com" target="_blank" rel="noopener noreferrer" className="underline hover:text-foreground">
            Pixabay
          </a>
          .
        </p>
      </div>
    </div>
  );
}

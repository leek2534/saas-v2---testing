import React from 'react';
import { cn } from '@/lib/utils';

interface NextVideoProps {
  src: string;
  provider?: 'youtube' | 'vimeo' | 'loom' | 'upload';
  aspectRatio?: '16:9' | '4:3' | '1:1' | '21:9';
  className?: string;
  autoplay?: boolean;
  loop?: boolean;
  muted?: boolean;
  controls?: boolean;
  poster?: string;
}

/**
 * Next.js-style Video Component
 * Simple, clean video player that extracts video content without borders
 */
export function NextVideo({
  src,
  provider = 'youtube',
  aspectRatio = '16:9',
  className,
  autoplay = false,
  loop = false,
  muted = false,
  controls = true,
  poster,
}: NextVideoProps) {
  // Aspect ratio classes
  const aspectRatioClass = {
    '16:9': 'aspect-video',
    '4:3': 'aspect-[4/3]',
    '1:1': 'aspect-square',
    '21:9': 'aspect-[21/9]',
  }[aspectRatio];

  // Get embed URL for YouTube/Vimeo/Loom
  const getEmbedUrl = () => {
    if (provider === 'youtube') {
      const videoId = src.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/)?.[1];
      if (!videoId) return '';
      const params = new URLSearchParams({
        autoplay: autoplay ? '1' : '0',
        mute: muted ? '1' : '0',
        loop: loop ? '1' : '0',
        controls: controls ? '1' : '0',
        rel: '0',
        modestbranding: '1',
        playsinline: '1',
      });
      return `https://www.youtube-nocookie.com/embed/${videoId}?${params.toString()}`;
    }
    
    if (provider === 'vimeo') {
      const videoId = src.match(/vimeo\.com\/(\d+)/)?.[1];
      if (!videoId) return '';
      const params = new URLSearchParams({
        autoplay: autoplay ? '1' : '0',
        muted: muted ? '1' : '0',
        loop: loop ? '1' : '0',
        controls: controls ? '1' : '0',
        responsive: '1',
        title: '0',
        byline: '0',
        portrait: '0',
      });
      return `https://player.vimeo.com/video/${videoId}?${params.toString()}`;
    }
    
    if (provider === 'loom') {
      const videoId = src.match(/loom\.com\/share\/([a-zA-Z0-9]+)/)?.[1];
      if (!videoId) return '';
      return `https://www.loom.com/embed/${videoId}?autoplay=${autoplay}`;
    }
    
    return src; // Direct URL for uploads
  };

  return (
    <div className={cn('relative w-full overflow-hidden', aspectRatioClass, className)}>
      {provider === 'upload' ? (
        <video
          src={src}
          className="absolute inset-0 h-full w-full object-cover"
          autoPlay={autoplay}
          loop={loop}
          muted={muted}
          controls={controls}
          poster={poster}
        />
      ) : (
        <div className="absolute inset-0 overflow-hidden">
          <iframe
            src={getEmbedUrl()}
            className="absolute inset-0 h-full w-full scale-110"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
            allowFullScreen
            style={{
              transform: 'scale(1.15)',
              transformOrigin: 'center center',
            }}
          />
        </div>
      )}
    </div>
  );
}




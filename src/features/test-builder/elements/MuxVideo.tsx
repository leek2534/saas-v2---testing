import React from 'react';
import MuxPlayer from '@mux/mux-player-react';
import '@mux/mux-player/themes';
import { cn } from '@/lib/utils';

interface MuxVideoProps {
  src: string;
  provider?: 'youtube' | 'vimeo' | 'loom' | 'upload' | 'mux';
  aspectRatio?: '16:9' | '4:3' | '1:1' | '21:9';
  className?: string;
  autoplay?: boolean;
  loop?: boolean;
  muted?: boolean;
  controls?: boolean;
  poster?: string;
  title?: string;
}

/**
 * Mux Video Component - Similar to next-video but works with Vite
 * Uses Mux Player for uploaded videos, iframes for YouTube/Vimeo
 */
export function MuxVideo({
  src,
  provider = 'youtube',
  aspectRatio = '16:9',
  className,
  autoplay = false,
  loop = false,
  muted = false,
  controls = true,
  poster,
  title,
}: MuxVideoProps) {
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

  // Use Mux Player for uploaded videos or Mux-hosted videos
  if (provider === 'upload' || provider === 'mux') {
    return (
      <div className={cn('relative w-full overflow-hidden', aspectRatioClass, className)}>
        <MuxPlayer
          streamType="on-demand"
          playbackId={provider === 'mux' ? src : undefined}
          src={provider === 'upload' ? src : undefined}
          autoPlay={autoplay}
          loop={loop}
          muted={muted}
          controls={controls}
          poster={poster}
          className="absolute inset-0 h-full w-full object-cover"
        />
      </div>
    );
  }

  // Use iframe for YouTube/Vimeo/Loom with scaling to eliminate borders
  return (
    <div className={cn('relative w-full overflow-hidden', aspectRatioClass, className)}>
      <div className="absolute inset-0 overflow-hidden">
        <iframe
          src={getEmbedUrl()}
          className="absolute inset-0 h-full w-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
          allowFullScreen
          title={title || 'Video player'}
          style={{
            transform: 'scale(1.15)', // Scale to crop edges and eliminate borders
            transformOrigin: 'center center',
            border: 'none',
          }}
        />
      </div>
    </div>
  );
}


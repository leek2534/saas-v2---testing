"use client";


import React, { useState, useRef, useEffect } from 'react';
import { Play } from 'lucide-react';
import { cn } from '@/lib/utils';

interface VideoPlayerProps {
  source: 'youtube' | 'vimeo' | 'loom' | 'upload' | 'custom';
  url: string;
  thumbnail?: string;
  autoplay?: boolean;
  loop?: boolean;
  muted?: boolean;
  controls?: boolean;
  startTime?: number;
  endTime?: number;
  paddingBottom?: string; // Padding-bottom percentage for aspect ratio
  title?: string;
  isEditMode?: boolean; // If true, show thumbnail with play button instead of video
  playButtonStyle?: 'default' | 'minimal' | 'circle' | 'rounded' | 'square' | 'pulse' | 'glow' | 'gradient';
  playButtonSize?: 'small' | 'medium' | 'large';
  playButtonBackgroundColor?: string;
  playButtonIconColor?: string;
  onPlay?: () => void;
  onPause?: () => void;
  onEnd?: () => void;
}

// Helper functions
function getYouTubeVideoId(url: string): string | null {
  if (!url) return null;
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
    /^([a-zA-Z0-9_-]{11})$/,
  ];
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match && match[1]) return match[1];
  }
  return null;
}

function getYouTubeThumbnail(videoId: string | null): string | null {
  if (!videoId) return null;
  return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
}

function getVimeoVideoId(url: string): string | null {
  if (!url) return null;
  const patterns = [
    /vimeo\.com\/(\d+)/,
    /player\.vimeo\.com\/video\/(\d+)/,
  ];
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match && match[1]) return match[1];
  }
  return null;
}

function getLoomVideoId(url: string): string | null {
  if (!url) return null;
  const patterns = [
    /loom\.com\/share\/([a-zA-Z0-9]+)/,
    /loom\.com\/embed\/([a-zA-Z0-9]+)/,
  ];
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match && match[1]) return match[1];
  }
  return null;
}

/**
 * VideoPlayer - Clean implementation using padding-bottom technique
 * Matches ClickFunnels-style structure for reliable borderless video embeds
 */
export function VideoPlayer({
  source,
  url,
  thumbnail,
  autoplay = false,
  loop = false,
  muted = false,
  controls = true,
  startTime,
  endTime,
  paddingBottom = '56.25%', // Default 16:9
  title,
  isEditMode = false,
  playButtonStyle = 'default',
  playButtonSize = 'medium',
  playButtonBackgroundColor = '#ffffff',
  playButtonIconColor = '#000000',
  onPlay,
  onPause,
  onEnd,
}: VideoPlayerProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [showThumbnail, setShowThumbnail] = useState(isEditMode); // Show thumbnail in edit mode
  const [isPlaying, setIsPlaying] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Always show thumbnail in edit mode
  useEffect(() => {
    if (isEditMode) {
      setShowThumbnail(true);
      setIsPlaying(false);
    }
  }, [isEditMode]);

  // Auto-generate thumbnail for YouTube
  const youtubeVideoId = source === 'youtube' ? getYouTubeVideoId(url) : null;
  const autoThumbnail = !thumbnail && youtubeVideoId ? getYouTubeThumbnail(youtubeVideoId) : thumbnail;

  // Build embed URLs
  const getEmbedUrl = (): string => {
    if (!url) return '';

    switch (source) {
      case 'youtube': {
        const videoId = youtubeVideoId || getYouTubeVideoId(url);
        if (!videoId) return '';
        const params = new URLSearchParams({
          autoplay: autoplay ? '1' : '0',
          mute: muted ? '1' : '0',
          loop: loop ? '1' : '0',
          controls: controls ? '1' : '0',
          rel: '0', // Don't show related videos
          modestbranding: '1', // Hide YouTube logo
          playsinline: '1',
          iv_load_policy: '3', // Hide annotations
          cc_load_policy: '0', // Hide captions
          fs: '1', // Allow fullscreen
          enablejsapi: '1',
          origin: typeof window !== 'undefined' ? window.location.origin : '',
          showinfo: '0', // Hide video info (deprecated but still works)
          disablekb: '0',
          wmode: 'opaque',
          // CRITICAL: Minimize UI elements - controls will overlay on video, not take up space
        });
        return `https://www.youtube-nocookie.com/embed/${videoId}?${params.toString()}`;
      }

      case 'vimeo': {
        const videoId = getVimeoVideoId(url);
        if (!videoId) return '';
        const params = new URLSearchParams({
          autoplay: autoplay ? '1' : '0',
          muted: muted ? '1' : '0',
          loop: loop ? '1' : '0',
          controls: controls ? '1' : '0',
          background: '0',
          transparent: '1',
          playsinline: '1',
          responsive: '1',
          title: '0',
          byline: '0',
          portrait: '0',
          ...(startTime && { '#t': startTime.toString() }),
        });
        return `https://player.vimeo.com/video/${videoId}?${params.toString()}`;
      }

      case 'loom': {
        const videoId = getLoomVideoId(url);
        if (!videoId) return '';
        return `https://www.loom.com/embed/${videoId}?autoplay=${autoplay}`;
      }

      case 'upload':
      case 'custom':
        return url;

      default:
        return '';
    }
  };

  const embedUrl = getEmbedUrl();

  // Get play button styles based on preset
  const getPlayButtonStyles = () => {
    const sizeMap = {
      small: { container: 'w-12 h-12', icon: 'w-6 h-6' },
      medium: { container: 'w-16 h-16', icon: 'w-8 h-8' },
      large: { container: 'w-20 h-20', icon: 'w-10 h-10' },
    };
    
    const size = sizeMap[playButtonSize] || sizeMap.medium;
    
    const styleMap = {
      default: {
        container: `rounded-full shadow-lg ${size.container}`,
        icon: `${size.icon}`,
      },
      minimal: {
        container: `bg-transparent border-2 rounded-full ${size.container}`,
        icon: `${size.icon}`,
      },
      circle: {
        container: `rounded-full shadow-2xl ${size.container}`,
        icon: `${size.icon}`,
      },
      rounded: {
        container: `rounded-2xl shadow-xl ${size.container}`,
        icon: `${size.icon}`,
      },
      square: {
        container: `rounded-lg shadow-lg ${size.container}`,
        icon: `${size.icon}`,
      },
      pulse: {
        container: `rounded-full shadow-lg ${size.container} animate-pulse`,
        icon: `${size.icon}`,
      },
      glow: {
        container: `rounded-full shadow-lg ${size.container}`,
        icon: `${size.icon}`,
        style: { boxShadow: '0 0 20px rgba(255, 255, 255, 0.5)' },
      },
      gradient: {
        container: `rounded-full shadow-xl ${size.container}`,
        icon: `${size.icon}`,
      },
    };
    
    return styleMap[playButtonStyle] || styleMap.default;
  };

  const renderPlaceholder = (options: { title: string; subtitle?: string; showThumbnail?: boolean }) => {
    const buttonStyles = getPlayButtonStyles();
    const baseStyle: React.CSSProperties = {
      position: 'relative',
      width: '100%',
      paddingBottom,
      height: 0,
      overflow: 'hidden',
      border: '0px none',
      boxShadow: 'none',
      margin: '0px',
      paddingLeft: '0px',
      paddingRight: '0px',
      paddingTop: '0px',
      outline: 'none',
      borderRadius: '0px',
      backgroundColor: '#000000',
    };

    return (
      <div className="iframe-container group" style={baseStyle}>
        {options.showThumbnail && autoThumbnail ? (
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url('${autoThumbnail}')` }}
          />
        ) : (
          <div className="absolute inset-0 bg-black" />
        )}
        <div className="absolute inset-0 bg-black/70" />
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-center px-6">
          <div
            className={cn('flex items-center justify-center transition-transform duration-200 group-hover:scale-105', buttonStyles.container)}
            style={{
              backgroundColor: playButtonStyle === 'minimal' ? 'transparent' : 
                              playButtonStyle === 'gradient' ? undefined : 
                              playButtonBackgroundColor,
              background: playButtonStyle === 'gradient'
                ? `linear-gradient(135deg, ${playButtonBackgroundColor}, ${playButtonIconColor})`
                : undefined,
              borderColor: playButtonStyle === 'minimal' ? playButtonIconColor : playButtonBackgroundColor,
              borderWidth: playButtonStyle === 'minimal' ? '2px' : '0px',
              color: playButtonIconColor,
              ...(buttonStyles.style || {}),
            }}
          >
            <Play
              className={cn('ml-1', buttonStyles.icon)}
              style={{ color: playButtonIconColor }}
              fill={playButtonStyle === 'minimal' ? 'none' : playButtonIconColor}
            />
          </div>
          <div className="space-y-1">
            <p className="text-white text-sm font-semibold">{options.title}</p>
            {options.subtitle && (
              <p className="text-white/70 text-xs">{options.subtitle}</p>
            )}
          </div>
        </div>
      </div>
    );
  };

  // Show placeholder if no URL - use same aspect ratio as video would have
  if (!url) {
    return renderPlaceholder({
      title: 'Video Placeholder',
      subtitle: 'Add a video source in the settings panel',
      showThumbnail: false,
    });
  }

  // Render thumbnail if in edit mode OR if provided and not autoplaying
  if (isEditMode || (showThumbnail && autoThumbnail && !autoplay)) {
    return renderPlaceholder({
      title: url ? 'Video Preview' : 'Video Placeholder',
      subtitle: url ? 'Video playback is disabled while editing' : 'Add a video source to preview your media',
      showThumbnail: Boolean(autoThumbnail),
    });
  }

  // Render iframe for YouTube, Vimeo, Loom using padding-bottom technique
  if (source === 'youtube' || source === 'vimeo' || source === 'loom') {
    if (!embedUrl) {
      return renderPlaceholder({
        title: 'Invalid video URL',
        subtitle: 'Please double-check the link you provided',
        showThumbnail: false,
      });
    }

    // Clean iframe implementation using padding-bottom technique + overscaling to crop borders
    return (
      <div
        className="iframe-container"
        style={{
          position: 'relative',
          width: '100%',
          paddingBottom: paddingBottom, // CRITICAL: Creates aspect ratio space
          height: 0,
          overflow: 'hidden', // CRITICAL: Crops overscaled iframe edges
          border: '0px none',
          boxShadow: 'none',
          margin: '0px',
          // CRITICAL: Don't use padding: '0px' - it overrides paddingBottom
          // Set individual padding properties instead
          paddingLeft: '0px',
          paddingRight: '0px',
          paddingTop: '0px',
          // paddingBottom is set above dynamically
          outline: 'none',
          borderRadius: '0px',
        }}
      >
        <iframe
          ref={iframeRef}
          src={embedUrl}
          title={title || 'player'}
          allow="autoplay"
          allowFullScreen
          frameBorder="0"
          scrolling="no"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            border: '0px none',
            borderWidth: '0',
            borderStyle: 'none',
            borderColor: 'transparent',
            boxShadow: 'none',
            margin: '0px',
            padding: '0px',
            outline: 'none',
            borderRadius: '0px',
            backgroundColor: 'transparent',
            background: 'transparent',
            display: 'block',
          }}
          loading="lazy"
          onLoad={() => setIsLoaded(true)}
        />
      </div>
    );
  }

  // Render HTML5 video for uploads
  if (source === 'upload' || source === 'custom') {
    return (
      <div
        className="iframe-container"
        style={{
          position: 'relative',
          width: '100%',
          paddingBottom: paddingBottom, // CRITICAL: Creates aspect ratio space
          height: 0,
          overflow: 'hidden',
          border: '0px none',
          boxShadow: 'none',
          margin: '0px',
          // CRITICAL: Don't use padding: '0px' - it overrides paddingBottom
          // Set individual padding properties instead
          paddingLeft: '0px',
          paddingRight: '0px',
          paddingTop: '0px',
          // paddingBottom is set above dynamically
          outline: 'none',
          borderRadius: '0px',
        }}
      >
        <video
          ref={videoRef}
          src={url}
          autoPlay={autoplay}
          loop={loop}
          muted={muted}
          controls={controls}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            objectPosition: 'center center',
            border: '0px none',
            boxShadow: 'none',
            margin: '0px',
            padding: '0px',
            outline: 'none',
            borderRadius: '0px',
            backgroundColor: 'transparent',
            background: 'transparent',
          }}
          onPlay={() => onPlay?.()}
          onPause={() => onPause?.()}
          onEnded={() => onEnd?.()}
        >
          Your browser does not support the video tag.
        </video>
      </div>
    );
  }

  return null;
}

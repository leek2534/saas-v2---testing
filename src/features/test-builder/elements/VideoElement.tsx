
import React from 'react';
import { VideoPlayer } from './VideoPlayer';
import { cn } from '@/lib/utils';
import './videoStyles.css';

interface VideoElementProps {
  // Source
  source?: 'youtube' | 'vimeo' | 'loom' | 'upload' | 'custom';
  url?: string;
  thumbnail?: string;
  
  // Playback
  autoplay?: boolean;
  loop?: boolean;
  muted?: boolean;
  controls?: boolean;
  startTime?: number;
  endTime?: number;
  
  // Design
  videoWidth?: string; // e.g., '100%', '80%', 'custom'
  videoWidthPercent?: number;
  customVideoWidth?: number; // Custom width in pixels
  alignment?: 'left' | 'center' | 'right';
  borderRadius?: number | string;
  boxShadow?: boolean;
  padding?: number;
  margin?: number;
  backgroundColor?: string;
  overlay?: boolean;
  overlayColor?: string;
  overlayOpacity?: number;
  aspectRatio?: string;
  customAspectWidth?: number;
  customAspectHeight?: number;
  videoMask?: 'none' | 'circle' | 'rounded' | 'custom';
  customMaskRadius?: number;
  frameStyle?: 'none' | 'card' | 'glass' | 'device';
  framePadding?: number;
  frameBackgroundColor?: string;
  frameBorderEnabled?: boolean;
  frameBorderWidth?: number;
  frameBorderColor?: string;
  shadowPreset?: 'none' | 'soft' | 'deep' | 'glow';
  ambientGlow?: boolean;
  ambientGlowColor?: string;
  
  // Content
  title?: string;
  description?: string;
  
  // Advanced
  className?: string;
  
  // Edit mode
  isEditMode?: boolean; // If true, show thumbnail with play button instead of video
  
  // Play button customization
  playButtonStyle?: 'default' | 'minimal' | 'circle' | 'rounded' | 'square' | 'pulse' | 'glow' | 'gradient';
  playButtonSize?: 'small' | 'medium' | 'large';
  playButtonBackgroundColor?: string;
  playButtonIconColor?: string;
  
  // Callbacks
  onPlay?: () => void;
  onPause?: () => void;
  onEnd?: () => void;
}

/**
 * VideoElement - Clean implementation using padding-bottom technique
 * Matches ClickFunnels-style structure for reliable borderless video embeds
 */
export function VideoElement({
  source = 'youtube',
  url = '',
  thumbnail,
  autoplay = false,
  loop = false,
  muted = false,
  controls = true,
  startTime,
  endTime,
  videoWidth = '100%',
  videoWidthPercent,
  customVideoWidth,
  alignment = 'center',
  borderRadius = 0,
  boxShadow = false,
  padding = 0,
  margin = 0,
  backgroundColor,
  overlay = false,
  overlayColor = '#000000',
  overlayOpacity = 40,
  aspectRatio = '16:9',
  customAspectWidth,
  customAspectHeight,
  videoMask = 'none',
  customMaskRadius = 24,
  frameStyle = 'none',
  framePadding = 16,
  frameBackgroundColor,
  frameBorderEnabled = false,
  frameBorderWidth = 1,
  frameBorderColor = 'rgba(255,255,255,0.15)',
  shadowPreset = 'none',
  ambientGlow = false,
  ambientGlowColor = 'rgba(59,130,246,0.45)',
  title,
  description,
  className,
  isEditMode = false,
  playButtonStyle = 'default',
  playButtonSize = 'medium',
  playButtonBackgroundColor = '#ffffff',
  playButtonIconColor = '#000000',
  onPlay,
  onPause,
  onEnd,
}: VideoElementProps) {
  const getPaddingBottom = () => {
    if (aspectRatio === 'auto' && customAspectWidth && customAspectHeight) {
      return `${(customAspectHeight / customAspectWidth) * 100}%`;
    }

    if (aspectRatio && aspectRatio.includes(':')) {
      const [w, h] = aspectRatio.split(':').map(Number);
      if (w && h) {
        return `${(h / w) * 100}%`;
      }
    }

    return '56.25%';
  };

  const paddingBottom = getPaddingBottom();

  // Calculate video width - support both percentage and pixel values
  const getVideoWidth = () => {
    // If videoWidthPercent is set, use that
    if (videoWidthPercent !== undefined) {
      return `${videoWidthPercent}%`;
    }
    // Fallback to videoWidth prop
    if (videoWidth === 'custom' && customVideoWidth) {
      return `${customVideoWidth}px`;
    }
    return videoWidth || '100%';
  };

  const videoWidthValue = getVideoWidth();

  // Check if video is full width
  const isFullWidth = videoWidthValue === '100%' || (videoWidthPercent !== undefined && videoWidthPercent === 100);

  const shadowMap: Record<'none' | 'soft' | 'deep' | 'glow', string> = {
    none: 'none',
    soft: '0 20px 45px rgba(0,0,0,0.35)',
    deep: '0 35px 80px rgba(0,0,0,0.55)',
    glow: `0 0 55px ${ambientGlowColor}`,
  };

  const baseShadow = shadowPreset !== 'none'
    ? shadowMap[shadowPreset]
    : boxShadow
      ? '0 20px 45px rgba(0,0,0,0.35)'
      : 'none';

  const glowShadow = ambientGlow ? `0 0 60px ${ambientGlowColor}` : '';
  const combinedFrameShadow = frameStyle !== 'none'
    ? [baseShadow, glowShadow].filter(Boolean).join(', ') || 'none'
    : undefined;
  const combinedFigureShadow = frameStyle === 'none'
    ? [baseShadow, glowShadow].filter(Boolean).join(', ') || 'none'
    : glowShadow || 'none';

  const containerStyle: React.CSSProperties = {
    width: '100%',
    margin: margin ? `${margin}px` : 0,
    padding: frameStyle !== 'none'
      ? `${framePadding}px`
      : padding
        ? `${padding}px`
        : 0,
    background: frameStyle === 'card'
      ? (frameBackgroundColor || '#050505')
      : frameStyle === 'glass'
        ? 'rgba(8,8,10,0.35)'
        : frameStyle === 'device'
          ? (frameBackgroundColor || 'linear-gradient(135deg, #0f0f0f, #1c1c1c)')
          : undefined,
    backdropFilter: frameStyle === 'glass' ? 'blur(14px)' : undefined,
    borderRadius: frameStyle !== 'none'
      ? (typeof borderRadius === 'number' ? `${Math.max(borderRadius, 16)}px` : borderRadius || '20px')
      : undefined,
    border: frameStyle !== 'none' && frameBorderEnabled
      ? `${frameBorderWidth}px solid ${frameBorderColor}`
      : undefined,
    boxShadow: combinedFrameShadow,
    // Use flexbox for alignment when video is not full width
    display: !isFullWidth ? 'flex' : 'block',
    justifyContent: !isFullWidth 
      ? (alignment === 'left' ? 'flex-start' : alignment === 'right' ? 'flex-end' : 'center')
      : undefined,
    alignItems: !isFullWidth ? 'flex-start' : undefined,
  };

  const maskStyles: React.CSSProperties = (() => {
    switch (videoMask) {
      case 'circle':
        return { clipPath: 'circle(50% at 50% 50%)', overflow: 'hidden' };
      case 'rounded':
        return { borderRadius: '32px', overflow: 'hidden' };
      case 'custom':
        return { borderRadius: `${customMaskRadius}px`, overflow: 'hidden' };
      default:
        return {};
    }
  })();

  // Figure style - video dimensions
  const figureStyle: React.CSSProperties = {
    margin: 0,
    padding: 0,
    width: videoWidthValue,
    maxWidth: videoWidthValue,
    border: '0px none',
    boxShadow: combinedFigureShadow,
    borderRadius: typeof borderRadius === 'number' ? `${borderRadius}px` : borderRadius || '0px',
    backgroundColor: backgroundColor || 'transparent',
    overflow: 'hidden',
    // When full width, use margin auto for centering (fallback)
    ...(isFullWidth && alignment === 'center' ? { margin: '0 auto' } : {}),
    ...(isFullWidth && alignment === 'left' ? { marginRight: 'auto' } : {}),
    ...(isFullWidth && alignment === 'right' ? { marginLeft: 'auto' } : {}),
    ...maskStyles,
  };

  return (
    <div
      className={cn('c-video c-wrapper video-element', className)}
      style={containerStyle}
    >
      <figure
        className={cn(
          'video-container figure',
          source === 'youtube' && 'youtube',
          'noBorder',
          'radius0',
          'none'
        )}
        style={figureStyle}
      >
        <div className="w-100" style={{ width: '100%', position: 'relative' }}>
          <VideoPlayer
            source={source}
            url={url}
            thumbnail={thumbnail}
            autoplay={isEditMode ? false : autoplay} // Never autoplay in edit mode
            loop={loop}
            muted={muted}
            controls={controls}
            startTime={startTime}
            endTime={endTime}
            paddingBottom={paddingBottom}
            title={title}
            isEditMode={isEditMode}
            playButtonStyle={playButtonStyle}
            playButtonSize={playButtonSize}
            playButtonBackgroundColor={playButtonBackgroundColor}
            playButtonIconColor={playButtonIconColor}
            onPlay={onPlay}
            onPause={onPause}
            onEnd={onEnd}
          />
        </div>
        
        {/* Overlay */}
        {overlay && (
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              backgroundColor: overlayColor,
              opacity: overlayOpacity / 100,
            }}
          />
        )}
      </figure>
    </div>
  );
}

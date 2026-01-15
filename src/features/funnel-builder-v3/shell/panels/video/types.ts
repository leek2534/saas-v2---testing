/**
 * Video Settings Panel - Type Definitions
 * Comprehensive type system for video element configuration with device overrides
 */

export type VideoProvider = 'youtube' | 'vimeo' | 'wistia' | 'mp4' | 'upload' | 'embed';
export type Device = 'desktop' | 'tablet' | 'mobile';
export type AspectRatio = 'auto' | '16/9' | '9/16' | '1/1' | '4/3' | 'custom';
export type FitMode = 'contain' | 'cover' | 'fill';
export type Alignment = 'left' | 'center' | 'right';
export type ClickBehavior = 'toggle-play' | 'lightbox' | 'url' | 'none';
export type ActionType = 'none' | 'show-element' | 'scroll-to-section' | 'open-popup' | 'go-to-url' | 'next-step';
export type PreloadMode = 'auto' | 'metadata' | 'none';
export type ShadowSize = 'none' | 'sm' | 'md' | 'lg' | 'custom';
export type BorderStyle = 'solid' | 'dashed' | 'dotted';
export type StickyPosition = 'bottom-right' | 'bottom-left';
export type StickySize = 'small' | 'medium' | 'custom';
export type TrackingDestination = 'internal' | 'pixel' | 'webhook';
export type LoadingStyle = 'spinner' | 'none';
export type UnlockTarget = 'enable-cta' | 'reveal-element' | 'unlock-next-step';
export type CTAPosition = 'bottom-left' | 'bottom-center' | 'bottom-right';

// Source Configuration
export interface VideoSource {
  provider: VideoProvider;
  url?: string;
  uploadId?: string;
  embedCode?: string;
  poster?: {
    mode: 'auto' | 'custom';
    customUrl?: string;
  };
  aspectRatio: AspectRatio;
  customAspectRatio?: { width: number; height: number };
  fallback: {
    type: 'none' | 'poster' | 'image' | 'message';
    imageUrl?: string;
    message?: string;
  };
  privacy?: {
    youtubeNoCookie?: boolean;
    vimeoDNT?: boolean;
  };
}

// Playback Configuration
export interface PlaybackSettings {
  autoplay: boolean;
  muted: boolean;
  loop: boolean;
  playsInline: boolean;
  startTime?: number; // seconds
  endTime?: number; // seconds
  playbackSpeed: number;
  preload?: PreloadMode; // MP4 only
  disableAutoplayOnMobile?: boolean;
  respectReducedMotion: boolean;
}

// Controls & UX Configuration
export interface ControlsSettings {
  showControls: boolean;
  showBigPlayOverlay: boolean;
  allowFullscreen: boolean;
  clickBehavior: ClickBehavior;
  clickUrl?: string;
  clickOpenNewTab?: boolean;
  pauseOtherVideos: boolean;
  pictureInPicture?: boolean;
  disableRightClick?: boolean; // MP4 only
  showProgressBar?: boolean;
  showUnmuteHint?: boolean;
}

// Layout & Style Configuration
export interface LayoutStyleSettings {
  width: {
    mode: 'auto' | 'full' | 'custom';
    value?: number;
    unit?: 'px' | '%' | 'vw';
  };
  maxWidth?: number;
  alignment: Alignment;
  spacing: {
    marginTop: number;
    marginRight: number;
    marginBottom: number;
    marginLeft: number;
    paddingTop: number;
    paddingRight: number;
    paddingBottom: number;
    paddingLeft: number;
  };
  fitMode: FitMode;
  cornerRadius: number;
  border?: {
    enabled: boolean;
    width: number;
    style: BorderStyle;
    color: string;
  };
  shadow: {
    size: ShadowSize;
    custom?: {
      x: number;
      y: number;
      blur: number;
      spread: number;
      color: string;
    };
  };
  backgroundColor?: string;
  useSiteStyles: boolean;
}

// Action Configuration
export interface ActionConfig {
  type: ActionType;
  elementId?: string;
  sectionId?: string;
  scrollOffset?: number;
  popupId?: string;
  url?: string;
  openNewTab?: boolean;
}

export interface OverlayCTA {
  enabled: boolean;
  text?: string;
  buttonLabel?: string;
  action?: ActionConfig;
  position: CTAPosition;
  showTimeStart?: number; // seconds
  showTimeEnd?: number; // seconds
  useButtonTheme: boolean;
}

export interface ActionsSettings {
  onEnd: ActionConfig;
  overlayCTA?: OverlayCTA;
  onClick?: ActionConfig;
}

// Tracking Configuration
export interface TrackingSettings {
  enabled: boolean;
  videoLabel?: string;
  milestones: {
    percent25: boolean;
    percent50: boolean;
    percent75: boolean;
    percent100: boolean;
  };
  trackingId?: string;
  eventNamePrefix?: string;
  destinations: TrackingDestination[];
  antiAbuse: {
    onlyWhenTabActive: boolean;
    requireActualPlayback: boolean;
  };
}

// Sticky Mini-Player Configuration
export interface StickyMiniPlayer {
  enabled: boolean;
  trigger: {
    mode: 'scroll-past' | 'after-seconds';
    seconds?: number;
  };
  position: StickyPosition;
  size: StickySize;
  customSize?: { width: number; height: number };
  dismissBehavior: 'session' | 'permanent';
}

// Watch Gating Configuration
export interface WatchGating {
  enabled: boolean;
  requiredPercent: number;
  unlockTarget: UnlockTarget;
  targetElementId?: string;
  onlyCountWhenTabActive: boolean;
  preventSeeking: boolean;
}

// Advanced Configuration
export interface AdvancedSettings {
  performance: {
    lazyLoad: boolean;
    loadOnlyInViewport: boolean;
    preconnectToDomains: boolean;
  };
  compliance: {
    consentGating: boolean;
    consentGranted?: boolean;
  };
  resilience: {
    loadingStyle: LoadingStyle;
    errorFallback: {
      showPoster: boolean;
      showMessage: boolean;
      message?: string;
      showRetry: boolean;
    };
  };
  stickyMiniPlayer?: StickyMiniPlayer;
  watchGating?: WatchGating;
}

// Accessibility Configuration
export interface AccessibilitySettings {
  accessibleLabel?: string;
  captions?: {
    vttUrl?: string;
    uploadId?: string;
  };
  disableAutoplayOnReducedMotion: boolean;
}

// Complete Video Settings
export interface VideoSettings {
  source: VideoSource;
  playback: PlaybackSettings;
  controls: ControlsSettings;
  layout: LayoutStyleSettings;
  actions: ActionsSettings;
  tracking: TrackingSettings;
  advanced: AdvancedSettings;
  accessibility: AccessibilitySettings;
}

// Device Overrides
export interface DeviceOverrides {
  desktop?: Partial<VideoSettings>;
  tablet?: Partial<VideoSettings>;
  mobile?: Partial<VideoSettings>;
}

// Complete Video Element Configuration
export interface VideoElementConfig {
  id: string;
  globalSettings: VideoSettings;
  deviceOverrides?: DeviceOverrides;
  preset?: string;
}

// Preset Definitions
export type VideoPreset = 'standard-embed' | 'hero-background' | 'testimonial-clip' | 'step-explainer';

export interface PresetConfig {
  name: string;
  description: string;
  settings: Partial<VideoSettings>;
}

// Status Types
export type VideoStatus = 'loaded' | 'loading' | 'blocked' | 'error';

// Validation Result
export interface ValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
}

// Form State
export interface VideoFormState {
  settings: VideoSettings;
  currentDevice: Device;
  overrideMode: boolean;
  isDirty: boolean;
  validationResult?: ValidationResult;
}

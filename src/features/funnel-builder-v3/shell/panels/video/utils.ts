/**
 * Video Settings Panel - Utility Functions
 * Time parsing, validation, device override merging, and helpers
 */

import type { VideoSettings, Device, DeviceOverrides, ValidationResult, VideoProvider } from './types';
import { getProviderCapabilities } from './capabilities';

/**
 * Parse time string (mm:ss or ss) to seconds
 */
export function parseTime(timeStr: string): number | null {
  if (!timeStr) return null;

  const trimmed = timeStr.trim();
  
  // Handle seconds only (e.g., "30")
  if (/^\d+$/.test(trimmed)) {
    return parseInt(trimmed, 10);
  }

  // Handle mm:ss format
  const match = trimmed.match(/^(\d+):(\d{1,2})$/);
  if (match) {
    const minutes = parseInt(match[1], 10);
    const seconds = parseInt(match[2], 10);
    if (seconds >= 60) return null; // Invalid seconds
    return minutes * 60 + seconds;
  }

  return null;
}

/**
 * Format seconds to mm:ss
 */
export function formatTime(seconds: number): string {
  if (!seconds || seconds < 0) return '0:00';
  
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

/**
 * Merge device overrides with global settings
 * Returns effective settings for a specific device
 */
export function getEffectiveVideoSettings(
  globalSettings: VideoSettings,
  overrides: DeviceOverrides | undefined,
  device: Device
): VideoSettings {
  if (!overrides || !overrides[device]) {
    return globalSettings;
  }

  const deviceOverride = overrides[device];
  
  // Deep merge override with global settings
  return deepMerge(globalSettings, deviceOverride) as VideoSettings;
}

/**
 * Deep merge two objects (for partial overrides)
 */
function deepMerge<T>(target: T, source: Partial<T>): T {
  const result = { ...target };

  Object.keys(source).forEach((key) => {
    const sourceValue = source[key as keyof T];
    const targetValue = result[key as keyof T];

    if (sourceValue && typeof sourceValue === 'object' && !Array.isArray(sourceValue)) {
      result[key as keyof T] = deepMerge(targetValue as any, sourceValue as any);
    } else if (sourceValue !== undefined) {
      result[key as keyof T] = sourceValue as any;
    }
  });

  return result;
}

/**
 * Check if any device has overrides
 */
export function hasDeviceOverrides(overrides: DeviceOverrides | undefined): boolean {
  if (!overrides) return false;
  return !!(overrides.desktop || overrides.tablet || overrides.mobile);
}

/**
 * Check if a specific device has overrides
 */
export function hasOverridesForDevice(
  overrides: DeviceOverrides | undefined,
  device: Device
): boolean {
  if (!overrides) return false;
  const deviceOverride = overrides[device];
  return !!deviceOverride && Object.keys(deviceOverride).length > 0;
}

/**
 * Validate video settings
 */
export function validateVideoSettings(
  settings: VideoSettings,
  provider: VideoProvider
): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];
  const capabilities = getProviderCapabilities(provider);

  // Validate source
  if (!settings.source.url && !settings.source.uploadId && !settings.source.embedCode) {
    errors.push('Video source is required');
  }

  // Validate time ranges
  if (settings.playback.startTime !== undefined && settings.playback.endTime !== undefined) {
    if (settings.playback.startTime >= settings.playback.endTime) {
      errors.push('Start time must be less than end time');
    }
  }

  // Autoplay + muted validation
  if (settings.playback.autoplay && !settings.playback.muted) {
    if (capabilities.supportsMutedAutoplay) {
      warnings.push('Autoplay requires muted to work in most browsers');
    } else {
      errors.push('This provider does not support unmuted autoplay');
    }
  }

  // Loop + onEnd action conflict
  if (settings.playback.loop && settings.actions.onEnd.type !== 'none') {
    warnings.push('On-end actions will not fire when loop is enabled');
  }

  // Controls + click behavior usability
  if (!settings.controls.showControls && settings.controls.clickBehavior === 'none') {
    warnings.push('Video has no controls and no click behavior - users cannot interact');
  }

  // Embed code limitations
  if (provider === 'embed') {
    warnings.push('Some settings may not apply to custom embed code');
  }

  // Mobile autoplay recommendation
  if (settings.playback.autoplay && !settings.playback.disableAutoplayOnMobile) {
    warnings.push('Consider disabling autoplay on mobile for better user experience');
  }

  // Accessibility
  if (!settings.controls.showControls && !settings.accessibility.accessibleLabel) {
    warnings.push('Accessible label is recommended when controls are hidden');
  }

  // Watch gating validation
  if (settings.advanced.watchGating?.enabled) {
    const percent = settings.advanced.watchGating.requiredPercent;
    if (percent < 0 || percent > 100) {
      errors.push('Watch gating percentage must be between 0 and 100');
    }
  }

  // Overlay CTA time range validation
  if (settings.actions.overlayCTA?.enabled) {
    const start = settings.actions.overlayCTA.showTimeStart;
    const end = settings.actions.overlayCTA.showTimeEnd;
    if (start !== undefined && end !== undefined && start >= end) {
      errors.push('Overlay CTA start time must be less than end time');
    }
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
}

/**
 * Compute section summary for accordion headers
 */
export function computePlaybackSummary(settings: VideoSettings): string {
  const parts: string[] = [];
  
  parts.push(settings.playback.autoplay ? 'Autoplay on' : 'Autoplay off');
  parts.push(settings.controls.showControls ? 'Controls on' : 'Controls off');
  if (settings.playback.loop) parts.push('Loop on');
  
  return parts.join(' • ');
}

export function computeLayoutSummary(settings: VideoSettings): string {
  const parts: string[] = [];
  
  if (settings.layout.width.mode === 'full') {
    parts.push('Full width');
  } else if (settings.layout.width.mode === 'custom') {
    parts.push(`${settings.layout.width.value}${settings.layout.width.unit}`);
  } else {
    parts.push('Auto width');
  }
  
  parts.push(settings.source.aspectRatio);
  parts.push(`${settings.layout.cornerRadius}px radius`);
  
  return parts.join(' • ');
}

export function computeActionsSummary(settings: VideoSettings): string {
  const parts: string[] = [];
  
  if (settings.actions.onEnd.type !== 'none') {
    parts.push(`On end: ${settings.actions.onEnd.type}`);
  }
  
  if (settings.actions.overlayCTA?.enabled) {
    parts.push('CTA overlay');
  }
  
  return parts.length > 0 ? parts.join(' • ') : 'No actions';
}

export function computeTrackingSummary(settings: VideoSettings): string {
  if (!settings.tracking.enabled) return 'Disabled';
  
  const milestones: string[] = [];
  if (settings.tracking.milestones.percent25) milestones.push('25%');
  if (settings.tracking.milestones.percent50) milestones.push('50%');
  if (settings.tracking.milestones.percent75) milestones.push('75%');
  if (settings.tracking.milestones.percent100) milestones.push('100%');
  
  return milestones.length > 0 ? `Tracking: ${milestones.join(', ')}` : 'Enabled';
}

/**
 * Generate default video settings
 */
export function getDefaultVideoSettings(): VideoSettings {
  return {
    source: {
      provider: 'youtube',
      aspectRatio: '16/9',
      poster: {
        mode: 'auto',
      },
      fallback: {
        type: 'poster',
      },
    },
    playback: {
      autoplay: false,
      muted: false,
      loop: false,
      playsInline: true,
      playbackSpeed: 1,
      respectReducedMotion: true,
    },
    controls: {
      showControls: true,
      showBigPlayOverlay: true,
      allowFullscreen: true,
      clickBehavior: 'toggle-play',
      pauseOtherVideos: true,
    },
    layout: {
      width: {
        mode: 'full',
      },
      alignment: 'center',
      spacing: {
        marginTop: 0,
        marginRight: 0,
        marginBottom: 0,
        marginLeft: 0,
        paddingTop: 0,
        paddingRight: 0,
        paddingBottom: 0,
        paddingLeft: 0,
      },
      fitMode: 'contain',
      cornerRadius: 12,
      shadow: {
        size: 'none',
      },
      useSiteStyles: false,
    },
    actions: {
      onEnd: {
        type: 'none',
      },
    },
    tracking: {
      enabled: true,
      milestones: {
        percent25: true,
        percent50: true,
        percent75: true,
        percent100: true,
      },
      destinations: ['internal'],
      antiAbuse: {
        onlyWhenTabActive: true,
        requireActualPlayback: true,
      },
    },
    advanced: {
      performance: {
        lazyLoad: true,
        loadOnlyInViewport: true,
        preconnectToDomains: false,
      },
      compliance: {
        consentGating: false,
      },
      resilience: {
        loadingStyle: 'spinner',
        errorFallback: {
          showPoster: true,
          showMessage: true,
          showRetry: true,
        },
      },
    },
    accessibility: {
      disableAutoplayOnReducedMotion: true,
    },
  };
}

/**
 * Generate tracking ID
 */
export function generateTrackingId(): string {
  return `video_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Copy to clipboard helper
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (err) {
    console.error('Failed to copy:', err);
    return false;
  }
}

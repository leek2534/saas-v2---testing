/**
 * Video Settings Panel - Provider Capabilities
 * Maps each video provider to supported features
 */

import type { VideoProvider } from './types';

export interface ProviderCapabilities {
  supportsAutoplay: boolean;
  supportsMutedAutoplay: boolean;
  supportsStartEndTime: boolean;
  supportsSpeed: boolean;
  supportsPiP: boolean;
  supportsCaptionsUpload: boolean;
  supportsPrivacyMode: boolean;
  supportsPreload: boolean;
  supportsPoster: boolean;
  supportsDisableDownload: boolean;
  supportsLoop: boolean;
  supportsControls: boolean;
  supportsPlaysInline: boolean;
  supportsClickBehavior: boolean;
  requiresConsent: boolean;
}

export const PROVIDER_CAPABILITIES: Record<VideoProvider, ProviderCapabilities> = {
  youtube: {
    supportsAutoplay: true,
    supportsMutedAutoplay: true,
    supportsStartEndTime: true,
    supportsSpeed: true,
    supportsPiP: false,
    supportsCaptionsUpload: false,
    supportsPrivacyMode: true, // nocookie mode
    supportsPreload: false,
    supportsPoster: true, // auto thumbnail
    supportsDisableDownload: false,
    supportsLoop: true,
    supportsControls: true,
    supportsPlaysInline: true,
    supportsClickBehavior: false,
    requiresConsent: true,
  },
  vimeo: {
    supportsAutoplay: true,
    supportsMutedAutoplay: true,
    supportsStartEndTime: true,
    supportsSpeed: true,
    supportsPiP: false,
    supportsCaptionsUpload: false,
    supportsPrivacyMode: true, // DNT
    supportsPreload: false,
    supportsPoster: true,
    supportsDisableDownload: false,
    supportsLoop: true,
    supportsControls: true,
    supportsPlaysInline: true,
    supportsClickBehavior: false,
    requiresConsent: true,
  },
  wistia: {
    supportsAutoplay: true,
    supportsMutedAutoplay: true,
    supportsStartEndTime: true,
    supportsSpeed: true,
    supportsPiP: false,
    supportsCaptionsUpload: false,
    supportsPrivacyMode: false,
    supportsPreload: false,
    supportsPoster: true,
    supportsDisableDownload: true,
    supportsLoop: true,
    supportsControls: true,
    supportsPlaysInline: true,
    supportsClickBehavior: false,
    requiresConsent: false,
  },
  mp4: {
    supportsAutoplay: true,
    supportsMutedAutoplay: true,
    supportsStartEndTime: true,
    supportsSpeed: true,
    supportsPiP: true,
    supportsCaptionsUpload: true,
    supportsPrivacyMode: false,
    supportsPreload: true,
    supportsPoster: true,
    supportsDisableDownload: true,
    supportsLoop: true,
    supportsControls: true,
    supportsPlaysInline: true,
    supportsClickBehavior: true,
    requiresConsent: false,
  },
  upload: {
    supportsAutoplay: true,
    supportsMutedAutoplay: true,
    supportsStartEndTime: true,
    supportsSpeed: true,
    supportsPiP: true,
    supportsCaptionsUpload: true,
    supportsPrivacyMode: false,
    supportsPreload: true,
    supportsPoster: true,
    supportsDisableDownload: true,
    supportsLoop: true,
    supportsControls: true,
    supportsPlaysInline: true,
    supportsClickBehavior: true,
    requiresConsent: false,
  },
  embed: {
    supportsAutoplay: false,
    supportsMutedAutoplay: false,
    supportsStartEndTime: false,
    supportsSpeed: false,
    supportsPiP: false,
    supportsCaptionsUpload: false,
    supportsPrivacyMode: false,
    supportsPreload: false,
    supportsPoster: false,
    supportsDisableDownload: false,
    supportsLoop: false,
    supportsControls: false,
    supportsPlaysInline: false,
    supportsClickBehavior: false,
    requiresConsent: false,
  },
};

/**
 * Get capabilities for a specific provider
 */
export function getProviderCapabilities(provider: VideoProvider): ProviderCapabilities {
  return PROVIDER_CAPABILITIES[provider];
}

/**
 * Check if a specific feature is supported by the provider
 */
export function isFeatureSupported(
  provider: VideoProvider,
  feature: keyof ProviderCapabilities
): boolean {
  return PROVIDER_CAPABILITIES[provider][feature];
}

/**
 * Get list of unsupported features for a provider
 */
export function getUnsupportedFeatures(provider: VideoProvider): string[] {
  const capabilities = PROVIDER_CAPABILITIES[provider];
  const unsupported: string[] = [];

  Object.entries(capabilities).forEach(([key, value]) => {
    if (!value) {
      unsupported.push(key);
    }
  });

  return unsupported;
}

/**
 * Detect provider from URL
 */
export function detectProviderFromUrl(url: string): VideoProvider | null {
  if (!url) return null;

  const lowerUrl = url.toLowerCase();

  if (lowerUrl.includes('youtube.com') || lowerUrl.includes('youtu.be')) {
    return 'youtube';
  }
  if (lowerUrl.includes('vimeo.com')) {
    return 'vimeo';
  }
  if (lowerUrl.includes('wistia.com') || lowerUrl.includes('wi.st')) {
    return 'wistia';
  }
  if (lowerUrl.match(/\.(mp4|webm|ogg)$/)) {
    return 'mp4';
  }

  return null;
}

/**
 * Get provider display name
 */
export function getProviderDisplayName(provider: VideoProvider): string {
  const names: Record<VideoProvider, string> = {
    youtube: 'YouTube',
    vimeo: 'Vimeo',
    wistia: 'Wistia',
    mp4: 'MP4',
    upload: 'Upload',
    embed: 'Embed Code',
  };
  return names[provider];
}

/**
 * Get provider badge color
 */
export function getProviderBadgeColor(provider: VideoProvider): string {
  const colors: Record<VideoProvider, string> = {
    youtube: 'bg-red-100 text-red-700',
    vimeo: 'bg-blue-100 text-blue-700',
    wistia: 'bg-teal-100 text-teal-700',
    mp4: 'bg-purple-100 text-purple-700',
    upload: 'bg-green-100 text-green-700',
    embed: 'bg-gray-100 text-gray-700',
  };
  return colors[provider];
}

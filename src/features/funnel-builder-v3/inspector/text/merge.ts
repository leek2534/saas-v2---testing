import type { TextSettings, Device } from "./types";

/**
 * Deep merge utility for text settings
 */
function deepMerge<T>(target: T, source: Partial<T>): T {
  const result = { ...target };
  
  for (const key in source) {
    const sourceValue = source[key];
    const targetValue = result[key];
    
    if (sourceValue === undefined) continue;
    
    if (typeof sourceValue === 'object' && sourceValue !== null && !Array.isArray(sourceValue)) {
      if (typeof targetValue === 'object' && targetValue !== null) {
        result[key] = deepMerge(targetValue, sourceValue as any);
      } else {
        result[key] = sourceValue as any;
      }
    } else {
      result[key] = sourceValue as any;
    }
  }
  
  return result;
}

/**
 * Get effective settings by merging global settings with device overrides
 */
export function getEffectiveTextSettings(
  settings: TextSettings,
  device: Device
): TextSettings {
  if (!settings.overrides?.[device]) {
    return settings;
  }
  
  const override = settings.overrides[device];
  return deepMerge(settings, override);
}

/**
 * Set a text setting value at a specific path
 * If device is provided, writes to device override; otherwise writes to global
 */
export function setTextSetting(
  settings: TextSettings,
  path: string,
  value: any,
  device?: Device
): TextSettings {
  const keys = path.split('.');
  const newSettings = JSON.parse(JSON.stringify(settings));
  
  if (device) {
    // Write to device override
    if (!newSettings.overrides) {
      newSettings.overrides = {};
    }
    if (!newSettings.overrides[device]) {
      newSettings.overrides[device] = {};
    }
    
    let target = newSettings.overrides[device];
    for (let i = 0; i < keys.length - 1; i++) {
      const key = keys[i];
      if (!target[key]) {
        target[key] = {};
      }
      target = target[key];
    }
    target[keys[keys.length - 1]] = value;
  } else {
    // Write to global
    let target: any = newSettings;
    for (let i = 0; i < keys.length - 1; i++) {
      const key = keys[i];
      if (!target[key]) {
        target[key] = {};
      }
      target = target[key];
    }
    target[keys[keys.length - 1]] = value;
  }
  
  return newSettings;
}

/**
 * Reset device override for a specific path or entire device
 */
export function resetDeviceOverride(
  settings: TextSettings,
  device: Device,
  pathPrefix?: string
): TextSettings {
  const newSettings = JSON.parse(JSON.stringify(settings));
  
  if (!newSettings.overrides?.[device]) {
    return newSettings;
  }
  
  if (!pathPrefix) {
    // Reset entire device override
    delete newSettings.overrides[device];
  } else {
    // Reset specific path
    const keys = pathPrefix.split('.');
    let target: any = newSettings.overrides[device];
    
    for (let i = 0; i < keys.length - 1; i++) {
      const key = keys[i];
      if (!target[key]) return newSettings;
      target = target[key];
    }
    
    delete target[keys[keys.length - 1]];
  }
  
  return newSettings;
}

/**
 * Check if a specific path has a device override
 */
export function hasDeviceOverride(
  settings: TextSettings,
  device: Device,
  path: string
): boolean {
  if (!settings.overrides?.[device]) return false;
  
  const keys = path.split('.');
  let target: any = settings.overrides[device];
  
  for (const key of keys) {
    if (!target || typeof target !== 'object') return false;
    if (!(key in target)) return false;
    target = target[key];
  }
  
  return target !== undefined;
}

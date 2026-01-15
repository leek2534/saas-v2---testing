"use client";



import React from 'react';
import { Monitor, Tablet, Smartphone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export type DeviceType = 'desktop' | 'tablet' | 'mobile';

interface DevicePreviewProps {
  selectedDevice: DeviceType;
  onDeviceChange: (device: DeviceType) => void;
  className?: string;
}

/**
 * Device Preview Selector Component
 * Based on OpenFunnels device preview pattern
 * 
 * Allows users to preview their funnel/test builder content
 * in different device sizes (Desktop, Tablet, Mobile)
 */
export function DevicePreview({
  selectedDevice,
  onDeviceChange,
  className,
}: DevicePreviewProps) {
  const devices: Array<{ type: DeviceType; icon: React.ReactNode; label: string }> = [
    {
      type: 'desktop',
      icon: <Monitor className="w-4 h-4" />,
      label: 'Desktop',
    },
    {
      type: 'tablet',
      icon: <Tablet className="w-4 h-4" />,
      label: 'Tablet',
    },
    {
      type: 'mobile',
      icon: <Smartphone className="w-4 h-4" />,
      label: 'Mobile',
    },
  ];

  return (
    <div className={cn('flex items-center gap-1 bg-gray-100 dark:bg-gray-800 rounded-lg p-1', className)}>
      {devices.map((device) => (
        <Button
          key={device.type}
          variant={selectedDevice === device.type ? 'default' : 'ghost'}
          size="sm"
          onClick={() => onDeviceChange(device.type)}
          className={cn(
            'flex items-center gap-2 transition-all',
            selectedDevice === device.type
              ? 'bg-white dark:bg-gray-700 shadow-sm'
              : 'hover:bg-gray-200 dark:hover:bg-gray-700'
          )}
        >
          {device.icon}
          <span className="hidden sm:inline text-xs font-medium">{device.label}</span>
        </Button>
      ))}
    </div>
  );
}

/**
 * Device-specific CSS constraints
 * Apply these styles to the canvas container based on selected device
 */
export const getDeviceStyles = (device: DeviceType): React.CSSProperties => {
  const deviceConstraints: Record<DeviceType, React.CSSProperties> = {
    desktop: {
      maxWidth: '100%',
      minWidth: '1024px',
    },
    tablet: {
      maxWidth: '768px',
      minWidth: '768px',
      margin: '0 auto',
    },
    mobile: {
      maxWidth: '375px',
      minWidth: '375px',
      margin: '0 auto',
    },
  };

  return deviceConstraints[device];
};

/**
 * Device-specific viewport dimensions
 */
export const getDeviceDimensions = (device: DeviceType): { width: number; height: number } => {
  const dimensions = {
    desktop: { width: 1920, height: 1080 },
    tablet: { width: 768, height: 1024 },
    mobile: { width: 375, height: 667 },
  };

  return dimensions[device];
};


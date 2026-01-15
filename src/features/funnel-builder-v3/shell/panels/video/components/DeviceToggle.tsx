"use client";

import React from "react";
import type { Device } from "../types";

interface DeviceToggleProps {
  currentDevice: Device;
  onChange: (device: Device) => void;
  hasOverrides?: {
    desktop?: boolean;
    tablet?: boolean;
    mobile?: boolean;
  };
}

export function DeviceToggle({ currentDevice, onChange, hasOverrides }: DeviceToggleProps) {
  const devices: { value: Device; label: string; icon: string }[] = [
    { value: 'desktop', label: 'Desktop', icon: '🖥️' },
    { value: 'tablet', label: 'Tablet', icon: '📱' },
    { value: 'mobile', label: 'Mobile', icon: '📱' },
  ];

  return (
    <div className="flex items-center gap-1 rounded-lg border border-slate-200 p-1">
      {devices.map((device) => (
        <button
          key={device.value}
          onClick={() => onChange(device.value)}
          className={`relative px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
            currentDevice === device.value
              ? 'bg-blue-500 text-white'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <span className="flex items-center gap-1.5">
            <span>{device.icon}</span>
            <span>{device.label}</span>
          </span>
          {hasOverrides?.[device.value] && (
            <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-orange-500 rounded-full border border-white" />
          )}
        </button>
      ))}
    </div>
  );
}

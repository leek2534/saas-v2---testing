"use client";

import { Download, Settings } from 'lucide-react';
import { useVideoXStore } from '../store';

export function ExportPanel() {
  const { exportSettings, setExportSettings } = useVideoXStore();

  return (
    <div className="w-80 bg-gray-900 border-l border-gray-800 p-4 overflow-y-auto">
      <div className="flex items-center gap-2 mb-6">
        <Settings className="w-5 h-5 text-white" />
        <h2 className="text-lg font-semibold text-white">Export Settings</h2>
      </div>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Format
          </label>
          <select
            value={exportSettings.format}
            onChange={(e) => setExportSettings({ format: e.target.value as any })}
            className="w-full bg-gray-800 text-white border border-gray-700 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="mp4">MP4</option>
            <option value="webm">WebM</option>
            <option value="mov">MOV</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Quality
          </label>
          <select
            value={exportSettings.quality}
            onChange={(e) => setExportSettings({ quality: e.target.value as any })}
            className="w-full bg-gray-800 text-white border border-gray-700 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="SD">SD (480p)</option>
            <option value="HD">HD (720p)</option>
            <option value="FHD">Full HD (1080p)</option>
            <option value="2K">2K (1440p)</option>
            <option value="4K">4K (2160p)</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Frame Rate
          </label>
          <select
            value={exportSettings.fps}
            onChange={(e) => setExportSettings({ fps: Number(e.target.value) as any })}
            className="w-full bg-gray-800 text-white border border-gray-700 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="24">24 FPS</option>
            <option value="30">30 FPS</option>
            <option value="60">60 FPS</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Codec
          </label>
          <select
            value={exportSettings.codec}
            onChange={(e) => setExportSettings({ codec: e.target.value as any })}
            className="w-full bg-gray-800 text-white border border-gray-700 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="h264">H.264</option>
            <option value="vp9">VP9</option>
            <option value="av1">AV1</option>
          </select>
        </div>

        <div className="pt-4 border-t border-gray-800">
          <button className="w-full px-4 py-3 bg-green-600 hover:bg-green-700 text-white rounded-md transition-colors flex items-center justify-center gap-2 font-semibold">
            <Download className="w-5 h-5" />
            <span>Export Video</span>
          </button>
          <p className="text-xs text-gray-500 mt-2 text-center">
            Estimated size: ~50 MB
          </p>
        </div>
      </div>
    </div>
  );
}

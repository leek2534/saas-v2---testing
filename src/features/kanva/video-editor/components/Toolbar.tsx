"use client";

import { Upload, Download, Scissors, Volume2, Type, Image } from 'lucide-react';
import { useVideoXStore } from '../store';

export function Toolbar() {
  const { project } = useVideoXStore();

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      console.log('File uploaded:', file.name);
    }
  };

  return (
    <div className="w-full bg-gray-900 border-b border-gray-800 p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h1 className="text-xl font-bold text-white">Video X</h1>
          {project && (
            <span className="text-gray-400 text-sm">- {project.name}</span>
          )}
        </div>

        <div className="flex items-center gap-2">
          <label className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md cursor-pointer transition-colors flex items-center gap-2">
            <Upload className="w-4 h-4" />
            <span>Import</span>
            <input
              type="file"
              accept="video/*,audio/*"
              onChange={handleFileUpload}
              className="hidden"
            />
          </label>

          <button className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-md transition-colors flex items-center gap-2">
            <Scissors className="w-4 h-4" />
            <span>Split</span>
          </button>

          <button className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-md transition-colors flex items-center gap-2">
            <Volume2 className="w-4 h-4" />
            <span>Audio</span>
          </button>

          <button className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-md transition-colors flex items-center gap-2">
            <Type className="w-4 h-4" />
            <span>Text</span>
          </button>

          <button className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-md transition-colors flex items-center gap-2">
            <Image className="w-4 h-4" />
            <span>Image</span>
          </button>

          <div className="w-px h-8 bg-gray-700 mx-2" />

          <button className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md transition-colors flex items-center gap-2">
            <Download className="w-4 h-4" />
            <span>Export</span>
          </button>
        </div>
      </div>
    </div>
  );
}

"use client";



import React, { useState } from 'react';
import { Play, Plus, Upload, Video, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface VideoItem {
  id: string;
  name: string;
  thumbnail: string;
  url: string;
  duration?: string;
  source?: 'youtube' | 'vimeo' | 'loom' | 'upload';
}

interface VideoGalleryProps {
  selectedVideoId?: string;
  onSelectVideo: (video: VideoItem) => void;
  onAddVideo: () => void;
  onUploadVideo: () => void;
}

// Mock video library - in production, this would come from a store/API
const MOCK_VIDEOS: VideoItem[] = [
  {
    id: '1',
    name: 'Streamer Setup',
    thumbnail: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=400',
    url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    duration: '2:34',
    source: 'youtube',
  },
  {
    id: '2',
    name: 'Waterfall Scene',
    thumbnail: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400',
    url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    duration: '1:45',
    source: 'youtube',
  },
  {
    id: '3',
    name: 'Waterfall Scene 2',
    thumbnail: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400',
    url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    duration: '1:45',
    source: 'youtube',
  },
  {
    id: '4',
    name: 'Streamer Setup 2',
    thumbnail: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=400',
    url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    duration: '2:34',
    source: 'youtube',
  },
  {
    id: '5',
    name: 'Waterfall Scene 3',
    thumbnail: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400',
    url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    duration: '1:45',
    source: 'youtube',
  },
  {
    id: '6',
    name: 'Waterfall Scene 4',
    thumbnail: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400',
    url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    duration: '1:45',
    source: 'youtube',
  },
];

export function VideoGallery({ selectedVideoId, onSelectVideo, onAddVideo, onUploadVideo }: VideoGalleryProps) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  return (
    <div className="w-full space-y-4">
      {/* Add Video Area - Large dashed box */}
      <div
        onClick={onAddVideo}
        className={cn(
          'w-full border-2 border-dashed rounded-lg p-12 text-center cursor-pointer transition-all',
          'border-gray-300 dark:border-gray-700 hover:border-blue-400 dark:hover:border-blue-500',
          'bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-800'
        )}
      >
        <Plus className="w-12 h-12 text-gray-400 dark:text-gray-500 mx-auto mb-2" />
        <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Add a video</p>
      </div>

      {/* Video Grid - 2 rows */}
      <div className="grid grid-cols-3 gap-3">
        {MOCK_VIDEOS.map((video) => {
          const isSelected = selectedVideoId === video.id;
          const isHovered = hoveredId === video.id;

          return (
            <div
              key={video.id}
              onClick={() => onSelectVideo(video)}
              onMouseEnter={() => setHoveredId(video.id)}
              onMouseLeave={() => setHoveredId(null)}
              className={cn(
                'relative aspect-video rounded-lg overflow-hidden cursor-pointer transition-all group',
                isSelected
                  ? 'ring-4 ring-orange-500 ring-offset-2'
                  : 'ring-2 ring-transparent hover:ring-gray-300 dark:hover:ring-gray-600'
              )}
            >
              {/* Thumbnail */}
              <div className="relative w-full h-full bg-gray-200 dark:bg-gray-700">
                <img
                  src={video.thumbnail}
                  alt={video.name}
                  className="w-full h-full object-cover"
                />

                {/* Play Button Overlay */}
                <div
                  className={cn(
                    'absolute inset-0 flex items-center justify-center transition-opacity',
                    isHovered || isSelected
                      ? 'bg-black/30 opacity-100'
                      : 'bg-black/0 opacity-0 group-hover:opacity-100 group-hover:bg-black/30'
                  )}
                >
                  <div className="w-10 h-10 rounded-full bg-white/90 flex items-center justify-center shadow-lg">
                    <Play className="w-5 h-5 text-gray-900 ml-0.5" fill="currentColor" />
                  </div>
                </div>

                {/* Selected Indicator - Orange badge */}
                {isSelected && (
                  <div className="absolute bottom-2 right-2">
                    <div className="bg-orange-500 text-white text-xs font-medium px-2 py-1 rounded">
                      Video
                    </div>
                  </div>
                )}

                {/* Duration Badge */}
                {video.duration && (
                  <div className="absolute top-2 right-2 bg-black/70 text-white text-xs px-1.5 py-0.5 rounded">
                    {video.duration}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Video Separator */}
      <div className="relative flex items-center justify-center py-2">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-green-500"></div>
        </div>
        <button
          onClick={onUploadVideo}
          className="relative bg-green-500 hover:bg-green-600 text-white rounded-full p-2 shadow-lg transition-colors"
        >
          <Plus className="w-5 h-5" />
        </button>
      </div>

      {/* Add Video Text */}
      <div className="text-left">
        <p className="text-lg font-bold text-gray-900 dark:text-white">Add a</p>
      </div>
    </div>
  );
}





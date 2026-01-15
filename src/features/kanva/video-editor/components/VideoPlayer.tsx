"use client";

import { useRef } from 'react';
import ReactPlayer from 'react-player';
import { useVideoXStore } from '../store';

export function VideoPlayer() {
  const playerRef = useRef<any>(null);
  const { timeline, setCurrentTime, setPlaying } = useVideoXStore();
  const { currentTime, playing } = timeline;

  const handleProgress = (state: any) => {
    if (playing && state.playedSeconds) {
      setCurrentTime(state.playedSeconds);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = Number(e.target.value);
    setCurrentTime(time);
    if (playerRef.current) {
      playerRef.current.seekTo(time, 'seconds');
    }
  };

  return (
    <div className="relative w-full aspect-video bg-black rounded-lg overflow-hidden">
      <ReactPlayer
        ref={playerRef}
        url="https://www.youtube.com/watch?v=dQw4w9WgXcQ"
        playing={playing}
        controls={false}
        width="100%"
        height="100%"
        onProgress={handleProgress}
        onEnded={() => setPlaying(false)}
      />
      
      <div className="absolute bottom-4 left-4 right-4 flex items-center gap-4 bg-black/50 backdrop-blur-sm p-3 rounded-lg">
        <button
          onClick={() => setPlaying(!playing)}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors"
        >
          {playing ? 'Pause' : 'Play'}
        </button>
        
        <div className="flex-1">
          <input
            type="range"
            min={0}
            max={100}
            value={currentTime}
            onChange={handleSeek}
            className="w-full"
          />
        </div>
        
        <span className="text-white text-sm font-mono">
          {Math.floor(currentTime / 60)}:{String(Math.floor(currentTime % 60)).padStart(2, '0')}
        </span>
      </div>
    </div>
  );
}

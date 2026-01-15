"use client";

import { KanvaEditor } from '@/src/features/kanva/components/KanvaEditor';
import { RoomProvider } from '@/liveblocks.config';
import { useParams } from 'next/navigation';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Maximize2, Minimize2 } from 'lucide-react';

export default function KanvaPage() {
  const params = useParams();
  const teamSlug = params.teamSlug as string;
  const roomId = `kanva-${teamSlug}`;
  const [isFullscreen, setIsFullscreen] = useState(false);

  if (isFullscreen) {
    return (
      <div className="fixed inset-0 z-50 bg-background">
        <Button
          variant="ghost"
          size="sm"
          className="absolute top-4 right-4 z-50"
          onClick={() => setIsFullscreen(false)}
        >
          <Minimize2 className="h-4 w-4 mr-2" />
          Exit Fullscreen
        </Button>
        <RoomProvider id={roomId} initialPresence={{}}>
          <KanvaEditor />
        </RoomProvider>
      </div>
    );
  }

  return (
    <div className="relative h-full w-full overflow-hidden">
      <Button
        variant="outline"
        size="sm"
        className="absolute bottom-4 right-4 z-10 shadow-lg"
        onClick={() => setIsFullscreen(true)}
      >
        <Maximize2 className="h-4 w-4 mr-2" />
        Fullscreen
      </Button>
      <RoomProvider id={roomId} initialPresence={{}}>
        <KanvaEditor />
      </RoomProvider>
    </div>
  );
}

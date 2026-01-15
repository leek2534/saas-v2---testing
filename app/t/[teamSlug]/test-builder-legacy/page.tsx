"use client";

import { TestBuilderV2Canvas } from "@/src/features/test-builder/TestBuilderV2Canvas";
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Maximize2, Minimize2 } from 'lucide-react';

export default function TestBuilderPage() {
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
        <TestBuilderV2Canvas />
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
      <TestBuilderV2Canvas />
    </div>
  );
}

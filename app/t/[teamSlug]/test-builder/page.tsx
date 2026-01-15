"use client";

import { EditorProvider } from '@/src/features/test-builder/editor/store/useEditorStore';
import { Canvas } from '@/src/features/test-builder/editor/Canvas';
import { createDemoState } from '@/src/features/test-builder/editor/utils/createDemoState';
import { EditorSidebarBridge } from '@/src/features/test-builder/editor/components/EditorSidebarBridge';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';

export default function TestBuilderV3Page() {
  const initialState = createDemoState();
  const { teamSlug } = useParams();

  return (
    <div className="fixed inset-0 z-50 bg-background">
      <Button
        variant="ghost"
        size="sm"
        className="absolute top-4 left-4 z-[200]"
        asChild
      >
        <Link href={`/t/${teamSlug}`}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Dashboard
        </Link>
      </Button>
      <EditorProvider initialState={initialState}>
        <div style={{ 
          display: 'flex', 
          height: '100vh',
          width: '100vw',
          overflow: 'hidden',
          background: '#ffffff'
        }}>
          <EditorSidebarBridge />
          <div style={{ flex: 1, overflow: 'hidden' }}>
            <Canvas />
          </div>
        </div>
      </EditorProvider>
    </div>
  );
}

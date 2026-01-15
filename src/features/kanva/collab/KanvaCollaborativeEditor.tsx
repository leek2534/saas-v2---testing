/**
 * Kanva Collaborative Editor Wrapper
 * Example integration showing how to wrap your Kanva editor with collaboration
 */

'use client';

import { RoomProvider, LiveblocksProvider } from '@liveblocks/react';
import { getRandomPresenceColor } from './presence';
import { useUser } from '@clerk/nextjs';
import { CollaborationSync } from './CollaborationSync';

interface KanvaCollaborativeEditorProps {
  canvasId: string;
  children: React.ReactNode;
}

/**
 * Wrap your Kanva editor with this component to enable collaboration
 * 
 * Usage:
 * <KanvaCollaborativeEditor canvasId="canvas-123">
 *   <YourKanvaEditor />
 * </KanvaCollaborativeEditor>
 */
export function KanvaCollaborativeEditor({
  canvasId,
  children,
}: KanvaCollaborativeEditorProps) {
  const { user } = useUser();

  if (!user) {
    return <div>Please sign in to collaborate</div>;
  }

  return (
    <LiveblocksProvider
      publicApiKey={process.env.NEXT_PUBLIC_LIVEBLOCKS_KEY!}
      throttle={16}
    >
      <RoomProvider
        id={`canvas-${canvasId}`}
        initialPresence={{
          cursor: null,
          selection: [],
          name: user.fullName || user.username || 'Anonymous',
          color: getRandomPresenceColor(),
          role: 'owner',
          userId: user.id,
        }}
      >
        <CollaborationSync />
        {children}
      </RoomProvider>
    </LiveblocksProvider>
  );
}

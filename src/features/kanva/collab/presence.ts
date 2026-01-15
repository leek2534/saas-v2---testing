/**
 * Presence System
 * User presence, roles, and colors for collaboration
 */

export interface CanvasPresence {
  cursor: { x: number; y: number } | null;
  selection: string[];
  name: string;
  color: string;
  role: 'owner' | 'editor' | 'viewer';
  userId: string;
}

export const presenceColors = [
  '#3b82f6',
  '#ef4444',
  '#10b981',
  '#f59e0b',
  '#8b5cf6',
  '#ec4899',
  '#14b8a6',
  '#f97316',
];

export function getRandomPresenceColor(): string {
  return presenceColors[Math.floor(Math.random() * presenceColors.length)];
}

export function getUserInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

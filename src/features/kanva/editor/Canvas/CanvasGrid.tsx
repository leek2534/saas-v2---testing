'use client';

import { useEditorStore } from '../../lib/editor/store';
import { generateGridLines } from '../../lib/editor/gridSnapping';

interface CanvasGridProps {
  gridSize?: number;
  showGrid?: boolean;
}

/**
 * CanvasGrid - Visual grid overlay for canvas
 * Like Canva's grid system for precise alignment
 */
export function CanvasGrid({ gridSize = 10, showGrid = false }: CanvasGridProps) {
  const canvas = useEditorStore((s) => s.canvas);
  
  if (!showGrid) return null;
  
  const { vertical, horizontal } = generateGridLines(canvas.width, canvas.height, gridSize);
  
  return (
    <svg
      className="absolute inset-0 pointer-events-none"
      style={{
        width: canvas.width,
        height: canvas.height,
      }}
    >
      {/* Vertical grid lines */}
      {vertical.map((x) => (
        <line
          key={`v-${x}`}
          x1={x}
          y1={0}
          x2={x}
          y2={canvas.height}
          stroke="rgba(59, 130, 246, 0.1)"
          strokeWidth="1"
        />
      ))}
      
      {/* Horizontal grid lines */}
      {horizontal.map((y) => (
        <line
          key={`h-${y}`}
          x1={0}
          y1={y}
          x2={canvas.width}
          y2={y}
          stroke="rgba(59, 130, 246, 0.1)"
          strokeWidth="1"
        />
      ))}
      
      {/* Highlight every 50px for major grid lines */}
      {vertical.filter(x => x % 50 === 0).map((x) => (
        <line
          key={`v-major-${x}`}
          x1={x}
          y1={0}
          x2={x}
          y2={canvas.height}
          stroke="rgba(59, 130, 246, 0.2)"
          strokeWidth="1"
        />
      ))}
      
      {horizontal.filter(y => y % 50 === 0).map((y) => (
        <line
          key={`h-major-${y}`}
          x1={0}
          y1={y}
          x2={canvas.width}
          y2={y}
          stroke="rgba(59, 130, 246, 0.2)"
          strokeWidth="1"
        />
      ))}
    </svg>
  );
}

/**
 * KonvaCanvas - Konva.js-based canvas for Kanva editor
 * Replaces HTML/CSS canvas with proper Konva.js rendering
 * Features: Selection, Transform, Resize, Rotate, Alignment Guides
 */

'use client';

import { useEffect, useRef, useState } from 'react';
import { Stage, Layer, Rect, Text as KonvaText, Circle, Transformer, Line } from 'react-konva';
import Konva from 'konva';
import { useEditorStore } from '../../lib/editor/store';

export function KonvaCanvas() {
  const [mounted, setMounted] = useState(false);
  const stageRef = useRef<Konva.Stage>(null);
  const transformerRef = useRef<Konva.Transformer>(null);
  const [zoom, setZoom] = useState(0.5); // Start at 50% to fit better
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [activeGuides, setActiveGuides] = useState<Array<{ id: string; type: 'v' | 'h'; pos: number }>>([]);
  
  const SNAP_THRESHOLD = 10;
  
  // Get canvas and elements from Kanva store
  const canvas = useEditorStore((s) => s.canvas);
  const elements = useEditorStore((s) => s.elements);
  const selectedIds = useEditorStore((s) => s.selectedIds);
  const setSelectedIds = useEditorStore((s) => s.setSelectedIds);
  const updateElement = useEditorStore((s) => s.updateElement);
  
  // Get active page to ensure we have the right canvas
  const pages = useEditorStore((s) => s.pages);
  const activePageId = useEditorStore((s) => s.activePageId);
  const activePage = pages?.find((p) => p.id === activePageId);
  
  // Mount check
  useEffect(() => {
    console.log('KonvaCanvas component mounting...');
    setMounted(true);
    return () => console.log('KonvaCanvas component unmounting...');
  }, []);
  
  // Debug: Log canvas config
  useEffect(() => {
    console.log('KonvaCanvas - Canvas config:', canvas);
    console.log('KonvaCanvas - Elements:', elements.length);
    console.log('KonvaCanvas - Active page:', activePage);
    console.log('KonvaCanvas - Pages:', pages?.length);
  }, [canvas, elements.length, activePage, pages?.length]);
  
  // Update transformer when selection changes
  useEffect(() => {
    if (!transformerRef.current || !stageRef.current) return;
    
    const selectedNodes = selectedIds
      .map((id) => stageRef.current?.findOne(`#${id}`))
      .filter(Boolean) as Konva.Node[];
    
    transformerRef.current.nodes(selectedNodes);
    transformerRef.current.getLayer()?.batchDraw();
  }, [selectedIds]);
  
  // Handle element selection
  const handleSelect = (id: string) => {
    setSelectedIds([id]);
  };
  
  const handleDeselect = () => {
    setSelectedIds([]);
  };
  
  // Get snap lines for alignment
  const getSnapLines = (excludeId: string) => {
    const vertical: number[] = [];
    const horizontal: number[] = [];
    
    // Canvas edges and center
    vertical.push(0, canvas.width / 2, canvas.width);
    horizontal.push(0, canvas.height / 2, canvas.height);
    
    // Other elements
    elements.forEach((el) => {
      if (el.id === excludeId) return;
      
      vertical.push(el.x, el.x + el.width / 2, el.x + el.width);
      horizontal.push(el.y, el.y + el.height / 2, el.y + el.height);
    });
    
    return { vertical, horizontal };
  };
  
  // Find nearest snap target
  const findNearestSnap = (value: number, snapLines: number[]) => {
    let closest = value;
    let minDiff = SNAP_THRESHOLD;
    
    snapLines.forEach((line) => {
      const diff = Math.abs(line - value);
      if (diff < minDiff) {
        minDiff = diff;
        closest = line;
      }
    });
    
    return closest !== value ? closest : null;
  };
  
  // Handle element drag with snapping
  const handleDragMove = (e: Konva.KonvaEventObject<DragEvent>) => {
    const node = e.target;
    const element = elements.find((el) => el.id === node.id());
    if (!element) return;
    
    const snapLines = getSnapLines(element.id);
    const guides: any[] = [];
    
    // Check snapping for all edges and center
    const nodeX = node.x();
    const nodeY = node.y();
    const nodeCenterX = nodeX + element.width / 2;
    const nodeCenterY = nodeY + element.height / 2;
    const nodeRight = nodeX + element.width;
    const nodeBottom = nodeY + element.height;
    
    // Vertical snapping
    let snapX: number | null = null;
    [nodeX, nodeCenterX, nodeRight].forEach((x, idx) => {
      const snap = findNearestSnap(x, snapLines.vertical);
      if (snap !== null) {
        snapX = idx === 0 ? snap : idx === 1 ? snap - element.width / 2 : snap - element.width;
        guides.push({
          id: `v-${snap}`,
          type: 'v',
          pos: snap,
        });
      }
    });
    
    // Horizontal snapping
    let snapY: number | null = null;
    [nodeY, nodeCenterY, nodeBottom].forEach((y, idx) => {
      const snap = findNearestSnap(y, snapLines.horizontal);
      if (snap !== null) {
        snapY = idx === 0 ? snap : idx === 1 ? snap - element.height / 2 : snap - element.height;
        guides.push({
          id: `h-${snap}`,
          type: 'h',
          pos: snap,
        });
      }
    });
    
    // Apply snap
    if (snapX !== null) node.x(snapX);
    if (snapY !== null) node.y(snapY);
    
    setActiveGuides(guides);
  };
  
  // Handle drag end to update element position
  const handleDragEnd = (e: Konva.KonvaEventObject<DragEvent>) => {
    const id = e.target.id();
    const node = e.target;
    
    updateElement(id, {
      x: node.x(),
      y: node.y(),
    });
    
    // Clear guides
    setActiveGuides([]);
  };
  
  // Handle transform end to update element size/rotation
  const handleTransformEnd = (e: Konva.KonvaEventObject<Event>) => {
    const id = e.target.id();
    const node = e.target;
    
    // Get scale and rotation
    const scaleX = node.scaleX();
    const scaleY = node.scaleY();
    
    // Reset scale and apply to width/height
    node.scaleX(1);
    node.scaleY(1);
    
    updateElement(id, {
      x: node.x(),
      y: node.y(),
      width: Math.max(5, node.width() * scaleX),
      height: Math.max(5, node.height() * scaleY),
      rotation: node.rotation(),
    });
  };
  
  // Render element based on type
  const renderElement = (element: any) => {
    const commonProps = {
      key: element.id,
      id: element.id,
      x: element.x,
      y: element.y,
      rotation: element.rotation || 0,
      opacity: element.opacity || 1,
      draggable: !element.locked,
      onClick: () => handleSelect(element.id),
      onTap: () => handleSelect(element.id),
      onDragMove: handleDragMove,
      onDragEnd: handleDragEnd,
      onTransformEnd: handleTransformEnd,
    };
    
    switch (element.type) {
      case 'text':
        return (
          <KonvaText
            {...commonProps}
            text={element.text || 'Text'}
            fontSize={element.fontSize || 32}
            fontFamily={element.fontFamily || 'Inter'}
            fontStyle={element.fontStyle || 'normal'}
            fill={element.fill || '#000000'}
            stroke={element.stroke}
            strokeWidth={element.strokeWidth || 0}
            width={element.width}
          />
        );
      
      case 'shape':
        if (element.shapeType === 'rect' || element.shapeType === 'rectangle') {
          return (
            <Rect
              {...commonProps}
              width={element.width}
              height={element.height}
              fill={element.fill || '#4F46E5'}
              stroke={element.stroke}
              strokeWidth={element.strokeWidth || 0}
              cornerRadius={element.cornerRadius || 0}
            />
          );
        } else if (element.shapeType === 'circle' || element.shapeType === 'ellipse') {
          return (
            <Circle
              {...commonProps}
              x={element.x + element.width / 2}
              y={element.y + element.height / 2}
              radius={element.width / 2}
              fill={element.fill || '#EC4899'}
              stroke={element.stroke}
              strokeWidth={element.strokeWidth || 0}
            />
          );
        }
        return null;
      
      default:
        return null;
    }
  };
  
  // Ensure canvas has valid dimensions
  const canvasWidth = canvas?.width || 1080;
  const canvasHeight = canvas?.height || 1080;
  const backgroundColor = canvas?.background?.color || '#ffffff';
  
  if (!mounted) {
    return (
      <div className="flex-1 flex items-center justify-center bg-muted/10">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-2" />
          <p className="text-sm text-muted-foreground">Loading canvas...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="flex-1 flex items-center justify-center bg-muted/10 overflow-hidden relative">
      {/* Debug info */}
      <div className="absolute top-4 left-4 bg-black/80 text-white p-2 rounded text-xs z-50">
        Canvas: {canvasWidth}x{canvasHeight} | Zoom: {Math.round(zoom * 100)}% | Elements: {elements.length} | Mounted: {mounted ? 'Yes' : 'No'}
      </div>
      
      <div 
        className="absolute inset-0 flex items-center justify-center"
        style={{
          transform: `translate(${pan.x}px, ${pan.y}px)`,
        }}
      >
        {/* Canvas container with shadow - matches Kanva styling */}
        <div 
          className="relative border-2 border-red-500"
          style={{
            transform: `scale(${zoom})`,
            transformOrigin: 'center center',
          }}
        >
          <div className="rounded-sm shadow-2xl overflow-hidden bg-white border-4 border-blue-500">
            <Stage
              ref={stageRef}
              width={canvasWidth}
              height={canvasHeight}
              onMouseDown={(e) => {
                // Deselect when clicking on empty area
                if (e.target === e.target.getStage()) {
                  handleDeselect();
                }
              }}
            >
              {/* Background Layer */}
              <Layer>
                <Rect
                  x={0}
                  y={0}
                  width={canvasWidth}
                  height={canvasHeight}
                  fill={backgroundColor}
                />
              </Layer>
              
              {/* Elements Layer */}
              <Layer>
                {[...elements]
                  .sort((a, b) => (a.zIndex || 0) - (b.zIndex || 0))
                  .map((element) => renderElement(element))}
              </Layer>
              
              {/* Guides Layer */}
              <Layer listening={false}>
                {activeGuides.map((guide) => (
                  <Line
                    key={guide.id}
                    points={
                      guide.type === 'v'
                        ? [guide.pos, 0, guide.pos, canvasHeight]
                        : [0, guide.pos, canvasWidth, guide.pos]
                    }
                    stroke="#4F46E5"
                    strokeWidth={1}
                    dash={[4, 6]}
                    opacity={0.8}
                  />
                ))}
              </Layer>
              
              {/* Selection Layer with Transformer */}
              <Layer>
                <Transformer
                  ref={transformerRef}
                  boundBoxFunc={(oldBox, newBox) => {
                    // Limit resize
                    if (newBox.width < 5 || newBox.height < 5) {
                      return oldBox;
                    }
                    return newBox;
                  }}
                  enabledAnchors={[
                    'top-left',
                    'top-right',
                    'bottom-left',
                    'bottom-right',
                  ]}
                  rotateEnabled={true}
                />
              </Layer>
            </Stage>
          </div>
        </div>
      </div>
      
      {/* Zoom controls - positioned absolutely in parent */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex gap-1 bg-white rounded-lg shadow-lg border border-border p-1">
        <button
          onClick={() => setZoom(Math.max(0.25, zoom - 0.1))}
          className="px-3 py-1.5 rounded hover:bg-accent text-sm font-medium transition-colors"
          title="Zoom Out"
        >
          −
        </button>
        <button
          onClick={() => setZoom(1)}
          className="px-3 py-1.5 rounded hover:bg-accent text-xs font-medium transition-colors min-w-[60px]"
          title="Reset Zoom"
        >
          {Math.round(zoom * 100)}%
        </button>
        <button
          onClick={() => setZoom(Math.min(5, zoom + 0.1))}
          className="px-3 py-1.5 rounded hover:bg-accent text-sm font-medium transition-colors"
          title="Zoom In"
        >
          +
        </button>
      </div>
    </div>
  );
}

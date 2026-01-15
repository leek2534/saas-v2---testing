/**
 * KonvaCanvasSimple - Minimal working Konva canvas
 */

'use client';

import { useEffect, useRef, useState } from 'react';
import { Stage, Layer, Rect, Text as KonvaText, Transformer, Line } from 'react-konva';
import Konva from 'konva';
import { useEditorStore } from '../../lib/editor/store';

export function KonvaCanvasSimple() {
  const stageRef = useRef<Konva.Stage>(null);
  const transformerRef = useRef<Konva.Transformer>(null);
  const [zoom, setZoom] = useState(0.5);
  const [activeGuides, setActiveGuides] = useState<Array<{ id: string; type: 'v' | 'h'; pos: number }>>([]);
  
  // Get only the essential data from store
  const canvas = useEditorStore((s) => s.canvas);
  const elements = useEditorStore((s) => s.elements);
  const selectedIds = useEditorStore((s) => s.selectedIds);
  const setSelectedIds = useEditorStore((s) => s.setSelectedIds);
  const updateElement = useEditorStore((s) => s.updateElement);
  
  const canvasWidth = canvas?.width || 1080;
  const canvasHeight = canvas?.height || 1080;
  const backgroundColor = canvas?.background?.color || '#ffffff';
  
  // Update transformer when selection changes
  useEffect(() => {
    if (!transformerRef.current || !stageRef.current) return;
    const selectedNodes = selectedIds
      .map((id) => stageRef.current?.findOne(`#${id}`))
      .filter(Boolean) as Konva.Node[];
    transformerRef.current.nodes(selectedNodes);
    transformerRef.current.getLayer()?.batchDraw();
  }, [selectedIds]);
  
  const handleSelect = (id: string) => setSelectedIds([id]);
  const handleDeselect = () => setSelectedIds([]);
  
  const handleDragEnd = (e: Konva.KonvaEventObject<DragEvent>) => {
    const id = e.target.id();
    updateElement(id, { x: e.target.x(), y: e.target.y() });
    setActiveGuides([]);
  };
  
  const handleTransformEnd = (e: Konva.KonvaEventObject<Event>) => {
    const id = e.target.id();
    const node = e.target;
    const scaleX = node.scaleX();
    const scaleY = node.scaleY();
    
    updateElement(id, {
      x: node.x(),
      y: node.y(),
      width: Math.max(5, node.width() * scaleX),
      height: Math.max(5, node.height() * scaleY),
      rotation: node.rotation(),
    });
    
    node.scaleX(1);
    node.scaleY(1);
  };
  
  return (
    <div className="flex-1 flex items-center justify-center bg-muted/10 overflow-hidden relative">
      <div className="absolute inset-0 flex items-center justify-center">
        <div style={{ transform: `scale(${zoom})`, transformOrigin: 'center center' }}>
          <div className="bg-white rounded-sm shadow-2xl">
            <Stage
              ref={stageRef}
              width={canvasWidth}
              height={canvasHeight}
              onMouseDown={(e) => {
                if (e.target === e.target.getStage()) handleDeselect();
              }}
            >
              <Layer>
                <Rect x={0} y={0} width={canvasWidth} height={canvasHeight} fill={backgroundColor} />
              </Layer>
              
              <Layer>
                {elements?.map((element) => {
                  if (element.type === 'text') {
                    return (
                      <KonvaText
                        key={element.id}
                        id={element.id}
                        x={element.x}
                        y={element.y}
                        text={element.text || 'Text'}
                        fontSize={(element as any).fontSize || 32}
                        fontFamily={(element as any).fontFamily || 'Inter'}
                        fill={(element as any).fill || '#000000'}
                        draggable
                        onClick={() => handleSelect(element.id)}
                        onDragEnd={handleDragEnd}
                        onTransformEnd={handleTransformEnd}
                      />
                    );
                  } else if (element.type === 'shape') {
                    return (
                      <Rect
                        key={element.id}
                        id={element.id}
                        x={element.x}
                        y={element.y}
                        width={element.width}
                        height={element.height}
                        fill={(element as any).fill || '#4F46E5'}
                        draggable
                        onClick={() => handleSelect(element.id)}
                        onDragEnd={handleDragEnd}
                        onTransformEnd={handleTransformEnd}
                      />
                    );
                  }
                  return null;
                })}
              </Layer>
              
              <Layer>
                <Transformer
                  ref={transformerRef}
                  enabledAnchors={['top-left', 'top-right', 'bottom-left', 'bottom-right']}
                  rotateEnabled={true}
                />
              </Layer>
            </Stage>
          </div>
        </div>
      </div>
      
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex gap-1 bg-white rounded-lg shadow-lg border p-1 z-10">
        <button onClick={() => setZoom(Math.max(0.25, zoom - 0.1))} className="px-3 py-1.5 rounded hover:bg-accent text-sm">−</button>
        <button onClick={() => setZoom(1)} className="px-3 py-1.5 rounded hover:bg-accent text-xs min-w-[60px]">{Math.round(zoom * 100)}%</button>
        <button onClick={() => setZoom(Math.min(5, zoom + 0.1))} className="px-3 py-1.5 rounded hover:bg-accent text-sm">+</button>
      </div>
    </div>
  );
}

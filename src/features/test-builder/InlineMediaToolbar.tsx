"use client";



import React, { useEffect, useRef, useState } from 'react';
import { Editor } from '@tiptap/react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Image as ImageIcon,
  Video,
  FileVideo,
  Link as LinkIcon,
  Trash2,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Crop,
  RotateCcw,
} from 'lucide-react';

interface InlineMediaToolbarProps {
  editor: Editor;
}

export function InlineMediaToolbar({ editor }: InlineMediaToolbarProps) {
  const [coords, setCoords] = useState<{ top: number; left: number } | null>(null);
  const [type, setType] = useState<'image' | 'video' | 'gif' | null>(null);
  const ref = useRef<HTMLDivElement>(null);

  // Detect when a media node is selected
  useEffect(() => {
    if (!editor) return;

    const updateToolbar = () => {
      const { state, view } = editor;
      const { selection } = state;
      
      // Check if selection is a NodeSelection (clicking directly on a node)
      const { $from } = selection;
      const node = $from.node();
      const nodeType = node.type.name;
      
      console.log('🔍 Toolbar check - Node type:', nodeType, 'Selection:', selection);
      
      // Check if the current node is a media node
      if (['image', 'video', 'gif'].includes(nodeType)) {
        const dom = view.nodeDOM($from.pos) as HTMLElement | null;
        if (dom) {
          const rect = dom.getBoundingClientRect();
          console.log('✅ Media node found:', nodeType, 'at', rect);
          setCoords({
            top: rect.top + window.scrollY - 50,
            left: rect.left + rect.width / 2 + window.scrollX,
          });
          setType(nodeType as 'image' | 'video' | 'gif');
          return;
        }
      }
      
      // Walk up the node tree to find a media node parent
      for (let depth = $from.depth; depth > 0; depth--) {
        const nodeAtDepth = $from.node(depth);
        if (['image', 'video', 'gif'].includes(nodeAtDepth.type.name)) {
          const pos = $from.start(depth);
          const dom = view.nodeDOM(pos) as HTMLElement | null;
          if (dom) {
            const rect = dom.getBoundingClientRect();
            console.log('✅ Media node found in parent:', nodeAtDepth.type.name, 'at', rect);
            setCoords({
              top: rect.top + window.scrollY - 50,
              left: rect.left + rect.width / 2 + window.scrollX,
            });
            setType(nodeAtDepth.type.name as 'image' | 'video' | 'gif');
            return;
          }
        }
      }
      
      // Check for image elements in the DOM at selection position
      try {
        const domAtPos = view.domAtPos(selection.from);
        if (domAtPos.node) {
          const element = domAtPos.node as HTMLElement;
          const img = element.closest?.('img') || (element.tagName === 'IMG' ? element : null);
          if (img) {
            const rect = img.getBoundingClientRect();
            console.log('✅ Image found in DOM at', rect);
            setCoords({
              top: rect.top + window.scrollY - 50,
              left: rect.left + rect.width / 2 + window.scrollX,
            });
            setType('image');
            return;
          }
        }
      } catch (e) {
        // Ignore errors
      }
      
      // No media node found
      console.log('❌ No media node found');
      setCoords(null);
      setType(null);
    };

    editor.on('selectionUpdate', updateToolbar);
    editor.on('transaction', updateToolbar);
    editor.on('update', updateToolbar);
    
    // Also listen for clicks on images directly
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName === 'IMG') {
        // Small delay to let TipTap update selection
        setTimeout(() => {
          updateToolbar();
        }, 50);
      }
    };
    
    if (editor.view?.dom) {
      editor.view.dom.addEventListener('click', handleClick, true);
    }
    
    // Initial check
    updateToolbar();
    
    return () => {
      editor.off('selectionUpdate', updateToolbar);
      editor.off('transaction', updateToolbar);
      editor.off('update', updateToolbar);
      if (editor.view?.dom) {
        editor.view.dom.removeEventListener('click', handleClick, true);
      }
    };
  }, [editor]);

  // Hide when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setCoords(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!coords || !type) return null;

  // Define toolbar actions
  const common = [
    { icon: AlignLeft, action: 'alignLeft', label: 'Align Left' },
    { icon: AlignCenter, action: 'alignCenter', label: 'Align Center' },
    { icon: AlignRight, action: 'alignRight', label: 'Align Right' },
    { icon: Trash2, action: 'deleteNode', label: 'Delete' },
  ];

  const specific =
    type === 'image'
      ? [
          { icon: ImageIcon, action: 'replaceImage', label: 'Replace Image' },
          { icon: LinkIcon, action: 'setLink', label: 'Add Link' },
          { icon: Crop, action: 'crop', label: 'Crop' },
        ]
      : type === 'video'
      ? [
          { icon: Video, action: 'replaceVideo', label: 'Replace Video' },
          { icon: RotateCcw, action: 'aspect', label: 'Aspect Ratio' },
        ]
      : [
          { icon: FileVideo, action: 'replaceGif', label: 'Replace GIF' },
          { icon: LinkIcon, action: 'setLink', label: 'Add Link' },
        ];

  const buttons = [...specific, ...common];

  const handleAction = (action: string) => {
    switch (action) {
      case 'alignLeft':
        editor.chain().focus().updateAttributes(type, { align: 'left' }).run();
        break;
      case 'alignCenter':
        editor.chain().focus().updateAttributes(type, { align: 'center' }).run();
        break;
      case 'alignRight':
        editor.chain().focus().updateAttributes(type, { align: 'right' }).run();
        break;
      case 'deleteNode':
        editor.chain().focus().deleteSelection().run();
        break;
      // Add logic for replace or link modals as needed
      default:
        break;
    }
  };

  if (!coords || !type) return null;

  console.log('🎨 Rendering toolbar at:', coords, 'type:', type);

  return (
    <AnimatePresence>
      {coords && type && (
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.15 }}
          className="fixed z-[1000000] flex items-center gap-1 rounded-full bg-black/95 text-white border border-white/40 shadow-[0_15px_45px_rgba(0,0,0,0.65)] px-3 py-1.5"
          style={{
            top: `${coords.top}px`,
            left: `${coords.left}px`,
            transform: 'translateX(-50%)',
          }}
        >
          {buttons.map(({ icon: Icon, action, label }) => (
            <button
              key={action}
              onClick={() => handleAction(action)}
              title={label}
              className="p-1.5 rounded-full transition bg-transparent text-white hover:bg-white/10"
            >
              <Icon size={16} />
            </button>
          ))}
        </motion.div>
      )}
    </AnimatePresence>
  );
}


"use client";



import React from 'react';
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuShortcut,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuTrigger,
} from '@/components/ui/context-menu';
import {
  Copy, Trash2, ArrowUp, ArrowDown, Lock, Unlock,
  Eye, EyeOff, Layers, Code, Palette, Settings,
  Clipboard, Scissors
} from 'lucide-react';
import { useTestBuilderV2Store } from './store';
import { toast } from 'sonner';

interface ElementContextMenuProps {
  children: React.ReactNode;
  elementId: string;
  elementType: string;
}

export function ElementContextMenu({ children, elementId, elementType }: ElementContextMenuProps) {
  const {
    duplicateElement,
    deleteElement,
    moveElementUp,
    moveElementDown,
    copyElement,
    cutElement,
    pasteElement,
  } = useTestBuilderV2Store();

  const handleDuplicate = () => {
    duplicateElement(elementId);
    toast.success('Element duplicated');
  };

  const handleDelete = () => {
    deleteElement(elementId);
    toast.success('Element deleted');
  };

  const handleMoveUp = () => {
    moveElementUp(elementId);
    toast.success('Element moved up');
  };

  const handleMoveDown = () => {
    moveElementDown(elementId);
    toast.success('Element moved down');
  };

  const handleCopy = () => {
    copyElement(elementId);
    toast.success('Element copied');
  };

  const handleCut = () => {
    cutElement(elementId);
    toast.success('Element cut');
  };

  const handlePaste = () => {
    pasteElement();
    toast.success('Element pasted');
  };

  const handleLock = () => {
    toast.info('Lock feature coming soon!');
  };

  const handleHide = () => {
    toast.info('Hide feature coming soon!');
  };

  const handleViewCode = () => {
    toast.info('View code feature coming soon!');
  };

  const handleChangeStyle = () => {
    toast.info('Quick style change coming soon!');
  };

  return (
    <ContextMenu>
      <ContextMenuTrigger asChild>
        {children}
      </ContextMenuTrigger>
      <ContextMenuContent className="w-64">
        {/* Copy/Cut/Paste */}
        <ContextMenuItem onClick={handleCopy}>
          <Copy className="w-4 h-4 mr-2" />
          Copy
          <ContextMenuShortcut>⌘C</ContextMenuShortcut>
        </ContextMenuItem>
        <ContextMenuItem onClick={handleCut}>
          <Scissors className="w-4 h-4 mr-2" />
          Cut
          <ContextMenuShortcut>⌘X</ContextMenuShortcut>
        </ContextMenuItem>
        <ContextMenuItem onClick={handlePaste}>
          <Clipboard className="w-4 h-4 mr-2" />
          Paste
          <ContextMenuShortcut>⌘V</ContextMenuShortcut>
        </ContextMenuItem>

        <ContextMenuSeparator />

        {/* Duplicate & Delete */}
        <ContextMenuItem onClick={handleDuplicate}>
          <Layers className="w-4 h-4 mr-2" />
          Duplicate
          <ContextMenuShortcut>⌘D</ContextMenuShortcut>
        </ContextMenuItem>
        <ContextMenuItem onClick={handleDelete} className="text-red-600 focus:text-red-600">
          <Trash2 className="w-4 h-4 mr-2" />
          Delete
          <ContextMenuShortcut>⌫</ContextMenuShortcut>
        </ContextMenuItem>

        <ContextMenuSeparator />

        {/* Move */}
        <ContextMenuItem onClick={handleMoveUp}>
          <ArrowUp className="w-4 h-4 mr-2" />
          Move Up
          <ContextMenuShortcut>⌘↑</ContextMenuShortcut>
        </ContextMenuItem>
        <ContextMenuItem onClick={handleMoveDown}>
          <ArrowDown className="w-4 h-4 mr-2" />
          Move Down
          <ContextMenuShortcut>⌘↓</ContextMenuShortcut>
        </ContextMenuItem>

        <ContextMenuSeparator />

        {/* Lock/Hide */}
        <ContextMenuItem onClick={handleLock}>
          <Lock className="w-4 h-4 mr-2" />
          Lock Element
        </ContextMenuItem>
        <ContextMenuItem onClick={handleHide}>
          <EyeOff className="w-4 h-4 mr-2" />
          Hide Element
        </ContextMenuItem>

        <ContextMenuSeparator />

        {/* Style Options */}
        <ContextMenuSub>
          <ContextMenuSubTrigger>
            <Palette className="w-4 h-4 mr-2" />
            Quick Styles
          </ContextMenuSubTrigger>
          <ContextMenuSubContent className="w-48">
            <ContextMenuItem onClick={handleChangeStyle}>
              <div className="w-4 h-4 mr-2 rounded bg-blue-500" />
              Primary Style
            </ContextMenuItem>
            <ContextMenuItem onClick={handleChangeStyle}>
              <div className="w-4 h-4 mr-2 rounded bg-gray-500" />
              Secondary Style
            </ContextMenuItem>
            <ContextMenuItem onClick={handleChangeStyle}>
              <div className="w-4 h-4 mr-2 rounded bg-green-500" />
              Success Style
            </ContextMenuItem>
            <ContextMenuItem onClick={handleChangeStyle}>
              <div className="w-4 h-4 mr-2 rounded bg-red-500" />
              Danger Style
            </ContextMenuItem>
          </ContextMenuSubContent>
        </ContextMenuSub>

        <ContextMenuSeparator />

        {/* Advanced */}
        <ContextMenuItem onClick={handleViewCode}>
          <Code className="w-4 h-4 mr-2" />
          View Code
        </ContextMenuItem>
        <ContextMenuItem>
          <Settings className="w-4 h-4 mr-2" />
          Element Settings
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
}

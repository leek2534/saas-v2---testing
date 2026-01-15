'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import { TextStyle } from '@tiptap/extension-text-style';
import { Color } from '@tiptap/extension-color';
import { useEffect, useRef } from 'react';
import { registerEditor, unregisterEditor } from '../../lib/editor/editorRegistry';
import { Overline } from '../../../extensions/Overline';

interface CanvasTextEditorProps {
  elementId: string;
  value: any; // TipTap JSONConten5173
  onChange: (json: any) => void;
  onBlur: () => void;
  autoFocus?: boolean;
  style?: React.CSSProperties;
}

export function CanvasTextEditor({
  elementId,
  value,
  onChange,
  onBlur,
  autoFocus = false,
  style,
}: CanvasTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Overline,
      TextStyle,
      Color,
    ],
    content: value,
    autofocus: autoFocus,
    editorProps: {
      attributes: {
        class: 'outline-none cursor-text',
        style: 'outline: none; border: none; background: transparent; padding: 0; margin: 0;',
      },
      handleKeyDown: (view, event) => {
        // Handle Enter key properly
        if (event.key === 'Enter') {
          // If Shift+Enter, create a hard break (line break)
          if (event.shiftKey) {
            editor.chain().focus().setHardBreak().run();
            return true;
          }
          // Regular Enter creates a new paragraph
          // TipTap handles this naturally - let it proceed
          return false; // Let TipTap handle Enter naturally
        }
        return false;
      },
    },
    onUpdate({ editor }) {
      onChange(editor.getJSON());
    },
    onBlur: (event) => {
      // Check if blur is caused by clicking on toolbar
      const relatedTarget = (event as any).relatedTarget || document.activeElement;
      
      // Don't exit edit mode if clicking on toolbar buttons or popovers
      if (
        relatedTarget &&
        (
          relatedTarget.closest('button') ||
          relatedTarget.closest('[role="button"]') ||
          relatedTarget.closest('.popover-content') ||
          relatedTarget.closest('[data-radix-portal]') ||
          relatedTarget.closest('#dynamic-element-toolbar-container') ||
          relatedTarget.closest('#text-toolbar-content') ||
          relatedTarget.closest('.inline-text-toolbar') ||
          relatedTarget.closest('[data-toolbar-popup]')
        )
      ) {
        // Keep editor focused - don't call onBlur
        // Restore focus to editor to maintain selection
        setTimeout(() => {
          if (editor && !editor.isDestroyed) {
            editor.commands.focus();
          }
        }, 0);
        return;
      }
      
      // Normal blur - exit edit mode
      onBlur();
    },
  });

  // Apply styles directly to ProseMirror element after mount
  useEffect(() => {
    if (editor && editorRef.current && style) {
      const proseMirror = editorRef.current.querySelector('.ProseMirror') as HTMLElement;
      if (proseMirror) {
        Object.entries(style).forEach(([key, value]) => {
          (proseMirror.style as any)[key] = value;
        });
      }
    }
  }, [editor, style]);

  // Register/unregister editor instance
  useEffect(() => {
    if (editor) {
      registerEditor(elementId, editor);
      return () => {
        unregisterEditor(elementId);
      };
    }
  }, [editor, elementId]);

  // Update editor content when value changes externally (but don't add to history)
  useEffect(() => {
    if (editor && value) {
      const currentJSON = editor.getJSON();
      // Only update if different to avoid infinite loops
      if (JSON.stringify(currentJSON) !== JSON.stringify(value)) {
        editor.commands.setContent(value, { emitUpdate: false }); // Don't trigger update event
      }
    }
  }, [editor, value]);

  if (!editor) return null;

  return (
    <div ref={editorRef} style={{ width: '100%', height: '100%' }}>
      <EditorContent editor={editor} />
    </div>
  );
}


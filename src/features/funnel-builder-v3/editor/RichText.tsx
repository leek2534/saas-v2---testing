"use client";

import React, { useEffect, useState, useRef } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import type { JSONContent } from "@tiptap/core";
import { tiptapExtensions } from "./tiptapExtensions";
import { cn } from "@/lib/utils";
import { 
  Bold, 
  Italic, 
  Underline, 
  Strikethrough,
  AlignLeft, 
  AlignCenter, 
  AlignRight, 
  List, 
  ListOrdered,
  Quote,
  Code,
  Minus,
  Link as LinkIcon,
  Undo,
  Redo,
  Highlighter,
  Subscript as SubscriptIcon,
  Superscript as SuperscriptIcon,
  Palette
} from "lucide-react";

function Btn({
  active,
  onClick,
  children,
  title,
  disabled,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
  title?: string;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      title={title}
      disabled={disabled}
      onMouseDown={(e) => e.preventDefault()}
      onClick={onClick}
      className={cn(
        "flex h-7 w-7 items-center justify-center rounded transition-all",
        active 
          ? "bg-blue-500 text-white shadow-sm" 
          : "text-slate-600 hover:bg-slate-100 hover:text-slate-900",
        disabled && "opacity-50 cursor-not-allowed"
      )}
    >
      {children}
    </button>
  );
}

function InlineToolbar({ editor }: { editor: any }) {
  const [showColorPicker, setShowColorPicker] = React.useState(false);
  const [showHighlightPicker, setShowHighlightPicker] = React.useState(false);

  return (
    <div className="flex items-center gap-1 bg-slate-50 p-2 rounded-md flex-wrap">
      {/* Text Formatting */}
      <Btn active={editor.isActive("bold")} onClick={() => editor.chain().focus().toggleBold().run()} title="Bold (Cmd+B)">
        <Bold size={16} />
      </Btn>
      <Btn active={editor.isActive("italic")} onClick={() => editor.chain().focus().toggleItalic().run()} title="Italic (Cmd+I)">
        <Italic size={16} />
      </Btn>
      <Btn active={editor.isActive("underline")} onClick={() => editor.chain().focus().toggleUnderline().run()} title="Underline (Cmd+U)">
        <Underline size={16} />
      </Btn>
      <Btn active={editor.isActive("strike")} onClick={() => editor.chain().focus().toggleStrike().run()} title="Strikethrough">
        <Strikethrough size={16} />
      </Btn>
      <Btn active={editor.isActive("subscript")} onClick={() => editor.chain().focus().toggleSubscript().run()} title="Subscript">
        <SubscriptIcon size={16} />
      </Btn>
      <Btn active={editor.isActive("superscript")} onClick={() => editor.chain().focus().toggleSuperscript().run()} title="Superscript">
        <SuperscriptIcon size={16} />
      </Btn>
      
      <div className="h-5 w-px bg-slate-300" />
      
      {/* Colors */}
      <div className="relative">
        <Btn active={showColorPicker} onClick={() => setShowColorPicker(!showColorPicker)} title="Text Color">
          <Palette size={16} />
        </Btn>
        {showColorPicker && (
          <div className="absolute top-full mt-1 p-3 bg-white border border-slate-200 rounded-lg shadow-lg z-50">
            <div className="text-xs font-medium text-slate-700 mb-2">Text Color</div>
            <div className="grid grid-cols-5 gap-1.5">
              {['#000000', '#ef4444', '#f97316', '#eab308', '#22c55e', '#3b82f6', '#8b5cf6', '#ec4899', '#64748b', '#ffffff'].map(color => (
                <button
                  key={color}
                  className="w-7 h-7 rounded border-2 border-slate-200 hover:border-blue-400 hover:scale-110 transition-all"
                  style={{ backgroundColor: color }}
                  onClick={() => {
                    editor.chain().focus().setColor(color).run();
                    setShowColorPicker(false);
                  }}
                  title={color}
                />
              ))}
            </div>
          </div>
        )}
      </div>
      <div className="relative">
        <Btn active={editor.isActive("highlight")} onClick={() => setShowHighlightPicker(!showHighlightPicker)} title="Highlight">
          <Highlighter size={16} />
        </Btn>
        {showHighlightPicker && (
          <div className="absolute top-full mt-1 p-3 bg-white border border-slate-200 rounded-lg shadow-lg z-50">
            <div className="text-xs font-medium text-slate-700 mb-2">Highlight Color</div>
            <div className="grid grid-cols-5 gap-1.5">
              {['#fef08a', '#fde047', '#bef264', '#86efac', '#7dd3fc', '#c4b5fd', '#f9a8d4', '#fda4af', '#cbd5e1', 'transparent'].map(color => (
                <button
                  key={color}
                  className="w-7 h-7 rounded border-2 border-slate-200 hover:border-blue-400 hover:scale-110 transition-all relative"
                  style={{ backgroundColor: color === 'transparent' ? '#ffffff' : color }}
                  onClick={() => {
                    if (color === 'transparent') {
                      editor.chain().focus().unsetHighlight().run();
                    } else {
                      editor.chain().focus().setHighlight({ color }).run();
                    }
                    setShowHighlightPicker(false);
                  }}
                  title={color === 'transparent' ? 'Remove highlight' : color}
                >
                  {color === 'transparent' && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-5 h-0.5 bg-red-500 rotate-45" />
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
      
      <div className="h-5 w-px bg-slate-300" />
      
      {/* Text Alignment */}
      <Btn active={editor.isActive({ textAlign: "left" })} onClick={() => editor.chain().focus().setTextAlign("left").run()} title="Align Left">
        <AlignLeft size={16} />
      </Btn>
      <Btn active={editor.isActive({ textAlign: "center" })} onClick={() => editor.chain().focus().setTextAlign("center").run()} title="Align Center">
        <AlignCenter size={16} />
      </Btn>
      <Btn active={editor.isActive({ textAlign: "right" })} onClick={() => editor.chain().focus().setTextAlign("right").run()} title="Align Right">
        <AlignRight size={16} />
      </Btn>
      
      <div className="h-5 w-px bg-slate-300" />
      
      {/* Lists & Blocks */}
      <Btn active={editor.isActive("bulletList")} onClick={() => editor.chain().focus().toggleBulletList().run()} title="Bullet List">
        <List size={16} />
      </Btn>
      <Btn active={editor.isActive("orderedList")} onClick={() => editor.chain().focus().toggleOrderedList().run()} title="Numbered List">
        <ListOrdered size={16} />
      </Btn>
      <Btn active={editor.isActive("blockquote")} onClick={() => editor.chain().focus().toggleBlockquote().run()} title="Blockquote">
        <Quote size={16} />
      </Btn>
      <Btn active={editor.isActive("code")} onClick={() => editor.chain().focus().toggleCode().run()} title="Inline Code">
        <Code size={16} />
      </Btn>
      <Btn active={false} onClick={() => editor.chain().focus().setHorizontalRule().run()} title="Horizontal Rule">
        <Minus size={16} />
      </Btn>
      
      <div className="h-5 w-px bg-slate-300" />
      
      {/* History */}
      <Btn active={false} onClick={() => editor.chain().focus().undo().run()} title="Undo (Cmd+Z)">
        <Undo size={16} />
      </Btn>
      <Btn active={false} onClick={() => editor.chain().focus().redo().run()} title="Redo (Cmd+Shift+Z)">
        <Redo size={16} />
      </Btn>
    </div>
  );
}

export function RichText({
  value,
  onChange,
  editable,
  bubble,
  inline,
  className,
}: {
  value: JSONContent;
  onChange?: (next: JSONContent) => void;
  editable: boolean;
  bubble?: boolean;
  inline?: boolean;
  className?: string;
}) {
  const editor = useEditor({
    extensions: tiptapExtensions,
    content: value,
    editable,
    immediatelyRender: false,
    onUpdate: ({ editor }) => onChange?.(editor.getJSON()),
    editorProps: {
      attributes: {
        class:
          "outline-none focus:outline-none prose prose-sm max-w-none " +
          "[&_p]:m-0 [&_p]:leading-inherit " +
          "[&_ul]:my-2 [&_ul]:pl-6 [&_ul]:list-disc " +
          "[&_ol]:my-2 [&_ol]:pl-6 [&_ol]:list-decimal " +
          "[&_li]:my-1 " +
          "[&_blockquote]:my-2 [&_blockquote]:pl-4 [&_blockquote]:border-l-4 [&_blockquote]:border-slate-300 [&_blockquote]:italic " +
          "[&_pre]:my-2 [&_pre]:p-3 [&_pre]:bg-slate-100 [&_pre]:rounded [&_pre]:overflow-x-auto " +
          "[&_code]:px-1 [&_code]:py-0.5 [&_code]:bg-slate-100 [&_code]:rounded [&_code]:text-sm " +
          "[&_hr]:my-4 [&_hr]:border-slate-300 " +
          "[&_h1]:m-0 [&_h2]:m-0 [&_h3]:m-0 [&_h4]:m-0 [&_h5]:m-0 [&_h6]:m-0 " +
          "[&_mark]:px-1 [&_mark]:rounded " +
          "[&_sub]:text-xs [&_sub]:align-sub " +
          "[&_sup]:text-xs [&_sup]:align-super " +
          "[&_.ProseMirror]:outline-none",
      },
    },
  });

  // Sync external content changes to editor (bidirectional sync)
  useEffect(() => {
    if (!editor || !value) return;
    
    const currentContent = editor.getJSON();
    const isSame = JSON.stringify(currentContent) === JSON.stringify(value);
    
    if (!isSame) {
      editor.commands.setContent(value, { emitUpdate: false });
    }
  }, [editor, value]);

  useEffect(() => {
    if (!editor) return;
    editor.setEditable(editable);
  }, [editor, editable]);

  if (!editor) return null;

  return (
    <div className={cn("relative", className)}>
      {editable && inline && (
        <div className="mb-3">
          <InlineToolbar editor={editor} />
        </div>
      )}
      {editable && !inline && (
        <div className="absolute -top-14 left-1/2 -translate-x-1/2 z-50 pointer-events-auto shadow-lg">
          <InlineToolbar editor={editor} />
        </div>
      )}
      <div className={cn(
        editable && inline && "min-h-[150px] p-3 bg-white border border-slate-200 rounded-md focus-within:border-blue-400 focus-within:ring-2 focus-within:ring-blue-100 transition-all"
      )}>
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}

"use client";

import React, { useEffect } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import {
  Bold,
  Italic,
  Strikethrough,
  Code,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  Code2,
  Link as LinkIcon,
  Unlink,
  Undo2,
  Redo2,
  Minus,
} from "lucide-react";

interface RichTextEditorProps {
  content: string;
  onChange: (html: string) => void;
  placeholder?: string;
  error?: string;
  disabled?: boolean;
}

export function RichTextEditor({
  content,
  onChange,
  placeholder = "Describe your project features, architecture, and instructions for mentors...",
  error,
  disabled = false,
}: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: "text-[#1877f2] dark:text-[#2d88ff] underline font-medium hover:text-[#166fe5]",
          target: "_blank",
          rel: "noopener noreferrer",
        },
      }),
      Placeholder.configure({
        placeholder,
      }),
    ],
    content,
    editable: !disabled,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    immediatelyRender: false,
  });

  // Sync external content if reset
  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      if (content === "") {
        editor.commands.setContent("");
      }
    }
  }, [content, editor]);

  if (!editor) {
    return (
      <div className="h-44 w-full rounded-xl border border-[#ced0d4] dark:border-[#3a3b3c] bg-white dark:bg-[#18191a] animate-pulse" />
    );
  }

  const setLink = () => {
    const previousUrl = editor.getAttributes("link").href;
    const url = window.prompt("Enter URL (e.g. https://example.com):", previousUrl);

    if (url === null) return;
    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }

    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  };

  return (
    <div className="space-y-1">
      <div
        className={`overflow-hidden rounded-xl border transition-all ${
          error
            ? "border-red-500 ring-2 ring-red-500/10"
            : "border-[#ced0d4] dark:border-[#3a3b3c] focus-within:border-[#1877f2] focus-within:ring-2 focus-within:ring-[#1877f2]/20"
        } bg-white dark:bg-[#18191a] shadow-xs`}
      >
        {/* Editor Toolbar with Facebook Styling */}
        <div className="flex flex-wrap items-center gap-1 border-b border-[#e4e6eb] dark:border-[#3a3b3c] bg-[#f0f2f5] dark:bg-[#242526] p-1.5">
          {/* Text Style */}
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleBold().run()}
            disabled={disabled}
            className={`flex h-8 w-8 items-center justify-center rounded-lg text-xs font-semibold transition-colors ${
              editor.isActive("bold")
                ? "bg-[#1877f2] text-white shadow-xs"
                : "text-[#050505] hover:bg-[#e4e6eb] dark:text-[#e4e6eb] dark:hover:bg-[#3a3b3c]"
            }`}
            title="Bold (Ctrl+B)"
          >
            <Bold className="h-4 w-4" />
          </button>

          <button
            type="button"
            onClick={() => editor.chain().focus().toggleItalic().run()}
            disabled={disabled}
            className={`flex h-8 w-8 items-center justify-center rounded-lg text-xs font-semibold transition-colors ${
              editor.isActive("italic")
                ? "bg-[#1877f2] text-white shadow-xs"
                : "text-[#050505] hover:bg-[#e4e6eb] dark:text-[#e4e6eb] dark:hover:bg-[#3a3b3c]"
            }`}
            title="Italic (Ctrl+I)"
          >
            <Italic className="h-4 w-4" />
          </button>

          <button
            type="button"
            onClick={() => editor.chain().focus().toggleStrike().run()}
            disabled={disabled}
            className={`flex h-8 w-8 items-center justify-center rounded-lg text-xs font-semibold transition-colors ${
              editor.isActive("strike")
                ? "bg-[#1877f2] text-white shadow-xs"
                : "text-[#050505] hover:bg-[#e4e6eb] dark:text-[#e4e6eb] dark:hover:bg-[#3a3b3c]"
            }`}
            title="Strikethrough"
          >
            <Strikethrough className="h-4 w-4" />
          </button>

          <button
            type="button"
            onClick={() => editor.chain().focus().toggleCode().run()}
            disabled={disabled}
            className={`flex h-8 w-8 items-center justify-center rounded-lg text-xs font-semibold transition-colors ${
              editor.isActive("code")
                ? "bg-[#1877f2] text-white shadow-xs"
                : "text-[#050505] hover:bg-[#e4e6eb] dark:text-[#e4e6eb] dark:hover:bg-[#3a3b3c]"
            }`}
            title="Inline Code"
          >
            <Code className="h-4 w-4" />
          </button>

          <div className="mx-1 h-5 w-[1px] bg-[#ced0d4] dark:bg-[#3a3b3c]" />

          {/* Headings */}
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
            disabled={disabled}
            className={`flex h-8 w-8 items-center justify-center rounded-lg text-xs font-bold transition-colors ${
              editor.isActive("heading", { level: 1 })
                ? "bg-[#1877f2] text-white shadow-xs"
                : "text-[#050505] hover:bg-[#e4e6eb] dark:text-[#e4e6eb] dark:hover:bg-[#3a3b3c]"
            }`}
            title="Heading 1"
          >
            <Heading1 className="h-4 w-4" />
          </button>

          <button
            type="button"
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
            disabled={disabled}
            className={`flex h-8 w-8 items-center justify-center rounded-lg text-xs font-bold transition-colors ${
              editor.isActive("heading", { level: 2 })
                ? "bg-[#1877f2] text-white shadow-xs"
                : "text-[#050505] hover:bg-[#e4e6eb] dark:text-[#e4e6eb] dark:hover:bg-[#3a3b3c]"
            }`}
            title="Heading 2"
          >
            <Heading2 className="h-4 w-4" />
          </button>

          <button
            type="button"
            onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
            disabled={disabled}
            className={`flex h-8 w-8 items-center justify-center rounded-lg text-xs font-bold transition-colors ${
              editor.isActive("heading", { level: 3 })
                ? "bg-[#1877f2] text-white shadow-xs"
                : "text-[#050505] hover:bg-[#e4e6eb] dark:text-[#e4e6eb] dark:hover:bg-[#3a3b3c]"
            }`}
            title="Heading 3"
          >
            <Heading3 className="h-4 w-4" />
          </button>

          <div className="mx-1 h-5 w-[1px] bg-[#ced0d4] dark:bg-[#3a3b3c]" />

          {/* Lists */}
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            disabled={disabled}
            className={`flex h-8 w-8 items-center justify-center rounded-lg text-xs font-semibold transition-colors ${
              editor.isActive("bulletList")
                ? "bg-[#1877f2] text-white shadow-xs"
                : "text-[#050505] hover:bg-[#e4e6eb] dark:text-[#e4e6eb] dark:hover:bg-[#3a3b3c]"
            }`}
            title="Bullet List"
          >
            <List className="h-4 w-4" />
          </button>

          <button
            type="button"
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            disabled={disabled}
            className={`flex h-8 w-8 items-center justify-center rounded-lg text-xs font-semibold transition-colors ${
              editor.isActive("orderedList")
                ? "bg-[#1877f2] text-white shadow-xs"
                : "text-[#050505] hover:bg-[#e4e6eb] dark:text-[#e4e6eb] dark:hover:bg-[#3a3b3c]"
            }`}
            title="Numbered List"
          >
            <ListOrdered className="h-4 w-4" />
          </button>

          <button
            type="button"
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            disabled={disabled}
            className={`flex h-8 w-8 items-center justify-center rounded-lg text-xs font-semibold transition-colors ${
              editor.isActive("blockquote")
                ? "bg-[#1877f2] text-white shadow-xs"
                : "text-[#050505] hover:bg-[#e4e6eb] dark:text-[#e4e6eb] dark:hover:bg-[#3a3b3c]"
            }`}
            title="Blockquote"
          >
            <Quote className="h-4 w-4" />
          </button>

          <button
            type="button"
            onClick={() => editor.chain().focus().toggleCodeBlock().run()}
            disabled={disabled}
            className={`flex h-8 w-8 items-center justify-center rounded-lg text-xs font-semibold transition-colors ${
              editor.isActive("codeBlock")
                ? "bg-[#1877f2] text-white shadow-xs"
                : "text-[#050505] hover:bg-[#e4e6eb] dark:text-[#e4e6eb] dark:hover:bg-[#3a3b3c]"
            }`}
            title="Code Block"
          >
            <Code2 className="h-4 w-4" />
          </button>

          <div className="mx-1 h-5 w-[1px] bg-[#ced0d4] dark:bg-[#3a3b3c]" />

          {/* Links */}
          <button
            type="button"
            onClick={setLink}
            disabled={disabled}
            className={`flex h-8 w-8 items-center justify-center rounded-lg text-xs font-semibold transition-colors ${
              editor.isActive("link")
                ? "bg-[#1877f2] text-white shadow-xs"
                : "text-[#050505] hover:bg-[#e4e6eb] dark:text-[#e4e6eb] dark:hover:bg-[#3a3b3c]"
            }`}
            title="Add Link"
          >
            <LinkIcon className="h-4 w-4" />
          </button>

          {editor.isActive("link") && (
            <button
              type="button"
              onClick={() => editor.chain().focus().unsetLink().run()}
              disabled={disabled}
              className="flex h-8 w-8 items-center justify-center rounded-lg text-xs font-semibold text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40"
              title="Remove Link"
            >
              <Unlink className="h-4 w-4" />
            </button>
          )}

          <button
            type="button"
            onClick={() => editor.chain().focus().setHorizontalRule().run()}
            disabled={disabled}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-xs text-[#050505] hover:bg-[#e4e6eb] dark:text-[#e4e6eb] dark:hover:bg-[#3a3b3c]"
            title="Divider Line"
          >
            <Minus className="h-4 w-4" />
          </button>

          <div className="ml-auto flex items-center gap-1">
            <button
              type="button"
              onClick={() => editor.chain().focus().undo().run()}
              disabled={!editor.can().undo() || disabled}
              className="flex h-8 w-8 items-center justify-center rounded-lg text-xs text-[#65676b] hover:bg-[#e4e6eb] disabled:opacity-30 dark:text-[#b0b3b8] dark:hover:bg-[#3a3b3c]"
              title="Undo (Ctrl+Z)"
            >
              <Undo2 className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => editor.chain().focus().redo().run()}
              disabled={!editor.can().redo() || disabled}
              className="flex h-8 w-8 items-center justify-center rounded-lg text-xs text-[#65676b] hover:bg-[#e4e6eb] disabled:opacity-30 dark:text-[#b0b3b8] dark:hover:bg-[#3a3b3c]"
              title="Redo (Ctrl+Y)"
            >
              <Redo2 className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Editor Editable Area */}
        <div className="p-4 min-h-[180px] max-h-[420px] overflow-y-auto">
          <EditorContent
            editor={editor}
            className="prose prose-sm dark:prose-invert max-w-none focus:outline-none tiptap-content text-[#050505] dark:text-[#e4e6eb]"
          />
        </div>
      </div>

      {error && <p className="text-xs font-medium text-red-500 pl-1">{error}</p>}
    </div>
  );
}

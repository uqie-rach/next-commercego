"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Bold from "@tiptap/extension-bold";
import Italic from "@tiptap/extension-italic";
import Underline from "@tiptap/extension-underline";
import Strike from "@tiptap/extension-strike";
import Highlight from "@tiptap/extension-highlight";
import Code from "@tiptap/extension-code";
import TextAlign from "@tiptap/extension-text-align";
import BulletList from "@tiptap/extension-bullet-list";
import ListItem from "@tiptap/extension-list-item";
import Image from "@tiptap/extension-image";
import "tailwindcss/tailwind.css";
import {
  Bold as BoldIcon,
  Italic as ItalicIcon,
  Underline as UnderlineIcon,
  Strikethrough as StrikeIcon,
  Code as CodeIcon,
  Highlighter as HighlightIcon,
  AlignLeft,
  AlignCenter,
  AlignRight,
  List as BulletListIcon,
  Image as ImageIcon,
  HeadingIcon,
} from "lucide-react";

const Tiptap = () => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Bold,
      Italic,
      Underline,
      Strike,
      Highlight,
      Code,
      BulletList,
      ListItem,
      Image,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
    ],
    content: "<p>Hello World! 🌎️</p>",
  });

  if (!editor) return null;

  const addImage = () => {
    const url = prompt("Enter image URL:");
    if (url) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  };

  return (
    <div className="p-4 w-full mx-auto bg-gray-50 rounded-lg ">
      {/* Toolbar */}
      <div className="flex space-x-2 border-b pb-2 mb-2">
        <button
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`p-2 border rounded flex items-center ${editor.isActive("bold") ? "bg-white" : ""
            }`}
        >
          <BoldIcon size={18} />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`p-2 border rounded flex items-center ${editor.isActive("italic") ? "bg-white" : ""
            }`}
        >
          <ItalicIcon size={18} />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          className={`p-2 border rounded flex items-center ${editor.isActive("underline") ? "bg-white" : ""
            }`}
        >
          <UnderlineIcon size={18} />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleStrike().run()}
          className={`p-2 border rounded flex items-center ${editor.isActive("strike") ? "bg-white" : ""
            }`}
        >
          <StrikeIcon size={18} />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={`p-2 border rounded flex items-center ${editor.isActive("heading", { level: 2 }) ? "bg-white" : ""
            }`}
        >
          <HeadingIcon size={18} />
        </button>

        <ToolbarButton
          editor={editor}
          command="toggleHighlight"
          isActive={editor.isActive("highlight")}
          icon={<HighlightIcon size={18} />}
        />
        <ToolbarButton
          editor={editor}
          command="toggleCode"
          isActive={editor.isActive("code")}
          icon={<CodeIcon size={18} />}
        />

        {/* Bullet List */}
        <ToolbarButton
          editor={editor}
          command="toggleBulletList"
          isActive={editor.isActive("bulletList")}
          icon={<BulletListIcon size={18} />}
        />

        {/* Alignment */}
        <ToolbarButton
          editor={editor}
          command={() => editor.chain().focus().setTextAlign("left").run()}
          isActive={editor.isActive({ textAlign: "left" })}
          icon={<AlignLeft size={18} />}
        />
        <ToolbarButton
          editor={editor}
          command={() => editor.chain().focus().setTextAlign("center").run()}
          isActive={editor.isActive({ textAlign: "center" })}
          icon={<AlignCenter size={18} />}
        />
        <ToolbarButton
          editor={editor}
          command={() => editor.chain().focus().setTextAlign("right").run()}
          isActive={editor.isActive({ textAlign: "right" })}
          icon={<AlignRight size={18} />}
        />

        {/* Image Upload */}
        <button
          onClick={addImage}
          className="p-2 border rounded flex items-center"
        >
          <ImageIcon size={18} />
        </button>
      </div>

      {/* Editor */}
      <div className="border p-2 rounded bg-white min-h-[200px]">
        <EditorContent editor={editor} className="outline-none" />
      </div>
    </div>
  );
};

export default Tiptap;

// Komponen untuk tombol toolbar
const ToolbarButton = ({ editor, command, isActive, icon }: any) => (
  <button
    onClick={() => (typeof command === "string" ? editor.chain().focus()[command]().run() : command())}
    className={`p-2 border rounded flex items-center ${isActive ? "bg-gray-300" : ""
      }`}
  >
    {icon}
  </button>
);

"use client";

import { useCallback, useEffect, useState } from "react";
import { useEditor, EditorContent, Node, mergeAttributes, FloatingMenu } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import Hightlight from "@tiptap/extension-highlight";
import Code from "@tiptap/extension-code";
import { all, createLowlight } from 'lowlight'
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight'
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
  ListOrderedIcon,
  QuoteIcon,
} from "lucide-react";

import { initialContent } from "@/lib/data/initialContent";
import "tailwindcss/tailwind.css";
import "@/styles/tiptap-editor.css"
import Image from "@tiptap/extension-image";


// Lowlight for code block syntax highlighting
const lowlight = createLowlight(all)
const Foo = Node.create({
  name: 'foo',
  group: 'inline',
  inline: true,
  parseHTML() {
    return [
      {
        tag: 'span',
        getAttrs: node => node.hasAttribute('data-foo') && null,
      },
    ]
  },
  renderHTML({ HTMLAttributes }) {
    return ['span', mergeAttributes({ 'data-foo': '', HTMLAttributes }), 'foo']
  },
  renderText() {
    return 'foo'
  },
  addCommands() {
    return {
      insertFoo: () => ({ commands }) => {
        return commands.insertContent({ type: this.name })
      },
    }
  },
})

const Tiptap = () => {
  const [headingLevel, setHeadingLevel] = useState(1);
  const [isEditable, setIsEditable] = useState(true)

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Code,
      Hightlight,
      CodeBlockLowlight.configure({
        lowlight,
      }),
      Foo,
      Image.configure({
        allowBase64: true,
        HTMLAttributes: {
          class: 'mx-auto',
        }
      }),
    ],
    editorProps: {
      attributes: {
        class: "prose prose-sm sm:prose-base lg:prose-lg xl:prose-2xl focus:outline-none min-h-[250px]",
      }
    },
    content: initialContent,
    immediatelyRender: false,
  });

  useEffect(() => {
    if (editor) {
      editor?.setEditable(isEditable)
    }
  }, [isEditable, editor])


  const addImage = useCallback(() => {
    const url = window.prompt('URL')

    if (url) {
      editor?.chain().focus().setImage({ src: url }).run()
    }
  }, [editor])

  if (!editor) return null;

  const saveContent = () => {
    if (editor) {
      console.log(editor.getJSON());
    }
  };

  return (
    <div className="p-4 w-full mx-auto bg-white rounded-lg relative">
      {/* Toolbar */}
      <div className="flex flex-wrap gap-4 pb-2 mb-2 bg-gray-50 rounded-md p-2">
        <ToolbarButton
          command={() => editor.chain().focus().setParagraph().run()}
          editor={editor}
          icon={<p className="text-sm px-1.5 font-bold">P</p>}
          isActive={editor.isActive("paragraph")}
        />

        <ToolbarButton
          command={() => editor.chain().focus().toggleBold().run()}
          editor={editor}
          icon={<BoldIcon size={18} />}
          isActive={editor.isActive("bold")}
        />

        <ToolbarButton
          command={() => editor.chain().focus().toggleItalic().run()}
          editor={editor}
          icon={<ItalicIcon size={18} />}
          isActive={editor.isActive("italic")}
        />

        <ToolbarButton
          command={() => editor.chain().focus().toggleUnderline().run()}
          editor={editor}
          icon={<UnderlineIcon size={18} />}
          isActive={editor.isActive("underline")}
        />

        <ToolbarButton
          command={() => editor.chain().focus().toggleStrike().run()}
          editor={editor}
          icon={<StrikeIcon size={18} />}
          isActive={editor.isActive("strike")}
        />

        <ToolbarButton
          command={() => editor.chain().focus().toggleBlockquote().run()}
          editor={editor}
          icon={<QuoteIcon size={18} />}
          isActive={editor.isActive("blockquote")}
        />

        {/* Toolbar heading */}
        <div className="relative">
          <ToolbarButton className={`p-2`} editor={editor} icon={<HeadingIcon size={18} />} isActive={editor.isActive("heading")} />
          <select
            value={headingLevel}
            onChange={(e) => {
              const level = Number(e.target.value);
              setHeadingLevel(level);
              editor.chain().focus().toggleHeading({ level }).run();
            }}
            className="absolute top-0 left-0 opacity-0 w-full h-full cursor-pointer appearance-none"
          >
            {[1, 2, 3, 4, 5, 6].map((level) => (
              <option key={level} value={level}>
                H{level}
              </option>
            ))}
          </select>
        </div>

        <ToolbarButton
          editor={editor}
          command={() => editor.chain().focus().toggleHighlight().run()}
          isActive={editor.isActive("highlight")}
          icon={<HighlightIcon size={18} />}
        />
        <ToolbarButton
          editor={editor}
          command={() => editor.chain().focus().toggleCode().run()}
          isActive={editor.isActive("code")}
          icon={<CodeIcon size={18} />}
        />

        {/* Bullet List */}
        <ToolbarButton
          editor={editor}
          command={() => editor.chain().focus().toggleBulletList().run()}
          isActive={editor.isActive("bulletList")}
          icon={<BulletListIcon size={18} />}
        />

        {/* Ordered List */}
        <ToolbarButton
          editor={editor}
          command={() => editor.chain().focus().toggleOrderedList().run()}
          isActive={editor.isActive("orderedList")}
          icon={<ListOrderedIcon size={18} />}
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

        {/* Code Block */}
        <ToolbarButton
          editor={editor}
          command={() => editor.chain().focus().toggleCodeBlock().run()}
          isActive={editor.isActive("codeBlock")}
          icon={<CodeIcon size={18} />}
        />

        {/* Image Upload */}
        <ToolbarButton
          editor={editor}
          command={addImage}
          isActive={false}
          icon={<ImageIcon size={18} />}
        />
      </div>

      {/* Editor */}
      <div className="border p-2 rounded bg-white min-h-[200px]">
        <div className="control-group">
          {editor && <FloatingMenu editor={editor} tippyOptions={{ duration: 100 }}>
            <div data-testid="floating-menu" className="floating-menu">
              <ToolbarButton
                command={() => editor.chain().focus().setParagraph().run()}
                editor={editor}
                icon={<p className="text-sm px-1.5 font-bold">P</p>}
                isActive={editor.isActive("paragraph")}
              />

              <ToolbarButton
                command={() => editor.chain().focus().toggleBold().run()}
                editor={editor}
                icon={<BoldIcon size={18} />}
                isActive={editor.isActive("bold")}
              />

              <ToolbarButton
                command={() => editor.chain().focus().toggleItalic().run()}
                editor={editor}
                icon={<ItalicIcon size={18} />}
                isActive={editor.isActive("italic")}
              />

              <ToolbarButton
                command={() => editor.chain().focus().toggleUnderline().run()}
                editor={editor}
                icon={<UnderlineIcon size={18} />}
                isActive={editor.isActive("underline")}
              />

              <ToolbarButton
                command={() => editor.chain().focus().toggleStrike().run()}
                editor={editor}
                icon={<StrikeIcon size={18} />}
                isActive={editor.isActive("strike")}
              />

              <ToolbarButton
                command={() => editor.chain().focus().toggleBlockquote().run()}
                editor={editor}
                icon={<QuoteIcon size={18} />}
                isActive={editor.isActive("blockquote")}
              />

              {/* Toolbar heading */}
              <div className="relative">
                <ToolbarButton className={`p-2`} editor={editor} icon={<HeadingIcon size={18} />} isActive={editor.isActive("heading")} />
                <select
                  value={headingLevel}
                  onChange={(e) => {
                    const level = Number(e.target.value);
                    setHeadingLevel(level);
                    editor.chain().focus().toggleHeading({ level }).run();
                  }}
                  className="absolute top-0 left-0 opacity-0 w-full h-full cursor-pointer appearance-none"
                >
                  {[1, 2, 3, 4, 5, 6].map((level) => (
                    <option key={level} value={level}>
                      H{level}
                    </option>
                  ))}
                </select>
              </div>

              <ToolbarButton
                editor={editor}
                command={() => editor.chain().focus().toggleHighlight().run()}
                isActive={editor.isActive("highlight")}
                icon={<HighlightIcon size={18} />}
              />

              {/* Bullet List */}
              <ToolbarButton
                editor={editor}
                command={() => editor.chain().focus().toggleBulletList().run()}
                isActive={editor.isActive("bulletList")}
                icon={<BulletListIcon size={18} />}
              />

              {/* Ordered List */}
              <ToolbarButton
                editor={editor}
                command={() => editor.chain().focus().toggleOrderedList().run()}
                isActive={editor.isActive("orderedList")}
                icon={<ListOrderedIcon size={18} />}
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
            </div>
          </FloatingMenu>}
        </div>
        <EditorContent editor={editor} />
      </div>

      {/* Save Button */}
      <div className="flex justify-end mt-6">
        <button className="px-6 py-2 rounded-lg bg-brand-100 hover:bg-brand-200 text-base xl:text-lg text-brand-600" onClick={saveContent}>Save</button>
      </div>
    </div>
  );
};

export default Tiptap;

// Komponen untuk tombol toolbar
const ToolbarButton = ({ editor, command, isActive, icon }: any) => (
  <button
    onClick={() => (typeof command === "string" ? editor.chain().focus()[command]().run() : command())}
    className={`p-2 border rounded flex items-center bg-white ${isActive ? "bg-brand-200 text-brand-500" : ""
      }`}
  >
    {icon}
  </button>
);

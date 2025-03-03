"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useEditor, EditorContent, Node, mergeAttributes, FloatingMenu, Editor, Command, JSONContent, HTMLContent, generateHTML } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import Hightlight from "@tiptap/extension-highlight";
import { all, createLowlight } from 'lowlight'
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
  SaveIcon,
  EyeIcon,
  Edit2Icon,
} from "lucide-react";
import Image from "@tiptap/extension-image";

import "tailwindcss/tailwind.css";
import "@/styles/tiptap-editor.css"

import { initialContent } from "@/lib/data/initialContent";
import toast from "react-hot-toast";
import axios from "axios";
import { useUser } from "@/context/UserContext";
import Input from "../form/input/InputField";
import { articleSchema } from "@/lib/validations/article";


// Lowlight for code block syntax highlighting
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
  const [errors, setErrors] = useState<{ title?: string; content?: string }>({});

  const [active, setActive] = useState<'editor' | 'preview'>('editor');
  const [content, setContent] = useState<JSONContent | null>(initialContent);

  const titleRef = useRef<HTMLInputElement>(null);

  const { user } = useUser();

  useEffect(() => {
    toast(`${active === 'editor' ? 'Editor' : 'Preview'} mode`, {
      icon: active === 'editor' ? <Edit2Icon size={18} /> : <EyeIcon size={18} />,
      position: 'bottom-center',
      duration: 2000,
    })
  }, [active])

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Hightlight,
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
    // Load content from local storage
    if (editor && content) {
      editor.commands.setContent(content);
    }
  }, [editor, content]);

  const addImage = useCallback(() => {
    const url = window.prompt('URL')

    if (url) {
      editor?.chain().focus().setImage({ src: url }).run()
    }
  }, [editor])

  if (!editor) return null;

  const saveContent = async () => {
    if (!titleRef?.current?.value) {
      toast.error('Title cannot be empty!');

      // Focus on the title input field
      titleRef.current?.focus();
      return;
    }
    const newArticle = {
      content: JSON.stringify(editor.getJSON()),
      userId: user?.id,
      title: titleRef.current?.value
    };

    const result = articleSchema.safeParse(newArticle);

    console.log(result)
    if (!result.success) {
      const formattedErrors = result.error.format();
      setErrors({
        title: formattedErrors.title?._errors[0],
        content: formattedErrors.content?._errors[0],
      });

      if (formattedErrors.title?._errors[0]) {
        toast.error(formattedErrors.title?._errors[0]);
      }

      if (formattedErrors.content?._errors[0]) {
        toast.error(formattedErrors.content?._errors[0]);
      }

      if (formattedErrors.userId?._errors[0]) {
        toast.error(formattedErrors.userId?._errors[0]);
      } else {
        toast.error('Failed to save content');
      }

      return;
    }

    const saveArticle = async () => {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/api/articles`, result.data)

      return response;
    }

    toast.promise(
      saveArticle(),
      {
        loading: 'Saving...',
        success: (res) => `Content saved successfully, ${res.data.title}`,
        error: (err) => `Failed to save content, ${err.message}`,
      });
  };

  const handlePreviewMode = () => {
    setContent(editor.getJSON());
    setActive('preview');
    console.log('preview mode')
  }

  const handleEditorMode = () => {
    saveContentToLocalStorage();
    setContent(editor.getJSON());
    setActive('editor');

    console.log('editor mode')
  }

  const saveContentToLocalStorage = () => {
    if (editor) {
      localStorage.setItem('content', JSON.stringify(editor.getJSON()));
    }
  }

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value;

    if (titleRef.current)
      titleRef.current.value = title;

  }

  const previewHTML = content ? generateHTML(content, [
    StarterKit,
    Underline,
    TextAlign.configure({
      types: ['heading', 'paragraph'],
    }),
    Hightlight,
    Foo,
    Image.configure({
      allowBase64: true,
      HTMLAttributes: {
        class: 'mx-auto',
      }
    }),
  ]) : '';


  return (
    <div className="p-4 w-full mx-auto bg-white dark:bg-gray-900 rounded-lg relative">

      {
        active === 'editor' ? (
          <>
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
                <ToolbarButton editor={editor} icon={<HeadingIcon size={18} />} isActive={editor.isActive("heading")} />
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

            <div className="my-4 space-y-2">
              <label htmlFor="title" className="text-sm lg:text-lg font-semibold text-gray-800 dark:text-gray-200">Title</label>
              <Input type="text" placeholder="Enter the title here..." className="w-full p-2 bg-white rounded-md mb-4" ref={titleRef} onChange={handleTitleChange} />
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
                      <ToolbarButton editor={editor} icon={<HeadingIcon size={18} />} isActive={editor.isActive("heading")} />
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
          </>
        ) : (
          <div className="p-2 bg-white min-h-[200px] mt-4">
            <div className="prose prose-sm sm:prose-base lg:prose-lg xl:prose-2xl tiptap">
              <div key={active} dangerouslySetInnerHTML={{ __html: previewHTML }}></div>
            </div>
          </div>
        )}

      {/* Save Button */}
      <div className="flex justify-end mt-6 gap-5">
        <button className="flex items-center px-6 py-2 rounded-lg bg-brand-100 hover:bg-brand-200 text-base xl:text-lg text-brand-600" onClick={saveContent}>
          <SaveIcon size={18} className="mr-2" />
          Save
        </button>
        {
          active === 'editor' &&
          <button className="flex items-center px-6 py-2 rounded-lg bg-white hover:bg-gray-100 text-base xl:text-lg text-gray-700" onClick={handlePreviewMode}>
            <EyeIcon size={18} className="mr-2" />
            Preview
          </button> ||
          <button className="flex items-center px-6 py-2 rounded-lg bg-white hover:bg-gray-100 text-base xl:text-lg text-gray-700" onClick={handleEditorMode}>
            <Edit2Icon size={18} className="mr-2" />
            Edit
          </button>
        }
      </div>
    </div>
  );
};

export default Tiptap;

interface ToolbarButtonProps {
  editor: Editor | null;
  command: Command;
  isActive: boolean;
  icon: React.ReactNode;
};

// Komponen untuk tombol toolbar
const ToolbarButton = ({ editor, command, isActive, icon }: ToolbarButtonProps) => (
  <button
    onClick={() => (typeof command === "string" ? editor.chain().focus()[command]().run() : command())}
    className={`p-2 border rounded flex items-center bg-white ${isActive ? "bg-brand-200 text-brand-500" : ""
      }`}
  >
    {icon}
  </button>
);

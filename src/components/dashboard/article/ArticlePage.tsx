'use client'

import QuillEditor from "@/components/quill/QuillEditor"
import Tiptap from "@/components/tiptap/Tiptap"
// import Tiptap from "@/components/tiptap/Tiptap"
import { ChevronLeftIcon } from "@/icons"
import Link from "next/link"
import { useState } from "react"

export default function ArticlePage() {
  const [richText, setRichText] = useState(`
        descripte   ddd
        <p>This is a basic example of implementing images. Drag to re-order.</p>
        <img src="https://placehold.co/800x400" />
        <img src="https://placehold.co/800x400/6A00F5/white" />
        <p>
          The focus extension adds a class to the focused node only. That enables you to add a custom styling to just that node. By default, it’ll add <code>.has-focus</code>, even to nested nodes.
        </p>
        <ul>
          <li>Nested elements (like this list item) will be focused with the default setting of <code>mode: all</code>.</li>
          <li>Otherwise the whole list will get the focus class, even when just a single list item is selected.</li>
        </ul>

        <p>
          That’s a boring paragraph followed by a fenced code block:
        </p>
        <pre><code>for (var i=1; i <= 20; i++)
        {
        if (i % 15 == 0)
        console.log("FizzBuzz");
        else if (i % 3 == 0)
        console.log("Fizz");
        else if (i % 5 == 0)
        console.log("Buzz");
        else
        console.log(i);
        }</code></pre>
        <p>
          Press Command/Ctrl + Enter to leave the fenced code block and continue typing in boring paragraphs.
        </p>
  `)

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
      <div className="flex items-center justify-between mb-5 lg:mb-7">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
          Profile
        </h3>
        <div className="">
          <Link
            href="/"
            className="inline-flex items-center text-sm text-gray-500 transition-colors hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
          >
            <ChevronLeftIcon />
            Back to dashboard
          </Link>
        </div>
      </div>

      {/* Page Content */}
      <div className="flex flex-col flex-1">
        <h1 className="text-2xl font-bold mb-4">Write an Article</h1>
        <Tiptap />
      </div>
    </div>
  )
}

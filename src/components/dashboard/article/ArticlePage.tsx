'use client'

import { ChevronLeftIcon } from "@/icons"
import Link from "next/link"

import Tiptap from "@/components/tiptap/Tiptap"

export default function ArticlePage() {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6 overflow-x-hidden">
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

      {/* Tiptap editor */}
      <div className="flex flex-col flex-1">
        <h1 className="text-2xl font-bold mb-4">Write an Article</h1>
        <Tiptap />
      </div>
    </div>
  )
}

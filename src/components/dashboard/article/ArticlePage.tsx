'use client'

import { ChevronLeftIcon } from "@/icons"
import Link from "next/link"
import { useEffect, useState } from "react"
import toast from "react-hot-toast"
import axios from "axios"

import Tiptap from "@/components/tiptap/Tiptap"
import Articles from "@/components/dashboard/article/Articles"
import { Article } from "@/types/entities"
import { useUser } from "@/context/UserContext"

export default function ArticlePage() {
  const [page, setPage] = useState<'view' | 'edit'>('view');
  const [articles, setArticles] = useState<Article[]>([]);

  const { user } = useUser();

  useEffect(() => {
    fetchArticles(user?.id as string);
  }, [user?.id]);


  async function fetchArticles(userId: string) {
    try {
      async function get() {
        const res = await fetch(`/api/articles`, {
          cache: 'no-cache',
        });

        const data = await res.json();
        console.log(data.data)
        setArticles(data.data);

        return data;
      }
      // Show loading toast while fetching

      toast.promise(get, {
        loading: 'Fetching articles...',
        success: 'Articles fetched successfully',
        error: (error) => error
      });
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      }

      if (error instanceof axios.AxiosError) {
        toast.error(error.response?.data.message);
      }
    }
  }

  return (
    <>
      <div className="flex items-center justify-between mb-5 lg:mb-7">
        <h1 className="text-lg font-semibold text-gray-800 dark:text-white/90">
          Article
        </h1>
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

      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6 overflow-x-hidden">
        {/* Tiptap editor */}
        <div className="gap-3 flex items-center justify-between mb-5 bg-brand-25 dark:bg-gray-800 p-1.5 rounded-lg w-fit">
          <button
            className={`px-4 py-2 rounded-lg focus:outline-none ${page === 'view' ? 'bg-brand-500 text-white transition-all shadow-md shadow-brand-300 dark:shadow-brand-700 dark:bg-brand-600' : 'bg-gray-100 dark:bg-gray-800 dark:text-gray-400'}`}
            onClick={() => setPage('view')}
          >
            My Articles
          </button>
          <button
            className={`px-4 py-2 rounded-lg focus:outline-none ${page === 'edit' ? 'bg-brand-500 text-white transition-all shadow-md shadow-brand-300 dark:shadow-brand-700 dark:bg-brand-600' : 'bg-gray-100 dark:bg-gray-800 dark:text-gray-400'}`}
            onClick={() => setPage('edit')}
          >
            Edit/Create
          </button>
        </div>


        {
          page === 'view' ? (
            <Articles articles={articles} />
          ) : (
            <Tiptap />
          )
        }
      </div>
    </>
  )
}

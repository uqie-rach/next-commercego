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
        const res = await axios.get(`/api/articles`, {
          params: { userId }
        });

        setArticles(res.data.data);

        return res.data;
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

// const articles: Article[] = [
//   {
//     id: 1,
//     title: "Lorem ipsum dolor sit amet",
//     content: "",
//     userId: 1,
//     createdAt: "2021-09-01T00:00:00.000Z",
//   },
//   {
//     id: 2,
//     title: "Consectetur adipiscing elit",
//     content: "",
//     userId: 1,
//     createdAt: "2021-09-01T00:00:00.000Z",
//   },
//   {
//     id: 3,
//     title: "Sed do eiusmod tempor incididunt",
//     content: "",
//     userId: 1,
//     createdAt: "2021-09-01T00:00:00.000Z",
//   },
//   {
//     id: 4,
//     title: "Ut labore et dolore magna aliqua",
//     content: "",
//     userId: 1,
//     createdAt: "2021-09-01T00:00:00.000Z",
//   },
//   {
//     id: 5,
//     title: "Ut enim ad minim veniam",
//     content: "",
//     userId: 1,
//     createdAt: "2021-09-01T00:00:00.000Z",
//   },
//   {
//     id: 6,
//     title: "Quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat",
//     content: "",
//     userId: 1,
//     createdAt: "2021-09-01T00:00:00.000Z",
//   },
//   {
//     id: 7,
//     title: "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur",
//     content: "",
//     userId: 1,
//     createdAt: "2021-09-01T00:00:00.000Z",
//   },
//   {
//     id: 8,
//     title: "Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum",
//     content: "",
//     userId: 1,
//     createdAt: "2021-09-01T00:00:00.000Z",
//   }
// ]

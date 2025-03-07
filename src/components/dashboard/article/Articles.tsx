'use client'

import { Article as IArticle } from "@/types/entities"
import { useEffect } from "react"
import Article from "./Article"

export default function Articles({ articles }: { articles: IArticle[] | [] }) {

  useEffect(() => {
    console.log(articles)
  }, [articles])

  if (!articles.length)
    return (
      <div className="flex items-center justify-center h-96">
        <p className="text-lg text-gray-500 dark:text-gray-400">No articles found</p>
      </div>
    )
  return (
    <div className="overflow-x-hidden space-y-3">
      {
        articles?.map((article: IArticle) => {
          // Make sure createdAt exists before creating a Date
          if (article.createdAt) {
            const date = new Date(article.createdAt)
            article.createdAt = date.toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })
          }

          return (
            <Article key={article.id} data={article} />
          )
        })
      }
    </div>
  )
}

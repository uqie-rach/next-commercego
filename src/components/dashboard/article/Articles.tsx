'use client'

import Button from "@/components/ui/button/Button"
import { Article } from "@/types/entities"
import { Edit3Icon, EyeIcon } from "lucide-react"
import { useEffect } from "react"

export default function Articles({ articles }: { articles: Article[] | [] }) {

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
        articles?.map((article: Article) => {
          // Make sure createdAt exists before creating a Date
          if (article.createdAt) {
            const date = new Date(article.createdAt)
            article.createdAt = date.toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })
          }

          return (
            <div key={article.id} className="flex items-center gap-4 justify-between py-3 px-4 border bg-gray-50 rounded-lg border-brand-100 hover:border-brand-400 transition-colors dark:border-gray-700">
              <div className="flex items-center gap-3">
                <div>
                  <h2 className="text-lg font-semibold text-gray-800 dark:text-white/90">{article.title}</h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{article.createdAt}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Button variant="outline" startIcon={<Edit3Icon size={20} />} size="sm">
                  {null}
                </Button>
                <Button variant="outline" startIcon={<EyeIcon size={20} />} size="sm">
                  {null}
                </Button>
              </div>
            </div>
          )
        })
      }
    </div>
  )
}

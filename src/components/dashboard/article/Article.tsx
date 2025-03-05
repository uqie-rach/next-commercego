'use client'

import Button from "@/components/ui/button/Button"
import { Article as IArticle } from "@/types/entities"
import { Edit3Icon, EyeIcon, Trash2 } from "lucide-react"
import { useRouter } from "next/navigation"

export default function Article({ data }: { data: IArticle }) {
  const router = useRouter();

  async function deleteArticle() {
  }

  function editArticle() {
    localStorage.setItem('article', JSON.stringify(data));
    router.push(`/dashboard/article/${data?.id}/edit`);
  }

  function viewArticle() {

  }


  return (
    <div className="flex items-center gap-4 justify-between py-3 px-4">
      <div className="flex items-center gap-3">
        <div>
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white/90">{data.title}</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">{data.createdAt}</p>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <Button variant="primary" startIcon={<Edit3Icon size={20} color="black" />} size="sm" onClick={editArticle} className="bg-white hover:bg-brand-100">
          {null}
        </Button>
        <Button variant="primary" startIcon={<EyeIcon size={20} color="black" />} size="sm" onClick={viewArticle} className="bg-white hover:bg-brand-100">
          {null}
        </Button>
        <Button variant="primary" startIcon={<Trash2 size={20} color="red" />} size="sm" onClick={deleteArticle} className="bg-white hover:bg-red-100">
          {null}
        </Button>
      </div>
    </div>
  )
}

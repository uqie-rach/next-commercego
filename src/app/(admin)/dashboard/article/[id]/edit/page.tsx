import EditArticle from "@/components/tiptap/EditArticle";

export default async function EditArticlePage({ params }) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6 overflow-x-hidden">
      {/* Tiptap editor */}
      <EditArticle />
    </div>
  )
}

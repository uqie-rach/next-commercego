
import { getServerSession } from "next-auth"

import { authOptions } from "@/lib/auth"
import ArticlePage from "@/components/dashboard/article/ArticlePage";
import { redirect } from "next/navigation";

export default async function Article() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/signin");
    return;
  }

  return (
    <ArticlePage />
  )
}


import { getServerSession } from "next-auth"

import { authOptions } from "@/lib/auth"
import roleAuthenticator from "@/lib/role";
import ArticlePage from "@/components/dashboard/article/ArticlePage";
import { redirect } from "next/navigation";

export default async function Article() {
  const session = await getServerSession(authOptions);
  const isCoreTeamMember = await roleAuthenticator(session!);

  if (isCoreTeamMember) {
    return (
      <ArticlePage />
    )
  } else {
    return redirect(new URL('/dashboard', process.env.NEXT_PUBLIC_BASE_URL).toString());
  }
}

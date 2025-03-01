import TransitionPage from "@/components/auth/TransitionPage";
import { getServerSession } from "next-auth"
import { notFound } from "next/navigation";

export default async function Welcome() {
  const session = await getServerSession();

  if (!session) notFound();

  return (
    <div>
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
        <div className="p-8 bg-white rounded-lg shadow-md">
          {session && <TransitionPage userData={session?.user} />}
        </div>
      </div>
    </div>
  )
}

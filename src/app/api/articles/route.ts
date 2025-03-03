import { prisma } from "@/lib/mongo/db";
import { type NextRequest, NextResponse } from "next/server";

// 🚀 GET: Ambil semua artikel
export async function GET(req: NextRequest) {
  const userId = req.nextUrl.searchParams.get('userId')
  console.log('[server] hehe', userId)

  try {
    const articles = await prisma.article.findMany({
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            // Exclude password
          }
        }
      },
      where: userId ? { userId: userId as string } : {},
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ success: true, data: articles });
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
  }
}
// 🚀 POST: Buat artikel baru
export async function POST(req: Request) {
  try {
    const { title, content, userId } = await req.json();
    if (!title || !content || !userId) {
      return NextResponse.json({ success: false, message: "Missing required fields" }, { status: 400 });
    }

    const newArticle = await prisma.article.create({
      data: { title, content, userId },
    });

    return NextResponse.json({ success: true, data: newArticle }, { status: 201 });
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
  }
}

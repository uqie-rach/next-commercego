import { prisma } from "@/lib/mongo/db";
import { NextResponse } from "next/server";

// 🚀 GET: Ambil artikel berdasarkan ID
export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const article = await prisma.article.findUnique({
      where: { id: params.id },
      include: {
        user: {
          select: { name: true, email: true, id: true },
        }
      },
    });

    if (!article) {
      return NextResponse.json({ success: false, message: "Article not found" }, { status: 404 });
    }

    console.log('from request header ', req?.headers?.get('userId'))
    if (article?.userId !== req?.headers?.get('userId'))
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });

    return NextResponse.json({ success: true, data: article });
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
  }
}

// 🚀 PUT: Update artikel berdasarkan ID
export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const { title, content } = await req.json();

    console.log('[PUT] title:', title);
    console.log('[PUT] content:', content);

    const updatedArticle = await prisma.article.update({
      where: { id: params.id },
      data: { title, content },
    });

    return NextResponse.json({ success: true, data: updatedArticle });
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
  }
}


// 🚀 DELETE: Hapus artikel berdasarkan ID
export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    await prisma.article.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ success: true, message: "Article deleted" });
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
  }
}

import { prisma } from "@/lib/mongo/db";
import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

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
export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    // Ambil session dari request
    const token = await getToken({ req });

    // Jika tidak ada token, tolak akses
    if (!token) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    // Ambil userId dari token
    const userId = token.sub; // `sub` adalah userId dari session

    // Cek apakah artikel yang akan dihapus ada
    const article = await prisma.article.findUnique({
      where: { id: params.id },
    });

    if (!article) {
      return NextResponse.json({ success: false, message: "Article not found" }, { status: 404 });
    }

    // Cek apakah user yang login adalah pemilik artikel
    if (article.userId !== userId) {
      return NextResponse.json({ success: false, message: "Forbidden: You are not the owner of this article" }, { status: 403 });
    }

    const { title, content } = await req.json();

    await prisma.article.update({
      where: { id: params.id },
      data: { title, content },
    });

    return NextResponse.json({ success: true, data: 'Updated' });
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
  }
}


export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    // Ambil session dari request
    const token = await getToken({ req });

    // Jika tidak ada token, tolak akses
    if (!token) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    // Ambil userId dari token
    const userId = token.sub; // `sub` adalah userId dari session

    // Cek apakah artikel yang akan dihapus ada
    const article = await prisma.article.findUnique({
      where: { id: params.id },
    });

    if (!article) {
      return NextResponse.json({ success: false, message: "Article not found" }, { status: 404 });
    }

    // Cek apakah user yang login adalah pemilik artikel
    if (article.userId !== userId) {
      return NextResponse.json({ success: false, message: "Forbidden: You are not the owner of this article" }, { status: 403 });
    }

    // Hapus artikel jika user adalah pemilik
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

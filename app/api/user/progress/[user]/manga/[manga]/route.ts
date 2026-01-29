import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ user: string; manga: string }> },
) {
  try {
    const { searchParams } = new URL(req.url);
    const chapter = searchParams.get("chapter");
    const { user, manga } = await params;

    if (!user || !manga) {
      return NextResponse.json(
        { error: "User and Manga ID are required" },
        { status: 400 },
      );
    }

    const userExist = await prisma.user.findUnique({ where: { id: user } });
    if (!userExist) {
      return NextResponse.json(
        { error: "User does not exist" },
        { status: 404 },
      );
    }

    const uniqueFilter = {
      userId_mangaId: {
        userId: user,
        mangaId: manga,
      },
    };

    if (chapter) {
      const progress = await prisma.readingProgress.upsert({
        where: uniqueFilter,
        update: { chapterNum: Number(chapter) },
        create: {
          userId: user,
          mangaId: manga,
          chapterNum: Number(chapter),
        },
      });

      return NextResponse.json({ progress, action: "upserted" });
    } else {
      const progress = await prisma.readingProgress.findUnique({
        where: uniqueFilter,
      });

      if (!progress) {
        return NextResponse.json(
          { message: "No progress found" },
          { status: 404 },
        );
      }

      return NextResponse.json({ progress, action: "selected" });
    }
  } catch (error) {
    console.error("Database Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}

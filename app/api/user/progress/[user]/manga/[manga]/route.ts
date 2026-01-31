import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ user: string; manga: string }> },
) {
  try {
    const { user, manga } = await params;

    if (!user || !manga) {
      return NextResponse.json(
        { error: "User and Manga ID are required" },
        { status: 400 },
      );
    }

    const progress = await prisma.readingProgress.findUnique({
      where: {
        userId_mangaId: {
          userId: user,
          mangaId: manga,
        },
      },
    });

    if (!progress) {
      return NextResponse.json(
        { message: "No progress found" },
        { status: 404 },
      );
    }

    return NextResponse.json(progress);
  } catch (error) {
    console.error("Database Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}

export async function POST(
  req: Request,
  { params }: { params: Promise<{ user: string; manga: string }> },
) {
  try {
    const { user, manga } = await params;
    const body = await req.json();

    const { chapter, chapterId } = body;

    if (!user || !manga || (!chapter && !chapterId)) {
      return NextResponse.json(
        { error: "User, Manga ID and chapter or chapterId are required" },
        { status: 400 },
      );
    }

    const userExist = await prisma.user.findUnique({
      where: { id: user },
    });

    if (!userExist) {
      return NextResponse.json(
        { error: "User does not exist" },
        { status: 404 },
      );
    }

    const progress = await prisma.readingProgress.upsert({
      where: {
        userId_mangaId: {
          userId: user,
          mangaId: manga,
        },
      },
      update: {
        chapterNum: chapter != null ? Number(chapter) : undefined,
        chapterId: chapterId ?? undefined,
      },
      create: {
        userId: user,
        mangaId: manga,
        chapterNum: chapter != null ? Number(chapter) : undefined,
        chapterId: chapterId ?? null,
      },
    });

    return NextResponse.json(progress, { status: 201 });
  } catch (error) {
    console.error("Database Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}

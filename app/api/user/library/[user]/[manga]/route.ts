import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ user: string; manga: string }> },
) {
  try {
    const { user, manga } = await params;

    if (!user) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 },
      );
    }

    const userExist = await prisma.user.findUnique({
      where: { id: user },
      select: { id: true },
    });

    if (!userExist) {
      return NextResponse.json(
        { error: "User does not exist" },
        { status: 404 },
      );
    }

    const library = await prisma.library.findUnique({
      where: {
        userId_mangaId: {
          userId: user,
          mangaId: manga,
        },
      },
    });

    return NextResponse.json(library ? true : false, { status: 200 });
  } catch {
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

    if (!user || !manga) {
      return NextResponse.json(
        { error: "User and Manga ID are required" },
        { status: 400 },
      );
    }

    const entry = await prisma.library.upsert({
      where: {
        userId_mangaId: {
          userId: user,
          mangaId: manga,
        },
      },
      update: {},
      create: {
        userId: user,
        mangaId: manga,
      },
    });

    return NextResponse.json(entry, { status: 201 });
  } catch (error) {
    console.error("POST_LIBRARY_ERROR:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ user: string; manga: string }> },
) {
  const { user, manga } = await params;

  if (!user || !manga) {
    return NextResponse.json(
      { error: "User ID and Manga ID are required" },
      { status: 400 },
    );
  }

  await prisma.library.delete({
    where: {
      userId_mangaId: {
        userId: user,
        mangaId: manga,
      },
    },
  });

  return NextResponse.json(
    { message: "Removed from library" },
    { status: 200 },
  );
}

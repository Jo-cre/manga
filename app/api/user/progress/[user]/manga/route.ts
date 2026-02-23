import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ user: string }> },
) {
  try {
    const { user } = await params;

    if (!user) {
      return NextResponse.json(
        { error: "User is Id required" },
        { status: 400 },
      );
    }

    const progress = await prisma.readingProgress.findMany({
      where: { userId: user },
    });

    if (!progress || progress.length === 0) {
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

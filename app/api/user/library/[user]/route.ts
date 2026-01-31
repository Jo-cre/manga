import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ user: string }> },
) {
  try {
    const { user: userId } = await params;

    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 },
      );
    }

    const userExist = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true },
    });

    if (!userExist) {
      return NextResponse.json(
        { error: "User does not exist" },
        { status: 404 },
      );
    }

    return NextResponse.json(
      await prisma.library.findMany({
        where: { userId: userId },
      }),
      { status: 200 },
    );
  } catch (error) {
    console.error("GET_LIBRARY_ERROR:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}

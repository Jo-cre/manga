import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const email = searchParams.get("email");
  const id = searchParams.get("id");

  if (!email && !id) {
    return NextResponse.json(
      { error: "Email or id is required" },
      { status: 400 }
    );
  }

  let user = null;
  if (email) {
    user = await prisma.user.findUnique({ where: { email } });
  } else if (id) {
    user = await prisma.user.findUnique({ where: { id } });
  }

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  return NextResponse.json(user);
}

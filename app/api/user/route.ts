import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";

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

export async function PATCH(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();

  const data: {
    name?: string;
    image?: string | null;
    banner?: string | null;
  } = {};

  if (typeof body.name === "string") data.name = body.name;
  if ("image" in body) data.image = body.image;
  if ("banner" in body) data.banner = body.banner;

  if (Object.keys(data).length === 0) {
    return NextResponse.json({ error: "Nothing to update" }, { status: 400 });
  }

  const updatedUser = await prisma.user.update({
    where: { id: session.user.id },
    data,
    select: {
      id: true,
      name: true,
      image: true,
      banner: true,
      role: true,
      createdAt: true,
      email: true,
    },
  });

  return NextResponse.json(updatedUser);
}

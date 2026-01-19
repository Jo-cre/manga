import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ chapter: string }> },
) {
  const { chapter } = await params;

  if (!chapter) {
    return new Response("Chapter ID is required", { status: 400 });
  }

  const url = `https://api.mangadex.org/at-home/server/${chapter}`;

  return fetch(url)
    .then((res) => res.json())
    .then((data) => NextResponse.json(data))
    .catch(() =>
      NextResponse.json(
        { error: "Failed to fetch chapter pages data" },
        { status: 500 },
      ),
    );
}

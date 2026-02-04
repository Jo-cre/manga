import { NextResponse } from "next/server";
import { MangaDexSingleResponse, MangaChapter } from "@/lib/manga/types";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ chapter: string }> },
) {
  const { chapter } = await params;

  if (!chapter) {
    return NextResponse.json(
      { error: "Chapter ID is required" },
      { status: 400 },
    );
  }

  const res = await fetch(`https://api.mangadex.org/chapter/${chapter}`);

  if (!res.ok) {
    return NextResponse.json(
      { error: "Failed to fetch chapter" },
      { status: res.status },
    );
  }

  const json = (await res.json()) as MangaDexSingleResponse<MangaChapter>;

  return NextResponse.json(json.data);
}

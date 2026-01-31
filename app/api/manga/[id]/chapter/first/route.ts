import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const { searchParams } = new URL(req.url);
  const lang = searchParams.get("lang");

  if (!lang) {
    return NextResponse.json({ error: "lang required" }, { status: 400 });
  }

  const url = new URL("https://api.mangadex.org/chapter");
  url.searchParams.set("manga", id);
  url.searchParams.set("translatedLanguage[]", lang);
  url.searchParams.set("limit", "1");
  url.searchParams.set("order[chapter]", "asc");
  url.searchParams.set("order[createdAt]", "asc");

  const res = await fetch(url.toString());

  if (!res.ok) {
    return NextResponse.json(
      { error: "Failed to fetch chapters" },
      { status: res.status },
    );
  }

  const json = await res.json();
  const first = json?.data?.[0];

  return NextResponse.json({
    chapterId: first?.id ?? null,
    chapter: first?.attributes?.chapter
      ? Number(first.attributes.chapter)
      : null,
  });
}

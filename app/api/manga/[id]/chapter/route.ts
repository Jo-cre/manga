import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { searchParams } = new URL(req.url);
  const { id } = await params;
  const lang = searchParams.get("lang");
  const volume = searchParams.get("volume");

  if (!id) {
    return new Response("Manga ID is required", { status: 400 });
  }

  const url = `https://api.mangadex.org/chapter?manga=${encodeURIComponent(
    id
  )}${lang ? `&translatedLanguage[]=${lang}` : ""}${
    volume ? `&volume[]=${volume}` : ""
  }&limit=100`;

  return fetch(url)
    .then((res) => res.json())
    .then((data) => NextResponse.json(data.data))
    .catch(() =>
      NextResponse.json(
        { error: "Failed to fetch manga feed data" },
        { status: 500 }
      )
    );
}

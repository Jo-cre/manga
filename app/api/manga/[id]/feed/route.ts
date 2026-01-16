import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { searchParams } = new URL(req.url);
  const lang = searchParams.get("lang");
  const limit = searchParams.get("limit");
  const offset = searchParams.get("offset");
  const { id } = await params;

  if (!id) {
    return NextResponse.json(
      { error: "Manga ID is required" },
      { status: 400 }
    );
  }

  const queryParams = new URLSearchParams();
  if (lang) queryParams.append("translatedLanguage[]", lang);
  if (limit) queryParams.append("limit", limit);
  if (offset) queryParams.append("offset", offset);

  const queryString = queryParams.toString();
  const url = `https://api.mangadex.org/manga/${encodeURIComponent(id)}/feed${
    queryString ? `?${queryString}` : ""
  }`;

  return fetch(url)
    .then((res) => res.json())
    .then((data) => NextResponse.json(data))
    .catch(() =>
      NextResponse.json(
        { error: "Failed to fetch manga feed data" },
        { status: 500 }
      )
    );
}

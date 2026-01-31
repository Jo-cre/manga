import {
  MangaDexListResponse,
  MangaDexManga,
  MangaDexSingleResponse,
} from "@/lib/manga/types";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { searchParams } = new URL(req.url);
    const { id } = await params;

    const limit = searchParams.get("limit") ?? "5";
    const isSearchByText = searchParams.get("text") === "true";

    const baseUrl = "https://api.mangadex.org/manga";

    const url = isSearchByText
      ? `${baseUrl}?title=${encodeURIComponent(id)}&limit=${limit}&includes[]=cover_art`
      : `${baseUrl}/${id}?includes[]=cover_art`;

    const res = await fetch(url);

    if (!res.ok) {
      return NextResponse.json(
        { error: "Failed to fetch from MangaDex" },
        { status: res.status },
      );
    }

    const json = await res.json();

    const rawData = isSearchByText
      ? (json as MangaDexListResponse<MangaDexManga>).data
      : [(json as MangaDexSingleResponse<MangaDexManga>).data];

    const data = rawData.map((m) => {
      const coverRel = m.relationships.find((r) => r.type === "cover_art");
      const fileName = coverRel?.attributes?.fileName;

      return {
        id: m.id,
        title:
          m.attributes.title.en ??
          m.attributes.title["ja-ro"] ??
          m.attributes.altTitles.find((t) => t["ja-ro"])?.["ja-ro"] ??
          m.attributes.altTitles.find((t) => t.en)?.en ??
          "No Title available",

        cover: fileName
          ? `https://uploads.mangadex.org/covers/${m.id}/${fileName}.256.jpg`
          : null,

        status: m.attributes.status,
      };
    });

    return NextResponse.json(isSearchByText ? data : data[0]);
  } catch (error) {
    console.error("MANGADEX_ROUTE_ERROR:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}

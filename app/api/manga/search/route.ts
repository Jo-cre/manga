import { MangaDexListResponse, MangaDexManga } from "@/lib/manga/types";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  const text = searchParams.get("text");
  const limit = searchParams.get("limit");

  const res = await fetch(
    `https://api.mangadex.org/manga?title=${encodeURIComponent(text ?? "")}
    &limit=${encodeURIComponent(limit ?? "5")}&includes[]=cover_art`
  );

  const json: MangaDexListResponse<MangaDexManga> = await res.json();

  const data = json.data.map((m) => {
    const coverRel = m.relationships.find((r) => r.type === "cover_art");

    const fileName = coverRel?.attributes?.fileName;

    return {
      id: m.id,
      title:
        m.attributes.title.en ??
        m.attributes.title["ja-ro"] ??
        m.attributes.altTitles.find((t) => t["ja-ro"])?.["ja-ro"] ??
        m.attributes.altTitles.find((t) => t.en)?.en ??
        "No Title avaliable",

      cover: fileName
        ? `https://uploads.mangadex.org/covers/${m.id}/${fileName}.256.jpg`
        : null,

      status: m.attributes.status,
    };
  });

  return NextResponse.json(data);
}

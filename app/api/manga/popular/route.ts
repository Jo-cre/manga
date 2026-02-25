import { MangaAttributes, MangaDexManga } from "@/lib/manga/types";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const res = await fetch(
      "https://api.mangadex.org/manga?limit=10&order[followedCount]=desc&includes[]=cover_art",
    );

    if (!res.ok) {
      throw new Error("Failed request");
    }

    const data = await res.json();

    if (Array.isArray(data.data)) {
      data.data.forEach((manga: MangaDexManga) => {
        const coverRel = manga.relationships?.find(
          (rel) => rel.type === "cover_art",
        );

        if (coverRel?.attributes?.fileName && manga.id) {
          const coverUrl = `https://uploads.mangadex.org/covers/${manga.id}/${coverRel.attributes.fileName}`;

          if (!manga.attributes) {
            manga.attributes = {} as MangaAttributes;
          }

          if (!manga.attributes.links) {
            manga.attributes.links = {} as MangaAttributes["links"];
          }

          manga.attributes.links.cover = coverUrl;
        }
      });
    }

    return NextResponse.json(data);
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch manga data" },
      { status: 500 },
    );
  }
}

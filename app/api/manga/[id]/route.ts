import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  if (!id) {
    return NextResponse.json(
      { error: "Manga ID is required" },
      { status: 400 }
    );
  }

  return fetch(`https://api.mangadex.org/manga/${id}?includes[]=cover_art`)
    .then((res) => res.json())
    .then((data) => {
      if (data.data?.relationships) {
        const coverArt = data.data.relationships.find(
          (rel: { type: string }) => rel.type === "cover_art"
        );
        if (coverArt?.id) {
          data.data.attributes.links.cover = `https://uploads.mangadex.org/covers/${id}/${coverArt.attributes.fileName}`;
        }
      }
      return NextResponse.json(data);
    })
    .catch(() =>
      NextResponse.json(
        { error: "Failed to fetch manga data" },
        { status: 500 }
      )
    );
}

import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  if (!id) {
    return NextResponse.json(
      { error: "Manga ID is required" },
      { status: 400 },
    );
  }

  return fetch(`https://api.mangadex.org/group/${id}`)
    .then((res) => res.json())
    .then((data) => {
      return NextResponse.json(data);
    })
    .catch(() =>
      NextResponse.json(
        { error: "Failed to fetch manga data" },
        { status: 500 },
      ),
    );
}

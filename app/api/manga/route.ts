import { NextResponse } from "next/server";
import { searchMangas } from "@/manga/services/searchManga";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  const text = searchParams.get("text");
  const adaptersParam = searchParams.get("adapters");

  if (!text || text.length < 2) {
    return NextResponse.json([]);
  }

  const activeAdapters = adaptersParam ? adaptersParam.split(",") : [];

  const results = await searchMangas(text, activeAdapters);

  return NextResponse.json(results);
}

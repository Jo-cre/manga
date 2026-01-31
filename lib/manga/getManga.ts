"use server";
import { Manga, MangaSearchResult } from "./types";

export async function getManga(id: string): Promise<Manga | null> {
  const res = await fetch(`${process.env.API_URL}/api/manga/${id}`, {
    next: { revalidate: 300 },
  });

  if (!res.ok) return null;
  const json = await res.json();
  return json.data || null;
}

export async function searchManga(
  id: string,
): Promise<MangaSearchResult | null> {
  const res = await fetch(`${process.env.API_URL}/api/manga/${id}/search`, {
    next: { revalidate: 300 },
  });

  if (!res.ok) return null;
  const json = await res.json();
  return json || null;
}

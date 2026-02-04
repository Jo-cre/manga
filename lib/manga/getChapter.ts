"use server";
import { MangaChapter } from "./types";

export async function getChapter(id: string): Promise<MangaChapter | null> {
  const res = await fetch(`${process.env.API_URL}/api/manga/chapter/${id}`, {
    next: { revalidate: 300 },
  });

  if (!res.ok) return null;
  const json = await res.json();
  return json || null;
}

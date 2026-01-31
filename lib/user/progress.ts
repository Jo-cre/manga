"use server";
import { readingProgress } from "./types";

export async function getProgress(
  user: string,
  manga: string,
): Promise<readingProgress | null> {
  const res = await fetch(
    `${process.env.API_URL}/api/user/progress/${user}/manga/${manga}`,
  );

  if (!res.ok) return null;
  return res.json();
}

export async function setProgress(
  user: string,
  manga: string,
  chapter?: string | number,
  chapterId?: string,
) {
  if (chapter == null && !chapterId) {
    throw new Error("chapter or chapterId is required");
  }

  const res = await fetch(
    `${process.env.API_URL}/api/user/progress/${user}/manga/${manga}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chapter: chapter != null ? Number(chapter) : undefined,
        chapterId,
      }),
    },
  );

  if (!res.ok) return null;
  return res.json();
}

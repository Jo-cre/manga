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
  chapter: string | number,
) {
  const res = await fetch(
    `${process.env.API_URL}/api/user/progress/${user}/manga/${manga}?chapter=${chapter}`,
  );

  if (!res.ok) return null;
  return res.json();
}

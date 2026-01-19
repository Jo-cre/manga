"use server";
import { Group } from "./types";

export async function getGroup(id: string): Promise<Group | null> {
  const res = await fetch(`${process.env.API_URL}/api/group/${id}`, {
    next: { revalidate: 300 },
  });

  if (!res.ok) return null;
  const json = await res.json();
  return json.data || null;
}

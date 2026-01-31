import { Library } from "./types";

export async function checkInLibrary(
  userId: string,
  mangaId: string,
): Promise<boolean> {
  const response = await fetch(`/api/user/library/${userId}/${mangaId}`, {
    method: "GET",
  });

  if (!response.ok) return false;

  return await response.json();
}

export async function removeFromLibrary(
  userId: string,
  mangaId: string,
): Promise<boolean> {
  const res = await fetch(`/api/user/library/${userId}/${mangaId}`, {
    method: "DELETE",
  });

  return res.ok;
}

export async function addToLibrary(
  userId: string,
  mangaId: string,
): Promise<boolean> {
  const res = await fetch(`/api/user/library/${userId}/${mangaId}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
  });

  return res.ok;
}

export async function getLibrary(userId: string): Promise<Library[] | null> {
  const res = await fetch(`/api/user/library/${userId}`);

  if (!res.ok) return null;
  return res.json();
}

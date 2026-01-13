import { userModel } from "./types";

export async function getUser(id: string): Promise<userModel | null> {
  const res = await fetch(`${process.env.API_URL}/api/user?id=${id}`, {
    next: { revalidate: 60 },
  });

  if (!res.ok) return null;
  return res.json();
}

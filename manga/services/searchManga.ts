import { mangaSources } from "@/manga/adapters";

export async function searchMangas(query: string, enabledAdapters: string[]) {
  const activeAdapters = Object.values(mangaSources).filter((adapter) =>
    enabledAdapters.includes(adapter.id)
  );

  const results = await Promise.all(
    activeAdapters.map((adapter) => adapter.search(query).catch(() => []))
  );

  return results.flat();
}

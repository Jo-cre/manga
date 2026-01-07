import { MangaDexAdapter } from "./adapters/mangadex.adapter";

// add here
export interface MangaSourceConfig {
  id: string;
  name: string;
  url?: string;
  description?: string;
}

export const MANGA_SOURCES: MangaSourceConfig[] = [
  {
    id: MangaDexAdapter.id,
    name: MangaDexAdapter.name,
    url: MangaDexAdapter.url,
    description: "Maior agregador open-source de mangás",
  },
];

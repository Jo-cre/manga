import { MangaDexAdapter } from "./mangadex.adapter";

// add here
export const mangaSources = {
  mangadex: MangaDexAdapter,
};

export type MangaSourceId = keyof typeof mangaSources;

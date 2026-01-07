import { MangaSourceAdapter } from "../types";

export interface MangaDexRelationship {
  id: string;
  type: "cover_art" | string;
  attributes?: {
    fileName?: string;
  };
}

export interface MangaDexManga {
  id: string;
  attributes: {
    title: {
      en?: string;
    };
    description?: {
      en?: string;
    };
  };
  relationships: MangaDexRelationship[];
}

export interface MangaDexChapter {
  id: string;
  attributes: {
    title?: string;
    chapter?: string;
  };
}

export interface MangaDexListResponse<T> {
  data: T[];
}

export interface MangaDexSingleResponse<T> {
  data: T;
}

export const MangaDexAdapter: MangaSourceAdapter = {
  id: "mangadex",
  name: "MangaDex",
  url: "https://mangadex.org/",

  async search(query: string) {
    const res = await fetch(
      `https://api.mangadex.org/manga?title=${encodeURIComponent(
        query
      )}&limit=5&includes[]=cover_art`
    );

    const json: MangaDexListResponse<MangaDexManga> = await res.json();

    return json.data.map((m) => {
      const coverRel = m.relationships.find((r) => r.type === "cover_art");

      const fileName = coverRel?.attributes?.fileName;

      return {
        id: m.id,
        title: m.attributes.title.en ?? "Unknown",
        cover: fileName
          ? `https://uploads.mangadex.org/covers/${m.id}/${fileName}.256.jpg`
          : null,
        adapterId: this.id,
      };
    });
  },

  async getManga(mangaId: string) {
    const res = await fetch(
      `https://api.mangadex.org/manga/${mangaId}?includes[]=cover_art`
    );

    const json: MangaDexSingleResponse<MangaDexManga> = await res.json();
    const m = json.data;

    const coverRel = m.relationships.find((r) => r.type === "cover_art");

    const fileName = coverRel?.attributes?.fileName;

    return {
      id: m.id,
      title: m.attributes.title.en ?? "Unknown",
      description: m.attributes.description?.en ?? null,
      cover: fileName
        ? `https://uploads.mangadex.org/covers/${m.id}/${fileName}`
        : null,
    };
  },

  async getChapters(mangaId: string) {
    const res = await fetch(
      `https://api.mangadex.org/chapter?manga=${mangaId}`
    );

    const json: MangaDexListResponse<MangaDexChapter> = await res.json();

    return json.data.map((c) => ({
      id: c.id,
      title: c.attributes.title ?? `Capítulo ${c.attributes.chapter}`,
      number: c.attributes.chapter ?? null,
      sourceId: "mangadex",
    }));
  },

  async getPages(chapterId) {
    const res = await fetch(
      `https://api.mangadex.org/at-home/server/${chapterId}`
    );
    const json = await res.json();

    return json.chapter.data.map(
      (file: string) => `${json.baseUrl}/data/${json.chapter.hash}/${file}`
    );
  },
};

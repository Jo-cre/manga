import { MangaSourceAdapter } from "../types";

export const MangaDexAdapter: MangaSourceAdapter = {
  id: "mangadex",
  name: "MangaDex",
  url: "https://mangadex.org/",

  async search(query) {
    const res = await fetch(
      `https://api.mangadex.org/manga?title=${encodeURIComponent(
        query
      )}&limit=5&includes[]=cover_art`
    );
    const json = await res.json();

    return json.data.map((m: any) => {
      const coverRel = m.relationships.find((r: any) => r.type === "cover_art");

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

  async getManga(mangaId) {
    const res = await fetch(
      `https://api.mangadex.org/manga/${mangaId}?includes[]=cover_art`
    );
    const json = await res.json();

    const m = json.data;
    const coverRel = m.relationships.find((r: any) => r.type === "cover_art");
    const fileName = coverRel?.attributes?.fileName;

    return {
      id: m.id,
      title: m.attributes.title.en,
      description: m.attributes.description?.en,
      cover: fileName
        ? `https://uploads.mangadex.org/covers/${m.id}/${fileName}`
        : null,
    };
  },

  async getChapters(mangaId) {
    const res = await fetch(
      `https://api.mangadex.org/chapter?manga=${mangaId}`
    );
    const json = await res.json();

    return json.data.map((c: any) => ({
      id: c.id,
      title: c.attributes.title ?? `Capítulo ${c.attributes.chapter}`,
      number: c.attributes.chapter,
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

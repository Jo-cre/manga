export interface MangaSourceAdapter {
  id: string;
  name: string;
  url: string;

  search(query: string): Promise<MangaSearchResult[]>;
  getManga(mangaId: string): Promise<MangaDetails>;
  getChapters(mangaId: string): Promise<MangaChapter[]>;
  getPages(chapterId: string): Promise<string[]>;
}

export interface MangaSearchResult {
  id: string;
  title: string;
  cover: string | null;
  adapterId: string;
}

export interface MangaDetails {
  id: string;
  title: string;
  description?: string | null;
  cover: string | null;
}

export interface MangaChapter {
  id: string;
  title: string;
  number?: string | null;
  sourceId: string;
}

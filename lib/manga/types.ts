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
      "ja-ro"?: string;
    };
    altTitles: { [key: string]: string }[];
    description?: {
      en?: string;
    };
    status: string;
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

export interface MangaSearchResult {
  id: string;
  title: string;
  cover: string | null;
  status: string;
}

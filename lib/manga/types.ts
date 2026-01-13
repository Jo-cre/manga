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

export interface Manga {
  id: string;
  type: "manga";
  attributes: MangaAttributes;
  relationships: MangaRelationship[];
}

export interface MangaAttributes {
  title: LocalizedString;
  altTitles: LocalizedString[];
  description?: LocalizedString;

  originalLanguage: string;
  status: "ongoing" | "completed" | "hiatus" | "cancelled";
  year?: number;
  contentRating: "safe" | "suggestive" | "erotica" | "pornographic";

  tags: Tag[];
  links: LinkString;
  availableTranslatedLanguages: string[];
  latestUploadedChapter?: string;

  createdAt: string;
  updatedAt: string;
}

export interface LinkString {
  [key: string]: string;
}

export interface LocalizedString {
  [lang: string]: string;
}

export interface Tag {
  id: string;
  type: "tag";
  attributes: {
    name: LocalizedString;
    group: "genre" | "theme" | "format";
  };
}

export interface MangaRelationship {
  id: string;
  type: "author" | "artist" | "cover_art" | "manga";
  related?: string;
}

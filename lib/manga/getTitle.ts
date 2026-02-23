import { Manga } from "./types";

export function getTitle(manga: Manga, locale: string): string {
  const attr = manga.attributes;

  const mainTitle =
    attr.title?.[locale] ||
    attr.title?.["en"] ||
    attr.title?.["ja-ro"] ||
    attr.title?.["ja"] ||
    (attr.title ? Object.values(attr.title)[0] : null);

  if (mainTitle) return mainTitle;

  if (attr.altTitles && attr.altTitles.length > 0) {
    const altTitleObj =
      attr.altTitles.find((t) => t[locale]) ||
      attr.altTitles.find((t) => t["en"]) ||
      attr.altTitles.find((t) => t["ja-ro"]) ||
      attr.altTitles[0];

    if (altTitleObj) return Object.values(altTitleObj)[0];
  }
  return "Untitled";
}

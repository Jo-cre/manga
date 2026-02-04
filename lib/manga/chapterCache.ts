import { MangaChapter } from "@/lib/manga/types";

const chapterCache = new Map<string, MangaChapter>();

export function setChapterCache(chapter: MangaChapter) {
  chapterCache.set(chapter.id, chapter);
}

export function getChapterCache(id: string) {
  return chapterCache.get(id);
}

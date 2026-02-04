import {
  ChapterNavResponse,
  MangaChapter,
  MangaFeedResponse,
} from "@/lib/manga/types";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id: mangaId } = await params;
  const { searchParams } = new URL(req.url);

  const lang = searchParams.get("lang");
  const currentId = searchParams.get("current");
  const direction = searchParams.get("direction") as "next" | "prev" | null;
  const preferredGroup = searchParams.get("group");

  if (!lang || !currentId || !direction) {
    return NextResponse.json(
      { error: "lang, current and direction are required" },
      { status: 400 },
    );
  }

  const feedUrl = new URL(`https://api.mangadex.org/manga/${mangaId}/feed`);
  feedUrl.searchParams.set("translatedLanguage[]", lang);
  feedUrl.searchParams.set("limit", "100");
  feedUrl.searchParams.set("order[chapter]", "asc");

  const res = await fetch(feedUrl.toString());
  if (!res.ok) {
    return NextResponse.json(
      { error: "Failed to fetch feed" },
      { status: 502 },
    );
  }

  const json = (await res.json()) as MangaFeedResponse;

  const chapters = json.data.filter(
    (c): c is MangaChapter => c.attributes.chapter !== null,
  );

  function getGroupId(chapter: MangaChapter): string | null {
    return (
      chapter.relationships.find((r) => r.type === "scanlation_group")?.id ??
      null
    );
  }

  const currentChapter = chapters.find((c) => c.id === currentId);
  if (!currentChapter) {
    return NextResponse.json(
      { error: "Current chapter not found" },
      { status: 404 },
    );
  }

  const currentNumber = Number(currentChapter.attributes.chapter);

  const chaptersByNumber = new Map<number, MangaChapter[]>();

  for (const chapter of chapters) {
    const num = Number(chapter.attributes.chapter);
    if (!chaptersByNumber.has(num)) {
      chaptersByNumber.set(num, []);
    }
    chaptersByNumber.get(num)!.push(chapter);
  }

  const sortedNumbers = Array.from(chaptersByNumber.keys()).sort(
    (a, b) => a - b,
  );

  const currentIndex = sortedNumbers.indexOf(currentNumber);
  const targetIndex =
    direction === "next" ? currentIndex + 1 : currentIndex - 1;

  if (targetIndex < 0 || targetIndex >= sortedNumbers.length) {
    return NextResponse.json<ChapterNavResponse>({
      type: "manga",
      mangaId,
    });
  }

  const targetNumber = sortedNumbers[targetIndex];
  const candidates = chaptersByNumber.get(targetNumber)!;

  const sameGroup = preferredGroup
    ? candidates.find((c) => getGroupId(c) === preferredGroup)
    : null;

  const chosen = sameGroup ?? candidates[0];

  return NextResponse.json<ChapterNavResponse>({
    type: "chapter",
    id: chosen.id,
    chapter: chosen.attributes.chapter,
    volume: chosen.attributes.volume,
    group: getGroupId(chosen),
  });
}

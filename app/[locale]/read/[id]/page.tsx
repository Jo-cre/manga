import PageRender from "@/components/manga/PageRender";
import Topbar from "@/components/Topbar";
import { getChapterCache, setChapterCache } from "@/lib/manga/chapterCache";
import { getChapter } from "@/lib/manga/getChapter";
import { AtHomeResponse, ChapterNavResponse } from "@/lib/manga/types";

export default async function MangaPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const res = await fetch(
    `${process.env.API_URL}/api/manga/chapter/at-home/server/${id}`,
    {
      next: { revalidate: 300 },
    },
  );
  const json: AtHomeResponse = await res.json();
  const pages = json.chapter.data.map(
    (file) => `${json.baseUrl}/data/${json.chapter.hash}/${file}`,
  );

  const cached = getChapterCache(id);

  let next: ChapterNavResponse | null = null;
  let prev: ChapterNavResponse | null = null;

  let manga = null;

  if (cached) {
    const lang = cached.attributes.translatedLanguage;
    const group =
      cached.relationships.find((r) => r.type === "scanlation_group")?.id ??
      null;

    manga = cached.relationships.find((r) => r.type === "manga")?.id ?? null;

    if (manga) {
      prev = await fetchNav(
        `${process.env.API_URL}/api/manga/${manga}/chapter/nav?lang=${lang}&current=${id}&direction=prev&group=${group ?? ""}`,
      );
      next = await fetchNav(
        `${process.env.API_URL}/api/manga/${manga}/chapter/nav?lang=${lang}&current=${id}&direction=next&group=${group ?? ""}`,
      );
    }
  } else {
    const chap = await getChapter(id);
    if (!chap) return;

    setChapterCache(chap);

    const lang = chap.attributes.translatedLanguage;
    const group =
      chap.relationships.find((r) => r.type === "scanlation_group")?.id ?? null;
    manga = chap.relationships.find((r) => r.type === "manga")?.id ?? null;

    if (manga) {
      prev = await fetchNav(
        `${process.env.API_URL}/api/manga/${manga}/chapter/nav?lang=${lang}&current=${id}&direction=prev&group=${group ?? ""}`,
      );

      next = await fetchNav(
        `${process.env.API_URL}/api/manga/${manga}/chapter/nav?lang=${lang}&current=${id}&direction=next&group=${group ?? ""}`,
      );
    }
  }

  async function fetchNav(url: string) {
    const res = await fetch(url);
    if (!res.ok) return null;
    return res.json();
  }

  return (
    <div className="flex flex-1 flex-col">
      <Topbar margin fixed />
      <PageRender pages={pages} manga={manga!} next={next} prev={prev} />
    </div>
  );
}

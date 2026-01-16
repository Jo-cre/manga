import {
  MangaChapter,
  MangaVolume,
  MangaVolumesResponse,
} from "@/lib/manga/types";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "../ui/pagination";
import { Button } from "../ui/button";
import ChapterButton from "./ChapterButton";
import { Label } from "../ui/label";

export default function MangaVolumes({
  id,
  lang,
}: {
  id: string;
  lang: string;
}) {
  const t = useTranslations("Manga");

  const [data, setData] = useState<MangaVolumesResponse | null>(null);
  const [sort, setSort] = useState<"asc" | "desc">("desc");
  const [volume, setVolume] = useState<MangaVolume | null>(null);
  const [chapters, setChapters] = useState<MangaChapter[] | null>(null);

  useEffect(() => {
    fetch(`/api/manga/${id}/volumes?lang=${lang}`, {
      next: { revalidate: 120 },
    })
      .then((res) => res.json())
      .then((volumes: MangaVolumesResponse) => {
        setData(volumes);

        const sortedVolumes = Object.values(volumes.volumes).sort((a, b) => {
          if (a.volume === "none") return 1;
          if (b.volume === "none") return -1;
          return parseFloat(b.volume) - parseFloat(a.volume);
        });

        setVolume(sortedVolumes[0]);
      });
  }, [id, lang]);

  useEffect(() => {
    if (!volume) return;

    fetch(`/api/manga/${id}/chapter?lang=${lang}&volume=${volume.volume}`, {
      next: { revalidate: 120 },
    })
      .then((res) => res.json())
      .then((chap) => {
        setChapters(chap);
      });
  }, [volume, lang, id]);

  return (
    <div>
      {data && Object.values(data.volumes).length > 0 ? (
        <>
          <Pagination className="w-full">
            <PaginationContent className="flex w-4/5 flex-col">
              <Button
                className="sticky top-16 mr-auto ml-6"
                variant={"outline"}
                onClick={() => setSort(sort === "asc" ? "desc" : "asc")}
              >
                {t(sort)}
              </Button>
              <div
                className={`w-2/3 rounded-md overflow-hidden flex flex-col border`}
              >
                <Label className="font-bold text-3xl truncate block text-left p-4">
                  {t("volume") + " " + volume?.volume}
                </Label>
                <div
                  className={`w-full h-full flex ${
                    sort === "asc" ? "flex-col" : "flex-col-reverse"
                  }`}
                >
                  {chapters && chapters.length > 0 ? (
                    chapters.map((c) => (
                      <ChapterButton chapterData={c} key={c.id} />
                    ))
                  ) : (
                    <p>No chapters available.</p>
                  )}
                </div>
              </div>

              {Object.values(data.volumes).length > 1 && (
                <div className="flex w-full items-center justify-center space-x-2 flex-wrap mt-4">
                  <PaginationItem>
                    <PaginationPrevious
                      href="#"
                      text={t("pagination.previous")}
                    />
                  </PaginationItem>

                  {Object.values(data.volumes)
                    .sort((a, b) => {
                      if (sort === "asc") {
                        if (a.volume === "none") return 1;
                        if (b.volume === "none") return -1;
                        return parseFloat(a.volume) - parseFloat(b.volume);
                      } else {
                        if (a.volume === "none") return -1;
                        if (b.volume === "none") return 1;
                        return parseFloat(b.volume) - parseFloat(a.volume);
                      }
                    })
                    .map((volume: MangaVolume) => (
                      <PaginationItem
                        key={volume.volume}
                        onClick={() => setVolume(volume)}
                      >
                        <PaginationLink href={`#${volume.volume}`}>
                          {volume.volume === "none" ? "-" : volume.volume}
                        </PaginationLink>
                      </PaginationItem>
                    ))}

                  <PaginationItem>
                    <PaginationNext href="#" text={t("pagination.next")} />
                  </PaginationItem>
                </div>
              )}
            </PaginationContent>
          </Pagination>
        </>
      ) : (
        <p>No chapters available.</p>
      )}
    </div>
  );
}

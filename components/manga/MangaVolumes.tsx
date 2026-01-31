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
import { Skeleton } from "../ui/skeleton";
import { useSession } from "next-auth/react";

export default function MangaVolumes({
  id,
  lang,
  progress,
}: {
  id: string;
  lang: string;
  progress?: number;
}) {
  const t = useTranslations("Manga");
  const { data: session } = useSession();

  const [data, setData] = useState<MangaVolumesResponse | null>(null);
  const [sort, setSort] = useState<"asc" | "desc">("desc");
  const [volume, setVolume] = useState<MangaVolume | null>(null);
  const [chapters, setChapters] = useState<MangaChapter[] | null>(null);
  const [chaptersLoading, setChaptersLoading] = useState(false);

  useEffect(() => {
    fetch(`/api/manga/${id}/volumes?lang=${lang}`, {
      next: { revalidate: 120 },
    })
      .then((res) => res.json())
      .then((volumes: MangaVolumesResponse) => {
        setData(volumes);

        const allVolumes = Object.values(volumes.volumes);
        const noneVolume = allVolumes.find((v) => v.volume === "none");
        if (noneVolume) {
          setVolume(noneVolume);
          return;
        }
        const lastNumeric =
          allVolumes
            .filter((v) => v.volume !== "none")
            .sort((a, b) => parseFloat(b.volume) - parseFloat(a.volume))[0] ??
          null;

        setVolume(lastNumeric);
      });
  }, [id, lang]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (!volume) return;

    setChaptersLoading(true);

    fetch(`/api/manga/${id}/chapter?lang=${lang}&volume=${volume.volume}`, {
      next: { revalidate: 120 },
    })
      .then((res) => res.json())
      .then((chap) => {
        setChapters(chap);
      })
      .finally(() => {
        setChaptersLoading(false);
      });
  }, [volume, lang, id]);

  return (
    <div>
      <Pagination className="w-full">
        <PaginationContent className="flex w-4/5 flex-col">
          <Button
            className="sticky top-16 mr-auto ml-6"
            variant={"outline"}
            onClick={() => {
              if (!data || !volume) {
                setSort(sort === "asc" ? "desc" : "asc");
                return;
              }

              const newSort = sort === "asc" ? "desc" : "asc";
              const volumes = Object.values(data.volumes);

              const noneVolume =
                volumes.find((v) => v.volume === "none") ?? null;
              const firstVolume =
                volumes
                  .filter((v) => v.volume !== "none")
                  .sort(
                    (a, b) => parseFloat(a.volume) - parseFloat(b.volume),
                  )[0] ?? null;

              if (volume.volume === "none" && firstVolume) {
                setVolume(firstVolume);
              } else if (
                firstVolume &&
                volume.volume === firstVolume.volume &&
                noneVolume
              ) {
                setVolume(noneVolume);
              }

              setSort(newSort);
            }}
          >
            {t(sort)}
          </Button>

          <div className="w-3/4 rounded-md overflow-hidden flex flex-col">
            {data && volume && (
              <Label className="font-bold text-3xl truncate block text-left p-4 px-10">
                {volume.volume === "none"
                  ? t("noneVolume")
                  : t("volume") + " " + volume.volume}
              </Label>
            )}

            <div
              className={`w-full h-full flex items-center ${
                sort === "asc" ? "flex-col" : "flex-col-reverse"
              }`}
            >
              {!data || chaptersLoading ? (
                <div className="px-4">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <Skeleton
                      key={"skeleton" + i}
                      className="h-10 w-full my-3 rounded-md"
                    />
                  ))}
                </div>
              ) : chapters && chapters.length > 0 ? (
                chapters
                  .slice()
                  .sort((a, b) => {
                    const ca = a.attributes.chapter;
                    const cb = b.attributes.chapter;

                    if (ca == null && cb != null) return 1;
                    if (cb == null && ca != null) return -1;
                    if (ca == null && cb == null) return 0;

                    return Number(ca) - Number(cb);
                  })
                  .map((c) => {
                    if (!session)
                      return (
                        <ChapterButton manga={id} chapterData={c} key={c.id} />
                      );

                    const currentChapter = Number(c.attributes.chapter);
                    const isRead = progress
                      ? currentChapter <= Number(progress)
                      : false;

                    return (
                      <ChapterButton
                        manga={id}
                        chapterData={c}
                        key={c.id}
                        read={isRead}
                      />
                    );
                  })
              ) : (
                <p className="text-muted-foreground p-4">{t("noChapters")}</p>
              )}
            </div>
          </div>

          {data && Object.values(data.volumes).length > 1 && (
            <div className="flex w-full items-center justify-center space-x-2 flex-wrap mt-4">
              <PaginationItem>
                <PaginationPrevious href="#" text={t("pagination.previous")} />
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
                .map((volume) => (
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
    </div>
  );
}

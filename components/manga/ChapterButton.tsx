"use client";
import { MangaChapter } from "@/lib/manga/types";
import { cn, getFlagByCode } from "@/lib/utils";
import { useLocale, useTranslations } from "next-intl";
import { Label } from "../ui/label";
import Image from "next/image";
import { Badge } from "../ui/badge";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import { useEffect, useState } from "react";
import { Group } from "@/lib/group/types";
import { getGroup } from "@/lib/group/getGroup";
import Link from "next/link";
import { Skeleton } from "../ui/skeleton";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
import { setProgress } from "@/lib/user/progress";
import { useSession } from "next-auth/react";
import { setChapterCache } from "@/lib/manga/chapterCache";

export default function ChapterButton({
  read,
  manga,
  chapterData,
  className,
}: {
  read?: boolean;
  manga: string;
  chapterData: MangaChapter;
  className?: string;
}) {
  const t = useTranslations("Chapter");
  const { data: session } = useSession();

  const locale = useLocale();
  const router = useRouter();

  const [groups, setGroups] = useState<(Group | null)[] | null>(null);

  const [skeletonWidths] = useState(() =>
    Array.from({ length: 3 }, () => {
      const widths = [16, 20, 24, 28];
      return widths[Math.floor(Math.random() * widths.length)];
    }),
  );

  useEffect(() => {
    if (!chapterData?.relationships) return;
    setTimeout(() => {
      const fetchGroups = async () => {
        const fGroups = Object.values(chapterData.relationships).filter(
          (x) => x.type === "scanlation_group",
        );

        setGroups(await Promise.all(fGroups.map((g) => getGroup(g.id))));
      };

      fetchGroups();
    }, 5000);
  }, [chapterData]);

  return (
    <button
      className={cn(
        className,
        "relative flex bg-background hover:bg-muted/16 w-9/10 h-20 hover:my-0.5 hover:z-2 hover:border hover:rounded-sm px-8 py-2 cursor-pointer hover:scale-105 transition-all duration-300",
      )}
      onClick={() => {
        if (session && manga && chapterData.attributes.chapter) {
          setProgress(
            session.user.id,
            manga,
            Number(chapterData.attributes.chapter),
            chapterData.id,
          );
        }
        setChapterCache(chapterData);
        router.push(`/read/${chapterData.id}`);
      }}
    >
      <div className="flex flex-1 flex-col">
        <Tooltip>
          <TooltipTrigger asChild>
            <Label className="z-9 font-bold text-xl line-clamp-1 text-left">
              {t("chapter")} {chapterData.attributes.chapter ?? "?"}
              {chapterData.attributes.title &&
                ` — ${chapterData.attributes.title}`}
            </Label>
          </TooltipTrigger>
          <TooltipContent>
            <Label>
              {t("chapter")} {chapterData.attributes.chapter ?? "?"}
              {chapterData.attributes.title &&
                ` — ${chapterData.attributes.title}`}
            </Label>
          </TooltipContent>
        </Tooltip>

        <div className="flex flex-1 flex-row p-2 gap-2">
          {groups === null ? (
            <>
              {skeletonWidths.map((w, i) => (
                <Skeleton key={i} className={`h-6 w-${w} rounded-sm`} />
              ))}
            </>
          ) : (
            <>
              <Badge
                variant="outline"
                className={`${
                  chapterData.attributes.isUnavailable
                    ? "border-red-800"
                    : "border-green-800"
                } rounded-sm`}
              >
                {chapterData.attributes.isUnavailable
                  ? t("unavaliable")
                  : t("avaliable")}
              </Badge>
              {groups.map(
                (g) =>
                  g && (
                    <Badge variant="outline" key={g.id} className="rounded-sm">
                      {g.attributes.website ? (
                        <Link href={g.attributes.website}>
                          {g.attributes.name}
                        </Link>
                      ) : (
                        g.attributes.name
                      )}
                    </Badge>
                  ),
              )}
            </>
          )}
        </div>
      </div>
      <div className="pt-1">{read ? <Eye /> : <EyeOff />}</div>
      <div>
        {getFlagByCode(chapterData.attributes.translatedLanguage) != null && (
          <Image
            className="ml-auto"
            src={getFlagByCode(chapterData.attributes.translatedLanguage)!}
            alt={chapterData.attributes.translatedLanguage}
            width={40}
            height={40}
          />
        )}
        <Label>
          {new Date(chapterData.attributes.readableAt).toLocaleDateString(
            locale,
          )}
        </Label>
      </div>
    </button>
  );
}

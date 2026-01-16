import { MangaChapter } from "@/lib/manga/types";
import { cn, getFlagByCode } from "@/lib/utils";
import { useLocale, useTranslations } from "next-intl";
import { Label } from "../ui/label";
import Image from "next/image";
import { Badge } from "../ui/badge";

export default function ChapterButton({
  chapterData,
  className,
}: {
  chapterData: MangaChapter;
  className?: string;
}) {
  const t = useTranslations("Chapter");
  const locale = useLocale();
  return (
    <button
      className={cn(
        className,
        "relative flex bg-background hover:bg-muted/16 h-20 px-8 py-2 border-t"
      )}
    >
      <div className="flex flex-1 flex-col">
        <Label className="font-bold text-xl truncate block text-left">
          {t("chapter")} {chapterData.attributes.chapter ?? "?"}
          {chapterData.attributes.title && ` — ${chapterData.attributes.title}`}
        </Label>

        <div className="flex flex-1 flex-row p-2 gap-2">
          <Badge
            variant={`outline`}
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
          <Badge variant={"outline"} className="rounded-sm">
            {chapterData.attributes.translatedLanguage}
          </Badge>
        </div>
      </div>
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
        <Label className="">
          {new Date(chapterData.attributes.readableAt).toLocaleDateString(
            locale
          )}
        </Label>
      </div>
    </button>
  );
}

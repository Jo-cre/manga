"use client";
import { LocalizedString, Manga } from "@/lib/manga/types";
import { useState } from "react";
import MangaLangDropdown from "./MangaLangDropdown";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkBreaks from "remark-breaks";
import { useTranslations } from "next-intl";
import { Button } from "../ui/button";
import { ArrowUp } from "lucide-react";
import MangaVolumes from "./MangaVolumes";

export function MangaContent({
  data,
  locale,
}: {
  data: Manga;
  locale: string;
}) {
  const [currentLang, setCurrentLang] = useState(locale);
  const [isExpanded, setIsExpanded] = useState(false);
  const t = useTranslations("Manga");

  const title =
    data.attributes.title[currentLang] ||
    data.attributes.title["en"] ||
    data.attributes.title["ja-ro"] ||
    data.attributes.title["ja"] ||
    data.attributes.title[Object.keys(data.attributes.title)[0]] ||
    "Untitled";

  const desc = data.attributes.description
    ? data.attributes.description[currentLang] ||
      data.attributes.description["en"] ||
      data.attributes.description["ja-ro"] ||
      data.attributes.description["ja"] ||
      data.attributes.description[Object.keys(data.attributes.description)[0]]
    : null;

  const altTitle =
    data.attributes.altTitles?.find((t: LocalizedString) => t[currentLang])?.[
      currentLang
    ] ||
    data.attributes.altTitles?.find((t: LocalizedString) => t["en"])?.["en"] ||
    data.attributes.altTitles?.find((t: LocalizedString) => t["ja-ro"])?.[
      "ja-ro"
    ] ||
    data.attributes.altTitles?.find((t: LocalizedString) => t["ja"])?.["ja"] ||
    data.attributes.altTitles?.[0]?.[
      Object.keys(data.attributes.altTitles[0])[0]
    ] ||
    null;

  return (
    <>
      <div className="relative h-[90vh] w-full flex items-center justify-center">
        <h1
          className={`absolute ${
            altTitle ? "bottom-10" : "bottom-2"
          } left-2 text-white sm:text-3xl md:text-5xl lg:text-6xl font-black uppercase text-center px-4 line-clamp-1`}
        >
          {title}
        </h1>
        {altTitle && (
          <h2 className="absolute bottom-2 left-2 text-white sm:text-sm md:text-xl lg:text-xl uppercase text-center px-4 line-clamp-1">
            {altTitle}
          </h2>
        )}
      </div>

      <div className="relative bg-background min-h-screen border-t dark:shadow-[0_-50px_100vw_rgba(0,0,0,1)]">
        {data.attributes.availableTranslatedLanguages.length > 0 && (
          <MangaLangDropdown
            className="sticky top-16 ml-auto mt-2 mr-8 bg-background"
            lang={currentLang}
            setLang={(newLang) => setCurrentLang(newLang)}
            avaliableLangs={data.attributes.availableTranslatedLanguages}
          />
        )}

        {desc ? (
          <div className="text-muted-foreground text-start p-8">
            <div className={`${!isExpanded && "line-clamp-6"}`}>
              <Markdown
                remarkPlugins={[remarkGfm, remarkBreaks]}
                components={{
                  a: ({ ...props }) => (
                    <a
                      {...props}
                      className="text-primary underline"
                      target="_blank"
                      rel="noopener noreferrer"
                    />
                  ),
                  hr: () => <hr className="my-2 -mx-2" />,
                  ol: ({ ...props }) => <ol className="my-2" {...props} />,
                  li: ({ ...props }) => <li className="ml-6" {...props} />,
                }}
              >
                {desc}
              </Markdown>
            </div>
            <div className="flex justify-center">
              {desc.length > 800 && (
                <Button
                  variant="ghost"
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="font-semibold"
                >
                  <ArrowUp
                    className={`${
                      !isExpanded && "rotate-180"
                    } transition-all duration-300`}
                  />
                  {isExpanded ? t("collapse") : t("expand")}
                </Button>
              )}
            </div>
          </div>
        ) : (
          <p className="text-muted-foreground text-start p-8 italic">
            {t("noDescription")}
          </p>
        )}
        <MangaVolumes id={data.id} lang={currentLang} />
      </div>
    </>
  );
}

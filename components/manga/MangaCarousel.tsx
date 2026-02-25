"use client";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import Image from "next/image";
import { Manga } from "@/lib/manga/types";
import { useLocale } from "next-intl";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkBreaks from "remark-breaks";
import { getTitle } from "@/lib/manga/getTitle";
import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { readingProgress } from "@/lib/user/types";

export default function MangaCarousel({
  data,
  progressData,
  title,
  type,
}: {
  data: Manga[];
  progressData?: readingProgress[];
  title?: string;
  type?: "sm" | "lg" | "chapter";
}) {
  const locale = useLocale();
  const router = useRouter();

  if (type === "lg")
    return (
      <Carousel
        className="w-full cursor-pointer"
        opts={{
          loop: true,
          align: "start",
        }}
      >
        {title && (
          <h1 className="text-3xl p-4 pt-8 font-bold mb-4 absolute z-2">
            {title}
          </h1>
        )}
        <CarouselContent>
          {data.map((manga) => (
            <CarouselItem
              key={manga.id}
              className="select-none"
              onClick={() => router.push(`/manga/${manga.id}`)}
            >
              <div className="relative h-105 overflow-hidden">
                {/* Background */}
                {manga.attributes.links["cover"] && (
                  <Image
                    src={manga.attributes.links["cover"]}
                    alt="Background"
                    fill
                    priority
                    className="absolute object-cover object-center brightness-50"
                  />
                )}
                {/* Content */}
                <div className="absolute flex gap-4 flex-row bottom-4 left-4 w-full overflow-hidden">
                  <div className="relative w-60 aspect-3/4">
                    {manga.attributes.links["cover"] && (
                      <Image
                        src={manga.attributes.links["cover"]}
                        alt="Cover"
                        fill
                        priority
                        className="object-cover rounded-sm"
                      />
                    )}
                  </div>
                  <div className="relative z-7 flex h-full items-center gap-6">
                    <div className="max-w-4xl text-white">
                      <h1 className="text-2xl md:text-4xl font-bold mb-4 leading-normal line-clamp-2">
                        {getTitle(manga, locale)}
                      </h1>
                      <div className="text-base text-gray-300 line-clamp-7 leading-normal wrap-break-word">
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
                            ol: ({ ...props }) => (
                              <ol className="my-2" {...props} />
                            ),
                            li: ({ ...props }) => (
                              <li className="ml-6" {...props} />
                            ),
                          }}
                        >
                          {manga.attributes.description?.[locale] ||
                            manga.attributes.description?.["en"] ||
                            Object.values(
                              manga.attributes.description || {},
                            )[0] ||
                            "No description available."}
                        </Markdown>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    );

  if (!type || type === "sm")
    return (
      <>
        {title && (
          <h1 className="text-3xl p-4 pt-8 font-bold mb-4 z-2">{title}</h1>
        )}
        <Carousel
          className="w-full px-4 select-none"
          opts={{
            loop: true,
            align: "start",
            skipSnaps: true,
          }}
        >
          <CarouselContent>
            {data.map((manga) => (
              <CarouselItem
                key={manga.id}
                className="basis-full sm:basis-1/3 lg:basis-1/6"
                onClick={() => router.push(`/manga/${manga.id}`)}
              >
                <div className="relative w-full aspect-[1/1.414] overflow-hidden rounded-md cursor-pointer bg-muted">
                  {manga.attributes.links["cover"] && (
                    <Image
                      src={manga.attributes.links["cover"]}
                      alt="Cover"
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 16vw"
                      className="object-cover"
                    />
                  )}
                </div>
                <p className="mt-2 text-sm font-medium line-clamp-2">
                  {getTitle(manga, locale)}
                </p>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </>
    );

  if (type === "chapter")
    return (
      <>
        {title && (
          <h1 className="text-3xl p-4 pt-8 font-bold mb-4 z-2">{title}</h1>
        )}
        <Carousel
          className="w-full px-4 select-none"
          opts={{
            loop: true,
            align: "start",
            skipSnaps: true,
          }}
        >
          <CarouselContent>
            {data.map((manga, i) => (
              <CarouselItem
                key={manga.id}
                className="basis-full sm:basis-1/3 lg:basis-1/6"
              >
                <div className="flex items-stretch w-full">
                  <div
                    className="relative flex-none w-1/2 aspect-[1/1.414] overflow-hidden rounded-l-md cursor-pointer"
                    onClick={() => router.push(`/manga/${manga.id}`)}
                  >
                    {manga.attributes.links["cover"] && (
                      <Image
                        src={manga.attributes.links["cover"]}
                        alt="Cover"
                        fill
                        className="object-cover"
                      />
                    )}
                  </div>
                  <div className="relative flex flex-1 flex-col bg-card border border-l-0 rounded-r-md min-w-0">
                    <p className="text-sm text-muted-foreground p-2">
                      {getTitle(manga, locale)}
                    </p>
                    {progressData && progressData[i] ? (
                      <>
                        <p className="text-xl mt-auto text-muted-foreground p-2">
                          {String(progressData[i].chapterNum)}
                        </p>
                        {progressData[i].chapterId && (
                          <ArrowRight
                            className="absolute right-2 bottom-2 text-muted-foreground cursor-pointer hover:text-foreground duration-300"
                            onClick={() => {
                              router.push(`/read/${progressData[i].chapterId}`);
                            }}
                          />
                        )}
                      </>
                    ) : (
                      <p className="text-xl mt-auto text-muted-foreground p-2">
                        -
                      </p>
                    )}
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </>
    );
}

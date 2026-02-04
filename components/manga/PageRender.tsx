"use client";
import { useOptions } from "@/hooks/useOptions";
import { useLayoutEffect, useMemo } from "react";
import CarouselView from "../CarouselView";
import ScrollView from "../ScrollView";
import { useHideCursor } from "@/hooks/useHideCursor";
import { ChapterNavResponse } from "@/lib/manga/types";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { setProgress } from "@/lib/user/progress";

export default function PageRender({
  pages,
  next,
  prev,
  manga,
}: {
  pages: string[];
  next: ChapterNavResponse | null;
  prev: ChapterNavResponse | null;
  manga: string;
}) {
  const { options } = useOptions();
  const isMouseVisible = useHideCursor();
  const router = useRouter();

  const { data: session } = useSession();

  const orderedPages = useMemo(() => {
    if (options.orientation === "horizontal" && options.side === "right") {
      return [...pages].reverse();
    }
    return pages;
  }, [pages, options.orientation, options.side]);

  useLayoutEffect(() => {
    let tries = 0;

    const i = setInterval(() => {
      window.scrollTo(0, document.documentElement.scrollHeight);
      if (++tries > 10) clearInterval(i);
    }, 100);

    return () => clearInterval(i);
  }, [pages]);

  function goToPrev() {
    if (!prev) return;

    if (prev.type === "chapter") {
      if (prev.chapter != null) {
        if (session)
          setProgress(session.user.id, manga, Number(prev.chapter), prev.id);
      }

      router.push(`/read/${prev.id}`);
      return;
    }

    if (prev.type === "manga") {
      router.push(`/manga/${prev.mangaId}`);
    }
  }

  function goToNext() {
    if (!next) return;

    if (next.type === "chapter") {
      if (next.chapter != null) {
        if (session)
          setProgress(session.user.id, manga, Number(next.chapter), next.id);
      }

      router.push(`/read/${next.id}`);
      return;
    }

    if (next.type === "manga") {
      router.push(`/manga/${next.mangaId}`);
    }
  }

  function prevNextHandle(action: "prev" | "next") {
    return action === "prev" ? goToPrev() : goToNext();
  }

  if (options.scroll === "carousel") {
    return (
      <CarouselView
        pages={orderedPages}
        orientation={options.orientation}
        side={options.side}
        cursor={isMouseVisible}
        action={prevNextHandle}
      />
    );
  }

  return (
    <ScrollView
      pages={orderedPages}
      orientation={options.orientation}
      size={options.size}
      side={options.side}
      cursor={isMouseVisible}
    />
  );
}

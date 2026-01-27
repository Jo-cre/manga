"use client";
import { useOptions } from "@/hooks/useOptions";
import { useMemo } from "react";
import CarouselView from "../CarouselView";
import ScrollView from "../ScrollView";
import { useHideCursor } from "@/hooks/useHideCursor";

export default function PageRender({ pages }: { pages: string[] }) {
  const { options } = useOptions();
  const isMouseVisible = useHideCursor();

  const orderedPages = useMemo(() => {
    if (options.orientation === "horizontal" && options.side === "right") {
      return [...pages].reverse();
    }
    return pages;
  }, [pages, options.orientation, options.side]);

  if (options.scroll === "carousel") {
    return (
      <CarouselView
        pages={orderedPages}
        orientation={options.orientation}
        side={options.side}
        cursor={isMouseVisible}
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

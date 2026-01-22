import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import Image from "next/image";
import { useCallback, useEffect, useRef } from "react";

export default function CarouselView({
  pages,
  orientation,
  side,
}: {
  pages: string[];
  orientation: "horizontal" | "vertical";
  side: "left" | "right";
}) {
  const apiRef = useRef<CarouselApi | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (!apiRef.current) return;

      const isNext =
        orientation === "horizontal"
          ? ["ArrowRight", "d", "D"].includes(e.key)
          : ["ArrowDown", "s", "S"].includes(e.key);

      const isPrev =
        orientation === "horizontal"
          ? ["ArrowLeft", "a", "A"].includes(e.key)
          : ["ArrowUp", "w", "W"].includes(e.key);

      if (isNext) {
        e.preventDefault();
        apiRef.current.scrollNext();
      }

      if (isPrev) {
        e.preventDefault();
        apiRef.current.scrollPrev();
      }
    },
    [orientation],
  );

  useEffect(() => {
    if (!apiRef.current) return;

    const api = apiRef.current;
    const snaps = api.scrollSnapList();
    if (!snaps.length) return;

    if (side === "right") {
      api.scrollTo(snaps.length - 1, true);
    } else {
      api.scrollTo(0, true);
    }
  }, [side]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    el.focus();
    el.addEventListener("keydown", handleKeyDown);

    return () => {
      el.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleKeyDown]);

  if (orientation === "horizontal") {
    return (
      <div
        ref={containerRef}
        tabIndex={0}
        className="h-full flex flex-1 outline-none overflow-hidden focus:outline-none"
      >
        <Carousel
          orientation={"horizontal"}
          className="max-h-screen"
          setApi={(api) => (apiRef.current = api)}
        >
          <CarouselContent className="m-0">
            {pages.map((src, index) => (
              <CarouselItem
                key={index}
                className="p-0 flex max-h-screen items-center justify-center"
              >
                <Image
                  src={src}
                  alt={`page ${index + 1}`}
                  width={1200}
                  height={1800}
                  sizes="100vw"
                  className={`object-contain min-h-full max-h-full w-auto`}
                  loading="lazy"
                />
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </div>
    );
  } else {
    return (
      <div
        ref={containerRef}
        tabIndex={0}
        className="h-screen w-full outline-none overflow-hidden"
      >
        <Carousel
          orientation="vertical"
          className="h-screen w-full"
          setApi={(api) => (apiRef.current = api)}
        >
          <CarouselContent className="h-screen m-0">
            {pages.map((src, index) => (
              <CarouselItem
                key={index}
                className="p-0 flex min-h-screen items-center justify-center"
              >
                <Image
                  src={src}
                  alt={`page ${index + 1}`}
                  width={1200}
                  height={1800}
                  sizes="100vw"
                  className="object-contain min-h-screen max-h-screen w-auto"
                  loading="lazy"
                />
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </div>
    );
  }
}

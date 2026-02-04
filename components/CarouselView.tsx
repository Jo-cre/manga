import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";

export default function CarouselView({
  pages,
  orientation,
  side,
  cursor,
  action,
}: {
  pages: string[];
  orientation: "horizontal" | "vertical";
  side: "left" | "right";
  cursor: boolean;
  action: (action: "prev" | "next") => void;
}) {
  const [api, setApi] = useState<CarouselApi | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (!api) return;

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

        if (api.canScrollNext()) {
          api.scrollNext();
        } else {
          action(side === "left" ? "next" : "prev");
        }
      }

      if (isPrev) {
        e.preventDefault();

        if (api.canScrollPrev()) {
          api.scrollPrev();
        } else {
          action(side === "left" ? "prev" : "next");
        }
      }
    },
    [api, orientation, action, side],
  );

  useEffect(() => {
    if (!api || !pages.length) return;

    const handleInitialScroll = () => {
      const count = api.scrollSnapList().length;
      if (count > 0) {
        const target = side === "right" ? count - 1 : 0;
        api.scrollTo(target, true);
      }
    };

    handleInitialScroll();

    api.on("reInit", handleInitialScroll);

    return () => {
      api.off("reInit", handleInitialScroll);
    };
  }, [api, side, pages]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const isTyping = ["INPUT", "TEXTAREA"].includes(
      document.activeElement?.tagName || "",
    );

    if (!isTyping) {
      el.focus();
    }
  }, []);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

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
        className={`h-full flex flex-1 outline-none overflow-hidden focus:outline-none 
          ${cursor ? "cursor-default" : "cursor-none"}`}
      >
        <Carousel
          orientation={"horizontal"}
          className="max-h-screen"
          setApi={setApi}
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
        className={`h-screen w-full outline-none overflow-hidden
          ${cursor ? "cursor-default" : "cursor-none"}`}
      >
        <Carousel
          orientation="vertical"
          className="h-screen w-full"
          setApi={setApi}
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

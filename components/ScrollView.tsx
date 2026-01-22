import { useEffect, useRef } from "react";
import Image from "next/image";

export default function ScrollView({
  pages,
  orientation,
  size,
  side,
}: {
  pages: string[];
  orientation: "horizontal" | "vertical";
  size: "fit" | "full";
  side: "left" | "right";
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (orientation === "horizontal" && side === "right" && ref.current) {
      ref.current.scrollLeft = ref.current.scrollWidth;
    }

    if (orientation === "horizontal" && side === "left" && ref.current) {
      ref.current.scrollLeft = 0;
    }
  }, [orientation, side, pages]);

  return (
    <div
      ref={ref}
      className={`flex h-full w-full ${
        orientation === "vertical"
          ? "flex-col overflow-y-auto"
          : "flex-row overflow-x-auto"
      }`}
    >
      {pages.map((src, index) => (
        <Image
          key={index}
          src={src}
          alt=""
          width={1200}
          height={1800}
          sizes="100vw"
          loading="lazy"
          className={`object-contain ${
            size === "fit" ? "max-h-screen w-auto" : "w-screen h-auto"
          }`}
        />
      ))}
    </div>
  );
}

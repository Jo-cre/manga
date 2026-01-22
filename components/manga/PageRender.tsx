"use client";
import { useOptions } from "@/hooks/useOptions";
import { useMemo } from "react";
import CarouselView from "../CarouselView";
import ScrollView from "../ScrollView";

export default function PageRender({ pages }: { pages: string[] }) {
  const { options } = useOptions();

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
      />
    );
  }

  return (
    <ScrollView
      pages={orderedPages}
      orientation={options.orientation}
      size={options.size}
      side={options.side}
    />
  );
}

// export default function PageRender({ pages }: { pages: string[] }) {
//   const { options } = useOptions();

//   const orderedPages = useMemo(() => {
//     if (options.orientation === "horizontal" && options.side === "right") {
//       return [...pages].reverse();
//     }
//     return pages;
//   }, [pages, options.orientation, options.side]);

//   return (
//     <div
//       className={`${options.orientation === "vertical" ? "flex-col" : "flex-row"} flex items-center`}
//     >
//       {orderedPages.map((src, index) => (
//         <Image
//           key={index}
//           src={src}
//           alt={`page ${index + 1}`}
//           sizes="100vw"
//           width={1200}
//           height={1800}
//           className={`${
//             options.size === "fit" ? "max-h-screen w-auto" : "w-screen h-auto"
//           } object-contain mb-4`}
//           loading="lazy"
//         />
//       ))}
//     </div>
//   );
// }

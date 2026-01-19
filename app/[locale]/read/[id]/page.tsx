import Topbar from "@/components/Topbar";
import { AtHomeResponse } from "@/lib/manga/types";
import Image from "next/image";

export default async function MangaPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const res = await fetch(
    `${process.env.API_URL}/api/manga/chapter/at-home/server/${id}`,
    {
      next: { revalidate: 300 },
    },
  );
  const json: AtHomeResponse = await res.json();
  const pages = json.chapter.data.map(
    (file) => `${json.baseUrl}/data/${json.chapter.hash}/${file}`,
  );

  return (
    <div className="flex flex-1 flex-col">
      <Topbar margin fixed />
      <div className="flex flex-col items-center">
        {pages.map((src, index) => (
          <Image
            key={index}
            src={src}
            alt={`page ${index + 1}`}
            sizes="100vw"
            width={1200}
            height={1800}
            style={{
              maxHeight: "100vh",
              width: "auto",
              height: "auto",
            }}
            className="mb-4 object-contain"
            loading="lazy"
          />
        ))}
      </div>
    </div>
  );
}

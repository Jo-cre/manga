import Topbar from "@/components/Topbar";
import { getManga } from "@/lib/manga/getManga";
import MangaBackground from "@/components/MangaBackground"; // Importe o novo componente

export default async function MangaPage({
  params,
}: {
  params: Promise<{ id: string; locale: string }>;
}) {
  const { id, locale } = await params;
  const data = await getManga(id);

  if (!data)
    return (
      <div className="flex flex-col">
        <Topbar />
        <div>Not found</div>
      </div>
    );

  const title = data.attributes.title[locale] || data.attributes.title["en"];

  return (
    <div className="flex flex-1 flex-col relative min-h-screen">
      <Topbar />

      {/* Parallax background */}
      <MangaBackground src={data.attributes.links["cover"]} alt={title} />

      <div className="relative h-[90vh] w-full flex items-center justify-center">
        <h1 className="absolute bottom-2 left-2 text-white text-6xl font-black uppercase text-center px-4">
          {title}
        </h1>
      </div>

      <div className="relative bg-background min-h-screen border dark:shadow-[0_-50px_100vw_rgba(0,0,0,1)]">
        {data.attributes.description && (
          <p className="text-muted-foreground text-start p-8">
            {data.attributes.description[locale] ||
              data.attributes.description["en"]}
          </p>
        )}
      </div>
    </div>
  );
}

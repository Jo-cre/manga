import Topbar from "@/components/Topbar";
import { getManga } from "@/lib/manga/getManga";
import MangaBackground from "@/components/manga/MangaBackground";
import { MangaContent } from "@/components/manga/MangaContent";

export default async function MangaPage({
  params,
}: {
  params: Promise<{ id: string; locale: string }>;
}) {
  const { id, locale } = await params;
  const data = await getManga(id);

  if (!data)
    return (
      <div className="flex flex-col flex-1 min-h-screen">
        <Topbar />
        <div className="min-h-screen flex flex-col items-center justify-center text-2xl">
          Not found
        </div>
      </div>
    );

  return (
    <div className="flex flex-1 flex-col relative min-h-screen">
      <Topbar />

      {/* Parallax background */}
      <MangaBackground src={data.attributes.links["cover"]} alt={data.id} />

      <MangaContent data={data} locale={locale} />
    </div>
  );
}

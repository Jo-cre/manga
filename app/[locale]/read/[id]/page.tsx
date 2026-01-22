import PageRender from "@/components/manga/PageRender";
import Topbar from "@/components/Topbar";
import { AtHomeResponse } from "@/lib/manga/types";

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
      <PageRender pages={pages} />
    </div>
  );
}

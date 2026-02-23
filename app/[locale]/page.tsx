import MangaCarousel from "@/components/manga/MangaCarousel";
import Topbar from "@/components/Topbar";
import { Manga } from "@/lib/manga/types";
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { readingProgress } from "@/lib/user/types";
import { getTranslations } from "next-intl/server";

export default async function Home() {
  const session = await getServerSession(authOptions);
  const t = await getTranslations("home");

  const popularRes: Response = await fetch(
    `${process.env.API_URL}/api/manga/popular`,
    {
      next: { revalidate: 300 },
    },
  );

  if (!popularRes.ok) {
    throw new Error("Network response was not ok");
  }
  const popularMangas: { data: Manga[] } = await popularRes.json();

  const newRes: Response = await fetch(`${process.env.API_URL}/api/manga/new`, {
    next: { revalidate: 300 },
  });

  if (!popularRes.ok) {
    throw new Error("Network response was not ok");
  }
  const newMangas: { data: Manga[] } = await newRes.json();

  const progressMangas: { data: Manga[] } = { data: [] };
  if (session) {
    const progressRes: Response = await fetch(
      `${process.env.API_URL}/api/user/progress/${session.user.id}/manga`,
    );

    if (!progressRes.ok) {
      throw new Error("Network response was not ok");
    }

    const mangas: readingProgress[] = await progressRes.json();
    if (mangas && mangas.length > 0) {
      progressMangas.data = await Promise.all(
        mangas.map(async (p) => {
          const res = await fetch(
            `${process.env.API_URL}/api/manga/${p.mangaId}`,
            {
              next: { revalidate: 60 },
            },
          );
          const json = await res.json();
          return json.data;
        }),
      );
      progressMangas.data = await Promise.all(progressMangas.data);
    }
  }

  return (
    <div className="flex flex-1 flex-col">
      <Topbar />
      <MangaCarousel title={t("popular")} data={popularMangas.data} type="lg" />
      {session && progressMangas.data.length > 0 && (
        <MangaCarousel
          title={t("continue")}
          data={progressMangas.data}
          type="md"
        />
      )}
      <MangaCarousel title={t("new")} data={newMangas.data} type="sm" />
    </div>
  );
}

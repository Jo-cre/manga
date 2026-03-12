import MangaCarousel from "@/components/manga/MangaCarousel";
import Topbar from "@/components/Topbar";
import { Manga } from "@/lib/manga/types";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { readingProgress } from "@/lib/user/types";
import { getTranslations } from "next-intl/server";

export default async function Home() {
  const session = await getServerSession(authOptions);
  const t = await getTranslations("home");

  const progressMangas: { data: Manga[] } = { data: [] };
  const userProgress: { data: readingProgress[] } = { data: [] };

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

  if (session) {
    const progressRes: Response = await fetch(
      `${process.env.API_URL}/api/user/progress/${session.user.id}/manga`,
    );

    if (!progressRes.ok) {
      throw new Error("Network response was not ok");
    }

    userProgress.data = await progressRes.json();
    if (userProgress && userProgress.data.length > 0) {
      progressMangas.data = await Promise.all(
        userProgress.data.map(async (p) => {
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

      userProgress.data.sort((a, b) => {
        return (
          new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
        );
      });

      progressMangas.data = (await Promise.all(progressMangas.data)).sort(
        (a, b) => {
          const aProgress = userProgress.data.find((m) => m.mangaId === a.id);
          const bProgress = userProgress.data.find((m) => m.mangaId === b.id);
          if (!aProgress || !bProgress) return 0;
          return (
            new Date(bProgress.updatedAt).getTime() -
            new Date(aProgress.updatedAt).getTime()
          );
        },
      );
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
          progressData={userProgress.data}
          type="chapter"
        />
      )}
      <MangaCarousel title={t("new")} data={newMangas.data} type="sm" />
    </div>
  );
}

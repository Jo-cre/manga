"use client";
import Topbar from "@/components/Topbar";
import { searchManga } from "@/lib/manga/getManga";
import { MangaSearchResult } from "@/lib/manga/types";
import { getLibrary } from "@/lib/user/library";
import { Library } from "@/lib/user/types";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function LibraryPage() {
  const { data: session } = useSession();
  const router = useRouter();

  const [library, setLibrary] = useState<Library[] | null>(null);
  const [mangas, setMangas] = useState<(MangaSearchResult | null)[] | null>(
    null,
  );

  useEffect(() => {
    if (!session?.user?.id) return;
    const fetchLibrary = async () => {
      const libdata = await getLibrary(session.user.id);
      if (!libdata) return;
      setLibrary(libdata);
    };
    fetchLibrary();
  }, [session?.user.id]);

  useEffect(() => {
    if (!library || !session?.user.id) return;

    const fetchMangas = async () => {
      const promises = library.map((i) => searchManga(i.mangaId));

      const lmangas = await Promise.all(promises);

      setMangas(lmangas);
    };
    fetchMangas();
  }, [library, session]);

  return (
    <div className="flex flex-1 flex-col">
      <Topbar margin />
      {mangas && (
        <div className="p-4">
          <div className="grid grid-cols-[repeat(auto-fill,minmax(140px,1fr))] gap-4">
            {mangas?.map((m) => {
              if (!m) return;
              return (
                <div
                  key={m.id}
                  className="group rounded-lg hover:scale-105 border bg-background overflow-hidden transition hover:shadow-md"
                  onClick={() => router.push(`/manga/${m?.id}`)}
                >
                  <div className="relative aspect-2/3 bg-muted">
                    {m?.cover && (
                      <Image
                        src={m.cover!}
                        alt={m.title!}
                        fill
                        className="object-cover transition"
                      />
                    )}
                  </div>
                  <div className="p-2 space-y-1">
                    <h3 className="text-sm font-medium line-clamp-2">
                      {m.title}
                    </h3>
                    <span className="text-xs text-muted-foreground capitalize">
                      {m.status}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {!mangas && <p className="text-sm text-muted-foreground mt-4"></p>}
        </div>
      )}
    </div>
  );
}

import Topbar from "@/components/Topbar";
import { Skeleton } from "@/components/ui/skeleton";
import { getTranslations } from "next-intl/server";

export default async function Loading() {
  const t = await getTranslations("home");
  return (
    <div className="flex flex-1 flex-col">
      <Topbar />

      <Skeleton className="w-full h-105 rounded-none" />
      <h1 className="text-3xl p-4 pt-8 font-bold mb-4 absolute">
        {t("popular")}
      </h1>
      <h1 className="text-3xl p-4 pt-8 font-bold mb-4 z-2">{t("new")}</h1>
      <div className="w-full px-4 flex gap-4 overflow-hidden">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="basis-full sm:basis-1/3 lg:basis-1/6">
            <div className="relative w-full aspect-[1/1.414] rounded-md overflow-hidden">
              <Skeleton className="h-full w-full" />
            </div>
            <div className="mt-2 space-y-2">
              <Skeleton className="h-4 w-[85%]" />
              <Skeleton className="h-4 w-[50%]" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

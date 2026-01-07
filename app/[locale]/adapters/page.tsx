"use client";
import Topbar from "@/components/Topbar";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { useMangaSources } from "@/hooks/use-manga-sources";
import { MANGA_SOURCES } from "@/manga/sources";
import Link from "next/link";

export default function AdaptersPage() {
  const { isEnabled, toggle } = useMangaSources();
  return (
    <div className="flex flex-1 flex-col">
      <Topbar margin />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 py-4 px-8">
        {MANGA_SOURCES.map((source) => (
          <Card
            key={source.id}
            className="flex flex-row items-center justify-between p-4"
          >
            <div>
              {source.url ? (
                <Link href={source.url} target="_blank">
                  <p className="font-medium underline">{source.name}</p>
                </Link>
              ) : (
                <p className="font-medium">{source.name}</p>
              )}

              {source.description && (
                <p className="text-sm text-muted-foreground">
                  {source.description}
                </p>
              )}
            </div>

            <Switch
              checked={isEnabled(source.id)}
              onCheckedChange={() => toggle(source.id)}
            />
          </Card>
        ))}
      </div>
    </div>
  );
}

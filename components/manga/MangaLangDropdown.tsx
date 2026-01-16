"use client";

import { cn, getFlagByCode } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Manga } from "@/lib/manga/types";
import Image from "next/image";

export default function MangaLangDropdown({
  lang,
  setLang,
  avaliableLangs,
  className,
}: {
  lang: string;
  setLang: (lang: string) => void;
  avaliableLangs: Manga["attributes"]["availableTranslatedLanguages"];
  className?: string;
}) {
  return (
    <div className={cn("w-27", className)}>
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger
          className="outline-none border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50
        px-3 py-2 rounded-md text-sm font-black uppercase flex items-center content-center gap-2 text-center w-full"
        >
          <div className="flex items-center content-center m-auto gap-2">
            {getFlagByCode(lang) != null && (
              <Image
                src={getFlagByCode(lang)!}
                alt={lang}
                width={30}
                height={30}
              />
            )}
            {lang}
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="font-black uppercase">
          {avaliableLangs.map((l) => (
            <DropdownMenuItem key={l} onClick={() => setLang(l)}>
              <div>
                {getFlagByCode(l) != null && (
                  <Image
                    src={getFlagByCode(l)!}
                    alt={l}
                    width={30}
                    height={30}
                  />
                )}
              </div>
              {l}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

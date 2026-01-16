import { cn } from "@/lib/utils";
import Image from "next/image";
import { Label } from "../ui/label";
import { useRouter } from "next/navigation";
import { Tooltip, TooltipTrigger } from "../ui/tooltip";
import { TooltipContent } from "../ui/tooltip";
import { Badge } from "../ui/badge";
import { MangaSearchResult } from "@/lib/manga/types";

export default function MangaButton({
  data,
  className,
}: {
  data: MangaSearchResult;
  className?: string;
}) {
  const router = useRouter();

  return (
    <div
      className={`${cn(
        className
      )} relative flex flex-row bg-muted hover:bg-muted-foreground/16 h-20 rounded-md`}
      onClick={() => router.push(`/manga/${data.id}`)}
    >
      {/* Capa */}
      <div className="relative overflow-hidden h-full w-14 rounded-sm shrink-0">
        {data.cover && (
          <Image
            src={data.cover}
            alt={`avatar-${data.id}`}
            className="object-cover"
            fill
          />
        )}
      </div>

      {/* Texto */}
      <div className="relative p-2 flex flex-col flex-1 h-full min-w-0">
        <Tooltip>
          <TooltipTrigger className="min-w-0">
            <Label className="font-bold text-xl truncate block text-left">
              {data.title}
            </Label>
          </TooltipTrigger>
          <TooltipContent>
            <Label>{data.title}</Label>
          </TooltipContent>
        </Tooltip>
        <Badge
          className="absolute bottom-2 left-2 rounded-sm"
          variant={"outline"}
        >
          {data.status}
        </Badge>
      </div>
    </div>
  );
}

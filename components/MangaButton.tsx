import { cn } from "@/lib/utils";
import { Button } from "./ui/button";
import Image from "next/image";
import { Label } from "./ui/label";
import { Badge } from "./ui/badge";
import { useRouter } from "next/navigation";

interface mangaData {
  id: string;
  title: string;
  cover: string | null;
  adapterId: string;
}

export default function MangaButton({
  data,
  className,
}: {
  data: mangaData;
  className?: string;
}) {
  const router = useRouter();

  return (
    <Button
      className={`${cn(className)} relative bg-accent hover:bg-muted h-13`}
      onClick={() => router.push(`/manga/${data.id}`)}
    >
      <div className="relative rounded-full overflow-hidden w-10 h-10 mr-auto">
        {data.cover && (
          <Image
            src={data.cover}
            alt={`avatar-${data.id}`}
            className="rounded-full object-cover"
            fill
          />
        )}
      </div>
      <Label className="font-bold text-xl absolute left-16">{data.title}</Label>
      <Badge className="font-bold absolute right-4 rounded-sm bg-foreground text-background">
        {data.adapterId}
      </Badge>
    </Button>
  );
}

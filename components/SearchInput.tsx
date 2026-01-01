import { useEffect, useState } from "react";
import { Popover, PopoverTrigger } from "./ui/popover";
import { Search } from "lucide-react";
import { PopoverContent } from "@radix-ui/react-popover";
import { Card } from "./ui/card";
import UserButton from "./UserButton";
import { Label } from "./ui/label";
import { useTranslations } from "next-intl";
import { Skeleton } from "./ui/skeleton";

interface userData {
  id: string;
  name: string;
  role: string;
  image: string;
  banner?: string;
  createdAt?: Date;
}

export default function SearchInput() {
  const [userOpen, setUserOpen] = useState(false);
  const [text, setText] = useState<string | null>(null);
  const [debounced, setDebounced] = useState(text);
  const [userItems, setUserItems] = useState<userData[] | []>([]);
  const [loading, setLoading] = useState(false);

  const t = useTranslations("Search");

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebounced(text);
    }, 400);

    return () => {
      clearTimeout(handler);
    };
  }, [text]);

  useEffect(() => {
    if (!debounced || debounced.length < 2) {
      // eslint-disable-next-line react-hooks/exhaustive-deps
      setUserItems((prev) => (prev.length ? [] : prev));
      return;
    }
    setLoading(true);

    fetch(`/api/user?text=${encodeURIComponent(debounced)}`)
      .then((res) => res.json())
      .then(setUserItems)

      .finally(() => {
        setLoading(false);
      });
  }, [debounced]);

  return (
    <div className="relative flex flex-1">
      {userOpen && (
        <div
          className="fixed inset-0 z-10 bg-black/40 backdrop-blur-sm transition-opacity"
          onClick={() => setUserOpen(false)}
        />
      )}

      <Popover open={userOpen}>
        <PopoverTrigger
          className={`relative z-20 ml-auto mr-8 bg-accent rounded-md flex items-center transition-all duration-300
      ${userOpen ? "w-2/3" : "w-68"}
    `}
        >
          <input
            type="text"
            className="w-full border-none outline-none px-3 py-1 bg-transparent"
            onChange={(e) => setText(e.target.value)}
            onFocus={() => setUserOpen(true)}
          />
          <Search className="absolute right-2 pointer-events-none p-0.5" />
        </PopoverTrigger>

        <PopoverContent
          onOpenAutoFocus={(e) => e.preventDefault()}
          align="start"
          sideOffset={8}
          className="z-20 mt-2 p-0 w-(--radix-popover-trigger-width) max-h-[90vh] transition-all duration-200 overflow-auto"
        >
          <Card className="border-none gap-y-2.5 p-4">
            {loading && (
              <div className="flex flex-row space-y-3">
                <Skeleton className="h-30 w-20 rounded-xl" />
                <div className="space-y-2 p-2 flex flex-1 flex-col">
                  <Skeleton className="h-6 w-full" />
                  <Skeleton className="h-6 w-6/7" />
                  <Skeleton className="h-6 w-4/5" />
                </div>
              </div>
            )}
            {userItems.length > 0 && (
              <Label className="font-bold text-2xl">{t("users")}</Label>
            )}
            {userItems.map((item, i) => (
              <UserButton data={item} key={i + "_" + item} />
            ))}
          </Card>
        </PopoverContent>
      </Popover>
    </div>
  );
}

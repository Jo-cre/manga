"use client";

import { signOut, useSession } from "next-auth/react";
import SidebarButton from "./SidebarButton";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Label } from "@radix-ui/react-dropdown-menu";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";
import {
  SettingsIcon,
  User,
  Check,
  LogOutIcon,
  PaintbrushIcon,
  Bookmark,
  ListPlus,
} from "lucide-react";
import {
  Command,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from "@/components/ui/command";
import { Separator } from "./ui/separator";
import { useEffect, useState } from "react";
import SearchInput from "./SearchInput";
import Image from "next/image";
import { Badge } from "./ui/badge";
import { useTranslations } from "next-intl";

export default function Topbar() {
  const { setTheme, theme: currentTheme } = useTheme();
  const { data: session } = useSession();
  const [themeOpen, setThemeOpen] = useState(false);
  const [userOpen, setUserOpen] = useState(false);

  const t = useTranslations("TopBar.userPopover");

  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", onScroll);
    onScroll();

    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const themes = [
    { name: "Light", value: "light" },
    { name: "Dark", value: "dark" },
    { name: "Dracula", value: "dracula" },
    { name: "Nord", value: "nord" },
    { name: "Solarized", value: "solarized" },
    { name: "System", value: "system" },
  ];

  return (
    <div
      className={cn(
        "sticky top-0 z-10 h-13 -mb-13 flex flex-1 items-center px-4 py-1.5 transition-all duration-300",
        scrolled ? "bg-sidebar" : "bg-transparent"
      )}
    >
      <SidebarButton />
      <SearchInput />
      {userOpen && (
        <div
          className="fixed inset-0 z-0 bg-black/40 backdrop-blur-sm transition-opacity"
          onClick={() => setUserOpen(false)}
        />
      )}
      <Popover open={userOpen} onOpenChange={setUserOpen}>
        <PopoverTrigger asChild>
          <div
            className="w-10 h-10 z-10 ml-auto mr-4 rounded-full hover:bg-muted/50 transition"
            onClick={() => {
              if (!session && window.location.pathname !== "/login") {
                window.location.href = "/login";
              }
            }}
          >
            {session && session.user?.image ? (
              <Image
                src={session.user.image}
                alt="User Avatar"
                className="w-full h-full rounded-full"
                width={40}
                height={40}
              />
            ) : (
              <User className="w-full h-full rounded-full" />
            )}
          </div>
        </PopoverTrigger>
        {session && (
          <PopoverContent
            className="m-2 mr-8 w-80 px-6 flex flex-col items-center content-center overflow-y-auto"
            style={{
              maxHeight: "calc(100vh - (52px * 2))",
            }}
          >
            {/* User div */}
            <div className="w-full h-24 px-4 flex flex-row items-center content-center">
              {session && session.user?.image ? (
                <Image
                  src={session.user.image}
                  alt="User Avatar"
                  className="w-16 h-16 rounded-full"
                  width={96}
                  height={96}
                />
              ) : (
                <User className="w-full h-full rounded-full" />
              )}
              {session && session.user?.role && session.user?.name ? (
                <div className="flex flex-1 h-full gap-2 relative overflow-x-auto">
                  <Label
                    className="block w-full text-center font-bold m-auto 
                                text-[clamp(1.25rem,12cqw,2.25rem)]
                                truncate whitespace-nowrap overflow-hidden"
                    title={session?.user?.name || ""}
                  >
                    {session?.user?.name}
                  </Label>
                  <Badge className="bg-foreground text-background font-bold rounded-md absolute bottom-0 right-0">
                    {session.user.role}
                  </Badge>
                </div>
              ) : null}
            </div>
            <Separator className="my-3 w-full" />
            {/* Miscellaneous div */}
            <div className="w-full flex flex-col font-bold">
              <button
                className="flex-1 outline-none bg-transparent border-none flex flex-row gap-2 items-center justify-start hover:bg-muted/50 rounded-md p-2 transition"
                onClick={() => (window.location.href = "/user/me")}
              >
                <User size={20} className="ml-3.5" />
                <span className="mb-1 ml-[-2]">{t("profile")}</span>
              </button>
              <button
                className="flex-1 outline-none bg-transparent border-none flex flex-row gap-2 items-center justify-start hover:bg-muted/50 rounded-md p-2 transition"
                onClick={() => (window.location.href = "/user/saved")}
              >
                <Bookmark size={20} className="ml-3.5" />
                <span className="mb-1 ml-[-2]">{t("saved")}</span>
              </button>
              <button
                className="flex-1 outline-none bg-transparent border-none flex flex-row gap-2 items-center justify-start hover:bg-muted/50 rounded-md p-2 transition"
                onClick={() => (window.location.href = "/adapters")}
              >
                <ListPlus size={20} className="ml-3.5" />
                <span className="mb-1 ml-[-2]">{t("adapters")}</span>
              </button>
            </div>
            <Separator className="my-3 w-full" />
            {/* Options div */}
            <div className="w-full flex flex-col font-bold">
              <div className="w-full flex flex-row gap-2">
                <button
                  className="flex-1 outline-none bg-transparent border-none flex flex-row gap-2 items-center justify-start hover:bg-muted/50 rounded-md p-2 transition"
                  onClick={() => (window.location.href = "/settings")}
                >
                  <SettingsIcon size={20} className="ml-3.5" />
                  <span className="mb-1 ml-[-2]">{t("settings")}</span>
                </button>
                <Popover open={themeOpen} onOpenChange={setThemeOpen}>
                  <PopoverTrigger asChild>
                    <button className="flex-1 outline-none bg-transparent border-none flex flex-row gap-2 items-center justify-center hover:bg-muted/50 rounded-md p-2 transition">
                      <PaintbrushIcon size={20} />
                      <span className="mb-1">{t("theme")}</span>
                    </button>
                  </PopoverTrigger>
                  <PopoverContent className="m-0 p-0 mr-8 w-56">
                    <Command>
                      <CommandInput
                        placeholder={t("searchTheme")}
                        className="h-9"
                      />
                      <CommandList>
                        <CommandEmpty>{t("noTheme")}</CommandEmpty>
                        <CommandGroup>
                          {themes.map((t) => (
                            <CommandItem
                              key={t.value}
                              value={t.value}
                              onSelect={(v) => {
                                setTheme(v);
                                setThemeOpen(false);
                              }}
                            >
                              {t.name}
                              <Check
                                className={cn(
                                  "ml-auto",
                                  currentTheme === t.value
                                    ? "opacity-100"
                                    : "opacity-0"
                                )}
                              />
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
              </div>
              <button
                className="flex-1 outline-none bg-transparent border-none flex flex-row gap-2 items-center justify-start hover:bg-muted/50 rounded-md p-2 transition"
                onClick={() => signOut({ callbackUrl: "/" })}
              >
                <LogOutIcon size={20} className="ml-3.5" />
                <span className="mb-1 ml-[-2]">{t("logOut")}</span>
              </button>
            </div>
          </PopoverContent>
        )}
      </Popover>
    </div>
  );
}

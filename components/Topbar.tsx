"use client";

import { signOut, useSession } from "next-auth/react";
import SidebarButton from "./SidebarButton";
import { useSidebar } from "./ui/sidebar";
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
  Sun,
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
import React from "react";
import SearchInput from "./SearchInput";

export default function Topbar() {
  const { setTheme, theme: currentTheme } = useTheme();
  const { data: session } = useSession();
  const [themeOpen, setThemeOpen] = React.useState(false);
  const width = useSidebar().open ? "calc(100% - 16rem)" : "100%";
  const [userOpen, setUserOpen] = React.useState(false);

  const [scrolled, setScrolled] = React.useState(false);

  React.useEffect(() => {
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
        "fixed z-10 h-13 flex items-center px-4 py-1.5 transition-all duration-300",
        scrolled ? "bg-sidebar" : "bg-transparent"
      )}
      style={{ width }}
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
              <img
                src={session.user.image}
                alt="User Avatar"
                className="w-full h-full rounded-full"
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
            <div className="w-24 h-24 flex flex-col items-center content-center">
              {session && session.user?.image ? (
                <img
                  src={session.user.image}
                  alt="User Avatar"
                  className="w-16 h-16 rounded-full"
                />
              ) : (
                <User className="w-full h-full rounded-full" />
              )}
              <Label className="p-2 text-xl font-bold">
                {session?.user?.name}
              </Label>
            </div>
            <Separator className="my-3 w-full" />
            {/* Miscellaneous div */}
            <div className="w-full flex flex-col font-bold">
              <button
                className="flex-1 outline-none bg-transparent border-none flex flex-row gap-2 items-center justify-start hover:bg-muted/50 rounded-md p-2 transition"
                onClick={() => (window.location.href = "/user/me")}
              >
                <User size={20} className="ml-3.5" />
                <span className="mb-1 ml-[-2]">Profile</span>
              </button>
              <button
                className="flex-1 outline-none bg-transparent border-none flex flex-row gap-2 items-center justify-start hover:bg-muted/50 rounded-md p-2 transition"
                onClick={() => (window.location.href = "/user/saved")}
              >
                <Bookmark size={20} className="ml-3.5" />
                <span className="mb-1 ml-[-2]">Saved</span>
              </button>
              <button
                className="flex-1 outline-none bg-transparent border-none flex flex-row gap-2 items-center justify-start hover:bg-muted/50 rounded-md p-2 transition"
                onClick={() => (window.location.href = "/user/me")}
              >
                <ListPlus size={20} className="ml-3.5" />
                <span className="mb-1 ml-[-2]">Browse fonts</span>
              </button>
            </div>
            <Separator className="my-3 w-full" />
            {/* Options div */}
            <div className="w-full flex flex-col font-bold">
              <div className="w-full flex flex-row gap-2">
                <button
                  className="flex-1 outline-none bg-transparent border-none flex flex-row gap-2 items-center justify-center hover:bg-muted/50 rounded-md p-2 transition"
                  onClick={() => (window.location.href = "/settings")}
                >
                  <SettingsIcon size={20} />
                  <span className="mb-1">Settings</span>
                </button>
                <Popover open={themeOpen} onOpenChange={setThemeOpen}>
                  <PopoverTrigger asChild>
                    <button className="flex-1 outline-none bg-transparent border-none flex flex-row gap-2 items-center justify-center hover:bg-muted/50 rounded-md p-2 transition">
                      <PaintbrushIcon size={20} />
                      <span className="mb-1">Theme</span>
                    </button>
                  </PopoverTrigger>
                  <PopoverContent className="m-0 p-0 mr-8 w-56">
                    <Command>
                      <CommandInput
                        placeholder="Search theme..."
                        className="h-9"
                      />
                      <CommandList>
                        <CommandEmpty>Any theme founded.</CommandEmpty>
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
                onClick={() => signOut()}
              >
                <LogOutIcon size={20} className="ml-3.5" />
                <span className="mb-1 ml-[-2]">LogOut</span>
              </button>
            </div>
          </PopoverContent>
        )}
      </Popover>
    </div>
  );
}

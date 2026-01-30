import { signIn, signOut, useSession } from "next-auth/react";
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
import { useState } from "react";
import Image from "next/image";
import { Badge } from "./ui/badge";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useSidebar } from "./ui/sidebar";
import { FaDiscord, FaGithubAlt, FaGoogle } from "react-icons/fa6";
import { Button } from "./ui/button";

export function UserPopover() {
  const t = useTranslations("TopBar.userPopover");
  const router = useRouter();
  const { toggleSidebar } = useSidebar();

  const { data: session } = useSession();
  const { setTheme, theme: currentTheme } = useTheme();
  const [themeOpen, setThemeOpen] = useState(false);

  const themes = [
    { name: "Light", value: "light" },
    { name: "Dark", value: "dark" },
    { name: "Dracula", value: "dracula" },
    { name: "Nord", value: "nord" },
    { name: "Solarized", value: "solarized" },
    { name: "System", value: "system" },
  ];

  if (!session) return;

  return (
    <PopoverContent
      className="m-2 mr-8 w-80 px-6 flex flex-col items-center content-center overflow-y-auto"
      style={{ maxHeight: "calc(100vh - (52px * 2))" }}
    >
      <div className="w-full h-24 px-4 flex flex-row items-center content-center">
        {session.user?.image ? (
          <Image
            src={session.user.image}
            alt="User Avatar"
            className="w-16 h-16 rounded-full object-cover"
            width={96}
            height={96}
          />
        ) : (
          <User className="w-full h-full rounded-full" />
        )}
        <div className="flex flex-1 h-full gap-2 relative overflow-x-auto">
          <Label
            className="block w-full text-center font-bold m-auto text-[clamp(1.25rem,12cqw,2.25rem)] truncate whitespace-nowrap overflow-hidden"
            title={session?.user?.name || ""}
          >
            {session?.user?.name}
          </Label>
          {session.user?.role && (
            <Badge className="bg-foreground text-background font-bold rounded-md absolute bottom-0 right-0">
              {session.user.role}
            </Badge>
          )}
        </div>
      </div>
      <Separator className="my-3 w-full" />
      <div className="w-full flex flex-col font-bold">
        <button
          className="flex-1 outline-none bg-transparent border-none flex flex-row gap-2 items-center justify-start hover:bg-muted/50 rounded-md p-2 transition"
          onClick={() => router.push(`/user/${session.user.id}`)}
        >
          <User size={20} className="ml-3.5" />
          <span className="mb-1 ml-[-2]">{t("profile")}</span>
        </button>
        <button
          className="flex-1 outline-none bg-transparent border-none flex flex-row gap-2 items-center justify-start hover:bg-muted/50 rounded-md p-2 transition"
          onClick={() => router.push("/user/saved")}
        >
          <Bookmark size={20} className="ml-3.5" />
          <span className="mb-1 ml-[-2]">{t("saved")}</span>
        </button>
      </div>
      <Separator className="my-3 w-full" />
      <div className="w-full flex flex-col font-bold">
        <div className="w-full flex flex-row gap-2">
          <button
            className="flex-1 outline-none bg-transparent border-none flex flex-row gap-2 items-center justify-start hover:bg-muted/50 rounded-md p-2 transition"
            onClick={() => {
              toggleSidebar();
            }}
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
                <CommandInput placeholder={t("searchTheme")} className="h-9" />
                <CommandList>
                  <CommandEmpty>{t("noTheme")}</CommandEmpty>
                  <CommandGroup>
                    {themes.map((theme) => (
                      <CommandItem
                        key={theme.value}
                        value={theme.value}
                        onSelect={(v) => {
                          setTheme(v);
                          setThemeOpen(false);
                        }}
                      >
                        {theme.name}
                        <Check
                          className={cn(
                            "ml-auto",
                            currentTheme === theme.value
                              ? "opacity-100"
                              : "opacity-0",
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
          onClick={() => signOut({ callbackUrl: window.location.href })}
        >
          <LogOutIcon size={20} className="ml-3.5" />
          <span className="mb-1 ml-[-2]">{t("logOut")}</span>
        </button>
      </div>
    </PopoverContent>
  );
}

type Provider = "google" | "github" | "discord";

function handleSignIn(provider: Provider) {
  signIn(provider, { callbackUrl: window.location.href });
}

export function LoginPopover() {
  const t = useTranslations("TopBar.userPopover");

  const methods = [
    {
      provider: "Google",
      icon: FaGoogle,
      action: () => handleSignIn("google"),
    },
    {
      provider: "Discord",
      icon: FaDiscord,
      action: () => handleSignIn("discord"),
    },
    {
      provider: "Github",
      icon: FaGithubAlt,
      action: () => handleSignIn("github"),
    },
  ];

  return (
    <PopoverContent className="w-auto">
      <Label className="text-center font-bold text-2xl">{t("login")}</Label>
      {methods.map((m, i) => (
        <Button
          key={m.provider + i}
          variant="outline"
          className="flex flex-1 w-full text-xl h-10 my-1 items-center justify-start"
          onClick={m.action}
        >
          <m.icon className="size-6 mr-1" />
          {m.provider}
        </Button>
      ))}
    </PopoverContent>
  );
}

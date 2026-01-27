"use client";
import {
  Sidebar as SideBar,
  SidebarContent,
  SidebarHeader,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { useOptions } from "@/hooks/useOptions";
import {
  XIcon,
  GalleryHorizontal,
  GalleryVertical,
  Expand,
  Shrink,
  Mouse,
  GalleryThumbnails,
  ArrowLeft,
  ArrowRight,
  Plus,
  LucideIcon,
} from "lucide-react";
import { useTranslations } from "next-intl";

export function Sidebar() {
  const { toggleSidebar } = useSidebar();
  const t = useTranslations("Sidebar");
  const {
    toggleOrientation,
    toggleSize,
    toggleSide,
    toggleScrollType,
    options,
  } = useOptions();

  const isHorizontal = options.orientation === "horizontal";
  const isNotBar = options.scroll !== "bar";

  const opts = [
    {
      title: t("orientation"),
      action: toggleOrientation,
      icon: getIcon(options.orientation),
      disabled: false,
    },
    {
      title: t("size"),
      action: toggleSize,
      icon: getIcon(options.size),
      disabled: isHorizontal || isNotBar,
    },
    {
      title: t("scrollType"),
      action: toggleScrollType,
      icon: getIcon(options.scroll),
      disabled: false,
    },
    {
      title: t("side"),
      action: toggleSide,
      icon: getIcon(options.side),
      disabled: !isHorizontal,
    },
  ];

  function getIcon(opt: string) {
    const iconMap: Record<string, LucideIcon> = {
      horizontal: GalleryHorizontal,
      vertical: GalleryVertical,
      fit: Shrink,
      full: Expand,
      bar: Mouse,
      carousel: GalleryThumbnails,
      left: ArrowRight,
      right: ArrowLeft,
    };

    return iconMap[opt] || Plus;
  }

  return (
    <SideBar>
      <SidebarHeader>
        <div className="flex items-center justify-center flex-row px-2">
          <h1 className="text-xl ml-auto font-bold">{t("title")}</h1>
          <button
            className="ml-auto p-1 rounded-full hover:bg-muted/50 transition"
            onClick={toggleSidebar}
          >
            <XIcon size={30} />
          </button>
        </div>
      </SidebarHeader>

      <SidebarContent className="gap-2 p-2">
        {opts.map((o) => (
          <SidebarMenuItem key={o.title} className="list-none">
            <button
              className={`flex-1 w-full font-bold bg-transparent border-none flex gap-2 items-center rounded-md p-2 transition
                ${
                  o.disabled
                    ? "opacity-30 cursor-not-allowed grayscale"
                    : "hover:bg-muted/50 cursor-pointer"
                }`}
              onClick={o.disabled ? undefined : o.action}
              disabled={o.disabled}
            >
              {o.title}
              <o.icon className="ml-auto mr-4" />
            </button>
          </SidebarMenuItem>
        ))}
      </SidebarContent>
    </SideBar>
  );
}

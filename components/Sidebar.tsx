"use client";
import {
  Sidebar as SideBar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  useSidebar,
} from "@/components/ui/sidebar";
import { XIcon } from "lucide-react";
import { useTranslations } from "next-intl";

export function Sidebar() {
  const { toggleSidebar } = useSidebar();
  const t = useTranslations("Sidebar");
  return (
    <SideBar>
      <SidebarHeader>
        <div className="flex items-center justify-center flex-row px-2">
          <h1 className="text-xl align-middle ml-auto">{t("title")}</h1>
          <button
            className="ml-auto p-1 rounded-full hover:bg-muted/50 transition"
            onClick={toggleSidebar}
          >
            <XIcon size={30} />
          </button>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup />
        <SidebarGroup />
      </SidebarContent>
      <SidebarFooter></SidebarFooter>
    </SideBar>
  );
}

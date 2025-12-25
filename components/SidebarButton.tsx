import { MenuIcon } from "lucide-react";
import { useSidebar } from "./ui/sidebar";

export default function SidebarButton() {
  const collapsed = useSidebar().open ? false : true;
  const { toggleSidebar } = useSidebar();
  return (
    <button onClick={toggleSidebar} className={collapsed ? "" : "hidden"}>
      <MenuIcon size={30} />
    </button>
  );
}

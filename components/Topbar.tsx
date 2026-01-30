"use client";

import { useSession } from "next-auth/react";
import { Popover, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { User } from "lucide-react";
import { useEffect, useState } from "react";
import SearchInput from "./SearchInput";
import Image from "next/image";
import { LoginPopover, UserPopover } from "./UserPopoverContents";

export default function Topbar({
  margin,
  fixed,
}: {
  margin?: boolean;
  fixed?: boolean;
}) {
  const { data: session } = useSession();
  const [userOpen, setUserOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", onScroll);
    onScroll();

    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      className={cn(
        `${fixed ? "" : "sticky"} top-0 z-10 h-13 flex flex-1 items-center px-4 py-1.5 transition-all duration-300`,
        scrolled ? "bg-sidebar" : "bg-transparent",
        !margin && "-mb-13",
      )}
    >
      <SearchInput />
      {userOpen && (
        <div
          className="fixed inset-0 z-0 bg-black/40 backdrop-blur-sm transition-opacity"
          onClick={() => setUserOpen(false)}
        />
      )}
      <Popover open={userOpen} onOpenChange={setUserOpen}>
        <PopoverTrigger asChild>
          <div className="relative w-10 h-10 z-10 ml-auto mr-4 rounded-full hover:bg-muted/50 transition">
            {session && session.user?.image ? (
              <Image
                src={session.user.image}
                alt="User Avatar"
                fill
                className="rounded-full object-cover"
              />
            ) : (
              <User className="w-full h-full rounded-full" />
            )}
          </div>
        </PopoverTrigger>
        {session ? <UserPopover /> : <LoginPopover />}
      </Popover>
    </div>
  );
}

"use client";
import { SessionProvider } from "next-auth/react";
import { Sidebar } from "./Sidebar";
import { ThemeProvider } from "./ThemeProvider";
import { SidebarProvider } from "./ui/sidebar";
import { Session } from "next-auth";

export function Providers({
  children,
  session,
}: {
  children: React.ReactNode;
  session: Session | null | undefined;
}) {
  return (
    <SessionProvider session={session}>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
        themes={["light", "dark", "dracula", "nord", "solarized"]}
      >
        <SidebarProvider defaultOpen={false}>
          <Sidebar />
          {children}
        </SidebarProvider>
      </ThemeProvider>
    </SessionProvider>
  );
}

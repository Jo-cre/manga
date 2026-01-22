"use client";
import { SessionProvider } from "next-auth/react";
import { Sidebar } from "./Sidebar";
import { ThemeProvider } from "./ThemeProvider";
import { SidebarProvider } from "./ui/sidebar";
import { Session } from "next-auth";
import { NextIntlClientProvider } from "next-intl";
import { OptionsProvider } from "./OptionsProvider";

export function Providers({
  children,
  session,
  locale,
  messages,
}: {
  children: React.ReactNode;
  session: Session | null | undefined;
  locale: string;
  messages: Record<string, unknown>;
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
        <NextIntlClientProvider locale={locale} messages={messages}>
          <OptionsProvider>
            <SidebarProvider defaultOpen={false}>
              <Sidebar />
              {children}
            </SidebarProvider>
          </OptionsProvider>
        </NextIntlClientProvider>
      </ThemeProvider>
    </SessionProvider>
  );
}

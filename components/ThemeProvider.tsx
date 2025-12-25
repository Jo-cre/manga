"use client";

import {
  ThemeProvider as NextThemesProvider,
  ThemeProviderProps,
} from "next-themes";
import { useState, useEffect, ReactNode } from "react";

// Tipagem das propriedades adicionais
interface CustomThemeProviderProps extends ThemeProviderProps {
  children: ReactNode;
}

export function ThemeProvider({
  children,
  ...props
}: CustomThemeProviderProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return <div />; // Esconde até que o tema seja carregado

  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}

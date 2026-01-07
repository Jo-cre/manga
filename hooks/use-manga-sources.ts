"use client";

import { useEffect, useState } from "react";
import { MANGA_SOURCES } from "@/manga/sources";

const STORAGE_KEY = "enabled-manga-sources";

export function useMangaSources() {
  const [enabled, setEnabled] = useState<string[]>([]);

  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      setEnabled(JSON.parse(raw));
    } else {
      setEnabled(MANGA_SOURCES.map((s) => s.id));
    }
  }, []);

  useEffect(() => {
    if (enabled.length) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(enabled));
    }
  }, [enabled]);

  function toggle(id: string) {
    setEnabled((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  }

  function isEnabled(id: string) {
    return enabled.includes(id);
  }

  return {
    enabled,
    toggle,
    isEnabled,
  };
}

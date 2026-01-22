import { OptionsContext } from "@/lib/optionsContext";
import { useContext } from "react";

export function useOptions() {
  const ctx = useContext(OptionsContext);
  if (!ctx) {
    throw new Error("useOptions must be used within OptionsProvider.");
  }
  return ctx;
}

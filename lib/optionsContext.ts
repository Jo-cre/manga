import { createContext } from "react";
import { Options } from "./utils";

interface OptionsContextType {
  options: Options;
  toggleOrientation: () => void;
  toggleSize: () => void;
  toggleSide: () => void;
  toggleScrollType: () => void;
}

export const OptionsContext = createContext<OptionsContextType | null>(null);

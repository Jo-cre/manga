import { useLocalStorage } from "@/hooks/useLocalStorage";
import { OptionsContext } from "@/lib/optionsContext";
import { DEFAULT_OPTIONS } from "@/lib/utils";

export function OptionsProvider({ children }: { children: React.ReactNode }) {
  const [options, setOptions] = useLocalStorage("options", DEFAULT_OPTIONS);

  const toggleOrientation = () => {
    setOptions((prev) => {
      const newOrientation =
        prev.orientation === "vertical" ? "horizontal" : "vertical";

      return {
        ...prev,
        orientation: newOrientation,
        size: newOrientation === "horizontal" ? "fit" : prev.size,
      };
    });
  };

  const toggleSize = () => {
    setOptions((prev) => {
      if (prev.orientation === "horizontal" || prev.scroll === "carousel") {
        return prev;
      }

      return {
        ...prev,
        size: prev.size === "fit" ? "full" : "fit",
      };
    });
  };

  const toggleSide = () => {
    setOptions((prev) => {
      if (prev.orientation === "vertical") {
        return prev;
      }

      return {
        ...prev,
        side: prev.side === "left" ? "right" : "left",
      };
    });
  };

  const toggleScrollType = () => {
    setOptions((prev) => {
      return {
        ...prev,
        scroll: prev.scroll === "bar" ? "carousel" : "bar",
      };
    });
  };

  return (
    <OptionsContext.Provider
      value={{
        options,
        toggleOrientation,
        toggleSize,
        toggleSide,
        toggleScrollType,
      }}
    >
      {children}
    </OptionsContext.Provider>
  );
}

import { useLocalStorage } from "@/hooks/useLocalStorage";
import { OptionsContext } from "@/lib/optionsContext";
import { DEFAULT_OPTIONS } from "@/lib/utils";

export function OptionsProvider({ children }: { children: React.ReactNode }) {
  const [options, setOptions] = useLocalStorage("options", DEFAULT_OPTIONS);

  const toggleOrientation = () => {
    setOptions((prev) => {
      const isNowVertical = prev.orientation === "horizontal";

      return {
        ...prev,
        orientation: isNowVertical ? "vertical" : "horizontal",
        side: isNowVertical ? "left" : prev.side,
        size: !isNowVertical ? "fit" : prev.size,
      };
    });
  };

  const toggleSize = () => {
    setOptions((prev) => {
      if (prev.orientation === "horizontal" || prev.scroll !== "bar")
        return prev;

      const newSize = prev.size === "fit" ? "full" : "fit";

      return {
        ...prev,
        size: newSize,
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
      const isNowCarousel = prev.scroll === "bar";

      return {
        ...prev,
        scroll: isNowCarousel ? "carousel" : "bar",
        size: isNowCarousel ? "fit" : prev.size,
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

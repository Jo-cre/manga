import { useState, useEffect } from "react";

export function useHideCursor(timeout: number = 3000) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    let timer: NodeJS.Timeout;

    const handleMouseMove = () => {
      setVisible(true);

      clearTimeout(timer);

      timer = setTimeout(() => {
        setVisible(false);
      }, timeout);
    };

    window.addEventListener("mousemove", handleMouseMove);

    timer = setTimeout(() => setVisible(false), timeout);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      clearTimeout(timer);
    };
  }, [timeout]);

  return visible;
}

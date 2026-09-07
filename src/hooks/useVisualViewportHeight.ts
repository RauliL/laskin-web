import { useEffect, useState } from "react";

/** Tracks visible viewport height, accounting for mobile on-screen keyboards. */
export const useVisualViewportHeight = (): number => {
  const [height, setHeight] = useState(
    () => window.visualViewport?.height ?? window.innerHeight,
  );

  useEffect(() => {
    const viewport = window.visualViewport;
    if (!viewport) {
      return;
    }

    const update = () => {
      setHeight(viewport.height);
      window.scrollTo(0, 0);
    };

    viewport.addEventListener("resize", update);
    viewport.addEventListener("scroll", update);
    update();

    return () => {
      viewport.removeEventListener("resize", update);
      viewport.removeEventListener("scroll", update);
    };
  }, []);

  return height;
};

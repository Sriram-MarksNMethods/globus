"use client";

import { useEffect, useState } from "react";

/* Current window width, updated on resize.
   Only the width: on phones the height changes whenever the address bar slides in or out,
   and re-drawing a whole section for that would stutter the scroll. */
export function useViewportWidth() {
  const [width, setWidth] = useState(1440);

  useEffect(() => {
    function update() {
      setWidth(window.innerWidth);
    }
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  return width;
}

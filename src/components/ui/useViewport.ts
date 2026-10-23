"use client";

import { useEffect, useState } from "react";

/* Current window width and height, updated on resize. */
export function useViewport() {
  const [size, setSize] = useState({ width: 1440, height: 900 });

  useEffect(() => {
    function update() {
      setSize({ width: window.innerWidth, height: window.innerHeight });
    }
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  return size;
}

"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { ReactLenis, useLenis } from "lenis/react";

/* Smooth, weighted scrolling for the whole page, tuned to match aircenter.space
   (measured: one 100px wheel notch moves their page 48px and settles in ~0.7s).
   lerp: how quickly the page catches up with the wheel each frame; lower feels floatier.
   wheelMultiplier: how far one wheel notch moves the page; smaller steps look smoother.
   Touch scrolling stays native on phones. */
export function SmoothScroll({ children }: { children: React.ReactNode }) {
  return (
    <ReactLenis root options={{ lerp: 0.1, wheelMultiplier: 0.5 }}>
      <StartAtTop />
      {children}
    </ReactLenis>
  );
}

/* Every link to a page lands at the top of that page:
   - after moving to another page (Next.js plus smooth scrolling can otherwise keep the old position);
   - when a link points at the page already open (e.g. the logo or "Home" on the homepage), it jumps straight to the top.
   Links to a spot on a page (#…) are left alone. */
function StartAtTop() {
  const pathname = usePathname();
  const lenis = useLenis();
  const firstLoad = useRef(true);

  useEffect(() => {
    // The first page load keeps whatever the browser restores.
    if (firstLoad.current) {
      firstLoad.current = false;
      return;
    }
    lenis?.scrollTo(0, { immediate: true, force: true });
    window.scrollTo(0, 0);
  }, [pathname, lenis]);

  useEffect(() => {
    function onClick(event: MouseEvent) {
      const link = (event.target as Element).closest("a");
      if (!link || link.target === "_blank" || event.metaKey || event.ctrlKey || event.shiftKey) return;
      const url = new URL(link.href, location.href);
      if (url.origin !== location.origin || url.hash || url.pathname !== location.pathname) return;
      event.preventDefault();
      lenis?.scrollTo(0, { immediate: true, force: true });
      window.scrollTo(0, 0);
    }
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, [lenis]);

  return null;
}

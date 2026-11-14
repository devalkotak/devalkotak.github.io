"use client";

import { useEffect } from "react";

/**
 * Opens the accordion item whose id matches the URL hash, on load and on
 * every in-page jump, so links elsewhere on the page (#case-uar,
 * #journey-jiostar) land on an expanded card instead of a closed title.
 */
export default function useHashOpen(prefix: string, slugs: string[], open: (index: number) => void) {
  useEffect(() => {
    function sync() {
      const hash = window.location.hash.slice(1);
      if (!hash.startsWith(prefix)) return;
      const index = slugs.indexOf(hash.slice(prefix.length));
      if (index === -1) return;
      open(index);
      // Wait for the panel to start expanding before scrolling to it.
      window.requestAnimationFrame(() =>
        document.getElementById(hash)?.scrollIntoView({ block: "start" }),
      );
    }
    sync();
    window.addEventListener("hashchange", sync);
    return () => window.removeEventListener("hashchange", sync);
  }, [prefix, slugs, open]);
}

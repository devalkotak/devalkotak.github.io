"use client";

import { useState } from "react";
import { Cookie } from "lucide-react";

/**
 * Parody of a consent banner. Both buttons do the same thing: nothing,
 * then dismiss. There is no storage, so the dismissal genuinely cannot
 * be remembered, which is the joke, and also true.
 */
export default function NoCookieBanner() {
  const [dismissed, setDismissed] = useState(false);
  const [loud, setLoud] = useState(false);

  if (dismissed) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 border-t border-border bg-background/95 backdrop-blur-xl">
      <div className="wide-shell flex flex-wrap items-center justify-between gap-3 py-4">
        <div className="flex items-start gap-3">
          <Cookie size={18} className="mt-0.5 shrink-0 text-accent" />
          <div>
            <p className={`text-sm text-body ${loud ? "font-bold uppercase" : ""}`}>
              This site would like to store zero cookies.
            </p>
            <p className="mt-0.5 text-xs text-muted">
              We can&apos;t even remember that you dismissed this banner.
              That&apos;s the point.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setDismissed(true)}
            className="inline-flex h-9 items-center border border-accent/60 bg-[var(--color-accent-muted)] px-3 text-xs font-medium text-accent transition hover:border-accent"
          >
            Accept nothing
          </button>
          <button
            type="button"
            onClick={() => {
              if (loud) {
                setDismissed(true);
              } else {
                setLoud(true);
              }
            }}
            className="inline-flex h-9 items-center border border-border px-3 text-xs text-body transition hover:border-accent/60 hover:text-accent"
          >
            {loud ? "ACCEPT NOTHING" : "Accept nothing, but louder"}
          </button>
        </div>
      </div>
    </div>
  );
}

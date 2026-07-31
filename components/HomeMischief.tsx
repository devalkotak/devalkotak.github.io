"use client";

import { useEffect, useState } from "react";

const AWAY_TITLES = [
  "wait — the audit wasn't finished",
  "your tabs miss you",
  "still here. still not tracking you.",
  "the other tab isn't better, just louder",
];

const TRIGGER_WORD = "breach";
const INCIDENT_MS = 3200;

/**
 * Home-page-only ambient behaviors:
 * - Tab-title mischief: when the tab is hidden, the title changes; restored on return.
 * - Incident mode: typing "breach" anywhere flashes a brief red alert overlay.
 * Renders nothing except the transient incident overlay.
 */
export default function HomeMischief() {
  const [incident, setIncident] = useState(false);

  useEffect(() => {
    const originalTitle = document.title;
    let awayIndex = 0;

    const onVisibility = () => {
      if (document.hidden) {
        document.title = AWAY_TITLES[awayIndex % AWAY_TITLES.length];
        awayIndex += 1;
      } else {
        document.title = originalTitle;
      }
    };

    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      document.removeEventListener("visibilitychange", onVisibility);
      document.title = originalTitle;
    };
  }, []);

  useEffect(() => {
    let buffer = "";
    let timer: ReturnType<typeof setTimeout>;

    const onKey = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      if (target && /^(input|textarea)$/i.test(target.tagName)) return;
      if (event.key.length !== 1) return;

      buffer = (buffer + event.key.toLowerCase()).slice(-TRIGGER_WORD.length);
      if (buffer === TRIGGER_WORD) {
        buffer = "";
        setIncident(true);
        clearTimeout(timer);
        timer = setTimeout(() => setIncident(false), INCIDENT_MS);
      }
    };

    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      clearTimeout(timer);
    };
  }, []);

  if (!incident) return null;

  return (
    <div
      aria-live="polite"
      className="pointer-events-none fixed inset-0 z-[100] flex items-end justify-center pb-16"
    >
      <div className="absolute inset-0 border-4 border-danger/60 animate-pulse" />
      <div className="relative border border-danger/60 bg-background px-5 py-4 shadow-2xl">
        <p className="mono-heading text-xs uppercase tracking-widest text-danger">
          incident mode
        </p>
        <p className="mt-1 text-sm text-body">
          Anomaly detected: visitor typed the forbidden word.
        </p>
        <p className="mono-heading mt-1 text-xs text-muted">
          verdict: false positive. logged. carry on.
        </p>
      </div>
    </div>
  );
}

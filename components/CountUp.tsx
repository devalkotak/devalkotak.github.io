"use client";

import { useEffect, useRef, useState } from "react";

type CountUpProps = {
  to: number;
  from?: number;
  prefix?: string;
  suffix?: string;
  /** Static text shown once the count lands, e.g. "2h → 20s". */
  display?: string;
  durationMs?: number;
};

/**
 * Counts from `from` to `to` the first time it scrolls into view. Skips the
 * animation under prefers-reduced-motion and always lands on the real value.
 */
export default function CountUp({
  to,
  from = 0,
  prefix = "",
  suffix = "",
  display,
  durationMs = 1400,
}: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null);
  // The real value stays in the DOM until the number scrolls into view, so
  // crawlers, link previews and copy-paste never read a zero. The rewind to
  // `from` happens in the same moment the count starts, while the section is
  // still fading in, so it does not show as a jump.
  const [value, setValue] = useState(to);
  const [done, setDone] = useState(true);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced || !("IntersectionObserver" in window)) return;

    let frame = 0;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();
        setValue(from);
        setDone(false);
        const start = performance.now();
        const tick = (now: number) => {
          const t = Math.min(1, (now - start) / durationMs);
          const eased = 1 - Math.pow(1 - t, 3);
          setValue(Math.round(from + (to - from) * eased));
          if (t < 1) {
            frame = requestAnimationFrame(tick);
          } else {
            setDone(true);
          }
        };
        frame = requestAnimationFrame(tick);
      },
      { threshold: 0.1 },
    );
    observer.observe(node);

    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
    };
  }, [to, from, durationMs]);

  const text =
    done && display ? display : `${prefix}${value.toLocaleString("en-US")}${suffix}`;

  return (
    <span ref={ref} aria-label={display ?? `${prefix}${to.toLocaleString("en-US")}${suffix}`}>
      <span aria-hidden="true">{text}</span>
    </span>
  );
}

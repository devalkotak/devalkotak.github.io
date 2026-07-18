"use client";

import { useEffect, useRef, useState } from "react";

const TYPE_INTERVAL_MS = 18;
const LINE_PAUSE_MS = 260;

export default function TypedIdentity({ lines }: { lines: string[] }) {
  const [typed, setTyped] = useState<string[]>([]);
  const [done, setDone] = useState(false);
  const reducedMotion = useRef(false);

  useEffect(() => {
    reducedMotion.current = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (reducedMotion.current) {
      setTyped(lines);
      setDone(true);
      return;
    }

    let lineIndex = 0;
    let charIndex = 0;
    let cancelled = false;
    let timer: ReturnType<typeof setTimeout>;

    const tick = () => {
      if (cancelled) return;
      const current = lines[lineIndex];
      if (charIndex <= current.length) {
        setTyped([
          ...lines.slice(0, lineIndex),
          current.slice(0, charIndex),
        ]);
        charIndex += 1;
        timer = setTimeout(tick, TYPE_INTERVAL_MS);
      } else if (lineIndex < lines.length - 1) {
        lineIndex += 1;
        charIndex = 0;
        timer = setTimeout(tick, LINE_PAUSE_MS);
      } else {
        setTyped(lines);
        setDone(true);
      }
    };

    timer = setTimeout(tick, 400);
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [lines]);

  return (
    <div aria-label={lines.join(" ")}>
      {typed.map((line, index) => (
        <p
          key={index}
          className={`text-base leading-8 text-body sm:text-lg ${
            !done && index === typed.length - 1 ? "cursor-blink" : ""
          }`}
        >
          {line}
        </p>
      ))}
    </div>
  );
}

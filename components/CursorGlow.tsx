"use client";

import { useEffect, useState } from "react";

export default function CursorGlow() {
  const [point, setPoint] = useState({ x: 380, y: 180 });

  useEffect(() => {
    function handleMove(event: MouseEvent) {
      setPoint({ x: event.clientX, y: event.clientY });
    }

    window.addEventListener("mousemove", handleMove);
    return () => window.removeEventListener("mousemove", handleMove);
  }, []);

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed left-0 top-0 z-0 size-[300px] opacity-100 blur-2xl"
      style={{
        transform: `translate3d(${point.x - 150}px, ${point.y - 150}px, 0)`,
        background:
          "radial-gradient(circle, rgba(0, 255, 157, 0.06), transparent 68%)",
      }}
    />
  );
}

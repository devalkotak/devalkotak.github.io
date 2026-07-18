"use client";

import { useEffect } from "react";
import { motion, useMotionValue, useSpring, useReducedMotion } from "framer-motion";

export default function CursorGlow() {
  const reduceMotion = useReducedMotion();
  const x = useMotionValue(-400);
  const y = useMotionValue(-400);
  const springX = useSpring(x, { stiffness: 110, damping: 24, mass: 0.6 });
  const springY = useSpring(y, { stiffness: 110, damping: 24, mass: 0.6 });

  useEffect(() => {
    function handleMove(event: MouseEvent) {
      x.set(event.clientX - 200);
      y.set(event.clientY - 200);
    }

    window.addEventListener("mousemove", handleMove);
    return () => window.removeEventListener("mousemove", handleMove);
  }, [x, y]);

  if (reduceMotion) {
    return null;
  }

  return (
    <motion.div
      aria-hidden="true"
      className="pointer-events-none fixed left-0 top-0 z-0 size-[400px] blur-3xl"
      style={{
        x: springX,
        y: springY,
        background:
          "radial-gradient(circle, rgba(88, 166, 255, 0.07), transparent 65%)",
      }}
    />
  );
}

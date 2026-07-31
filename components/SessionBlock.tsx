"use client";

import type { ReactNode } from "react";
import { MotionConfig, motion } from "framer-motion";
import { easing } from "@/lib/animations";

type SessionBlockProps = {
  children: ReactNode;
  className?: string;
  id?: string;
};

/**
 * A command-plus-output section that fades in like output printing to a
 * terminal. Honors prefers-reduced-motion via MotionConfig.
 */
export default function SessionBlock({ children, className, id }: SessionBlockProps) {
  return (
    <MotionConfig reducedMotion="user">
      <motion.section
        id={id}
        className={className}
        initial={{ opacity: 0, y: 14 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-40px" }}
        transition={{ duration: 0.5, ease: easing }}
      >
        {children}
      </motion.section>
    </MotionConfig>
  );
}

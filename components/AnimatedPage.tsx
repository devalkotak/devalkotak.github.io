"use client";

import type { ReactNode } from "react";
import { motion } from "framer-motion";
import { pageContainer } from "@/lib/animations";

type AnimatedPageProps = {
  children: ReactNode;
  className?: string;
};

export default function AnimatedPage({ children, className }: AnimatedPageProps) {
  return (
    <motion.div
      className={className}
      variants={pageContainer}
      initial="hidden"
      animate="show"
    >
      {children}
    </motion.div>
  );
}

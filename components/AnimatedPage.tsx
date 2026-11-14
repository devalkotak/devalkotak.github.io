import type { ReactNode } from "react";

type AnimatedPageProps = {
  children: ReactNode;
  className?: string;
};

/**
 * Page entrance as plain CSS (see .page-enter in globals.css). It used to be
 * a framer-motion wrapper that rendered at opacity 0 and waited for the
 * script bundle, which held back first paint by about two seconds on a
 * phone. A CSS animation starts with the HTML, needs no JavaScript, and is
 * already shortened to nothing by the prefers-reduced-motion rule.
 */
export default function AnimatedPage({ children, className }: AnimatedPageProps) {
  return <div className={`page-enter ${className ?? ""}`}>{children}</div>;
}

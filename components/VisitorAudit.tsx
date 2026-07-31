"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight, ScanLine } from "lucide-react";

type Severity = "info" | "low" | "medium" | "high" | "critical" | "pass";

type Finding = {
  id: string;
  severity: Severity;
  text: string;
};

const FINDINGS: Finding[] = [
  {
    id: "F-01",
    severity: "low",
    text: "Visitor arrived at a security engineer's website and immediately pressed the suspicious button.",
  },
  {
    id: "F-02",
    severity: "medium",
    text: "Browser is currently telling every website your screen size, timezone, and roughly how bored you are.",
  },
  {
    id: "F-03",
    severity: "high",
    text: "Estimated 12 to 400 open tabs detected. One of them is playing sound. You will never find it.",
  },
  {
    id: "F-04",
    severity: "critical",
    text: "Password reuse suspected across multiple accounts. You know exactly which password.",
  },
  {
    id: "F-05",
    severity: "pass",
    text: "No vulnerabilities found in your curiosity. Whatever you're doing, keep doing it.",
  },
];

const SEVERITY_STYLE: Record<Severity, { label: string; className: string }> = {
  info: { label: "info", className: "text-muted border-border" },
  low: { label: "low", className: "text-muted border-border" },
  medium: { label: "medium", className: "text-warn border-warn/40" },
  high: { label: "high", className: "text-warn border-warn/40" },
  critical: { label: "critical", className: "text-danger border-danger/40" },
  pass: { label: "pass", className: "text-ok border-ok/40" },
};

const REVEAL_INTERVAL_MS = 650;

export default function VisitorAudit() {
  const [state, setState] = useState<"idle" | "running" | "done">("idle");
  const [revealed, setRevealed] = useState(0);
  const reduceMotion = useReducedMotion();
  const timer = useRef<ReturnType<typeof setInterval>>();

  useEffect(() => {
    if (state !== "running") return;

    if (reduceMotion) {
      setRevealed(FINDINGS.length);
      setState("done");
      return;
    }

    timer.current = setInterval(() => {
      setRevealed((count) => {
        if (count + 1 >= FINDINGS.length) {
          clearInterval(timer.current);
          setState("done");
        }
        return count + 1;
      });
    }, REVEAL_INTERVAL_MS);

    return () => clearInterval(timer.current);
  }, [state, reduceMotion]);

  return (
    <div className="border border-border bg-surface p-5 sm:p-6">
      {state === "idle" ? (
        <div className="flex flex-col items-start gap-4">
          <p className="text-sm leading-6 text-muted">
            Free of charge, no signup, results in seconds. What could possibly
            go wrong.
          </p>
          <button
            type="button"
            onClick={() => setState("running")}
            className="inline-flex h-10 items-center gap-2 border border-accent/60 bg-[var(--color-accent-muted)] px-4 text-sm font-medium text-accent transition hover:border-accent"
          >
            <ScanLine size={15} />
            Audit me
          </button>
        </div>
      ) : (
        <div>
          <ul className="space-y-3">
            {FINDINGS.slice(0, revealed).map((finding) => {
              const style = SEVERITY_STYLE[finding.severity];
              return (
                <motion.li
                  key={finding.id}
                  initial={reduceMotion ? false : { opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35 }}
                  className="flex items-start gap-3"
                >
                  <span
                    className={`mono-heading mt-0.5 shrink-0 border px-1.5 py-0.5 text-[10px] uppercase tracking-wider ${style.className}`}
                  >
                    {style.label}
                  </span>
                  <span className="text-sm leading-6 text-body">
                    {finding.text}
                  </span>
                </motion.li>
              );
            })}
          </ul>

          {state === "running" && (
            <p className="mono-heading mt-4 text-xs text-muted">
              scanning<span className="cursor-blink" />
            </p>
          )}

          {state === "done" && (
            <motion.div
              initial={reduceMotion ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.2 }}
              className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-border pt-4"
            >
              <p className="text-sm text-muted">
                Recommended remediation:{" "}
                <span className="text-foreground">
                  put a security engineer on it.
                </span>
              </p>
              <Link
                href="/resume"
                className="mono-heading inline-flex items-center gap-1 text-xs text-accent hover:underline"
              >
                conveniently, a candidate
                <ArrowUpRight size={12} />
              </Link>
            </motion.div>
          )}
        </div>
      )}
    </div>
  );
}

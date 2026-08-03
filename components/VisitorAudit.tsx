"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight, ScanLine } from "lucide-react";

type Severity = "info" | "low" | "medium" | "high" | "pass";

type Finding = {
  id: string;
  severity: Severity;
  text: string;
};

const SEVERITY_STYLE: Record<Severity, { label: string; className: string }> = {
  info: { label: "info", className: "text-muted border-border" },
  low: { label: "low", className: "text-muted border-border" },
  medium: { label: "medium", className: "text-warn border-warn/40" },
  high: { label: "high", className: "text-warn border-warn/40" },
  pass: { label: "pass", className: "text-ok border-ok/40" },
};

function collectFindings(): Finding[] {
  const findings: Finding[] = [];
  const nav = navigator as Navigator & {
    connection?: { effectiveType?: string };
    userAgentData?: { platform?: string; brands?: { brand: string }[] };
  };

  const platform =
    nav.userAgentData?.platform ||
    (navigator.platform || "an operating system");
  const browser =
    nav.userAgentData?.brands?.filter(
      (b) => !/not.a.brand/i.test(b.brand)
    )?.[0]?.brand || browserFromUA(navigator.userAgent);

  findings.push({
    id: "F-01",
    severity: "low",
    text: `You're on ${platform}, running ${browser}. Volunteered before this page finished loading.`,
  });

  findings.push({
    id: "F-02",
    severity: "medium",
    text: `Screen: ${screen.width}×${screen.height} at ${window.devicePixelRatio}x pixel density. Combine that with a few more of these and it stops being anonymous.`,
  });

  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const time = new Date().toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
  findings.push({
    id: "F-03",
    severity: "low",
    text: `Your clock says ${time} in ${timezone}. Nothing here asked for that.`,
  });

  const cores = navigator.hardwareConcurrency;
  if (cores) {
    findings.push({
      id: "F-04",
      severity: "info",
      text: `Your device reports ${cores} CPU cores. Handy for ad networks pricing your attention.`,
    });
  }

  const dark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  findings.push({
    id: "F-05",
    severity: "info",
    text: dark
      ? "Dark mode. One more bit of entropy, handed over without a prompt."
      : "Light mode, which is rarer, and therefore slightly more identifying.",
  });

  const connection = nav.connection?.effectiveType;
  if (connection) {
    findings.push({
      id: "F-06",
      severity: "info",
      text: `Connection reports as "${connection}". Sites can see roughly how good your internet is.`,
    });
  }

  const languages = navigator.languages?.slice(0, 3).join(", ");
  if (languages) {
    findings.push({
      id: "F-07",
      severity: "low",
      text: `Language preferences: ${languages}. Narrows you down further than most people expect.`,
    });
  }

  const dnt = navigator.doNotTrack === "1";
  findings.push({
    id: "F-08",
    severity: dnt ? "info" : "low",
    text: dnt
      ? "Do Not Track is on. Most sites ignore it, and this one has nothing to ignore it with."
      : "Do Not Track is off, which changes very little either way.",
  });

  findings.push({
    id: "F-09",
    severity: "info",
    text: `This tab's history stack is ${history.length} deep. A page can't read where you've been, only how far.`,
  });

  findings.push({
    id: "F-10",
    severity: "pass",
    text: "Everything above was read locally and stored nowhere. A malicious page collects the same set before you finish reading its cookie banner.",
  });

  return findings;
}

function browserFromUA(ua: string): string {
  if (/edg\//i.test(ua)) return "Edge";
  if (/firefox\//i.test(ua)) return "Firefox";
  if (/chrome\//i.test(ua)) return "a Chromium browser";
  if (/safari\//i.test(ua)) return "Safari";
  return "a browser";
}

const REVEAL_INTERVAL_MS = 550;

export default function VisitorAudit() {
  const [findings, setFindings] = useState<Finding[] | null>(null);
  const [revealed, setRevealed] = useState(0);
  const reduceMotion = useReducedMotion();

  const running = findings !== null && revealed < findings.length;
  const done = findings !== null && revealed >= findings.length;

  const start = () => {
    const collected = collectFindings();
    setFindings(collected);

    if (reduceMotion) {
      setRevealed(collected.length);
      return;
    }

    setRevealed(0);
    const timer = setInterval(() => {
      setRevealed((count) => {
        if (count + 1 >= collected.length) {
          clearInterval(timer);
        }
        return count + 1;
      });
    }, REVEAL_INTERVAL_MS);
  };

  return (
    <div>
      {findings === null ? (
        <div className="flex flex-col items-start gap-4">
          <p className="text-sm leading-6 text-muted">
            A live reading of what your browser hands to every page it visits.
          </p>
          <button
            type="button"
            onClick={start}
            className="inline-flex h-10 items-center gap-2 border border-accent/60 bg-[var(--color-accent-muted)] px-4 text-sm font-medium text-accent transition hover:border-accent"
          >
            <ScanLine size={15} />
            Audit me
          </button>
        </div>
      ) : (
        <div>
          <ul className="space-y-3">
            {findings.slice(0, revealed).map((finding) => {
              const style = SEVERITY_STYLE[finding.severity];
              return (
                <motion.li
                  key={finding.id}
                  initial={reduceMotion ? false : { opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
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

          {running && (
            <p className="mono-heading mt-4 text-xs text-muted">
              reading what you already gave me<span className="cursor-blink" />
            </p>
          )}

          {done && (
            <motion.div
              initial={reduceMotion ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.2 }}
              className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-border pt-4"
            >
              <p className="text-sm text-muted">
                Recommended remediation:{" "}
                <span className="text-foreground">
                  someone who thinks about this for a living.
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

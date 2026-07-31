"use client";

import { useEffect, useState } from "react";

type Receipt = {
  transferKb: number | null;
  loadMs: number | null;
};

export default function HonestyBadge() {
  const [receipt, setReceipt] = useState<Receipt | null>(null);

  useEffect(() => {
    const read = () => {
      const [entry] = performance.getEntriesByType(
        "navigation"
      ) as PerformanceNavigationTiming[];
      if (!entry) return;

      setReceipt({
        transferKb:
          entry.transferSize > 0
            ? Math.round(entry.transferSize / 1024)
            : null,
        loadMs:
          entry.loadEventEnd > 0 ? Math.round(entry.loadEventEnd) : null,
      });
    };

    if (document.readyState === "complete") {
      read();
    } else {
      window.addEventListener("load", read, { once: true });
      return () => window.removeEventListener("load", read);
    }
  }, []);

  return (
    <div className="grid gap-6 sm:grid-cols-3">
      <Claim
        value="#unknowable"
        label="your visitor number"
        detail="No analytics, no counter, no idea. First time or fifteenth — genuinely can't tell."
      />
      <Claim
        value="0 cookies, 0 trackers"
        label="stored about you"
        detail="Open devtools, check the Application tab. Claims you can verify beat claims you have to trust."
      />
      <Claim
        value={
          receipt?.loadMs
            ? `${receipt.transferKb ? `${receipt.transferKb} kB / ` : "cached / "}${receipt.loadMs} ms`
            : "measuring…"
        }
        label="this page, for you, just now"
        detail="Read live from your browser's Performance API. The average webpage is about 2.5 MB."
      />
    </div>
  );
}

function Claim({
  value,
  label,
  detail,
}: {
  value: string;
  label: string;
  detail: string;
}) {
  return (
    <div className="grid content-start gap-1">
      <p className="mono-heading text-lg font-semibold text-foreground">
        {value}
      </p>
      <p className="mono-heading text-[11px] uppercase tracking-wider text-accent">
        {label}
      </p>
      <p className="mt-1 text-xs leading-5 text-muted">{detail}</p>
    </div>
  );
}

"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { formatDate } from "@/lib/format";
import type { WriteupSummary } from "@/lib/types";

const ALL = "all";

/** Writeup index with category filters. Order is whatever the sync gave. */
export default function BlogList({ writeups }: { writeups: WriteupSummary[] }) {
  const [category, setCategory] = useState(ALL);

  const categories = useMemo(() => {
    const counts = new Map<string, number>();
    for (const writeup of writeups) {
      counts.set(writeup.category, (counts.get(writeup.category) ?? 0) + 1);
    }
    return Array.from(counts.entries()).sort((a, b) => b[1] - a[1]);
  }, [writeups]);

  const shown = category === ALL ? writeups : writeups.filter((w) => w.category === category);

  return (
    <div>
      {categories.length > 1 && (
        <div className="flex flex-wrap items-center gap-2" role="group" aria-label="Filter by category">
          <Chip active={category === ALL} onClick={() => setCategory(ALL)} label="All" count={writeups.length} />
          {categories.map(([name, count]) => (
            <Chip key={name} active={category === name} onClick={() => setCategory(name)} label={name} count={count} />
          ))}
        </div>
      )}

      <ol className="mt-8 divide-y divide-border border-y border-border">
        {shown.map((writeup, index) => (
          <li key={writeup.id}>
            <Link
              href={`/blog/${writeup.slug}`}
              className="group grid grid-cols-[2.5rem_1fr_auto] items-baseline gap-x-4 px-2 py-5 transition-all duration-300 hover:bg-surface hover:pl-4 sm:grid-cols-[3rem_1fr_auto_auto] sm:gap-x-6"
            >
              <span className="mono-heading text-xs text-faint transition group-hover:text-accent">
                {String(index + 1).padStart(2, "0")}
              </span>
              <span className="min-w-0">
                <span className="display-heading block text-lg font-medium leading-snug text-foreground transition group-hover:text-accent">
                  {writeup.title}
                </span>
                <span className="mono-heading mt-1 block text-[11px] text-muted">
                  {[writeup.category, ...writeup.tags.slice(0, 2)].join(" · ")}
                </span>
              </span>
              <time
                className="mono-heading hidden text-xs text-muted sm:block"
                dateTime={writeup.date}
              >
                {formatDate(writeup.date)}
              </time>
              <ArrowUpRight
                size={16}
                className="text-faint transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accent"
              />
            </Link>
          </li>
        ))}
      </ol>
    </div>
  );
}

function Chip({
  active,
  onClick,
  label,
  count,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
  count: number;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`mono-heading inline-flex items-center gap-2 border px-3 py-1.5 text-xs transition ${
        active
          ? "border-accent/70 bg-[var(--color-accent-muted)] text-accent"
          : "border-border text-muted hover:border-accent/40 hover:text-accent"
      }`}
    >
      {label}
      <span className={active ? "text-accent/70" : "text-faint"}>{count}</span>
    </button>
  );
}

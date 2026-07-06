import Link from "next/link";
import { ArrowRight, CalendarDays } from "lucide-react";
import type { WriteupSummary } from "@/lib/types";

type WriteupRowProps = {
  writeup: WriteupSummary;
};

export default function WriteupRow({ writeup }: WriteupRowProps) {
  const source = typeof writeup.properties?.Source === "string" ? writeup.properties.Source : null;

  return (
    <Link
      href={`/writeups/${writeup.slug}`}
      className="group relative flex min-h-40 flex-col justify-between border border-border bg-surface p-5 transition hover:border-accent/50 hover:bg-surfaceHover"
    >
      <span className="absolute left-0 top-0 h-full w-1 origin-left scale-x-0 bg-accent transition-transform duration-200 group-hover:scale-x-100" />
      <div className="flex items-start justify-between gap-4 pl-2">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <span className="mono-heading inline-flex border border-accent/30 bg-[var(--color-accent-muted)] px-2 py-1 text-[11px] text-accent">
              {writeup.category}
            </span>
            {source ? (
              <span className="border border-border bg-code px-2 py-1 text-[11px] text-muted">
                {source}
              </span>
            ) : null}
          </div>
          <h2 className="mt-4 break-words text-base font-semibold text-foreground transition group-hover:text-accent">
            {writeup.title}
          </h2>
        </div>
        <ArrowRight
          size={16}
          className="mt-1 shrink-0 text-muted transition group-hover:translate-x-1 group-hover:text-accent"
        />
      </div>

      <div className="mt-5 flex flex-wrap items-center justify-between gap-3 pl-2">
        {writeup.tags.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {writeup.tags.map((tag) => (
              <span key={tag} className="text-xs text-muted">
                #{tag}
              </span>
            ))}
          </div>
        ) : (
          <span className="text-xs text-muted">untagged</span>
        )}
        <time
          className="inline-flex shrink-0 items-center gap-2 text-xs text-muted"
          dateTime={writeup.date}
        >
          <CalendarDays size={13} />
          {formatDate(writeup.date)}
        </time>
      </div>
    </Link>
  );
}

function formatDate(date: string) {
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(date));
}

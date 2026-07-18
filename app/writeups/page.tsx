import type { Metadata } from "next";
import Link from "next/link";
import { CalendarDays } from "lucide-react";
import AnimatedPage from "@/components/AnimatedPage";
import WriteupExplorer from "@/components/WriteupExplorer";
import { getPublishedWriteups } from "@/lib/notion";

export const metadata: Metadata = {
  title: "Writeups / Deval Kotak",
};

export default async function WriteupsPage() {
  const writeups = await getPublishedWriteups();
  const latest = writeups[0] ?? null;
  const categories = Array.from(new Set(writeups.map((writeup) => writeup.category)));

  return (
    <AnimatedPage className="wide-shell">
      <header className="grid gap-6 border-b border-border pb-8 lg:grid-cols-[1fr_340px]">
        <section>
          <p className="mono-heading text-sm text-accent">{"// writeups"}</p>
          <h1 className="mono-heading mt-4 text-4xl font-semibold text-foreground sm:text-5xl">
            Notes, labs, and writeups
          </h1>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-muted">
            Things I broke, fixed, or finally understood. Lab notes and CTF
            walkthroughs written up as I go.
          </p>
        </section>

        {latest ? (
          <section className="panel-3d border border-border p-5">
            <p className="mono-heading text-xs uppercase tracking-wider text-muted">
              latest entry
            </p>
            <Link href={`/writeups/${latest.slug}`} className="group mt-3 block">
              <span className="block text-sm font-medium leading-6 text-foreground transition group-hover:text-accent">
                {latest.title}
              </span>
              <time
                className="mt-2 inline-flex items-center gap-2 text-xs text-muted"
                dateTime={latest.date}
              >
                <CalendarDays size={13} />
                {formatDate(latest.date)}
              </time>
            </Link>
            {categories.length > 0 ? (
              <div className="mt-4 flex flex-wrap gap-2 border-t border-border pt-4">
                {categories.map((category) => (
                  <span
                    key={category}
                    className="mono-heading border border-accent/30 bg-[var(--color-accent-muted)] px-2 py-1 text-[11px] text-accent"
                  >
                    {category}
                  </span>
                ))}
              </div>
            ) : null}
          </section>
        ) : null}
      </header>

      {writeups.length > 0 ? (
        <WriteupExplorer writeups={writeups} />
      ) : (
        <p className="mt-8 border border-border bg-surface p-5 text-sm text-muted">
          No writeups published yet.
        </p>
      )}
    </AnimatedPage>
  );
}

function formatDate(date: string) {
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(date));
}

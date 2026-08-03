import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Terminal } from "lucide-react";
import AnimatedPage from "@/components/AnimatedPage";
import { getPublishedWriteups } from "@/lib/notion";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Writeups on things broken, fixed, or finally understood.",
};

export default async function BlogPage() {
  const writeups = await getPublishedWriteups();

  return (
    <AnimatedPage className="content-shell">
      <header className="border-b border-border pb-8">
        <p className="mono-heading flex items-center gap-2 text-sm text-accent">
          <Terminal size={16} />
          blog/
        </p>
        <h1 className="mono-heading mt-4 text-3xl font-semibold text-foreground sm:text-4xl">
          Writeups
        </h1>
        <p className="mt-4 max-w-2xl text-base leading-7 text-body">
          Notes on what broke, why it broke, and what it took to fix.
        </p>
      </header>

      <p className="mt-8 border-l-2 border-accent bg-surface px-4 py-3 text-sm leading-6 text-muted">
        Still consolidating years of notes out of Notion, old repos, and
        half-finished drafts. Thin for now, growing weekly.
      </p>

      {writeups.length > 0 ? (
        <div className="mt-8 divide-y divide-border">
          {writeups.map((writeup) => (
            <Link
              key={writeup.id}
              href={`/blog/${writeup.slug}`}
              className="group flex items-baseline justify-between gap-4 py-4"
            >
              <span className="min-w-0">
                <span className="block text-sm font-medium leading-6 text-foreground transition group-hover:text-accent sm:truncate">
                  {writeup.title}
                </span>
                <span className="mono-heading mt-1 block text-[11px] text-muted">
                  {writeup.category}
                  {writeup.tags.slice(0, 2).map((tag) => (
                    <span key={tag}> · {tag}</span>
                  ))}
                </span>
              </span>
              <span className="flex shrink-0 items-center gap-3">
                <time className="mono-heading text-xs text-muted" dateTime={writeup.date}>
                  {formatDate(writeup.date)}
                </time>
                <ArrowRight size={14} className="text-muted transition group-hover:text-accent" />
              </span>
            </Link>
          ))}
        </div>
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
    year: "numeric",
  }).format(new Date(date));
}

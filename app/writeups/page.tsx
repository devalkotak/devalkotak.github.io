import type { Metadata } from "next";
import { BookOpenText, FileText, Tag } from "lucide-react";
import AnimatedPage from "@/components/AnimatedPage";
import WriteupExplorer from "@/components/WriteupExplorer";
import { getPublishedWriteups } from "@/lib/notion";

export const metadata: Metadata = {
  title: "Writeups / Deval Kotak",
};

export default async function WriteupsPage() {
  const writeups = await getPublishedWriteups();
  const categoryCount = new Set(writeups.map((writeup) => writeup.category)).size;
  const tagCount = new Set(writeups.flatMap((writeup) => writeup.tags)).size;

  return (
    <AnimatedPage className="wide-shell">
      <header className="grid gap-6 border-b border-border pb-8 lg:grid-cols-[1fr_340px]">
        <section>
          <p className="mono-heading text-sm text-accent">{"// writeups"}</p>
          <h1 className="mono-heading mt-4 text-4xl font-semibold text-foreground sm:text-5xl">
            Notes, labs, and writeups
          </h1>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-muted">
            Published Notion pages rendered as static writeups, with search and filters
            built for a larger archive.
          </p>
        </section>

        <section className="grid grid-cols-3 border border-border bg-surface">
          <HeaderMetric icon={FileText} label="entries" value={writeups.length} />
          <HeaderMetric icon={BookOpenText} label="types" value={categoryCount} />
          <HeaderMetric icon={Tag} label="tags" value={tagCount} />
        </section>
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

function HeaderMetric({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof FileText;
  label: string;
  value: number;
}) {
  return (
    <div className="border-r border-border p-4 last:border-r-0">
      <Icon size={16} className="text-accent" />
      <div className="mono-heading mt-4 text-2xl font-semibold text-foreground">
        {value}
      </div>
      <div className="mt-1 text-xs text-muted">{label}</div>
    </div>
  );
}

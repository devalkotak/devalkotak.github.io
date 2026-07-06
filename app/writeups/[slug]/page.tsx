import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import AnimatedPage from "@/components/AnimatedPage";
import NotionRenderer from "@/components/NotionRenderer";
import {
  NOTION_PLACEHOLDER_SLUG,
  getPublishedWriteups,
  getWriteupBySlug,
} from "@/lib/notion";

export const dynamicParams = false;

export async function generateStaticParams() {
  const writeups = await getPublishedWriteups();
  return writeups.length > 0
    ? writeups.map((writeup) => ({ slug: writeup.slug }))
    : [{ slug: NOTION_PLACEHOLDER_SLUG }];
}

export default async function WriteupDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const writeup = await getWriteupBySlug(params.slug);

  if (!writeup) {
    notFound();
  }

  return (
    <AnimatedPage className="content-shell">
      <Link
        href="/writeups"
        className="inline-flex items-center gap-2 text-sm text-muted transition hover:text-accent"
      >
        <ArrowLeft size={15} />
        writeups
      </Link>

      <article className="mt-8">
        <header className="border-b border-border pb-8">
          <h1 className="mono-heading text-3xl font-semibold text-foreground">
            {writeup.title}
          </h1>
          <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-muted">
            <time dateTime={writeup.date}>{writeup.date}</time>
            <span className="mono-heading border border-accent/30 bg-[var(--color-accent-muted)] px-2 py-1 text-[11px] text-accent">
              {writeup.category}
            </span>
          </div>
        </header>

        <div className="mt-8">
          <NotionRenderer blocks={writeup.blocks} />
        </div>
      </article>
    </AnimatedPage>
  );
}

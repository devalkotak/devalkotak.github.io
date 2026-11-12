import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight } from "lucide-react";
import AnimatedPage from "@/components/AnimatedPage";
import NotionRenderer from "@/components/NotionRenderer";
import PageHeader from "@/components/PageHeader";
import { formatDate } from "@/lib/format";
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

export default async function BlogDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const [article, writeups] = await Promise.all([
    getWriteupBySlug(params.slug),
    getPublishedWriteups(),
  ]);

  if (!article) {
    notFound();
  }

  // Neighbours in the same order as the blog index.
  const position = writeups.findIndex((writeup) => writeup.slug === article.slug);
  const newer = position > 0 ? writeups[position - 1] : null;
  const older = position >= 0 && position < writeups.length - 1 ? writeups[position + 1] : null;

  return (
    <AnimatedPage className="content-shell">
      <article>
        <PageHeader
          crumbs={[
            { label: "blog", href: "/blog" },
            { label: article.category.toLowerCase() },
          ]}
          title={article.title}
          aside={
            <span className="mono-heading flex flex-wrap items-center gap-3 text-xs text-muted">
              <time dateTime={article.date}>{formatDate(article.date)}</time>
              {article.tags.slice(0, 3).map((tag) => (
                <span key={tag} className="border border-border px-2 py-0.5 text-[11px]">
                  {tag}
                </span>
              ))}
            </span>
          }
        />

        <div className="mt-10">
          <NotionRenderer blocks={article.blocks} />
        </div>
      </article>

      {(newer || older) && (
        <nav
          aria-label="More writeups"
          className="mt-16 grid gap-px border border-border bg-border sm:grid-cols-2"
        >
          {older ? (
            <NeighbourLink href={`/blog/${older.slug}`} label="older" title={older.title} direction="back" />
          ) : (
            <span className="hidden bg-background sm:block" />
          )}
          {newer ? (
            <NeighbourLink href={`/blog/${newer.slug}`} label="newer" title={newer.title} direction="forward" />
          ) : (
            <span className="hidden bg-background sm:block" />
          )}
        </nav>
      )}

      <Link
        href="/blog"
        className="mono-heading mt-8 inline-flex items-center gap-2 text-xs text-muted transition hover:text-accent"
      >
        <ArrowLeft size={14} />
        all writeups
      </Link>
    </AnimatedPage>
  );
}

function NeighbourLink({
  href,
  label,
  title,
  direction,
}: {
  href: string;
  label: string;
  title: string;
  direction: "back" | "forward";
}) {
  const forward = direction === "forward";
  return (
    <Link
      href={href}
      className={`group flex flex-col gap-2 bg-background p-5 transition hover:bg-surface ${
        forward ? "sm:items-end sm:text-right" : ""
      }`}
    >
      <span className="mono-heading inline-flex items-center gap-2 text-[11px] uppercase tracking-widest text-muted">
        {!forward && <ArrowLeft size={12} />}
        {label}
        {forward && <ArrowRight size={12} />}
      </span>
      <span className="display-heading text-base font-medium leading-snug text-foreground transition group-hover:text-accent">
        {title}
      </span>
    </Link>
  );
}

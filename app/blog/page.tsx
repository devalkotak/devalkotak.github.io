import type { Metadata } from "next";
import AnimatedPage from "@/components/AnimatedPage";
import BlogList from "@/components/BlogList";
import PageHeader from "@/components/PageHeader";
import { getPublishedWriteups } from "@/lib/notion";

export const metadata: Metadata = {
  title: "Blog",
  description: "Writeups on things broken, fixed or finally understood.",
};

export default async function BlogPage() {
  const writeups = await getPublishedWriteups();

  return (
    <AnimatedPage className="wide-shell">
      <PageHeader
        crumbs={[{ label: "blog" }]}
        title="Things broken,"
        accent="then explained."
        intro="Lab writeups and study notes: what broke, why it broke and what it took to fix. Written in Notion and synced here on every deploy."
        aside={
          writeups.length > 0 && (
            <span className="mono-heading text-xs uppercase tracking-widest text-muted">
              {writeups.length} writeups
            </span>
          )
        }
      />

      <div className="mt-10">
        {writeups.length > 0 ? (
          <BlogList writeups={writeups} />
        ) : (
          <p className="border border-border bg-surface p-5 text-sm text-muted">
            No writeups published yet.
          </p>
        )}
      </div>
    </AnimatedPage>
  );
}

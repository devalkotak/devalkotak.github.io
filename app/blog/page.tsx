import type { Metadata } from "next";
import AnimatedPage from "@/components/AnimatedPage";
import BlogIndex from "@/components/BlogIndex";
import PageHeader from "@/components/PageHeader";
import { getBlogGroups } from "@/lib/blog-meta";

export const metadata: Metadata = {
  title: "Blog",
  description: "Writeups on things broken, fixed or finally understood.",
};

export default async function BlogPage() {
  const groups = await getBlogGroups();
  const hasEntries = groups.some((group) => group.entries.length > 0);

  return (
    <AnimatedPage className="wide-shell">
      <PageHeader
        crumbs={[{ label: "Blog" }]}
        title="Things broken,"
        accent="then explained."
        intro="Lab writeups and study notes: what broke, why it broke and what it took to fix. Written in Notion and synced here on every deploy."
      />

      <div className="mt-7 sm:mt-10">
        {hasEntries ? (
          <BlogIndex groups={groups} />
        ) : (
          <p className="border border-border bg-surface p-5 text-sm text-muted">No writeups published yet.</p>
        )}
      </div>
    </AnimatedPage>
  );
}

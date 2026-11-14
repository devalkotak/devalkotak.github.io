import type { Metadata } from "next";
import AnimatedPage from "@/components/AnimatedPage";
import NotionRenderer from "@/components/NotionRenderer";
import PageHeader from "@/components/PageHeader";
import { getOptiverseContent } from "@/lib/optiverse";

export const metadata: Metadata = {
  title: "Optiverse",
  description:
    "A student-built mentorship non-profit, co-founded in 2021, dormant with a relaunch in planning.",
};

export default function OptiversePage() {
  const { blocks, error } = getOptiverseContent();

  return (
    <AnimatedPage className="wide-shell">
      <PageHeader
        crumbs={[{ label: "Optiverse" }]}
        title="A side quest that reached"
        accent="150,000 students."
        intro="Before the security tooling and the market notebooks, there was this: a mentorship project co-founded with a friend and run entirely by students, for students. Dormant for now, with a relaunch being planned around everyone’s new commitments. This page is pulled from the team’s own Notion on every deploy."
      />

      <div className="mt-10 max-w-3xl">
        {error ? (
          <p className="border border-border bg-surface p-5 text-sm text-muted">
            Couldn’t reach Notion during the last build: {error}
          </p>
        ) : blocks.length > 0 ? (
          <NotionRenderer blocks={blocks} />
        ) : (
          <p className="border border-border bg-surface p-5 text-sm text-muted">
            Optiverse content isn’t synced yet. Check back soon.
          </p>
        )}
      </div>
    </AnimatedPage>
  );
}

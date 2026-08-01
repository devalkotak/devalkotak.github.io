import type { Metadata } from "next";
import { Sparkles } from "lucide-react";
import AnimatedPage from "@/components/AnimatedPage";
import NotionRenderer from "@/components/NotionRenderer";
import { getOptiverseContent } from "@/lib/optiverse";

export const metadata: Metadata = {
  title: "Optiverse",
  description:
    "Optiverse — a student-built mentorship project I co-founded. Paused, not forgotten.",
};

export default function OptiversePage() {
  const { blocks, error } = getOptiverseContent();

  return (
    <AnimatedPage className="content-shell">
      <header className="border-b border-border pb-8">
        <p className="mono-heading flex items-center gap-2 text-sm text-accent">
          <Sparkles size={16} />
          optiverse/
        </p>
        <h1 className="mono-heading mt-4 text-3xl font-semibold text-foreground sm:text-4xl">
          A side quest that got 150,000 students
        </h1>
        <p className="mt-4 max-w-2xl text-base leading-7 text-body">
          Before the security tooling and the market notebooks, there was
          this: a mentorship project I co-founded with a friend, run entirely
          by students, for students. It is on pause. It is not dead. This
          page is synced live from the source of truth, so it updates the
          moment we do.
        </p>
      </header>

      <div className="mt-8">
        {error ? (
          <p className="border border-border bg-surface p-5 text-sm text-muted">
            Couldn&apos;t reach Notion right now: {error}
          </p>
        ) : blocks.length > 0 ? (
          <NotionRenderer blocks={blocks} />
        ) : (
          <p className="border border-border bg-surface p-5 text-sm text-muted">
            Optiverse content isn&apos;t synced yet. Check back soon.
          </p>
        )}
      </div>
    </AnimatedPage>
  );
}

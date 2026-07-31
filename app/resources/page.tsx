import type { Metadata } from "next";
import { ArrowUpRight, Library } from "lucide-react";
import AnimatedPage from "@/components/AnimatedPage";
import { getResourceState } from "@/lib/resources";

export const metadata: Metadata = {
  title: "Resources / Deval Kotak",
  description:
    "Tools, references, and reading worth keeping — synced from Notion.",
};

export default function ResourcesPage() {
  const { resources, error } = getResourceState();

  return (
    <AnimatedPage className="content-shell">
      <header className="border-b border-border pb-8">
        <p className="mono-heading flex items-center gap-2 text-sm text-accent">
          <Library size={16} />
          resources/
        </p>
        <h1 className="mono-heading mt-4 text-3xl font-semibold text-foreground sm:text-4xl">
          Stuff worth bookmarking
        </h1>
        <p className="mt-4 max-w-2xl text-base leading-7 text-body">
          Tools, cheat sheets, and links I actually go back to — security and
          markets both. Kept in Notion, mirrored here.
        </p>
      </header>

      {error ? (
        <p className="mt-8 border border-border bg-surface p-5 text-sm text-muted">
          Couldn&apos;t reach Notion right now: {error}
        </p>
      ) : resources.length > 0 ? (
        <div className="mt-8 divide-y divide-border">
          {resources.map((resource) => {
            const content = (
              <>
                <span className="min-w-0">
                  <span className="block text-sm font-medium leading-6 text-foreground transition group-hover:text-accent sm:truncate">
                    {resource.title}
                  </span>
                  {resource.description && (
                    <span className="mt-1 block text-xs leading-5 text-muted">
                      {resource.description}
                    </span>
                  )}
                  <span className="mono-heading mt-1 block text-[11px] text-muted">
                    {resource.kind}
                    {resource.category && <span> · {resource.category}</span>}
                    {resource.tags.slice(0, 2).map((tag) => (
                      <span key={tag}> · {tag}</span>
                    ))}
                  </span>
                </span>
                {resource.href && (
                  <ArrowUpRight
                    size={14}
                    className="shrink-0 text-muted transition group-hover:text-accent"
                  />
                )}
              </>
            );

            return resource.href ? (
              <a
                key={resource.id}
                href={resource.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-start justify-between gap-4 py-4"
              >
                {content}
              </a>
            ) : (
              <div key={resource.id} className="flex items-start justify-between gap-4 py-4">
                {content}
              </div>
            );
          })}
        </div>
      ) : (
        <p className="mt-8 border border-border bg-surface p-5 text-sm text-muted">
          No resources published yet.
        </p>
      )}
    </AnimatedPage>
  );
}

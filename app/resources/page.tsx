import type { Metadata } from "next";
import { Database, Library, ShieldAlert, Tags } from "lucide-react";
import AnimatedPage from "@/components/AnimatedPage";
import ResourceExplorer from "@/components/ResourceExplorer";
import { getResourceState } from "@/lib/resources";

export const metadata: Metadata = {
  title: "Resources / Deval Kotak",
};

export default function ResourcesPage() {
  const state = getResourceState();
  const kindCount = new Set(state.resources.map((resource) => resource.kind)).size;
  const tagCount = new Set(state.resources.flatMap((resource) => resource.tags)).size;

  return (
    <AnimatedPage className="wide-shell">
      <header className="grid gap-6 border-b border-border pb-8 lg:grid-cols-[1fr_340px]">
        <section>
          <p className="mono-heading text-sm text-accent">{"// resources"}</p>
          <h1 className="mono-heading mt-4 text-4xl font-semibold text-foreground sm:text-5xl">
            Resources
          </h1>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-muted">
            Security references and useful links, generated from Notion once the
            resources database is connected.
          </p>
        </section>

        <section className="grid grid-cols-3 border border-border bg-surface">
          <HeaderMetric icon={Library} label="items" value={state.resources.length} />
          <HeaderMetric icon={Database} label="kinds" value={kindCount} />
          <HeaderMetric icon={Tags} label="tags" value={tagCount} />
        </section>
      </header>

      {state.error ? (
        <p className="mt-8 border border-border bg-surface p-5 text-sm text-body">
          <ShieldAlert className="mr-2 inline text-accent" size={16} />
          Resources database failed to load.
        </p>
      ) : null}

      {state.resources.length > 0 ? (
        <ResourceExplorer resources={state.resources} />
      ) : (
        <section className="mt-8 border border-border bg-surface p-6">
          <Library size={18} className="text-accent" />
          <h2 className="mt-4 text-base font-semibold text-foreground">
            No resources published yet.
          </h2>
          <p className="mt-3 max-w-xl text-sm leading-6 text-muted">
            Connect the resources Notion database and run the content build to populate
            this page.
          </p>
        </section>
      )}
    </AnimatedPage>
  );
}

function HeaderMetric({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Library;
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

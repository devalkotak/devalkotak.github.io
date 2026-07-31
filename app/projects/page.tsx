import type { Metadata } from "next";
import { ArrowUpRight, GitBranch, Star } from "lucide-react";
import AnimatedPage from "@/components/AnimatedPage";
import Tilt3D from "@/components/Tilt3D";
import { getPortfolioProjectState } from "@/lib/github";

export const metadata: Metadata = {
  title: "Projects / Deval Kotak",
  description:
    "Security tooling, market experiments, and everything else pulled live from GitHub.",
};

export default async function ProjectsPage() {
  const { projects, error } = await getPortfolioProjectState();

  return (
    <AnimatedPage className="content-shell">
      <header className="border-b border-border pb-8">
        <p className="mono-heading flex items-center gap-2 text-sm text-accent">
          <GitBranch size={16} />
          projects/
        </p>
        <h1 className="mono-heading mt-4 text-3xl font-semibold text-foreground sm:text-4xl">
          Things I&apos;ve shipped
        </h1>
        <p className="mt-4 max-w-2xl text-base leading-7 text-body">
          Pulled straight from GitHub — every repo tagged{" "}
          <code className="mono-heading text-accent">portfolio</code>. No
          stale screenshots, no copy I forgot to update.
        </p>
      </header>

      {error ? (
        <p className="mt-8 border border-border bg-surface p-5 text-sm text-muted">
          Couldn&apos;t reach GitHub right now: {error}
        </p>
      ) : projects.length > 0 ? (
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <Tilt3D key={project.id}>
              <a
                href={project.url}
                target="_blank"
                rel="noopener noreferrer"
                className="panel-3d group block h-full border border-border p-5 hover:border-accent/30"
              >
                <span className="mono-heading flex items-center justify-between gap-2 text-sm text-foreground group-hover:text-accent">
                  <span className="truncate">{project.name}</span>
                  <ArrowUpRight
                    size={14}
                    className="shrink-0 text-muted group-hover:text-accent"
                  />
                </span>
                <p className="mt-3 text-sm leading-6 text-muted">
                  {project.description || "No description yet."}
                </p>
                <div className="mt-5 flex flex-wrap items-center gap-3 border-t border-border pt-4 text-xs text-muted">
                  {project.language && (
                    <span className="mono-heading">{project.language}</span>
                  )}
                  {project.stars > 0 && (
                    <span className="inline-flex items-center gap-1">
                      <Star size={12} />
                      {project.stars}
                    </span>
                  )}
                  {project.topics.slice(0, 3).map((topic) => (
                    <span
                      key={topic}
                      className="border border-border px-2 py-0.5"
                    >
                      {topic}
                    </span>
                  ))}
                </div>
              </a>
            </Tilt3D>
          ))}
        </div>
      ) : (
        <p className="mt-8 border border-border bg-surface p-5 text-sm text-muted">
          Nothing tagged <code className="mono-heading text-accent">portfolio</code>{" "}
          on GitHub yet.
        </p>
      )}
    </AnimatedPage>
  );
}

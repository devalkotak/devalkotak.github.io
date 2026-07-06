import type { Metadata } from "next";
import AnimatedPage from "@/components/AnimatedPage";
import ProjectCard from "@/components/ProjectCard";
import { getPortfolioProjectState } from "@/lib/github";

export const metadata: Metadata = {
  title: "Projects / Deval Kotak",
};

export default async function ProjectsPage() {
  const state = await getPortfolioProjectState();

  return (
    <AnimatedPage className="content-shell">
      <header className="border-b border-border pb-8">
        <h1 className="mono-heading text-3xl font-semibold text-foreground">
          {"// projects"}
        </h1>
        <p className="mt-3 text-sm leading-6 text-muted">
          {"tagged 'portfolio' on github - updated automatically"}
        </p>
      </header>

      {state.error ? (
        <p className="mt-8 border border-border bg-surface p-5 text-sm text-body">
          Failed to load - visit{" "}
          <a
            className="text-accent underline underline-offset-4"
            href="https://github.com/devalkotak"
            target="_blank"
            rel="noopener noreferrer"
          >
            github.com/devalkotak
          </a>
        </p>
      ) : null}

      {!state.error && state.projects.length === 0 ? (
        <p className="mt-8 border border-border bg-surface p-5 text-sm text-muted">
          No portfolio-tagged projects found yet.
        </p>
      ) : null}

      <section className="mt-8 grid gap-4 md:grid-cols-2">
        {state.projects.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </section>
    </AnimatedPage>
  );
}

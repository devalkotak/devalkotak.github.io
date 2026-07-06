import Link from "next/link";
import {
  ArrowRight,
  BookOpenText,
  BriefcaseBusiness,
  Library,
  FolderGit2,
  GitBranch,
  Mail,
  ShieldAlert,
} from "lucide-react";
import AnimatedPage from "@/components/AnimatedPage";
import CursorGlow from "@/components/CursorGlow";
import { getPortfolioProjectState } from "@/lib/github";
import { getPublishedWriteups } from "@/lib/notion";
import { getResources } from "@/lib/resources";

export default async function Home() {
  const [projectState, writeups] = await Promise.all([
    getPortfolioProjectState(),
    getPublishedWriteups(),
  ]);
  const resources = getResources();

  return (
    <AnimatedPage className="wide-shell relative overflow-hidden">
      <CursorGlow />

      <section className="relative z-10 border-b border-border pb-10">
        <p className="mono-heading text-sm text-accent">deval kotak / security systems</p>
        <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_320px]">
          <div>
            <h1 className="mono-heading max-w-4xl text-5xl font-semibold leading-tight text-foreground sm:text-7xl">
              Deval Kotak
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-body">
              Security engineer building detection workflows, security notes, and
              fintech-focused research.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <PrimaryLink href="/projects">Projects</PrimaryLink>
              <SecondaryLink href="/writeups">Writeups</SecondaryLink>
              <SecondaryLink href="/resources">Resources</SecondaryLink>
            </div>

            <div className="mt-8 flex items-center gap-3">
              <SocialLink href="https://github.com/devalkotak" label="GitHub">
                <GitBranch size={18} />
              </SocialLink>
              <SocialLink href="https://linkedin.com/in/devalkotak" label="LinkedIn">
                <BriefcaseBusiness size={18} />
              </SocialLink>
              <SocialLink href="mailto:devalktk@gmail.com" label="Email">
                <Mail size={18} />
              </SocialLink>
            </div>
          </div>

          <aside className="border border-border bg-surface p-5">
            <div className="flex items-center justify-between gap-3 border-b border-border pb-4">
              <span className="mono-heading text-sm text-foreground">content index</span>
              <ShieldAlert size={18} className="text-accent" />
            </div>
            <div className="mt-5 grid gap-3">
              <HomeMetric label="portfolio repos" value={projectState.projects.length} />
              <HomeMetric label="published writeups" value={writeups.length} />
              <HomeMetric label="resources" value={resources.length} />
            </div>
          </aside>
        </div>
      </section>

      <section className="relative z-10 grid gap-4 py-8 md:grid-cols-3">
        <FocusCard
          icon={ShieldAlert}
          title="Security pipelines"
          body="LLM-backed security workflows, triage automation, and detection support."
        />
        <FocusCard
          icon={Library}
          title="Resources"
          body="Security links and references kept searchable as the collection grows."
        />
        <FocusCard
          icon={BookOpenText}
          title="Research notes"
          body="CTFs, labs, and technical notes managed in Notion and generated statically."
        />
      </section>

      <section className="relative z-10 grid gap-6 border-t border-border pt-8 lg:grid-cols-[1fr_1fr]">
        <HomePanel title="latest writeups" href="/writeups">
          <div className="divide-y divide-border">
            {writeups.slice(0, 3).map((writeup) => (
              <Link
                key={writeup.id}
                href={`/writeups/${writeup.slug}`}
                className="group flex items-start justify-between gap-4 py-4"
              >
                <span className="min-w-0">
                  <span className="block truncate text-sm font-medium text-foreground group-hover:text-accent">
                    {writeup.title}
                  </span>
                  <span className="mt-2 flex flex-wrap gap-2 text-xs text-muted">
                    <span>{writeup.category}</span>
                    {writeup.tags.slice(0, 2).map((tag) => (
                      <span key={tag}>#{tag}</span>
                    ))}
                  </span>
                </span>
                <ArrowRight size={14} className="mt-1 shrink-0 text-muted" />
              </Link>
            ))}
          </div>
        </HomePanel>

        <HomePanel title="active project surface" href="/projects">
          <div className="divide-y divide-border">
            {projectState.projects.slice(0, 3).map((project) => (
              <a
                key={project.id}
                href={project.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-start justify-between gap-4 py-4"
              >
                <span className="min-w-0">
                  <span className="block truncate text-sm font-medium text-foreground group-hover:text-accent">
                    {project.name}
                  </span>
                  <span className="mt-2 block line-clamp-2 text-xs leading-5 text-muted">
                    {project.description}
                  </span>
                </span>
                <FolderGit2 size={14} className="mt-1 shrink-0 text-muted" />
              </a>
            ))}
          </div>
        </HomePanel>
      </section>
    </AnimatedPage>
  );
}

function PrimaryLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="inline-flex h-10 items-center gap-2 border border-accent/60 bg-[var(--color-accent-muted)] px-4 text-sm font-medium text-accent transition hover:border-accent"
    >
      {children}
      <ArrowRight size={14} />
    </Link>
  );
}

function SecondaryLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="inline-flex h-10 items-center gap-2 border border-border px-4 text-sm text-body transition hover:border-accent/60 hover:text-accent"
    >
      {children}
    </Link>
  );
}

function SocialLink({
  href,
  label,
  children,
}: {
  href: string;
  label: string;
  children: React.ReactNode;
}) {
  const external = href.startsWith("http");
  return (
    <a
      className="grid size-10 place-items-center border border-border bg-surface text-body transition hover:border-accent/60 hover:bg-surfaceHover hover:text-accent"
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
      aria-label={label}
    >
      {children}
    </a>
  );
}

function HomeMetric({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex items-center justify-between gap-4 border border-border bg-code px-4 py-3">
      <span className="text-sm text-muted">{label}</span>
      <span className="mono-heading text-lg font-semibold text-foreground">{value}</span>
    </div>
  );
}

function FocusCard({
  icon: Icon,
  title,
  body,
}: {
  icon: typeof ShieldAlert;
  title: string;
  body: string;
}) {
  return (
    <article className="border border-border bg-surface p-5">
      <Icon size={18} className="text-accent" />
      <h2 className="mt-4 text-base font-semibold text-foreground">{title}</h2>
      <p className="mt-3 text-sm leading-6 text-muted">{body}</p>
    </article>
  );
}

function HomePanel({
  title,
  href,
  children,
}: {
  title: string;
  href: string;
  children: React.ReactNode;
}) {
  return (
    <section className="border border-border bg-surface px-5">
      <div className="flex items-center justify-between gap-4 border-b border-border py-4">
        <h2 className="mono-heading text-base font-semibold text-foreground">{title}</h2>
        <Link
          href={href}
          className="inline-flex items-center gap-2 text-xs text-muted transition hover:text-accent"
        >
          Open
          <ArrowRight size={13} />
        </Link>
      </div>
      {children}
    </section>
  );
}

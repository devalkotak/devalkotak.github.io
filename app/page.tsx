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
import Tilt3D from "@/components/Tilt3D";
import { getPortfolioProjectState } from "@/lib/github";
import { getPublishedWriteups } from "@/lib/notion";

export default async function Home() {
  const [projectState, writeups] = await Promise.all([
    getPortfolioProjectState(),
    getPublishedWriteups(),
  ]);
  const featured = projectState.projects[0] ?? null;

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

          <aside className="panel-3d border border-border p-5">
            <div className="flex items-center justify-between gap-3 border-b border-border pb-4">
              <span className="mono-heading text-sm text-foreground">status</span>
              <span className="relative flex size-2" aria-hidden="true">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-60" />
                <span className="relative inline-flex size-2 rounded-full bg-accent" />
              </span>
            </div>
            <dl className="mt-5 grid gap-4">
              <StatusRow label="focus" value="AppSec tooling and vulnerability triage" />
              <StatusRow label="building" value="reachability-cve-triage" />
              <StatusRow label="training" value="PortSwigger Web Security Academy" />
              <StatusRow label="open to" value="security engineering roles" />
            </dl>
          </aside>
        </div>
      </section>

      <section className="relative z-10 border-b border-border py-8">
        <p className="mono-heading text-sm text-accent">about</p>
        <div className="mt-4 max-w-3xl space-y-4 text-base leading-8 text-body">
          <p>
            I am a security engineer in Mumbai. I have worked with the
            cybersecurity team at JioStar as an intern and serve as Vice
            President of DJS ISACA, my university&apos;s security chapter.
          </p>
          <p>
            Most of my work is Python tooling for application security: figuring
            out which vulnerable dependencies are actually reachable, which
            findings are real, and what deserves attention first. I care more
            about proving a finding than listing it. When I am not building, I
            am working through PortSwigger labs and writing up what I learn.
          </p>
        </div>
      </section>

      <section className="relative z-10 grid gap-4 py-8 md:grid-cols-3">
        <Tilt3D>
          <FocusCard
            icon={ShieldAlert}
            title="Security pipelines"
            body="LLM-backed security workflows, triage automation, and detection support."
          />
        </Tilt3D>
        <Tilt3D>
          <FocusCard
            icon={Library}
            title="Resources"
            body="Security links and references kept searchable as the collection grows."
          />
        </Tilt3D>
        <Tilt3D>
          <FocusCard
            icon={BookOpenText}
            title="Research notes"
            body="CTFs, labs, and technical notes managed in Notion and generated statically."
          />
        </Tilt3D>
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

        <HomePanel title="featured project" href="/projects">
          {featured ? (
            <a
              href={featured.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group block py-4"
            >
              <span className="flex items-start justify-between gap-4">
                <span className="mono-heading break-words text-sm font-semibold text-foreground group-hover:text-accent">
                  {featured.name}
                </span>
                <FolderGit2 size={15} className="mt-0.5 shrink-0 text-muted group-hover:text-accent" />
              </span>
              <p className="mt-3 text-sm leading-6 text-body">{featured.description}</p>
              {featured.topics.length > 0 ? (
                <span className="mt-4 flex flex-wrap gap-2">
                  {featured.topics.slice(0, 5).map((topic) => (
                    <span
                      key={topic}
                      className="border border-border bg-code px-2 py-1 text-[11px] text-muted"
                    >
                      {topic}
                    </span>
                  ))}
                </span>
              ) : null}
            </a>
          ) : (
            <p className="py-4 text-sm text-muted">
              Project spotlight loads from GitHub repos tagged portfolio.
            </p>
          )}
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

function StatusRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid gap-1">
      <dt className="mono-heading text-[11px] uppercase tracking-wider text-muted">{label}</dt>
      <dd className="text-sm leading-6 text-body">{value}</dd>
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
    <article className="panel-3d h-full border border-border p-5 hover:border-accent/30">
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
    <section className="panel-3d border border-border px-5">
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

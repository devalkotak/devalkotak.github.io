import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  BriefcaseBusiness,
  FileText,
  GitBranch,
  Library,
  Mail,
  ShieldCheck,
  Sparkles,
  Terminal,
} from "lucide-react";
import AnimatedPage from "@/components/AnimatedPage";
import CursorGlow from "@/components/CursorGlow";
import SessionBlock from "@/components/SessionBlock";
import Tilt3D from "@/components/Tilt3D";
import TypedIdentity from "@/components/TypedIdentity";
import { getPortfolioProjectState } from "@/lib/github";
import { getPublishedWriteups } from "@/lib/notion";
import { getResources } from "@/lib/resources";

const WHOAMI_LINES = [
  "I break systems to understand them, and study markets to predict them.",
  "I build security tooling in Mumbai, and show up for people offline too.",
  "This site is the log of all three.",
];

export default async function Home() {
  const [projectState, writeups] = await Promise.all([
    getPortfolioProjectState(),
    getPublishedWriteups(),
  ]);
  const resources = getResources();

  const destinations: Destination[] = [
    {
      href: "/projects",
      label: "projects/",
      title: "Things I've shipped",
      description: "Security tooling, market experiments, and the rest — pulled live from GitHub.",
      meta: countLabel(projectState.projects.length, "repo"),
      icon: <GitBranch size={16} />,
    },
    {
      href: "/blog",
      label: "blog/",
      title: "Writeups",
      description: "Things I broke, fixed, or finally understood — written up as I go.",
      meta: countLabel(writeups.length, "writeup"),
      icon: <Terminal size={16} />,
    },
    {
      href: "/resources",
      label: "resources/",
      title: "Worth bookmarking",
      description: "Tools, references, and reading that survived the purge.",
      meta: countLabel(resources.length, "link"),
      icon: <Library size={16} />,
    },
    {
      href: "/optiverse",
      label: "optiverse/",
      title: "The offline thread",
      description: "A student mentorship org I co-founded. 150,000+ students later — paused, not dead.",
      meta: "150k+ students",
      icon: <Sparkles size={16} />,
    },
    {
      href: "/resume",
      label: "resume/",
      title: "The one-pager",
      description: "All of this, but in a format recruiters trust.",
      meta: "PDF",
      icon: <FileText size={16} />,
    },
    {
      href: "/security",
      label: "security/",
      title: "How this site is secured",
      description: "The threat model for the page you are reading right now.",
      meta: "threat model",
      icon: <ShieldCheck size={16} />,
    },
  ];

  return (
    <AnimatedPage className="wide-shell relative overflow-hidden">
      <CursorGlow />

      {/* hero */}
      <section className="relative z-10 border-b border-border pb-14">
        <p className="mono-heading text-sm text-muted">
          <span className="text-accent">~</span> deval kotak — mumbai
        </p>
        <h1 className="mono-heading mt-6 text-5xl font-semibold leading-tight text-foreground sm:text-7xl">
          Deval Kotak
        </h1>
        <p className="mono-heading mt-4 text-base text-accent sm:text-lg">
          security · markets · people
        </p>

        <div className="mt-10 max-w-2xl">
          <p className="mono-heading text-sm text-muted">
            <span className="text-accent">&gt;</span> whoami
          </p>
          <div className="mt-3">
            <TypedIdentity lines={WHOAMI_LINES} />
          </div>
        </div>

        <div className="mt-10 flex flex-wrap items-center gap-3">
          <AnchorButton href="/projects" primary>
            Projects
          </AnchorButton>
          <AnchorButton href="/blog">Blog</AnchorButton>
          <AnchorButton href="/resume">Resume</AnchorButton>
          <span className="mx-1 hidden h-6 w-px bg-border sm:block" />
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
      </section>

      {/* explore */}
      <SessionBlock className="relative z-10 border-b border-border py-12">
        <SectionHeading
          command="explore"
          subtitle="Six doors. Pick one — they all lead somewhere I actually work."
        />
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {destinations.map((destination) => (
            <Tilt3D key={destination.href}>
              <Link
                href={destination.href}
                className="panel-3d group block h-full border border-border p-5 hover:border-accent/30"
              >
                <p className="mono-heading flex items-center justify-between text-xs text-accent">
                  <span className="flex items-center gap-2">
                    {destination.icon}
                    {destination.label}
                  </span>
                  <ArrowUpRight
                    size={14}
                    className="text-muted transition group-hover:text-accent"
                  />
                </p>
                <h3 className="mt-3 text-base font-semibold text-foreground transition group-hover:text-accent">
                  {destination.title}
                </h3>
                <p className="mt-2 text-sm leading-6 text-muted">
                  {destination.description}
                </p>
                <p className="mono-heading mt-4 border-t border-border pt-3 text-[11px] text-muted">
                  {destination.meta}
                </p>
              </Link>
            </Tilt3D>
          ))}
        </div>
      </SessionBlock>

      {/* now */}
      <SessionBlock className="relative z-10 border-b border-border py-12">
        <SectionHeading command="now" subtitle="What has my attention this season." />
        <dl className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <NowItem label="building" value="reachability-cve-triage — proving which vulnerable dependencies actually matter" />
          <NowItem label="training" value="PortSwigger Web Security Academy, one lab at a time" />
          <NowItem label="studying" value="market microstructure and the math under it" />
          <NowItem label="open to" value="security engineering roles" />
        </dl>
      </SessionBlock>

      {/* work */}
      <SessionBlock id="work" className="relative z-10 scroll-mt-24 border-b border-border py-12">
        <SectionHeading
          command="work"
          subtitle="Three threads. One is deep, two are growing."
        />

        <div className="mt-8 grid gap-4 lg:grid-cols-3">
          <Tilt3D>
            <TrackCard
              track="security/"
              title="Breaking and defending"
              body="Application security tooling in Python: vulnerability reachability, triage automation, and detection workflows. Interned with the cybersecurity team at JioStar; Vice President of DJS ISACA."
            >
              {projectState.projects.length > 0 ? (
                <ul className="mt-5 grid gap-3 border-t border-border pt-4">
                  {projectState.projects.slice(0, 3).map((project) => (
                    <li key={project.id}>
                      <a
                        href={project.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group block"
                      >
                        <span className="mono-heading flex items-center justify-between gap-2 text-sm text-foreground group-hover:text-accent">
                          <span className="truncate">{project.name}</span>
                          <ArrowUpRight size={13} className="shrink-0 text-muted group-hover:text-accent" />
                        </span>
                        <span className="mt-1 block text-xs leading-5 text-muted">
                          {project.description}
                        </span>
                      </a>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="mt-5 border-t border-border pt-4 text-xs text-muted">
                  Projects load from GitHub repos tagged portfolio.
                </p>
              )}
            </TrackCard>
          </Tilt3D>

          <Tilt3D>
            <TrackCard
              track="markets/"
              title="Pricing and predicting"
              body="Quantitative finance, studied from first principles. Backtests, market microstructure notes, and small pricing experiments."
            >
              <p className="mt-5 border-t border-border pt-4 text-xs leading-5 text-muted">
                First entries are in the works. The reading list is already long.
              </p>
            </TrackCard>
          </Tilt3D>

          <Tilt3D>
            <TrackCard
              track="people/"
              title="Showing up offline"
              body="Community and social work — the projects that help someone other than a computer. Teaching, volunteering, and organizing."
            >
              <p className="mt-5 border-t border-border pt-4 text-xs leading-5 text-muted">
                Exhibit A:{" "}
                <Link href="/optiverse" className="text-accent hover:underline">
                  Optiverse
                </Link>{" "}
                — 150,000+ students reached.
              </p>
            </TrackCard>
          </Tilt3D>
        </div>
      </SessionBlock>

      {/* life */}
      <SessionBlock id="life" className="relative z-10 scroll-mt-24 border-b border-border py-12">
        <SectionHeading command="life" subtitle="The person behind the prompt." />
        <div className="mt-6 max-w-3xl space-y-4 text-base leading-8 text-body">
          <p>
            I am an engineer in Mumbai. Security is my trade: I interned with
            the cybersecurity team at JioStar and serve as Vice President of
            DJS ISACA, my university&apos;s security chapter. Most of my
            technical work is Python tooling for application security — proving
            which findings are real instead of listing them.
          </p>
          <p>
            But security is not the whole story. I am drawn to markets and the
            quantitative machinery behind them, and I spend real time on work
            that has nothing to do with a terminal — including{" "}
            <Link href="/optiverse" className="text-accent hover:underline">
              a mentorship org
            </Link>{" "}
            that grew past 150,000 students.
          </p>
          <p>
            This site collects all of it: projects, writeups, and the
            occasional life update. The terminal aesthetic stays. The content
            refuses to fit in one directory.
          </p>
        </div>
      </SessionBlock>

      {/* contact */}
      <SessionBlock id="contact" className="relative z-10 scroll-mt-24 py-12">
        <SectionHeading command="contact" subtitle="The inbox is open." />
        <div className="mt-6 flex flex-wrap items-center gap-3">
          <a
            href="mailto:devalktk@gmail.com"
            className="inline-flex h-10 items-center gap-2 border border-accent/60 bg-[var(--color-accent-muted)] px-4 text-sm font-medium text-accent transition hover:border-accent"
          >
            devalktk@gmail.com
            <Mail size={14} />
          </a>
          <Link
            href="/resume"
            className="inline-flex h-10 items-center gap-2 border border-border px-4 text-sm text-body transition hover:border-accent/60 hover:text-accent"
          >
            Resume
            <ArrowUpRight size={14} />
          </Link>
        </div>
      </SessionBlock>
    </AnimatedPage>
  );
}

type Destination = {
  href: string;
  label: string;
  title: string;
  description: string;
  meta: string;
  icon: React.ReactNode;
};

function SectionHeading({
  command,
  subtitle,
}: {
  command: string;
  subtitle: string;
}) {
  return (
    <header>
      <h2 className="mono-heading text-lg font-semibold text-foreground">
        <span className="text-accent">&gt;</span> {command}
      </h2>
      <p className="mt-2 text-sm text-muted">{subtitle}</p>
    </header>
  );
}

function NowItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid gap-1">
      <dt className="mono-heading text-[11px] uppercase tracking-wider text-accent">
        {label}
      </dt>
      <dd className="text-sm leading-6 text-body">{value}</dd>
    </div>
  );
}

function TrackCard({
  track,
  title,
  body,
  children,
}: {
  track: string;
  title: string;
  body: string;
  children?: React.ReactNode;
}) {
  return (
    <article className="panel-3d h-full border border-border p-5 hover:border-accent/30">
      <p className="mono-heading text-xs text-accent">{track}</p>
      <h3 className="mt-3 text-base font-semibold text-foreground">{title}</h3>
      <p className="mt-3 text-sm leading-6 text-muted">{body}</p>
      {children}
    </article>
  );
}

function AnchorButton({
  href,
  primary,
  children,
}: {
  href: string;
  primary?: boolean;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className={
        primary
          ? "inline-flex h-10 items-center gap-2 border border-accent/60 bg-[var(--color-accent-muted)] px-4 text-sm font-medium text-accent transition hover:border-accent"
          : "inline-flex h-10 items-center gap-2 border border-border px-4 text-sm text-body transition hover:border-accent/60 hover:text-accent"
      }
    >
      {children}
      <ArrowRight size={14} />
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

function countLabel(count: number, noun: string) {
  return `${count} ${noun}${count === 1 ? "" : "s"}`;
}

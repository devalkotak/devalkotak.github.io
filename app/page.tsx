import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  BriefcaseBusiness,
  GitBranch,
  Mail,
} from "lucide-react";
import AnimatedPage from "@/components/AnimatedPage";
import CursorGlow from "@/components/CursorGlow";
import Tilt3D from "@/components/Tilt3D";
import TypedIdentity from "@/components/TypedIdentity";
import { getPortfolioProjectState } from "@/lib/github";
import { getPublishedWriteups } from "@/lib/notion";

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
          <AnchorButton href="#work" primary>
            Work
          </AnchorButton>
          <AnchorButton href="#articles">Articles</AnchorButton>
          <AnchorButton href="#life">Life</AnchorButton>
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

      {/* now */}
      <section className="relative z-10 border-b border-border py-12">
        <SectionHeading command="now" subtitle="What has my attention this season." />
        <dl className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <NowItem label="building" value="reachability-cve-triage — proving which vulnerable dependencies actually matter" />
          <NowItem label="training" value="PortSwigger Web Security Academy, one lab at a time" />
          <NowItem label="studying" value="market microstructure and the math under it" />
          <NowItem label="open to" value="security engineering roles" />
        </dl>
      </section>

      {/* work */}
      <section id="work" className="relative z-10 scroll-mt-24 border-b border-border py-12">
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
                Stories from this thread are coming as I write them up.
              </p>
            </TrackCard>
          </Tilt3D>
        </div>
      </section>

      {/* articles */}
      <section id="articles" className="relative z-10 scroll-mt-24 border-b border-border py-12">
        <SectionHeading
          command="articles"
          subtitle="Things I broke, fixed, or finally understood — written up as I go."
        />

        {writeups.length > 0 ? (
          <div className="mt-6 divide-y divide-border">
            {writeups.map((writeup) => (
              <Link
                key={writeup.id}
                href={`/articles/${writeup.slug}`}
                className="group flex items-baseline justify-between gap-4 py-4"
              >
                <span className="min-w-0">
                  <span className="block text-sm font-medium leading-6 text-foreground transition group-hover:text-accent sm:truncate">
                    {writeup.title}
                  </span>
                  <span className="mono-heading mt-1 block text-[11px] text-muted">
                    {writeup.category}
                    {writeup.tags.slice(0, 2).map((tag) => (
                      <span key={tag}> · {tag}</span>
                    ))}
                  </span>
                </span>
                <span className="flex shrink-0 items-center gap-3">
                  <time className="mono-heading text-xs text-muted" dateTime={writeup.date}>
                    {formatDate(writeup.date)}
                  </time>
                  <ArrowRight size={14} className="text-muted transition group-hover:text-accent" />
                </span>
              </Link>
            ))}
          </div>
        ) : (
          <p className="mt-6 border border-border bg-surface p-5 text-sm text-muted">
            No articles published yet.
          </p>
        )}
      </section>

      {/* life */}
      <section id="life" className="relative z-10 scroll-mt-24 border-b border-border py-12">
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
            that has nothing to do with a terminal — community and social work
            that keeps me honest about who systems are for.
          </p>
          <p>
            This site collects all of it: projects, articles, and the
            occasional life update. The terminal aesthetic stays. The content
            refuses to fit in one directory.
          </p>
        </div>
      </section>

      {/* contact */}
      <section id="contact" className="relative z-10 scroll-mt-24 py-12">
        <SectionHeading command="contact" subtitle="The inbox is open." />
        <div className="mt-6 flex flex-wrap items-center gap-3">
          <a
            href="mailto:devalktk@gmail.com"
            className="inline-flex h-10 items-center gap-2 border border-accent/60 bg-[var(--color-accent-muted)] px-4 text-sm font-medium text-accent transition hover:border-accent"
          >
            devalktk@gmail.com
            <Mail size={14} />
          </a>
          <a
            href="/resume.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-10 items-center gap-2 border border-border px-4 text-sm text-body transition hover:border-accent/60 hover:text-accent"
          >
            Resume
            <ArrowUpRight size={14} />
          </a>
        </div>
      </section>
    </AnimatedPage>
  );
}

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
    <a
      href={href}
      className={
        primary
          ? "inline-flex h-10 items-center gap-2 border border-accent/60 bg-[var(--color-accent-muted)] px-4 text-sm font-medium text-accent transition hover:border-accent"
          : "inline-flex h-10 items-center gap-2 border border-border px-4 text-sm text-body transition hover:border-accent/60 hover:text-accent"
      }
    >
      {children}
      <ArrowRight size={14} />
    </a>
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

function formatDate(date: string) {
  return new Intl.DateTimeFormat("en", {
    month: "short",
    year: "numeric",
  }).format(new Date(date));
}

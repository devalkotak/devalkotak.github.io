import Link from "next/link";
import {
  ArrowUpRight,
  BriefcaseBusiness,
  GitBranch,
  Mail,
} from "lucide-react";
import AnimatedPage from "@/components/AnimatedPage";
import BreakMeBox from "@/components/BreakMeBox";
import CursorGlow from "@/components/CursorGlow";
import HomeMischief from "@/components/HomeMischief";
import HonestyBadge from "@/components/HonestyBadge";
import NoCookieBanner from "@/components/NoCookieBanner";
import SessionBlock from "@/components/SessionBlock";
import VisitorAudit from "@/components/VisitorAudit";
import { getPortfolioProjectState } from "@/lib/github";
import { getPublishedWriteups } from "@/lib/notion";
import { getResources } from "@/lib/resources";

export default async function Home() {
  const [projectState, writeups] = await Promise.all([
    getPortfolioProjectState(),
    getPublishedWriteups(),
  ]);
  const resources = getResources();

  const index: IndexRow[] = [
    {
      href: "/projects",
      number: "01",
      title: "Projects",
      note: "things I shipped",
      meta: countLabel(projectState.projects.length, "repo"),
    },
    {
      href: "/blog",
      number: "02",
      title: "Blog",
      note: "things I broke, then explained",
      meta: countLabel(writeups.length, "writeup"),
    },
    {
      href: "/resources",
      number: "03",
      title: "Resources",
      note: "bookmarks that earned it",
      meta: countLabel(resources.length, "link"),
    },
    {
      href: "/optiverse",
      number: "04",
      title: "Optiverse",
      note: "the part with humans in it",
      meta: "150k+ students",
    },
    {
      href: "/resume",
      number: "05",
      title: "Resume",
      note: "the formal version",
      meta: "PDF",
    },
    {
      href: "/security",
      number: "06",
      title: "Security",
      note: "this site's own threat model",
      meta: "yes, really",
    },
  ];

  return (
    <AnimatedPage className="wide-shell relative overflow-hidden">
      <CursorGlow />
      <HomeMischief />
      <NoCookieBanner />

      {/* manifesto hero */}
      <section className="relative z-10 pb-16 pt-4">
        <p className="mono-heading text-sm text-muted">
          deval kotak <span className="text-accent">/</span> mumbai{" "}
          <span className="text-accent">/</span> application security
        </p>

        <div className="mt-10 space-y-2">
          <h1 className="text-balance font-semibold leading-[1.05] text-foreground" style={{ fontSize: "clamp(2.4rem, 7vw, 5.5rem)" }}>
            I break systems{" "}
            <span className="text-muted">to understand them.</span>
          </h1>
          <p className="text-balance font-semibold leading-[1.05] text-foreground" style={{ fontSize: "clamp(2.4rem, 7vw, 5.5rem)" }}>
            Then I prove it{" "}
            <span className="text-accent">in writing.</span>
          </p>
        </div>

        <p className="mt-8 max-w-xl text-base leading-8 text-body">
          Security engineer in the making — Python tooling that separates real
          vulnerabilities from noise. There was a markets phase, there is a
          mentorship org with 150,000 students, and there will be more
          detours. This site logs all of it.
        </p>

        <div className="mt-10 flex flex-wrap items-center gap-3">
          <SocialLink href="https://github.com/devalkotak" label="GitHub">
            <GitBranch size={18} />
          </SocialLink>
          <SocialLink href="https://linkedin.com/in/devalkotak" label="LinkedIn">
            <BriefcaseBusiness size={18} />
          </SocialLink>
          <SocialLink href="mailto:devalktk@gmail.com" label="Email">
            <Mail size={18} />
          </SocialLink>
          <span className="mono-heading ml-2 text-xs text-muted">
            open to security engineering roles
          </span>
        </div>
      </section>

      {/* currently */}
      <SessionBlock className="relative z-10 border-t border-border py-10">
        <p className="mono-heading text-xs uppercase tracking-widest text-accent">
          currently
        </p>
        <div className="mt-5 grid gap-x-8 gap-y-5 sm:grid-cols-3">
          <CurrentItem
            label="building"
            value="reachability-cve-triage"
            detail="proving which vulnerable dependencies actually matter"
          />
          <CurrentItem
            label="training"
            value="PortSwigger Academy"
            detail="one lab at a time, in order, no skipping"
          />
          <CurrentItem
            label="holding"
            value="VP, DJS ISACA"
            detail="after a cybersecurity internship at JioStar"
          />
        </div>
      </SessionBlock>

      {/* life */}
      <SessionBlock id="life" className="relative z-10 border-t border-border py-10">
        <div className="grid gap-8 lg:grid-cols-[1fr_1fr]">
          <div>
            <p className="mono-heading text-xs uppercase tracking-widest text-accent">
              off the clock
            </p>
            <div className="mt-5 space-y-4 text-base leading-8 text-body">
              <p>
                Not everything here compiles. I co-founded{" "}
                <Link href="/optiverse" className="text-accent hover:underline">
                  Optiverse
                </Link>
                , a student-run mentorship org that reached 150,000+ students
                before we hit pause — still the work I measure everything else
                against. I went through a proper quantitative-markets phase
                too; the notes survive, the obsession rotated.
              </p>
              <p>
                The common thread: take a system apart, figure out who it
                actually serves, write down what you found.
              </p>
            </div>
          </div>
          <div className="flex flex-col justify-end gap-4 lg:items-end">
            <p className="mono-heading text-right text-xs leading-6 text-muted">
              breaking things since before it was a job title
            </p>
            <div className="flex flex-wrap items-center gap-3">
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
          </div>
        </div>
      </SessionBlock>

      {/* complimentary security audit */}
      <SessionBlock className="relative z-10 border-t border-border py-10">
        <div className="grid gap-8 lg:grid-cols-[minmax(16rem,1fr)_1.4fr]">
          <div>
            <p className="mono-heading text-xs uppercase tracking-widest text-accent">
              complimentary audit
            </p>
            <h2 className="mt-4 text-2xl font-semibold leading-snug text-foreground">
              You&apos;ve been on this page for a while. Want me to check you
              for vulnerabilities?
            </h2>
          </div>
          <VisitorAudit />
        </div>
      </SessionBlock>

      {/* break me */}
      <SessionBlock className="relative z-10 border-t border-border py-10">
        <div className="grid gap-8 lg:grid-cols-[minmax(16rem,1fr)_1.4fr]">
          <div>
            <p className="mono-heading text-xs uppercase tracking-widest text-accent">
              try to break this
            </p>
            <h2 className="mt-4 text-2xl font-semibold leading-snug text-foreground">
              An input field, on a security engineer&apos;s site, daring you
              to inject something.
            </h2>
            <p className="mt-3 text-sm leading-6 text-muted">
              Go on. You were thinking it.
            </p>
          </div>
          <BreakMeBox />
        </div>
      </SessionBlock>

      {/* honesty */}
      <SessionBlock className="relative z-10 border-t border-border py-10">
        <p className="mono-heading text-xs uppercase tracking-widest text-accent">
          receipts
        </p>
        <div className="mt-6">
          <HonestyBadge />
        </div>
      </SessionBlock>

      {/* changelog of a person */}
      <SessionBlock className="relative z-10 border-t border-border py-10">
        <p className="mono-heading text-xs uppercase tracking-widest text-accent">
          changelog of a person
        </p>
        <div className="mt-6 space-y-0">
          {CHANGELOG.map((entry, i) => (
            <div
              key={entry.version}
              className={`grid gap-x-8 gap-y-1 py-4 sm:grid-cols-[8rem_1fr] ${
                i > 0 ? "border-t border-border/60" : ""
              }`}
            >
              <p className="mono-heading text-sm text-accent">{entry.version}</p>
              <div>
                <p className="text-sm font-medium leading-6 text-foreground">
                  {entry.title}
                </p>
                <p className="mt-1 text-sm leading-6 text-muted">{entry.note}</p>
              </div>
            </div>
          ))}
        </div>
      </SessionBlock>

      {/* index */}
      <SessionBlock className="relative z-10 border-t border-border py-4">
        <p className="mono-heading pt-6 text-xs uppercase tracking-widest text-accent">
          the full map
        </p>
        <div className="mt-2 divide-y divide-border">
          {index.map((row) => (
            <Link
              key={row.href}
              href={row.href}
              className="group grid grid-cols-[2.5rem_1fr_auto] items-baseline gap-x-4 py-6 sm:grid-cols-[3.5rem_minmax(11rem,max-content)_1fr_auto] sm:gap-x-8"
            >
              <span className="mono-heading text-xs text-faint transition group-hover:text-accent sm:text-sm">
                {row.number}
              </span>
              <span
                className="font-semibold leading-none text-foreground transition group-hover:text-accent"
                style={{ fontSize: "clamp(1.6rem, 4vw, 2.6rem)" }}
              >
                {row.title}
              </span>
              <span className="hidden text-sm text-muted sm:block">
                {row.note}
              </span>
              <span className="flex items-center gap-3">
                <span className="mono-heading hidden text-xs text-muted sm:inline">
                  {row.meta}
                </span>
                <ArrowUpRight
                  size={18}
                  className="text-faint transition duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-accent"
                />
              </span>
              <span className="col-span-2 col-start-2 mt-2 text-xs text-muted sm:hidden">
                {row.note} · {row.meta}
              </span>
            </Link>
          ))}
        </div>
      </SessionBlock>
    </AnimatedPage>
  );
}


type IndexRow = {
  href: string;
  number: string;
  title: string;
  note: string;
  meta: string;
};

const CHANGELOG = [
  {
    version: "v2026.07",
    title: "Taught a CVE scanner the difference between present and exploitable.",
    note: "It is still processing the betrayal. The findings queue has never been shorter.",
  },
  {
    version: "v2026.01",
    title: "Vice President, DJS ISACA.",
    note: "Turns out the title comes bundled with meetings. Working on a patch.",
  },
  {
    version: "v2025.06",
    title: "Cybersecurity internship, JioStar.",
    note: "Production: where elegant theories go to get humbled at scale.",
  },
  {
    version: "v2024.02",
    title: "The markets phase peaks.",
    note: "Order books, microstructure, backtests. The spreadsheets remain; the obsession rotated.",
  },
  {
    version: "v2023.09",
    title: "Optiverse paused at 150,000+ students.",
    note: "Still the largest number on this site, and the one I defend hardest.",
  },
] as const;

function CurrentItem({
  label,
  value,
  detail,
}: {
  label: string;
  value: string;
  detail: string;
}) {
  return (
    <div className="grid gap-1">
      <p className="mono-heading text-[11px] uppercase tracking-wider text-muted">
        {label}
      </p>
      <p className="mono-heading text-sm font-semibold text-foreground">
        {value}
      </p>
      <p className="text-xs leading-5 text-muted">{detail}</p>
    </div>
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

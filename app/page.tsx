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
      note: "code that made it out",
      meta: countLabel(projectState.projects.length, "repo"),
    },
    {
      href: "/blog",
      number: "02",
      title: "Blog",
      note: "things broken, then explained",
      meta: countLabel(writeups.length, "writeup"),
    },
    {
      href: "/resources",
      number: "03",
      title: "Resources",
      note: "links worth going back to",
      meta: countLabel(resources.length, "link"),
    },
    {
      href: "/optiverse",
      number: "04",
      title: "Optiverse",
      note: "the student non-profit, co-founded",
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
    <AnimatedPage className="wide-shell relative overflow-hidden pb-28">
      <CursorGlow />
      <HomeMischief />
      <NoCookieBanner />

      {/* manifesto hero */}
      <section className="relative z-10 pb-20 pt-4">
        <div className="dot-grid pointer-events-none absolute -inset-x-8 -top-8 bottom-0" aria-hidden="true" />
        <p className="mono-heading relative text-sm text-muted">
          deval kotak <span className="text-accent">/</span> mumbai{" "}
          <span className="text-accent">/</span> security engineering
        </p>

        <div className="relative mt-12 space-y-2">
          <h1 className="text-balance font-semibold leading-[1.05] text-foreground" style={{ fontSize: "clamp(2.4rem, 7vw, 5.5rem)" }}>
            I break systems{" "}
            <span className="text-muted">to understand them.</span>
          </h1>
          <p className="text-balance font-semibold leading-[1.05] text-foreground" style={{ fontSize: "clamp(2.4rem, 7vw, 5.5rem)" }}>
            And build{" "}
            <span className="text-accent">stronger ones.</span>
          </p>
        </div>

        <p className="relative mt-9 max-w-xl text-base leading-8 text-body">
          Most of the work is Python tooling that sorts real vulnerabilities
          out from the noise. Before that came a trading phase, and in the
          middle of it a mentorship org that reached 150,000 students. All of
          it ends up here eventually.
        </p>

        <div className="relative mt-10 flex flex-wrap items-center gap-3">
          <span className="inline-flex h-10 items-center gap-2.5 border border-ok/40 bg-ok/5 px-4 text-sm text-body">
            <span className="relative flex size-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-ok opacity-60" />
              <span className="relative inline-flex size-2 rounded-full bg-ok" />
            </span>
            open to security engineering roles
          </span>
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

      {/* statement */}
      <SessionBlock className="relative z-10 border-t border-border py-14">
        <div>
          <SectionLabel>whoami</SectionLabel>
          <p
            className="mt-6 max-w-4xl text-balance leading-[1.6] text-body"
            style={{ fontSize: "clamp(1rem, 1.5vw, 1.2rem)" }}
          >
            Computer engineering student, currently{" "}
            <span className="text-foreground">securing production systems</span>{" "}
            at JioStar.{" "}
            <span className="text-foreground">
              Most of what I know came from pulling something apart to find out
              why it behaved strangely
            </span>
            , and{" "}
            <span className="text-accent">
              most of what I build came from not wanting to do that by hand the
              next fifty times
            </span>
            . Five years of student organizations before that, including a
            mentorship non-profit across{" "}
            <span className="text-foreground">19 countries</span> — good
            training for explaining technical risk to people who never asked
            for it.
          </p>
        </div>
      </SessionBlock>

      {/* the record */}
      <Chapter
        label="the record"
        intro="The two worth reading first. ISACA, Trinity and Buildspace are on the resume."
      >
        <div className="grid gap-4 sm:grid-cols-2">
          {RECORD.map((entry) => (
            <RecordCard key={entry.org} {...entry} />
          ))}
        </div>

        <div className="mt-10 flex flex-wrap items-center gap-3 border-t border-border/60 pt-8">
          <p className="mono-heading mr-auto text-xs leading-6 text-muted">
            been at this since before it paid anything
          </p>
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
      </Chapter>

      {/* proof */}
      <Chapter
        label="see for yourself"
        intro="All of this runs in your browser on real data. None of it gets sent anywhere, because there is nowhere to send it."
      >
        <div className="border border-border">
          <div className="grid lg:grid-cols-2">
            <Demo
              title="You’ve been here a while. Want a vulnerability report on yourself?"
              caption="Reads the browser you are using right now."
            >
              <VisitorAudit />
            </Demo>
            <Demo
              title="An input field, on a security engineer’s site, daring you to inject something."
              caption="Go on, you were thinking it."
              divided
            >
              <BreakMeBox />
            </Demo>
          </div>
        </div>
      </Chapter>

      {/* the full map */}
      <Chapter label="the full map" spacious>
        <div className="divide-y divide-border border-y border-border">
          {index.map((row) => (
            <Link
              key={row.href}
              href={row.href}
              className="group grid grid-cols-[2.5rem_1fr_auto] items-baseline gap-x-4 px-2 py-7 transition-all duration-300 hover:bg-surface hover:pl-5 sm:grid-cols-[3.5rem_minmax(11rem,max-content)_1fr_auto] sm:gap-x-8"
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
              <span className="col-span-2 col-start-2 mt-2 grid text-xs text-muted sm:hidden">
                <span>{row.note}</span>
                <span className="mono-heading mt-0.5 text-faint">{row.meta}</span>
              </span>
            </Link>
          ))}
        </div>
      </Chapter>
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

type RecordEntry = {
  org: string;
  role: string;
  dates: string;
  live?: boolean;
  bullets: string[];
  metric: string;
  metricLabel: string;
};

const RECORD: RecordEntry[] = [
  {
    org: "JioStar",
    role: "Cybersecurity Intern",
    dates: "Feb 2026 – now",
    live: true,
    bullets: [
      "Turned manual security work into standing systems: regression testing wired into Jira and GitHub, SIEM triage that filters false positives, and an end-to-end automated User Access Review (UAR) process.",
      "Surfaced attack surface the team wasn't tracking, mapping production APIs and running VAPT on internal tools.",
      "Shipped the tooling around it too: Slackbots, Chrome extensions, and Telegram crawlers watching for piracy leaks.",
    ],
    metric: "production",
    metricLabel: "not a lab environment",
  },
  {
    org: "Optiverse",
    role: "Co-Founder",
    dates: "Mar 2021 – now",
    live: true,
    bullets: [
      "Ran a 250+ member student non-profit spanning 19 countries.",
      "Directed 90+ workshops and two internship programs at an 8% acceptance rate.",
      "Partnered with NGOs and earned recognition from Lady Gaga's Born This Way Foundation.",
    ],
    metric: "150,000+",
    metricLabel: "students reached",
  },
];

function Demo({
  title,
  caption,
  divided,
  children,
}: {
  title: string;
  caption: string;
  divided?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div
      className={`flex flex-col p-5 sm:p-6 ${
        divided ? "border-t border-border lg:border-l lg:border-t-0" : ""
      }`}
    >
      <h3 className="max-w-md text-lg font-semibold leading-snug text-foreground">
        {title}
      </h3>
      <p className="mt-2 text-sm leading-6 text-muted">{caption}</p>
      <div className="mt-6">{children}</div>
    </div>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="flex items-center gap-3">
      <span className="h-px w-8 shrink-0 bg-accent/60" aria-hidden="true" />
      <span className="mono-heading text-xs uppercase tracking-widest text-accent">
        {children}
      </span>
    </h2>
  );
}

function Chapter({
  label,
  intro,
  spacious,
  children,
}: {
  label: string;
  intro?: string;
  spacious?: boolean;
  children: React.ReactNode;
}) {
  return (
    <SessionBlock
      className={`relative z-10 border-t border-border ${spacious ? "py-16" : "py-12"}`}
    >
      <SectionLabel>{label}</SectionLabel>
      {intro && (
        <p className="mt-4 max-w-2xl text-sm leading-6 text-muted">{intro}</p>
      )}
      <div className="mt-8">{children}</div>
    </SessionBlock>
  );
}

function RecordCard({
  org,
  role,
  dates,
  live,
  bullets,
  metric,
  metricLabel,
}: RecordEntry) {
  return (
    <article className="panel-3d flex flex-col border border-border p-5 sm:p-6">
      <div className="flex items-baseline justify-between gap-3">
        <h3 className="text-lg font-semibold leading-tight text-foreground">
          {org}
        </h3>
        <p className="mono-heading flex shrink-0 items-center gap-1.5 text-[11px] text-faint">
          {live && (
            <span className="inline-flex size-1.5 rounded-full bg-ok" aria-hidden="true" />
          )}
          {dates}
        </p>
      </div>
      <p className="mono-heading mt-1.5 text-[11px] uppercase tracking-wider text-accent">
        {role}
      </p>

      <ul className="mt-5 space-y-2.5">
        {bullets.map((bullet) => (
          <li
            key={bullet}
            className="grid grid-cols-[0.5rem_1fr] gap-3 text-sm leading-6 text-muted"
          >
            <span className="mt-2.5 size-1 rounded-full bg-faint" aria-hidden="true" />
            <span>{bullet}</span>
          </li>
        ))}
      </ul>

      <div className="mt-auto border-t border-border/60 pt-5">
        <p
          className="mono-heading font-semibold leading-none text-foreground"
          style={{ fontSize: "clamp(1.15rem, 2.2vw, 1.5rem)" }}
        >
          {metric}
        </p>
        <p className="mono-heading mt-1.5 text-[11px] uppercase tracking-wider text-muted">
          {metricLabel}
        </p>
      </div>
    </article>
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

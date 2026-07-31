import Link from "next/link";
import {
  ArrowUpRight,
  BriefcaseBusiness,
  GitBranch,
  Mail,
} from "lucide-react";
import AnimatedPage from "@/components/AnimatedPage";
import CursorGlow from "@/components/CursorGlow";
import SessionBlock from "@/components/SessionBlock";
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

      {/* index */}
      <SessionBlock className="relative z-10 border-t border-border py-4">
        <div className="divide-y divide-border">
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

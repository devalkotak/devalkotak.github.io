import Link from "next/link";
import {
  ArrowDown,
  ArrowUpRight,
  BriefcaseBusiness,
  Download,
  GitBranch,
  Mail,
} from "lucide-react";
import AnimatedPage from "@/components/AnimatedPage";
import BreakMeBox from "@/components/BreakMeBox";
import CaseStudies from "@/components/CaseStudies";
import CopyEmail from "@/components/CopyEmail";
import Hobbies from "@/components/Hobbies";
import JourneyToggles from "@/components/JourneyToggles";
import MethodFlow from "@/components/MethodFlow";
import NoCookieBanner from "@/components/NoCookieBanner";
import SessionBlock from "@/components/SessionBlock";
import ToolMarquee from "@/components/ToolMarquee";
import VisitorAudit from "@/components/VisitorAudit";
import { getPortfolioProjectState } from "@/lib/github";
import {
  ASK_ME_ABOUT,
  CASE_STUDIES,
  CONCEPTS,
  HOBBIES,
  JOURNEY,
  METHOD_STEPS,
  TOOLS,
} from "@/lib/home-content";
import { getPublishedWriteups } from "@/lib/notion";
import { getResources } from "@/lib/resources";
import { FEATURES } from "@/lib/features";

const EMAIL = "devalktk@gmail.com";

export default async function Home() {
  const [projectState, writeups] = await Promise.all([
    getPortfolioProjectState(),
    getPublishedWriteups(),
  ]);
  const resources = getResources();

  const index: IndexRow[] = [
    {
      href: "/projects",
      title: "Projects",
      note: "code that made it out",
      meta: countLabel(projectState.projects.length, "repo"),
    },
    {
      href: "/blog",
      title: "Blog",
      note: "things broken, then explained",
      meta: countLabel(writeups.length, "writeup"),
    },
    {
      href: "/resources",
      title: "Resources",
      note: "links worth going back to",
      // An empty count reads as a broken page, so say what is true instead.
      meta: resources.length > 0 ? countLabel(resources.length, "link") : "being curated",
    },
    {
      href: "/optiverse",
      title: "Optiverse",
      note: "the student non-profit, co-founded",
      meta: "its own page",
    },
    {
      href: "/resume",
      title: "Resume",
      note: "the formal version",
      meta: "PDF",
    },
    {
      href: "/security",
      title: "Security",
      note: "this site’s own threat model",
      meta: "yes, really",
    },
  ].filter((row) => FEATURES.resources || row.href !== "/resources");

  return (
    <AnimatedPage className="relative pb-28">
      <NoCookieBanner />

      <div className="wide-shell">
        {/* manifesto hero, fills the first viewport on its own */}
        <section
          id="top"
          className="relative z-10 flex min-h-[calc(100svh-12rem)] flex-col pb-10 pt-4"
        >
          <p className="mono-heading relative text-sm text-muted">
            portfolio <span className="text-accent">/</span> 2026{" "}
            <span className="text-accent">/</span> mumbai{" "}
            <span className="text-accent">/</span> security engineering
          </p>

          <div className="relative my-auto py-12">
            <div className="space-y-2">
              <h1
                className="display-heading text-balance font-medium leading-[1.02] text-foreground"
                style={{ fontSize: "clamp(2.6rem, 8.5vw, 7rem)" }}
              >
                I break systems{" "}
                <span className="text-muted">to understand them.</span>
              </h1>
              <p
                className="display-heading text-balance font-medium leading-[1.02] text-foreground"
                style={{ fontSize: "clamp(2.6rem, 8.5vw, 7rem)" }}
              >
                And build{" "}
                <span className="serif-accent text-accent">stronger ones.</span>
              </p>
            </div>

            <p className="mt-10 max-w-xl text-base leading-8 text-body">
              I build Python tooling that sorts real vulnerabilities out from
              the noise, and I like proving it moved something. Every number
              below has a source.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <a
                href="#work"
                className="inline-flex h-11 items-center gap-2 border border-accent/60 bg-[var(--color-accent-muted)] px-5 text-sm font-medium text-accent transition hover:border-accent"
              >
                See the work
                <ArrowDown size={15} />
              </a>
              <a
                href="#contact"
                className="inline-flex h-11 items-center gap-2 border border-border px-5 text-sm text-body transition hover:border-accent/60 hover:text-accent"
              >
                Let&rsquo;s talk
                <ArrowUpRight size={15} />
              </a>
            </div>
          </div>

          <div className="relative grid gap-4 border-t border-border pt-5 sm:grid-cols-[auto_1fr] sm:items-center sm:gap-8">
            <StatusChip label="status" value="open to security roles" live />
            <div className="flex flex-wrap items-center gap-3 sm:justify-end">
              <SocialLink href="https://github.com/devalkotak" label="GitHub">
                <GitBranch size={15} />
              </SocialLink>
              <SocialLink href="https://linkedin.com/in/devalkotak" label="LinkedIn">
                <BriefcaseBusiness size={15} />
              </SocialLink>
            </div>
          </div>
        </section>
      </div>

      <div className="relative z-10 my-6">
        <ToolMarquee items={TOOLS} />
      </div>

      <div className="wide-shell">
        {/* 01 about */}
        <Chapter id="about" number="01" label="whoami">
          <p
            className="max-w-3xl text-balance leading-[1.6] text-body"
            style={{ fontSize: "clamp(1rem, 1.5vw, 1.2rem)" }}
          >
            Computer science graduate.{" "}
            <span className="text-foreground">
              Most of what I know came from pulling something apart to find out
              why it behaved strangely
            </span>
            , and{" "}
            <span className="text-accent">
              most of what I build came from not wanting to do that by hand the
              next fifty times
            </span>
            . Years of running student organizations taught me the other half:
            explaining technical risk to people who never asked for it.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-2">
            <span className="mono-heading mr-2 text-[11px] uppercase tracking-widest text-muted">
              ask me about
            </span>
            {ASK_ME_ABOUT.map((topic) =>
              topic.href ? (
                <a
                  key={topic.label}
                  href={topic.href}
                  className="border border-border px-3 py-1 text-sm text-body transition hover:border-accent/60 hover:text-accent"
                >
                  {topic.label}
                </a>
              ) : (
                <span key={topic.label} className="border border-border px-3 py-1 text-sm text-body">
                  {topic.label}
                </span>
              ),
            )}
          </div>
        </Chapter>

        {/* 02 work */}
        <Chapter
          id="work"
          number="02"
          label="work"
          title="Problems I solved."
          intro="Four from the internship, three you can clone. Every number comes from my resume or a public repo, and employer details stay high level on purpose. Open a card for the story."
        >
          <CaseStudies studies={CASE_STUDIES} />
        </Chapter>

        {/* 03 journey */}
        <Chapter
          id="journey"
          number="03"
          label="journey"
          title="How I got here."
          intro="Newest first. Open a stop to see what I worked on, learned and left behind."
        >
          <JourneyToggles stops={JOURNEY} />
        </Chapter>

        {/* 04 method */}
        <Chapter
          id="method"
          number="04"
          label="method"
          title="How I think it through."
          intro="Not a skills list. The six steps I run on a problem, and the ideas I lean on at each one. Pick a step or a topic."
        >
          <MethodFlow steps={METHOD_STEPS} concepts={CONCEPTS} />
        </Chapter>

        {/* 06 proof */}
        <Chapter
          id="proof"
          number="05"
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

        {/* 06 off duty */}
        <Chapter
          id="off-duty"
          number="06"
          label="off duty"
          title="Beyond the terminal."
          intro="What fills the hours the resume does not cover."
        >
          <Hobbies hobbies={HOBBIES} />
        </Chapter>

        {/* 07 full map */}
        <Chapter id="map" number="07" label="the full map">
          <div className="divide-y divide-border border-y border-border">
            {index.map((row, position) => (
              <Link
                key={row.href}
                href={row.href}
                className="group grid grid-cols-[2.5rem_1fr_auto] items-baseline gap-x-4 px-2 py-7 transition-all duration-300 hover:bg-surface hover:pl-5 sm:grid-cols-[3.5rem_minmax(11rem,max-content)_1fr_auto] sm:gap-x-8"
              >
                <span className="mono-heading text-xs text-faint transition group-hover:text-accent sm:text-sm">
                  {String(position + 1).padStart(2, "0")}
                </span>
                <span
                  className="display-heading font-medium leading-none text-foreground transition group-hover:text-accent"
                  style={{ fontSize: "clamp(1.6rem, 4vw, 2.6rem)" }}
                >
                  {row.title}
                </span>
                <span className="hidden text-sm text-muted sm:block">{row.note}</span>
                <span className="flex items-center gap-3">
                  <span className="mono-heading hidden text-xs text-muted sm:inline">
                    {row.meta}
                  </span>
                  <ArrowUpRight
                    size={18}
                    className="text-faint transition duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accent"
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

        {/* 09 contact */}
        <SessionBlock
          id="contact"
          className="relative z-10 scroll-mt-24 border-t border-border py-20"
        >
          <p className="mono-heading text-xs uppercase tracking-widest text-muted">
            <span className="text-accent">08</span> / contact
          </p>
          <h2
            className="display-heading mt-6 text-balance font-medium leading-[1.02] text-foreground"
            style={{ fontSize: "clamp(2.4rem, 7vw, 5.5rem)" }}
          >
            Let&rsquo;s break something.
            <br />
            <span className="serif-accent text-accent">Then fix it.</span>
          </h2>
          <p className="mt-6 max-w-xl text-base leading-7 text-body">
            Hiring for security, need a second pair of eyes on a design, or want
            to argue about whether a CVE is reachable? Email is the fastest way
            to reach me.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <CopyEmail email={EMAIL} />
            <SocialLink href={`mailto:${EMAIL}`} label="Email me">
              <Mail size={15} />
            </SocialLink>
            <SocialLink href="https://linkedin.com/in/devalkotak" label="LinkedIn">
              <BriefcaseBusiness size={15} />
            </SocialLink>
            <SocialLink href="https://github.com/devalkotak" label="GitHub">
              <GitBranch size={15} />
            </SocialLink>
            <SocialLink href="/resume.pdf" label="Resume" download>
              <Download size={15} />
            </SocialLink>
          </div>
        </SessionBlock>
      </div>
    </AnimatedPage>
  );
}

type IndexRow = {
  href: string;
  title: string;
  note: string;
  meta: string;
};

function StatusChip({
  label,
  value,
  live,
}: {
  label: string;
  value: string;
  live?: boolean;
}) {
  return (
    <span className="mono-heading inline-flex items-center gap-3 text-xs uppercase tracking-widest">
      <span className="text-faint">{label}</span>
      <span className="inline-flex items-center gap-2 text-body">
        {live && (
          <span className="relative inline-flex size-1.5">
            <span className="absolute inline-flex size-full animate-ping rounded-full bg-ok opacity-60" />
            <span className="relative inline-flex size-1.5 rounded-full bg-ok" />
          </span>
        )}
        {value}
      </span>
    </span>
  );
}

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
      <h3 className="max-w-md text-lg font-semibold leading-snug text-foreground">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-muted">{caption}</p>
      <div className="mt-6">{children}</div>
    </div>
  );
}

function Chapter({
  id,
  number,
  label,
  title,
  intro,
  children,
}: {
  id: string;
  number: string;
  label: string;
  title?: string;
  intro?: string;
  children: React.ReactNode;
}) {
  return (
    <SessionBlock id={id} className="relative z-10 scroll-mt-20 border-t border-border py-16">
      <div className="grid gap-x-12 gap-y-6 lg:grid-cols-[11rem_1fr]">
        <h2 className="self-start lg:sticky lg:top-24">
          <span className="mono-heading text-xs uppercase tracking-widest text-muted">
            <span className="text-accent">{number}</span> / {label}
          </span>
        </h2>
        <div className="min-w-0">
          {title && (
            <p
              className="display-heading font-medium leading-tight text-foreground"
              style={{ fontSize: "clamp(1.8rem, 4vw, 2.8rem)" }}
            >
              {title}
            </p>
          )}
          {intro && (
            <p className={`max-w-2xl text-sm leading-6 text-muted ${title ? "mt-3" : ""}`}>
              {intro}
            </p>
          )}
          <div className={title || intro ? "mt-8" : ""}>{children}</div>
        </div>
      </div>
    </SessionBlock>
  );
}

function SocialLink({
  href,
  label,
  download,
  children,
}: {
  href: string;
  label: string;
  download?: boolean;
  children: React.ReactNode;
}) {
  const external = href.startsWith("http");
  return (
    <a
      className="inline-flex h-11 items-center gap-2.5 border border-border bg-surface px-5 text-sm text-body transition hover:border-accent/60 hover:bg-surfaceHover hover:text-accent"
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
      download={download || undefined}
    >
      {children}
      {label}
    </a>
  );
}

function countLabel(count: number, noun: string) {
  return `${count} ${noun}${count === 1 ? "" : "s"}`;
}

import Link from "next/link";
import { ArrowUpRight, BriefcaseBusiness, Download, GitBranch, Mail } from "lucide-react";
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

const EMAIL = "devalktk@gmail.com";

export default async function Home() {
  const [projectState, writeups] = await Promise.all([
    getPortfolioProjectState(),
    getPublishedWriteups(),
  ]);

  return (
    <AnimatedPage className="relative pb-20">
      <NoCookieBanner />

      <div className="wide-shell">
        {/* hero: the statement on the left, who is making it in the glass panel */}
        <section id="top" className="grid items-stretch gap-8 pb-16 pt-4 lg:grid-cols-[1.25fr_0.75fr] lg:gap-10">
          <div className="flex flex-col justify-center">
            <p className="inline-flex items-center gap-2.5 self-start rounded-full border border-border px-4 py-1.5 text-sm text-body">
              <span className="relative inline-flex size-2">
                <span className="absolute inset-0 animate-ping rounded-full bg-signal opacity-60" />
                <span className="relative size-2 rounded-full bg-signal" />
              </span>
              Open to security engineering roles
            </p>

            <h1
              className="display-heading mt-8 text-balance text-foreground"
              style={{ fontSize: "clamp(2.7rem, 6.6vw, 5.4rem)", lineHeight: 1, letterSpacing: "-0.03em", wordSpacing: "0.06em" }}
            >
              I break systems to understand them.
              <span className="block text-muted">And build stronger ones.</span>
            </h1>

            <p className="mt-7 max-w-xl text-lg leading-8 text-body">
              I build Python tooling that sorts real vulnerabilities out from
              the noise, and I like proving it moved something. Every number
              below has a source.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href="#work"
                className="inline-flex h-12 items-center rounded-full bg-accent px-7 text-base font-semibold text-background transition hover:brightness-110"
              >
                See the work
              </a>
              <a
                href="#contact"
                className="inline-flex h-12 items-center rounded-full border border-border px-7 text-base font-medium text-foreground transition hover:border-accent hover:text-accent"
              >
                Let&rsquo;s talk
              </a>
            </div>
          </div>

          <aside id="about" className="glass flex scroll-mt-24 flex-col justify-between gap-8 p-7 sm:p-8">
            <p className="text-[1.05rem] font-medium leading-7 text-body">
              Computer science graduate. Most of what I know came from pulling
              something apart to find out why it behaved strangely, and most of
              what I build came from not wanting to do that by hand the next
              fifty times. Years of running student organizations taught me the
              other half: explaining technical risk to people who never asked
              for it.
            </p>
            <div>
              <p className="text-sm font-semibold text-foreground">Ask me about</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {ASK_ME_ABOUT.map((topic) =>
                  topic.href ? (
                    <a
                      key={topic.label}
                      href={topic.href}
                      className="rounded-full border border-accent/40 px-3 py-1 text-sm font-medium text-foreground transition hover:border-accent hover:text-accent"
                    >
                      {topic.label}
                    </a>
                  ) : (
                    <span
                      key={topic.label}
                      className="rounded-full border border-accent/40 px-3 py-1 text-sm font-medium text-foreground"
                    >
                      {topic.label}
                    </span>
                  ),
                )}
              </div>
            </div>
          </aside>
        </section>
      </div>

      <div className="relative z-10">
        <ToolMarquee items={TOOLS} />
      </div>

      <div className="wide-shell">
        <Chapter
          id="work"
          title="Problems I solved"
          intro="Four from JioStar, three you can clone. Every number comes from my resume or a public repo, and employer details stay high level on purpose. Open any row for the story."
        >
          <CaseStudies studies={CASE_STUDIES} />
          <p className="mt-6 flex flex-wrap gap-x-8 gap-y-2 text-base text-muted">
            <MoreLink href="/projects">All {projectState.projects.length} public repos</MoreLink>
            <MoreLink href="/blog">{writeups.length} lab writeups and notes</MoreLink>
          </p>
        </Chapter>

        <Chapter
          id="journey"
          title="How I got here"
          intro="Newest first. Open a stop to see what I worked on, learned and left behind."
        >
          <JourneyToggles stops={JOURNEY} />
        </Chapter>

        <Chapter
          id="method"
          title="How I think it through"
          intro="The six steps I run on a problem, and the ideas I lean on at each one. Pick a step or a topic."
        >
          <MethodFlow steps={METHOD_STEPS} concepts={CONCEPTS} />
        </Chapter>

        <Chapter
          id="proof"
          title="See for yourself"
          intro="All of this runs in your browser on real data. None of it gets sent anywhere, because there is nowhere to send it."
        >
          <div className="overflow-hidden border border-border">
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

        <Chapter id="off-duty" title="Beyond the terminal" intro="What fills the hours the resume does not cover.">
          <Hobbies hobbies={HOBBIES} />
        </Chapter>

        {/* contact: the page closes in the same glass it opened with */}
        <SessionBlock id="contact" className="glass mt-24 scroll-mt-24 px-7 py-14 sm:px-12 sm:py-20">
          <h2
            className="display-heading text-balance text-foreground"
            style={{ fontSize: "clamp(2.3rem, 6vw, 4.6rem)", lineHeight: 1.02, letterSpacing: "-0.03em", wordSpacing: "0.06em" }}
          >
            Let&rsquo;s break something.
            <span className="block text-muted">Then fix it.</span>
          </h2>
          <p className="mt-6 max-w-xl text-lg leading-8 text-body">
            Hiring for security, need a second pair of eyes on a design, or want
            to argue about whether a CVE is reachable? Email is the fastest way
            to reach me.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <CopyEmail email={EMAIL} />
            <SocialLink href={`mailto:${EMAIL}`} label="Email me">
              <Mail size={16} />
            </SocialLink>
            <SocialLink href="https://linkedin.com/in/devalkotak" label="LinkedIn">
              <BriefcaseBusiness size={16} />
            </SocialLink>
            <SocialLink href="https://github.com/devalkotak" label="GitHub">
              <GitBranch size={16} />
            </SocialLink>
            <SocialLink href="/resume.pdf" label="Resume" download>
              <Download size={16} />
            </SocialLink>
          </div>
        </SessionBlock>
      </div>
    </AnimatedPage>
  );
}

function Chapter({
  id,
  title,
  intro,
  children,
}: {
  id: string;
  title: string;
  intro: string;
  children: React.ReactNode;
}) {
  return (
    <SessionBlock id={id} className="relative z-10 scroll-mt-20 pt-24">
      <h2
        className="display-heading text-foreground"
        style={{ fontSize: "clamp(1.9rem, 4.2vw, 2.9rem)", lineHeight: 1.05 }}
      >
        {title}
      </h2>
      <p className="mt-3 max-w-2xl text-base leading-7 text-muted">{intro}</p>
      <div className="mt-9">{children}</div>
    </SessionBlock>
  );
}

function MoreLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link href={href} className="inline-flex items-center gap-1.5 font-medium text-accent transition hover:text-foreground">
      {children}
      <ArrowUpRight size={16} />
    </Link>
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
      className={`flex flex-col p-5 sm:p-7 ${
        divided ? "border-t border-border lg:border-l lg:border-t-0" : ""
      }`}
    >
      <h3 className="display-heading max-w-md text-lg leading-snug text-foreground">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-muted">{caption}</p>
      <div className="mt-6">{children}</div>
    </div>
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
      className="inline-flex h-12 items-center gap-2.5 rounded-full border border-border px-6 text-base font-medium text-foreground transition hover:border-accent hover:text-accent"
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

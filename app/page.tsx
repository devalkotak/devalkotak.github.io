import Link from "next/link";
import { ArrowUpRight, Mail } from "lucide-react";
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

const BANNER = [
  "█▀▄ █▀▀ █ █ ▄▀█ █     █▄▀ █▀█ ▀█▀ ▄▀█ █▄▀",
  "█▄▀ █▄▄ ▀▄▀ █▀█ █▄▄   █ █ █▄█  █  █▀█ █ █",
].join("\n");

export default async function Home() {
  const [projectState, writeups] = await Promise.all([
    getPortfolioProjectState(),
    getPublishedWriteups(),
  ]);
  const resources = getResources();
  const buildDate = new Intl.DateTimeFormat("en", {
    weekday: "short",
    month: "short",
    day: "2-digit",
    year: "numeric",
  }).format(new Date());

  const home: LsRow[] = [
    {
      perms: "drwxr-xr-x",
      name: "projects/",
      href: "/projects",
      meta: countLabel(projectState.projects.length, "repo"),
      comment: "shipped code — tagged portfolio or it didn't happen",
    },
    {
      perms: "drwxr-xr-x",
      name: "blog/",
      href: "/blog",
      meta: countLabel(writeups.length, "writeup"),
      comment: "things I broke, fixed, or finally understood",
    },
    {
      perms: "drwxr-xr-x",
      name: "resources/",
      href: "/resources",
      meta: countLabel(resources.length, "link"),
      comment: "bookmarks that survived the purge",
    },
    {
      perms: "drwxrwx---",
      name: "optiverse/",
      href: "/optiverse",
      meta: "150k+ students",
      comment: "the thread that touches grass — mentorship org, paused not dead",
      tone: "warn",
    },
    {
      perms: "-r--r--r--",
      name: "resume.pdf",
      href: "/resume",
      meta: "1 page",
      comment: "all of this, but in a font HR trusts",
    },
    {
      perms: "drwxr-xr-x",
      name: "security/",
      href: "/security",
      meta: "1 threat model",
      comment: "how this very page defends itself",
    },
    {
      perms: "-rw-------",
      name: ".env",
      meta: "0 B",
      comment: "nice try.",
      tone: "danger",
    },
  ];

  const processes: PsRow[] = [
    {
      pid: "7",
      stat: "R",
      command: "reachability-cve-triage",
      comment: "proving which vulnerable dependencies actually matter",
    },
    {
      pid: "23",
      stat: "S+",
      command: "portswigger-academy",
      comment: "one lab at a time, in order",
    },
    {
      pid: "42",
      stat: "S",
      command: "market-microstructure",
      comment: "the math under the ticker",
    },
    {
      pid: "80",
      stat: "LISTEN",
      command: "open-to: security-engineering-roles",
      comment: "the port is open — say hi",
      tone: "warn",
    },
  ];

  return (
    <AnimatedPage className="wide-shell relative overflow-hidden">
      <CursorGlow />

      {/* motd */}
      <section className="relative z-10 pb-10">
        <Prompt command="cat /etc/motd" />
        <h1 className="sr-only">Deval Kotak — security, markets, people</h1>
        <pre
          aria-hidden="true"
          className="mono-heading mt-6 overflow-x-auto text-foreground"
          style={{ fontSize: "clamp(0.55rem, 2.1vw, 1.05rem)", lineHeight: 1.25 }}
        >
          {BANNER}
        </pre>
        <p className="mono-heading mt-5 text-sm text-body sm:text-base">
          security · markets · people —{" "}
          <span className="text-muted">one login, three daemons</span>
        </p>
        <p className="mono-heading mt-2 text-xs text-muted">
          Last login: {buildDate} from in.mumbai
        </p>
      </section>

      {/* whoami */}
      <SessionBlock className="relative z-10 border-t border-border py-10">
        <Prompt command="whoami" />
        <div className="mt-4 max-w-3xl">
          <TypedIdentity lines={WHOAMI_LINES} />
        </div>
      </SessionBlock>

      {/* ls -la — the front door */}
      <SessionBlock className="relative z-10 border-t border-border py-10">
        <Prompt command="ls -la ~/" />
        <div className="mono-heading mt-4 max-w-4xl text-sm">
          <p className="text-muted">total {home.length - 1}</p>
          <ul className="mt-1 divide-y divide-border/60">
            {home.map((row) => (
              <li key={row.name}>
                {row.href ? (
                  <Link href={row.href} className="group block py-3">
                    <LsLine row={row} />
                  </Link>
                ) : (
                  <div className="py-3">
                    <LsLine row={row} />
                  </div>
                )}
              </li>
            ))}
          </ul>
        </div>
      </SessionBlock>

      {/* now */}
      <SessionBlock className="relative z-10 border-t border-border py-10">
        <Prompt command="ps aux | grep deval" />
        <div className="mono-heading mt-4 max-w-4xl overflow-x-auto text-sm">
          <div className="grid grid-cols-[3rem_1fr] gap-x-6 gap-y-0 sm:grid-cols-[3rem_5rem_16rem_1fr]">
            <span className="py-1 text-[11px] uppercase tracking-wider text-muted">
              pid
            </span>
            <span className="hidden py-1 text-[11px] uppercase tracking-wider text-muted sm:block">
              stat
            </span>
            <span className="hidden py-1 text-[11px] uppercase tracking-wider text-muted sm:block">
              command
            </span>
            <span className="py-1 text-[11px] uppercase tracking-wider text-muted">
              <span className="sm:hidden">command</span>
            </span>
            {processes.map((proc) => (
              <ProcessRow key={proc.pid} proc={proc} />
            ))}
          </div>
        </div>
      </SessionBlock>

      {/* work */}
      <SessionBlock id="work" className="relative z-10 scroll-mt-24 border-t border-border py-10">
        <Prompt command="cat work/README.md" />
        <div className="mt-6 grid gap-4 lg:grid-cols-3">
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
                          <ArrowUpRight
                            size={13}
                            className="shrink-0 text-muted group-hover:text-accent"
                          />
                        </span>
                        <span className="mt-1 block text-xs leading-5 text-muted">
                          {project.description}
                        </span>
                      </a>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="mono-heading mt-5 border-t border-border pt-4 text-xs text-muted">
                  0 repos tagged portfolio. (tag something, deval.)
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
              <p className="mono-heading mt-5 border-t border-border pt-4 text-xs leading-5 text-muted">
                First entries in the works. The reading list is already long.
              </p>
            </TrackCard>
          </Tilt3D>

          <Tilt3D>
            <TrackCard
              track="people/"
              title="Showing up offline"
              body="Community and social work — the projects that help someone other than a computer. Teaching, volunteering, and organizing."
            >
              <p className="mono-heading mt-5 border-t border-border pt-4 text-xs leading-5 text-muted">
                Exhibit A:{" "}
                <Link href="/optiverse" className="text-warn hover:underline">
                  optiverse/
                </Link>{" "}
                — 150,000+ students reached.
              </p>
            </TrackCard>
          </Tilt3D>
        </div>
      </SessionBlock>

      {/* about */}
      <SessionBlock id="life" className="relative z-10 scroll-mt-24 border-t border-border py-10">
        <Prompt command="cat about.txt" />
        <div className="mt-5 max-w-3xl space-y-4 text-base leading-8 text-body">
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
            that grew past 150,000 students while I was busy pretending to be
            a shell prompt.
          </p>
          <p>
            This site collects all of it. The terminal aesthetic stays. The
            content refuses to fit in one directory.
          </p>
        </div>
      </SessionBlock>

      {/* contact */}
      <SessionBlock id="contact" className="relative z-10 scroll-mt-24 border-t border-border py-10">
        <Prompt command="open mailto:devalktk@gmail.com" />
        <div className="mt-5 flex flex-wrap items-center gap-3">
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
            resume
            <ArrowUpRight size={14} />
          </Link>
        </div>
      </SessionBlock>

      {/* logout */}
      <SessionBlock className="relative z-10 border-t border-border py-10">
        <Prompt command="exit" />
        <p className="mono-heading mt-3 text-sm text-muted">
          logout
          <br />
          Connection to in.mumbai closed.
        </p>
      </SessionBlock>
    </AnimatedPage>
  );
}

type LsRow = {
  perms: string;
  name: string;
  href?: string;
  meta: string;
  comment: string;
  tone?: "warn" | "danger";
};

type PsRow = {
  pid: string;
  stat: string;
  command: string;
  comment: string;
  tone?: "warn";
};

function Prompt({ command }: { command: string }) {
  return (
    <p className="mono-heading text-sm sm:text-base">
      <span className="text-ok">deval@mumbai</span>
      <span className="text-muted">:</span>
      <span className="text-accent">~</span>
      <span className="text-muted"> $ </span>
      <span className="font-semibold text-foreground">{command}</span>
    </p>
  );
}

function LsLine({ row }: { row: LsRow }) {
  const nameColor =
    row.tone === "warn"
      ? "text-warn"
      : row.tone === "danger"
        ? "text-body"
        : row.href
          ? "text-accent"
          : "text-body";
  const commentColor = row.tone === "danger" ? "text-danger" : "text-muted";

  return (
    <span className="grid grid-cols-[minmax(7rem,max-content)_1fr] items-baseline gap-x-6 gap-y-1 sm:grid-cols-[7rem_9rem_8rem_1fr]">
      <span className="hidden text-faint sm:inline">{row.perms}</span>
      <span
        className={`${nameColor} ${row.href ? "transition group-hover:underline" : ""}`}
      >
        {row.name}
      </span>
      <span className="hidden text-muted sm:inline">{row.meta}</span>
      <span className={`${commentColor} col-span-2 text-xs leading-5 sm:col-span-1 sm:text-sm`}>
        {row.comment}
      </span>
    </span>
  );
}

function ProcessRow({ proc }: { proc: PsRow }) {
  const commandColor = proc.tone === "warn" ? "text-warn" : "text-foreground";
  return (
    <>
      <span className="py-1.5 text-muted">{proc.pid}</span>
      <span
        className={`hidden py-1.5 sm:block ${proc.tone === "warn" ? "text-warn" : "text-muted"}`}
      >
        {proc.stat}
      </span>
      <span className={`py-1.5 ${commandColor}`}>{proc.command}</span>
      <span className="hidden py-1.5 text-muted sm:block">{proc.comment}</span>
      <span className="col-span-2 pb-2 text-xs leading-5 text-muted sm:hidden">
        {proc.comment}
      </span>
    </>
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

function countLabel(count: number, noun: string) {
  return `${count} ${noun}${count === 1 ? "" : "s"}`;
}

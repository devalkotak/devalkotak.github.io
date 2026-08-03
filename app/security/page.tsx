import type { Metadata } from "next";
import { ShieldCheck } from "lucide-react";
import AnimatedPage from "@/components/AnimatedPage";

export const metadata: Metadata = {
  title: "Security posture",
  description:
    "How this site is built, what it collects, and what its actual attack surface is.",
};

export default function SecurityPage() {
  return (
    <AnimatedPage className="content-shell">
      <header className="border-b border-border pb-8">
        <p className="mono-heading flex items-center gap-2 text-sm text-accent">
          <ShieldCheck size={16} />
          security posture
        </p>
        <h1 className="mono-heading mt-4 text-3xl font-semibold text-foreground sm:text-4xl">
          How this site is secured
        </h1>
        <p className="mt-4 text-base leading-7 text-body">
          Reviewing other people&apos;s security and documenting none of my own
          would be a bad look. This is the threat model for the site you are
          reading, including the parts outside my control.
        </p>
      </header>

      <div className="mt-8 space-y-8">
        <PostureSection title="architecture">
          <p>
            This is a fully static site. Every page is generated at build time
            with Next.js static export and served as plain files from GitHub
            Pages. There is no server runtime, no database, no API endpoints,
            no authentication, and no session state. Most classes of web
            vulnerability need something that executes per request. Nothing
            here does.
          </p>
        </PostureSection>

        <PostureSection title="what this site collects">
          <p>
            Nothing. No analytics, no trackers, no cookies, no third-party
            scripts. Fonts are self-hosted through next/font, so font requests
            never leave this domain. If you visit this site, nobody finds out.
          </p>
        </PostureSection>

        <PostureSection title="content pipeline">
          <p>
            Projects and writeups are fetched at build time from the GitHub API
            and Notion, then baked into static JSON. The API tokens involved
            exist only in the build environment. They are never shipped to the
            client and no client-side code talks to GitHub or Notion.
          </p>
        </PostureSection>

        <PostureSection title="runtime surface">
          <p>
            After the page loads, your browser makes no external requests at
            all. Scripts, styles, fonts, and images are all served from this
            domain. Screenshots inside writeups are mirrored out of Notion at
            build time rather than hotlinked, so reading a writeup does not tell
            Notion anything about you either.
          </p>
        </PostureSection>

        <PostureSection title="what I do not control">
          <p>
            GitHub Pages does not allow custom response headers, which rules
            out a server-side Content-Security-Policy, X-Frame-Options, or a
            custom HSTS policy. TLS termination and HSTS come from the
            github.io platform instead. A static host with no header control is
            a real limitation, and pretending otherwise would defeat the point
            of this page.
          </p>
        </PostureSection>

        <PostureSection title="reporting">
          <p>
            Found something wrong with this site? Email devalktk@gmail.com with
            what you found and how to reproduce it.
          </p>
        </PostureSection>
      </div>
    </AnimatedPage>
  );
}

function PostureSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="panel-3d border border-border p-5">
      <h2 className="mono-heading text-sm font-semibold text-accent">{title}</h2>
      <div className="mt-3 text-sm leading-7 text-body">{children}</div>
    </section>
  );
}

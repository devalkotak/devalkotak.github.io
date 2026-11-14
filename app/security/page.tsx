import type { Metadata } from "next";
import AnimatedPage from "@/components/AnimatedPage";
import PageHeader from "@/components/PageHeader";

export const metadata: Metadata = {
  title: "Security posture",
  description:
    "How this site is built, what it collects, and what its actual attack surface is.",
};

export default function SecurityPage() {
  return (
    <AnimatedPage className="content-shell">
      <PageHeader
        crumbs={[{ label: "Security" }]}
        title="How this site is"
        accent="secured."
        intro="Reviewing other people’s security and documenting none of my own would be a bad look. This is the threat model for the site you are reading, including the parts outside my control."
      />

      <div className="mt-10 space-y-4">
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
            and Notion, then baked into static JSON. The build runs on my own
            machine, and the API tokens live only in a local .env file that is
            never committed. They are never shipped to the client and no
            client-side code talks to GitHub or Notion.
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

        <PostureSection title="content security policy">
          <p>
            GitHub Pages cannot send response headers, so the policy ships as a
            meta tag instead, placed before any script on the page. After every
            build, a script hashes each inline script Next.js emits and writes a
            per-page policy. Scripts run only if they come from this domain or
            match one of those SHA-256 hashes; there is no unsafe-inline and no
            unsafe-eval for scripts. Images, fonts and network requests are
            limited to this domain, form submissions are blocked, the base tag
            is pinned to this domain, and plugins and frames are off
            everywhere except the resume page, which embeds its own PDF.
          </p>
          <p className="mt-3">
            One deliberate allowance: style-src permits inline styles, because
            React renders sizing as style attributes. Injected CSS cannot run
            code, and the script rules above do not depend on it.
          </p>
        </PostureSection>

        <PostureSection title="what I do not control">
          <p>
            A meta tag cannot carry every directive. frame-ancestors only works
            as a real header, and so does X-Frame-Options, so this site has no
            clickjacking protection of its own. HSTS comes from the github.io
            platform rather than a policy I set. A static host with no header
            control is a real limitation, and pretending otherwise would defeat
            the point of this page.
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

function PostureSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="panel-3d border border-border p-5 sm:p-6">
      <h2 className="display-heading text-lg text-foreground first-letter:uppercase">{title}</h2>
      <div className="mt-3 text-sm leading-7 text-body">{children}</div>
    </section>
  );
}

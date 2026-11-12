import type { Metadata } from "next";
import { Download, ExternalLink } from "lucide-react";
import AnimatedPage from "@/components/AnimatedPage";
import PageHeader from "@/components/PageHeader";

export const metadata: Metadata = {
  title: "Resume",
  description: "Deval Kotak's resume. View it inline or download the PDF.",
};

export default function ResumePage() {
  return (
    <AnimatedPage className="content-shell">
      <PageHeader
        crumbs={[{ label: "resume" }]}
        title="The formal"
        accent="version."
        intro="Two pages, the same work as the homepage, in the order recruiters expect."
        aside={
          <>
          <a
            href="/resume.pdf"
            download
            className="inline-flex h-11 items-center gap-2 border border-accent/60 bg-[var(--color-accent-muted)] px-4 text-sm font-medium text-accent transition hover:border-accent"
          >
            Download
            <Download size={14} />
          </a>
          <a
            href="/resume.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-11 items-center gap-2 border border-border px-4 text-sm text-body transition hover:border-accent/60 hover:text-accent"
          >
            Open in new tab
            <ExternalLink size={14} />
          </a>
          </>
        }
      />

      <div className="mt-10 border border-border bg-surface">
        <object
          data="/resume.pdf"
          type="application/pdf"
          className="h-[80vh] w-full"
          aria-label="Deval Kotak's resume"
        >
          <p className="p-6 text-sm text-muted">
            Your browser can’t preview PDFs inline.{" "}
            <a href="/resume.pdf" className="text-accent hover:underline">
              Download the resume
            </a>{" "}
            instead.
          </p>
        </object>
      </div>
    </AnimatedPage>
  );
}

import type { Metadata } from "next";
import { Download, ExternalLink, FileText } from "lucide-react";
import AnimatedPage from "@/components/AnimatedPage";

export const metadata: Metadata = {
  title: "Resume / Deval Kotak",
  description: "Deval Kotak's resume — view inline or download the PDF.",
};

export default function ResumePage() {
  return (
    <AnimatedPage className="content-shell">
      <header className="flex flex-wrap items-end justify-between gap-4 border-b border-border pb-8">
        <div>
          <p className="mono-heading flex items-center gap-2 text-sm text-accent">
            <FileText size={16} />
            resume/
          </p>
          <h1 className="mono-heading mt-4 text-3xl font-semibold text-foreground sm:text-4xl">
            Deval Kotak
          </h1>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <a
            href="/resume.pdf"
            download
            className="inline-flex h-10 items-center gap-2 border border-accent/60 bg-[var(--color-accent-muted)] px-4 text-sm font-medium text-accent transition hover:border-accent"
          >
            Download
            <Download size={14} />
          </a>
          <a
            href="/resume.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-10 items-center gap-2 border border-border px-4 text-sm text-body transition hover:border-accent/60 hover:text-accent"
          >
            Open in new tab
            <ExternalLink size={14} />
          </a>
        </div>
      </header>

      <div className="mt-8 border border-border bg-surface">
        <object
          data="/resume.pdf"
          type="application/pdf"
          className="h-[80vh] w-full"
          aria-label="Deval Kotak's resume"
        >
          <p className="p-6 text-sm text-muted">
            Your browser can&apos;t preview PDFs inline.{" "}
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

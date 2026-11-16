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
    <AnimatedPage className="wide-shell">
      <PageHeader
        crumbs={[{ label: "Resume" }]}
        title="The formal"
        accent="version."
        intro="Two pages, in the order recruiters expect. The homepage tells the stories; this lists everything."
        aside={
          <>
          <a
            href="/resume.pdf"
            download
            className="inline-flex h-12 items-center gap-2.5 btn-glass rounded-full px-6 text-base font-semibold text-foreground"
          >
            Download
            <Download size={14} />
          </a>
          <a
            href="/resume.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-12 items-center gap-2.5 rounded-full border border-border px-6 text-base font-medium text-foreground transition hover:border-accent hover:text-accent"
          >
            Open in new tab
            <ExternalLink size={14} />
          </a>
          </>
        }
      />

      <div className="mx-auto mt-7 sm:mt-10 max-w-4xl overflow-hidden border border-border bg-surface">
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

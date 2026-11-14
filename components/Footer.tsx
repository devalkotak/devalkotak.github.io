import Link from "next/link";
import writeupsPayload from "@/content/generated/writeups.json";
import { formatDate } from "@/lib/format";

// build_content.py stamps every sync; the deploy script runs it before each
// build, so this is the date the live content was last pulled from Notion.
function syncedOn(stamp: string | undefined) {
  if (!stamp) return null;
  const date = new Date(stamp);
  if (Number.isNaN(date.getTime())) return null;
  return { iso: date.toISOString(), label: formatDate(stamp) };
}

export default function Footer() {
  const synced = syncedOn((writeupsPayload as { generatedAt?: string }).generatedAt);

  return (
    <footer className="border-t border-border py-8">
      <p className="content-shell label-text text-center text-xs leading-6 text-muted">
        Deval Kotak / Built with Next.js /{" "}
        <Link href="/security" className="transition hover:text-accent">
          How this site is secured
        </Link>
        {synced && (
          <>
            {" "}
            / Content synced from Notion{" "}
            <time dateTime={synced.iso} className="text-body">
              {synced.label}
            </time>
          </>
        )}
      </p>
    </footer>
  );
}

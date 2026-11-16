import { readFile } from "node:fs/promises";
import path from "node:path";
import { getPublishedWriteups } from "@/lib/notion";
import type { NotionBlock, WriteupSummary } from "@/lib/types";

/**
 * Groups published writeups into tracks for the blog index, and works out
 * what Notion does not store: reading time, section titles, level numbers.
 *
 * Four tracks are known and always get a card. Anything else is grouped by
 * its Notion Source (or Type), so publishing a page from a new platform adds
 * a new group to the index with no code change.
 */

export type EntryKind = "notes" | "lab" | "level" | "module" | "entry";

export type BlogEntry = WriteupSummary & {
  trackId: string;
  /** Sub-group inside a track, e.g. the vulnerability class for Web Security Academy. */
  topic?: string;
  kind: EntryKind;
  covers: string[];
  minutes: number;
  /** Bandit only: the level this entry starts from. */
  level?: number;
};

export type TrackGroup = {
  id: string;
  name: string;
  source: string;
  blurb: string;
  /** Known tracks get a card at the top of the page even before their first post. */
  featured: boolean;
  entries: BlogEntry[];
};

type KnownTrack = Omit<TrackGroup, "entries" | "featured"> & {
  matches: (writeup: WriteupSummary) => boolean;
  kindOf: (writeup: WriteupSummary) => EntryKind;
};

const source = (writeup: WriteupSummary) => String(writeup.properties?.Source ?? "").trim();
const hasTag = (writeup: WriteupSummary, tag: string) =>
  writeup.tags.some((t) => t.toLowerCase() === tag.toLowerCase());

// Card order on the page.
const KNOWN_TRACKS: KnownTrack[] = [
  {
    id: "cwes",
    name: "HTB Academy CWES",
    source: "Hack The Box",
    blurb: "Module notes from the Certified Web Exploitation Specialist path.",
    matches: (w) => hasTag(w, "CWES") || /^htb|hack the box/i.test(source(w)),
    kindOf: () => "module",
  },
  {
    id: "wsa",
    name: "Web Security Academy",
    source: "PortSwigger",
    blurb: "Topic notes and lab writeups, one vulnerability class at a time.",
    matches: (w) => hasTag(w, "WSA") || /portswigger|websec/i.test(source(w)),
    kindOf: (w) => (w.category.toLowerCase() === "notes" ? "notes" : "lab"),
  },
  {
    id: "bandit",
    name: "Bandit",
    source: "OverTheWire",
    blurb: "The Linux wargame, level by level: the command and why it works.",
    matches: (w) => w.category === "Bandit" || /overthewire/i.test(source(w)),
    kindOf: () => "level",
  },
  {
    id: "secplus",
    name: "Security+ SY0-701",
    source: "CompTIA",
    blurb: "Study notes for each exam domain.",
    matches: (w) => hasTag(w, "Sec+"),
    kindOf: () => "notes",
  },
];

// Short Notion tags mapped to readable topic names. Unknown tags show as written.
const TOPIC_NAMES: Record<string, string> = {
  sqli: "SQL injection",
  xss: "Cross-site scripting",
  "auth vuln": "Authentication",
  auth: "Authentication",
  csrf: "CSRF",
  ssrf: "SSRF",
  xxe: "XXE",
  idor: "Access control",
  "access control": "Access control",
};

const WORDS_PER_MINUTE = 200;
const writeupDirectory = path.join(process.cwd(), "content", "generated", "writeups");

export async function getBlogGroups(): Promise<TrackGroup[]> {
  const writeups = await getPublishedWriteups();
  const entries = await Promise.all(writeups.map(toEntry));

  const groups = new Map<string, TrackGroup>();
  for (const track of KNOWN_TRACKS) {
    groups.set(track.id, { id: track.id, name: track.name, source: track.source, blurb: track.blurb, featured: true, entries: [] });
  }
  for (const entry of entries) {
    if (!groups.has(entry.trackId)) {
      const name = source(entry) || entry.category || "Other";
      groups.set(entry.trackId, { id: entry.trackId, name, source: name, blurb: "", featured: false, entries: [] });
    }
    groups.get(entry.trackId)!.entries.push(entry);
  }

  groups.forEach((group) => group.entries.sort(compareEntries));
  return Array.from(groups.values());
}

async function toEntry(writeup: WriteupSummary): Promise<BlogEntry> {
  const blocks = await readBlocks(writeup.slug);
  const known = KNOWN_TRACKS.find((track) => track.matches(writeup));
  const kind = known ? known.kindOf(writeup) : "entry";

  return {
    ...writeup,
    trackId: known?.id ?? slugify(source(writeup) || writeup.category || "other"),
    topic: known?.id === "wsa" ? topicOf(writeup) : undefined,
    kind,
    covers: sectionTitles(blocks),
    minutes: Math.max(1, Math.round(countWords(blocks) / WORDS_PER_MINUTE)),
    level: kind === "level" ? parseLevel(writeup.title) : undefined,
  };
}

/** Topic from the first tag that is not the track tag, else from the title ("XSS Notes" -> XSS). */
function topicOf(writeup: WriteupSummary): string {
  const tag = writeup.tags.find((t) => t.toUpperCase() !== "WSA");
  const raw = tag ?? writeup.title.replace(/\s*notes?$/i, "").trim();
  const key = raw.toLowerCase();
  if (TOPIC_NAMES[key]) return TOPIC_NAMES[key];
  // Titles like "Authentication Vulnerabilities Notes" match on their first word.
  const byWord = Object.values(TOPIC_NAMES).find((name) => key.startsWith(name.toLowerCase().split(" ")[0]));
  return byWord ?? raw;
}

const DIFFICULTY = ["apprentice", "practitioner", "expert"];

function compareEntries(a: BlogEntry, b: BlogEntry): number {
  if (a.level !== undefined && b.level !== undefined) return a.level - b.level;
  if (a.kind !== b.kind) return a.kind === "notes" ? -1 : b.kind === "notes" ? 1 : 0;
  if (a.kind === "lab") {
    const rank = DIFFICULTY.indexOf(a.category.toLowerCase()) - DIFFICULTY.indexOf(b.category.toLowerCase());
    if (rank !== 0) return rank;
    return a.date.localeCompare(b.date);
  }
  // Numbered series (SY701 Notes - 1., 01 Web Requests) read in order; the rest newest first.
  const numbered = /\d/.test(a.title) && /\d/.test(b.title);
  return numbered ? a.title.localeCompare(b.title, undefined, { numeric: true }) : b.date.localeCompare(a.date);
}

async function readBlocks(slug: string): Promise<NotionBlock[]> {
  try {
    const file = await readFile(path.join(writeupDirectory, `${slug}.json`), "utf-8");
    return (JSON.parse(file) as { blocks: NotionBlock[] }).blocks ?? [];
  } catch {
    return [];
  }
}

function plain(block: NotionBlock): string {
  return (block.richText ?? []).map((part) => part.plainText).join("");
}

function countWords(blocks: NotionBlock[]): number {
  let words = 0;
  const visit = (list: NotionBlock[]) => {
    for (const block of list) {
      const texts = [plain(block), ...(block.cells ?? []).flat().map((cell) => cell.plainText)];
      for (const text of texts) words += text.split(/\s+/).filter(Boolean).length;
      if (block.children) visit(block.children);
    }
  };
  visit(blocks);
  return words;
}

/** Top-level section titles, which say what a set of notes covers better than any one paragraph. */
function sectionTitles(blocks: NotionBlock[]): string[] {
  return blocks
    .filter((block) => block.type === "heading_1" || block.type === "heading_2")
    .map((block) => plain(block).trim())
    .filter((title) => title && !/^(resources|references)$/i.test(title));
}

function parseLevel(title: string): number | undefined {
  const match = title.match(/Level\s+(\d+)/i);
  return match ? Number(match[1]) : undefined;
}

function slugify(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "other";
}

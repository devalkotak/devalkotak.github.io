import { readFile } from "node:fs/promises";
import path from "node:path";
import writeupsPayload from "@/content/generated/writeups.json";
import type { WriteupDetail, WriteupSummary } from "./types";

export const NOTION_PLACEHOLDER_SLUG = "notion-not-configured";

type WriteupsPayload = {
  generatedAt: string;
  error: string | null;
  writeups: WriteupSummary[];
};

const payload = writeupsPayload as WriteupsPayload;
const writeupDirectory = path.join(process.cwd(), "content", "generated", "writeups");

export async function getPublishedWriteups(): Promise<WriteupSummary[]> {
  return payload.writeups;
}

export async function getWriteupBySlug(
  slug: string,
): Promise<WriteupDetail | null> {
  if (!isSafeSlug(slug)) {
    return null;
  }

  try {
    const filePath = path.join(writeupDirectory, `${slug}.json`);
    const file = await readFile(filePath, "utf-8");
    return JSON.parse(file) as WriteupDetail;
  } catch {
    return null;
  }
}

function isSafeSlug(slug: string): boolean {
  return /^[a-z0-9-]+$/i.test(slug);
}

import type { MetadataRoute } from "next";
import { getPublishedWriteups } from "@/lib/notion";

export const dynamic = "force-static";

const SITE_URL = "https://devalkotak.github.io";

const STATIC_ROUTES = [
  { path: "/", priority: 1 },
  { path: "/projects", priority: 0.8 },
  { path: "/blog", priority: 0.8 },
  { path: "/resources", priority: 0.6 },
  { path: "/optiverse", priority: 0.6 },
  { path: "/resume", priority: 0.7 },
  { path: "/security", priority: 0.4 },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const writeups = await getPublishedWriteups();
  const lastModified = new Date();

  return [
    ...STATIC_ROUTES.map(({ path, priority }) => ({
      url: `${SITE_URL}${path}`,
      lastModified,
      priority,
    })),
    ...writeups.map((writeup) => ({
      url: `${SITE_URL}/blog/${writeup.slug}`,
      lastModified,
      priority: 0.5,
    })),
  ];
}

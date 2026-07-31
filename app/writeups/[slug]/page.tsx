import Redirect from "@/components/Redirect";
import { NOTION_PLACEHOLDER_SLUG, getPublishedWriteups } from "@/lib/notion";

export const dynamicParams = false;

export async function generateStaticParams() {
  const writeups = await getPublishedWriteups();
  return writeups.length > 0
    ? writeups.map((writeup) => ({ slug: writeup.slug }))
    : [{ slug: NOTION_PLACEHOLDER_SLUG }];
}

export default function WriteupRedirectPage({
  params,
}: {
  params: { slug: string };
}) {
  return <Redirect to={`/blog/${params.slug}/`} />;
}

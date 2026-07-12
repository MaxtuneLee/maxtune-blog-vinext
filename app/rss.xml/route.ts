import { getAllPosts } from "@/lib/posts";
import getSortedPosts from "@/lib/utils/getSortedPosts";
import { SITE } from "@/lib/config";

const XML_ENTITIES: Record<string, string> = {
  "<": "&lt;",
  ">": "&gt;",
  "&": "&amp;",
  "'": "&apos;",
  '"': "&quot;",
};

function escapeXml(str: string) {
  return str.replace(/[<>&'"]/g, char => XML_ENTITIES[char]);
}

export async function GET() {
  const posts = (await getAllPosts()).filter(p => !p.data.draft);
  const sorted = getSortedPosts(posts);

  const items = sorted
    .map(({ id, data }) => {
      const link = new URL(`posts/${id}`, SITE.website).href;
      const pubDate = new Date(
        data.modDatetime ?? data.pubDatetime
      ).toUTCString();

      return `<item>
      <title>${escapeXml(data.title)}</title>
      <link>${link}</link>
      <guid>${link}</guid>
      <description>${escapeXml(data.description)}</description>
      <pubDate>${pubDate}</pubDate>
    </item>`;
    })
    .join("");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>${escapeXml(SITE.title)}</title>
    <description>${escapeXml(SITE.desc)}</description>
    <link>${SITE.website}</link>
    ${items}
  </channel>
</rss>`;

  return new Response(xml, { headers: { "Content-Type": "application/xml" } });
}

import type { MetadataRoute } from "next";
import { getAllPosts } from "@/lib/posts";
import { SITE } from "@/lib/config";
import { locales, defaultLocale } from "@/lib/i18n";

const STATIC_ROUTES = ["", "posts", "about", "tags", "friends", "search"];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const entries: MetadataRoute.Sitemap = [];

  for (const lang of locales) {
    const prefix = lang === defaultLocale ? "" : `${lang}/`;

    for (const route of STATIC_ROUTES) {
      entries.push({ url: new URL(`${prefix}${route}`, SITE.website).href });
    }

    const posts = (await getAllPosts(lang)).filter(p => !p.data.draft);
    for (const post of posts) {
      entries.push({
        url: new URL(`${prefix}posts/${post.id}`, SITE.website).href,
        lastModified: post.data.modDatetime ?? post.data.pubDatetime,
      });
    }
  }

  return entries;
}

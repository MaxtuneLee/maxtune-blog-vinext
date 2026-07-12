import type { MetadataRoute } from "next";
import { getAllPosts } from "@/lib/posts";
import { SITE } from "@/lib/config";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = (await getAllPosts()).filter(p => !p.data.draft);

  const staticRoutes = ["", "posts", "about", "tags", "friends", "search"].map(
    route => ({ url: new URL(route, SITE.website).href })
  );

  const postRoutes = posts.map(post => ({
    url: new URL(`posts/${post.id}`, SITE.website).href,
    lastModified: post.data.modDatetime ?? post.data.pubDatetime,
  }));

  return [...staticRoutes, ...postRoutes];
}

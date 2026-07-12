import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { SITE } from "./config";
import type { PostData } from "./types";

// ponytail: a lightweight frontmatter-only reader, kept separate from lib/posts.ts
// so routes that only need title/author/tags (like the OG image routes) don't pull
// in the unified/remark/rehype-pretty-code/shiki markdown pipeline — see
// MIGRATION_NOTES.md for why that pipeline must stay out of dynamic image routes.
const BLOG_DIR = path.join(process.cwd(), "content", "blog");

export type PostMeta = { id: string; data: PostData };

let metaCache: PostMeta[] | null = null;

export function getAllPostsMeta(): PostMeta[] {
  if (!metaCache) {
    const files = fs
      .readdirSync(BLOG_DIR)
      .filter(f => /\.mdx?$/.test(f) && !f.startsWith("_"));

    metaCache = files.map(filename => {
      const id = filename.replace(/\.mdx?$/, "");
      const raw = fs.readFileSync(path.join(BLOG_DIR, filename), "utf-8");
      const { data: fm } = matter(raw);

      const data: PostData = {
        author: fm.author ?? SITE.author,
        pubDatetime: new Date(fm.pubDatetime),
        modDatetime: fm.modDatetime ? new Date(fm.modDatetime) : null,
        title: fm.title,
        featured: fm.featured ?? false,
        draft: fm.draft ?? false,
        tags: fm.tags && fm.tags.length > 0 ? fm.tags : ["others"],
        ogImage: fm.ogImage,
        description: fm.description ?? "",
        canonicalURL: fm.canonicalURL,
      };

      return { id, data };
    });
  }
  return metaCache;
}

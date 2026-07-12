import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { SITE } from "./config";
import { defaultLocale, type Locale } from "./i18n";
import type { PostData } from "./types";

// ponytail: a lightweight frontmatter-only reader, kept separate from lib/posts.ts
// so routes that only need title/author/tags (like the OG image routes) don't pull
// in the unified/remark/rehype-pretty-code/shiki markdown pipeline — see
// MIGRATION_NOTES.md for why that pipeline must stay out of dynamic image routes.
const BLOG_DIR = path.join(process.cwd(), "content", "blog");
const EN_SUFFIX = /\.en\.mdx?$/;

export type PostMeta = { id: string; data: PostData };

const metaCache: Partial<Record<Locale, PostMeta[]>> = {};

export function getAllPostsMeta(lang: Locale = defaultLocale): PostMeta[] {
  if (!metaCache[lang]) {
    const files = fs
      .readdirSync(BLOG_DIR)
      .filter(f => /\.mdx?$/.test(f) && !f.startsWith("_"))
      .filter(f => (lang === "en" ? EN_SUFFIX.test(f) : !EN_SUFFIX.test(f)));

    metaCache[lang] = files.map(filename => {
      const id = filename.replace(/(\.en)?\.mdx?$/, "");
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
  return metaCache[lang]!;
}

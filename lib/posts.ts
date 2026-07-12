import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkGfm from "remark-gfm";
import remarkToc from "remark-toc";
import remarkCollapse from "remark-collapse";
import remarkRehype from "remark-rehype";
import rehypeRaw from "rehype-raw";
import rehypePrettyCode from "rehype-pretty-code";
import rehypeStringify from "rehype-stringify";
import { SITE } from "./config";
import { defaultLocale, type Locale } from "./i18n";
import type { Post, PostData } from "./types";

const BLOG_DIR = path.join(process.cwd(), "content", "blog");
// A post's default-locale (zh) file is "Slug.md"; a translation is
// "Slug.en.md" — same slug, so /posts/Slug and /en/posts/Slug pair up
// automatically once a translation file exists. No frontmatter field needed.
const EN_SUFFIX = /\.en\.mdx?$/;

export async function renderMarkdown(markdown: string): Promise<string> {
  const file = await unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkToc)
    .use(remarkCollapse, { test: "Table of contents" })
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypeRaw)
    .use(rehypePrettyCode, { theme: "rose-pine", keepBackground: true })
    .use(rehypeStringify, { allowDangerousHtml: true })
    .process(markdown);
  return String(file);
}

function loadPostsRaw(lang: Locale) {
  const files = fs
    .readdirSync(BLOG_DIR)
    .filter(f => /\.mdx?$/.test(f) && !f.startsWith("_"))
    .filter(f => (lang === "en" ? EN_SUFFIX.test(f) : !EN_SUFFIX.test(f)));

  return files.map(filename => {
    const id = filename.replace(/(\.en)?\.mdx?$/, "");
    const raw = fs.readFileSync(path.join(BLOG_DIR, filename), "utf-8");
    const { data: fm, content } = matter(raw);

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

    return { id, data, body: content };
  });
}

// ponytail: whole blog is static markdown read once per server process and memoized;
// add cache invalidation only if content needs to change without a redeploy.
const postsCache: Partial<Record<Locale, Promise<Post[]>>> = {};

export function getAllPosts(lang: Locale = defaultLocale): Promise<Post[]> {
  if (!postsCache[lang]) {
    postsCache[lang] = Promise.all(
      loadPostsRaw(lang).map(async ({ id, data, body }) => ({
        id,
        data,
        contentHtml: await renderMarkdown(body),
      }))
    );
  }
  return postsCache[lang]!;
}

export async function getPostById(
  id: string,
  lang: Locale = defaultLocale
): Promise<Post | undefined> {
  const posts = await getAllPosts(lang);
  return posts.find(p => p.id === id);
}

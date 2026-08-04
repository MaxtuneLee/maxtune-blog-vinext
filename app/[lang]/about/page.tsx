import fs from "node:fs";
import path from "node:path";
import Main from "@/components/Main";
import { renderMarkdown } from "@/lib/posts";
import { getDictionary, type Locale } from "@/lib/i18n";

export async function generateMetadata({ params }: { params: Promise<{ lang: Locale }> }) {
  const { lang } = await params;
  return { title: getDictionary(lang).about.metaTitle };
}

// content/about.<lang>.md if present, else content/about.md (English fallback).
function readAbout(lang: Locale): string {
  const dir = path.join(process.cwd(), "content");
  const localized = path.join(dir, `about.${lang}.md`);
  const file = fs.existsSync(localized) ? localized : path.join(dir, "about.md");
  return fs.readFileSync(file, "utf-8");
}

export default async function AboutPage({ params }: { params: Promise<{ lang: Locale }> }) {
  const { lang } = await params;
  const dict = getDictionary(lang);
  const html = await renderMarkdown(readAbout(lang));

  return (
    <Main title={dict.about.pageTitle}>
      <div
        className="prose mb-28 max-w-3xl prose-img:border-0"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </Main>
  );
}

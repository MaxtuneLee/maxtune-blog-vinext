import fs from "node:fs";
import path from "node:path";
import Main from "@/components/Main";
import { renderMarkdown } from "@/lib/posts";

export const metadata = { title: "About Me" };

// About page content (content/about.md) stays Chinese-only for now, per the
// UI-chrome-first i18n scope — see the plan discussion.
export default async function AboutPage() {
  const raw = fs.readFileSync(
    path.join(process.cwd(), "content", "about.md"),
    "utf-8"
  );
  const html = await renderMarkdown(raw);

  return (
    <Main title="About Me">
      <div
        className="prose mb-28 max-w-3xl prose-img:border-0"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </Main>
  );
}

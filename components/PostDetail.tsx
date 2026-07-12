import type { Post } from "@/lib/types";
import Datetime from "./Datetime";
import Tag from "./Tag";
import ShareLinks from "./ShareLinks";
import Comment from "./Comment";
import BackButton from "./BackButton";
import BackToTopButton from "./BackToTopButton";
import ArticleEnhancements from "./ArticleEnhancements";
import { slugifyStr, toViewTransitionName } from "@/lib/utils/slugify";
import { defaultLocale, type Locale } from "@/lib/i18n";

export default function PostDetail({
  post,
  url,
  lang = defaultLocale,
}: {
  post: Post;
  url: string;
  lang?: Locale;
}) {
  const { title, pubDatetime, modDatetime, tags } = post.data;

  return (
    <>
      <div className="mx-auto flex w-full max-w-3xl justify-start px-2">
        <BackButton />
      </div>
      <main id="main-content" className="mx-auto w-full max-w-3xl px-4 pb-12">
        <h1
          className="post-title text-2xl font-semibold text-skin-accent"
          style={{ viewTransitionName: toViewTransitionName(title) }}
        >
          {title}
        </h1>
        <Datetime
          pubDatetime={pubDatetime}
          modDatetime={modDatetime}
          size="lg"
          className="my-2"
          lang={lang}
        />
        <article
          id="article"
          role="article"
          className="prose mx-auto mt-8 max-w-3xl"
          dangerouslySetInnerHTML={{ __html: post.contentHtml }}
        />
        <ArticleEnhancements />
        <ul className="my-8">
          {tags.map(tag => (
            <Tag key={tag} tag={slugifyStr(tag)} lang={lang} />
          ))}
        </ul>
        <section id="post-comment" className="my-8">
          <Comment />
        </section>
        <div className="flex flex-col-reverse items-center justify-between gap-6 sm:flex-row-reverse sm:items-end sm:gap-4">
          <BackToTopButton />
          <ShareLinks url={url} lang={lang} />
        </div>
      </main>
    </>
  );
}

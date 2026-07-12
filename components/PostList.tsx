import type { Post } from "@/lib/types";
import Card from "./Card";
import Pagination from "./Pagination";
import { defaultLocale, localizePath, type Locale } from "@/lib/i18n";

type Props = {
  paginatedPosts: Post[];
  currentPage: number;
  totalPages: number;
  prevUrl: string;
  nextUrl: string;
  lang?: Locale;
};

export default function PostList({
  paginatedPosts,
  currentPage,
  totalPages,
  prevUrl,
  nextUrl,
  lang = defaultLocale,
}: Props) {
  return (
    <>
      <ul>
        {paginatedPosts
          .filter(post => !post.data.draft)
          .map(post => (
            <Card
              key={post.id}
              href={localizePath(lang, `/posts/${post.id}`)}
              frontmatter={post.data}
              lang={lang}
            />
          ))}
      </ul>
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        prevUrl={prevUrl}
        nextUrl={nextUrl}
        lang={lang}
      />
    </>
  );
}

import { getAllPosts } from "@/lib/posts";
import getSortedPosts from "@/lib/utils/getSortedPosts";
import getPagination from "@/lib/utils/getPagination";
import Main from "@/components/Main";
import PostList from "@/components/PostList";
import { getDictionary, localizePath, type Locale } from "@/lib/i18n";

export async function generateMetadata({ params }: { params: Promise<{ lang: Locale }> }) {
  const { lang } = await params;
  return { title: getDictionary(lang).posts.metaTitle };
}

export default async function Posts({ params }: { params: Promise<{ lang: Locale }> }) {
  const { lang } = await params;
  const dict = getDictionary(lang);
  const posts = await getAllPosts(lang);
  const sortedPosts = getSortedPosts(posts.filter(p => !p.data.draft));
  const pagination = getPagination({ posts: sortedPosts, page: 1, isIndex: true });

  return (
    <Main title={dict.posts.indexTitle} description={dict.posts.indexDescription}>
      <PostList
        paginatedPosts={pagination.paginatedPosts}
        currentPage={pagination.currentPage}
        totalPages={pagination.totalPages}
        prevUrl={localizePath(lang, "/posts")}
        nextUrl={localizePath(lang, "/posts/2")}
        lang={lang}
      />
    </Main>
  );
}

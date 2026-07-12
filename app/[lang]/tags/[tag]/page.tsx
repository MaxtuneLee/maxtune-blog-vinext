import { notFound } from "next/navigation";
import { getAllPosts } from "@/lib/posts";
import getUniqueTags from "@/lib/utils/getUniqueTags";
import getPostsByTag from "@/lib/utils/getPostsByTag";
import getPagination from "@/lib/utils/getPagination";
import Main from "@/components/Main";
import PostList from "@/components/PostList";
import { getDictionary, localizePath, type Locale } from "@/lib/i18n";

type Params = Promise<{ lang: Locale; tag: string }>;

export async function generateMetadata({ params }: { params: Params }) {
  const { lang, tag } = await params;
  const dict = getDictionary(lang);
  const posts = await getAllPosts(lang);
  const published = posts.filter(p => !p.data.draft);
  const tags = getUniqueTags(published);
  const match = tags.find(t => t.tag === tag);

  return { title: match ? dict.tags.tagMetaTitle(match.tagName) : dict.tags.metaTitle };
}

export default async function TagPage({ params }: { params: Params }) {
  const { lang, tag } = await params;
  const dict = getDictionary(lang);
  const posts = await getAllPosts(lang);
  const published = posts.filter(p => !p.data.draft);
  const tags = getUniqueTags(published);
  const match = tags.find(t => t.tag === tag);

  if (!match) notFound();

  const postsByTag = getPostsByTag(published, tag);
  const pagination = getPagination({ posts: postsByTag, page: 1, isIndex: true });

  return (
    <Main
      title={dict.tags.tagMetaTitle(match.tagName)}
      description={dict.tags.tagDescription(match.tagName)}
    >
      <PostList
        paginatedPosts={pagination.paginatedPosts}
        currentPage={pagination.currentPage}
        totalPages={pagination.totalPages}
        prevUrl={localizePath(lang, `/tags/${tag}`)}
        nextUrl={localizePath(lang, `/tags/${tag}/2`)}
        lang={lang}
      />
    </Main>
  );
}

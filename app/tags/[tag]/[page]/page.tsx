import { notFound } from "next/navigation";
import { getAllPosts } from "@/lib/posts";
import getUniqueTags from "@/lib/utils/getUniqueTags";
import getPostsByTag from "@/lib/utils/getPostsByTag";
import getPagination from "@/lib/utils/getPagination";
import Main from "@/components/Main";
import PostList from "@/components/PostList";

type Params = Promise<{ tag: string; page: string }>;

export async function generateMetadata({ params }: { params: Params }) {
  const { tag } = await params;
  const posts = await getAllPosts();
  const published = posts.filter(p => !p.data.draft);
  const tags = getUniqueTags(published);
  const match = tags.find(t => t.tag === tag);

  return { title: match ? `标签: ${match.tagName}` : "标签" };
}

export default async function TagPage({ params }: { params: Params }) {
  const { tag, page } = await params;
  const posts = await getAllPosts();
  const published = posts.filter(p => !p.data.draft);
  const tags = getUniqueTags(published);
  const match = tags.find(t => t.tag === tag);

  if (!match) notFound();

  const postsByTag = getPostsByTag(published, tag);
  const pagination = getPagination({ posts: postsByTag, page });

  if (pagination.currentPage === 0) notFound();

  return (
    <Main
      title={`标签: ${match.tagName}`}
      description={`所有带有 "${match.tagName}" 标签的文章`}
    >
      <PostList
        paginatedPosts={pagination.paginatedPosts}
        currentPage={pagination.currentPage}
        totalPages={pagination.totalPages}
        prevUrl={`/tags/${tag}${pagination.currentPage - 1 !== 1 ? `/${pagination.currentPage - 1}` : ""}`}
        nextUrl={`/tags/${tag}/${pagination.currentPage + 1}`}
      />
    </Main>
  );
}

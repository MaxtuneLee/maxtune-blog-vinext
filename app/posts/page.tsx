import { getAllPosts } from "@/lib/posts";
import getSortedPosts from "@/lib/utils/getSortedPosts";
import getPagination from "@/lib/utils/getPagination";
import Main from "@/components/Main";
import PostList from "@/components/PostList";

export const metadata = { title: "文章" };

export default async function Posts() {
  const posts = await getAllPosts();
  const sortedPosts = getSortedPosts(posts.filter(p => !p.data.draft));
  const pagination = getPagination({ posts: sortedPosts, page: 1, isIndex: true });

  return (
    <Main title="所有文章" description="All the articles I've posted.">
      <PostList
        paginatedPosts={pagination.paginatedPosts}
        currentPage={pagination.currentPage}
        totalPages={pagination.totalPages}
        prevUrl="/posts"
        nextUrl="/posts/2"
      />
    </Main>
  );
}

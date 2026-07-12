import type { Post } from "@/lib/types";
import Card from "./Card";
import Pagination from "./Pagination";

type Props = {
  paginatedPosts: Post[];
  currentPage: number;
  totalPages: number;
  prevUrl: string;
  nextUrl: string;
};

export default function PostList({
  paginatedPosts,
  currentPage,
  totalPages,
  prevUrl,
  nextUrl,
}: Props) {
  return (
    <>
      <ul>
        {paginatedPosts
          .filter(post => !post.data.draft)
          .map(post => (
            <Card key={post.id} href={`/posts/${post.id}`} frontmatter={post.data} />
          ))}
      </ul>
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        prevUrl={prevUrl}
        nextUrl={nextUrl}
      />
    </>
  );
}

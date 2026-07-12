import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getAllPosts } from "@/lib/posts";
import getSortedPosts from "@/lib/utils/getSortedPosts";
import getPagination from "@/lib/utils/getPagination";
import getPageNumbers from "@/lib/utils/getPageNumbers";
import Main from "@/components/Main";
import PostList from "@/components/PostList";
import PostDetail from "@/components/PostDetail";
import { SITE } from "@/lib/config";
import type { Post } from "@/lib/types";

type Resolved =
  | { kind: "post"; post: Post; published: Post[] }
  | { kind: "page"; pageNum: number; published: Post[] }
  | { kind: "notfound" };

async function resolveSlug(slug: string): Promise<Resolved> {
  const posts = await getAllPosts();
  const published = getSortedPosts(posts.filter(p => !p.data.draft));

  const post = published.find(p => p.id === slug);
  if (post) return { kind: "post", post, published };

  const pageNum = Number(slug);
  const pageNumbers = getPageNumbers(published.length);
  if (!isNaN(pageNum) && pageNumbers.includes(pageNum)) {
    return { kind: "page", pageNum, published };
  }

  return { kind: "notfound" };
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const result = await resolveSlug(slug);

  if (result.kind === "post") {
    const { title, description, pubDatetime, modDatetime, ogImage } = result.post.data;
    return {
      title,
      description,
      alternates: { canonical: `/posts/${result.post.id}` },
      openGraph: {
        title,
        description,
        type: "article",
        publishedTime: pubDatetime.toISOString(),
        modifiedTime: modDatetime ? modDatetime.toISOString() : undefined,
        ...(ogImage ? { images: [ogImage] } : {}),
      },
    };
  }

  return { title: "文章" };
}

export default async function PostOrPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const result = await resolveSlug(slug);

  if (result.kind === "post") {
    const url = `${SITE.website.replace(/\/$/, "")}/posts/${result.post.id}`;
    return <PostDetail post={result.post} url={url} />;
  }

  if (result.kind === "page") {
    const pagination = getPagination({ posts: result.published, page: result.pageNum });
    const prevUrl =
      "/posts" + (pagination.currentPage - 1 !== 1 ? `/${pagination.currentPage - 1}` : "");
    const nextUrl = `/posts/${pagination.currentPage + 1}`;

    return (
      <Main title="所有文章" description="All the articles I've posted.">
        <PostList
          paginatedPosts={pagination.paginatedPosts}
          currentPage={pagination.currentPage}
          totalPages={pagination.totalPages}
          prevUrl={prevUrl}
          nextUrl={nextUrl}
        />
      </Main>
    );
  }

  notFound();
}

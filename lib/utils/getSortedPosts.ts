import type { PostData } from "@/lib/types";

const getSortedPosts = <T extends { data: PostData }>(posts: T[]) => {
  return posts.sort(
    (a, b) =>
      Math.floor(
        new Date(b.data.modDatetime ?? b.data.pubDatetime).getTime() / 1000
      ) -
      Math.floor(
        new Date(a.data.modDatetime ?? a.data.pubDatetime).getTime() / 1000
      )
  );
};

export default getSortedPosts;

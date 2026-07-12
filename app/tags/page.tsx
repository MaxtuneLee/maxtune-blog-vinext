import { getAllPosts } from "@/lib/posts";
import getUniqueTags from "@/lib/utils/getUniqueTags";
import Main from "@/components/Main";
import Tag from "@/components/Tag";

export const metadata = { title: "标签" };

export default async function Tags() {
  const posts = await getAllPosts();
  const published = posts.filter(p => !p.data.draft);
  const tags = getUniqueTags(published);

  return (
    <Main title="标签" description="查看博客的所有关键词">
      <ul>
        {tags.map(tag => (
          <Tag key={tag.tag} tag={tag.tag} size="lg" />
        ))}
      </ul>
    </Main>
  );
}

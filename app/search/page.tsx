import { getAllPosts } from "@/lib/posts";
import Main from "@/components/Main";
import Search from "@/components/Search";

export const metadata = { title: "搜索" };

export default async function SearchPage() {
  const posts = (await getAllPosts()).filter(p => !p.data.draft);
  const searchList = posts.map(p => ({
    title: p.data.title,
    description: p.data.description,
    data: p.data,
    slug: p.id,
  }));

  return (
    <Main title="搜索" description="搜索博客里所有的文章">
      <Search searchList={searchList} />
    </Main>
  );
}

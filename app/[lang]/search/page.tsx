import { getAllPosts } from "@/lib/posts";
import Main from "@/components/Main";
import Search from "@/components/Search";
import { getDictionary, type Locale } from "@/lib/i18n";

export async function generateMetadata({ params }: { params: Promise<{ lang: Locale }> }) {
  const { lang } = await params;
  return { title: getDictionary(lang).search.metaTitle };
}

export default async function SearchPage({ params }: { params: Promise<{ lang: Locale }> }) {
  const { lang } = await params;
  const dict = getDictionary(lang);
  const posts = (await getAllPosts(lang)).filter(p => !p.data.draft);
  const searchList = posts.map(p => ({
    title: p.data.title,
    description: p.data.description,
    data: p.data,
    slug: p.id,
  }));

  return (
    <Main title={dict.search.pageTitle} description={dict.search.pageDescription}>
      <Search searchList={searchList} />
    </Main>
  );
}

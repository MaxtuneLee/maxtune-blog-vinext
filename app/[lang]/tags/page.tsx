import { getAllPosts } from "@/lib/posts";
import getUniqueTags from "@/lib/utils/getUniqueTags";
import Main from "@/components/Main";
import Tag from "@/components/Tag";
import { getDictionary, type Locale } from "@/lib/i18n";

export async function generateMetadata({ params }: { params: Promise<{ lang: Locale }> }) {
  const { lang } = await params;
  return { title: getDictionary(lang).tags.metaTitle };
}

export default async function Tags({ params }: { params: Promise<{ lang: Locale }> }) {
  const { lang } = await params;
  const dict = getDictionary(lang);
  const posts = await getAllPosts(lang);
  const published = posts.filter(p => !p.data.draft);
  const tags = getUniqueTags(published);

  return (
    <Main title={dict.tags.indexTitle} description={dict.tags.indexDescription}>
      <ul>
        {tags.map(tag => (
          <Tag key={tag.tag} tag={tag.tag} size="lg" lang={lang} />
        ))}
      </ul>
    </Main>
  );
}

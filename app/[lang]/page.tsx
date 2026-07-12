import { getAllPosts } from "@/lib/posts";
import getSortedPosts from "@/lib/utils/getSortedPosts";
import Card from "@/components/Card";
import Socials from "@/components/Socials";
import Hr from "@/components/Hr";
import LinkButton from "@/components/LinkButton";
import { SOCIALS } from "@/lib/config";
import { getDictionary, localizePath, type Locale } from "@/lib/i18n";

export default async function Home({ params }: { params: Promise<{ lang: Locale }> }) {
  const { lang } = await params;
  const dict = getDictionary(lang);
  const posts = await getAllPosts(lang);

  const sortedPosts = getSortedPosts(posts.filter(post => !post.data.draft));
  const featuredPosts = sortedPosts.filter(({ data }) => data.featured);
  const recentPosts = sortedPosts.filter(({ data }) => !data.featured);

  const socialCount = SOCIALS.filter(social => social.active).length;

  return (
    <main id="main-content">
      <section id="hero" className="pb-6 pt-8">
        <h1 className="my-4 inline-block text-3xl font-bold sm:my-8 sm:text-5xl">
          Maxtune
        </h1>
        <a
          target="_blank"
          href="/rss.xml"
          className="rss-link mb-6"
          aria-label="rss feed"
          title="RSS Feed"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            className="rss-icon mb-2 h-6 w-6 scale-110 fill-skin-accent sm:mb-3 sm:scale-125"
          >
            <path d="M19 20.001C19 11.729 12.271 5 4 5v2c7.168 0 13 5.832 13 13.001h2z" />
            <path d="M12 20.001h2C14 14.486 9.514 10 4 10v2c4.411 0 8 3.589 8 8.001z" />
            <circle cx={6} cy={18} r={2} />
          </svg>
          <span className="sr-only">RSS Feed</span>
        </a>
        <p className="my-2">
          {dict.home.bio1}
          <br />
          {dict.home.bio2}
        </p>
        {socialCount > 0 && (
          <div className="social-wrapper mt-4 flex flex-col sm:flex-row sm:items-center">
            <div className="social-links mb-1 mr-2 whitespace-nowrap sm:mb-0">
              {dict.home.connect}
            </div>
            <Socials />
          </div>
        )}
      </section>

      <Hr />

      {featuredPosts.length > 0 && (
        <section id="featured" className="pb-6 pt-12">
          <h2 className="text-2xl font-semibold tracking-wide">{dict.home.featured}</h2>
          <ul>
            {featuredPosts.map(({ id, data }) => (
              <Card
                key={id}
                href={localizePath(lang, `/posts/${id}`)}
                frontmatter={data}
                secHeading={false}
                lang={lang}
              />
            ))}
          </ul>
        </section>
      )}

      {recentPosts.length > 0 && featuredPosts.length > 0 && <Hr />}

      {recentPosts.length > 0 && (
        <section id="recent-posts" className="pb-6 pt-12">
          <h2 className="text-2xl font-semibold tracking-wide">{dict.home.recent}</h2>
          <ul>
            {recentPosts.slice(0, 4).map(({ id, data }) => (
              <Card
                key={id}
                href={localizePath(lang, `/posts/${id}`)}
                frontmatter={data}
                secHeading={false}
                lang={lang}
              />
            ))}
          </ul>
        </section>
      )}

      <div className="all-posts-btn-wrapper my-8 text-center">
        <LinkButton href={localizePath(lang, "/posts")}>
          {dict.home.allPosts}
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <path d="m11.293 17.293 1.414 1.414L19.414 12l-6.707-6.707-1.414 1.414L15.586 11H6v2h9.586z" />
          </svg>
        </LinkButton>
      </div>
    </main>
  );
}

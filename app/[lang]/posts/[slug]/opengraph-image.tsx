import { ImageResponse } from "next/og";
import { getAllPostsMeta } from "@/lib/posts-meta";
import getSortedPosts from "@/lib/utils/getSortedPosts";
import { SITE } from "@/lib/config";
import { locales, type Locale } from "@/lib/i18n";
import { getCachedOgImage } from "@/lib/og-image-cache";
import { loadOgFonts, OG_FONT_CACHE_KEY } from "@/lib/og-fonts";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
const TEMPLATE_VERSION = "post-v1";

// Keep frontmatter parsing outside the request path. The two image routes also
// share one module-scoped font promise, so a cache miss does not download the
// roughly 50 MiB CJK font pair more than once per process.
const ALL_POSTS_META: Record<Locale, ReturnType<typeof getAllPostsMeta>> = {
  zh: getAllPostsMeta("zh"),
  en: getAllPostsMeta("en"),
};

export default async function Image({
  params,
}: {
  params: Promise<{ lang: Locale; slug: string }>;
}) {
  const { lang, slug } = await params;
  const meta = locales.includes(lang) ? ALL_POSTS_META[lang] : ALL_POSTS_META.zh;
  const published = getSortedPosts(meta.filter(p => !p.data.draft));
  const post = published.find(p => p.id === slug);

  const title = post?.data.title ?? SITE.title;
  const author = post?.data.author ?? SITE.author;

  const cacheKey = JSON.stringify({
    template: TEMPLATE_VERSION,
    lang,
    slug,
    title,
    author,
    fontBase: OG_FONT_CACHE_KEY,
  });

  return getCachedOgImage(cacheKey, async () => {
    const { regular, bold } = await loadOgFonts();

    return new ImageResponse(
      (
        <div
          style={{
            position: "relative",
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "#fefbfb",
            fontFamily: "Sarasa UI SC",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: "2.5rem",
              right: "2.5rem",
              width: "88%",
              height: "80%",
              border: "4px solid black",
              background: "#ecebeb",
              opacity: 0.9,
              borderRadius: 4,
            }}
          />
          <div
            style={{
              display: "flex",
              margin: "2rem",
              width: "88%",
              height: "80%",
              border: "4px solid black",
              background: "#fefbfb",
              borderRadius: 4,
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                margin: 20,
                width: "90%",
                height: "90%",
              }}
            >
              <div
                style={{
                  fontSize: 72,
                  fontWeight: 700,
                  maxHeight: "84%",
                  overflow: "hidden",
                }}
              >
                {title}
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  fontSize: 28,
                }}
              >
                <div style={{ display: "flex" }}>
                  by <span style={{ fontWeight: 700 }}>{author}</span>
                </div>
                <div style={{ fontWeight: 700 }}>{SITE.title}</div>
              </div>
            </div>
          </div>
        </div>
      ),
      {
        ...size,
        fonts: [
          { name: "Sarasa UI SC", data: regular, weight: 400, style: "normal" },
          { name: "Sarasa UI SC", data: bold, weight: 700, style: "normal" },
        ],
      }
    );
  });
}

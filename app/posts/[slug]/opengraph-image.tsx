import { ImageResponse } from "next/og";
import { getAllPostsMeta } from "@/lib/posts-meta";
import getSortedPosts from "@/lib/utils/getSortedPosts";
import { SITE } from "@/lib/config";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// ponytail: hoisted to module scope (computed once, not per request) to work
// around a vinext bug — see MIGRATION_NOTES.md "vinext bug: dynamic
// opengraph-image routes". Also: unlike app/opengraph-image.tsx, this dynamic
// route deliberately does NOT fetch the custom Sarasa font. Combining an
// awaited fetch() with this route's data lookup reliably dropped the
// connection (empty reply, no error logged, reproduced in both `vinext dev`
// and `vinext start`); dropping the fetch and using Satori's default font
// made it reliable. Falls back to Satori's default font instead.
const ALL_POSTS_META = getAllPostsMeta();

export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const published = getSortedPosts(ALL_POSTS_META.filter(p => !p.data.draft));
  const post = published.find(p => p.id === slug);

  const title = post?.data.title ?? SITE.title;
  const author = post?.data.author ?? SITE.author;

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
              <div>
                by <span style={{ fontWeight: 700 }}>{author}</span>
              </div>
              <div style={{ fontWeight: 700 }}>{SITE.title}</div>
            </div>
          </div>
        </div>
      </div>
    ),
    size
  );
}

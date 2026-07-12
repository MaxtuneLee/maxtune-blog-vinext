# Migration notes: Astro → vinext

Ported from `../maxtune-blog` (Astro/AstroPaper) to Next.js App Router running on
[vinext](https://github.com/cloudflare/vinext) (Vite plugin that reimplements the
Next.js API surface), targeting Node deployment (`vinext build && vinext start`),
matching the original site's self-hosted Docker/nginx setup.

## Running it

```bash
npm run dev:vinext     # dev server, port 3001
npm run build:vinext   # production build
npm run start:vinext   # production server, port 3000
```

(`npm run dev` / `build` / `start` still run plain Next.js, unmodified by vinext,
if you ever want to sanity-check against stock Next.js behavior.)

## vinext bug found: dynamic `opengraph-image.tsx` routes intermittently drop the connection

**Where:** `app/posts/[slug]/opengraph-image.tsx` — the per-post OG image, generated
via Next's built-in `next/og` `ImageResponse`.

**Symptom:** the request hangs for several seconds, then the connection is dropped
with an empty HTTP response (`curl`: "Empty reply from server", no status code).
Reproduced in both `vinext dev` and `vinext start` (production). **Nothing is logged
to stdout/stderr on either path** — the request never appears in vinext's own
request log, making this very hard to diagnose from the application side.

**What I isolated:**
- A trivial dynamic `opengraph-image.tsx` (just `await params`, no other work) is
  reliable.
- A **static** (non-dynamic-segment) `opengraph-image.tsx` that does an external
  `fetch()` for custom font files (`app/opengraph-image.tsx`, the site-level OG
  image) is reliable.
- A **dynamic** `opengraph-image.tsx` that reads post frontmatter synchronously via
  `fs.readFileSync` (through `lib/posts-meta.ts`) with no `fetch()` is reliable.
- Combining an **awaited external `fetch()`** with **synchronous fs-heavy work**
  inside the request handler of a **dynamic** `opengraph-image.tsx` route fails
  consistently (not flaky — every single request failed across repeated clean
  server restarts once this exact combination was in place).
- Hoisting the fs work to module scope (computed once at import time, before any
  request arrives) instead of inside the request handler measurably improved but
  did **not fully eliminate** the failure in production mode — it became
  intermittent rather than 100% reproducible.

**Workaround shipped:** `app/posts/[slug]/opengraph-image.tsx` no longer fetches the
custom Sarasa font — it falls back to Satori's default font. The frontmatter lookup
is hoisted to module scope (see the comment in that file). This is meaningfully more
reliable than the original combination, but I was not able to get it to 100% in
every trial during testing — a fresh production restart occasionally still dropped
the very first request to this route. If you hit this in practice, the safest fix is
to drop the dynamic per-post OG image route entirely and let posts fall back to the
site-level `app/opengraph-image.tsx` (which is reliable) — happy to do that if you'd
rather trade the per-post title/author graphic for guaranteed reliability.

This is a vinext framework issue, not something fixable from application code —
worth filing upstream at https://github.com/cloudflare/vinext with the repro above.

## Other things fixed along the way (not vinext bugs — Tailwind v3→v4 migration)

vinext installs Tailwind CSS v4, which is a breaking change from this site's
original v3 config:
- `bg-opacity-*` / `text-opacity-*` / `border-opacity-*` standalone utilities were
  removed in v4 in favor of the `color/opacity` slash syntax (e.g.
  `bg-skin-accent/70`). Fixed in `app/globals.css` and `components/Search.tsx`.
- Custom classes defined via `@layer components { .foo {...} }` can no longer be
  referenced from another `@apply` in v4 — that requires the new `@utility`
  directive. `.focus-outline` (applied from `.prose summary`) was converted to
  `@utility focus-outline { ... }` in `app/globals.css`.
- The `tailwind.config.cjs` JS config (custom `skin-*` color tokens, custom font
  weights) was translated to `app/globals.css`'s `@theme` block. Three of the
  original color utilities didn't map 1:1 to Tailwind v4's uniform per-color model
  (`outline-skin-fill` actually meant "accent", `border-skin-fill` actually meant
  "text-base" — an AstroPaper theme quirk) — those two spots were renamed to
  `outline-skin-accent` / `border-skin-base` to match the intended color, not the
  literal original class name.

## Architecture decisions (deliberate deviations from a literal 1:1 port)

- **Header/Footer moved into the root layout** (`app/layout.tsx`) instead of being
  repeated per-page like the original Astro layouts. This isn't just tidiness: in
  Next.js App Router, page components remount on navigation but the root layout
  doesn't. The original theme's `/public/toggle-theme.js` attaches its `#theme-btn`
  click listener once; if Header were re-rendered per page (a literal port of the
  original structure), that listener would go stale after the first client-side
  navigation. Header now derives its active-nav highlight from `usePathname()`
  instead of a prop, so no data needs to flow from pages back up to the layout.
- **`Footer`'s `noMarginTop` prop was dropped** (a per-page tweak that skipped the
  footer's top margin on paginated listing pages). Now that Footer lives in the
  shared layout, there's no clean way to pass that down from a specific page; it
  always uses `mt-auto` now. Minor, purely cosmetic.
- **Metadata** (`<title>`, OpenGraph/Twitter tags, canonical URLs, article
  published/modified time) uses Next's native `metadata` / `generateMetadata()`
  API instead of hand-building `<head>` tags like the original `Layout.astro` did.
- **Sitemap and robots.txt** use Next's native `app/sitemap.ts` / `app/robots.ts`
  file conventions instead of `@astrojs/sitemap` + a hand-rolled `robots.txt.ts`.
- **RSS** (`app/rss.xml/route.ts`) is a small hand-built XML string — `@astrojs/rss`
  is Astro-specific, and Next.js has no bundled equivalent, so this avoids adding a
  new dependency for ~15 lines of templating.
- **OG images** use Next's built-in `next/og` `ImageResponse` (itself Satori-based)
  instead of the original's manual `satori` + `@resvg/resvg-js` setup — same
  underlying tech, now via the framework's native convention. See the vinext bug
  above for the one wrinkle this surfaced.
- **Markdown rendering** is a standalone `unified`/`remark`/`rehype` pipeline
  (`lib/posts.ts`), independent of vinext's own MDX-in-Vite integration (which
  vinext's own docs mark as incomplete). Since every post here is plain `.md` (not
  MDX/JSX-in-markdown), this sidesteps that limitation entirely — same approach
  Vercel's own Next.js blog starter uses. Same remark plugins as the original
  (`remark-gfm`, `remark-toc`, `remark-collapse`) plus `rehype-pretty-code`/`shiki`
  for syntax highlighting (`rose-pine` theme, matching the original's Shiki config).
- **`lib/posts-meta.ts`** is a separate, lightweight frontmatter-only reader (no
  markdown rendering, no shiki) used by the OG image routes — see the vinext bug
  section above for why this split exists.
- **View Transitions dropped entirely** (no `transition:name`, no
  `<ViewTransitions />`) — vinext's own docs note View Transitions API support
  depends on experimental React 19 canary features not worth taking on here.
- **`next/image` and `next/font` intentionally not used** — the original site
  already used plain `<img>` tags and self-hosted `@font-face` CSS everywhere
  (never Astro's `<Image>` or a web-font service), so this migration keeps that
  as-is. Convenient, since vinext's docs list both `next/image` and
  `next/font/google` as only partially supported.
- **Draft-post leakage fix**: the original Astro tag pages (`getPostsByTag`) and
  `/posts/[slug]` pagination branch computed post lists from the *unfiltered*
  collection in a couple of spots, meaning a draft post could theoretically leak
  into a tag listing if it shared a tag with a published post. This port filters
  drafts out before computing pagination/tags everywhere.
- **Content lives in `content/blog/*.md`** (copied verbatim from
  `../maxtune-blog/src/content/blog`) and `content/friends.json` /
  `content/about.md`, read via `node:fs` at request time with an in-memory cache
  (module-scope, computed once per server process) — no Astro content-collection
  equivalent needed since this is a plain Node server, not a static/edge target.
- **`@lucide/astro`'s `Plus` icon replaced with an inline SVG** in the friends page
  rather than adding `lucide-react` as a new dependency for one glyph.

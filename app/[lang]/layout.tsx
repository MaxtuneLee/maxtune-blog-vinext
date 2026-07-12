import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Analytics from "@/components/Analytics";
import { ViewTransitionRouteWatcher } from "@/components/ViewTransitionRouter";
import { SITE } from "@/lib/config";
import { locales, defaultLocale, getDictionary, type Locale } from "@/lib/i18n";
import "../globals.css";

type Params = Promise<{ lang: string }>;

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { lang } = await params;
  const dict = getDictionary(locales.includes(lang as Locale) ? (lang as Locale) : "zh");

  return {
    metadataBase: new URL(SITE.website),
    title: {
      default: SITE.title,
      template: `%s | ${SITE.title}`,
    },
    description: dict.meta.description,
    authors: [{ name: SITE.author }],
    alternates: {
      types: {
        "application/rss+xml": "/rss.xml",
      },
    },
    icons: {
      icon: "/favicon.svg",
    },
    openGraph: {
      title: SITE.title,
      description: dict.meta.description,
      url: SITE.website,
      siteName: SITE.title,
    },
    twitter: {
      card: "summary_large_image",
      title: SITE.title,
      description: dict.meta.description,
    },
  };
}

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Params;
}) {
  const { lang: rawLang } = await params;
  // An unrecognized locale segment (e.g. a route that isn't actually under
  // [lang] resolving here during not-found rendering) falls back to the
  // default locale rather than notFound() — calling notFound() from the
  // root layout itself conflicts with rendering the not-found boundary for
  // genuinely missing pages.
  const lang = locales.includes(rawLang as Locale) ? (rawLang as Locale) : defaultLocale;

  return (
    <html lang={lang} suppressHydrationWarning>
      <head>
        <link rel="stylesheet" href="/fonts/GlowSansSC-Normal/result.css" />
        <link rel="stylesheet" href="/fonts/IBMPlexMono-Regular/result.css" />
        <meta name="theme-color" content="" />
        <meta name="view-transition" content="same-origin" />
        <script src="/toggle-theme.js"></script>
      </head>
      <body>
        <ViewTransitionRouteWatcher />
        <Header />
        {children}
        <Footer lang={lang} />
        <Analytics />
      </body>
    </html>
  );
}

import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Analytics from "@/components/Analytics";
import { ViewTransitionRouteWatcher } from "@/components/ViewTransitionRouter";
import { SITE, LOCALE } from "@/lib/config";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(SITE.website),
  title: {
    default: SITE.title,
    template: `%s | ${SITE.title}`,
  },
  description: SITE.desc,
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
    description: SITE.desc,
    url: SITE.website,
    siteName: SITE.title,
  },
  twitter: {
    card: "summary_large_image",
    title: SITE.title,
    description: SITE.desc,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang={LOCALE.lang ?? "en"} suppressHydrationWarning>
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
        <Footer />
        <Analytics />
      </body>
    </html>
  );
}

import type { zh } from "./zh";

// Typed against zh's shape so a missing/extra key here is a compile error —
// that's the "test" for this dictionary, no separate check needed.
export const en: typeof zh = {
  nav: {
    posts: "Posts",
    about: "About",
    friends: "Friends",
    gallery: "Gallery",
  },
  home: {
    bio1: "Frontend developer studying intelligent science & technology, working on computer vision and web apps.",
    bio2: "I like 📷 photography, ☕ coffee, and 🐱 furries",
    connect: "Connect with me",
    featured: "Featured",
    recent: "Recent Posts",
    allPosts: "View all posts",
  },
  about: {
    metaTitle: "About Me",
    pageTitle: "About Me",
  },
  posts: {
    metaTitle: "Posts",
    indexTitle: "All Posts",
    indexDescription: "All the articles I've posted.",
  },
  tags: {
    metaTitle: "Tags",
    indexTitle: "Tags",
    indexDescription: "Browse all the tags used on this blog",
    tagMetaTitle: (tagName: string) => `Tag: ${tagName}`,
    tagDescription: (tagName: string) => `All posts tagged "${tagName}"`,
  },
  search: {
    metaTitle: "Search",
    pageTitle: "Search",
    pageDescription: "Search all posts on this blog",
    placeholder: "Type a keyword to search...",
    srLabel: "Search",
    results: (count: number, query: string) =>
      `Found ${count} result${count === 1 ? "" : "s"} for "${query}"`,
  },
  friends: {
    metaTitle: "Friends",
    pageTitle: "Friends",
    addFriendCta: "Let's be friends?",
    addFriendHint: "Click to add your link here",
  },
  notFound: {
    backHome: "Back to home",
  },
  pagination: {
    prev: "Prev",
    next: "Next",
  },
  datetime: {
    updatedAt: "Updated:",
    publishedAtSr: "Published:",
  },
  breadcrumbs: {
    home: "Home",
    allPosts: (page: string) => `All Posts (page ${page})`,
    tagPage: (page: number) => (page === 1 ? "" : `(page ${page})`),
  },
  shareLinks: {
    prompt: "Share this post ↓",
  },
  article: {
    copy: "Copy",
    copied: "Copied",
  },
  backButton: {
    label: "Back",
  },
  backToTop: {
    label: "Back to top",
  },
  footer: {
    motto: "The road of life is long — may egrets keep you company",
  },
  meta: {
    description:
      "Frontend developer studying intelligent science & technology, working on computer vision and web apps.",
  },
};

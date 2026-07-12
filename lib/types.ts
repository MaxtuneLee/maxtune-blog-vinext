import type socialIcons from "./social-icons";

export type Site = {
  website: string;
  author: string;
  desc: string;
  title: string;
  ogImage?: string;
  lightAndDarkMode: boolean;
  postPerPage: number;
  scheduledPostMargin: number;
  description: string;
};

export type SocialObjects = {
  name: keyof typeof socialIcons;
  href: string;
  active: boolean;
  linkTitle: string;
}[];

export type PostData = {
  author: string;
  pubDatetime: Date;
  modDatetime?: Date | null;
  title: string;
  featured?: boolean;
  draft?: boolean;
  tags: string[];
  ogImage?: string;
  description: string;
  canonicalURL?: string;
};

export type Post = {
  id: string;
  data: PostData;
  contentHtml: string;
};

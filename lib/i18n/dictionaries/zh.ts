export const zh = {
  nav: {
    posts: "文章",
    about: "关于",
    friends: "友链",
    gallery: "画廊",
  },
  home: {
    bio1: "学智能科学与技术的前端开发者，研究机器视觉与 web 应用开发。",
    bio2: "喜欢 📷 摄影、☕ 咖啡、🐱 福瑞",
    connect: "与我联系",
    featured: "特辑",
    recent: "最新文章",
    allPosts: "浏览全部文章",
  },
  about: {
    metaTitle: "关于",
    pageTitle: "关于我",
  },
  posts: {
    metaTitle: "文章",
    indexTitle: "所有文章",
    indexDescription: "我发布过的所有文章。",
  },
  tags: {
    metaTitle: "标签",
    indexTitle: "标签",
    indexDescription: "查看博客的所有关键词",
    tagMetaTitle: (tagName: string) => `标签: ${tagName}`,
    tagDescription: (tagName: string) => `所有带有 "${tagName}" 标签的文章`,
  },
  search: {
    metaTitle: "搜索",
    pageTitle: "搜索",
    pageDescription: "搜索博客里所有的文章",
    placeholder: "输入关键词搜索...",
    srLabel: "搜索",
    results: (count: number, query: string) =>
      `找到 ${count} 个与 "${query}" 相关的结果`,
  },
  friends: {
    metaTitle: "朋友们",
    pageTitle: "朋友们",
    addFriendCta: "交个朋友？",
    addFriendHint: "点击添加你的友情链接",
  },
  notFound: {
    backHome: "回到主页",
  },
  pagination: {
    prev: "上一页",
    next: "下一页",
  },
  datetime: {
    updatedAt: "更新于：",
    publishedAtSr: "发布于：",
  },
  breadcrumbs: {
    home: "主页",
    allPosts: (page: string) => `全部文章 (第 ${page} 页)`,
    tagPage: (page: number) => (page === 1 ? "" : `(第 ${page} 页)`),
  },
  shareLinks: {
    prompt: "分享这篇文章到 ↓",
  },
  article: {
    copy: "复制",
    copied: "已复制",
  },
  backButton: {
    label: "返回",
  },
  backToTop: {
    label: "回到顶部",
  },
  footer: {
    motto: "人生路漫漫 白鹭常相伴",
  },
  meta: {
    description: "学智能科学与技术的前端开发者，研究机器视觉与 web 应用开发。",
  },
} as const;

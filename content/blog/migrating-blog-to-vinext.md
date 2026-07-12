---
title: "把博客从 Astro 迁移到 vinext"
pubDatetime: 2026-07-12T18:00:00+08:00
categories:
  - "前端"
tags:
  - "vinext"
  - "Next.js"
  - "Astro"
  - "Vite"
  - "View Transitions"
  - "Tailwind CSS"
description: "这个博客用 AstroPaper 主题跑了好几年，这次把它整体迁移到了 vinext, 记录一下迁移过程中踩到的坑：vinext 一个动态 OG 图片路由的连接丢失 bug，以及 View Transitions 的排查。"
---

老博客用 [Astro](https://astro.build/) + [AstroPaper](https://github.com/satnaing/astro-paper) 主题跑了挺久，这次想试试 [vinext](https://github.com/cloudflare/vinext), 这是一个 Next 在 Vite 上重新实现，可以部署到 Cloudflare Workers，也可以照常跑在 Node 上。最近在给它做一些代码贡献，前几天发布了 `1.0.0-beta.0`，想着尝试用这个版本来做一下切换，然后看看其中能发现些什么问题再帮忙fix一下。

## 迁移的流程

直接把Astro那边的 27 篇 Markdown 文章原样搬过去，前端用 `unified`/`remark`/`rehype` 做了条渲染管线（`remark-gfm` + `remark-toc` + `remark-collapse` + `rehype-pretty-code`/`shiki`，配色沿用原来的 `rose-pine`）。

组件层面让 Fable 把 Astro 组件挨个翻译成 React Server/Client Components：`Search`、`Comment`、`Header` 这些需要交互的标了 `"use client"`，其余保持纯 Server Component。OG 图片从手写的 `satori` + `@resvg/resvg-js` 换成了 Next.js 自带的 `next/og`。sitemap/robots 也换成 `app/sitemap.ts`、`app/robots.ts` 这两个原生文件约定。

迁移的整体成本并不高，一天就搞定了，还得是 Fable，搭配 workflow 并行猛猛烧，基本上 one-shot就可以一比一复刻原来的 Astro 站点。剩下的就是踩坑了。

## Tailwind v4

Tailwind v3 和 v4 之间差别还是挺大的，原来的 `tailwind.config.cjs`（v3 的 JS 配置）得整个翻译成 `app/globals.css` 里的 `@theme` 块。这边也是指挥 AI 对照文档直接翻译，文档接的 Context7，任务完成后没有错误的地方。

## 动态 OG 图片路由会丢连接

这个是这次迁移里最费时间的一个坑，最后确认是 vinext 的问题。

`app/posts/[slug]/opengraph-image.tsx` 用 `next/og` 的 `ImageResponse` 给每篇文章生成专属的 OG 图，逻辑很直白：读一下文章元数据，再 `fetch` 两个自定义字体文件，拼一张图。结果这条路由不管是 `vinext dev` 还是 `vinext start` 都会**间歇性直接把连接掐断**——请求挂起几秒后返回空响应，`stdout`/`stderr` 什么都不打印，连 vinext 自己的请求日志里都不会出现这条记录。

测试了好几个case，
- 单独测"只读 `params`"没问题
- 单独测"只 `fetch` 字体"也没问题
- 单独测"只读文件元数据"还是没问题。
- **但把"同步读文件"和"`await fetch()`"放进同一个动态路由的请求处理函数里，同时出现，就会稳定复现**。
反复测了几次发现，只要这个组合还在，每次都出问题。目前的tradeoff是是把耗时的文件读取挪到模块顶层（服务器进程启动时算一次，而不是每个请求都算一次），加上这条路由本身干脆不再 `fetch` 自定义字体、改用 Satori 默认字体——两个改动加起来大幅降低了失败率，但没能做到 100% 消除，生产环境冷启动后第一个请求偶尔还是会失败一次。这算是migrate过程中发现的一个 vinext 已知问题，值得回头去提个 issue。

## View Transitions 失效

之前的Astro站点用的是 Astro 官方的 `<ViewTransitions />` 组件，点击文章标题时会有一个平滑过渡动画。迁移到 vinext 后，想继续保留这个特性，于是尝试了两种方式：

最开始按 MDN 最简单的方式实现：给文章卡片标题和详情页 `<h1>` 打上同名的 `view-transition-name`，在根 layout 加一条 `<meta name="view-transition" content="same-origin">`——这是浏览器原生的**跨文档（MPA）View Transitions**，理论上不需要任何客户端路由介入，点击普通 `<a>` 标签整页跳转时浏览器就会自动做平滑过渡。写完之后发现：**跳转是瞬间完成的，没有任何动画**。

我一开始怀疑是不是标题里的中文字符导致 `view-transition-name` 不是合法的 CSS 标识符，在name上加了一层 ASCII 过滤和哈希兜底，但动画还是没出现。

然后开始一个一个排查。首先是监听规范里给跨文档过渡专门定义的 `pageswap` 事件，发现事件确实触发了，但 `event.viewTransition` 是 `null`。这就是说浏览器在拿到完整的 opt-in 信息后，明确选择了不发起过渡。开始怀疑是不是测试环境本身对这个新特性支持不完整，换到真实桌面版最新 Chrome 里重新测，结果一样，还是瞬间跳转，`pageswap` 依然是 `null`。而这台机器上 Next.js 官方的 View Transition demo 是能正常工作的。

回头去测原来的 Astro 站点：同样监听 `pageswap`，Astro 那边这个事件**压根没有触发过**。这才想明白 Astro 的 `<ViewTransitions />` 从来就没用过浏览器原生的跨文档导航机制。它是拦截了链接点击，用 `fetch` 把新页面内容取回来，再用**同文档**的 `document.startViewTransition()` 做 DOM 替换，全程伪装成一次"整页跳转"的样子，实际上走的是 SPA 那套机制。同文档 View Transitions 从 Chrome 111 就支持了，覆盖面比跨文档（Chrome 126+ 才有，而且目前只有 Chromium 系支持）宽得多、也更可靠。

搞清楚原理之后重新实现：给文章链接套一层用 `next/link` + 手动接管点击事件的 `PostLink` 组件，点击时调用 `document.startViewTransition()`，回调里触发 `router.push()`。这里又踩了一次坑，`document.startViewTransition` 的回调需要在真正的 DOM 更新完成后才 resolve，但 Next.js 的 `router.push()` 不会返回一个能标识"导航真的落地了"的 Promise。一开始用 `requestAnimationFrame` 猜时机，console 直接报错 `Transition was aborted because of timeout in DOM update`，transition时间没对上，`router.push()` 触发的 RSC 请求还没真正回来。最后的做法是在根 layout 常驻一个组件，用 `usePathname()` 的变化作为"新页面真的渲染完了"的信号，导航发起时把 `resolve` 函数存起来，等路径真正变化了再调用它。这样时机就对了。

顺手去翻了 Next.js 官方的 `next/link` `transitionTypes` 属性和社区（也可以说是官方，乐）的 [`next-view-transitions`](https://github.com/shuding/next-view-transitions) 库的源码对比了一下：Next.js 官方那套完整功能是靠 React 的实验性 `<ViewTransition>` 组件撑起来的，依赖单独打包的 `react-experimental` 分支，配套的 `experimental.viewTransition` 配置项默认还是关闭的；`next-view-transitions` 倒是跟我们最后的实现思路一致。

## 写在最后

这次迁移大部分工作是写法翻译的体力活，就很适合给 AI 做，经过这次的迁移也见识到了Fable的厉害，我预期会需要改很久，实际上one shot的版本就已经是非常可用了，知识在一些细节上还没做好，比如上面提到的一些tw的样式问题，还有view transition没写的问题。vinext 作为一个还在 beta 阶段的项目，这次跑下来大部分场景都是可用的，撞到的问题也基本都能绕过去或者提前预判，对于想在 Cloudflare Workers 上跑 Next.js 应用、又不想被 Vercel 生态绑死的场景，值得关注它后续的进展。

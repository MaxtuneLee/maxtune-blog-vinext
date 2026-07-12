"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { localeFromPathname } from "@/lib/i18n";

export default function Comment() {
  const ref = useRef<HTMLDivElement>(null);
  const lang = localeFromPathname(usePathname());

  useEffect(() => {
    const theme = document.documentElement.getAttribute("data-theme");
    const giscusTheme = theme === "dark" ? "noborder_gray" : "light";

    const script = document.createElement("script");
    const attrs: Record<string, string> = {
      src: "https://giscus.app/client.js",
      "data-repo": "MaxtuneLee/maxtune-blog",
      "data-repo-id": "R_kgDOLJBxxQ",
      "data-category": "Ideas",
      "data-category-id": "DIC_kwDOLJBxxc4CjrTQ",
      "data-mapping": "og:title",
      "data-strict": "0",
      "data-reactions-enabled": "1",
      "data-emit-metadata": "0",
      "data-input-position": "top",
      "data-theme": giscusTheme,
      "data-lang": lang === "en" ? "en" : "zh-CN",
      "data-loading": "lazy",
      crossorigin: "anonymous",
      async: "",
    };

    Object.entries(attrs).forEach(([key, value]) =>
      script.setAttribute(key, value)
    );

    ref.current?.appendChild(script);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <div ref={ref} />;
}

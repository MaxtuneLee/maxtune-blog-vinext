"use client";

import { usePathname } from "next/navigation";
import { getDictionary, localeFromPathname, localizePath, stripLocaleFromPathname } from "@/lib/i18n";

export default function Breadcrumbs() {
  const pathname = usePathname();
  const lang = localeFromPathname(pathname);
  const dict = getDictionary(lang);

  // Remove the locale prefix (if any) and trailing slash
  const currentUrlPath = stripLocaleFromPathname(pathname).replace(/\/+$/, "");

  // Get url array from path
  // eg: /tags/tailwindcss => ['tags', 'tailwindcss']
  const breadcrumbList = currentUrlPath.split("/").slice(1);

  // if breadcrumb is Home > Posts > 1 <etc>
  // replace Posts with Posts (page number)
  if (breadcrumbList[0] === "posts") {
    breadcrumbList.splice(0, 2, dict.breadcrumbs.allPosts(breadcrumbList[1] || "1"));
  }

  // if breadcrumb is Home > Tags > [tag] > [page] <etc>
  // replace [tag] > [page] with [tag] (page number)
  if (breadcrumbList[0] === "tags" && !isNaN(Number(breadcrumbList[2]))) {
    breadcrumbList.splice(
      1,
      3,
      `${breadcrumbList[1]} ${dict.breadcrumbs.tagPage(Number(breadcrumbList[2]))}`
    );
  }

  return (
    <nav
      className="breadcrumb mx-auto mb-1 mt-8 w-full max-w-3xl px-4"
      aria-label="breadcrumb"
    >
      <ul>
        <li>
          <a href={localizePath(lang, "/")} className="capitalize opacity-70 hover:opacity-100">
            {dict.breadcrumbs.home}
          </a>
          <span aria-hidden="true">&raquo;</span>
        </li>
        {breadcrumbList.map((breadcrumb, index) =>
          index + 1 === breadcrumbList.length ? (
            <li key={breadcrumb}>
              <span
                className={`opacity-70 ${index > 0 ? "lowercase" : "capitalize"}`}
                aria-current="page"
              >
                {decodeURIComponent(breadcrumb)}
              </span>
            </li>
          ) : (
            <li key={breadcrumb}>
              <a
                href={localizePath(lang, `/${breadcrumb}`)}
                className="capitalize opacity-70 hover:opacity-100"
              >
                {breadcrumb}
              </a>
              <span aria-hidden="true">&raquo;</span>
            </li>
          )
        )}
      </ul>
    </nav>
  );
}

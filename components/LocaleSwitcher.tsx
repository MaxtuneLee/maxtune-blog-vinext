"use client";

import { usePathname } from "next/navigation";
import { locales, localeNames, localeFromPathname, stripLocaleFromPathname, localizePath } from "@/lib/i18n";

// A post detail page (/posts/<slug>, slug non-numeric) may not have a
// translation at the same slug in the other locale — we can't check that
// from the client, so switching language from one falls back to the posts
// index rather than risking a 404. Every other route exists in both locales
// unconditionally, so the exact path carries over.
function isUncertainPostSlug(localPath: string): boolean {
  const match = localPath.match(/^\/posts\/([^/]+)$/);
  return !!match && isNaN(Number(match[1]));
}

export default function LocaleSwitcher() {
  const pathname = usePathname();
  const current = localeFromPathname(pathname);
  const localPath = stripLocaleFromPathname(pathname);
  const fallbackPath = isUncertainPostSlug(localPath) ? "/posts" : localPath;

  return (
    <div className="locale-switcher flex items-center gap-3 text-sm">
      {locales.map(lang => (
        <a
          key={lang}
          href={localizePath(lang, lang === current ? localPath : fallbackPath)}
          className={
            lang === current
              ? "font-semibold text-skin-accent"
              : "opacity-70 hover:opacity-100"
          }
          aria-current={lang === current ? "true" : undefined}
        >
          {localeNames[lang]}
        </a>
      ))}
    </div>
  );
}

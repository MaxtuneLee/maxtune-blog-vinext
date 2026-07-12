export type Locale = "zh" | "en";

export const locales: Locale[] = ["zh", "en"];
export const defaultLocale: Locale = "zh";

export const localeNames: Record<Locale, string> = {
  zh: "中文",
  en: "English",
};

export const langTags: Record<Locale, string[]> = {
  zh: ["zh-CN"],
  en: ["en-US"],
};

// zh (default) is served unprefixed; every other locale gets a /<lang> prefix.
// ponytail: hardcoded 2-locale assumption below (proxy.ts mirrors this); if a
// third locale is added, generalize both to locales.filter(l => l !== defaultLocale).
export function localizePath(lang: Locale, path: string): string {
  if (lang === defaultLocale) return path;
  return path === "/" ? `/${lang}` : `/${lang}${path}`;
}

export function localeFromPathname(pathname: string): Locale {
  const seg = pathname.split("/")[1];
  return (locales as string[]).includes(seg) ? (seg as Locale) : defaultLocale;
}

// Strips the /<lang> prefix (if any) from a pathname, e.g. "/en/posts" -> "/posts".
export function stripLocaleFromPathname(pathname: string): string {
  const lang = localeFromPathname(pathname);
  if (lang === defaultLocale) return pathname;
  return pathname.slice(lang.length + 1) || "/";
}

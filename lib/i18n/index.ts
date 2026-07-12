import { zh } from "./dictionaries/zh";
import { en } from "./dictionaries/en";
import type { Locale } from "./locales";

export * from "./locales";
export type Dictionary = typeof zh;

const dictionaries: Record<Locale, Dictionary> = { zh, en };

export function getDictionary(lang: Locale): Dictionary {
  return dictionaries[lang];
}

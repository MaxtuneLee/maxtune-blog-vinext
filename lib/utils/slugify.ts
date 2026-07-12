import { slug as slugger } from "github-slugger";

export const slugifyStr = (str: string) => slugger(str);

export const slugifyAll = (arr: string[]) => arr.map(str => slugifyStr(str));

// CSS view-transition-name must be a valid ASCII custom-ident. Titles here are
// often Chinese, so strip down to letters/digits/hyphens; if that leaves
// nothing (an all-Chinese title), fall back to a stable hash of the original
// string so different titles still get distinct, non-empty names.
export function toViewTransitionName(str: string): string {
  const ascii = str
    .replace(/[^a-zA-Z0-9-]/g, "")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
  if (ascii) return `vt-${ascii}`;

  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash * 31 + str.charCodeAt(i)) >>> 0;
  }
  return `vt-${hash.toString(36)}`;
}

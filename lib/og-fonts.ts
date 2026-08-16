const FONT_BASE = "https://maxtuneblog.oss-cn-shenzhen.aliyuncs.com/fonts/og";

export const OG_FONT_CACHE_KEY = FONT_BASE;

let fontsPromise: Promise<{ regular: ArrayBuffer; bold: ArrayBuffer }> | null = null;

/** Downloads the large CJK fonts at most once per server process. */
export function loadOgFonts() {
  if (!fontsPromise) {
    fontsPromise = Promise.all([
      fetch(`${FONT_BASE}/SarasaUiSC-LightItalic.ttf`).then(response => response.arrayBuffer()),
      fetch(`${FONT_BASE}/SarasaUiSC-SemiBoldItalic.ttf`).then(response => response.arrayBuffer()),
    ]).then(([regular, bold]) => ({ regular, bold }));
  }
  return fontsPromise;
}

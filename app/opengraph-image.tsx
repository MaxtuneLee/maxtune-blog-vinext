import { ImageResponse } from "next/og";
import { SITE } from "@/lib/config";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const FONT_BASE = "https://maxtuneblog.oss-cn-shenzhen.aliyuncs.com/fonts/og";

// ponytail: fetched once per server process instead of once per request.
let fontsPromise: Promise<{ regular: ArrayBuffer; bold: ArrayBuffer }> | null = null;

function loadFonts() {
  if (!fontsPromise) {
    fontsPromise = Promise.all([
      fetch(`${FONT_BASE}/SarasaUiSC-LightItalic.ttf`).then(r => r.arrayBuffer()),
      fetch(`${FONT_BASE}/SarasaUiSC-SemiBoldItalic.ttf`).then(r => r.arrayBuffer()),
    ]).then(([regular, bold]) => ({ regular, bold }));
  }
  return fontsPromise;
}

export default async function Image() {
  const { regular, bold } = await loadFonts();

  return new ImageResponse(
    (
      <div
        style={{
          position: "relative",
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#fefbfb",
          fontFamily: "Sarasa UI SC",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: "2.5rem",
            right: "2.5rem",
            width: "88%",
            height: "80%",
            border: "4px solid black",
            background: "#ecebeb",
            opacity: 0.9,
            borderRadius: 4,
          }}
        />
        <div
          style={{
            display: "flex",
            margin: "2rem",
            width: "88%",
            height: "80%",
            border: "4px solid black",
            background: "#fefbfb",
            borderRadius: 4,
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              margin: 20,
              width: "90%",
              height: "90%",
              textAlign: "center",
            }}
          >
            <div style={{ fontSize: 72, fontWeight: 700 }}>{SITE.title}</div>
            <div style={{ fontSize: 28 }}>{SITE.desc}</div>
          </div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "Sarasa UI SC", data: regular, weight: 400, style: "normal" },
        { name: "Sarasa UI SC", data: bold, weight: 700, style: "normal" },
      ],
    }
  );
}

import Script from "next/script";

export default function Analytics() {
  return (
    <Script
      strategy="afterInteractive"
      src="https://analytics.mxte.cc/script.js"
      data-website-id="b68f22f0-ca65-43fd-92e3-4c6329d3c2ba"
    />
  );
}

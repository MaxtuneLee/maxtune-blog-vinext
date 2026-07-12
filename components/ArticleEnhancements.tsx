"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { getDictionary, localeFromPathname } from "@/lib/i18n";

function addHeadingLinks() {
  const headings = document.querySelectorAll<HTMLElement>(
    "#article h2, #article h3, #article h4, #article h5, #article h6"
  );
  headings.forEach(heading => {
    heading.classList.add("group");
    const link = document.createElement("a");
    link.innerText = "#";
    link.className = "heading-link hidden group-hover:inline-block ml-2";
    link.href = "#" + heading.id;
    link.ariaHidden = "true";
    heading.appendChild(link);
  });
}

function attachCopyButtons(dict: ReturnType<typeof getDictionary>) {
  const copyButtonLabel = dict.article.copy;
  const codeBlocks = document.querySelectorAll<HTMLPreElement>("#article pre");

  codeBlocks.forEach(codeBlock => {
    const wrapper = document.createElement("div");
    wrapper.style.position = "relative";

    const copyButton = document.createElement("button");
    copyButton.className =
      "copy-code absolute right-3 -top-3 rounded bg-skin-card px-2 py-1 text-xs leading-4 text-skin-base font-medium";
    copyButton.innerHTML = copyButtonLabel;
    codeBlock.setAttribute("tabindex", "0");
    codeBlock.appendChild(copyButton);

    codeBlock.parentNode?.insertBefore(wrapper, codeBlock);
    wrapper.appendChild(codeBlock);

    copyButton.addEventListener("click", async () => {
      const code = codeBlock.querySelector("code");
      const text = code?.innerText ?? "";
      await navigator.clipboard.writeText(text);

      copyButton.innerText = dict.article.copied;
      setTimeout(() => {
        copyButton.innerText = copyButtonLabel;
      }, 700);
    });
  });
}

export default function ArticleEnhancements() {
  const dict = getDictionary(localeFromPathname(usePathname()));

  useEffect(() => {
    addHeadingLinks();
    attachCopyButtons(dict);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
}

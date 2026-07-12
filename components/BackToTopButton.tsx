"use client";

import { usePathname } from "next/navigation";
import { getDictionary, localeFromPathname } from "@/lib/i18n";

export default function BackToTopButton() {
  const dict = getDictionary(localeFromPathname(usePathname()));

  const handleClick = () => {
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
  };

  return (
    <button
      className="focus-outline whitespace-nowrap py-1 hover:opacity-75"
      onClick={handleClick}
    >
      <svg xmlns="http://www.w3.org/2000/svg" className="rotate-90">
        <path d="M13.293 6.293 7.586 12l5.707 5.707 1.414-1.414L10.414 12l4.293-4.293z"></path>
      </svg>
      <span>{dict.backToTop.label}</span>
    </button>
  );
}

"use client";

import { useRouter } from "next/navigation";
import { navigateWithViewTransition } from "./ViewTransitionRouter";

export default function BackButton() {
  const router = useRouter();

  const handleClick = () => {
    if (history.length === 1) {
      window.location.href = "/";
    } else {
      navigateWithViewTransition(() => router.back());
    }
  };

  return (
    <button
      className="focus-outline mb-2 mt-8 flex items-center hover:opacity-75"
      onClick={handleClick}
    >
      <svg xmlns="http://www.w3.org/2000/svg">
        <path d="M13.293 6.293 7.586 12l5.707 5.707 1.414-1.414L10.414 12l4.293-4.293z"></path>
      </svg>
      <span>返回</span>
    </button>
  );
}

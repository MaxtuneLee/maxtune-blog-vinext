"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { navigateWithViewTransition } from "./ViewTransitionRouter";

type Props = {
  href: string;
  className?: string;
  headingTag: "h2" | "h3";
  headingClassName: string;
  headingStyle: React.CSSProperties;
  children: React.ReactNode;
};

// Astro's <ViewTransitions/> never used the browser's native cross-document
// navigation (that CSS-Level-2 API turns out to be unreliable even in an
// up-to-date desktop Chrome — see MIGRATION_NOTES.md). It intercepted the
// click and did a same-document transition instead, which has been
// supported since Chrome 111. This replicates that: a real <Link> (so it
// still works with JS disabled / unsupported browsers), but on click we
// take over navigation and wrap it in document.startViewTransition so the
// matching view-transition-name on the heading below morphs into the h1 on
// the post page.
export default function PostLink({
  href,
  className,
  headingTag: Heading,
  headingClassName,
  headingStyle,
  children,
}: Props) {
  const router = useRouter();

  function handleClick(e: React.MouseEvent<HTMLAnchorElement>) {
    if (!document.startViewTransition) return;
    e.preventDefault();
    navigateWithViewTransition(() => router.push(href));
  }

  return (
    <Link href={href} className={className} onClick={handleClick}>
      <Heading className={headingClassName} style={headingStyle}>
        {children}
      </Heading>
    </Link>
  );
}

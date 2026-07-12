"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

let pendingResolve: (() => void) | null = null;

// Wraps a router.push()-style navigation in document.startViewTransition.
// The tricky part: startViewTransition needs to know when the DOM update is
// actually done, but router.push() doesn't return a promise for that — it's
// an async RSC fetch. Resolving too early (e.g. after a requestAnimationFrame
// or two) races the real navigation and Chrome aborts with "timeout in DOM
// update" once it notices nothing actually changed yet. So instead we stash
// the resolve() and let ViewTransitionRouteWatcher (mounted once, in the
// root layout, so it survives the navigation) call it once usePathname()
// actually changes — that only happens after Next.js has committed the new
// route's content.
export function navigateWithViewTransition(push: () => void) {
  if (!document.startViewTransition) {
    push();
    return;
  }
  document.startViewTransition(
    () =>
      new Promise<void>(resolve => {
        pendingResolve = resolve;
        push();
      })
  );
}

export function ViewTransitionRouteWatcher() {
  const pathname = usePathname();

  useEffect(() => {
    if (pendingResolve) {
      const resolve = pendingResolve;
      pendingResolve = null;
      resolve();
    }
  }, [pathname]);

  return null;
}

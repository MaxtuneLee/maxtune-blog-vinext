"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import Hr from "./Hr";
import LinkButton from "./LinkButton";
import LocaleSwitcher from "./LocaleSwitcher";
import { SITE, LOGO_IMAGE } from "@/lib/config";
import { getDictionary, localeFromPathname, localizePath, stripLocaleFromPathname } from "@/lib/i18n";

export default function Header() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  const lang = localeFromPathname(pathname);
  const dict = getDictionary(lang);
  const localPath = stripLocaleFromPathname(pathname);

  const activeNav = localPath.startsWith("/posts")
    ? "posts"
    : localPath.startsWith("/tags")
      ? "tags"
      : localPath.startsWith("/about")
        ? "about"
        : localPath.startsWith("/search")
          ? "search"
          : localPath.startsWith("/friends")
            ? "friends"
            : undefined;

  return (
    <header>
      <a
        id="skip-to-content"
        href="#main-content"
        className="absolute -top-full left-16 z-50 bg-skin-accent px-3 py-2 text-skin-inverted transition-all focus:top-4"
      >
        Skip to content
      </a>
      <div className="nav-container mx-auto flex max-w-3xl flex-col items-center justify-between sm:flex-row">
        <div
          className={`top-nav-wrap relative grid w-full overflow-hidden p-4 transition-all duration-200 ease-out sm:grid-cols-2 sm:grid-rows-1 sm:items-center sm:py-8 ${menuOpen ? "h-auto grid-rows-[0fr_1fr]" : "grid-rows-[0fr_0fr]"}`}
        >
          <div className="flex w-full justify-between">
            <a
              href={localizePath(lang, "/")}
              className="logo whitespace-nowrap py-1 text-xl font-semibold sm:static sm:text-2xl"
            >
              {LOGO_IMAGE.enable ? (
                <img
                  src={`/assets/${LOGO_IMAGE.svg ? "logo.svg" : "logo.png"}`}
                  alt={SITE.title}
                  width={LOGO_IMAGE.width}
                  height={LOGO_IMAGE.height}
                />
              ) : (
                SITE.title
              )}
            </a>
            <button
              className="hamburger-menu focus-outline self-end p-2 sm:hidden"
              aria-label={menuOpen ? "Close Menu" : "Open Menu"}
              aria-expanded={menuOpen}
              aria-controls="menu-items"
              onClick={() => setMenuOpen(prev => !prev)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={1.5}
                strokeLinecap="round"
                strokeLinejoin="round"
                className={`menu-icon${menuOpen ? " is-active" : ""}`}
              >
                <line
                  x1={7}
                  y1={12}
                  x2={21}
                  y2={12}
                  className={`line transition-opacity duration-75 ease-in-out ${menuOpen ? "opacity-0" : ""}`}
                />
                <line
                  x1={3}
                  y1={6}
                  x2={21}
                  y2={6}
                  className={`line transition-opacity duration-75 ease-in-out ${menuOpen ? "opacity-0" : ""}`}
                />
                <line
                  x1={12}
                  y1={18}
                  x2={21}
                  y2={18}
                  className={`line transition-opacity duration-75 ease-in-out ${menuOpen ? "opacity-0" : ""}`}
                />
                <line
                  x1={18}
                  y1={6}
                  x2={6}
                  y2={18}
                  className={`close transition-opacity duration-75 ease-in-out ${menuOpen ? "opacity-100" : "opacity-0"}`}
                />
                <line
                  x1={6}
                  y1={6}
                  x2={18}
                  y2={18}
                  className={`close transition-opacity duration-75 ease-in-out ${menuOpen ? "opacity-100" : "opacity-0"}`}
                />
              </svg>
            </button>
          </div>
          <nav
            id="nav-menu"
            className="w-full flex-row justify-center sm:justify-end sm:space-x-4 sm:py-0 md:justify-end"
            style={{ minHeight: 0 }}
          >
            <ul
              id="menu-items"
              className="mx-auto mt-4 grid h-min w-44 grid-cols-2 grid-rows-4 gap-x-2 gap-y-2 sm:mx-0 sm:mt-0 sm:flex sm:w-auto sm:gap-x-5 sm:gap-y-0"
            >
              <li className="col-span-2 flex items-center justify-center">
                <a
                  href={localizePath(lang, "/posts")}
                  className={`w-full px-4 py-3 text-center font-medium hover:text-skin-accent sm:my-0 sm:px-2 sm:py-1${activeNav === "posts" ? " underline decoration-wavy decoration-2 underline-offset-4" : ""}`}
                >
                  {dict.nav.posts}
                </a>
              </li>
              <li className="col-span-2 flex items-center justify-center">
                <a
                  href={localizePath(lang, "/about")}
                  className={`w-full px-4 py-3 text-center font-medium hover:text-skin-accent sm:my-0 sm:px-2 sm:py-1${activeNav === "about" ? " underline decoration-wavy decoration-2 underline-offset-4" : ""}`}
                >
                  {dict.nav.about}
                </a>
              </li>
              <li className="col-span-2 flex items-center justify-center">
                <a
                  href={localizePath(lang, "/friends")}
                  className={`w-full px-4 py-3 text-center font-medium hover:text-skin-accent sm:my-0 sm:px-2 sm:py-1${activeNav === "friends" ? " underline decoration-wavy decoration-2 underline-offset-4" : ""}`}
                >
                  {dict.nav.friends}
                </a>
              </li>
              <li className="col-span-2 flex items-center justify-center">
                <a
                  href="https://gallery.mxte.cc"
                  className="w-full px-4 py-3 text-center font-medium hover:text-skin-accent sm:my-0 sm:px-2 sm:py-1"
                >
                  {dict.nav.gallery}
                </a>
              </li>
              <li className="col-span-1 flex items-center justify-center">
                <LinkButton
                  href={localizePath(lang, "/search")}
                  className={`focus-outline flex p-3 sm:p-1${activeNav === "search" ? " underline decoration-wavy decoration-2 underline-offset-4" : ""}`}
                  ariaLabel="search"
                  title="Search"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="scale-125 sm:scale-100"
                  >
                    <path d="M19.023 16.977a35.13 35.13 0 0 1-1.367-1.384c-.372-.378-.596-.653-.596-.653l-2.8-1.337A6.962 6.962 0 0 0 16 9c0-3.859-3.14-7-7-7S2 5.141 2 9s3.14 7 7 7c1.763 0 3.37-.66 4.603-1.739l1.337 2.8s.275.224.653.596c.387.363.896.854 1.384 1.367l1.358 1.392.604.646 2.121-2.121-.646-.604c-.379-.372-.885-.866-1.391-1.36zM9 14c-2.757 0-5-2.243-5-5s2.243-5 5-5 5 2.243 5 5-2.243 5-5 5z" />
                  </svg>
                  <span className="sr-only">Search</span>
                </LinkButton>
              </li>
              {SITE.lightAndDarkMode && (
                <li className="col-span-1 flex items-center justify-center">
                  <button
                    id="theme-btn"
                    className="focus-outline p-3 sm:p-1"
                    title="Toggles light & dark"
                    aria-label="auto"
                    aria-live="polite"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      id="moon-svg"
                      className="scale-125 hover:rotate-12 sm:scale-100"
                    >
                      <path d="M20.742 13.045a8.088 8.088 0 0 1-2.077.271c-2.135 0-4.14-.83-5.646-2.336a8.025 8.025 0 0 1-2.064-7.723A1 1 0 0 0 9.73 2.034a10.014 10.014 0 0 0-4.489 2.582c-3.898 3.898-3.898 10.243 0 14.143a9.937 9.937 0 0 0 7.072 2.93 9.93 9.93 0 0 0 7.07-2.929 10.007 10.007 0 0 0 2.583-4.491 1.001 1.001 0 0 0-1.224-1.224zm-2.772 4.301a7.947 7.947 0 0 1-5.656 2.343 7.953 7.953 0 0 1-5.658-2.344c-3.118-3.119-3.118-8.195 0-11.314a7.923 7.923 0 0 1 2.06-1.483 10.027 10.027 0 0 0 2.89 7.848 9.972 9.972 0 0 0 7.848 2.891 8.036 8.036 0 0 1-1.484 2.059z" />
                    </svg>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      id="sun-svg"
                      className="scale-125 hover:rotate-12 sm:scale-100"
                    >
                      <path d="M6.993 12c0 2.761 2.246 5.007 5.007 5.007s5.007-2.246 5.007-5.007S14.761 6.993 12 6.993 6.993 9.239 6.993 12zM12 8.993c1.658 0 3.007 1.349 3.007 3.007S13.658 15.007 12 15.007 8.993 13.658 8.993 12 10.342 8.993 12 8.993zM10.998 19h2v3h-2zm0-17h2v3h-2zm-9 9h3v2h-3zm17 0h3v2h-3zM4.219 18.363l2.12-2.122 1.415 1.414-2.12 2.122zM16.24 6.344l2.122-2.122 1.414 1.414-2.122 2.122zM6.342 7.759 4.22 5.637l1.415-1.414 2.12 2.122zm13.434 10.605-1.414 1.414-2.122-2.122 1.414-1.414z" />
                    </svg>
                  </button>
                </li>
              )}
              <li className="col-span-2 flex items-center justify-center">
                <LocaleSwitcher />
              </li>
            </ul>
          </nav>
        </div>
      </div>
      <Hr />
    </header>
  );
}

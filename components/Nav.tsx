"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { nav, site } from "@/content/site";

/**
 * The sticky header. It is transparent over the hero and gains a blurred,
 * darkened background once you scroll — so it never fights with the content
 * behind it.
 */
export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-40 border-b transition-colors duration-300 ${
        scrolled
          ? "border-line bg-ink/80 backdrop-blur-md"
          : "border-transparent bg-transparent"
      }`}
    >
      <div className="mx-auto flex max-w-[1440px] items-center justify-between px-6 py-5 md:px-12 lg:px-24">
        {/* Wordmark */}
        <Link href="/" className="flex items-center gap-3">
          <span className="flex h-[34px] w-[34px] items-center justify-center rounded-lg border border-accent/50 font-mono text-[13px] text-accent">
            {site.monogram}
          </span>
          <span className="hidden font-mono text-[13px] text-dim sm:inline">
            {site.wordmark}
          </span>
        </Link>

        {/* Desktop links */}
        <nav className="hidden items-center gap-9 font-mono text-[13px] md:flex">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-[#B8C0D0] transition-colors hover:text-accent"
            >
              {item.label}
            </Link>
          ))}
          <a
            href={site.resumeHref}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-md bg-accent px-4 py-2.5 font-medium text-ink transition-opacity hover:opacity-90"

          >
            Resume 
          </a>
        </nav>

        {/* Mobile: résumé button + hamburger */}
        <div className="flex items-center gap-4 md:hidden">
          <a
            href={site.resumeHref}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-md bg-accent px-4 py-2.5 font-medium text-ink transition-opacity hover:opacity-90"
          >
            Résumé ↓
          </a>
          <button
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            className="flex h-11 w-11 items-center justify-center"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
              {open ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile menu panel */}
      {open && (
        <nav className="border-t border-line bg-ink/95 px-6 py-4 backdrop-blur-md md:hidden">
          <ul className="flex flex-col">
            {nav.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="block py-3 font-mono text-sm text-[#B8C0D0]"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  );
}

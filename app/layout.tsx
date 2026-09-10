import type { Metadata } from "next";
import { site } from "@/content/site";
import "./globals.css";

/**
 * Metadata is what search engines and link previews (WhatsApp, LinkedIn,
 * Slack) read. Next.js turns this object into <meta> tags for you.
 */
export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: site.title,
  description: site.intro,
  openGraph: {
    title: site.title,
    description: site.intro,
    url: site.url,
    siteName: site.name,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: site.title,
    description: site.intro,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        {/* Fonts. preconnect makes them start downloading a little sooner. */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Manrope:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-ink text-body antialiased">
        {/* Lets keyboard users jump past the nav. Invisible until focused. */}
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-accent focus:px-4 focus:py-2 focus:font-medium focus:text-ink"
        >
          Skip to content
        </a>
        {children}
      </body>
    </html>
  );
}

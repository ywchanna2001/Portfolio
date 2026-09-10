import { site } from "@/content/site";
import Reveal from "./Reveal";

/** The closing contact block and footer. */
export default function Contact() {
  return (
    <footer
      id="contact"
      className="mt-32 scroll-mt-24 border-t border-line bg-gradient-to-b from-accent/4 to-transparent"
    >
      <div className="mx-auto max-w-[1440px] px-6 py-24 md:px-12 lg:px-24">
        <Reveal>
          <div className="flex flex-col gap-6">
            <span className="eyebrow uppercase">07 — Contact</span>

            <h2 className="max-w-[16ch] font-display text-[clamp(2.5rem,6vw,4.5rem)] font-normal leading-[1.02] text-bright">
              {site.contactHeading.lead}{" "}
              <span className="italic text-accent">{site.contactHeading.emphasis}</span>
            </h2>

            <p className="text-lg text-muted">{site.contactSub}</p>

            <a
              href={`mailto:${site.email}`}
              className="w-fit font-mono text-lg text-body underline decoration-accent/40 underline-offset-4 transition-colors hover:text-accent md:text-xl"
            >
              {site.email}
            </a>

            <div className="flex flex-wrap gap-x-6 gap-y-2 font-mono text-sm">
              {site.links.map((l) => (
                <a
                  key={l.label}
                  href={l.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#B8C0D0] transition-colors hover:text-accent"
                >
                  {l.label} ↗
                </a>
              ))}
            </div>
          </div>
        </Reveal>

        <div className="mt-20 flex flex-col gap-2 border-t border-line pt-8 font-mono text-xs text-faint sm:flex-row sm:justify-between">
          <span>
            © {new Date().getFullYear()} {site.name}
          </span>
          <span>{site.colophon}</span>
        </div>
      </div>
    </footer>
  );
}

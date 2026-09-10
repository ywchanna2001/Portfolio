import Reveal from "./Reveal";

/**
 * The standard section wrapper: consistent max width, padding, and the
 * numbered eyebrow + serif heading pattern used throughout the site.
 */
export default function Section({
  id,
  eyebrow,
  heading,
  aside,
  children,
  className = "",
}: {
  id?: string;
  eyebrow: string;
  /** Rendered in the display serif. */
  heading: React.ReactNode;
  /** Optional supporting line, shown on the right on wide screens. */
  aside?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section
      id={id}
      className={`mx-auto max-w-[1440px] scroll-mt-24 px-6 pt-24 md:px-12 lg:px-24 lg:pt-28 ${className}`}
    >
      <Reveal>
        <div className="mb-10 flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
          <div className="flex flex-col gap-2.5">
            <span className="eyebrow uppercase">{eyebrow}</span>
            <h2 className="font-display text-[clamp(2rem,4vw,3rem)] font-normal leading-tight text-bright">
              {heading}
            </h2>
          </div>
          {aside && <p className="max-w-md text-[15px] text-dim">{aside}</p>}
        </div>
      </Reveal>
      {children}
    </section>
  );
}
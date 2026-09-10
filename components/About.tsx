import { site } from "@/content/site";
import Reveal from "./Reveal";

/** The About section — your professional profile, in full. */
export default function About() {
  return (
    <section id="about" className="mx-auto max-w-[1440px] scroll-mt-24 px-6 pt-24 md:px-12 lg:px-24 lg:pt-28">
      <div className="grid gap-10 lg:grid-cols-3 lg:gap-12">
        <Reveal>
          <div className="flex flex-col gap-2.5">
            <span className="eyebrow uppercase">01 — About</span>
            <h2 className="font-display text-[clamp(2rem,4vw,3rem)] font-normal leading-[1.05] text-bright">
              A bit more detail.
            </h2>
          </div>
        </Reveal>

        <Reveal delay={80} className="lg:col-span-2">
          <p className="max-w-[820px] hyphens-auto text-justify text-[clamp(1.0625rem,1.5vw,1.25rem)] leading-[1.7] text-[#B8C0D0]">
            {site.about}
          </p>
        </Reveal>
      </div>
    </section>
  );
}
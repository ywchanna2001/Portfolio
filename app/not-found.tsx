import Link from "next/link";
import Nav from "@/components/Nav";

export default function NotFound() {
  return (
    <>
      <Nav />
      <main className="mx-auto flex min-h-[60vh] max-w-[1440px] flex-col items-start justify-center gap-6 px-6 md:px-12 lg:px-24">
        <span className="eyebrow uppercase">404</span>
        <h1 className="font-display text-[clamp(2.5rem,6vw,4rem)] font-normal leading-tight text-bright">
          That page folded into a conformation I can&rsquo;t predict.
        </h1>
        <Link
          href="/"
          className="rounded-lg bg-accent px-6 py-3.5 font-semibold text-ink transition-opacity hover:opacity-90"
        >
          Back to the start
        </Link>
      </main>
    </>
  );
}

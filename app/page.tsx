import About from "@/components/About";
import AskWidget from "@/components/AskWidget";
import Contact from "@/components/Contact";
import Education from "@/components/Education";
import Experience from "@/components/Experience";
import Hero from "@/components/Hero";
import Nav from "@/components/Nav";
import Research from "@/components/Research";
import Skills from "@/components/Skills";
import Work from "@/components/Work";

/**
 * The home page. Each section is its own component in /components, and each
 * reads its text from /content — so to change what the page says, you edit a
 * content file, not this one.
 *
 * To reorder the page, move the lines below. If you do, also renumber the
 * eyebrow labels ("01 — About", "02 — Education", …) inside each component,
 * and reorder `nav` in content/site.ts to match.
 */
export default function HomePage() {
  return (
    <>
      <Nav />
      <main id="main">
        <Hero />
        <About />
        <Education />
        <Skills />
        <Work />
        <Research />
        <Experience />
      </main>
      <Contact />
      <AskWidget />
    </>
  );
}
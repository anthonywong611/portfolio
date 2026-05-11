import { Navbar } from "@/components/navbar";
import { Hero } from "@/components/hero";
import { ExperienceTimeline } from "@/components/experience-timeline";

export default function Home() {
  return (
    <>
      <Navbar />
      <main id="main-content" className="pt-16">
        <Hero />
        <ExperienceTimeline />
      </main>
    </>
  );
}

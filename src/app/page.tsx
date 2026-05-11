import { Navbar } from "@/components/navbar";
import { Hero } from "@/components/hero";
import { ExperienceTimeline } from "@/components/experience-timeline";
import { ProjectsSection } from "@/components/projects-section";

export default function Home() {
  return (
    <>
      <Navbar />
      <main id="main-content" className="pt-16">
        <Hero />
        <ExperienceTimeline />
        <ProjectsSection />
      </main>
    </>
  );
}

import { Navbar } from "@/components/navbar";
import { Hero } from "@/components/hero";
import { ExperienceTimeline } from "@/components/experience-timeline";
import { EducationSection } from "@/components/education-section";
import { ProjectsSection } from "@/components/projects-section";
import { BlogPreview } from "@/components/blog-preview";
import { ContactForm } from "@/components/contact-form";
import { Footer } from "@/components/footer";
import { getAllPosts } from "@/lib/mdx";

export default function Home() {
  const posts = getAllPosts();

  return (
    <>
      <Navbar />
      <main id="main-content" className="pt-16">
        <Hero />
        <ExperienceTimeline />
        <EducationSection />
        <ProjectsSection />
        <BlogPreview posts={posts} />
        <ContactForm />
      </main>
      <Footer />
    </>
  );
}

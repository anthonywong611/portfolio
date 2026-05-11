import { projects } from "@/data/projects";
import { ProjectCard } from "@/components/project-card";

export function ProjectsSection() {
  return (
    <section id="projects" className="px-4 py-24 md:px-8">
      <div className="mx-auto max-w-5xl">
        <h2 className="mb-10 font-bold text-foreground">Projects</h2>
        <div className="grid gap-6 md:grid-cols-2">
          {projects.map((project) => (
            <ProjectCard key={project.slug} project={project} />
          ))}
        </div>
      </div>
    </section>
  );
}

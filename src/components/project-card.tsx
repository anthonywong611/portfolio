import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { FaGithub } from "react-icons/fa";
import { Project } from "@/types";

export function ProjectCard({ project }: { project: Project }) {
  return (
    <div className="group rounded-2xl border border-border bg-card p-6 transition-all hover:-translate-y-1 hover:border-accent/50 hover:shadow-lg">
      {/* Screenshot */}
      <Link href={`/projects/${project.slug}`}>
        <div className="mb-4 h-[140px] overflow-hidden rounded-lg bg-muted">
          <div className="flex h-full w-full items-center justify-center text-muted-foreground">
            Screenshot
          </div>
        </div>
      </Link>

      {/* Title */}
      <Link href={`/projects/${project.slug}`}>
        <h3 className="mb-2 text-lg font-semibold text-foreground transition-colors group-hover:text-accent">
          {project.title}
        </h3>
      </Link>

      {/* Summary */}
      <p className="mb-3 text-sm text-muted-foreground">{project.summary}</p>

      {/* Tech stack */}
      <div className="mb-4 flex flex-wrap gap-1.5">
        {project.techStack.map((tech) => (
          <span
            key={tech}
            className="rounded bg-accent-muted px-2 py-0.5 text-xs text-accent"
          >
            {tech}
          </span>
        ))}
      </div>

      {/* Links */}
      <div className="flex gap-4">
        {project.githubUrl && (
          <a
            href={project.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <FaGithub className="h-3.5 w-3.5" />
            Code
          </a>
        )}
        {project.liveUrl && (
          <a
            href={project.liveUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <ExternalLink className="h-3.5 w-3.5" />
            Live Demo
          </a>
        )}
      </div>
    </div>
  );
}

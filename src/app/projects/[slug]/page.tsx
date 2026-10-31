import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { FaGithub } from "react-icons/fa";
import { projects } from "@/data/projects";
import { ProjectImage } from "@/components/project-image";

type Props = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug);
  if (!project) return {};

  return {
    title: project.title,
    description: project.summary,
    openGraph: {
      title: project.title,
      description: project.summary,
    },
  };
}

export default async function ProjectDetailPage({ params }: Props) {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug);

  if (!project) notFound();

  return (
    <div className="mx-auto max-w-3xl px-4 py-24 md:px-8">
      <Link
        href="/#projects"
        className="mb-8 inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to projects
      </Link>

      {/* Hero image: opens full size in a new tab, since diagrams are dense */}
      {project.image ? (
        <a
          href={project.image}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Open the full-size ${project.title} image in a new tab`}
          className="mb-8 block rounded-2xl focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        >
          <ProjectImage
            project={project}
            className="h-[240px] rounded-2xl border border-border md:h-[320px]"
            sizes="(min-width: 768px) 704px, 92vw"
            preload
          />
        </a>
      ) : (
        <ProjectImage
          project={project}
          className="mb-8 h-[240px] rounded-2xl border border-border text-lg md:h-[320px]"
          sizes="(min-width: 768px) 704px, 92vw"
          placeholderLabel="Project Screenshot"
        />
      )}

      <h1 className="mb-3 font-bold text-foreground">{project.title}</h1>
      <p className="mb-4 text-lg text-muted-foreground">{project.summary}</p>

      {/* Tech stack */}
      <div className="mb-6 flex flex-wrap gap-2">
        {project.techStack.map((tech) => (
          <span
            key={tech}
            className="rounded bg-accent-muted px-3 py-1 text-sm text-accent"
          >
            {tech}
          </span>
        ))}
      </div>

      {/* Links */}
      <div className="mb-8 flex gap-4">
        {project.githubUrl && (
          <a
            href={project.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-4 py-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <FaGithub className="h-4 w-4" />
            View Code
          </a>
        )}
        {project.liveUrl && (
          <a
            href={project.liveUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-lg bg-accent px-4 py-2 text-sm font-medium text-accent-foreground transition-colors hover:bg-accent/90"
          >
            <ExternalLink className="h-4 w-4" />
            Live Demo
          </a>
        )}
      </div>

      {/* Description */}
      <div className="prose max-w-none text-muted-foreground">
        <p>{project.description}</p>
      </div>
    </div>
  );
}

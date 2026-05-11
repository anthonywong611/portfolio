import { Project } from "@/types";

export const projects: Project[] = [
  {
    slug: "streaming-pipeline",
    title: "Real-Time Streaming Pipeline",
    summary:
      "Event-driven data pipeline processing 50K+ events/sec with exactly-once delivery guarantees.",
    description:
      "A production data pipeline built with Apache Kafka and Python that processes real-time event streams from multiple sources. Features exactly-once delivery semantics, dead letter queues for failed messages, and a monitoring dashboard built with Grafana. Reduced data latency from 4 hours to under 30 seconds for downstream analytics consumers.",
    image: "/images/projects/streaming-pipeline.png",
    techStack: ["Python", "Apache Kafka", "Docker", "Grafana", "PostgreSQL"],
    githubUrl: "https://github.com/anthonywong",
    liveUrl: undefined,
  },
  {
    slug: "portfolio-website",
    title: "Portfolio Website",
    summary:
      "This very site — a production-grade Next.js portfolio with MDX blog, dark mode, and animations.",
    description:
      "A personal portfolio website built with Next.js 16, Tailwind CSS v4, and shadcn/ui. Features a merged hero/about section, experience timeline, project showcase, blog with MDX support, contact form via Resend, dynamic OG images, and subtle Motion animations. Designed mobile-first with full dark mode support and accessibility baked in.",
    image: "/images/projects/portfolio.png",
    techStack: ["Next.js", "TypeScript", "Tailwind CSS", "Motion", "Resend"],
    githubUrl: "https://github.com/anthonywong/portfolio",
    liveUrl: "https://anthonywong.dev",
  },
];

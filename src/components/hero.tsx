"use client";

import Image from "next/image";
import { Download } from "lucide-react";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import { FadeUp } from "@/components/motion-wrapper";
import { BrandIcon } from "@/components/icons";

const skills = ["Python", "SQL", "Apache Spark", "Databricks", "GCP", "Azure"];

export function Hero() {
  return (
    <section
      id="home"
      className="px-4 py-24 md:px-8 md:py-32"
    >
      <div className="mx-auto flex max-w-5xl flex-col items-center gap-12 md:flex-row md:gap-16">
        {/* Left: text content */}
        <FadeUp>
          <div className="flex-1">
            <p className="mb-2 font-mono text-sm text-accent">{"\ud83d\udc4b"} Hi, I&apos;m</p>
            <h1 className="mb-4 font-bold text-foreground">Anthony Wong</h1>
            <p className="mb-4 text-lg leading-relaxed text-muted-foreground">
              Data engineer with 3+ years of experience building end-to-end data
              pipelines for business intelligence and analytics. Skilled in
              monitoring and optimizing batch/streaming workflows using Python,
              SQL, and Apache Spark — committed to best practices in data
              governance and delivering high-quality data across ETL/ELT
              processes on Azure and GCP.
            </p>

            {/* Skill pills */}
            <div className="mb-6 flex flex-wrap gap-2">
              {skills.map((skill) => (
                <span
                  key={skill}
                  className="inline-flex items-center gap-1.5 rounded-full bg-accent-muted px-3 py-1 text-xs text-accent"
                >
                  <BrandIcon name={skill} className="h-3.5 w-3.5" />
                  {skill}
                </span>
              ))}
            </div>

            {/* Social links + Resume */}
            <div className="flex flex-wrap items-center gap-3">
              <a
                href="https://github.com/anthonywong611"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-4 py-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                <FaGithub className="h-[18px] w-[18px]" />
                GitHub
              </a>
              <a
                href="https://www.linkedin.com/in/anthony-wong-5432b5161"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-4 py-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                <FaLinkedin className="h-[18px] w-[18px]" />
                LinkedIn
              </a>
              <a
                href="/resume.pdf"
                download
                className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-br from-accent to-emerald-600 px-5 py-2 text-sm font-semibold text-white shadow-[0_4px_14px_rgba(16,185,129,0.3)] transition-shadow hover:shadow-[0_6px_20px_rgba(16,185,129,0.4)]"
              >
                <Download className="h-4 w-4" />
                Resume
              </a>
            </div>
          </div>
        </FadeUp>

        {/* Right: photo */}
        <FadeUp delay={0.2}>
          <div className="flex-shrink-0">
            <div className="h-[320px] w-[280px] overflow-hidden rounded-2xl border-2 border-border bg-muted">
              <Image
                src="/profile.jpg"
                alt="Anthony Wong"
                width={280}
                height={320}
                className="h-full w-full object-cover"
                priority
              />
            </div>
          </div>
        </FadeUp>
      </div>
    </section>
  );
}

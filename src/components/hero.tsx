import { Download } from "lucide-react";
import { FaGithub, FaLinkedin } from "react-icons/fa";

const skills = [
  { emoji: "\ud83d\udc0d", name: "Python" },
  { emoji: "\ud83d\udcd8", name: "TypeScript" },
  { emoji: "\u269b\ufe0f", name: "React" },
  { emoji: "\ud83d\uddc4\ufe0f", name: "SQL" },
];

export function Hero() {
  return (
    <section
      id="home"
      className="px-4 py-24 md:px-8 md:py-32"
    >
      <div className="mx-auto flex max-w-5xl flex-col items-center gap-12 md:flex-row md:gap-16">
        {/* Left: text content */}
        <div className="flex-1">
          <p className="mb-2 font-mono text-sm text-accent">{"\ud83d\udc4b"} Hi, I&apos;m</p>
          <h1 className="mb-4 font-bold text-foreground">Anthony Wong</h1>
          <p className="mb-4 text-lg leading-relaxed text-muted-foreground">
            Software engineer building impactful solutions at the intersection
            of data and design. I love turning messy problems into clean,
            maintainable systems — whether that&apos;s a streaming data pipeline or
            a polished web app.
          </p>

          {/* Skill pills */}
          <div className="mb-6 flex flex-wrap gap-2">
            {skills.map((skill) => (
              <span
                key={skill.name}
                className="rounded-full bg-accent-muted px-3 py-1 text-xs text-accent"
              >
                {skill.emoji} {skill.name}
              </span>
            ))}
          </div>

          {/* Social links + Resume */}
          <div className="flex flex-wrap items-center gap-3">
            <a
              href="https://github.com/anthonywong"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-4 py-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              <FaGithub className="h-[18px] w-[18px]" />
              GitHub
            </a>
            <a
              href="https://linkedin.com/in/anthonywong"
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

        {/* Right: photo */}
        <div className="flex-shrink-0">
          <div className="h-[320px] w-[280px] overflow-hidden rounded-2xl border-2 border-border bg-muted">
            <div className="flex h-full w-full items-center justify-center text-5xl text-muted-foreground">
              {"\ud83d\udcf7"}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

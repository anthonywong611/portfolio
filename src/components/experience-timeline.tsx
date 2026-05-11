"use client";

import { experiences } from "@/data/experiences";
import { FadeUpOnScroll } from "@/components/motion-wrapper";

export function ExperienceTimeline() {
  return (
    <section id="experience" className="bg-section-alt px-4 py-24 md:px-8">
      <div className="mx-auto max-w-5xl">
        <h2 className="mb-10 font-bold text-foreground">Experience</h2>

        <div className="relative pl-8">
          {/* Timeline line */}
          <div className="absolute left-[7px] top-2 bottom-2 w-0.5 bg-gradient-to-b from-accent to-border" />

          {experiences.map((exp, i) => (
            <FadeUpOnScroll key={i} delay={i * 0.1} className="relative mb-10 last:mb-0">
              {/* Dot */}
              <div
                className={`absolute -left-8 top-1.5 h-4 w-4 rounded-full border-[3px] ${
                  exp.current
                    ? "border-background bg-accent shadow-[0_0_0_2px_var(--color-accent)]"
                    : "border-background bg-border shadow-[0_0_0_2px_var(--color-border)]"
                }`}
              />

              {/* Card */}
              <div className="rounded-2xl border border-border bg-card p-6">
                <div className="mb-2 flex flex-col justify-between gap-1 sm:flex-row sm:items-start">
                  <h3 className="text-lg font-semibold text-foreground">
                    {exp.title}
                  </h3>
                  <span
                    className={`whitespace-nowrap font-mono text-sm ${
                      exp.current ? "text-accent" : "text-muted-foreground"
                    }`}
                  >
                    {exp.period}
                  </span>
                </div>

                <p className="mb-4 text-sm leading-relaxed text-muted-foreground">
                  {exp.summary}
                </p>

                {/* Skills */}
                <div className="mb-4 flex flex-wrap gap-1.5">
                  {exp.skills.map((skill) => (
                    <span
                      key={skill}
                      className="rounded bg-accent-muted px-2.5 py-0.5 text-xs text-accent"
                    >
                      {skill}
                    </span>
                  ))}
                </div>

                {/* Milestones */}
                <div className="border-t border-border pt-3">
                  <p className="mb-1.5 text-xs uppercase tracking-wider text-muted-foreground">
                    Key Milestones
                  </p>
                  <ul className="list-disc pl-4 text-sm leading-relaxed text-muted-foreground">
                    {exp.milestones.map((milestone, j) => (
                      <li key={j}>{milestone}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </FadeUpOnScroll>
          ))}
        </div>
      </div>
    </section>
  );
}

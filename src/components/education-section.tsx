"use client";

import { education } from "@/data/education";
import { FadeUpOnScroll } from "@/components/motion-wrapper";
import { BrandIcon } from "@/components/icons";

export function EducationSection() {
  return (
    <section id="education" className="px-4 py-24 md:px-8">
      <div className="mx-auto max-w-5xl">
        <h2 className="mb-10 font-bold text-foreground">Education</h2>

        <div className="flex flex-col gap-4">
          {education.map((edu, i) => (
            <FadeUpOnScroll key={i} delay={i * 0.1}>
              <div className="flex items-start gap-4 rounded-2xl border border-border bg-card p-6">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-accent-muted text-accent">
                  <BrandIcon name={edu.institution} className="h-5 w-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-col justify-between gap-1 sm:flex-row sm:items-start">
                    <div>
                      <h3 className="text-lg font-semibold text-foreground">
                        {edu.degree}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {edu.institution}
                      </p>
                    </div>
                    <span className="whitespace-nowrap font-mono text-sm text-muted-foreground">
                      {edu.period}
                    </span>
                  </div>
                  {edu.areasOfStudy.length > 0 && (
                    <div className="mt-3 border-t border-border pt-3">
                      <p className="mb-1.5 text-xs uppercase tracking-wider text-muted-foreground">
                        Areas of Study
                      </p>
                      <ul className="list-disc pl-4 text-sm leading-relaxed text-muted-foreground">
                        {edu.areasOfStudy.map((area) => (
                          <li key={area}>{area}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            </FadeUpOnScroll>
          ))}
        </div>
      </div>
    </section>
  );
}

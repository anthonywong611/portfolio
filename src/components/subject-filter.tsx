"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { BlogPost } from "@/types";
import type { Subject } from "@/data/subjects";
import { filterPostsBySubject } from "@/lib/subjects";

type SubjectFilterProps = {
  posts: BlogPost[];
  subjects: Subject[];
  selectedSubject: string | null;
  onSelectSubject: (slug: string | null) => void;
  maxPosts?: number;
  showViewMore?: boolean;
  showSummary?: boolean;
};

export function SubjectFilter({
  posts,
  subjects,
  selectedSubject,
  onSelectSubject,
  maxPosts,
  showViewMore,
  showSummary,
}: SubjectFilterProps) {
  const filteredPosts = filterPostsBySubject(posts, selectedSubject, maxPosts);

  const selectedLabel =
    selectedSubject === null
      ? "Latest"
      : subjects.find((s) => s.slug === selectedSubject)?.label ?? "Latest";

  const viewMoreHref =
    selectedSubject === null ? "/blog" : `/blog?subject=${selectedSubject}`;

  return (
    <div className="flex flex-col md:flex-row">
      {/* Mobile: horizontal pills */}
      <div className="flex gap-2 overflow-x-auto pb-4 md:hidden">
        <button
          onClick={() => onSelectSubject(null)}
          className={`shrink-0 rounded-full px-4 py-1.5 text-sm transition-colors ${
            selectedSubject === null
              ? "bg-accent/15 text-accent"
              : "border border-border text-muted-foreground hover:text-foreground"
          }`}
        >
          Latest
        </button>
        {subjects.map((subject) => (
          <button
            key={subject.slug}
            onClick={() => onSelectSubject(subject.slug)}
            className={`shrink-0 rounded-full px-4 py-1.5 text-sm transition-colors ${
              selectedSubject === subject.slug
                ? "bg-accent/15 text-accent"
                : "border border-border text-muted-foreground hover:text-foreground"
            }`}
          >
            {subject.label}
          </button>
        ))}
      </div>

      {/* Desktop: sidebar */}
      <div className="hidden w-[200px] shrink-0 border-r border-border pr-4 md:block">
        <p className="mb-3 text-xs uppercase tracking-wider text-muted-foreground">
          Subjects
        </p>
        <button
          onClick={() => onSelectSubject(null)}
          className={`mb-1 block w-full rounded-md px-3 py-1.5 text-left text-sm transition-colors ${
            selectedSubject === null
              ? "bg-accent/15 text-accent"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          Latest
        </button>
        {subjects.map((subject) => (
          <button
            key={subject.slug}
            onClick={() => onSelectSubject(subject.slug)}
            className={`mb-1 block w-full rounded-md px-3 py-1.5 text-left text-sm transition-colors ${
              selectedSubject === subject.slug
                ? "bg-accent/15 text-accent"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {subject.label}
          </button>
        ))}
      </div>

      {/* Article list */}
      <div className="min-w-0 flex-1 md:pl-6">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-foreground">
            {selectedLabel}
          </h3>
          {showViewMore && (
            <Link
              href={viewMoreHref}
              className="text-sm text-accent transition-colors hover:text-accent/80"
            >
              View more &rarr;
            </Link>
          )}
        </div>

        {filteredPosts.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No posts in this subject yet.
          </p>
        ) : (
          <div className="flex flex-col gap-3">
            {filteredPosts.map((post) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="group flex items-center justify-between rounded-xl border border-border bg-card p-5 transition-all hover:border-accent/50"
              >
                <div>
                  <h4 className="mb-1 text-base font-semibold text-foreground transition-colors group-hover:text-accent">
                    {post.title}
                  </h4>
                  {showSummary && post.summary && (
                    <p className="mb-2 text-sm text-muted-foreground">
                      {post.summary}
                    </p>
                  )}
                  <p className="text-sm text-muted-foreground">
                    {new Date(post.publishedAt).toLocaleDateString("en-US", {
                      month: "long",
                      year: "numeric",
                    })}{" "}
                    &middot; {post.readingTime}
                  </p>
                </div>
                <ArrowRight className="h-4 w-4 shrink-0 text-accent opacity-0 transition-opacity group-hover:opacity-100" />
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

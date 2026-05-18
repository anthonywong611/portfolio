"use client";

import { useState } from "react";
import { subjects } from "@/data/subjects";
import { SubjectFilter } from "@/components/subject-filter";
import type { BlogPost } from "@/types";

export function BlogPreview({ posts }: { posts: BlogPost[] }) {
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);

  if (posts.length === 0) return null;

  return (
    <section id="blog" className="bg-section-alt px-4 py-24 md:px-8">
      <div className="mx-auto max-w-5xl">
        <h2 className="mb-10 font-bold text-foreground">Blog</h2>
        <SubjectFilter
          posts={posts}
          subjects={subjects}
          selectedSubject={selectedSubject}
          onSelectSubject={setSelectedSubject}
          maxPosts={5}
          showViewMore
        />
      </div>
    </section>
  );
}

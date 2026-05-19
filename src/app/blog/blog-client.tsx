"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { subjects } from "@/data/subjects";
import { SubjectFilter } from "@/components/subject-filter";
import type { BlogPost } from "@/types";

export function BlogClient({ posts }: { posts: BlogPost[] }) {
  const searchParams = useSearchParams();
  const router = useRouter();

  const selectedSubject = searchParams.get("subject") ?? null;

  function handleSelectSubject(slug: string | null) {
    const params = new URLSearchParams(searchParams.toString());
    if (slug === null) {
      params.delete("subject");
    } else {
      params.set("subject", slug);
    }
    const query = params.toString();
    router.push(query ? `/blog?${query}` : "/blog", { scroll: false });
  }

  return (
    <SubjectFilter
      posts={posts}
      subjects={subjects}
      selectedSubject={selectedSubject}
      onSelectSubject={handleSelectSubject}
      showSummary
    />
  );
}

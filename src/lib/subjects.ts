import type { BlogPost } from "@/types";

export function filterPostsBySubject(
  posts: BlogPost[],
  subjectSlug: string | null,
  maxPosts?: number
): BlogPost[] {
  const filtered =
    subjectSlug === null
      ? posts
      : posts.filter((post) => post.subjects.includes(subjectSlug));

  if (maxPosts !== undefined) {
    return filtered.slice(0, maxPosts);
  }

  return filtered;
}

import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Suspense } from "react";
import { getAllPosts } from "@/lib/mdx";
import { BlogClient } from "./blog-client";

export const metadata: Metadata = {
  title: "Blog",
  description: "Thoughts on software engineering, data, and building things.",
};

export default function BlogPage() {
  const posts = getAllPosts();

  return (
    <div className="mx-auto max-w-5xl px-4 py-24 md:px-8">
      <Link
        href="/"
        className="mb-8 inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to home
      </Link>

      <h1 className="mb-10 font-bold text-foreground">Blog</h1>

      {posts.length === 0 ? (
        <p className="text-muted-foreground">No posts yet. Check back soon!</p>
      ) : (
        <Suspense>
          <BlogClient posts={posts} />
        </Suspense>
      )}
    </div>
  );
}

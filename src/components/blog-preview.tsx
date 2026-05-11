import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getAllPosts } from "@/lib/mdx";

export function BlogPreview() {
  const posts = getAllPosts().slice(0, 3);

  if (posts.length === 0) return null;

  return (
    <section id="blog" className="bg-section-alt px-4 py-24 md:px-8">
      <div className="mx-auto max-w-5xl">
        <div className="mb-10 flex items-center justify-between">
          <h2 className="font-bold text-foreground">Blog</h2>
          <Link
            href="/blog"
            className="text-sm text-accent transition-colors hover:text-accent/80"
          >
            View all posts &rarr;
          </Link>
        </div>

        <div className="flex flex-col gap-4">
          {posts.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="group flex items-center justify-between rounded-xl border border-border bg-card p-5 transition-all hover:border-accent/50"
            >
              <div>
                <h3 className="mb-1 text-base font-semibold text-foreground transition-colors group-hover:text-accent">
                  {post.title}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {new Date(post.publishedAt).toLocaleDateString("en-US", {
                    month: "long",
                    year: "numeric",
                  })}{" "}
                  &middot; {post.readingTime}
                </p>
              </div>
              <ArrowRight className="h-4 w-4 flex-shrink-0 text-accent opacity-0 transition-opacity group-hover:opacity-100" />
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

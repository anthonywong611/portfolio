import { Rss } from "lucide-react";
import { FaGithub, FaLinkedin } from "react-icons/fa";

export function Footer() {
  return (
    <footer className="border-t border-border px-4 py-6 md:px-8">
      <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-4 sm:flex-row">
        <p className="text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} Anthony Wong
        </p>
        <div className="flex items-center gap-4">
          <a
            href="https://github.com/anthonywong611"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
            aria-label="GitHub"
          >
            <FaGithub className="h-4 w-4" />
            GitHub
          </a>
          <a
            href="https://www.linkedin.com/in/anthony-wong-5432b5161"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
            aria-label="LinkedIn"
          >
            <FaLinkedin className="h-4 w-4" />
            LinkedIn
          </a>
          <a
            href="/feed.xml"
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
            aria-label="RSS Feed"
          >
            <Rss className="h-4 w-4" />
            RSS
          </a>
        </div>
      </div>
    </footer>
  );
}

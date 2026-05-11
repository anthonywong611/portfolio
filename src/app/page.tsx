import { ThemeToggle } from "@/components/theme-toggle";

export default function Home() {
  return (
    <main id="main-content" className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <h1 className="font-bold text-foreground">Anthony Wong</h1>
        <p className="text-muted-foreground">Portfolio coming soon</p>
        <div className="mt-4">
          <ThemeToggle />
        </div>
      </div>
    </main>
  );
}

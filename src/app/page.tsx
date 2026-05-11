import { Navbar } from "@/components/navbar";

export default function Home() {
  return (
    <>
      <Navbar />
      <main id="main-content" className="pt-16">
        <section id="home" className="flex min-h-screen items-center justify-center">
          <p className="text-muted-foreground">Sections coming soon...</p>
        </section>
      </main>
    </>
  );
}

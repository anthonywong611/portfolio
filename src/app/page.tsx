import { Navbar } from "@/components/navbar";
import { Hero } from "@/components/hero";

export default function Home() {
  return (
    <>
      <Navbar />
      <main id="main-content" className="pt-16">
        <Hero />
      </main>
    </>
  );
}

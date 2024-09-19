import { Hero } from "@/components/hero";
import Navbar from "@/components/navbar";
import { Metadata } from "next";

export default function Home() {
  return (
    <main className="min-h-screen h-full max-l mx-auto">
      <Navbar />
      <Hero />
    </main>
  );
}

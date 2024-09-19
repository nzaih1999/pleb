import { Hero } from "@/components/hero";
import Navbar from "@/components/navbar";
import { Metadata } from "next";

export const runtime = "edge";
export async function generateMetadata({}: {}): Promise<Metadata> {
  return {
    metadataBase: new URL("https://rendercon-24.vercel.app"),
    title: "Rendercon 2024",
    description: "Social cards for Rendercon 2024",
    openGraph: {
      description: "Social cards for Rendercon 2024",

      title: "Rendercon 2024",
      type: "article",
    },
  };
}
export default function Home() {
  return (
    <main className="min-h-screen h-full max-l mx-auto">
      <Navbar />
      <Hero />
    </main>
  );
}

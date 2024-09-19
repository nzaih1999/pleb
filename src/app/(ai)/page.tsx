import { Hero } from "@/components/hero";
import Navbar from "@/components/navbar";
import { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  return {
    metadataBase: new URL("https://rendercon-24.vercel.app"),
    title: "RenderCon 2024 Badge",
    description: "Preview of RenderCon 2024 Badge",
    openGraph: {
      title: "RenderCon 2024 Badge",
      description: "Preview of RenderCon 2024 Badge",
      images: [
        {
          url: `https://rendercon-24.vercel.app/opengraph-image?af80a6e56ddfdc86`,
        },
      ],
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

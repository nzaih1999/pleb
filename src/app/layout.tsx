import { Inter } from "next/font/google";
import "./globals.css";
import "leaflet/dist/leaflet.css";
import BackgroundDots from "@/components/backgrounds";
import { AI } from "./(ai)/actions";
import { GeistMono } from "geist/font/mono";
import { ClerkProvider } from "@clerk/nextjs";
import { Metadata } from "next";
import Navbar from "@/components/navbar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL("https://rendercon-24.vercel.app"),
  title: "Rendercon 2024",
  description: "Social cards for Rendercon 2024",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={GeistMono.className}>
          <AI>
            <main>
              <Navbar />
              {children}

              <BackgroundDots />
            </main>
          </AI>
        </body>
      </html>
    </ClerkProvider>
  );
}

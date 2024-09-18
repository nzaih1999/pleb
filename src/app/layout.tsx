import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import "leaflet/dist/leaflet.css";
import BackgroundDots from "@/components/backgrounds";
import { AI } from "./(ai)/actions";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import {
  ClerkProvider,
  SignInButton,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/nextjs";
import { Button } from "@/components/ui/button";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <head>
          <title></title>
          <meta name="description" content="" />

          <meta property="og:url" content="https://rendercon-24.vercel.app/" />
          <meta property="og:type" content="website" />
          <meta property="og:title" content="" />
          <meta property="og:description" content="" />
          <meta
            property="og:image"
            content="https://rendercon-24.vercel.app/opengraph-image?d0b3bc3be349667d"
          />

          <meta name="twitter:card" content="summary_large_image" />
          <meta property="twitter:domain" content="rendercon-24.vercel.app" />
          <meta
            property="twitter:url"
            content="https://rendercon-24.vercel.app/"
          />
          <meta name="twitter:title" content="" />
          <meta name="twitter:description" content="" />
          <meta
            name="twitter:image"
            content="https://rendercon-24.vercel.app/opengraph-image?d0b3bc3be349667d"
          />
        </head>
        <body className={GeistMono.className}>
          <AI>
            <main>
              {children}
              <BackgroundDots />
            </main>
          </AI>
        </body>
      </html>
    </ClerkProvider>
  );
}

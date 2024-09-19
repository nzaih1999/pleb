import { Badge } from "@/components/event-badge";
import ShareBadge from "@/components/share-badge";
import { prisma } from "@/lib/prisma";
import React from "react";
import { Button, buttonVariants } from "@/components/ui/button";
import { Share2, Twitter } from "lucide-react";
import Link from "next/link";
import { Metadata } from "next";

type Params = {
  params: {
    slug: string;
  };
};

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const user = await prisma.user.findFirst({
    where: { id: params.slug },
    include: {
      socialCard: true,
    },
  });

  return {
    metadataBase: new URL("https://rendercon-24.vercel.app"),
    title: `${user?.socialCard?.name} Rendercon Ticket`,
    description: "Click this link to create your ticket now",
    openGraph: {
      description: "Social cards for Rendercon 2024",

      title: `${user?.socialCard?.name} Rendercon Ticket`,
      type: "article",
    },
  };
}

const Page = async ({ params }: Params) => {
  const user = await prisma.user.findFirst({
    where: { id: params.slug },
    include: {
      socialCard: true,
    },
  });

  return (
    <div className="min-h-screen bg-black text-white p-8 z-50">
      <div className="max-w-6xl mx-auto">
        <div className="w-full flex flex-col md:flex-row justify-between items-center mb-8 mx-auto">
          <div className="w-full md:w-1/2 text-center md:text-left mb-8 md:mb-0">
            <h1 className="md:text-5xl text-2xl font-bold mb-4">
              {user?.socialCard?.name} is going to Rendercon! on{" "}
              <span className="text-purple-500">October 5th</span>&
              <span className="text-purple-500">6th</span>
            </h1>

            <div className="flex justify-center md:justify-start gap-4 mb-8 z-50">
              <Button className="bg-blue-500 hover:bg-blue-600">
                <Share2 className="mr-2 h-4 w-4" /> SHARE
              </Button>
              <Link
                href="/"
                className={buttonVariants({
                  className: "z-50 text-purple-500",
                })}
              >
                signup to create your ticket
              </Link>
            </div>
          </div>
          <div className="w-full md:w-1/2 flex items-center justify-center">
            <ShareBadge user={user?.socialCard!} number={user?.number} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;

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
    metadataBase: new URL("https://social.rendercon.org"),
    title: `${user?.socialCard?.name} Rendercon social card`,
    description: "Social cards for rendercon 2024",
    openGraph: {
      description: "Click this link to create your social card now",

      title: `${user?.socialCard?.name}'s Rendercon social card`,
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
      <div className="max-w-6xl mx-auto mt-20">
        <div className="w-full flex flex-col md:flex-row justify-between items-center mb-8 mx-auto">
          <div className="w-full md:w-1/2 text-center md:text-left mb-8 md:mb-0">
            <h1 className="md:text-5xl text-2xl font-bold mb-4">
              {user?.socialCard?.name} is going to Rendercon! on{" "}
              <span className="text-purple-500">October 4th</span>&
              <span className="text-purple-500">5th</span>
            </h1>

            <div className="flex justify-center md:justify-start gap-4 mb-8 z-50">
              <Link
                href="/"
                className={buttonVariants({
                  className: "z-50 text-purple-500",
                })}
              >
                signup to create your card
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

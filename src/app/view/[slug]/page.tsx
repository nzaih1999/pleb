import { Badge } from "@/components/event-badge";
import ShareBadge from "@/components/share-badge";
import { prisma } from "@/lib/prisma";
import React from "react";
import { Button } from "@/components/ui/button";
import { Share2, Twitter } from "lucide-react";

type Params = {
  params: {
    slug: string;
  };
};

const Page = async ({ params }: Params) => {
  const user = await prisma.user.findFirst({
    where: { id: params.slug },
    include: {
      socialCard: true,
    },
  });

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-6xl mx-auto">
        <div className="w-full flex flex-col md:flex-row justify-between items-center mb-8 mx-auto">
          <div className="w-full md:w-1/2 text-center md:text-left mb-8 md:mb-0">
            <h1 className="md:text-5xl text-2xl font-bold mb-4">
              See you online/physical on{" "}
              <span className="text-purple-500">October 5th</span>&
              <span className="text-purple-500">6th</span>
            </h1>

            <div className="flex justify-center md:justify-start gap-4 mb-8">
              <Button className="bg-blue-500 hover:bg-blue-600">
                <Share2 className="mr-2 h-4 w-4" /> SHARE
              </Button>
              <Button className="bg-blue-500 hover:bg-blue-600">
                <Twitter className="mr-2 h-4 w-4" /> SHARE
              </Button>
            </div>
          </div>
          <div className="w-full md:w-1/2 flex items-center justify-center">
            <ShareBadge user={user?.socialCard} number={user?.number} />
          </div>
        </div>
        <div className="text-sm">
          <ul className="space-y-2">
            <li>
              ADD NEXT.JS CONF TO YOUR CALENDAR ON{" "}
              <a href="#" className="text-blue-500 hover:underline">
                ICAL
              </a>
              ,{" "}
              <a href="#" className="text-blue-500 hover:underline">
                GOOGLE
              </a>
              , OR{" "}
              <a href="#" className="text-blue-500 hover:underline">
                OUTLOOK
              </a>
            </li>
            <li>
              NEED TO CHANGE YOUR DETAILS?{" "}
              <a href="#" className="text-blue-500 hover:underline">
                EDIT BADGE
              </a>
            </li>
            <li>
              WANT TO JOIN US IN-PERSON?{" "}
              <a href="#" className="text-blue-500 hover:underline">
                BUY A TICKET
              </a>
            </li>
            <li>
              LEARN HOW TO USE NEXT.JS{" "}
              <a href="#" className="text-blue-500 hover:underline">
                START LEARNING
              </a>
            </li>
            <li>
              READY TO GET STARTED WITH NEXT.JS & VERCEL{" "}
              <a href="#" className="text-blue-500 hover:underline">
                DEPLOY NOW
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Page;

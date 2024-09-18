import { Badge } from "@/components/event-badge";
import ShareBadge from "@/components/share-badge";
import { prisma } from "@/lib/prisma";
import React from "react";
import { Button } from "@/components/ui/button";
import { Share2, Twitter } from "lucide-react";
import SocialShareButtons from "@/components/copy-to-clipboard";

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

            <SocialShareButtons
              url={`https://rendercon-24.vercel.app/share/${params.slug}`}
              title="See you online/physical on October 5th&6th"
            />
          </div>
          <div className="w-full md:w-1/2 flex items-center justify-center">
            <ShareBadge user={user?.socialCard!} number={user?.number} />
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

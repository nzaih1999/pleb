import ShareBadge from "@/components/share-badge";
import { prisma } from "@/lib/prisma";
import SocialShareButtons from "@/components/copy-to-clipboard";
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
    description: "Tickets for rendercon 2024",
    openGraph: {
      description: "Click this link to create your ticket now",

      title: `${user?.socialCard?.name}'s Rendercon Ticket`,
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
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-6xl mx-auto my-auto mt-20">
        <div className="w-full flex flex-col md:flex-row justify-between items-center mb-8 mx-auto">
          <div className="w-full md:w-1/2 text-center md:text-left mb-8 md:mb-0">
            <h1 className="md:text-5xl text-2xl font-bold mb-4">
              See you online/physical on{" "}
              <span className="text-purple-500">October 5th</span>&
              <span className="text-purple-500">6th</span>
            </h1>

            <SocialShareButtons
              url={`https://rendercon-24.vercel.app/share/${params.slug}`}
              title="I'll be attending @renderconke on october 5th and 6th. See you there. Click here to get your ticket!"
            />
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

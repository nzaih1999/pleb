"use client";
import { SocialCard } from "@prisma/client";
import { ImageIcon, QrCode } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { buttonVariants } from "./ui/button";

type BadgeProps = {};

export const Badge = ({
  user,
  number,
}: {
  user: SocialCard;
  number?: number;
}) => {
  return (
    <motion.div
      className=""
      initial={{ y: -200 }}
      animate={{ y: 0 }}
      transition={{
        type: "spring",
        damping: 10,
        stiffness: 100,
        duration: 0.5,
      }}
    >
      <div className="relative">
        <div className="absolute -top-16 left-1/2 transform -translate-x-1/2 w-20 h-16 bg-black flex items-center justify-center">
          <div
            className="text-white text-xs font-mono rotate-180"
            style={{ writingMode: "vertical-rl" }}
          >
            RENDER CON &apos;24
          </div>
        </div>

        {/* Badge */}
        <div
          className={`w-64 h-96 bg-purple-600 rounded-lg shadow-lg overflow-hidden flex flex-col text-white`}
        >
          <div className="p-4 flex-grow">
            <div className="text-sm font-mono mb-4">
              RENDER
              <br />
              CON
              <br />
              &apos;24
            </div>
            <div className="w-6 h-6 border-2 rounded-full mb-8" />
            <div className="text-2xl font-bold mb-1">
              {user.name?.toUpperCase()}
            </div>
            <div className="text-sm font-mono">
              {user.profession?.toUpperCase()}
            </div>
            <div className="text-xs text-gray-800">{user.companyName}</div>
          </div>
          <div className="bg-gray-800  flex justify-between items-center py-6">
            <Image
              height={100}
              width={100}
              src={`/Rendercon-wb.png`}
              className="object-cover"
              alt="logo for rendercon"
            />
            <div className="text-purple-600 text-xl font-mono p-4">
              #{number?.toString().padStart(3, "0")}
            </div>
          </div>
        </div>

        {/* Badge Clip */}
        <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 w-16 h-8 bg-black rounded-b-lg" />
      </div>

      <div className=" mt-10 flex items-center justify-center gap-4">
        <Link
          href={`/view/${user.userId}/opengraph-image`}
          className={buttonVariants({})}
        >
          <ImageIcon className="mr-2 h-4 w-4" />
          Download Image
        </Link>
        <Link href={`/view/${user.userId}`} className={buttonVariants({})}>
          View
        </Link>
      </div>
    </motion.div>
  );
};

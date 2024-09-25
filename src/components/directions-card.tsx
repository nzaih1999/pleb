"use client";

import { useState } from "react";
import {
  Disclosure,
  DisclosureContent,
  DisclosureTrigger,
} from "@/components/ui/disclosure";
import { motion } from "framer-motion";
import directions from "@/lib/speakers";
import { ChevronRight } from "lucide-react";
import { GoogleMapsDirections } from "./maps";

export function DisclosureCard() {
  const [isOpen, setIsOpen] = useState(false);

  const imageVariants = {
    collapsed: { scale: 1, filter: "blur(0px)" },
    expanded: { scale: 1.1, filter: "blur(3px)" },
  };

  const contentVariants = {
    collapsed: { opacity: 0, y: 0 },
    expanded: { opacity: 1, y: 0 },
  };

  const transition = {
    type: "spring",
    stiffness: 26.7,
    damping: 4.1,
    mass: 0.2,
  };

  return (
    <div className="relative h-[350px] w-[290px] overflow-hidden rounded-xl z-50">
      <div onClick={() => setIsOpen(!isOpen)}>
        <GoogleMapsDirections />

        <div className="p-4 ">
          <p className="text-white font-semibold">
            Catholic University of Eastern Africa
          </p>
          <p className="text-purple-500 text-xs font-semibold">Bogani Road</p>
        </div>
      </div>
      <Disclosure
        onOpenChange={setIsOpen}
        open={isOpen}
        className="absolute bottom-0 left-0 right-0 rounded-xl bg-zinc-900 px-4 pt-2 dark:bg-zinc-50"
        variants={contentVariants}
        transition={transition}
      >
        <DisclosureTrigger>
          <button
            className="w-full pb-2 text-left text-[14px] font-medium text-white dark:text-zinc-900"
            type="button"
            onClick={() => setIsOpen(!isOpen)}
          >
            Directions from the CBD
          </button>
        </DisclosureTrigger>
        <DisclosureContent>
          <div className="flex flex-col pb-4 text-[13px] text-zinc-300 dark:text-zinc-700 z-50">
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="p-3 h-full flex flex-col">
                <h2 className="text-xs font-semibold text-purple-500 mb-2">
                  Directions
                </h2>
                <div className="overflow-y-auto flex-grow pr-2">
                  <div className="space-y-3">
                    {directions.map((direction, index) => (
                      <div key={index} className="flex items-start">
                        <div className="flex-shrink-0"></div>
                        <div className="ml-2 flex-grow">
                          <p className="text-[10px] font-medium text-gray-900 leading-tight">
                            {direction.step}
                          </p>
                          {direction.duration && direction.distance && (
                            <p className="mt-0.5 text-[10px] text-gray-500">
                              {direction.duration} ({direction.distance})
                            </p>
                          )}
                        </div>
                        {index < directions.length - 1 && (
                          <ChevronRight className="flex-shrink-0 w-2 h-2 text-gray-400 mt-1" />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <button
              className="mt-3 w-full rounded-[4px] border z-50 border-zinc-700 bg-zinc-900 px-4 py-1 text-zinc-50 transition-colors duration-300 hover:bg-zinc-800"
              type="button"
            >
              Learn More
            </button>
          </div>
        </DisclosureContent>
      </Disclosure>
    </div>
  );
}

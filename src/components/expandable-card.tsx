"use client";
import Image from "next/image";
import React, { useEffect, useId, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useOutsideClick } from "@/lib/hooks";

export interface Speaker {
  id: string;
  firstName: string;
  lastName: string;
  fullName: string;
  bio: string;
  tagLine: string;
  profilePicture: string;
  sessions: Session[];
  isTopSpeaker: boolean;
  links: any[];
  questionAnswers: any[];
  categories: any[];
}

interface Session {
  id: number;
  name: string;
}

export function SpeakersCard({ speaker }: { speaker: Speaker }) {
  const [active, setActive] = useState<boolean>(false);
  const id = useId();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setActive(false);
      }
    }

    if (active) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [active]);

  useOutsideClick(ref, () => setActive(false));

  return (
    <>
      <AnimatePresence>
        {active && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/20 h-full w-full z-10"
          />
        )}
      </AnimatePresence>
      <AnimatePresence>
        {active ? (
          <div className="fixed inset-0 grid place-items-center z-[100]">
            <motion.button
              key={`button-${speaker.id}-${id}`}
              layout
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, transition: { duration: 0.05 } }}
              className="flex absolute top-2 right-2 lg:hidden items-center justify-center bg-white rounded-full h-6 w-6"
              onClick={() => setActive(false)}
            >
              <CloseIcon />
            </motion.button>
            <motion.div
              layoutId={`card-${speaker.id}-${id}`}
              ref={ref}
              className="w-full max-w-[500px] h-[700px]  flex flex-col bg-white dark:bg-neutral-900 sm:rounded-3xl overflow-scroll"
            >
              <motion.div layoutId={`image-${speaker.id}-${id}`}>
                <Image
                  priority
                  width={200}
                  height={200}
                  src={speaker.profilePicture}
                  alt={speaker.fullName}
                  className="w-full  h-80 object-cover object-top"
                />
              </motion.div>

              <div className="flex-1 overflow-y-auto">
                <div className="p-4">
                  <motion.h3
                    layoutId={`name-${speaker.id}-${id}`}
                    className="font-medium text-neutral-700 dark:text-neutral-200 text-xl mb-2"
                  >
                    {speaker.fullName}
                    {speaker.isTopSpeaker && (
                      <span className="ml-2 text-sm font-bold text-yellow-500">
                        ⭐ Top Speaker
                      </span>
                    )}
                  </motion.h3>
                  <motion.p
                    layoutId={`tagline-${speaker.id}-${id}`}
                    className="text-neutral-600 dark:text-neutral-400 text-base mb-4"
                  >
                    {speaker.tagLine}
                  </motion.p>
                  <h4 className="font-medium text-neutral-700 dark:text-neutral-200 text-lg mb-2">
                    Bio
                  </h4>
                  <p className="text-neutral-600 dark:text-neutral-400 text-base mb-4">
                    {speaker.bio}
                  </p>
                  <h4 className="font-medium text-neutral-700 dark:text-neutral-200 text-lg mb-2">
                    Sessions
                  </h4>
                  <ul className="list-disc pl-5 mb-4">
                    {speaker.sessions.map((session) => (
                      <li
                        key={session.id}
                        className="text-neutral-600 dark:text-neutral-400"
                      >
                        {session.name}
                      </li>
                    ))}
                  </ul>
                  {speaker.links.length > 0 && (
                    <>
                      <h4 className="font-medium text-neutral-700 dark:text-neutral-200 text-lg mb-2">
                        Links
                      </h4>
                      <ul className="flex flex-wrap gap-2">
                        {speaker.links.map((link, index) => (
                          <li key={index}>
                            <a
                              href={link.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-3 py-1 text-sm rounded-full font-bold bg-blue-500 text-white hover:bg-blue-600 transition-colors"
                            >
                              {link.title}
                            </a>
                          </li>
                        ))}
                      </ul>
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        ) : null}
      </AnimatePresence>
      <motion.div
        layoutId={`card-${speaker.id}-${id}`}
        onClick={() => setActive(true)}
        className="p-4 flex flex-col hover:bg-neutral-50 dark:hover:bg-neutral-800 rounded-xl cursor-pointer max-w-2xl mx-auto w-full"
      >
        <div className="flex gap-4 flex-col w-full">
          <motion.div layoutId={`image-${speaker.id}-${id}`}>
            <Image
              width={200}
              height={200}
              src={speaker.profilePicture}
              alt={speaker.fullName}
              className=" w-full rounded-lg object-cover object-top"
            />
          </motion.div>
          <div className="flex justify-center items-center flex-col">
            <motion.h3
              layoutId={`name-${speaker.id}-${id}`}
              className="font-medium text-neutral-800 dark:text-neutral-200 text-center md:text-left text-xl"
            >
              {speaker.fullName}
              {speaker.isTopSpeaker && (
                <span className="ml-2 text-sm font-bold text-yellow-500">
                  ⭐ Top Speaker
                </span>
              )}
            </motion.h3>
            <motion.p
              layoutId={`tagline-${speaker.id}-${id}`}
              className="text-neutral-600 dark:text-neutral-400 text-center md:text-left text-base mt-2"
            >
              {speaker.tagLine}
            </motion.p>
          </div>
        </div>
      </motion.div>
    </>
  );
}

export const CloseIcon = () => {
  return (
    <motion.svg
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.05 } }}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-4 w-4 text-black"
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path d="M18 6l-12 12" />
      <path d="M6 6l12 12" />
    </motion.svg>
  );
};

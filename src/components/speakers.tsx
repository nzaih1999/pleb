"use client";
import { Speaker } from "@/lib/speakers";
import React, { ReactNode } from "react";
import { SpeakersCard } from "./expandable-card";
import { useActions, useUIState } from "ai/rsc";
import { ClientMessage } from "@/app/(ai)/actions";
import { generateId } from "ai";
import { motion } from "framer-motion";

type SpeakersProps = {
  speakers: Speaker[];
  userId?: string;
  socialCard?: boolean;
};

const suggestedActions = [
  {
    title: "Sign Up",
    label: "to create your ticket",
    action: "show the sign up button",
  },

  {
    title: "When",
    label: "When is rendercon?",
    action: "Show dates for rendercon",
  },
];

const loggedInActions = [
  {
    title: "ticket",
    label: "create your ticket",
    action: "Show the registration form for rendercon",
  },
  {
    title: "When",
    label: "When is rendercon?",
    action: "Show dates for rendercon",
  },
];

const socialCardActions = [
  {
    title: "Edit",
    label: "Edit your ticket",
    action: "Show the registration form for rendercon",
  },
  {
    title: "Ticket",
    label: "view your ticket",
    action: "show my card",
  },
  {
    title: "When",
    label: "When is rendercon?",
    action: "Show dates for rendercon",
  },
];

const Speakers = ({ speakers, socialCard, userId }: SpeakersProps) => {
  const { continueConversation } = useActions();
  const [_, setConversation] = useUIState();

  return (
    <div className="">
      {speakers.map((speaker) => (
        <SpeakersCard speaker={speaker} key={speaker.id} />
      ))}

      <div className="grid sm:grid-cols-2 gap-2 w-full px-4 md:px-0 mx-auto md:max-w-[500px] my-4 z-50">
        {(userId && socialCard
          ? socialCardActions
          : userId
          ? loggedInActions
          : suggestedActions
        ).map((action, index) => (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 * index }}
            key={index}
            className={"sm:block"}
          >
            <button
              onClick={async () => {
                setConversation((messages: ClientMessage[]) => [
                  ...messages,
                  {
                    id: generateId(),
                    role: "user",
                    display: action.action,
                  },
                ]);
                const response: ReactNode = await continueConversation(
                  action.action
                );
                setConversation((messages: ClientMessage[]) => [
                  ...messages,
                  response,
                ]);
              }}
              className="w-full text-left border border-zinc-800 text-zinc-300 rounded-lg p-2 text-sm hover:bg-zinc-800 transition-colors flex flex-col"
            >
              <span className="font-medium">{action.title}</span>
              <span className="text-zinc-500 dark:text-zinc-400">
                {action.label}
              </span>
            </button>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Speakers;

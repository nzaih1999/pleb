"use client";
import { ClientMessage } from "@/app/(ai)/actions";
import { generateId } from "ai";
import { useActions, useUIState } from "ai/rsc";
import React, { ReactNode } from "react";
import { motion } from "framer-motion";
const socialCardActions = [
  {
    title: "Create",
    label: "create your ticket",
    action: "Show the registration form for rendercon",
  },

  {
    title: "When",
    label: "When is rendercon?",
    action: "Show dates for rendercon",
  },
];

const CreateSocialCardsActions = () => {
  const { continueConversation } = useActions();

  const [_, setConversation] = useUIState();

  return (
    <div className="my-4">
      {socialCardActions.map((action, index) => (
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
  );
};
export default CreateSocialCardsActions;

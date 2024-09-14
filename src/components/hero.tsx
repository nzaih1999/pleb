"use client";
import { ReactNode, useRef, useState } from "react";
import { useActions, useUIState } from "ai/rsc";
import { Message } from "@/components/messages";
import { useScrollToBottom } from "@/components/scroll-to-bottom";
import { motion } from "framer-motion";

import { PlaceholdersAndVanishInput } from "@/components/vanish-input";
import { generateId } from "ai";
import { ClientMessage } from "@/app/(ai)/actions";

export function Hero() {
  const { sendMessage } = useActions();
  console.log(sendMessage);
  const [conversation, setConversation] = useUIState();
  const { continueConversation } = useActions();
  console.log(continueConversation);
  const [input, setInput] = useState<string>("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    setConversation((currentConversation: ClientMessage[]) => [
      ...currentConversation,
      { id: generateId(), role: "user", display: input },
    ]);

    const message = await continueConversation(input);

    setConversation((currentConversation: ClientMessage[]) => [
      ...currentConversation,
      message,
    ]);
  };

  const inputRef = useRef<HTMLInputElement>(null);
  const [messagesContainerRef, messagesEndRef] =
    useScrollToBottom<HTMLDivElement>();

  const suggestedActions = [
    {
      title: "Speakers",
      label: "Who are the speakers?",
      action: "Show speakers",
    },
    {
      title: "Register",
      label: "Register for Rendercon",
      action: "Register for Rendercon",
    },
    {
      title: "When",
      label: "When is rendercon?",
      action: "Show dates for rendercon",
    },
    {
      title: "Sign in",
      label: "Sign in to Rendercon",
      action: "Show the sign in button",
    },
  ];

  return (
    <div className="flex flex-row justify-center py-20 h-dvh bg-white dark:bg-zinc-900">
      <div className="flex flex-col justify-between gap-4">
        <div
          ref={messagesContainerRef}
          className="flex flex-col gap-3  w-dvw items-center overflow-y-scroll overflow-hidden z-10"
        >
          {conversation.map((message: ClientMessage) => (
            <div key={message.id}>
              <Message
                content={message.display}
                role={message.role}
                key={message.id}
              />
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        <div className="grid  sm:grid-cols-2 gap-2 w-full px-4 md:px-0 mx-auto md:max-w-[500px] mb-4 z-10 ">
          {conversation.length === 0 &&
            suggestedActions.map((action, index) => (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.01 * index }}
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
                  className="w-full text-left border border-zinc-200 dark:border-zinc-800 text-zinc-800 dark:text-zinc-300 rounded-lg p-2 text-sm hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors flex flex-col"
                >
                  <span className="font-medium">{action.title}</span>
                  <span className="text-zinc-500 dark:text-zinc-400">
                    {action.label}
                  </span>
                </button>
              </motion.div>
            ))}
        </div>

        <div className="flex flex-col gap-2 relative items-center">
          <PlaceholdersAndVanishInput
            placeholders={["Ask me anything"]}
            onChange={handleChange}
            onSubmit={onSubmit}
          />
        </div>
      </div>
    </div>
  );
}

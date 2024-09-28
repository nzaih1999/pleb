"use client";
import { ReactNode, useRef, useState } from "react";
import { useActions, useUIState } from "ai/rsc";
import { Message } from "@/components/messages";
import { useScrollToBottom } from "@/components/scroll-to-bottom";
import { motion } from "framer-motion";

import { PlaceholdersAndVanishInput } from "@/components/vanish-input";
import { generateId } from "ai";
import { ClientMessage } from "@/app/(ai)/actions";
import { useUser } from "@clerk/nextjs";

export function Hero() {
  const { sendMessage } = useActions();
  const { isLoaded, isSignedIn, user } = useUser();
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

  const commonActions = [
    {
      title: "When",
      label: "When is rendercon?",
      action: "Show dates for rendercon",
    },
    {
      title: "Speakers",
      label: "Who are the speakers?",
      action: "Show speakers",
    },
    {
      title: "Where",
      label: "location",
      action: "show the location where  rendercon will be held",
    },
  ];

  const suggestedActions =
    isLoaded && isSignedIn
      ? [
          {
            title: "Speakers",
            label: "Who are the speakers?",
            action: "Show speakers",
          },
          ...commonActions,
        ]
      : [
          {
            title: "Sign in",
            label: "Sign in to Rendercon",
            action: "Show the sign in button",
          },
          ...commonActions,
        ];

  return (
    <div className="flex flex-row justify-center py-20 h-dvh w-full bg-black dark:bg-zinc-900">
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

        {isLoaded && (
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
                    className="w-full text-left border border-zinc-800  text-zinc-300 rounded-lg p-2 text-sm  hover:bg-zinc-800 transition-colors flex flex-col"
                  >
                    <span className="font-medium text-purple-500">
                      {action.title}
                    </span>
                    <span className="text-zinc-400">{action.label}</span>
                  </button>
                </motion.div>
              ))}
          </div>
        )}

        <div className="flex flex-col gap-2 relative items-center z-50">
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

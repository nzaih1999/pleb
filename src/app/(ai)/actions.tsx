"use server";
import { createAI, getMutableAIState, streamUI } from "ai/rsc";
import { createOpenAI } from "@ai-sdk/openai";
import { ReactNode } from "react";
import { z } from "zod";
import { CoreMessage, generateId } from "ai";
import DateTime from "@/components/dates-card";
import { SocialCardForm } from "@/components/social-card-form";
import { SignInButton } from "@clerk/nextjs";
import { currentUser } from "@clerk/nextjs/server";
import SignUpButton from "@/components/sign-up-button";
import { getSpeakers } from "@/lib/speakers";

import { SpeakersCard } from "@/components/expandable-card";

const groq = createOpenAI({
  baseURL: "https://api.groq.com/openai/v1",
  apiKey: process.env.GROQ_API_KEY,
});
export interface ServerMessage {
  role: "user" | "assistant";
  content: string;
}

export interface ClientMessage {
  id: string;
  role: "user" | "assistant";
  display: ReactNode;
}

export async function continueConversation(
  input: string
): Promise<ClientMessage> {
  "use server";

  const history = getMutableAIState();

  const result = await streamUI({
    model: groq("llama3-groq-70b-8192-tool-use-preview"),
    system: `You are a friendly helpful assistant helping users to get information about the biggest react focused conference called Rendercon.\nYou can use tools to help users get information about the biggest react focused conference called Rendercon`,
    messages: [
      ...(history.get() as CoreMessage[]),
      { role: "user", content: input },
    ],

    text: ({ content, done }) => {
      if (done) {
        history.done((messages: ServerMessage[]) => [
          ...messages,
          { role: "assistant", content },
        ]);
      }

      return <div>{content}</div>;
    },
    tools: {
      showRenderConDate: {
        description: "Get the dates when rendercon is happening",
        parameters: z.object({}).describe("Get the date of RenderCon"),
        generate: async function* () {
          yield <p>Getting the dates for RenderCon</p>;
          const renderConDates = {
            startDate: "october 4, 2024",
            endDate: "october 5, 2024",
          };

          history.done([
            ...(history.get() as CoreMessage[]),
            {
              role: "assistant",
              content: `The dates for rendercon are ${renderConDates.startDate} and ${renderConDates.endDate}`,
            },
          ]);

          return (
            <DateTime
              startDate={renderConDates.startDate}
              endDate={renderConDates.endDate}
            />
          );
        },
      },
      showRenderconRegistration: {
        description: "Show the registration form for rendercon",
        parameters: z
          .object({})
          .describe("Show the registration form for rendercon"),
        generate: async function* () {
          const toolCallId = generateId();
          yield <p>Getting the registration form for rendercon</p>;

          history.done([
            ...(history.get() as CoreMessage[]),
            {
              role: "assistant",
              content: [
                {
                  type: "text",
                  text: "showing registration form on the screen",
                },
              ],
            },

            {
              role: "tool",
              content: [
                {
                  type: "tool-result",
                  toolCallId,
                  toolName: "showRenderconRegistration",
                  result: "showing registration form on the screen",
                },
              ],
            },
          ]);

          return <SocialCardForm />;
        },
      },
      showSignInButton: {
        description: "Show the sign in button",
        parameters: z.object({}).describe("Show the sign in button"),
        generate: async function* () {
          const user = await currentUser();
          const toolCallId = generateId();

          yield <p>Getting the sign in button</p>;

          history.done([
            ...(history.get() as CoreMessage[]),
            {
              role: "assistant",
              content: [
                {
                  type: "text",
                  text: "checking if user is signed in on the screen",
                },
              ],
            },

            {
              role: "tool",
              content: [
                {
                  type: "tool-result",
                  toolCallId,
                  toolName: "showSignInButton",
                  result: "checking if user is signed in on the screen",
                },
              ],
            },
          ]);
          if (user) {
            return <p>User is signed in</p>;
          } else {
            return <SignUpButton />;
          }
        },
      },
      showSpeakers: {
        parameters: z.object({}).describe("Show the speakers"),
        generate: async function* () {
          const toolCallId = generateId();
          const speakers = await getSpeakers();
          yield <p>Getting the speakers</p>;

          history.done([
            ...(history.get() as CoreMessage[]),
            {
              role: "assistant",
              content: [
                {
                  type: "text",
                  text: "showing speakers on the screen",
                },
              ],
            },

            {
              role: "tool",
              content: [
                {
                  type: "tool-result",
                  toolCallId,
                  toolName: "showSpeakers",
                  result: "showing speakers on the screen",
                },
              ],
            },
          ]);

          return (
            <div className="">
              {speakers.map((speaker) => (
                <SpeakersCard speaker={speaker} key={speaker.id} />
              ))}
            </div>
          );
        },
      },
    },
  });

  return {
    id: generateId(),
    role: "assistant",
    display: result.value,
  };
}

export const AI = createAI<ServerMessage[], ClientMessage[]>({
  actions: {
    continueConversation,
  },
  initialAIState: [],
  initialUIState: [],
});

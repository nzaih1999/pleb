"use server";
import { createAI, getMutableAIState, streamUI } from "ai/rsc";
import { createOpenAI } from "@ai-sdk/openai";
import { ReactNode } from "react";
import { z } from "zod";
import { CoreMessage, generateId } from "ai";
import DateTime from "@/components/dates-card";
import { SocialCardForm } from "@/components/social-card-form";
import { SignInButton, SignUpButton } from "@clerk/nextjs";
import { currentUser } from "@clerk/nextjs/server";
import { getSpeakers } from "@/lib/speakers";

import { SpeakersCard } from "@/components/expandable-card";
import { checkSocialCard } from "@/lib/actions";
import NotSignedIn from "@/components/register-not-signed";
import { Badge } from "@/components/event-badge";
import { Loader } from "lucide-react";
import { prisma } from "@/lib/prisma";

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
          yield (
            <p className="flex">
              <Loader className="w-4 h-4 animate-spin mr-2" />
              loading{" "}
            </p>
          );
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

          yield (
            <p className="flex">
              <Loader className="w-4 h-4 animate-spin mr-2" />
              loading{" "}
            </p>
          );
          const user = await currentUser();

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

          if (!user) {
            return <SignUpButton />;
          }
          if (user) {
            return <SocialCardForm />;
          }
        },
      },
      showSignInButton: {
        description: "Show the sign in button",
        parameters: z.object({}).describe("Show the sign in button"),
        generate: async function* () {
          yield (
            <p className="flex">
              <Loader className="w-4 h-4 animate-spin mr-2" />
              loading{" "}
            </p>
          );
          const user = await currentUser();
          const toolCallId = generateId();

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
          yield (
            <p className="flex">
              <Loader className="w-4 h-4 animate-spin mr-2" />
              loading{" "}
            </p>
          );
          const toolCallId = generateId();
          const speakers = await getSpeakers();

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
      showSpeaker: {
        parameters: z.object({ name: z.string() }).describe("Show the speaker"),
        generate: async function* ({ name }) {
          const toolCallId = generateId();
          const speakers = await getSpeakers();
          const speaker = speakers.find((speaker) => speaker.fullName === name);

          yield (
            <p className="flex">
              <Loader className="w-4 h-4 animate-spin mr-2" />
              loading{" "}
            </p>
          );
          history.done([
            ...(history.get() as CoreMessage[]),
            {
              role: "assistant",
              content: [
                {
                  type: "text",
                  text: "showing speaker on the screen",
                },
              ],
            },
            {
              role: "tool",
              content: [
                {
                  type: "tool-result",
                  toolCallId,
                  toolName: "showSpeaker",
                  result: "showing speaker on the screen",
                },
              ],
            },
          ]);
          return (
            <div className="">
              {speaker ? (
                <SpeakersCard speaker={speaker} key={speaker.id} />
              ) : (
                <p>{`No speaker found with the name ${name}`}</p>
              )}
            </div>
          );
        },
      },
      showSocialCard: {
        parameters: z
          .object({})
          .describe("Show the registration form for rendercon"),
        generate: async function* () {
          yield (
            <p className="flex">
              <Loader className="w-4 h-4 animate-spin mr-2" />
              loading{" "}
            </p>
          );
          const toolCallId = generateId();
          const user = await currentUser();

          const userNumber = await prisma.user.findFirst({
            where: {
              clerkId: user?.id,
            },
          });

          const userWithSocialCard = await checkSocialCard();
          if (userWithSocialCard) {
            history.done([
              ...(history.get() as CoreMessage[]),
              {
                role: "assistant",
                content: [
                  {
                    type: "text",
                    text: "show the social card on the screen",
                  },
                ],
              },
              {
                role: "tool",
                content: [
                  {
                    type: "tool-result",
                    toolCallId,
                    toolName: "showSocialCard",
                    result: "show the social card on the screen",
                  },
                ],
              },
            ]);
            return (
              <div className="flex space-x-4 pt-16">
                <Badge user={userWithSocialCard} number={userNumber?.number} />
              </div>
            );
          } else {
            return <p>No user with social card</p>;
          }
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

"use server";
import { createAI, getMutableAIState, streamUI } from "ai/rsc";
import { createOpenAI } from "@ai-sdk/openai";
import { ReactNode } from "react";
import { z } from "zod";
import { CoreMessage, generateId } from "ai";
import DateTime from "@/components/dates-card";
import { SocialCardForm } from "@/components/social-card-form";
import { SignUpButton } from "@clerk/nextjs";
import { currentUser } from "@clerk/nextjs/server";
import { getSpeakers } from "@/lib/speakers";

import { SpeakersCard } from "@/components/expandable-card";
import { checkSocialCard } from "@/lib/actions";
import { Badge } from "@/components/event-badge";
import { Loader } from "lucide-react";
import { prisma } from "@/lib/prisma";
import Speakers from "@/components/speakers";
import { UpdateDetails } from "@/components/update-details";
import { Button } from "@/components/ui/button";
import { LoadingSpinner } from "@/components/loader";
import UserSignUp from "@/components/sign-up-button";
import CreateSocialCardAction from "@/components/create-social-card-action";
import GoogleMapsDirections from "@/components/maps";

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
    model: groq("llama-3.3-70b-versatile"),
    system: `

You are an AI assistant designed to help users with information and tasks related to RenderCon. You have access to several tools that you can use to provide information and interact with the user interface. Your task is to understand user queries, determine which tool is most appropriate, and then use that tool to assist the user.

Available tools:

1. showRenderConDate: Use this to display the dates for RenderCon.
2. showRenderconRegistration: Use this to show the registration form for RenderCon.
3. showSignInButton: Use this to display a sign-in button.
4. showSpeakers: Use this to display information about all RenderCon speakers.
5. showSpeaker: Use this to display information about a specific speaker (requires the speaker's name).
6. showSocialCard: Use this to display the user's social card for RenderCon.
7. showLocation: Use this to display the location  where RenderCon will be held.

Guidelines:

- Always use the most appropriate tool based on the user's query.
- If a user asks about dates, use the showRenderConDate tool.
-If a user asks about the location or  where RenderCon will be held, use the showLocation tool.
- For registration inquiries, use the showRenderconRegistration tool.
- If authentication is mentioned, use the showSignInButton tool.
- For general speaker information, use the showSpeakers tool.
- If a specific speaker is mentioned, use the showSpeaker tool with the provided name.
- When users ask about their social card or personal information, use the showSocialCard tool.
- If a query doesn't clearly match any tool, ask for clarification before proceeding.
- After using a tool, provide a brief explanation of what the tool did or displayed.
- Be prepared to guide users through multi-step processes.

Example interactions:

User: "When is RenderCon happening?"
Assistant: Certainly! Let me show you the dates for RenderCon.
[Use showRenderConDate tool]
The dates for RenderCon have been displayed. Is there anything else you'd like to know about the event?

User:"show me the location where will rendercon be held?"
Assistant: I can help you with that. I'll show you where RenderCon will be held.
[Use showLocation tool]
The location for RenderCon has been displayed. Is there anything else you'd like to know about the event?

User: "How can I register for the conference?"
Assistant: I'd be happy to help you with the registration process. Let me bring up the registration form for you.
[Use showRenderconRegistration tool]
The registration form for RenderCon is now displayed on your screen. You can fill it out to sign up for the conference. Do you need any assistance with the form?

User: "Tell me about the speakers at RenderCon."
Assistant: Of course! I'll show you information about all the speakers at RenderCon.
[Use showSpeakers tool]
A list of all the speakers for RenderCon has been displayed. You can see their names and brief bios. Is there a particular speaker you'd like more information about?

User: "Can you tell me more about Jane Doe?"
Assistant: Certainly! I'll pull up the specific information for Jane Doe.
[Use showSpeaker tool with name="Jane Doe"]
I've displayed the detailed information for Jane Doe on your screen. You should see her bio, topics, and any other relevant details. Is there anything specific you'd like to know about her presentation?

User: "How do I see my social card?"
Assistant: I'd be happy to help you with that. let me show you your social card.
[Use showSocialCard tool]
Your RenderCon social card should now be displayed on the screen. It contains your personal information for the conference. Is everything on the card correct, or would you like to make any changes?


Remember to always be helpful, clear, and guide the user through any processes that might require multiple steps or tools.`,
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
          yield <LoadingSpinner />;

          const user = await currentUser();
          const renderConDates = {
            startDate: "october 4, 2024",
            endDate: "october 5, 2024",
          };

          history.done([
            ...(history.get() as CoreMessage[]),
            {
              role: "assistant",
              content: `The dates for rendercon are ${renderConDates.startDate} and ${renderConDates.endDate}`,
              args: {
                renderConDates,
              },
            },
          ]);

          if (!user) {
            return (
              <DateTime
                startDate={renderConDates.startDate}
                endDate={renderConDates.endDate}
              />
            );
          }

          const socialCard = await checkSocialCard();

          if (user && socialCard) {
            return (
              <DateTime
                startDate={renderConDates.startDate}
                endDate={renderConDates.endDate}
                userId={user.id}
                socialCard={true}
              />
            );
          }

          return (
            <DateTime
              startDate={renderConDates.startDate}
              endDate={renderConDates.endDate}
              userId={user.id}
              socialCard={false}
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
          yield <LoadingSpinner />;
          const toolCallId = generateId();
          const user = await currentUser();
          history.done([
            ...(history.get() as CoreMessage[]),
            {
              role: "assistant",
              content: [
                {
                  type: "text",
                  text: "showing registration form on the screen",
                  args: {},
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
            return <UserSignUp />;
          }
          const socialCard = await checkSocialCard();

          if (user && socialCard) {
            return <UpdateDetails userWithSocialCard={socialCard} />;
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
          yield <LoadingSpinner />;
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
                  args: {},
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
            return <UserSignUp />;
          }
        },
      },
      showSpeakers: {
        parameters: z.object({}).describe("Show the speakers"),
        generate: async function* () {
          yield <LoadingSpinner />;
          const toolCallId = generateId();
          const speakers = await getSpeakers();
          const user = await currentUser();

          history.done([
            ...(history.get() as CoreMessage[]),
            {
              role: "assistant",
              content: [
                {
                  type: "text",
                  text: "showing speakers on the screen",
                  args: {
                    user: user?.id,
                  },
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

          if (!user) {
            return <Speakers speakers={speakers} />;
          }
          const socialCard = await checkSocialCard();
          if (user && socialCard) {
            return (
              <Speakers
                speakers={speakers}
                socialCard={true}
                userId={user.id}
              />
            );
          }

          return (
            <Speakers speakers={speakers} userId={user.id} socialCard={false} />
          );
        },
      },
      showSpeaker: {
        parameters: z.object({ name: z.string() }).describe("Show the speaker"),
        generate: async function* ({ name }) {
          const toolCallId = generateId();
          const speakers = await getSpeakers();
          const speaker = speakers.find((speaker) => speaker.fullName === name);

          yield <LoadingSpinner />;
          history.done([
            ...(history.get() as CoreMessage[]),
            {
              role: "assistant",
              content: [
                {
                  type: "text",
                  text: "showing speaker on the screen",
                  args: {
                    name,
                  },
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
          .describe("Show the user social card for rendercon"),
        generate: async function* () {
          yield <LoadingSpinner />;
          const toolCallId = generateId();
          const user = await currentUser();
          const userNumber = await prisma.user.findFirst({
            where: {
              clerkId: user?.id,
            },
          });

          history.done([
            ...(history.get() as CoreMessage[]),
            {
              role: "assistant",
              content: [
                {
                  type: "text",
                  text: "show the user social card on the screen",
                  args: {},
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

          if (!user) {
            return <UserSignUp />;
          }
          const userWithSocialCard = await checkSocialCard();
          if (user && userWithSocialCard) {
            return (
              <div className="flex space-x-4 pt-16">
                <Badge user={userWithSocialCard} number={userNumber?.number} />
              </div>
            );
          }

          return <CreateSocialCardAction />;
        },
      },
      showLocation: {
        parameters: z
          .object({})
          .describe("Show the location where  rendercon will be held"),
        generate: async function* () {
          yield <LoadingSpinner />;
          const toolCallId = generateId();
          const user = await currentUser();
          const userNumber = await prisma.user.findFirst({
            where: {
              clerkId: user?.id,
            },
          });

          history.done([
            ...(history.get() as CoreMessage[]),
            {
              role: "assistant",
              content: [
                {
                  type: "text",
                  text: "show the location where  rendercon will be held",
                  args: {
                    user: user?.id,
                  },
                },
              ],
            },
            {
              role: "tool",
              content: [
                {
                  type: "tool-result",
                  toolCallId,
                  toolName: "showLocation",
                  result: "showing the location on the screen",
                  args: {
                    user: user?.id,
                  },
                },
              ],
            },
          ]);

          if (!user) {
            return <GoogleMapsDirections user={false} socialCard={false} />;
          }
          const userWithSocialCard = await checkSocialCard();
          if (user && userWithSocialCard) {
            return (
              <div className=" text-center z-50    ">
                <div className="w-96">
                  <GoogleMapsDirections socialCard={true} user={true} />
                </div>
              </div>
            );
          }

          return <GoogleMapsDirections user={true} socialCard={false} />;
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
  onSetAIState: ({ state, done }) => {},
  initialAIState: [],
  initialUIState: [],
});

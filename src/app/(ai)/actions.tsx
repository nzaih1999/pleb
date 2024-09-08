"use server";
import { createAI, getMutableAIState, streamUI } from "ai/rsc";
import { createOpenAI } from "@ai-sdk/openai";
import { ReactNode } from "react";
import { z } from "zod";
import { generateId } from "ai";
import DateTime from "@/components/dates-card";
import SocialCardForm from "@/components/social-card-form";

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
    messages: [...history.get(), { role: "user", content: input }],
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

        parameters: z.object({}),
        generate: async function* () {
          yield <p>Getting the dates for RenderCon</p>;
          const renderConDates = {
            startDate: "october 4, 2024",
            endDate: "october 5, 2024",
          };

          history.done((messages: ServerMessage[]) => [
            ...messages,
            {
              role: "assistant",
              content: `Show dates for rendercon`,
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
      registerForRenderCon: {
        description: "Register for rendercon",
        parameters: z.object({}),
        generate: async function* () {
          yield <p>Registering for rendercon</p>;

          history.done((messages: ServerMessage[]) => [
            ...messages,
            {
              role: "assistant",
              content: `Register for rendercon`,
            },
          ]);

          return <SocialCardForm />;
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

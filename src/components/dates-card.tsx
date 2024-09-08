"use client";
import { ClientMessage } from "@/app/(ai)/actions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { generateId } from "ai";
import { useActions, useUIState } from "ai/rsc";
import { motion } from "framer-motion";
import { Calendar } from "lucide-react";
import { ReactNode } from "react";

interface RenderConCardProps {
  startDate: string;
  endDate: string;
}

const suggestedActions = [
  {
    title: "Register",
    label: "Register for Rendercon",
    action: "Register for Rendercon",
  },

  {
    title: "How much",
    label: "water have I used this month?",
    action: "Show water usage",
  },
];

export default function DateTime({ startDate, endDate }: RenderConCardProps) {
  const { continueConversation } = useActions();
  const [_, setConversation] = useUIState();
  return (
    <div>
      <Card className="w-full max-w-md mx-auto bg-slate-900">
        <CardHeader className="space-y-1">
          <div className="flex items-center space-x-2">
            <Calendar className="w-6 h-6 text-primary" />
            <CardTitle className="text-2xl text-purple-500 font-bold">
              RenderCon
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="font-semibold text-sm text-muted-foreground">
                Start Date:
              </span>
              <span className="text-xs text-purple-400">{startDate}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-semibold text-sm text-muted-foreground">
                End Date:
              </span>
              <span className="text-xs text-purple-400">{endDate}</span>
            </div>
            <p className="text-sm text-muted-foreground mt-4">
              Join us for exciting talks, workshops, and networking
              opportunities!
            </p>
          </div>
        </CardContent>
      </Card>
      <div className="grid  sm:grid-cols-2 gap-2 w-full px-4 md:px-0 mx-auto md:max-w-[500px] my-4 z-50 ">
        {suggestedActions.map((action, index) => (
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
    </div>
  );
}

"use client";
import { ReactNode, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useAction } from "next-safe-action/hooks";
import { motion } from "framer-motion";

import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { registerForm } from "@/lib/actions";
import { SquareArrowDownIcon } from "lucide-react";
import { useActions, useUIState } from "ai/rsc";
import { ClientMessage } from "@/app/(ai)/actions";
import { generateId } from "ai";

const registrationSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters."),
  lastName: z.string().min(2, "Last name must be at least 2 characters."),
  companyName: z.string().min(2, "Company name must be at least 2 characters."),
  profession: z.string().min(2, "Profession must be at least 2 characters."),
  email: z.string().email("Please enter a valid email address."),
});

type RegistrationSchema = z.infer<typeof registrationSchema>;

export function SocialCardForm({}: {}) {
  const { continueConversation } = useActions();
  const [_, setConversation] = useUIState();
  const [updatedDetails, setUpdatedDetails] = useState<boolean>(false);
  const form = useForm<RegistrationSchema>({
    resolver: zodResolver(registrationSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      companyName: "",
      profession: "",
      email: "",
    },
  });

  const suggestedActions = [
    {
      title: "View",
      label: "View Your Card",
      action: "Show your card",
    },

    {
      title: "Speakers",
      label: "Who are the speakers?",
      action: "Show speakers",
    },
    {
      title: "When",
      label: "When is rendercon?",
      action: "Show dates for rendercon",
    },
  ];

  const { execute: register, status } = useAction(registerForm, {
    onSuccess: ({ data }) => {
      if (data?.success) {
        setUpdatedDetails(true);
      }
    },
    onError: () => {
      console.log("error");
    },
  });

  return (
    <div>
      <div className="max-w-2xl mx-auto p-8 bg-gray-900 text-purple-500 font-mono relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCI+CiAgPHBhdGggZD0iTTAgMGg2MHY2MEgweiIgZmlsbD0ibm9uZSIgLz4KICA8cGF0aCBkPSJNMCAwdjYwaDYwVjBIMHptNTggNThIMlYyaDU2djU2eiIgZmlsbD0icmdiYSgwLCAyNTUsIDAsIDAuMDMpIiAvPgo8L3N2Zz4=')] bg-repeat" />
        <div className="relative z-10">
          <h1 className="text-2xl font-bold mb-6 cursor-pointer select-none">
            REGISTER FOR RENDERCON
          </h1>
          <p className="mb-6 text-sm">
            By entering your information, you acknowledge you have read our{" "}
            <Link href="#" className="text-slate-500 hover:underline">
              Privacy Protocol v2.1
            </Link>
            .
          </p>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(register)} className="space-y-4">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs uppercase tracking-wider">
                      FIRST_NAME
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          {...field}
                          placeholder="Jane"
                          className="h-12 bg-gray-800 border-2 border-purple-500 rounded-none text-purple-500 placeholder-green-700 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        />
                        <div className="absolute right-2 top-1/2 transform -translate-y-1/2 w-2 h-2 bg-purple-500 animate-pulse" />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs uppercase tracking-wider">
                      LAST_NAME
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          {...field}
                          placeholder="Doe"
                          className="h-12 bg-gray-800 border-2 border-purple-500 rounded-none text-purple-500 placeholder-green-700 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        />
                        <div className="absolute right-2 top-1/2 transform -translate-y-1/2 w-2 h-2 bg-purple-500 animate-pulse" />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="companyName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs uppercase tracking-wider">
                      COMPANY_NAME
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          {...field}
                          placeholder="Acme Inc."
                          className="h-12 bg-gray-800 border-2 border-purple-500 rounded-none text-purple-500 placeholder-green-700 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        />
                        <div className="absolute right-2 top-1/2 transform -translate-y-1/2 w-2 h-2 bg-purple-500 animate-pulse" />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="profession"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs uppercase tracking-wider">
                      PROFESSION
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          {...field}
                          placeholder="Software Engineer"
                          className="h-12 bg-gray-800 border-2 border-purple-500 rounded-none text-purple-500 placeholder-green-700 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        />
                        <div className="absolute right-2 top-1/2 transform -translate-y-1/2 w-2 h-2 bg-purple-500 animate-pulse" />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs uppercase tracking-wider">
                      WORK_EMAIL
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          {...field}
                          type="email"
                          placeholder="jane@acme.com"
                          className="h-12 bg-gray-800 border-2 border-purple-500 rounded-none text-purple-500 placeholder-green-700 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        />
                        <div className="absolute right-2 top-1/2 transform -translate-y-1/2 w-2 h-2 bg-purple-500 animate-pulse" />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                className="w-full h-12 bg-purple-600 hover:bg-purple-700 text-black rounded-none uppercase tracking-wider transition-all duration-300 ease-in-out transform hover:scale-105 relative group/btn"
                disabled={status === "executing"}
              >
                {status === "executing" ? (
                  <>
                    <SquareArrowDownIcon className="mr-2 h-4 w-4 animate-spin" />{" "}
                    PROCESSING...
                  </>
                ) : (
                  <>INITIATE_REGISTRATION</>
                )}
                <BottomGradient />
              </Button>
            </form>
          </Form>
        </div>
        <div className="absolute bottom-2 right-2 text-xs text-slate-500">
          &copy; RenderCon v2.0.0
        </div>
      </div>
      <div className="flex gap-4 my-4 items-center justify-center">
        {updatedDetails &&
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
                <span className="text-purple-400 text-sm font-medium ">
                  {action.label}
                </span>
              </button>
            </motion.div>
          ))}
      </div>
    </div>
  );
}

const BottomGradient = () => {
  return (
    <>
      <span className="group-hover/btn:opacity-100 block transition duration-500 opacity-0 absolute h-px w-full -bottom-px inset-x-0 bg-gradient-to-r from-transparent via-cyan-500 to-transparent" />
      <span className="group-hover/btn:opacity-100 blur-sm block transition duration-500 opacity-0 absolute h-px w-1/2 mx-auto -bottom-px inset-x-10 bg-gradient-to-r from-transparent via-indigo-500 to-transparent" />
    </>
  );
};

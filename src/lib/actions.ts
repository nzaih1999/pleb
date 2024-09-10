"use server";

import { z } from "zod";
import { actionClient } from "./safe-actions";

const formSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  companyName: z.string().min(1, "Company name is required"),
  profession: z.string().min(1, "Profession is required"),
  email: z.string().email("Invalid email address"),
  website: z.string().url("Invalid URL"),
});

const userSchema = z.object({
  id: z.string().cuid(),
  email: z.string().email(),
  firstName: z.string().optional(),
  username: z.string().optional(),
  lastName: z.string().optional(),
});

// This schema is used to validate input from client.

export const registerForm = actionClient
  .schema(formSchema)
  .action(
    async ({
      parsedInput: {
        companyName,
        email,
        firstName,
        lastName,
        profession,
        website,
      },
    }) => {
      return { failure: "Incorrect credentials" };
    }
  );

import { auth } from "@clerk/nextjs/server";
import { prisma } from "./prisma";
// app/actions/user.ts

export const saveUser = actionClient
  .schema(userSchema)
  .action(async ({ parsedInput }) => {
    const { userId } = auth();

    if (!userId) {
      throw new Error("User not authenticated");
    }
    const { email, id, firstName, lastName, username } = parsedInput;
    const checkUser = await prisma.user.findUnique({
      where: {
        clerkId: userId,
      },
    });

    if (checkUser) {
      return { success: true, user: checkUser };
    }

    try {
      const user = await prisma.user.create({
        data: {
          clerkId: userId,
          id,
          email,
          firstName,
          lastName,
          username,
        },
      });
      return { success: true, user };
    } catch (error) {
      console.error("Error saving user:", error);
      return { success: false, error: "Failed to save user" };
    }
  });

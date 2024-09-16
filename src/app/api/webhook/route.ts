import { prisma } from "@/lib/prisma";
import type { WebhookEvent } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const evt = (await req.json()) as WebhookEvent;

    const { id: clerkUserId } = evt.data;
    if (!clerkUserId)
      return NextResponse.json(
        { error: "No user ID provided" },
        { status: 400 }
      );

    let user = null;
    switch (evt.type) {
      case "user.created": {
        user = await prisma.user.upsert({
          where: {
            clerkId: clerkUserId,
          },
          update: {
            clerkId: clerkUserId,
          },
          create: {
            clerkId: clerkUserId,
          },
        });
        break;
      }
      case "user.deleted": {
        user = await prisma.user.delete({
          where: {
            clerkId: clerkUserId,
          },
          include: {
            socialCard: true,
          },
        });
        break;
      }
      default:
        break;
    }
    console.log(user);

    return NextResponse.json({ user });
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
}

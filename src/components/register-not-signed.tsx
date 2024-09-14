"use client";
import { useClerk } from "@clerk/nextjs";
import React from "react";
import { Button } from "./ui/button";

const NotSignedIn = () => {
  const { openSignIn } = useClerk();

  return (
    <div className=" space-y-4">
      <h1 className="text-xl">
        You&apos;re not signed in! Please sign in to continue
      </h1>
      <Button onClick={() => openSignIn()}>sign in to continue</Button>
    </div>
  );
};

export default NotSignedIn;

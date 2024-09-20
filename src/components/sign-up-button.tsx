import { SignUpButton } from "@clerk/nextjs";
import React from "react";
import { Button } from "./ui/button";

const UserSignUp = () => {
  return (
    <div className="space-y-4">
      <p>Don&apos;t have an account?</p>
      <SignUpButton>
        <Button className="text-purple-600">Create your account</Button>
      </SignUpButton>
    </div>
  );
};

export default UserSignUp;

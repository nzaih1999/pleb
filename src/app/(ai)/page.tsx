"use client";
import { Hero } from "@/components/hero";
import { PlaceholdersAndVanishInput } from "@/components/vanish-input";
import Image from "next/image";
import { useState } from "react";

export default function Home() {
  const placeholders = [
    "What's the first rule of Fight Club?",
    "Who is Tyler Durden?",
    "Where is Andrew Laeddis Hiding?",
    "Write a Javascript method to reverse a string",
    "How to assemble your own PC?",
  ];
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log(e.target.value);
  };

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("submitted");
  };
  return (
    <main className="min-h-screen h-full max-l mx-auto">
      <Hero />
    </main>
  );
}

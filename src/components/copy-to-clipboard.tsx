"use client";
import React from "react";
import { XIcon, Linkedin, Twitter } from "lucide-react";

const SocialShareButtons = ({ url, title }: { url: string; title: string }) => {
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  const shareToX = () => {
    window.open(
      `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
      "_blank"
    );
  };

  const shareToLinkedIn = () => {
    window.open(
      `https://www.linkedin.com/shareArticle?mini=true&url=${encodedUrl}&title=${encodedTitle}`,
      "_blank"
    );
  };

  const buttonClass =
    "flex items-center gap-2 px-4 py-2 text-sm font-medium text-white rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2";

  return (
    <div className="flex space-x-4">
      <button
        onClick={shareToX}
        className={`${buttonClass} bg-black hover:bg-gray-800 focus:ring-gray-500 z-50`}
      >
        Share on 𝕏
      </button>
      <button
        onClick={shareToLinkedIn}
        className={`${buttonClass} bg-blue-600 hover:bg-blue-700 focus:ring-blue-500 z-50`}
      >
        <Linkedin size={16} />
        Share on LinkedIn
      </button>
    </div>
  );
};

export default SocialShareButtons;

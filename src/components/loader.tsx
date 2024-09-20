import { Loader2, Loader } from "lucide-react";
import React from "react";

export const LoadingSpinner = () => {
  return (
    <p className="flex items-center">
      <Loader className="w-4 h-4 animate-spin mr-2" />
      loading{" "}
    </p>
  );
};

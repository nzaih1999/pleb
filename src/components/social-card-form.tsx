"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useAction } from "next-safe-action/hooks";

export default function SocialCardForm() {
  const { execute, isPending } = useAction();
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());
    console.log(data);
  };
  return (
    <div className="max-w-2xl mx-auto p-8 bg-gray-900 text-purple-500 font-mono relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCI+CiAgPHBhdGggZD0iTTAgMGg2MHY2MEgweiIgZmlsbD0ibm9uZSIgLz4KICA8cGF0aCBkPSJNMCAwdjYwaDYwVjBIMHptNTggNThIMlYyaDU2djU2eiIgZmlsbD0icmdiYSgwLCAyNTUsIDAsIDAuMDMpIiAvPgo8L3N2Zz4=')] bg-repeat" />
      <div className="relative z-10">
        <h1 className="text-2xl font-bold mb-6 cursor-pointer select-none">
          REGISTER FOR RENDERCON
        </h1>
        <p className="mb-6 text-sm">
          By entering your information, you acknowledge you have read our{" "}
          <a href="#" className="text-slate-500 hover:underline">
            Privacy Protocol v2.1
          </a>
          .
        </p>
        <form className="grid grid-cols-2 gap-6" onSubmit={handleSubmit}>
          {[
            { id: "firstName", label: "FIRST_NAME", placeholder: "Jane" },
            { id: "lastName", label: "LAST_NAME", placeholder: "Doe" },
            {
              id: "companyName",
              label: "COMPANY_NAME",
              placeholder: "Acme Inc.",
            },
            {
              id: "profession",
              label: "PROFESSION",
              placeholder: "Software Engineer",
            },
            {
              id: "email",
              label: "WORK_EMAIL",
              placeholder: "jane@acme.com",
              type: "email",
            },
            {
              id: "website",
              label: "COMPANY_WEBSITE",
              placeholder: "https://acme.com",
              type: "url",
            },
          ].map((field) => (
            <div key={field.id} className="space-y-2">
              <Label
                htmlFor={field.id}
                className="text-xs uppercase tracking-wider"
              >
                {field.label}
              </Label>
              <div className="relative">
                <Input
                  id={field.id}
                  placeholder={field.placeholder}
                  type={field.type || "text"}
                  className="h-12 bg-gray-800 border-2 border-purple-500 rounded-none text-purple-500 placeholder-green-700 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  required
                />
                <div className="absolute right-2 top-1/2 transform -translate-y-1/2 w-2 h-2 bg-purple-500 animate-pulse" />
              </div>
            </div>
          ))}

          <Button
            type="submit"
            className="col-span-2 h-12 bg-purple-600 hover:bg-purple-700 text-black rounded-none uppercase tracking-wider transition-all duration-300 ease-in-out transform hover:scale-105"
          >
            INITIATE_REGISTRATION
          </Button>
        </form>
      </div>
      <div className="absolute bottom-2 right-2 text-xs text-slate-500">
        &copy; RenderCon v2.0.0
      </div>
    </div>
  );
}

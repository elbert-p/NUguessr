"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import "@fontsource/open-sans";
import "@fontsource/titillium-web";
import { useUser } from "../../hooks/use-user";
import { createClient } from "@/lib/supabase/client";
import { useState, useMemo } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { SignInButton } from "@/components/signin-button";

export default function HomePage() {
  const { user } = useUser();
  const supabase = createClient();
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next");

  // Generate a random link with 5 unique random numbers (between 1 and 55)
  const randomLink = useMemo(() => {
    // Create an array of numbers from 1 to 55.
    const numbers = Array.from({ length: 55 }, (_, i) => i + 1);
    // Shuffle the numbers using the Fisher-Yates algorithm.
    for (let i = numbers.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [numbers[i], numbers[j]] = [numbers[j], numbers[i]];
    }
    // Take the first 5 numbers and join them with a hyphen.
    const fiveNumbers = numbers.slice(0, 5);
    return `/play/${fiveNumbers.join("-")}`;
  }, []);

  // Function to reset game-related localStorage values.
  const resetGame = () => {
    localStorage.removeItem("score");
    localStorage.removeItem("processedRound");
    localStorage.removeItem("finalScore");
  };

  return (
    <div
      className="min-h-screen w-full flex flex-col items-center bg-no-repeat bg-fixed"
      style={{
        backgroundImage: "url('/background.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="absolute top-4 right-4">
        <SignInButton />
      </div>
      <div className="w-full flex flex-col items-center pt-4 md:pt-8">
        <Image
          src="/logo.png"
          alt="NUGuessr Logo"
          width={300}
          height={500}
          className="mx-auto"
          priority
        />
      </div>

      <main className="text-center z-10 relative px-6 py-8 w-full max-w-4xl mx-auto mt-4 bg-gray-800/60 rounded-xl backdrop-blur-[2px]">
        <div className="space-y-4 mb-4">
          <p
            className="text-5xl font-[1000] text-white"
            style={{ textShadow: "0 2px 4px rgba(0,0,0,0.5)" }}
          >
            Think you know your school well?
          </p>
          <p
            className="text-4xl font-[1000] text-white"
            style={{ textShadow: "0 2px 4px rgba(0,0,0,0.5)" }}
          >
            Want to familiarize yourself with the campus?
          </p>
          <div className="pt-4">
            <Link
              href={randomLink}
              onClick={resetGame}
              className="text-white inline-block mb-8 bg-red-600 hover:bg-red-700 py-4 px-20 rounded-full text-2xl shadow-lg transition-all hover:scale-105"
              style={{ textShadow: "0 2px 4px rgba(0,0,0,0.5)" }}
            >
              <span
                className="text-white-300 text-3xl font-[Open_Sans] transition-colors hover:text-red-100"
              >
                Test your skills!
              </span>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}

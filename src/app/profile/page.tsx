"use client";

import { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useUser } from "../../../hooks/use-user";
import { SignOutButton } from "@/components/signout-button";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import Image from "next/image";
import {
  MapPin,
  Edit2,
  Save,
  BarChartIcon as ChartBar,
  GamepadIcon,
  Star,
  BarChart2,
  Trophy,
} from "lucide-react"
import { Progress } from "@/components/ui/progress"
export default function ProfilePage() {
  const [isEditingUsername, setIsEditingUsername] = useState(false);
  const { user } = useUser();  // Assuming `useUser` hook fetches authenticated user data
  const supabaseClient = createClient();

  const [username, setUsername] = useState(user?.user_metadata.name || "");
  const [gamesPlayed, setGamesPlayed] = useState<number | null>(null);  // Initialize as null
  const [highScore, setHighScore] = useState<number | null>(null);  // Initialize as null
  const [avgScore, setAvgScore] = useState<number | null>(null);  // Initialize as null
  const [profImage, setProfileImage] = useState<string>("/placeholder.svg?height=112&width=112");
  const router = useRouter();

  // Fetch the user's total games from the database
  useEffect(() => {
    if (user?.id) {
      const fetchTotalGames = async () => {
        const { data, error } = await supabaseClient
          .from("users")
          .select("total_games")
          .eq("id", user.id)
          .single();

        if (error) {
          console.error("Error fetching total games:", error);
        } else {
          setGamesPlayed(data?.total_games ?? 0);  // Default to 0 if no total_games is found
        }
      }
      const fetchHighScore = async () => {
        const { data, error } = await supabaseClient
          .from("users")
          .select("high_score")
          .eq("id", user.id)
          .single();

        if (error) {
          console.error("Error fetching total games:", error);
        } else {
          setHighScore(data?.high_score ?? 0);  // Default to 0 if no high is found
        }
      }
      const fetchAvgScore = async () => {
        const { data, error } = await supabaseClient
          .from("users")
          .select("avg_score")
          .eq("id", user.id)
          .single();

        if (error) {
          console.error("Error fetching total games:", error);
        } else {
          setAvgScore(data?.avg_score ?? 0);  // Default to 0 if no avg is found
        }
      };

      fetchTotalGames();
      fetchHighScore();
      fetchAvgScore();
    }
  }, [user?.id, supabaseClient]);  // Only run when user changes or user.id is available

  // Generate a random link with 5 unique random numbers (between 1 and 55)
  const randomLink = useMemo(() => {
    // Create an array of numbers from 1 to 55.
    const numbers = Array.from({ length: 55 }, (_, i) => i + 1)
    // Shuffle the numbers using the Fisher-Yates algorithm.
    for (let i = numbers.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[numbers[i], numbers[j]] = [numbers[j], numbers[i]]
    }
    // Take the first 5 numbers and join them with a hyphen.
    const fiveNumbers = numbers.slice(0, 5)
    return `/play/${fiveNumbers.join("-")}`
  }, [])

  const navigateLeaderboard = () => {
    router.push("/leaderboards");
  };

  const navigatePlay = () => {
    router.push(randomLink);
  };

  return (
    <div className="h-screen flex flex-col bg-white overflow-hidden">
      <div className="flex-1 container px-4 py-4">
        <div className="h-full grid gap-4 md:grid-cols-[1fr_2fr] md:grid-rows-[1fr_auto]">
          {/* Profile Section */}
          <div className="h-full">
            <Card className="h-full shadow-lg">
              <CardContent className="h-full flex flex-col items-center justify-center gap-4 p-4">
                <Image
                  src="/logo.png"
                  alt="NUGuessr Logo"
                  width={300}
                  height={500}
                  className="flex flex-col items-center justify-center mx-auto"
                  priority
                />
                <div className="flex flex-col items-center justify-center gap-4 mt-8">
                  <div className="relative">
                    {profImage ? (
                      <img
                        src={user?.user_metadata.avatar_url}
                        alt="Profile picture"
                        className="h-full w-full rounded-full object-cover"
                      />
                    ) : (
                      <span className="text-3xl text-gray-500"></span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    {isEditingUsername ? (
                      <div className="flex items-center gap-2">
                        <Input
                          value={username}
                          onChange={(e) => setUsername(e.target.value)}
                          className="max-w-[200px] border-primary focus-visible:ring-primary"
                        />
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => setIsEditingUsername(false)}
                          aria-label="Save username"
                          className="text-primary hover:text-primary/90 hover:bg-primary/10"
                        >
                          <Save className="h-4 w-4" />
                        </Button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <span className="text-xl font-bold text-primary">{username}</span>
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => setIsEditingUsername(true)}
                          aria-label="Edit username"
                          className="text-primary hover:text-primary/90 hover:bg-primary/10"
                        >
                          <Edit2 className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                  </div>
                  <SignOutButton />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Stats Section */}
          <div className="flex flex-col gap-4">
            <Card className="flex-1 shadow-lg">
              <CardHeader className="pb-2 pt-4 px-4">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <ChartBar className="h-5 w-5 text-primary" />
                  Stats
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                <div className="grid grid-cols-1 gap-4">
                  <div className="flex items-center justify-between p-4 rounded-lg bg-gray-50">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-full bg-primary/10">
                        <GamepadIcon className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Games Played</p>
                        <p className="text-2xl font-bold text-primary">{gamesPlayed !== null ? gamesPlayed : "Loading..."}</p> {/* Displaying total games */}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-4 rounded-lg bg-gray-50">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-full bg-primary/10">
                        <Star className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">High Score</p>
                        <p className="text-2xl font-bold text-primary">24740</p> {/* Displaying high score */}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-4 rounded-lg bg-gray-50">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-full bg-primary/10">
                        <BarChart2 className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Average Score</p>
                        <p className="text-2xl font-bold text-primary">18544</p> {/* Displaying average score */}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="space-y-4">
              {/* Leaderboards Button */}
              <Button
                variant="outline"
                className="w-full h-12 text-lg font-bold border-2 border-primary text-primary hover:bg-primary hover:text-white transition-colors"
                onClick={navigateLeaderboard}
              >
                <Trophy className="mr-2 h-5 w-5" /> Leaderboards
              </Button>

              {/* Progress Indicator */}
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between text-sm px-1">
                  <span className="text-muted-foreground">% of NEU Landmarks Discovered</span>
                  <span className="font-medium text-primary">75%</span>
                </div>
                <Progress value={75} className="h-2" />
              </div>
            </div>
          </div>

          {/* Play Button */}
          <Button
            className="h-16 w-full col-span-2 rounded-none text-2xl font-bold shadow-lg bg-primary hover:bg-primary/90 transition-colors text-white"
            onClick={navigatePlay}
          >
            <div className="flex items-center justify-center gap-4">
              <MapPin className="h-8 w-8" />
              Play!
            </div>
          </Button>
        </div>
      </div>
    </div>
  );
}
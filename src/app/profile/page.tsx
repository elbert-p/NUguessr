"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import '@fontsource/titillium-web'

import { MapPin, Trophy, Edit2, Save, Camera } from "lucide-react"

export default function ProfilePage() {
  const [isEditingUsername, setIsEditingUsername] = useState(false)
  const [username, setUsername] = useState("NUExplorer")

  const leaderboardData = [
    { rank: 1, username: "Kanghosaeyo", score: 2500 },
    { rank: 2, username: "Philyshark7", score: 2350 },
    { rank: 3, username: "Joshuaa_chann", score: 2200 },
    { rank: 4, username: "Alantai26", score: 2100 },
    { rank: 5, username: "Joldemorts", score: -10 },
  ]

  return (
    <div className="h-screen flex flex-col bg-white">
      <div className="h-[80vh] container px-4 py-6">
        <div className="grid h-full gap-6 md:grid-cols-[1fr_2fr]">
          <div>
            <Card className="h-full shadow-lg">
              <CardContent className="h-full flex flex-col items-center justify-center gap-6 p-6">
                <div className="relative">
                  <Avatar className="h-28 w-28 border-4 border-primary">
                    <AvatarImage src="/placeholder.svg?height=112&width=112" alt="Profile picture" />
                    <AvatarFallback className="text-3xl bg-primary text-white">NU</AvatarFallback>
                  </Avatar>
                  <Button
                    size="icon"
                    className="absolute bottom-0 right-0 rounded-full bg-primary hover:bg-primary/90 text-white"
                    aria-label="Change profile picture"
                  >
                    <Camera className="h-4 w-4" />
                  </Button>
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
              </CardContent>
            </Card>
          </div>

          {/* Leaderboard Section */}
          <Card className="h-full shadow-lg">
            <CardHeader className="pb-2 pt-4">
              <CardTitle className="flex items-center gap-2 text-xl">
                <Trophy className="h-5 w-5 text-primary" />
                Leaderboard
              </CardTitle>
            </CardHeader>
            <CardContent className="overflow-auto">
              <div className="space-y-2">
                {leaderboardData.map((entry) => (
                  <div
                    key={entry.rank}
                    className={`flex items-center justify-between rounded-lg p-3 transition-colors ${
                      entry.username === username ? "bg-primary/10" : "hover:bg-gray-50"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className={`flex h-8 w-8 items-center justify-center rounded-full font-bold text-white
                          ${entry.rank === 1 ? "bg-primary" : ""}
                          ${entry.rank === 2 ? "bg-primary/80" : ""}
                          ${entry.rank === 3 ? "bg-primary/60" : ""}
                          ${entry.rank > 3 ? "bg-primary/40" : ""}
                        `}
                      >
                        {entry.rank}
                      </span>
                      <span className="font-semibold">{entry.username}</span>
                    </div>
                    <span className="font-mono font-bold text-primary">{entry.score}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Play Button - 20vh */}
      <Button className="h-[20vh] w-full rounded-none text-3xl font-bold shadow-lg bg-primary hover:bg-primary/90 transition-colors text-white">
        <div className="flex items-center justify-center gap-4">
          <MapPin className="h-10 w-10" />
          Play!
        </div>
      </Button>
    </div>
  )
}
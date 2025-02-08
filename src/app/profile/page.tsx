"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import {
  MapPin,
  Edit2,
  Save,
  Camera,
  BarChartIcon as ChartBar,
  GamepadIcon,
  Star,
  BarChart2,
  Trophy,
} from "lucide-react"
import { Progress } from "@/components/ui/progress"

export default function ProfilePage() {
  const [isEditingUsername, setIsEditingUsername] = useState(false)
  const [username, setUsername] = useState("NUExplorer")
  const [profileImage, setProfileImage] = useState<string>("/placeholder.svg?height=112&width=112")
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        alert("Please upload an image file")
        return
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert("Image size should be less than 5MB")
        return
      }

      const reader = new FileReader()
      reader.onload = (e) => {
        setProfileImage(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleAvatarClick = () => {
    fileInputRef.current?.click()
  }

  return (
    <div className="h-screen flex flex-col bg-white">
      {/* Main Content Area - 80vh */}
      <div className="h-[80vh] container px-4 py-4">
        <div className="grid h-full gap-4 md:grid-cols-[1fr_2fr] md:grid-rows-[1fr_auto_auto]">
          {/* Profile Section */}
          <div>
            <Card className="h-full shadow-lg">
              <CardContent className="h-full flex flex-col items-center justify-center gap-4 p-4">
                <div className="relative">
                  <Avatar
                    className="h-28 w-28 border-4 border-primary cursor-pointer transition-transform hover:scale-105"
                    onClick={handleAvatarClick}
                  >
                    <AvatarImage src={profileImage} alt="Profile picture" />
                    <AvatarFallback className="text-3xl bg-primary text-white">NU</AvatarFallback>
                  </Avatar>
                  <Button
                    size="icon"
                    className="absolute bottom-0 right-0 rounded-full bg-primary hover:bg-primary/90 text-white"
                    aria-label="Change profile picture"
                    onClick={handleAvatarClick}
                  >
                    <Camera className="h-4 w-4" />
                  </Button>
                  <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    accept="image/*"
                    onChange={handleImageUpload}
                    aria-label="Upload profile picture"
                  />
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

          {/* Stats Section */}
          <div className="flex flex-col gap-4">
            <Card className="shadow-lg">
              <CardHeader className="pb-2 pt-4">
                <CardTitle className="flex items-center gap-2 text-xl">
                  <ChartBar className="h-5 w-5 text-primary" />
                  Stats
                </CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col justify-between h-[calc(100%-4rem)] p-4">
                <div className="grid grid-cols-1 gap-4">
                  <div className="flex items-center justify-between p-4 rounded-lg bg-gray-50">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-full bg-primary/10">
                        <GamepadIcon className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Games Played</p>
                        <p className="text-2xl font-bold text-primary">24</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-4 rounded-lg bg-gray-50">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-full bg-primary/10">
                        <Star className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Total Score</p>
                        <p className="text-2xl font-bold text-primary">1,250</p>
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
                        <p className="text-2xl font-bold text-primary">52</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Leaderboards Button */}
            <Button
              variant="outline"
              className="h-14 text-xl font-bold border-2 border-primary text-primary hover:bg-primary hover:text-white transition-colors"
            >
              <Trophy className="mr-2 h-5 w-5" /> Leaderboards
            </Button>

            {/* Progress Indicator - Moved here */}
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">% of NEU Landmarks Discovered</span>
                <span className="font-medium text-primary">75%</span>
              </div>
              <Progress value={75} className="h-2" />
            </div>
          </div>

          {/* Play Button - 20vh */}
          <Button className="h-[20vh] w-full col-span-2 rounded-none text-3xl font-bold shadow-lg bg-primary hover:bg-primary/90 transition-colors text-white">
            <div className="flex items-center justify-center gap-4">
              <MapPin className="h-10 w-10" />
              Play!
            </div>
          </Button>
        </div>
      </div>
    </div>
  )
}
"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { MapPin, Target, Ruler, Trophy, RotateCcw } from "lucide-react"

export default function ResultsPage() {
  // Example results data - replace with actual data from your game state
  const results = {
    score: 850,
    distance: 127, // meters
    actualLocation: "Snell Library",
    guessedLocation: "Curry Student Center",
  }

  return (
    <div className="h-screen flex flex-col bg-white">
      {/* Header - 10vh */}
      <header className="h-[10vh] flex items-center justify-center bg-[#D41B2C] shadow-md">
        <h1 className="text-3xl font-bold text-white">Results</h1>
      </header>

      {/* Main Content - 90vh */}
      <main className="flex-1 grid grid-cols-1 md:grid-cols-[2fr_1fr] gap-6 p-6">
        {/* Map Section */}
        <div className="relative">
          <Card className="h-full">
            <CardContent className="p-4 h-full">
              <div className="relative h-full rounded-lg overflow-hidden">
                <Image
                  src="/placeholder.svg?height=1080&width=1920"
                  alt="Campus Map"
                  fill
                  className="object-cover"
                  priority
                />
                {/* Actual Location Pin */}
                <div className="absolute top-1/2 left-1/3 transform -translate-x-1/2 -translate-y-1/2">
                  <Target className="h-8 w-8 text-primary" strokeWidth={3} />
                </div>
                {/* Guessed Location Pin */}
                <div className="absolute top-2/3 left-2/3 transform -translate-x-1/2 -translate-y-1/2">
                  <MapPin className="h-8 w-8 text-primary" strokeWidth={3} />
                </div>
                {/* SVG Line connecting the points */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none">
                  <line
                    x1="33.33%"
                    y1="50%" // Actual location
                    x2="66.67%"
                    y2="66.67%" // Guessed location
                    stroke="#D41B2C"
                    strokeWidth="2"
                    strokeDasharray="5,5"
                  />
                </svg>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Results Section */}
        <div className="flex flex-col gap-6">
          {/* Score Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="h-5 w-5 text-primary" />
                Score
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-primary text-center">{results.score}</div>
            </CardContent>
          </Card>

          {/* Distance Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Ruler className="h-5 w-5 text-primary" />
                Distance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-primary text-center">{results.distance}m</div>
            </CardContent>
          </Card>

          {/* Locations Card */}
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Target className="h-5 w-5 text-primary mt-1" />
                  <div>
                    <p className="text-sm text-muted-foreground">Actual Location</p>
                    <p className="font-semibold">{results.actualLocation}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-primary mt-1" />
                  <div>
                    <p className="text-sm text-muted-foreground">Your Guess</p>
                    <p className="font-semibold">{results.guessedLocation}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Play Again Button */}
          <Button className="w-full h-16 text-xl font-bold bg-primary hover:bg-primary/90">
            <RotateCcw className="mr-2 h-5 w-5" /> Play Again
          </Button>
        </div>
      </main>
    </div>
  )
}

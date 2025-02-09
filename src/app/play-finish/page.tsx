"use client"

import { useSearchParams, useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import dynamic from "next/dynamic"
import "leaflet/dist/leaflet.css"
import { RotateCcw, Home } from "lucide-react"
import { SignInButton } from "@/components/signin-button"
import { useState, useMemo } from "react";
import { useUser } from "../../../hooks/use-user"

// Dynamically import map components to avoid SSR issues
const MapContainer = dynamic(() => import("react-leaflet").then((mod) => mod.MapContainer), { ssr: false })
const TileLayer = dynamic(() => import("react-leaflet").then((mod) => mod.TileLayer), { ssr: false })
const Marker = dynamic(() => import("react-leaflet").then((mod) => mod.Marker), { ssr: false })

const MAX_POSSIBLE_SCORE = 25000 // Maximum possible score for reference

export default function PlayFinishPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const totalScore = Number(searchParams.get("totalScore") || "0")
  const scorePercentage = (totalScore / MAX_POSSIBLE_SCORE) * 100
  const { user } = useUser()

  // Mock data for pin locations - replace with actual game data
  const pinLocations = [
    { lat: 42.3398, lng: -71.0892 }, // Boston
    { lat: 48.8566, lng: 2.3522 }, // Paris
    { lat: -23.5505, lng: -46.6333 }, // São Paulo
    { lat: 41.9028, lng: 12.4964 }, // Rome
  ]

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

  return (
    <div className="h-screen flex flex-col bg-white overflow-hidden">
      {/* Main Content */}
      <main className="flex-1 container mx-auto px-4 flex flex-col items-center justify-between gap-4 py-4">
        {/* Map Card */}
        <Card className="w-full shadow-xl">
          <CardContent className="p-0 relative h-[45vh]">
            <MapContainer
              center={[20, 0]} // Center the map to show most continents
              zoom={2}
              className="w-full h-full"
              scrollWheelZoom={false}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              />
              {pinLocations.map((location, index) => (
                <Marker key={index} position={[location.lat, location.lng]} />
              ))}
            </MapContainer>
          </CardContent>
        </Card>

        {/* Game Finished Message and Score */}
        <div className="text-center space-y-4 w-full max-w-2xl">
          <h1 className="text-4xl font-bold text-primary">Game finished, well done!</h1>
          <p className="text-2xl text-muted-foreground">
            Your total score was <span className="font-bold text-primary">{totalScore.toLocaleString()}</span> points
          </p>
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-muted-foreground px-1">
              <span>Score</span>
              <span>{scorePercentage.toFixed(1)}%</span>
            </div>
            <Progress value={scorePercentage} className="h-2" />
          </div>
          <p className="text-4xl text-muted-foreground py-4">
          {user?.email ? "" : "Log in to save your score!"}
          </p>
        </div>

        {/* Navigation Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 w-full max-w-2xl">
          <Button
            variant="outline"
            className="flex-1 h-12 text-2xl font-bold border-2 border-primary text-primary hover:bg-primary hover:text-white"
            onClick={() => router.push(randomLink)}
          >
            <RotateCcw className="mr-2 h-5 w-5" />
            Play Again
          </Button>
          <SignInButton/>
        </div>
      </main>
    </div>
  )
}

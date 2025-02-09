"use client"

import { useSearchParams, useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import dynamic from "next/dynamic"
import "leaflet/dist/leaflet.css"
import { RotateCcw } from "lucide-react"
import { SignInButton } from "@/components/signin-button"
import { useMemo } from "react"
import L from "leaflet"
import { Popup } from "react-leaflet" // Import Popup from react-leaflet

// Fix the default marker icon issue in Leaflet
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
})

// Dynamically import map components to avoid SSR issues
const MapContainer = dynamic(() => import("react-leaflet").then((mod) => mod.MapContainer), { ssr: false })
const TileLayer = dynamic(() => import("react-leaflet").then((mod) => mod.TileLayer), { ssr: false })
const Marker = dynamic(() => import("react-leaflet").then((mod) => mod.Marker), { ssr: false })
const Polyline = dynamic(() => import("react-leaflet").then((mod) => mod.Polyline), { ssr: false })

const MAX_POSSIBLE_SCORE = 25000 // Maximum possible score for reference

export default function PlayFinishPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const totalScore = Number(searchParams.get("totalScore") || "0")
  const scorePercentage = (totalScore / MAX_POSSIBLE_SCORE) * 100

  // Parse the locations from the URL
  const locations = useMemo(() => {
    const locationsParam = searchParams.get("locations")
    if (!locationsParam) return []
    try {
      return JSON.parse(decodeURIComponent(locationsParam))
    } catch (error) {
      console.error("Error parsing locations:", error)
      return []
    }
  }, [searchParams])

  // Generate a random link with 5 unique random numbers (between 1 and 55)
  const randomLink = useMemo(() => {
    // Create an array of numbers from 1 to 55
    const numbers = Array.from({ length: 55 }, (_, i) => i + 1)

    // Fisher-Yates shuffle with properly scoped variables
    const shuffled = [...numbers]
    for (let i = shuffled.length - 1; i > 0; i--) {
      const randomIndex = Math.floor(Math.random() * (i + 1))
      // Swap elements using destructuring
      ;[shuffled[i], shuffled[randomIndex]] = [shuffled[randomIndex], shuffled[i]]
    }

    // Take the first 5 numbers and join them with a hyphen
    return `/play/${shuffled.slice(0, 5).join("-")}`
  }, [])

  // Calculate the center of all points for the map view
  const mapCenter = useMemo(() => {
    if (locations.length === 0) return [42.3398, -71.0892] // Default center (Boston)
    const lats = locations.flatMap((loc) => [loc.Guess[0], loc.Actual[0]])
    const lngs = locations.flatMap((loc) => [loc.Guess[1], loc.Actual[1]])
    return [lats.reduce((a, b) => a + b, 0) / lats.length, lngs.reduce((a, b) => a + b, 0) / lngs.length]
  }, [locations])

  // Calculate bounds to fit all markers
  const mapBounds = useMemo(() => {
    if (locations.length === 0) return undefined
    const bounds = new L.LatLngBounds([])
    locations.forEach((location) => {
      bounds.extend(location.Guess)
      bounds.extend(location.Actual)
    })
    // Add some padding to the bounds
    return bounds.pad(0.2)
  }, [locations])

  return (
    <div className="h-screen flex flex-col bg-white overflow-hidden">
      <main className="flex-1 container mx-auto px-4 flex flex-col items-center justify-between gap-4 py-4">
        <Card className="w-full shadow-xl">
          <CardContent className="p-0 relative h-[45vh]">
            <MapContainer center={mapCenter} bounds={mapBounds} className="w-full h-full" scrollWheelZoom={false}>
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              />
              {locations.map((location, index) => (
                <div key={index}>
                  {/* Guess marker */}
                  <Marker position={location.Guess}>
                    <Popup>Your guess #{index + 1}</Popup>
                  </Marker>
                  {/* Actual location marker */}
                  <Marker
                    position={location.Actual}
                    icon={
                      new L.Icon({
                        iconUrl:
                          "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png",
                        shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
                        iconSize: [25, 41],
                        iconAnchor: [12, 41],
                        popupAnchor: [1, -34],
                        shadowSize: [41, 41],
                      })
                    }
                  >
                    <Popup>Actual location #{index + 1}</Popup>
                  </Marker>
                  {/* Line connecting guess to actual location */}
                  <Polyline positions={[location.Guess, location.Actual]} color="black" weight={5} dashArray="5,10" />
                </div>
              ))}
            </MapContainer>
          </CardContent>
        </Card>

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
        </div>

        <div className="flex flex-col sm:flex-row gap-4 w-full max-w-2xl">
          <Button
            variant="outline"
            className="flex-1 h-12 text-2xl font-bold border-2 border-primary text-primary hover:bg-primary hover:text-white"
            onClick={() => router.push(randomLink)}
          >
            <RotateCcw className="mr-2 h-5 w-5" />
            Play Again
          </Button>
          <SignInButton />
        </div>
      </main>
    </div>
  )
}

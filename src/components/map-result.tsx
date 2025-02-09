"use client"

import { MapContainer, TileLayer, Marker, Polyline } from "react-leaflet"
import "leaflet/dist/leaflet.css"
import { Icon } from "leaflet" 
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"

interface MapResultProps {
  guessCoords: [number, number]
  actualCoords: [number, number]
  onNextRound: () => void
  round: number
}

// Calculate distance between two points using the Haversine formula
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 3959 // Earth's radius in miles
  const dLat = ((lat2 - lat1) * Math.PI) / 180
  const dLon = ((lon2 - lon1) * Math.PI) / 180
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return Math.round(R * c * 1760)
}

// Calculate points based on distance (max 5000 points at 0 distance)
function calculatePoints(distance: number) {
  if (distance < 12) {
    return 5000
  } else {
    return Math.max(0, Math.round(5000 * (1 - distance / 500)))
  }
}

export default function MapResult({ guessCoords, actualCoords, onNextRound, round }: MapResultProps) {
  const distance = calculateDistance(guessCoords[0], guessCoords[1], actualCoords[0], actualCoords[1])
  const points = calculatePoints(distance)

  const customIcon = new Icon({
    iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
    iconRetinaUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
    shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
  })

  // Compute bounds so both markers are visible
  const latMin = Math.min(guessCoords[0], actualCoords[0])
  const lngMin = Math.min(guessCoords[1], actualCoords[1])
  const latMax = Math.max(guessCoords[0], actualCoords[0])
  const lngMax = Math.max(guessCoords[1], actualCoords[1])
  const bounds: [[number, number], [number, number]] = [
    [latMin, lngMin],
    [latMax, lngMax],
  ]

  return (
    <div className="flex flex-col items-center gap-6 p-4 min-h-screen bg-[#1a1b26] text-white">
      <h1 className="text-4xl font-bold">Round {round}</h1>

      <div className="w-full max-w-4xl h-[400px] rounded-lg overflow-hidden">
        <MapContainer
          bounds={bounds}
          boundsOptions={{ padding: [50, 50] }}
          className="w-full h-full"
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          <Marker position={guessCoords} icon={customIcon} />
          <Marker position={actualCoords} icon={customIcon} />
          <Polyline positions={[guessCoords, actualCoords]} dashArray={[10, 10]} color="#000000" />
        </MapContainer>
      </div>

      <div className="text-3xl font-bold text-red-500">{points} points</div>

      <div className="w-full max-w-2xl">
        <Progress value={(points / 5000) * 100} className="h-2 bg-red-200" />
      </div>

      <div className="text-lg italic text-gray-300">
        Your guess was <span className="font-bold">{distance} yards</span> from the correct location.
          </div>
          <Button
      onClick={onNextRound}
      className="mt-4 px-8 py-6 text-xl bg-red-500 hover:bg-red-600 text-white rounded-full font-bold shadow-lg transition-transform hover:scale-105"
    >
      {round === 5 ? "VIEW RESULTS" : "START NEXT ROUND"}
    </Button>

    </div>
  )
}

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
  timeout: boolean
  notes: string
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
function calculatePoints(distance: number, timeout: boolean) {
  if (timeout) {
    return 0
  }
  if (distance < 12) {
    return 5000
  } else {
    return Math.max(0, Math.round(5000 * (1 - distance / 500)))
  }
}

export default function MapResult({ guessCoords, actualCoords, onNextRound, round, timeout, notes }: MapResultProps) {
  const distance = calculateDistance(guessCoords[0], guessCoords[1], actualCoords[0], actualCoords[1])
  const points = calculatePoints(distance, timeout)

  const customIcon = new Icon({
    iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
    iconRetinaUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
    shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
  })

  const flagIcon = new Icon({
    iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png",
    iconRetinaUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png",
    shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
  });

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
    <div className="flex flex-col items-center justify-between py-4 h-screen bg-[#1a1b26] text-white">
      <h1 className="text-4xl font-bold">Round {round}</h1>

      {/* Map and Fun Fact Container */}
      <div className="w-full h-[65vh] py-3 flex flex-row gap-4">
        {/* Left Spacer for Balance */}
        <div className="w-[250px]"></div>

        {/* Map Container */}
        <div className="flex-1 flex justify-center items-center h-full rounded-lg overflow-hidden">
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
            <Marker position={actualCoords} icon={flagIcon} />
            <Polyline positions={[guessCoords, actualCoords]} dashArray={[10, 10]} color="#000000" weight={5} />
          </MapContainer>
        </div>
  {/* Fun Fact Container - Properly Adjusting to Content */}
  {notes && (
    <div className="w-fit max-w-[250px] max-h-[200px] bg-white rounded-lg p-3 shadow-lg flex flex-col items-start overflow-y-auto">
      <h2 className="text-lg font-bold text-gray-800 mb-1">📌 Fun Fact</h2>
      <p className="text-black text-md whitespace-pre-wrap leading-tight">{notes}</p>
    </div>
)}




      </div>

      {/* Score and Progress Bar */}
      <div className="flex flex-col items-center w-full py-6">
        <div className="text-3xl font-bold text-red-500">{points} points</div>
        <div className="w-full max-w-2xl py-2">
          <Progress value={(points / 5000) * 100} className="h-2 bg-red-200" />
        </div>
        <div className="text-lg italic text-gray-300">
          {timeout ? (
            "Time's up!"
          ) : (
            <>
              Your guess was <span className="font-bold">{distance} yards</span> from the correct location.
            </>
          )}
        </div>
      </div>

      {/* Next Round Button */}
      <Button
        onClick={onNextRound}
        className="mt-2 px-8 py-6 text-lg bg-red-500 hover:bg-red-600 text-white rounded-full font-bold shadow-lg transition-transform hover:scale-105"
      >
        {round === 5 ? "VIEW RESULTS" : "START NEXT ROUND"}
      </Button>
    </div>
  )
}

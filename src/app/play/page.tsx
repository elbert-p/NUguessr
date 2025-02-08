"use client"

import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"
import '@fontsource/titillium-web'
import dynamic from "next/dynamic"
import "leaflet/dist/leaflet.css"
import { useState } from "react"

// Dynamically import the map component to avoid SSR issues
const MapContainer = dynamic(() => import("react-leaflet").then(mod => mod.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import("react-leaflet").then(mod => mod.TileLayer), { ssr: false });
const Marker = dynamic(() => import("react-leaflet").then(mod => mod.Marker), { ssr: false });
const Popup = dynamic(() => import("react-leaflet").then(mod => mod.Popup), { ssr: false });

export default function PlayPage() {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <Link href="/" className="w-full bg-[#D41B2C] p-4 text-center shadow-md">
        <h1 className="text-4xl font-bold text-white">NUGuessr</h1>
      </Link>

      {/* Main content - 80vh */}
      <main className="h-[80vh] flex items-center justify-center p-4 relative">
        <Card className="w-full h-full max-w-[95%] flex flex-col shadow-xl">
          <CardContent className="flex-1 flex flex-col p-4">
            <div className="flex-1 relative w-full">
              <Image
                src="/images/IMG_4471.jpeg"
                alt="Campus location"
                fill
                className="object-contain rounded-lg"
                priority
              />
            </div>
          </CardContent>
        </Card>

        {/* Interactive Map overlay with hover effect */}
        <div 
          className={`absolute bottom-8 right-8 rounded-lg overflow-hidden shadow-xl border border-gray-200 transition-all duration-300 ${isExpanded ? 'w-[50%] h-[50vh]' : 'w-[200px] h-[150px]'}`}
          onMouseEnter={() => setIsExpanded(true)}
          onMouseLeave={() => setIsExpanded(false)}
        >
          <MapContainer center={[42.3398, -71.0892]} zoom={16} className="w-full h-full">
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution="&copy; <a href='https://www.openstreetmap.org/copyright'>OpenStreetMap</a> contributors"
            />
            <Marker position={[42.3398, -71.0892]}>
              <Popup>Northeastern University</Popup>
            </Marker>
          </MapContainer>
        </div>

        {/* Guess Button */}
        <button className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-[#D41B2C] text-white px-6 py-2 rounded-lg shadow-md hover:bg-[#b31724] transition">Guess</button>
      </main>

      {/* Footer - 10vh */}
      <footer className="h-[10vh] bg-[#D41B2C] text-white flex items-center">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center">
            <div className="text-sm">
              <p className="font-semibold">© 2023 NUGuessr</p>
            </div>
            <div className="flex space-x-4 text-sm">
              <Link href="/about" className="hover:underline">About</Link>
              <Link href="/privacy" className="hover:underline">Privacy</Link>
              <Link href="/contact" className="hover:underline">Contact</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

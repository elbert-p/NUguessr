"use client"

import L from "leaflet"
// Fix the default marker icon issue in Leaflet:
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
})

import { useState, useEffect, useRef, useMemo } from "react"
import dynamic from "next/dynamic"
import Image from "next/image"
import "@fontsource/titillium-web"
import "leaflet/dist/leaflet.css"
import { createClient } from "@/lib/supabase/client"
import MapResult from "./../../../components/map-result" // adjust path as needed
import exifr from "exifr" // EXIF extraction library
import { useParams } from "next/navigation"
import { useSearchParams, useRouter } from "next/navigation";

// ---------------------
// Supabase & Image Helpers
// ---------------------
const SUPABASE_PROJECT_ID = process.env.NEXT_PUBLIC_SUPABASE_URL
const SUPABASE_STORAGE_BUCKET = "images"

const getSupabaseImageUrl = (path: string) => {
  if (!path) return "/placeholder.svg"
  if (!SUPABASE_PROJECT_ID) {
    console.error("Supabase URL is missing!")
    return "/placeholder.svg"
  }
  const baseUrl = SUPABASE_PROJECT_ID.replace(/\/$/, "") // remove trailing slash if any
  return `${baseUrl}/storage/v1/object/public/${SUPABASE_STORAGE_BUCKET}/${path}`
}



// ---------------------
// Dynamically import Leaflet components to avoid SSR issues
// ---------------------
const MapContainer = dynamic(
  () => import("react-leaflet").then((mod) => mod.MapContainer),
  { ssr: false }
)
const TileLayer = dynamic(
  () => import("react-leaflet").then((mod) => mod.TileLayer),
  { ssr: false }
)
const Marker = dynamic(
  () => import("react-leaflet").then((mod) => mod.Marker),
  { ssr: false }
)
const Popup = dynamic(
  () => import("react-leaflet").then((mod) => mod.Popup),
  { ssr: false }
)

import { useMap, useMapEvent } from "react-leaflet"

// ---------------------
// Helper Components for the Map
// ---------------------

// This component ensures that the Leaflet map properly resizes when the container dimensions change.
function MapResizeHandler({ trigger }: { trigger: boolean }) {
  const map = useMap()
  useEffect(() => {
    setTimeout(() => {
      map.invalidateSize()
    }, 300) // allow time for CSS transition to complete
  }, [trigger, map])
  return null
}

// This component listens for map clicks and updates the marker position.
function MapClickHandler({
  setMarkerPosition,
}: {
  setMarkerPosition: (latlng: L.LatLng) => void
}) {
  useMapEvent("click", (e) => {
    setMarkerPosition(e.latlng)
  })
  return null
}

// ---------------------
// Main PlayPage Component
// ---------------------

export default function PlayPage() {
  // IMPORTANT: The dynamic segment key here must match your folder name.
  // For example, if your file is at `/app/play/[id]/page.tsx`, then use "id" below.
  // If it's named [ids], then you must use:
  // const { ids } = useParams();
  const router = useRouter();

  const params = useParams()
  console.log("Route params:", params)

  const id = params?.hash
  console.log("Dynamic parameter id:", id)

  // Parse the id string into an array of numbers.
  const idArray: number[] = useMemo(() => {
    if (!id) return []
    console.log("Raw id:", id)
    const arr = id.split("-").map((idStr) => Number.parseInt(idStr, 10))
    console.log("Parsed idArray:", arr)
    return arr
  }, [id])

  // State variables for managing images, current image index, marker position, EXIF data, and view state.
  const [images, setImages] = useState<any[]>([])
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [markerPosition, setMarkerPosition] = useState<L.LatLng | null>(null)
  const [showResult, setShowResult] = useState(false)
  const [exifCoords, setExifCoords] = useState<[number, number] | null>(null)
  const [exifLoading, setExifLoading] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)

  // Create a ref for the map container element.
  const mapContainerRef = useRef<HTMLDivElement>(null)

  // Collapse the map if the user clicks outside the map container.
  useEffect(() => {
    function handleMouseDown(event: MouseEvent) {
      if (
        mapContainerRef.current &&
        !mapContainerRef.current.contains(event.target as Node)
      ) {
        setIsExpanded(false)
      }
    }
    document.addEventListener("mousedown", handleMouseDown)
    return () => {
      document.removeEventListener("mousedown", handleMouseDown)
    }
  }, [])

  // Fetch images from Supabase using the ids provided in the URL.
  useEffect(() => {
    async function fetchImages() {
      if (idArray.length === 0) return
      const supabaseClient = createClient()
      const { data, error } = await supabaseClient
        .from("places")
        .select("*")
        .in("id", idArray)
      console.log("ID Array used for query:", idArray)
      if (error) {
        console.error("Error fetching images:", error)
      } else if (data) {
        // Sort the images in the order provided by the URL
        data.sort(
          (a: any, b: any) => idArray.indexOf(a.id) - idArray.indexOf(b.id)
        )
        console.log("Fetched images:", data)
        setImages(data)
      }
    }
    fetchImages()
  }, [idArray])

  // When images are loaded, start with the first one.
  useEffect(() => {
    if (images.length > 0) {
      setCurrentImageIndex(0)
    }
  }, [images])

  // Extract EXIF data (specifically, the GPS coordinates) from the current image.
  useEffect(() => {
    async function extractExif() {
      if (images.length > 0) {
        setExifLoading(true)
        const image = images[currentImageIndex]
        const imageUrl = getSupabaseImageUrl(image.image_url)
        try {
          // exifr.gps returns an object with latitude and longitude (if available).
          const gpsData = await exifr.gps(imageUrl)
          if (gpsData && gpsData.latitude && gpsData.longitude) {
            setExifCoords([gpsData.latitude, gpsData.longitude])
          } else {
            console.warn("No GPS data found in EXIF for image:", imageUrl)
            setExifCoords(null)
          }
        } catch (err) {
          console.error("Error extracting EXIF data:", err)
          setExifCoords(null)
        }
        setExifLoading(false)
      }
    }
    extractExif()
  }, [images, currentImageIndex])

  // Handler for when the user clicks the "Guess" button.
  const handleGuess = () => {
    if (markerPosition && exifCoords) {
      setIsExpanded(false) // Collapse the map
      setShowResult(true)
    }
  }

  // Handler for moving to the next round.
  const handleNextRound = () => {
    if (currentImageIndex < images.length - 1) {
      setCurrentImageIndex((prevIndex) => prevIndex + 1)
      setMarkerPosition(null)
      setShowResult(false)
    } else {

      // All rounds completed. You can add any completion logic here.
      console.log("Game completed!")
      router.push("/play-finish")
    }
  }

  // If the user has made a guess and the current image's EXIF data is available,
  // render the MapResult component.
  if (showResult && markerPosition && exifCoords) {
    const guessCoords = [markerPosition.lat, markerPosition.lng]
    return (
      <MapResult
        guessCoords={guessCoords}
        actualCoords={exifCoords}
        onNextRound={handleNextRound}
        round={currentImageIndex + 1}
      />
    )
  }

  // Determine whether the Guess button should be enabled.
  const canGuess =
    isExpanded && markerPosition && !exifLoading && exifCoords !== null

  return (
    <div className="min-h-screen flex flex-col bg-[#1a1b26]">
      <main className="h-screen relative">
        {/* Round Indicator (Top Right) */}
        {images.length > 0 && (
          <div className="absolute top-4 right-4 z-50 bg-[#E50000] text-white px-4 py-2 rounded-lg shadow-md">
            Round {currentImageIndex + 1} / {images.length}
          </div>
        )}

        {/* Main Content */}
        {images.length > 0 ? (
          // Display the current image
          <div className="relative w-full h-screen">
            <Image
              src={
                getSupabaseImageUrl(images[currentImageIndex].image_url) ||
                "/placeholder.svg"
              }
              alt="Campus location"
              fill
              unoptimized
              className="object-contain"
              priority
            />
          </div>
        ) : (
          <p className="text-white">Loading images...</p>
        )}

        {/* Map & Guess Button Container */}
        <div
          ref={mapContainerRef}
          className={`fixed bottom-8 right-8 rounded-lg overflow-hidden shadow-xl border border-gray-200 transition-all duration-300 ${
            isExpanded ? "w-[50%] h-[50vh]" : "w-[200px] h-[150px]"
          }`}
          onMouseEnter={() => setIsExpanded(true)}
        >
          <div className="flex flex-col h-full">
            {/* Map */}
            <div className="flex-1 relative">
              <MapContainer
                center={[42.3398, -71.0892]}
                zoom={16}
                className="w-full h-full"
              >
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution="&copy; <a href='https://www.openstreetmap.org/copyright'>OpenStreetMap</a> contributors"
                />
                <MapClickHandler setMarkerPosition={setMarkerPosition} />
                {markerPosition && (
                  <Marker position={markerPosition}>
                    <Popup>
                      Pin dropped at: {markerPosition.lat.toFixed(4)},{" "}
                      {markerPosition.lng.toFixed(4)}
                    </Popup>
                  </Marker>
                )}
                <MapResizeHandler trigger={isExpanded} />
              </MapContainer>
            </div>
            {/* Guess Button */}
            <button
              onClick={handleGuess}
              disabled={!canGuess}
              className={`w-full px-6 py-2 rounded-lg shadow-md transition ${
                canGuess
                  ? "bg-[#D41B2C] text-white hover:bg-[#b31724] cursor-pointer"
                  : "bg-gray-400 text-gray-700 cursor-not-allowed"
              }`}
            >
              {exifLoading ? "Loading EXIF..." : "Guess"}
            </button>
          </div>
        </div>
      </main>
    </div>
  )
}

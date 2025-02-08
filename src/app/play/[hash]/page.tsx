"use client";

import { useState, useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import '@fontsource/titillium-web';
import "leaflet/dist/leaflet.css";
import { createClient } from "@/lib/supabase/client";
import MapResult from "./../../../components/map-result"; // adjust path as needed
import exifr from "exifr"; // EXIF extraction library

// ---------------------
// Supabase & Image Helpers
// ---------------------
const SUPABASE_PROJECT_ID = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_STORAGE_BUCKET = "images";

const getSupabaseImageUrl = (path) => {
  if (!path) return "/placeholder.svg";
  if (!SUPABASE_PROJECT_ID) {
    console.error("Supabase URL is missing!");
    return "/placeholder.svg";
  }
  const baseUrl = SUPABASE_PROJECT_ID.replace(/\/$/, ""); // remove trailing slash if any
  return `${baseUrl}/storage/v1/object/public/${SUPABASE_STORAGE_BUCKET}/${path}`;
};

// ---------------------
// Dynamically import Leaflet components to avoid SSR issues
// ---------------------
const MapContainer = dynamic(
  () => import("react-leaflet").then((mod) => mod.MapContainer),
  { ssr: false }
);
const TileLayer = dynamic(
  () => import("react-leaflet").then((mod) => mod.TileLayer),
  { ssr: false }
);
const Marker = dynamic(
  () => import("react-leaflet").then((mod) => mod.Marker),
  { ssr: false }
);
const Popup = dynamic(
  () => import("react-leaflet").then((mod) => mod.Popup),
  { ssr: false }
);

import { useMap, useMapEvent } from "react-leaflet";

// ---------------------
// Helper Components for the Map
// ---------------------

// This component ensures that the Leaflet map properly resizes when the container dimensions change.
function MapResizeHandler({ trigger }) {
  const map = useMap();
  useEffect(() => {
    setTimeout(() => {
      map.invalidateSize();
    }, 300); // allow time for CSS transition to complete
  }, [trigger, map]);
  return null;
}

// This component listens for map clicks and updates the marker position.
function MapClickHandler({ setMarkerPosition }) {
  useMapEvent("click", (e) => {
    setMarkerPosition(e.latlng);
  });
  return null;
}

// ---------------------
// Main PlayPage Component
// ---------------------

export default function PlayPage() {
  // State variables for managing images, current image index, marker position, EXIF data, and view state.
  const [isExpanded, setIsExpanded] = useState(false);
  const [images, setImages] = useState([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [markerPosition, setMarkerPosition] = useState(null);
  const [showResult, setShowResult] = useState(false);

  // States for EXIF extraction:
  // exifCoords will hold [latitude, longitude] once extracted (or remain null on failure)
  // exifLoading indicates that EXIF data is being fetched.
  const [exifCoords, setExifCoords] = useState(null);
  const [exifLoading, setExifLoading] = useState(false);

  // Create a ref for the map container element.
  const mapContainerRef = useRef(null);

  // Collapse the map if the user clicks outside the map container.
  useEffect(() => {
    function handleMouseDown(event) {
      if (mapContainerRef.current && !mapContainerRef.current.contains(event.target)) {
        setIsExpanded(false);
      }
    }
    document.addEventListener("mousedown", handleMouseDown);
    return () => {
      document.removeEventListener("mousedown", handleMouseDown);
    };
  }, []);

  // Fetch images from Supabase.
  useEffect(() => {
    async function fetchImages() {
      const supabaseClient = createClient();
      const { data, error } = await supabaseClient.from("places").select("*");
      if (error) {
        console.error("Error fetching images:", error);
      } else {
        setImages(data);
      }
    }
    fetchImages();
  }, []);

  // When images are loaded, start with the first one.
  useEffect(() => {
    if (images.length > 0) {
      setCurrentImageIndex(0);
    }
  }, [images]);

  // Extract EXIF data (specifically, the GPS coordinates) from the current image.
  useEffect(() => {
    async function extractExif() {
      if (images.length > 0) {
        setExifLoading(true);
        const image = images[currentImageIndex];
        const imageUrl = getSupabaseImageUrl(image.image_url);
        try {
          // exifr.gps returns an object with latitude and longitude (if available).
          const gpsData = await exifr.gps(imageUrl);
          if (gpsData && gpsData.latitude && gpsData.longitude) {
            setExifCoords([gpsData.latitude, gpsData.longitude]);
          } else {
            console.warn("No GPS data found in EXIF for image:", imageUrl);
            setExifCoords(null);
          }
        } catch (err) {
          console.error("Error extracting EXIF data:", err);
          setExifCoords(null);
        }
        setExifLoading(false);
      }
    }
    extractExif();
  }, [images, currentImageIndex]);

  // Handler for when the user clicks the "Guess" button.
  const handleGuess = () => {
    // Proceed only if a marker is placed and EXIF data is available.
    if (markerPosition && exifCoords) {
      setIsExpanded(false); // Collapse the map
      setShowResult(true);
    }
  };

  // Handler for moving to the next round.
  const handleNextRound = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    setMarkerPosition(null);
    setShowResult(false);
    // (EXIF extraction for the new image will run via useEffect)
  };

  // If the user has made a guess (and a marker has been set) and the current image's EXIF data is available,
  // render the MapResult component.
  if (showResult && markerPosition && exifCoords) {
    const guessCoords = [markerPosition.lat, markerPosition.lng];
    // exifCoords holds the actual coordinates extracted from the image.
    return (
      <MapResult
        guessCoords={guessCoords}
        actualCoords={exifCoords}
        onNextRound={handleNextRound}
        round={currentImageIndex + 1}
      />
    );
  }

  // Determine whether the Guess button should be enabled:
  // It is enabled when the map is expanded, a marker is placed, EXIF extraction is complete,
  // and valid EXIF coordinates are available.
  const canGuess = isExpanded && markerPosition && !exifLoading && exifCoords !== null;

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Main Content */}
      <main className="h-[80vh] grid place-items-center p-10 relative">
        {images.length > 0 ? (
          // Display the current image inside a card.
          <Card className="w-full shadow-xl">
            <CardContent className="p-10">
              <div className="relative w-full h-[70vh]">
                <Image
                  src={getSupabaseImageUrl(images[currentImageIndex].image_url)}
                  alt="Campus location"
                  fill
                  unoptimized
                  className="object-contain rounded-lg"
                  priority
                />
              </div>
            </CardContent>
          </Card>
        ) : (
          <p>Loading images...</p>
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
                {/* Handle map clicks */}
                <MapClickHandler setMarkerPosition={setMarkerPosition} />
                {/* Render marker if one exists */}
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
  );
}
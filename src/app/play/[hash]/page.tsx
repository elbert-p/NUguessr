"use client";

import { useState, useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import '@fontsource/titillium-web';
import "leaflet/dist/leaflet.css";
import { createClient } from "@/lib/supabase/client";

// Define your Supabase project details and helper function
const SUPABASE_PROJECT_ID = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_STORAGE_BUCKET = "images";

const getSupabaseImageUrl = (path) => {
  if (!path) return "/placeholder.svg";
  if (!SUPABASE_PROJECT_ID) {
    console.error("Supabase URL is missing!");
    return "/placeholder.svg";
  }
  const baseUrl = SUPABASE_PROJECT_ID.replace(/\/$/, ""); // Remove trailing slash if any
  return `${baseUrl}/storage/v1/object/public/${SUPABASE_STORAGE_BUCKET}/${path}`;
};

// Dynamically import map components to avoid SSR issues
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

// Helper component to invalidate the Leaflet map size after a container resize.
function MapResizeHandler({ trigger }) {
  const map = useMap();
  useEffect(() => {
    setTimeout(() => {
      map.invalidateSize();
    }, 300); // Delay to allow CSS transition to finish
  }, [trigger, map]);
  return null;
}

// Component to handle map clicks and update the marker position
function MapClickHandler({ setMarkerPosition }) {
  useMapEvent("click", (e) => {
    setMarkerPosition(e.latlng);
  });
  return null;
}

export default function PlayPage() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [images, setImages] = useState([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [markerPosition, setMarkerPosition] = useState(null);

  // Create a ref for the map container element
  const mapContainerRef = useRef(null);

  // Global mousedown listener to collapse the map when clicking outside
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

  // Fetch images from Supabase using your client
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

  // Optional: Reset currentImageIndex when new images load
  useEffect(() => {
    if (images.length > 0) {
      setCurrentImageIndex(0);
    }
  }, [images]);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Main Content */}
      <main className="h-[80vh] grid place-items-center p-10 relative">
        {images.length > 0 ? (
          // Display the current image inside a card
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
                {/* Render marker if a position is available */}
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
            {/* Guess Button now includes the next image functionality */}
            <button
              className={`w-full px-6 py-2 rounded-lg shadow-md transition ${
                isExpanded
                  ? "bg-[#D41B2C] text-white hover:bg-[#b31724]"
                  : "bg-gray-400 text-gray-700 cursor-not-allowed"
              }`}
              onClick={() => {
                if (images.length > 0) {
                  setCurrentImageIndex(
                    (prevIndex) => (prevIndex + 1) % images.length
                  );
                }
              }}
            >
              Guess
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}

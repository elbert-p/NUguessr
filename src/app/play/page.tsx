"use client"

import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"
import '@fontsource/titillium-web'

export default function PlayPage() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <Link
      href = "/"
        className="w-full bg-[#D41B2C] p-4 text-center shadow-md">
        <h1 className="text-4xl font-bold text-white">
          NUGuessr
        </h1>

      </Link>

      {/* Main content */}
      <main className="flex-grow flex flex-col items-center justify-center p-8 w-full">
        <Card className="w-full max-w-7xl shadow-xl">
          <CardContent className="p-16">
            <h2
              className="text-5xl font-bold mb-12 text-center text-[#D41B2C]"
            >
              Guess the Location!
            </h2>
            <div className="relative w-full">
              <div className="aspect-[16/9] relative rounded-lg overflow-hidden">
                <Image
                  src="/placeholder.svg?height=1080&width=1920"
                  alt="Campus location"
                  width={1920}
                  height={1080}
                  className="object-cover w-full h-full"
                  priority
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Map overlay */}
        <div className="fixed bottom-[calc(4rem+50px)] right-1 w-150 h-80 rounded-lg overflow-hidden shadow-xl border border-gray-200">
          <div className="relative w-full h-full">
            <Image
              src="/placeholder.svg?height=512&width=512"
              alt="Map"
              width={512}
              height={512}
              className="object-cover w-full h-full"
            />
            <div className="absolute inset-0 flex items-center justify-center bg-black/50">
              <span className="text-xl font-semibold text-white">
                Campus Map
              </span>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full bg-[#D41B2C] text-white p-4">
        <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
          <div className="text-center md:text-left mb-4 md:mb-0">
            <p className="font-semibold">
              © 2023 NUGuessr
            </p>
            <p className="text-sm">A Northeastern University GeoGuessr-style game</p>
          </div>
          <div className="flex space-x-4">
            <Link href="/about" className="hover:underline">
              About
            </Link>
            <Link href="/privacy" className="hover:underline">
              Privacy
            </Link>
            <Link href="/contact" className="hover:underline">
              Contact
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}

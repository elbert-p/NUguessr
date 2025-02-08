"use client"

import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"

export default function PlayPage() {
  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Header - 10vh */}
      <header className="h-[10vh] flex items-center justify-center bg-[#D41B2C] shadow-md">
        <h1 className="text-3xl font-bold text-white">NUGuessr</h1>
      </header>

      {/* Main content - 80vh */}
      <main className="h-[80vh] flex items-center justify-center p-4 relative">
        <Card className="w-full h-full max-w-[95%] flex flex-col shadow-xl">
          <CardContent className="flex-1 flex flex-col p-4">
            <h2 className="text-3xl font-bold mb-2 text-center text-[#D41B2C]">Guess the Location!</h2>
            <div className="flex-1 relative w-full">
              <Image
                src="/placeholder.svg?height=1080&width=1920"
                alt="Campus location"
                fill
                className="object-contain rounded-lg"
                priority
              />
            </div>
          </CardContent>
        </Card>

        {/* Map overlay */}
        <div className="absolute bottom-8 right-8 w-[200px] h-[150px] rounded-lg overflow-hidden shadow-xl border border-gray-200">
          <div className="relative w-full h-full">
            <Image src="/placeholder.svg?height=512&width=512" alt="Map" fill className="object-cover" />
            <div className="absolute inset-0 flex items-center justify-center bg-black/50">
              <span className="text-lg font-semibold text-white">Campus Map</span>
            </div>
          </div>
        </div>
      </main>

      {/* Footer - 10vh */}
      <footer className="h-[10vh] bg-[#D41B2C] text-white flex items-center">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center">
            <div className="text-sm">
              <p className="font-semibold">© 2023 NUGuessr</p>
            </div>
            <div className="flex space-x-4 text-sm">
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
        </div>
      </footer>
    </div>
  )
}

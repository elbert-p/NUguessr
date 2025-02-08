import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import "@fontsource/open-sans"

export default function HomePage() {
  return (
    <div
      className="min-h-screen w-full flex flex-col items-center bg-no-repeat bg-fixed"
      style={{
      backgroundImage:
        "url('/background.jpg')",
      backgroundSize: "cover",
      backgroundPosition: "center",
      }}
    >
      <div className="w-full flex flex-col items-center pt-4 md:pt-8">
        <Image src="/logo.png" alt="NUGuessr Logo" width={300} height={500} className="mx-auto" priority />
      </div>

      <main className="text-center z-10 relative px-6 py-8 w-full max-w-4xl mx-auto mt-4 bg-gray-800/60 rounded-xl backdrop-blur-[2px]">
        <div className="space-y-4 mb-12">
          <p className="schedule-title text-5xl font-[Open_Sans] text-white" style={{ textShadow: "0 2px 4px rgba(0,0,0,0.5)" }}>
            Think you know your school well?
          </p>
          <p className="text-4xl schedule-title text-white schedule-title" style={{ textShadow: "0 2px 4px rgba(0,0,0,0.5)" }}>
            Want to familiarize yourself with the campus?
          </p>
        </div>
        <Button className="mb-8 bg-red-600 hover:bg-red-700 text-white font-bold py-4 px-10 rounded-full text-xl shadow-lg transition-all hover:scale-105">
          Sign up to play now!
        </Button>
        <div>
          <Link
            href="/play"
            className="text-white text-xl font-semibold transition-colors hover:text-red-100"
            style={{ textShadow: "0 2px 4px rgba(0,0,0,0.5)" }}
          >
            Continue as a guest
          </Link>
        </div>
      </main>
    </div>
  )
}


